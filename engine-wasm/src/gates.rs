use crate::types::{ComponentType, Signal};
use std::collections::HashMap;

fn resolve(s: Signal) -> Signal {
    s.resolve()
}

fn r(s: Signal) -> u8 {
    resolve(s).as_bit()
}

// ── Gate evaluators ──────────────────────────────────────────

pub fn evaluate_gate(gate_type: ComponentType, inputs: &[Signal]) -> Signal {
    match gate_type {
        ComponentType::And => eval_and(inputs),
        ComponentType::Or => eval_or(inputs),
        ComponentType::Not => eval_not(inputs),
        ComponentType::Nand => eval_nand(inputs),
        ComponentType::Nor => eval_nor(inputs),
        ComponentType::Xor => eval_xor(inputs),
        ComponentType::Xnor => eval_xnor(inputs),
        ComponentType::Buffer => eval_buffer(inputs),
        _ => Signal::Low,
    }
}

fn eval_and(inputs: &[Signal]) -> Signal {
    if inputs.is_empty() {
        return Signal::Low;
    }
    Signal::from_bit(inputs.iter().all(|s| r(*s) == 1) as u8)
}

fn eval_or(inputs: &[Signal]) -> Signal {
    if inputs.is_empty() {
        return Signal::Low;
    }
    Signal::from_bit(inputs.iter().any(|s| r(*s) == 1) as u8)
}

fn eval_not(inputs: &[Signal]) -> Signal {
    if inputs.is_empty() {
        return Signal::High;
    }
    Signal::from_bit(if r(inputs[0]) == 1 { 0 } else { 1 })
}

fn eval_nand(inputs: &[Signal]) -> Signal {
    if inputs.is_empty() {
        return Signal::High;
    }
    Signal::from_bit(!inputs.iter().all(|s| r(*s) == 1) as u8)
}

fn eval_nor(inputs: &[Signal]) -> Signal {
    if inputs.is_empty() {
        return Signal::High;
    }
    Signal::from_bit(!inputs.iter().any(|s| r(*s) == 1) as u8)
}

fn eval_xor(inputs: &[Signal]) -> Signal {
    if inputs.is_empty() {
        return Signal::Low;
    }
    let xor = inputs.iter().fold(0u8, |acc, s| acc ^ r(*s));
    Signal::from_bit(xor & 1)
}

fn eval_xnor(inputs: &[Signal]) -> Signal {
    if inputs.is_empty() {
        return Signal::High;
    }
    let xor = inputs.iter().fold(0u8, |acc, s| acc ^ r(*s));
    Signal::from_bit(if (xor & 1) == 0 { 1 } else { 0 })
}

fn eval_buffer(inputs: &[Signal]) -> Signal {
    if inputs.is_empty() {
        return Signal::Low;
    }
    resolve(inputs[0])
}

// ── Component evaluators ─────────────────────────────────────

pub fn evaluate_component(
    comp_type: ComponentType,
    inputs: &HashMap<String, Signal>,
    properties: &mut HashMap<String, serde_json::Value>,
) -> HashMap<String, Signal> {
    let mut outputs = HashMap::new();

    match comp_type {
        ComponentType::Input => {
            let value = properties
                .get("value")
                .and_then(|v| v.as_u64())
                .unwrap_or(0);
            outputs.insert("out".to_string(), Signal::from_bit(value as u8));
        }

        ComponentType::Output | ComponentType::Led => {
            let display = inputs
                .get("in_0")
                .copied()
                .or_else(|| inputs.values().next().copied())
                .unwrap_or(Signal::Low);
            outputs.insert("display".to_string(), resolve(display));
        }

        ComponentType::Clock => {
            let value = properties
                .get("value")
                .and_then(|v| v.as_u64())
                .unwrap_or(0);
            outputs.insert("out".to_string(), Signal::from_bit(value as u8));
        }

        ComponentType::SevenSegment => {
            // Passthrough inputs for display
            for i in 0..7 {
                let key = format!("in_{}", i);
                let sig = inputs.get(&key).copied().unwrap_or(Signal::Low);
                outputs.insert(key, resolve(sig));
            }
        }

        ComponentType::HalfAdder => {
            let a = r(inputs.get("in_0").copied().unwrap_or(Signal::Low));
            let b = r(inputs.get("in_1").copied().unwrap_or(Signal::Low));
            outputs.insert("sum".to_string(), Signal::from_bit((a ^ b) & 1));
            outputs.insert("carry".to_string(), Signal::from_bit((a & b) & 1));
        }

        ComponentType::FullAdder => {
            let a = r(inputs.get("in_0").copied().unwrap_or(Signal::Low));
            let b = r(inputs.get("in_1").copied().unwrap_or(Signal::Low));
            let cin = r(inputs.get("in_2").copied().unwrap_or(Signal::Low));
            let axb = a ^ b;
            outputs.insert("sum".to_string(), Signal::from_bit((axb ^ cin) & 1));
            outputs.insert(
                "cout".to_string(),
                Signal::from_bit(((a & b) | (cin & axb)) & 1),
            );
        }

        ComponentType::Decoder => {
            let a = r(inputs.get("in_0").copied().unwrap_or(Signal::Low));
            let b = r(inputs.get("in_1").copied().unwrap_or(Signal::Low));
            let index = ((b as usize) << 1) | (a as usize);
            for i in 0..4 {
                outputs.insert(
                    format!("y{}", i),
                    Signal::from_bit(if i == index { 1 } else { 0 }),
                );
            }
        }

        ComponentType::BcdTo7Seg => {
            let d = r(inputs.get("in_0").copied().unwrap_or(Signal::Low));
            let c = r(inputs.get("in_1").copied().unwrap_or(Signal::Low));
            let b = r(inputs.get("in_2").copied().unwrap_or(Signal::Low));
            let a = r(inputs.get("in_3").copied().unwrap_or(Signal::Low));
            let val = ((d as usize) << 3) | ((c as usize) << 2) | ((b as usize) << 1) | (a as usize);

            // Active-high 7-segment patterns for hex digits 0-F: [A,B,C,D,E,F,G]
            const PATTERNS: [[u8; 7]; 16] = [
                [1, 1, 1, 1, 1, 1, 0], // 0
                [0, 1, 1, 0, 0, 0, 0], // 1
                [1, 1, 0, 1, 1, 0, 1], // 2
                [1, 1, 1, 1, 0, 0, 1], // 3
                [0, 1, 1, 0, 0, 1, 1], // 4
                [1, 0, 1, 1, 0, 1, 1], // 5
                [1, 0, 1, 1, 1, 1, 1], // 6
                [1, 1, 1, 0, 0, 0, 0], // 7
                [1, 1, 1, 1, 1, 1, 1], // 8
                [1, 1, 1, 1, 0, 1, 1], // 9
                [1, 1, 1, 0, 1, 1, 1], // A
                [0, 0, 1, 1, 1, 1, 1], // b
                [1, 0, 0, 1, 1, 1, 0], // C
                [0, 1, 1, 1, 1, 0, 1], // d
                [1, 0, 0, 1, 1, 1, 1], // E
                [1, 0, 0, 0, 1, 1, 1], // F
            ];

            let pattern = if val < 16 { PATTERNS[val] } else { [0; 7] };
            for i in 0..7 {
                outputs.insert(format!("out_{}", i), Signal::from_bit(pattern[i]));
            }
        }

        ComponentType::Mux2To1 => {
            let d0 = r(inputs.get("in_0").copied().unwrap_or(Signal::Low));
            let d1 = r(inputs.get("in_1").copied().unwrap_or(Signal::Low));
            let s = r(inputs.get("in_2").copied().unwrap_or(Signal::Low));
            outputs.insert("out".to_string(), Signal::from_bit(if s == 1 { d1 } else { d0 }));
        }

        ComponentType::Mux4To1 => {
            let d = [
                r(inputs.get("in_0").copied().unwrap_or(Signal::Low)),
                r(inputs.get("in_1").copied().unwrap_or(Signal::Low)),
                r(inputs.get("in_2").copied().unwrap_or(Signal::Low)),
                r(inputs.get("in_3").copied().unwrap_or(Signal::Low)),
            ];
            let s0 = r(inputs.get("in_4").copied().unwrap_or(Signal::Low));
            let s1 = r(inputs.get("in_5").copied().unwrap_or(Signal::Low));
            let sel = ((s1 as usize) << 1) | (s0 as usize);
            outputs.insert("out".to_string(), Signal::from_bit(d[sel]));
        }

        ComponentType::Demux1To4 => {
            let d = r(inputs.get("in_0").copied().unwrap_or(Signal::Low));
            let s0 = r(inputs.get("in_1").copied().unwrap_or(Signal::Low));
            let s1 = r(inputs.get("in_2").copied().unwrap_or(Signal::Low));
            let sel = ((s1 as usize) << 1) | (s0 as usize);
            for i in 0..4 {
                outputs.insert(
                    format!("y{}", i),
                    Signal::from_bit(if i == sel { d } else { 0 }),
                );
            }
        }

        ComponentType::SrLatch => {
            let s = r(inputs.get("in_0").copied().unwrap_or(Signal::Low));
            let rs = r(inputs.get("in_1").copied().unwrap_or(Signal::Low));
            let prev_q = properties
                .get("q")
                .and_then(|v| v.as_u64())
                .unwrap_or(0) as u8;
            let q = if s == 1 && rs == 0 {
                1
            } else if s == 0 && rs == 1 {
                0
            } else if s == 1 && rs == 1 {
                0 // invalid -> reset
            } else {
                prev_q
            };
            properties.insert("q".to_string(), serde_json::Value::from(q as u64));
            outputs.insert("q".to_string(), Signal::from_bit(q));
            outputs.insert("qn".to_string(), Signal::from_bit(if q == 1 { 0 } else { 1 }));
        }

        ComponentType::DFlipflop => {
            let d = r(inputs.get("in_0").copied().unwrap_or(Signal::Low));
            let clk = r(inputs.get("in_1").copied().unwrap_or(Signal::Low));
            let prev_clk = properties
                .get("prevClk")
                .and_then(|v| v.as_u64())
                .unwrap_or(0) as u8;
            let mut q = properties.get("q").and_then(|v| v.as_u64()).unwrap_or(0) as u8;
            let mut sampled_d = properties
                .get("sampledD")
                .and_then(|v| v.as_u64())
                .unwrap_or(d as u64) as u8;

            // Master-slave: sample while clock low
            if clk == 0 {
                sampled_d = d;
            }
            // Rising edge
            if prev_clk == 0 && clk == 1 {
                q = sampled_d;
            }

            properties.insert("prevClk".to_string(), serde_json::Value::from(clk as u64));
            properties.insert("sampledD".to_string(), serde_json::Value::from(sampled_d as u64));
            properties.insert("q".to_string(), serde_json::Value::from(q as u64));
            outputs.insert("q".to_string(), Signal::from_bit(q));
            outputs.insert("qn".to_string(), Signal::from_bit(if q == 1 { 0 } else { 1 }));
        }

        ComponentType::JkFlipflop => {
            let j = r(inputs.get("in_0").copied().unwrap_or(Signal::Low));
            let k = r(inputs.get("in_1").copied().unwrap_or(Signal::Low));
            let clk = r(inputs.get("in_2").copied().unwrap_or(Signal::Low));
            let prev_clk = properties
                .get("prevClk")
                .and_then(|v| v.as_u64())
                .unwrap_or(0) as u8;
            let mut q = properties.get("q").and_then(|v| v.as_u64()).unwrap_or(0) as u8;
            let mut sampled_j = properties
                .get("sampledJ")
                .and_then(|v| v.as_u64())
                .unwrap_or(j as u64) as u8;
            let mut sampled_k = properties
                .get("sampledK")
                .and_then(|v| v.as_u64())
                .unwrap_or(k as u64) as u8;

            // Master-slave: sample while clock low
            if clk == 0 {
                sampled_j = j;
                sampled_k = k;
            }
            // Rising edge
            if prev_clk == 0 && clk == 1 {
                q = match (sampled_j, sampled_k) {
                    (0, 0) => q,             // hold
                    (0, 1) => 0,             // reset
                    (1, 0) => 1,             // set
                    (1, 1) => if q == 1 { 0 } else { 1 }, // toggle
                    _ => q,
                };
            }

            properties.insert("prevClk".to_string(), serde_json::Value::from(clk as u64));
            properties.insert("sampledJ".to_string(), serde_json::Value::from(sampled_j as u64));
            properties.insert("sampledK".to_string(), serde_json::Value::from(sampled_k as u64));
            properties.insert("q".to_string(), serde_json::Value::from(q as u64));
            outputs.insert("q".to_string(), Signal::from_bit(q));
            outputs.insert("qn".to_string(), Signal::from_bit(if q == 1 { 0 } else { 1 }));
        }

        ComponentType::Comparator => {
            let a = r(inputs.get("in_0").copied().unwrap_or(Signal::Low));
            let b = r(inputs.get("in_1").copied().unwrap_or(Signal::Low));
            outputs.insert("gt".to_string(), Signal::from_bit(if a > b { 1 } else { 0 }));
            outputs.insert("eq".to_string(), Signal::from_bit(if a == b { 1 } else { 0 }));
            outputs.insert("lt".to_string(), Signal::from_bit(if a < b { 1 } else { 0 }));
        }

        ComponentType::Junction => {
            let in_signal = inputs
                .get("in")
                .copied()
                .or_else(|| inputs.values().next().copied())
                .unwrap_or(Signal::Low);
            let resolved = resolve(in_signal);
            for i in 0..5 {
                outputs.insert(format!("out_{}", i), resolved);
            }
        }

        ComponentType::Ic => {
            // IC logic handled by engine-level sub-engine evaluation
        }

        _ => {
            // Gates handled separately via evaluate_gate
        }
    }

    outputs
}
