use crate::engine::SimulationEngine;
use crate::types::{ICDefinition, InternalNode, Signal};
use std::collections::HashMap;

/// Evaluate an IC node by running its internal circuit as a sub-engine.
/// Returns the IC's output signals.
pub fn evaluate_ic(
    node: &mut InternalNode,
    ic_engines: &mut HashMap<String, SimulationEngine>,
) -> HashMap<String, Signal> {
    let mut result = HashMap::new();

    // Get or create the IC definition from node properties
    let def_json = match node.properties.get("definition") {
        Some(v) => v.clone(),
        None => return result,
    };

    let def: ICDefinition = match serde_json::from_value(def_json) {
        Ok(d) => d,
        Err(_) => return result,
    };

    // Get or create sub-engine
    let sub_engine = ic_engines
        .entry(node.id.clone())
        .or_insert_with(|| {
            let mut engine = SimulationEngine::new();
            engine.set_live_mode(false); // Frozen while building

            for node_data in &def.nodes {
                engine.add_node_internal(node_data);
            }
            for conn in &def.connections {
                engine.add_connection_internal(conn.clone());
            }
            engine.rebuild_graph();
            engine
        });

    // Map parent inputs to internal INPUT nodes
    let mut input_changed = false;
    for mapping in &def.input_pins {
        let parent_signal = node.inputs.get(&mapping.pin_id).copied().unwrap_or(Signal::Low);
        let resolved = parent_signal.resolve();

        if let Some(sub_node) = sub_engine.get_node_mut(&mapping.node_id) {
            let old_val = sub_node.outputs.get("out").copied().unwrap_or(Signal::Unknown);
            if old_val != resolved {
                input_changed = true;
                sub_node.properties.insert(
                    "value".to_string(),
                    serde_json::Value::from(resolved.as_bit() as u64),
                );
                sub_node.outputs.insert("out".to_string(), resolved);
            }
        }
    }

    // Only re-evaluate if inputs changed
    if input_changed {
        sub_engine.mark_graph_dirty();
        sub_engine.evaluate_all();
    }

    // Collect outputs from internal OUTPUT nodes
    for mapping in &def.output_pins {
        if let Some(sub_node) = sub_engine.get_node(&mapping.node_id) {
            let signal = sub_node
                .outputs
                .get("display")
                .or_else(|| sub_node.outputs.get("out"))
                .copied()
                .unwrap_or(Signal::Low);
            result.insert(mapping.pin_id.clone(), signal);
        }
    }

    result
}
