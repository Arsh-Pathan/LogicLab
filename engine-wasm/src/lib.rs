mod clock;
mod engine;
mod gates;
mod graph;
mod ic;
mod types;

use engine::SimulationEngine;
use types::{CircuitNodeData, Connection};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct WasmSimulationEngine {
    engine: SimulationEngine,
}

#[wasm_bindgen]
impl WasmSimulationEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        // Set up better panic messages in debug builds
        #[cfg(debug_assertions)]
        console_error_panic_hook_init();

        WasmSimulationEngine {
            engine: SimulationEngine::new(),
        }
    }

    // ── Node Management ──────────────────────────────────

    #[wasm_bindgen(js_name = "addNode")]
    pub fn add_node(&mut self, data: JsValue) -> Result<(), JsValue> {
        let node_data: CircuitNodeData = serde_wasm_bindgen::from_value(data)
            .map_err(|e| JsValue::from_str(&format!("Failed to parse node data: {}", e)))?;
        self.engine.add_node(&node_data);
        Ok(())
    }

    #[wasm_bindgen(js_name = "removeNode")]
    pub fn remove_node(&mut self, node_id: &str) {
        self.engine.remove_node(node_id);
    }

    #[wasm_bindgen(js_name = "updateNodeProperties")]
    pub fn update_node_properties(
        &mut self,
        node_id: &str,
        props: JsValue,
    ) -> Result<(), JsValue> {
        let properties: std::collections::HashMap<String, serde_json::Value> =
            serde_wasm_bindgen::from_value(props)
                .map_err(|e| JsValue::from_str(&format!("Failed to parse properties: {}", e)))?;
        self.engine.update_node_properties(node_id, properties);
        Ok(())
    }

    #[wasm_bindgen(js_name = "addInputPin")]
    pub fn add_input_pin(&mut self, node_id: &str, pin_id: &str) {
        self.engine.add_input_pin(node_id, pin_id);
    }

    #[wasm_bindgen(js_name = "removeInputPin")]
    pub fn remove_input_pin(&mut self, node_id: &str, pin_id: &str) {
        self.engine.remove_input_pin(node_id, pin_id);
    }

    // ── Connection Management ────────────────────────────

    #[wasm_bindgen(js_name = "addConnection")]
    pub fn add_connection(&mut self, conn: JsValue) -> Result<(), JsValue> {
        let connection: Connection = serde_wasm_bindgen::from_value(conn)
            .map_err(|e| JsValue::from_str(&format!("Failed to parse connection: {}", e)))?;
        self.engine.add_connection(connection);
        Ok(())
    }

    #[wasm_bindgen(js_name = "removeConnection")]
    pub fn remove_connection(&mut self, connection_id: &str) {
        self.engine.remove_connection(connection_id);
    }

    // ── Input Control ────────────────────────────────────

    #[wasm_bindgen(js_name = "setInputValue")]
    pub fn set_input_value(&mut self, node_id: &str, value: u8) {
        self.engine.set_input_value(node_id, value);
    }

    #[wasm_bindgen(js_name = "setClockValue")]
    pub fn set_clock_value(&mut self, node_id: &str, value: u8) {
        self.engine.set_clock_value(node_id, value);
    }

    // ── Data Access ──────────────────────────────────────

    #[wasm_bindgen(js_name = "getNodeOutputs")]
    pub fn get_node_outputs(&self, node_id: &str) -> JsValue {
        match self.engine.get_node_outputs(node_id) {
            Some(outputs) => {
                let js_map: std::collections::HashMap<String, Option<u8>> = outputs
                    .iter()
                    .map(|(k, v)| (k.clone(), (*v).into()))
                    .collect();
                serde_wasm_bindgen::to_value(&js_map).unwrap_or(JsValue::NULL)
            }
            None => JsValue::NULL,
        }
    }

    #[wasm_bindgen(js_name = "getNodeInputs")]
    pub fn get_node_inputs(&self, node_id: &str) -> JsValue {
        match self.engine.get_node_inputs(node_id) {
            Some(inputs) => {
                let js_map: std::collections::HashMap<String, Option<u8>> = inputs
                    .iter()
                    .map(|(k, v)| (k.clone(), (*v).into()))
                    .collect();
                serde_wasm_bindgen::to_value(&js_map).unwrap_or(JsValue::NULL)
            }
            None => JsValue::NULL,
        }
    }

    /// Bulk signal read - returns all signals for all nodes at once.
    /// Much more efficient than calling getNodeOutputs/getNodeInputs per node.
    #[wasm_bindgen(js_name = "getAllSignals")]
    pub fn get_all_signals(&self) -> JsValue {
        let all = self.engine.get_all_signals();
        let js_map: std::collections::HashMap<
            String,
            (
                std::collections::HashMap<String, Option<u8>>,
                std::collections::HashMap<String, Option<u8>>,
            ),
        > = all
            .into_iter()
            .map(|(node_id, (inputs, outputs))| {
                let js_inputs: std::collections::HashMap<String, Option<u8>> =
                    inputs.into_iter().map(|(k, v)| (k, v.into())).collect();
                let js_outputs: std::collections::HashMap<String, Option<u8>> =
                    outputs.into_iter().map(|(k, v)| (k, v.into())).collect();
                (node_id, (js_inputs, js_outputs))
            })
            .collect();
        serde_wasm_bindgen::to_value(&js_map).unwrap_or(JsValue::NULL)
    }

    // ── Simulation Control ───────────────────────────────

    pub fn evaluate(&mut self) {
        self.engine.evaluate();
    }

    pub fn step(&mut self) -> JsValue {
        match self.engine.step() {
            Some(node_id) => JsValue::from_str(&node_id),
            None => JsValue::NULL,
        }
    }

    pub fn reset(&mut self) {
        self.engine.reset();
    }

    pub fn clear(&mut self) {
        self.engine.clear();
    }

    #[wasm_bindgen(js_name = "setLiveMode")]
    pub fn set_live_mode(&mut self, enabled: bool) {
        self.engine.set_live_mode(enabled);
    }

    #[wasm_bindgen(js_name = "recomputeAll")]
    pub fn recompute_all(&mut self) {
        self.engine.recompute_all();
    }

    #[wasm_bindgen(js_name = "recomputeSubgraph")]
    pub fn recompute_subgraph(&mut self, node_id: &str) {
        self.engine.recompute_subgraph(node_id);
    }

    // ── Query ────────────────────────────────────────────

    #[wasm_bindgen(js_name = "getState")]
    pub fn get_state(&self) -> JsValue {
        let state = self.engine.get_state();
        serde_wasm_bindgen::to_value(&state).unwrap_or(JsValue::NULL)
    }

    // ── Lifecycle ────────────────────────────────────────

    pub fn dispose(&mut self) {
        self.engine.dispose();
    }
}

impl Default for WasmSimulationEngine {
    fn default() -> Self {
        Self::new()
    }
}

// Panic hook for better error messages (debug builds)
#[cfg(debug_assertions)]
fn console_error_panic_hook_init() {
    use std::panic;
    panic::set_hook(Box::new(|info| {
        let msg = format!("WASM panic: {}", info);
        web_sys::console::error_1(&JsValue::from_str(&msg));
    }));
}
