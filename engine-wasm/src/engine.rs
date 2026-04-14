use std::collections::{HashMap, HashSet};

use crate::clock::ClockManager;
use crate::gates::{evaluate_component, evaluate_gate};
use crate::graph::{
    build_adjacency_list, build_connection_index, find_downstream, sort_subset, topological_sort,
};
use crate::ic::evaluate_ic;
use crate::types::{
    CircuitNodeData, ComponentType, Connection, EngineState, InternalNode, Signal,
};

const MAX_PASSES: usize = 50;

pub struct SimulationEngine {
    nodes: HashMap<String, InternalNode>,
    connections: Vec<Connection>,
    connection_index: HashMap<String, Vec<usize>>, // target_node_id -> connection indices
    adjacency: HashMap<String, HashSet<String>>,
    evaluation_order: Vec<String>,
    graph_dirty: bool,
    live_mode: bool,
    evaluation_count: u64,
    last_evaluation_time_us: f64,
    pub clock_manager: ClockManager,
    // IC sub-engines stored separately to avoid borrow conflicts
    ic_engines: HashMap<String, SimulationEngine>,
}

impl SimulationEngine {
    pub fn new() -> Self {
        SimulationEngine {
            nodes: HashMap::new(),
            connections: Vec::new(),
            connection_index: HashMap::new(),
            adjacency: HashMap::new(),
            evaluation_order: Vec::new(),
            graph_dirty: true,
            live_mode: true,
            evaluation_count: 0,
            last_evaluation_time_us: 0.0,
            clock_manager: ClockManager::new(),
            ic_engines: HashMap::new(),
        }
    }

    // ── Node Management ──────────────────────────────────────

    pub fn add_node_internal(&mut self, data: &CircuitNodeData) {
        let node = InternalNode::from_data(data);
        if data.component_type == ComponentType::Clock {
            self.clock_manager.register(&data.id);
        }
        self.nodes.insert(data.id.clone(), node);
        self.graph_dirty = true;
    }

    pub fn add_node(&mut self, data: &CircuitNodeData) {
        self.add_node_internal(data);
        if self.live_mode {
            self.rebuild_graph_if_dirty();
            self.propagate_from_node(&data.id);
        }
    }

    pub fn remove_node(&mut self, node_id: &str) {
        self.nodes.remove(node_id);
        self.ic_engines.remove(node_id);
        self.clock_manager.remove(node_id);
        // Remove all connections involving this node
        self.connections.retain(|c| {
            c.source_node_id != node_id && c.target_node_id != node_id
        });
        self.graph_dirty = true;
        if self.live_mode {
            self.rebuild_graph_if_dirty();
        }
    }

    pub fn update_node_properties(
        &mut self,
        node_id: &str,
        properties: HashMap<String, serde_json::Value>,
    ) {
        if let Some(node) = self.nodes.get_mut(node_id) {
            for (k, v) in properties {
                node.properties.insert(k, v);
            }
        }
    }

    pub fn add_input_pin(&mut self, node_id: &str, pin_id: &str) {
        if let Some(node) = self.nodes.get_mut(node_id) {
            node.input_pin_ids.push(pin_id.to_string());
            node.inputs.insert(pin_id.to_string(), Signal::Unknown);
        }
    }

    pub fn remove_input_pin(&mut self, node_id: &str, pin_id: &str) {
        if let Some(node) = self.nodes.get_mut(node_id) {
            node.input_pin_ids.retain(|p| p != pin_id);
            node.inputs.remove(pin_id);
            // Remove connections to this pin
            self.connections.retain(|c| {
                !(c.target_node_id == node_id && c.target_pin_id == pin_id)
            });
            self.graph_dirty = true;
        }
    }

    // ── Connection Management ────────────────────────────────

    pub fn add_connection_internal(&mut self, connection: Connection) {
        self.connections.push(connection);
        self.graph_dirty = true;
    }

    pub fn add_connection(&mut self, connection: Connection) {
        let source_id = connection.source_node_id.clone();
        self.add_connection_internal(connection);
        if self.live_mode {
            self.rebuild_graph_if_dirty();
            self.propagate_from_node(&source_id);
        }
    }

    pub fn remove_connection(&mut self, connection_id: &str) {
        self.connections.retain(|c| c.id != connection_id);
        self.graph_dirty = true;
        if self.live_mode {
            self.rebuild_graph_if_dirty();
        }
    }

    // ── Input Control ────────────────────────────────────────

    pub fn set_input_value(&mut self, node_id: &str, value: u8) {
        if let Some(node) = self.nodes.get_mut(node_id) {
            let signal = Signal::from_bit(value);
            node.properties
                .insert("value".to_string(), serde_json::Value::from(value as u64));
            node.outputs.insert("out".to_string(), signal);
        }
        if self.live_mode {
            self.propagate_from_node(node_id);
        }
    }

    /// Called from JS when a clock ticks.
    pub fn set_clock_value(&mut self, node_id: &str, value: u8) {
        let signal = Signal::from_bit(value);
        self.clock_manager.set_state(node_id, signal);
        if let Some(node) = self.nodes.get_mut(node_id) {
            node.properties
                .insert("value".to_string(), serde_json::Value::from(value as u64));
            node.outputs.insert("out".to_string(), signal);
        }
        if self.live_mode {
            self.propagate_from_node(node_id);
        }
    }

    // ── Data Access ──────────────────────────────────────────

    pub fn get_node_outputs(&self, node_id: &str) -> Option<&HashMap<String, Signal>> {
        self.nodes.get(node_id).map(|n| &n.outputs)
    }

    pub fn get_node_inputs(&self, node_id: &str) -> Option<&HashMap<String, Signal>> {
        self.nodes.get(node_id).map(|n| &n.inputs)
    }

    pub fn get_node(&self, node_id: &str) -> Option<&InternalNode> {
        self.nodes.get(node_id)
    }

    pub fn get_node_mut(&mut self, node_id: &str) -> Option<&mut InternalNode> {
        self.nodes.get_mut(node_id)
    }

    /// Bulk signal read: returns all node signals as a HashMap<node_id, HashMap<pin_id, signal>>
    pub fn get_all_signals(&self) -> HashMap<String, (HashMap<String, Signal>, HashMap<String, Signal>)> {
        let mut result = HashMap::new();
        for (id, node) in &self.nodes {
            result.insert(
                id.clone(),
                (node.inputs.clone(), node.outputs.clone()),
            );
        }
        result
    }

    // ── Simulation Control ───────────────────────────────────

    pub fn set_live_mode(&mut self, enabled: bool) {
        self.live_mode = enabled;
        if enabled {
            self.recompute_all();
        }
    }

    pub fn recompute_all(&mut self) {
        self.graph_dirty = true;
        self.evaluate_all();
    }

    pub fn recompute_subgraph(&mut self, node_id: &str) {
        self.rebuild_graph_if_dirty();
        self.propagate_from_node(node_id);
    }

    pub fn evaluate(&mut self) {
        if self.live_mode {
            self.evaluate_all();
        }
    }

    pub fn evaluate_all(&mut self) {
        self.rebuild_graph_if_dirty();

        let start = instant_now();
        let mut passes = 0;
        let mut changed = true;

        while changed && passes < MAX_PASSES {
            changed = false;
            passes += 1;

            let order = self.evaluation_order.clone();
            for node_id in &order {
                if self.evaluate_node(node_id) {
                    changed = true;
                }
            }
        }

        self.evaluation_count += passes as u64;
        self.last_evaluation_time_us = elapsed_us(start);
    }

    /// Single-step evaluation: evaluate nodes in order, return first changed node.
    pub fn step(&mut self) -> Option<String> {
        self.rebuild_graph_if_dirty();

        let order = self.evaluation_order.clone();
        for node_id in &order {
            if self.evaluate_node(node_id) {
                self.evaluation_count += 1;
                return Some(node_id.clone());
            }
        }
        None
    }

    pub fn reset(&mut self) {
        for node in self.nodes.values_mut() {
            for pin_id in &node.input_pin_ids {
                node.inputs.insert(pin_id.clone(), Signal::Unknown);
            }
            for pin_id in &node.output_pin_ids {
                node.outputs.insert(pin_id.clone(), Signal::Unknown);
            }

            if node.component_type == ComponentType::Input {
                node.properties
                    .insert("value".to_string(), serde_json::Value::from(0u64));
                node.outputs.insert("out".to_string(), Signal::Low);
            }

            // Clear sequential state
            node.properties.remove("q");
            node.properties.remove("prevClk");
            node.properties.remove("sampledD");
            node.properties.remove("sampledJ");
            node.properties.remove("sampledK");
        }

        self.ic_engines.clear();
        self.clock_manager.reset();
    }

    pub fn clear(&mut self) {
        self.nodes.clear();
        self.connections.clear();
        self.connection_index.clear();
        self.adjacency.clear();
        self.evaluation_order.clear();
        self.ic_engines.clear();
        self.clock_manager = ClockManager::new();
        self.graph_dirty = false;
        self.evaluation_count = 0;
        self.last_evaluation_time_us = 0.0;
    }

    pub fn get_state(&self) -> EngineState {
        EngineState {
            mode: if self.live_mode {
                "live".to_string()
            } else {
                "frozen".to_string()
            },
            node_count: self.nodes.len(),
            connection_count: self.connections.len(),
            evaluation_count: self.evaluation_count,
            last_evaluation_time_us: self.last_evaluation_time_us,
        }
    }

    pub fn dispose(&mut self) {
        self.ic_engines.clear();
        self.clear();
    }

    // ── Graph Management ─────────────────────────────────────

    pub fn rebuild_graph(&mut self) {
        self.adjacency = build_adjacency_list(&self.connections);
        self.connection_index = build_connection_index(&self.connections);

        let node_ids: Vec<String> = self.nodes.keys().cloned().collect();
        let result = topological_sort(&node_ids, &self.adjacency);

        self.evaluation_order = result.order;

        // Append cycle nodes at the end (allows feedback loops to work with 1-pass latency)
        if result.has_cycle {
            for cycle_node in &result.cycle_nodes {
                self.evaluation_order.push(cycle_node.clone());
            }
        }

        self.graph_dirty = false;
    }

    pub fn mark_graph_dirty(&mut self) {
        self.graph_dirty = true;
    }

    fn rebuild_graph_if_dirty(&mut self) {
        if self.graph_dirty {
            self.rebuild_graph();
        }
    }

    // ── Node Evaluation ──────────────────────────────────────

    fn evaluate_node(&mut self, node_id: &str) -> bool {
        // Collect input signals from connected sources
        self.collect_input_signals(node_id);

        let node = match self.nodes.get(node_id) {
            Some(n) => n,
            None => return false,
        };

        let comp_type = node.component_type;

        // Compute new outputs
        let new_outputs = if comp_type == ComponentType::Ic {
            // IC evaluation requires mutable access to both node and ic_engines
            let mut node_clone = node.clone();
            let outputs = evaluate_ic(&mut node_clone, &mut self.ic_engines);
            // Write back any property changes from IC evaluation
            if let Some(n) = self.nodes.get_mut(node_id) {
                n.properties = node_clone.properties;
            }
            outputs
        } else if comp_type.is_gate() {
            // Gate evaluation: collect inputs in pin order
            let input_signals: Vec<Signal> = node
                .input_pin_ids
                .iter()
                .map(|pin_id| node.inputs.get(pin_id).copied().unwrap_or(Signal::Low))
                .collect();
            let result = evaluate_gate(comp_type, &input_signals);
            let mut outputs = HashMap::new();
            outputs.insert("out".to_string(), result);
            outputs
        } else {
            // Component evaluation
            let inputs = node.inputs.clone();
            let mut properties = node.properties.clone();
            let outputs = evaluate_component(comp_type, &inputs, &mut properties);
            // Write back property changes (sequential state)
            if let Some(n) = self.nodes.get_mut(node_id) {
                n.properties = properties;
            }
            outputs
        };

        // Check if any output actually changed
        let node = match self.nodes.get(node_id) {
            Some(n) => n,
            None => return false,
        };
        let mut changed = false;
        for (pin_id, new_signal) in &new_outputs {
            let old = node.outputs.get(pin_id).copied().unwrap_or(Signal::Unknown);
            if old != *new_signal {
                changed = true;
                break;
            }
        }

        // Apply new outputs
        if changed {
            if let Some(n) = self.nodes.get_mut(node_id) {
                for (pin_id, signal) in new_outputs {
                    n.outputs.insert(pin_id, signal);
                }
            }
        }

        changed
    }

    fn collect_input_signals(&mut self, node_id: &str) {
        // Reset inputs to Unknown first
        if let Some(node) = self.nodes.get_mut(node_id) {
            // Skip INPUT and CLOCK nodes - they drive themselves
            if node.component_type == ComponentType::Input
                || node.component_type == ComponentType::Clock
            {
                return;
            }
            for pin_id in &node.input_pin_ids {
                node.inputs.insert(pin_id.clone(), Signal::Unknown);
            }
        }

        // Collect signals from connected sources using connection index
        let conn_indices = match self.connection_index.get(node_id) {
            Some(indices) => indices.clone(),
            None => return,
        };

        for &idx in &conn_indices {
            let conn = &self.connections[idx];
            let source_signal = self
                .nodes
                .get(&conn.source_node_id)
                .and_then(|n| n.outputs.get(&conn.source_pin_id))
                .copied()
                .unwrap_or(Signal::Unknown);

            if let Some(node) = self.nodes.get_mut(node_id) {
                let current = node
                    .inputs
                    .get(&conn.target_pin_id)
                    .copied()
                    .unwrap_or(Signal::Unknown);

                // Signal merging: if multiple drivers, use OR (wired-OR)
                // Unknown + anything = that thing; two valid signals = OR
                let merged = match (current, source_signal) {
                    (Signal::Unknown, s) => s,
                    (s, Signal::Unknown) => s,
                    (Signal::High, _) | (_, Signal::High) => Signal::High,
                    _ => Signal::Low,
                };

                node.inputs.insert(conn.target_pin_id.clone(), merged);
            }
        }
    }

    // ── Propagation ──────────────────────────────────────────

    fn propagate_from_node(&mut self, start_node_id: &str) {
        self.rebuild_graph_if_dirty();

        let downstream = find_downstream(&[start_node_id.to_string()], &self.adjacency);
        let subgraph_order = sort_subset(&self.evaluation_order, &downstream);

        let mut passes = 0;
        let mut changed = true;

        while changed && passes < MAX_PASSES {
            changed = false;
            passes += 1;
            for node_id in &subgraph_order {
                if self.evaluate_node(node_id) {
                    changed = true;
                }
            }
        }

        self.evaluation_count += passes as u64;
    }
}

// ── Timing utilities ─────────────────────────────────────────
// In WASM we use js_sys::Date for timing

fn instant_now() -> f64 {
    #[cfg(target_arch = "wasm32")]
    {
        js_sys::Date::now()
    }
    #[cfg(not(target_arch = "wasm32"))]
    {
        0.0
    }
}

fn elapsed_us(start: f64) -> f64 {
    #[cfg(target_arch = "wasm32")]
    {
        (js_sys::Date::now() - start) * 1000.0
    }
    #[cfg(not(target_arch = "wasm32"))]
    {
        let _ = start;
        0.0
    }
}
