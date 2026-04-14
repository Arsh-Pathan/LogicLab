use crate::types::Signal;
use std::collections::HashMap;

/// Clock state manager.
/// Note: Actual timing (setTimeout) is handled on the JS side.
/// Rust only tracks current state for each clock node.
pub struct ClockManager {
    states: HashMap<String, Signal>,
}

impl ClockManager {
    pub fn new() -> Self {
        ClockManager {
            states: HashMap::new(),
        }
    }

    /// Register a clock node.
    pub fn register(&mut self, node_id: &str) {
        self.states.insert(node_id.to_string(), Signal::Low);
    }

    /// Remove a clock node.
    pub fn remove(&mut self, node_id: &str) {
        self.states.remove(node_id);
    }

    /// Set the current tick value of a clock (called from JS on timer fire).
    pub fn set_state(&mut self, node_id: &str, value: Signal) {
        if let Some(state) = self.states.get_mut(node_id) {
            *state = value;
        }
    }

    /// Get the current state of a clock.
    pub fn get_state(&self, node_id: &str) -> Signal {
        self.states.get(node_id).copied().unwrap_or(Signal::Low)
    }

    /// Reset all clocks to Low.
    pub fn reset(&mut self) {
        for state in self.states.values_mut() {
            *state = Signal::Low;
        }
    }

    /// Get all registered clock node IDs.
    pub fn clock_ids(&self) -> Vec<String> {
        self.states.keys().cloned().collect()
    }
}
