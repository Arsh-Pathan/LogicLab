import { Signal, SignalState, GateType, ComponentType } from '@/types/circuit';

function resolve(signal: SignalState): Signal {
  return signal ?? 0;
}

function evaluateAND(inputs: SignalState[]): Signal {
  if (inputs.length === 0) return 0;
  return inputs.every((s) => resolve(s) === 1) ? 1 : 0;
}

function evaluateOR(inputs: SignalState[]): Signal {
  if (inputs.length === 0) return 0;
  return inputs.some((s) => resolve(s) === 1) ? 1 : 0;
}

function evaluateNOT(inputs: SignalState[]): Signal {
  if (inputs.length === 0) return 1;
  return resolve(inputs[0]) === 1 ? 0 : 1;
}

function evaluateNAND(inputs: SignalState[]): Signal {
  if (inputs.length === 0) return 1;
  return inputs.every((s) => resolve(s) === 1) ? 0 : 1;
}

function evaluateNOR(inputs: SignalState[]): Signal {
  if (inputs.length === 0) return 1;
  return inputs.some((s) => resolve(s) === 1) ? 0 : 1;
}

function evaluateXOR(inputs: SignalState[]): Signal {
  if (inputs.length === 0) return 0;
  const xorResult = inputs.reduce<number>((acc, s) => acc ^ resolve(s), 0);
  return (xorResult & 1) as Signal;
}

function evaluateXNOR(inputs: SignalState[]): Signal {
  if (inputs.length === 0) return 1;
  const xorResult = inputs.reduce<number>((acc, s) => acc ^ resolve(s), 0);
  return ((xorResult & 1) === 0 ? 1 : 0) as Signal;
}

function evaluateBUFFER(inputs: SignalState[]): Signal {
  if (inputs.length === 0) return 0;
  return resolve(inputs[0]);
}

const GATE_EVALUATORS: Record<GateType, (inputs: SignalState[]) => Signal> = {
  AND: evaluateAND,
  OR: evaluateOR,
  NOT: evaluateNOT,
  NAND: evaluateNAND,
  NOR: evaluateNOR,
  XOR: evaluateXOR,
  XNOR: evaluateXNOR,
  BUFFER: evaluateBUFFER,
};

export function evaluateGate(type: GateType, inputs: SignalState[]): Signal {
  const evaluator = GATE_EVALUATORS[type];
  if (!evaluator) {
    console.warn(`Unknown gate type: ${type}, returning 0`);
    return 0;
  }
  return evaluator(inputs);
}

export function isGateType(type: ComponentType): type is GateType {
  return type in GATE_EVALUATORS;
}


export function evaluateFullAdder(
  a: SignalState,
  b: SignalState,
  cin: SignalState
): { sum: Signal; cout: Signal } {
  const ra = resolve(a);
  const rb = resolve(b);
  const rc = resolve(cin);
  const axb = (ra ^ rb) & 1;
  return {
    sum: ((axb ^ rc) & 1) as Signal,
    cout: (((ra & rb) | (rc & axb)) & 1) as Signal,
  };
}

export function evaluateDecoder(
  a: SignalState,
  b: SignalState
): Signal[] {
  const ra = resolve(a);
  const rb = resolve(b);
  const index = (rb << 1) | ra;
  return [0, 1, 2, 3].map((i) => (i === index ? 1 : 0)) as Signal[];
}

export function evaluateComponent(
  type: ComponentType,
  inputs: Map<string, SignalState>,
  properties?: Record<string, unknown>
): Map<string, Signal> {
  const outputs = new Map<string, Signal>();

  switch (type) {
    case 'INPUT': {
      const value = inputs.get('value');
      outputs.set('out', resolve(value));
      break;
    }
    case 'OUTPUT':
    case 'LED': {
      const displaySignal = inputs.get('in_0') ?? Array.from(inputs.values())[0];
      outputs.set('display', resolve(displaySignal));
      break;
    }
    case 'CLOCK': {
      const value = inputs.get('value');
      outputs.set('out', resolve(value));
      break;
    }
    case 'SEVEN_SEGMENT': {
      const inputArr = Array.from(inputs.values());
      for (let i = 0; i < inputArr.length; i++) {
        outputs.set(`in_${i}`, resolve(inputArr[i]));
      }
      break;
    }
    case 'HALF_ADDER': {
      const a = resolve(inputs.get('in_0'));
      const b = resolve(inputs.get('in_1'));
      outputs.set('sum', (a ^ b) as Signal);
      outputs.set('carry', (a & b) as Signal);
      break;
    }
    case 'FULL_ADDER': {
      const a = resolve(inputs.get('in_0'));
      const b = resolve(inputs.get('in_1'));
      const cin = resolve(inputs.get('in_2'));
      const res = evaluateFullAdder(a, b, cin);
      outputs.set('sum', res.sum);
      outputs.set('cout', res.cout);
      break;
    }
    case 'DECODER': {
      const a = resolve(inputs.get('in_0'));
      const b = resolve(inputs.get('in_1'));
      const res = evaluateDecoder(a, b);
      // Pin IDs must match createOutputPins: y0, y1, y2, y3
      res.forEach((val, i) => outputs.set(`y${i}`, val));
      break;
    }

    // ── BCD TO 7-SEGMENT DECODER ──────────────────────
    // Inputs: D, C, B, A  →  Outputs: A, B, C, D, E, F, G
    case 'BCD_TO_7SEG': {
      const d = resolve(inputs.get('in_0'));
      const c = resolve(inputs.get('in_1'));
      const b = resolve(inputs.get('in_2'));
      const a = resolve(inputs.get('in_3'));
      const val = (d << 3) | (c << 2) | (b << 1) | a;

      // Hexadecimal 7-segment active-high patterns for 0-F (A=MSB..G=LSB order in logic below is typical, but we map 0=A..6=G)
      // Array stores [A, B, C, D, E, F, G] for each number
      const patterns = [
        [1,1,1,1,1,1,0], // 0
        [0,1,1,0,0,0,0], // 1
        [1,1,0,1,1,0,1], // 2
        [1,1,1,1,0,0,1], // 3
        [0,1,1,0,0,1,1], // 4
        [1,0,1,1,0,1,1], // 5
        [1,0,1,1,1,1,1], // 6
        [1,1,1,0,0,0,0], // 7
        [1,1,1,1,1,1,1], // 8
        [1,1,1,1,0,1,1], // 9
        [1,1,1,0,1,1,1], // A
        [0,0,1,1,1,1,1], // b
        [1,0,0,1,1,1,0], // C
        [0,1,1,1,1,0,1], // d
        [1,0,0,1,1,1,1], // E
        [1,0,0,0,1,1,1], // F
      ];
      const pattern = patterns[val] || [0,0,0,0,0,0,0];
      for (let i = 0; i < 7; i++) {
        outputs.set(`out_${i}`, pattern[i] as Signal);
      }
      break;
    }

    // ── MUX 2:1 ──────────────────────────────────────
    // Inputs: D0, D1, S  →  Output: Y
    // Y = S ? D1 : D0
    case 'MUX_2TO1': {
      const d0 = resolve(inputs.get('in_0'));
      const d1 = resolve(inputs.get('in_1'));
      const s  = resolve(inputs.get('in_2'));
      outputs.set('out', (s === 1 ? d1 : d0) as Signal);
      break;
    }

    // ── MUX 4:1 ──────────────────────────────────────
    // Inputs: D0, D1, D2, D3, S0, S1  →  Output: Y
    case 'MUX_4TO1': {
      const d0 = resolve(inputs.get('in_0'));
      const d1 = resolve(inputs.get('in_1'));
      const d2 = resolve(inputs.get('in_2'));
      const d3 = resolve(inputs.get('in_3'));
      const s0 = resolve(inputs.get('in_4'));
      const s1 = resolve(inputs.get('in_5'));
      const sel = (s1 << 1) | s0;
      const muxData = [d0, d1, d2, d3];
      outputs.set('out', muxData[sel] as Signal);
      break;
    }

    // ── DEMUX 1:4 ─────────────────────────────────────
    // Inputs: D, S0, S1  →  Outputs: Y0, Y1, Y2, Y3
    case 'DEMUX_1TO4': {
      const d  = resolve(inputs.get('in_0'));
      const s0 = resolve(inputs.get('in_1'));
      const s1 = resolve(inputs.get('in_2'));
      const sel = (s1 << 1) | s0;
      for (let i = 0; i < 4; i++) {
        outputs.set(`y${i}`, (i === sel ? d : 0) as Signal);
      }
      break;
    }

    // ── SR LATCH (level-sensitive, active-high) ──────
    // Inputs: S, R  →  Outputs: Q, Q̄
    case 'SR_LATCH': {
      const s = resolve(inputs.get('in_0'));
      const r = resolve(inputs.get('in_1'));
      const prevQ = (properties?.q as Signal) ?? 0;
      let q: Signal = prevQ;
      if (s === 1 && r === 0) q = 1;
      else if (s === 0 && r === 1) q = 0;
      else if (s === 1 && r === 1) q = 0; // invalid → reset
      // s === 0 && r === 0: hold
      if (properties) properties.q = q;
      outputs.set('q', q);
      outputs.set('qn', (q === 1 ? 0 : 1) as Signal);
      break;
    }

    // ── D FLIP-FLOP (positive-edge-triggered) ────────
    // Inputs: D, CLK  →  Outputs: Q, Q̄
    case 'D_FLIPFLOP': {
      const d   = resolve(inputs.get('in_0'));
      const clk = resolve(inputs.get('in_1'));
      const prevClk = (properties?.prevClk as Signal) ?? 0;
      let q = (properties?.q as Signal) ?? 0;
      let sampledD = (properties?.sampledD as Signal) ?? d;

      // Master-slave emulation: sample inputs while clock is low to avoid zero-delay race conditions
      if (clk === 0) {
        sampledD = d;
      }

      // Rising edge: prevClk=0, clk=1
      if (prevClk === 0 && clk === 1) {
        q = sampledD;
      }
      if (properties) {
        properties.prevClk = clk;
        properties.sampledD = sampledD;
        properties.q = q;
      }
      outputs.set('q', q);
      outputs.set('qn', (q === 1 ? 0 : 1) as Signal);
      break;
    }

    // ── JK FLIP-FLOP (positive-edge-triggered) ───────
    // Inputs: J, K, CLK  →  Outputs: Q, Q̄
    case 'JK_FLIPFLOP': {
      const j   = resolve(inputs.get('in_0'));
      const k   = resolve(inputs.get('in_1'));
      const clk = resolve(inputs.get('in_2'));
      const prevClk = (properties?.prevClk as Signal) ?? 0;
      let q = (properties?.q as Signal) ?? 0;
      let sampledJ = (properties?.sampledJ as Signal) ?? j;
      let sampledK = (properties?.sampledK as Signal) ?? k;

      // Master-slave emulation: sample inputs while clock is low
      if (clk === 0) {
        sampledJ = j;
        sampledK = k;
      }

      // Rising edge trigger using sampled values
      if (prevClk === 0 && clk === 1) {
        if (sampledJ === 0 && sampledK === 0) { /* hold */ }
        else if (sampledJ === 0 && sampledK === 1) q = 0;
        else if (sampledJ === 1 && sampledK === 0) q = 1;
        else q = (q === 1 ? 0 : 1) as Signal; // toggle
      }
      if (properties) {
        properties.prevClk = clk;
        properties.sampledJ = sampledJ;
        properties.sampledK = sampledK;
        properties.q = q;
      }
      outputs.set('q', q);
      outputs.set('qn', (q === 1 ? 0 : 1) as Signal);
      break;
    }

    // ── 1-BIT COMPARATOR ─────────────────────────────
    // Inputs: A, B  →  Outputs: GT (A>B), EQ (A=B), LT (A<B)
    case 'COMPARATOR': {
      const a = resolve(inputs.get('in_0'));
      const b = resolve(inputs.get('in_1'));
      outputs.set('gt', (a > b ? 1 : 0) as Signal);
      outputs.set('eq', (a === b ? 1 : 0) as Signal);
      outputs.set('lt', (a < b ? 1 : 0) as Signal);
      break;
    }

    case 'IC': {
      // IC logic is handled by the SimulationEngine directly
      // using sub-engines. We return an empty map here.
      break;
    }
    default: {
      if (isGateType(type)) {
        const inputArr = Array.from(inputs.values());
        const result = evaluateGate(type, inputArr);
        outputs.set('out', result);
      }
    }
  }

  return outputs;
}

export { GATE_EVALUATORS };
