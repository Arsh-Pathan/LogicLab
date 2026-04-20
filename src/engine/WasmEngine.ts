/**
 * WasmEngine — TypeScript wrapper around the Rust WASM simulation engine.
 * Provides the exact same public API as SimulationEngine so the circuit store
 * can use either engine interchangeably.
 *
 * Clock scheduling still uses JS timers (setTimeout). The WASM engine handles
 * signal propagation, topological sort, and evaluation.
 */

import type {
  Signal,
  SignalState,
  SimulationMode,
  EngineState,
  EngineSubscriber,
  CircuitNodeData,
  Connection,
} from '@/types/circuit';
import { ClockScheduler } from './clockScheduler';

// Dynamic import type — the actual WASM module is loaded asynchronously
type WasmModule = typeof import('./wasm-pkg/logiclab_engine');
type WasmEngineInstance = InstanceType<Awaited<WasmModule>['WasmSimulationEngine']>;

let wasmModule: WasmModule | null = null;
let wasmInitPromise: Promise<WasmModule> | null = null;

async function loadWasm(): Promise<WasmModule> {
  if (wasmModule) return wasmModule;
  if (wasmInitPromise) return wasmInitPromise;

  wasmInitPromise = (async () => {
    const mod = await import('./wasm-pkg/logiclab_engine');
    await mod.default();
    wasmModule = mod;
    return mod;
  })();

  return wasmInitPromise;
}

export class WasmEngine {
  private wasm: WasmEngineInstance;
  private mode: SimulationMode = 'live';
  private globalSubscribers: Set<EngineSubscriber> = new Set();
  private clockScheduler: ClockScheduler;
  private pendingPropagations: Set<string> = new Set();

  private constructor(wasmEngine: WasmEngineInstance) {
    this.wasm = wasmEngine;
    this.clockScheduler = new ClockScheduler((nodeId, value) => {
      this.handleClockTick(nodeId, value);
    });
  }

  static async create(): Promise<WasmEngine> {
    const mod = await loadWasm();
    const wasmEngine = new mod.WasmSimulationEngine();
    return new WasmEngine(wasmEngine);
  }

  // ── Node Management ──────────────────────────────────────

  addNode(data: CircuitNodeData): void {
    // Convert to the format WASM expects (camelCase)
    const wasmData = {
      id: data.id,
      type: data.type,
      label: data.label,
      inputs: data.inputs.map((p) => ({
        id: p.id,
        label: p.label,
        type: p.type,
        signal: p.signal,
        side: p.side,
        index: p.index,
      })),
      outputs: data.outputs.map((p) => ({
        id: p.id,
        label: p.label,
        type: p.type,
        signal: p.signal,
        side: p.side,
        index: p.index,
      })),
      rotation: data.rotation,
      properties: data.properties,
    };

    this.wasm.addNode(wasmData);

    if (data.type === 'CLOCK') {
      const freq = (data.properties.frequency as number) ?? 1;
      this.clockScheduler.addClock(data.id, freq);
    }

    if (this.mode === 'live') {
      this.notifyGlobalSubscribersOnce();
    }
  }

  removeNode(nodeId: string): void {
    this.clockScheduler.removeClock(nodeId);
    this.wasm.removeNode(nodeId);
    if (this.mode === 'live') {
      this.notifyGlobalSubscribersOnce();
    }
  }

  updateNodeProperties(
    nodeId: string,
    properties: Record<string, unknown>
  ): void {
    this.wasm.updateNodeProperties(nodeId, properties);

    if ('frequency' in properties) {
      this.clockScheduler.setFrequency(
        nodeId,
        (properties.frequency as number) ?? 1
      );
    }
  }

  addInputPin(nodeId: string, pinId: string): void {
    this.wasm.addInputPin(nodeId, pinId);
    if (this.mode === 'live') {
      this.wasm.recomputeSubgraph(nodeId);
      this.notifyGlobalSubscribersOnce();
    }
  }

  removeInputPin(nodeId: string, pinId: string): void {
    this.wasm.removeInputPin(nodeId, pinId);
    if (this.mode === 'live') {
      this.wasm.recomputeSubgraph(nodeId);
      this.notifyGlobalSubscribersOnce();
    }
  }

  // ── Connection Management ────────────────────────────────

  addConnection(connection: Connection): void {
    this.wasm.addConnection({
      id: connection.id,
      sourceNodeId: connection.sourceNodeId,
      sourcePinId: connection.sourcePinId,
      targetNodeId: connection.targetNodeId,
      targetPinId: connection.targetPinId,
    });

    if (this.mode === 'live') {
      this.notifyGlobalSubscribersOnce();
    }
  }

  removeConnection(connectionId: string): void {
    this.wasm.removeConnection(connectionId);
    if (this.mode === 'live') {
      this.notifyGlobalSubscribersOnce();
    }
  }

  // ── Input Control ────────────────────────────────────────

  setInputValue(nodeId: string, value: Signal): void {
    this.wasm.setInputValue(nodeId, value);
    if (this.mode === 'live') {
      this.notifyGlobalSubscribersOnce();
    }
  }

  // ── Data Access ──────────────────────────────────────────

  getNodeOutputs(nodeId: string): Map<string, SignalState> {
    const raw = this.wasm.getNodeOutputs(nodeId);
    if (!raw) return new Map();
    return this.toSignalMap(raw);
  }

  getNodeInputs(nodeId: string): Map<string, SignalState> {
    const raw = this.wasm.getNodeInputs(nodeId);
    if (!raw) return new Map();
    return this.toSignalMap(raw);
  }

  // ── Simulation Control ───────────────────────────────────

  evaluate(): void {
    this.wasm.evaluate();
    this.notifyGlobalSubscribersOnce();
  }

  step(): string | null {
    const result = this.wasm.step();
    if (result) {
      this.notifyGlobalSubscribersOnce();
    }
    return result ?? null;
  }

  reset(): void {
    this.wasm.reset();
    this.clockScheduler.reset();
    this.pendingPropagations.clear();
    this.notifyGlobalSubscribersOnce();
  }

  clear(): void {
    this.clockScheduler.dispose();
    this.wasm.clear();
    this.pendingPropagations.clear();
    // Note: globalSubscribers preserved (like TS engine)
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
      this.wasm.setLiveMode(true);
      this.recomputeAll();
      this.pendingPropagations.clear();
    } else {
      this.clockScheduler.pause();
      this.wasm.setLiveMode(false);
    }
  }

  recomputeAll(): void {
    this.wasm.recomputeAll();
    this.notifyGlobalSubscribersOnce();
  }

  recomputeSubgraph(nodeId: string): void {
    this.wasm.recomputeSubgraph(nodeId);
    this.notifyGlobalSubscribersOnce();
  }

  queuePropagation(nodeId: string): void {
    if (this.mode === 'frozen') {
      this.pendingPropagations.add(nodeId);
      return;
    }
    this.wasm.recomputeSubgraph(nodeId);
    this.notifyGlobalSubscribersOnce();
  }

  // ── Subscription ─────────────────────────────────────────

  subscribeAll(callback: EngineSubscriber): () => void {
    this.globalSubscribers.add(callback);
    return () => {
      this.globalSubscribers.delete(callback);
    };
  }

  // ── Query ────────────────────────────────────────────────

  getState(): EngineState {
    const raw = this.wasm.getState();
    return {
      mode: raw.mode ?? this.mode,
      nodeCount: raw.nodeCount ?? 0,
      connectionCount: raw.connectionCount ?? 0,
      evaluationCount: raw.evaluationCount ?? 0,
      lastEvaluationTime: (raw.lastEvaluationTimeUs ?? 0) / 1000, // μs → ms
    };
  }

  // ── Lifecycle ────────────────────────────────────────────

  dispose(): void {
    this.clockScheduler.dispose();
    this.wasm.dispose();
    this.globalSubscribers.clear();
    this.pendingPropagations.clear();
  }

  // ── Private Helpers ──────────────────────────────────────

  private handleClockTick(nodeId: string, value: 0 | 1): void {
    this.wasm.setClockValue(nodeId, value);
    if (this.mode === 'live') {
      this.notifyGlobalSubscribersOnce();
    }
  }

  private notifyGlobalSubscribersOnce(): void {
    for (const cb of this.globalSubscribers) {
      try {
        cb({
          nodeId: '',
          pinId: '',
          previousSignal: undefined,
          newSignal: undefined,
          timestamp: Date.now(),
        });
      } catch {
        // Subscriber error should not crash the engine
      }
    }
  }

  /**
   * Convert a plain object { pinId: number|null } from WASM
   * into a Map<string, SignalState> that the store expects.
   */
  private toSignalMap(raw: Record<string, number | null>): Map<string, SignalState> {
    const map = new Map<string, SignalState>();
    for (const [key, val] of Object.entries(raw)) {
      if (val === null || val === undefined) {
        map.set(key, undefined);
      } else {
        map.set(key, val as Signal);
      }
    }
    return map;
  }
}
