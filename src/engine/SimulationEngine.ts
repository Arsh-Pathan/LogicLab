import {
  Signal,
  SignalState,
  ComponentType,
  Connection,
  SimulationMode,
  EngineState,
  PropagationEvent,
  EngineSubscriber,
  CircuitNodeData,
} from '@/types/circuit';
import { evaluateGate, evaluateComponent, isGateType } from './gates';
import {
  topologicalSort,
  buildAdjacencyList,
  findDownstream,
  sortSubset,
  AdjacencyList,
} from './topologicalSort';
import { ClockScheduler } from './clockScheduler';

interface InternalNode {
  id: string;
  type: ComponentType;
  inputs: Map<string, SignalState>;
  outputs: Map<string, SignalState>;
  properties: Record<string, unknown>;
  inputPinIds: string[];
  outputPinIds: string[];
}

export class SimulationEngine {
  private nodes: Map<string, InternalNode> = new Map();
  private connections: Connection[] = [];

  private adjacency: AdjacencyList = new Map();
  private evaluationOrder: string[] = [];
  private graphDirty: boolean = true;

  private mode: SimulationMode = 'live';

  private pendingPropagations: Set<string> = new Set();

  private subscribers: Map<string, Set<EngineSubscriber>> = new Map();
  private globalSubscribers: Set<EngineSubscriber> = new Set();

  private clockScheduler: ClockScheduler;

  private evaluationCount: number = 0;
  private lastEvaluationTime: number = 0;

  private maxPropagationDepth: number = 1000;

  private propagationScheduled: boolean = false;
  private propagationQueue: Set<string> = new Set();

  constructor() {
    this.clockScheduler = new ClockScheduler((nodeId, value) => {
      this.handleClockTick(nodeId, value);
    });
  }

  addNode(data: CircuitNodeData): void {
    const node: InternalNode = {
      id: data.id,
      type: data.type,
      inputs: new Map(),
      outputs: new Map(),
      properties: { ...data.properties },
      inputPinIds: data.inputs.map((p) => p.id),
      outputPinIds: data.outputs.map((p) => p.id),
    };

    for (const pin of data.inputs) {
      node.inputs.set(pin.id, pin.signal);
    }
    for (const pin of data.outputs) {
      node.outputs.set(pin.id, pin.signal);
    }

    this.nodes.set(data.id, node);
    this.graphDirty = true;

    if (data.type === 'CLOCK') {
      const freq = (data.properties.frequency as number) ?? 1;
      this.clockScheduler.addClock(data.id, freq);
    }

    if (this.mode === 'live') {
      this.queuePropagation(data.id);
    }
  }

  removeNode(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    this.connections = this.connections.filter(
      (c) => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId
    );

    if (node.type === 'CLOCK') {
      this.clockScheduler.removeClock(nodeId);
    }

    this.nodes.delete(nodeId);
    this.subscribers.delete(nodeId);
    this.graphDirty = true;

    if (this.mode === 'live') {
      this.scheduleRecompute();
    }
  }

  updateNodeProperties(
    nodeId: string,
    properties: Record<string, unknown>
  ): void {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    Object.assign(node.properties, properties);

    if (node.type === 'CLOCK' && 'frequency' in properties) {
      this.clockScheduler.setFrequency(
        nodeId,
        (properties.frequency as number) ?? 1
      );
    }
  }

  addInputPin(nodeId: string, pinId: string): void {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    node.inputs.set(pinId, undefined);
    node.inputPinIds.push(pinId);
    this.graphDirty = true;

    if (this.mode === 'live') {
      this.queuePropagation(nodeId);
    }
  }

  removeInputPin(nodeId: string, pinId: string): void {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    this.connections = this.connections.filter(
      (c) => !(c.targetNodeId === nodeId && c.targetPinId === pinId)
    );

    node.inputs.delete(pinId);
    node.inputPinIds = node.inputPinIds.filter((id) => id !== pinId);
    this.graphDirty = true;

    if (this.mode === 'live') {
      this.queuePropagation(nodeId);
    }
  }

  addConnection(connection: Connection): void {
    if (
      !this.nodes.has(connection.sourceNodeId) ||
      !this.nodes.has(connection.targetNodeId)
    ) {
      console.warn('Cannot add connection: node not found');
      return;
    }

    const exists = this.connections.some(
      (c) =>
        c.sourceNodeId === connection.sourceNodeId &&
        c.sourcePinId === connection.sourcePinId &&
        c.targetNodeId === connection.targetNodeId &&
        c.targetPinId === connection.targetPinId
    );
    if (exists) return;

    this.connections.push(connection);
    this.graphDirty = true;

    if (this.mode === 'live') {
      this.propagateConnection(connection);
      this.queuePropagation(connection.targetNodeId);
    } else {
      this.pendingPropagations.add(connection.targetNodeId);
    }
  }

  removeConnection(connectionId: string): void {
    const connIndex = this.connections.findIndex((c) => c.id === connectionId);
    if (connIndex === -1) return;

    const connection = this.connections[connIndex];
    this.connections.splice(connIndex, 1);
    this.graphDirty = true;

    const targetNode = this.nodes.get(connection.targetNodeId);
    if (targetNode) {
      const otherConn = this.connections.find(
        (c) =>
          c.targetNodeId === connection.targetNodeId &&
          c.targetPinId === connection.targetPinId
      );
      if (!otherConn) {
        targetNode.inputs.set(connection.targetPinId, undefined);
      }

      if (this.mode === 'live') {
        this.queuePropagation(connection.targetNodeId);
      } else {
        this.pendingPropagations.add(connection.targetNodeId);
      }
    }
  }

  setInputValue(nodeId: string, value: Signal): void {
    const node = this.nodes.get(nodeId);
    if (!node || node.type !== 'INPUT') return;

    node.properties.value = value;
    node.outputs.set('out', value);

    if (this.mode === 'live') {
      this.notifySubscribers(nodeId, 'out', node.outputs.get('out'), value);
      this.propagateFromNode(nodeId);
    } else {
      this.pendingPropagations.add(nodeId);
    }
  }

  getNodeOutputs(nodeId: string): Map<string, SignalState> {
    const node = this.nodes.get(nodeId);
    if (!node) return new Map();
    return new Map(node.outputs);
  }

  getNodeInputs(nodeId: string): Map<string, SignalState> {
    const node = this.nodes.get(nodeId);
    if (!node) return new Map();
    return new Map(node.inputs);
  }

  evaluate(): void {
    const startTime = performance.now();

    this.rebuildGraphIfDirty();

    let changed = true;
    let passes = 0;
    const MAX_PASSES = 50; // Allow up to 50 passes to settle asynchronous/feedback logic

    while (changed && passes < MAX_PASSES) {
      changed = false;
      passes++;
      for (const nodeId of this.evaluationOrder) {
        if (this.evaluateNode(nodeId)) {
          changed = true;
        }
      }
    }

    if (passes === MAX_PASSES) {
      console.warn('Circuit evaluation hit pass limit - possible oscillation detected');
    }

    this.evaluationCount++;
    this.lastEvaluationTime = performance.now() - startTime;
  }

  step(): string | null {
    this.rebuildGraphIfDirty();

    for (const nodeId of this.evaluationOrder) {
      const changed = this.evaluateNode(nodeId);
      if (changed) {
        this.evaluationCount++;
        return nodeId;
      }
    }

    return null;
  }

  reset(): void {
    for (const [, node] of this.nodes) {
      for (const pinId of node.inputPinIds) {
        node.inputs.set(pinId, undefined);
      }
      for (const pinId of node.outputPinIds) {
        node.outputs.set(pinId, undefined);
      }
      if (node.type === 'INPUT') {
        node.properties.value = 0;
        node.outputs.set('out', 0);
      }
    }

    this.clockScheduler.reset();
    this.pendingPropagations.clear();
    this.propagationQueue.clear();
    this.propagationScheduled = false;

    for (const [nodeId] of this.nodes) {
      this.notifyGlobalSubscribers({
        nodeId,
        pinId: '',
        previousSignal: undefined,
        newSignal: undefined,
        timestamp: Date.now(),
      });
    }
  }

  clear(): void {
    this.clockScheduler.dispose();
    this.nodes.clear();
    this.connections = [];
    this.adjacency = new Map();
    this.evaluationOrder = [];
    this.graphDirty = true;
    this.evaluationCount = 0;
    this.lastEvaluationTime = 0;
    this.pendingPropagations = new Set();
    this.propagationQueue = new Set();
    this.propagationScheduled = false;
    this.subscribers.clear();
    // note: globalSubscribers are preserved so the store subscription stays active

    this.clockScheduler = new ClockScheduler((nodeId, value) => {
      this.handleClockTick(nodeId, value);
    });
  }



  setLiveMode(enabled: boolean): void {
    const newMode: SimulationMode = enabled ? 'live' : 'frozen';
    if (this.mode === newMode) return;

    this.mode = newMode;

    if (enabled) {
      this.clockScheduler.resume();
      this.recomputeAll();
      this.pendingPropagations.clear();
    } else {
      this.clockScheduler.pause();
    }
  }

  recomputeAll(): void {
    this.graphDirty = true;
    this.evaluate();
  }

  recomputeSubgraph(nodeId: string): void {
    this.rebuildGraphIfDirty();

    const downstream = findDownstream([nodeId], this.adjacency);
    const subOrder = sortSubset(downstream, this.evaluationOrder);

    let iterations = 0;
    for (const id of subOrder) {
      if (iterations++ > this.maxPropagationDepth) {
        console.warn('Max propagation depth reached in subgraph');
        break;
      }
      this.evaluateNode(id);
    }
  }

  queuePropagation(nodeId: string): void {
    if (this.mode === 'frozen') {
      this.pendingPropagations.add(nodeId);
      return;
    }

    this.propagationQueue.add(nodeId);
    this.schedulePropagation();
  }

  subscribeAll(callback: EngineSubscriber): () => void {
    this.globalSubscribers.add(callback);
    return () => {
      this.globalSubscribers.delete(callback);
    };
  }

  getState(): EngineState {
    return {
      mode: this.mode,
      nodeCount: this.nodes.size,
      connectionCount: this.connections.length,
      evaluationCount: this.evaluationCount,
      lastEvaluationTime: this.lastEvaluationTime,
    };
  }

  dispose(): void {
    this.clockScheduler.dispose();
    this.nodes.clear();
    this.connections = [];
    this.subscribers.clear();
    this.globalSubscribers.clear();
    this.pendingPropagations.clear();
    this.propagationQueue.clear();

    if (this.propagationScheduled) {
      this.propagationScheduled = false;
    }
  }

  private rebuildGraphIfDirty(): void {
    if (!this.graphDirty) return;

    const nodeIds = Array.from(this.nodes.keys());
    this.adjacency = buildAdjacencyList(this.connections, nodeIds);

    const result = topologicalSort(nodeIds, this.adjacency);

    if (result.hasCycle) {
      console.warn(
        `Circuit contains cycles involving nodes: ${result.cycleNodes.join(', ')}`
      );
      this.evaluationOrder = [...result.order, ...result.cycleNodes];
    } else {
      this.evaluationOrder = result.order;
    }

    this.graphDirty = false;
  }

  private evaluateNode(nodeId: string): boolean {
    const node = this.nodes.get(nodeId);
    if (!node) return false;

    this.collectInputSignals(node);

    let newOutputs: Map<string, Signal>;

    if (isGateType(node.type)) {
      const inputValues = Array.from(node.inputs.values());
      const result = evaluateGate(node.type, inputValues);
      newOutputs = new Map([['out', result]]);
    } else if (node.type === 'IC') {
      newOutputs = this.evaluateIC(node);
    } else {
      newOutputs = evaluateComponent(node.type, node.inputs);
    }

    let changed = false;
    for (const [pinId, newValue] of newOutputs) {
      const oldValue = node.outputs.get(pinId);
      if (oldValue !== newValue) {
        changed = true;
        node.outputs.set(pinId, newValue);
        this.notifySubscribers(nodeId, pinId, oldValue, newValue);
      }
    }

    return changed;
  }

  private evaluateIC(node: InternalNode): Map<string, Signal> {
    const def = node.properties.definition as any;
    if (!def) return new Map();

    // Ensure sub-engine exists
    if (!node.properties.subEngine) {
      const subEngine = new SimulationEngine();
      // Load definition into sub-engine
      def.nodes.forEach((n: any) => subEngine.addNode(n));
      def.connections.forEach((c: any) => subEngine.addConnection(c));
      node.properties.subEngine = subEngine;
    }

    const subEngine = node.properties.subEngine as SimulationEngine;

    // Map parent inputs to sub-engine input nodes
    def.inputPins.forEach((mapping: any) => {
      const parentSignal = node.inputs.get(mapping.pinId);
      subEngine.setInputValue(mapping.nodeId, (parentSignal as Signal) ?? 0);
    });

    // Force full recompute to ensure static graphs propagate correctly regardless of caching
    subEngine.recomputeAll();

    // Map sub-engine output nodes to parent outputs
    const outputs = new Map<string, Signal>();
    def.outputPins.forEach((mapping: any) => {
      const subNodeOutputs = subEngine.getNodeOutputs(mapping.nodeId);
      const signal = subNodeOutputs.get('display') ?? subNodeOutputs.get('out') ?? 0;
      outputs.set(mapping.pinId, signal as Signal);
    });

    return outputs;
  }


  private collectInputSignals(node: InternalNode): void {
    if (node.type === 'INPUT') {
      node.inputs.set('value', (node.properties.value as Signal) ?? 0);
      return;
    }
    if (node.type === 'CLOCK') {
      const clockValue = this.clockScheduler.getState(node.id);
      node.inputs.set('value', clockValue);
      return;
    }

    for (const pinId of node.inputPinIds) {
      node.inputs.set(pinId, undefined);
    }

    for (const conn of this.connections) {
      if (conn.targetNodeId !== node.id) continue;

      const sourceNode = this.nodes.get(conn.sourceNodeId);
      if (!sourceNode) continue;

      const sourceSignal = sourceNode.outputs.get(conn.sourcePinId);
      const currentSignal = node.inputs.get(conn.targetPinId);

      if (currentSignal !== undefined && sourceSignal !== undefined) {
        node.inputs.set(
          conn.targetPinId,
          (currentSignal | sourceSignal) as Signal
        );
      } else if (sourceSignal !== undefined) {
        node.inputs.set(conn.targetPinId, sourceSignal);
      }
    }
  }

  private propagateConnection(connection: Connection): void {
    const sourceNode = this.nodes.get(connection.sourceNodeId);
    const targetNode = this.nodes.get(connection.targetNodeId);
    if (!sourceNode || !targetNode) return;

    const signal = sourceNode.outputs.get(connection.sourcePinId);
    if (signal !== undefined) {
      targetNode.inputs.set(connection.targetPinId, signal);
    }
  }

  private propagateFromNode(nodeId: string): void {
    this.rebuildGraphIfDirty();
    this.recomputeSubgraph(nodeId);
  }

  private handleClockTick(nodeId: string, value: 0 | 1): void {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    node.properties.value = value;
    node.outputs.set('out', value);
    this.notifySubscribers(nodeId, 'out', value === 0 ? 1 : 0, value);

    if (this.mode === 'live') {
      this.propagateFromNode(nodeId);
    }
  }

  private schedulePropagation(): void {
    if (this.propagationScheduled) return;
    
    this.propagationScheduled = true;

    try {
      const nodes = Array.from(this.propagationQueue);
      this.propagationQueue.clear();

      if (nodes.length === 0) {
        this.propagationScheduled = false;
        return;
      }

      this.rebuildGraphIfDirty();

      const allDownstream = findDownstream(nodes, this.adjacency);
      for (const n of nodes) allDownstream.add(n);

      const subOrder = sortSubset(allDownstream, this.evaluationOrder);

      let iterations = 0;
      for (const id of subOrder) {
        if (iterations++ > this.maxPropagationDepth) {
          console.warn('Max propagation depth reached');
          break;
        }
        this.evaluateNode(id);
      }
    } finally {
      this.propagationScheduled = false;
    }
  }

  private scheduleRecompute(): void {
    queueMicrotask(() => {
      this.evaluate();
    });
  }

  private notifySubscribers(
    nodeId: string,
    pinId: string,
    previousSignal: SignalState,
    newSignal: SignalState
  ): void {
    const event: PropagationEvent = {
      nodeId,
      pinId,
      previousSignal,
      newSignal,
      timestamp: Date.now(),
    };

    const subs = this.subscribers.get(nodeId);
    if (subs) {
      for (const cb of subs) {
        try {
          cb(event);
        } catch (e) {
          console.error('Subscriber error:', e);
        }
      }
    }

    this.notifyGlobalSubscribers(event);
  }

  private notifyGlobalSubscribers(event: PropagationEvent): void {
    for (const cb of this.globalSubscribers) {
      try {
        cb(event);
      } catch (e) {
        console.error('Global subscriber error:', e);
      }
    }
  }
}

let defaultEngine: SimulationEngine | null = null;

export function getDefaultEngine(): SimulationEngine {
  if (!defaultEngine) {
    defaultEngine = new SimulationEngine();
  }
  return defaultEngine;
}

export function resetDefaultEngine(): void {
  if (defaultEngine) {
    defaultEngine.dispose();
    defaultEngine = null;
  }
}
