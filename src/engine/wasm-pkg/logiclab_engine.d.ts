/* tslint:disable */
/* eslint-disable */

export class WasmSimulationEngine {
    free(): void;
    [Symbol.dispose](): void;
    addConnection(conn: any): void;
    addInputPin(node_id: string, pin_id: string): void;
    addNode(data: any): void;
    clear(): void;
    dispose(): void;
    evaluate(): void;
    /**
     * Bulk signal read - returns all signals for all nodes at once.
     * Much more efficient than calling getNodeOutputs/getNodeInputs per node.
     */
    getAllSignals(): any;
    getNodeInputs(node_id: string): any;
    getNodeOutputs(node_id: string): any;
    getState(): any;
    constructor();
    recomputeAll(): void;
    recomputeSubgraph(node_id: string): void;
    removeConnection(connection_id: string): void;
    removeInputPin(node_id: string, pin_id: string): void;
    removeNode(node_id: string): void;
    reset(): void;
    setClockValue(node_id: string, value: number): void;
    setInputValue(node_id: string, value: number): void;
    setLiveMode(enabled: boolean): void;
    step(): any;
    updateNodeProperties(node_id: string, props: any): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_wasmsimulationengine_free: (a: number, b: number) => void;
    readonly wasmsimulationengine_addConnection: (a: number, b: number, c: number) => void;
    readonly wasmsimulationengine_addInputPin: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly wasmsimulationengine_addNode: (a: number, b: number, c: number) => void;
    readonly wasmsimulationengine_clear: (a: number) => void;
    readonly wasmsimulationengine_dispose: (a: number) => void;
    readonly wasmsimulationengine_evaluate: (a: number) => void;
    readonly wasmsimulationengine_getAllSignals: (a: number) => number;
    readonly wasmsimulationengine_getNodeInputs: (a: number, b: number, c: number) => number;
    readonly wasmsimulationengine_getNodeOutputs: (a: number, b: number, c: number) => number;
    readonly wasmsimulationengine_getState: (a: number) => number;
    readonly wasmsimulationengine_new: () => number;
    readonly wasmsimulationengine_recomputeAll: (a: number) => void;
    readonly wasmsimulationengine_recomputeSubgraph: (a: number, b: number, c: number) => void;
    readonly wasmsimulationengine_removeConnection: (a: number, b: number, c: number) => void;
    readonly wasmsimulationengine_removeInputPin: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly wasmsimulationengine_removeNode: (a: number, b: number, c: number) => void;
    readonly wasmsimulationengine_reset: (a: number) => void;
    readonly wasmsimulationengine_setClockValue: (a: number, b: number, c: number, d: number) => void;
    readonly wasmsimulationengine_setInputValue: (a: number, b: number, c: number, d: number) => void;
    readonly wasmsimulationengine_setLiveMode: (a: number, b: number) => void;
    readonly wasmsimulationengine_step: (a: number) => number;
    readonly wasmsimulationengine_updateNodeProperties: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly __wbindgen_export: (a: number, b: number) => number;
    readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_export3: (a: number) => void;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
