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
  inputs: Map<string, SignalState>
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
      const inputArr = Array.from(inputs.values());
      outputs.set('display', resolve(inputArr[0]));
      break;
    }
    case 'CLOCK': {
      const value = inputs.get('value');
      outputs.set('out', resolve(value));
      break;
    }
    case 'SEVEN_SEGMENT': {
      const inputArr = Array.from(inputs.values());
      // For Seven Segment, we just pass the input signals to the outputs for display
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
      res.forEach((val, i) => outputs.set(`out_${i}`, val));
      break;
    }
    case 'IC': {
      // IC logic is complex and handled by the SimulationEngine directly
      // using sub-engines. We return an empty map here and let the engine
      // override it.
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

