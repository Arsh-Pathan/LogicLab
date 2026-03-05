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

  // Indexed connection lookups for O(1) per-pin access
  private connectionsByTarget: Map<string, Connection[]> = new Map();

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

  private maxPropagationDepth: number = 2000;

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
    this.rebuildConnectionIndex();

    if (node.type === 'CLOCK') {
      this.clockScheduler.removeClock(nodeId);
    }

    this.nodes.delete(nodeId);
    this.subscribers.delete(nodeId);
    this.graphDirty = true;

    if (this.mode === 'live') {
      this.evaluate();
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
    this.rebuildConnectionIndex();

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
    this.addToConnectionIndex(connection);
    this.graphDirty = true;

    if (this.mode === 'live') {
      this.propagateConnection(connection);
      this.propagateFromNodeSync(connection.targetNodeId);
    } else {
      this.pendingPropagations.add(connection.targetNodeId);
    }
  }

  removeConnection(connectionId: string): void {
    const connIndex = this.connections.findIndex((c) => c.id === connectionId);
    if (connIndex === -1) return;

    const connection = this.connections[connIndex];
    this.connections.splice(connIndex, 1);
    this.rebuildConnectionIndex();
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
        this.propagateFromNodeSync(connection.targetNodeId);
      } else {
        this.pendingPropagations.add(connection.targetNodeId);
      }
    }
  }

  setInputValue(nodeId: string, value: Signal): void {
    const node = this.nodes.get(nodeId);
    if (!node || node.type !== 'INPUT') return;

    node.properties.value = value;
    const oldValue = node.outputs.get('out');
    node.outputs.set('out', value);

    if (this.mode === 'live') {
      this.notifySubscribers(nodeId, 'out', oldValue, value);
      this.propagateFromNodeSync(nodeId);
    } else {
      this.pendingPropagations.add(nodeId);
    }
  }

  getNodeOutputs(nodeId: string): Map<string, SignalState> {
    const node = this.nodes.get(nodeId);
    if (!node) return new Map();
    return node.outputs;
  }

  getNodeInputs(nodeId: string): Map<string, SignalState> {
    const node = this.nodes.get(nodeId);
    if (!node) return new Map();
    return node.inputs;
  }

  evaluate(): void {
    const startTime = performance.now();

    this.rebuildGraphIfDirty();

    let changed = true;
    let passes = 0;
    const MAX_PASSES = 50;

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

    // Notify once after full evaluation
    this.notifyGlobalSubscribersOnce();
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
      // Reset IC sub-engines
      if (node.properties.subEngine) {
        (node.properties.subEngine as SimulationEngine).dispose();
        node.properties.subEngine = undefined;
      }
    }

    this.clockScheduler.reset();
    this.pendingPropagations.clear();

    this.notifyGlobalSubscribersOnce();
  }

  clear(): void {
    this.clockScheduler.dispose();
    this.nodes.clear();
    this.connections = [];
    this.connectionsByTarget = new Map();
    this.adjacency = new Map();
    this.evaluationOrder = [];
    this.graphDirty = true;
    this.evaluationCount = 0;
    this.lastEvaluationTime = 0;
    this.pendingPropagations = new Set();
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

    // Synchronous propagation - zero delay
    this.propagateFromNodeSync(nodeId);
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
    // Dispose IC sub-engines
    for (const [, node] of this.nodes) {
      if (node.properties.subEngine) {
        (node.properties.subEngine as SimulationEngine).dispose();
      }
    }
    this.nodes.clear();
    this.connections = [];
    this.connectionsByTarget = new Map();
    this.subscribers.clear();
    this.globalSubscribers.clear();
    this.pendingPropagations.clear();
  }

  // ---- Connection Index Management ----

  private rebuildConnectionIndex(): void {
    this.connectionsByTarget = new Map();
    for (const conn of this.connections) {
      const key = conn.targetNodeId;
      let list = this.connectionsByTarget.get(key);
      if (!list) {
        list = [];
        this.connectionsByTarget.set(key, list);
      }
      list.push(conn);
    }
  }

  private addToConnectionIndex(conn: Connection): void {
    const key = conn.targetNodeId;
    let list = this.connectionsByTarget.get(key);
    if (!list) {
      list = [];
      this.connectionsByTarget.set(key, list);
    }
    list.push(conn);
  }

  // ---- Graph Rebuild ----

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

    // Rebuild connection index when graph changes
    this.rebuildConnectionIndex();

    this.graphDirty = false;
  }

  // ---- Node Evaluation ----

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
      newOutputs = evaluateComponent(node.type, node.inputs, node.properties);
    }

    let changed = false;
    for (const [pinId, newValue] of newOutputs) {
      const oldValue = node.outputs.get(pinId);
      if (oldValue !== newValue) {
        changed = true;
        node.outputs.set(pinId, newValue);
      }
    }

    return changed;
  }

  private evaluateIC(node: InternalNode): Map<string, Signal> {
    const def = node.properties.definition as any;
    if (!def) return new Map();

    // Ensure sub-engine exists — create it once and reuse
    if (!node.properties.subEngine) {
      const subEngine = new SimulationEngine();
      subEngine.setLiveMode(false); // freeze while building

      for (const n of def.nodes) {
        const cleanData = {
          ...n,
          inputs: n.inputs.map((p: any) => ({ ...p, signal: undefined })),
          outputs: n.outputs.map((p: any) => ({ ...p, signal: undefined })),
          properties: { ...n.properties, value: n.type === 'INPUT' ? 0 : n.properties?.value },
        };
        subEngine.addNode(cleanData);
      }
      for (const c of def.connections) {
        subEngine.addConnection({ ...c });
      }

      // Build the graph once (don't enable live mode to avoid unnecessary overhead)
      subEngine.rebuildGraphIfDirty();
      node.properties.subEngine = subEngine;
    }

    const subEngine = node.properties.subEngine as SimulationEngine;

    // Map parent inputs to sub-engine INPUT nodes
    let inputChanged = false;
    for (const mapping of def.inputPins) {
      const parentSignal = node.inputs.get(mapping.pinId);
      const subNode = subEngine.nodes.get(mapping.nodeId);
      if (subNode) {
        const newVal = (parentSignal as Signal) ?? 0;
        const oldVal = subNode.outputs.get('out');
        if (oldVal !== newVal) {
          subNode.properties.value = newVal;
          subNode.outputs.set('out', newVal);
          inputChanged = true;
        }
      }
    }

    // Only recompute if inputs actually changed
    if (inputChanged) {
      subEngine.graphDirty = true;
      subEngine.evaluateAll();
    }

    // Map sub-engine output nodes back to parent IC outputs
    const outputs = new Map<string, Signal>();
    for (const mapping of def.outputPins) {
      const subNode = subEngine.nodes.get(mapping.nodeId);
      if (subNode) {
        const signal = subNode.outputs.get('display') ?? subNode.outputs.get('out') ?? 0;
        outputs.set(mapping.pinId, signal as Signal);
      }
    }

    return outputs;
  }

  /**
   * Lightweight evaluate that skips timing/counting overhead.
   * Used by IC sub-engines for fast inner evaluation.
   */
  private evaluateAll(): void {
    this.rebuildGraphIfDirty();

    let changed = true;
    let passes = 0;
    const MAX_PASSES = 50;

    while (changed && passes < MAX_PASSES) {
      changed = false;
      passes++;
      for (const nodeId of this.evaluationOrder) {
        if (this.evaluateNode(nodeId)) {
          changed = true;
        }
      }
    }
  }

  /**
   * Collect input signals using indexed connection lookup — O(connections_to_this_node)
   * instead of O(all_connections).
   */
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

    // Clear all inputs
    for (const pinId of node.inputPinIds) {
      node.inputs.set(pinId, undefined);
    }

    // Use indexed lookup instead of scanning all connections
    const conns = this.connectionsByTarget.get(node.id);
    if (!conns) return;

    for (const conn of conns) {
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

  /**
   * Synchronous propagation — zero delay, evaluates the full downstream
   * subgraph immediately.
   */
  private propagateFromNodeSync(nodeId: string): void {
    this.rebuildGraphIfDirty();

    const downstream = findDownstream([nodeId], this.adjacency);
    downstream.add(nodeId);
    const subOrder = sortSubset(downstream, this.evaluationOrder);

    let iterations = 0;
    for (const id of subOrder) {
      if (iterations++ > this.maxPropagationDepth) {
        console.warn('Max propagation depth reached');
        break;
      }
      this.evaluateNode(id);
    }

    // Single notification after all propagation is done
    this.notifyGlobalSubscribersOnce();
  }

  private handleClockTick(nodeId: string, value: 0 | 1): void {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    node.properties.value = value;
    node.outputs.set('out', value);

    if (this.mode === 'live') {
      this.propagateFromNodeSync(nodeId);
    }
  }

  /**
   * Batch notification — fires a single global event so the store
   * only updates React state once per propagation cycle.
   */
  private notifyGlobalSubscribersOnce(): void {
    if (this.globalSubscribers.size === 0) return;
    const event: PropagationEvent = {
      nodeId: '',
      pinId: '',
      previousSignal: undefined,
      newSignal: undefined,
      timestamp: Date.now(),
    };
    for (const cb of this.globalSubscribers) {
      try {
        cb(event);
      } catch (e) {
        console.error('Global subscriber error:', e);
      }
    }
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
