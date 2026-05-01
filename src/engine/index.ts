export { SimulationEngine, getDefaultEngine, resetDefaultEngine } from './SimulationEngine';
export { evaluateGate, evaluateComponent, isGateType, evaluateFullAdder, evaluateDecoder } from './gates';
export { topologicalSort, buildAdjacencyList, findDownstream, sortSubset } from './topologicalSort';
export { ClockScheduler } from './clockScheduler';
export { WasmEngine } from './WasmEngine';
export type { ClockConfig, ClockTickCallback } from './clockScheduler';
export type { TopologicalResult, AdjacencyList } from './topologicalSort';

/**
 * Engine type — the union of both engine implementations.
 * Both provide the same public API surface.
 */
export type { SimulationEngine as ISimulationEngine } from './SimulationEngine';

/**
 * Create a simulation engine, preferring WASM for performance.
 * Falls back to the TypeScript engine if WASM fails to load.
 */
export async function createEngine(): Promise<
  import('./SimulationEngine').SimulationEngine | import('./WasmEngine').WasmEngine
> {
  try {
    const { WasmEngine } = await import('./WasmEngine');
    const engine = await WasmEngine.create();
    if (import.meta.env.DEV) console.log('[LogicLab] Using Rust WASM simulation engine');
    return engine;
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[LogicLab] WASM engine failed to load, falling back to TypeScript engine:', err);
    const { SimulationEngine } = await import('./SimulationEngine');
    return new SimulationEngine();
  }
}
