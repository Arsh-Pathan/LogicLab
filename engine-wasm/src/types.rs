use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// ── Signal Model ─────────────────────────────────────────────
// 4-value logic: Low, High, Unknown, HighZ
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(into = "Option<u8>", from = "Option<u8>")]
pub enum Signal {
    Low,
    High,
    Unknown,
    HighZ,
}

impl Signal {
    pub fn as_bit(self) -> u8 {
        match self {
            Signal::High => 1,
            _ => 0,
        }
    }

    pub fn from_bit(v: u8) -> Self {
        if v == 1 { Signal::High } else { Signal::Low }
    }

    pub fn is_high(self) -> bool {
        self == Signal::High
    }

    pub fn resolve(self) -> Signal {
        match self {
            Signal::HighZ | Signal::Unknown => Signal::Low,
            other => other,
        }
    }
}

impl Default for Signal {
    fn default() -> Self {
        Signal::Low
    }
}

impl From<Option<u8>> for Signal {
    fn from(v: Option<u8>) -> Self {
        match v {
            Some(1) => Signal::High,
            Some(0) => Signal::Low,
            None => Signal::Unknown,
            _ => Signal::Low,
        }
    }
}

impl From<Signal> for Option<u8> {
    fn from(s: Signal) -> Option<u8> {
        match s {
            Signal::Low => Some(0),
            Signal::High => Some(1),
            Signal::Unknown => None,
            Signal::HighZ => None,
        }
    }
}

// ── Component Types ──────────────────────────────────────────
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ComponentType {
    // Gates
    And,
    Or,
    Not,
    Nand,
    Nor,
    Xor,
    Xnor,
    Buffer,
    // I/O
    Input,
    Output,
    Clock,
    Led,
    SevenSegment,
    // Arithmetic
    HalfAdder,
    FullAdder,
    // Combinational
    Decoder,
    BcdTo7Seg,
    Mux2To1,
    Mux4To1,
    Demux1To4,
    Comparator,
    // Sequential
    SrLatch,
    DFlipflop,
    JkFlipflop,
    // Structural
    Junction,
    Ic,
}

impl ComponentType {
    pub fn is_gate(self) -> bool {
        matches!(
            self,
            ComponentType::And
                | ComponentType::Or
                | ComponentType::Not
                | ComponentType::Nand
                | ComponentType::Nor
                | ComponentType::Xor
                | ComponentType::Xnor
                | ComponentType::Buffer
        )
    }

    pub fn is_sequential(self) -> bool {
        matches!(
            self,
            ComponentType::SrLatch | ComponentType::DFlipflop | ComponentType::JkFlipflop
        )
    }
}

// ── Connection ───────────────────────────────────────────────
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Connection {
    pub id: String,
    pub source_node_id: String,
    pub source_pin_id: String,
    pub target_node_id: String,
    pub target_pin_id: String,
}

// ── Pin Definition (from JS) ─────────────────────────────────
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PinDef {
    pub id: String,
    pub label: String,
    #[serde(rename = "type")]
    pub pin_type: String,
    pub signal: Option<u8>,
    #[serde(default)]
    pub side: Option<String>,
    #[serde(default)]
    pub index: usize,
}

// ── Node Data (from JS) ─────────────────────────────────────
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CircuitNodeData {
    pub id: String,
    #[serde(rename = "type")]
    pub component_type: ComponentType,
    #[serde(default)]
    pub label: String,
    #[serde(default)]
    pub inputs: Vec<PinDef>,
    #[serde(default)]
    pub outputs: Vec<PinDef>,
    #[serde(default)]
    pub rotation: u16,
    #[serde(default)]
    pub properties: HashMap<String, serde_json::Value>,
}

// ── IC Definition ────────────────────────────────────────────
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ICPinMapping {
    pub pin_id: String,
    pub node_id: String,
    pub label: String,
    #[serde(default)]
    pub side: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ICDefinition {
    pub id: String,
    pub name: String,
    #[serde(default)]
    pub description: String,
    pub nodes: Vec<CircuitNodeData>,
    pub connections: Vec<Connection>,
    pub input_pins: Vec<ICPinMapping>,
    pub output_pins: Vec<ICPinMapping>,
}

// ── Engine State (returned to JS) ────────────────────────────
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EngineState {
    pub mode: String,
    pub node_count: usize,
    pub connection_count: usize,
    pub evaluation_count: u64,
    pub last_evaluation_time_us: f64,
}

// ── Internal Node ────────────────────────────────────────────
// Used by the engine internally. Index-based for cache efficiency.
#[derive(Debug, Clone)]
pub struct InternalNode {
    pub id: String,
    pub component_type: ComponentType,
    pub input_pin_ids: Vec<String>,
    pub output_pin_ids: Vec<String>,
    pub inputs: HashMap<String, Signal>,
    pub outputs: HashMap<String, Signal>,
    pub properties: HashMap<String, serde_json::Value>,
}

impl InternalNode {
    pub fn from_data(data: &CircuitNodeData) -> Self {
        let mut inputs = HashMap::new();
        let mut outputs = HashMap::new();
        let input_pin_ids: Vec<String> = data.inputs.iter().map(|p| p.id.clone()).collect();
        let output_pin_ids: Vec<String> = data.outputs.iter().map(|p| p.id.clone()).collect();

        for pin in &data.inputs {
            inputs.insert(pin.id.clone(), Signal::Unknown);
        }
        for pin in &data.outputs {
            outputs.insert(pin.id.clone(), Signal::Unknown);
        }

        // For INPUT nodes, set the output from properties
        if data.component_type == ComponentType::Input {
            let value = data
                .properties
                .get("value")
                .and_then(|v| v.as_u64())
                .unwrap_or(0);
            outputs.insert("out".to_string(), Signal::from_bit(value as u8));
        }

        InternalNode {
            id: data.id.clone(),
            component_type: data.component_type,
            input_pin_ids,
            output_pin_ids,
            inputs,
            outputs,
            properties: data.properties.clone(),
        }
    }
}
