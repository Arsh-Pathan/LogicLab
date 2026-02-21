// ============================================================
// Circuit Store — Zustand
// Bridges React Flow state with the simulation engine.
// ============================================================

import { create } from 'zustand';
import {
  Node,
  Edge,
  Connection as RFConnection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  XYPosition,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import {
  CircuitNodeData,
  ComponentType,
  Connection,
  GateType,
  Signal,
  SignalState,
  Rotation,
  DEFAULT_INPUT_COUNTS,
  ICDefinition,
  HistoryEntry,
  SimulationMode,
  Pin,
} from '../types/circuit';
import { SimulationEngine } from '../engine/SimulationEngine';
import { isGateType } from '../engine/gates';

// ============================================================
// Helper: Create default pins for a component type
// ============================================================

function createInputPins(type: ComponentType, count?: number): Pin[] {
  if (type === 'INPUT' || type === 'CLOCK') return [];
  if (type === 'OUTPUT' || type === 'LED')
    return [{ id: 'in_0', label: 'IN', type: 'input', signal: undefined, index: 0 }];
  if (type === 'NOT' || type === 'BUFFER')
    return [{ id: 'in_0', label: 'A', type: 'input', signal: undefined, index: 0 }];

  if (type === 'HALF_ADDER')
    return [
      { id: 'in_0', label: 'A', type: 'input', signal: undefined, index: 0 },
      { id: 'in_1', label: 'B', type: 'input', signal: undefined, index: 1 },
    ];
  if (type === 'FULL_ADDER')
    return [
      { id: 'in_0', label: 'A', type: 'input', signal: undefined, index: 0 },
      { id: 'in_1', label: 'B', type: 'input', signal: undefined, index: 1 },
      { id: 'in_2', label: 'Cin', type: 'input', signal: undefined, index: 2 },
    ];
  if (type === 'DECODER')
    return [
      { id: 'in_0', label: 'A', type: 'input', signal: undefined, index: 0 },
      { id: 'in_1', label: 'B', type: 'input', signal: undefined, index: 1 },
    ];
  if (type === 'SEVEN_SEGMENT')
    return [0, 1, 2, 3, 4, 5, 6].map((i) => ({
      id: `in_${i}`,
      label: `S${i}`,
      type: 'input' as const,
      signal: undefined as SignalState,
      index: i,
    }));
  if (type === 'JUNCTION')
    return [{ id: 'in', label: 'IN', type: 'input', signal: undefined, index: 0 }];

  // Default: gates with variable inputs
  const numInputs = count ?? (isGateType(type) ? DEFAULT_INPUT_COUNTS[type as GateType] : 2);
  return Array.from({ length: numInputs }, (_, i) => ({
    id: `in_${i}`,
    label: String.fromCharCode(65 + i), // A, B, C, ...
    type: 'input' as const,
    signal: undefined as SignalState,
    index: i,
  }));
}

function createOutputPins(type: ComponentType): Pin[] {
  if (type === 'INPUT' || type === 'CLOCK')
    return [{ id: 'out', label: 'OUT', type: 'output', signal: undefined, index: 0 }];
  if (type === 'OUTPUT' || type === 'LED')
    return [{ id: 'display', label: 'Q', type: 'output', signal: undefined, index: 0 }];
  if (type === 'HALF_ADDER')
    return [
      { id: 'sum', label: 'S', type: 'output', signal: undefined, index: 0 },
      { id: 'carry', label: 'C', type: 'output', signal: undefined, index: 1 },
    ];
  if (type === 'FULL_ADDER')
    return [
      { id: 'sum', label: 'S', type: 'output', signal: undefined, index: 0 },
      { id: 'cout', label: 'Cout', type: 'output', signal: undefined, index: 1 },
    ];
  if (type === 'DECODER')
    return [0, 1, 2, 3].map((i) => ({
      id: `y${i}`,
      label: `Y${i}`,
      type: 'output' as const,
      signal: undefined as SignalState,
      index: i,
    }));
  if (type === 'SEVEN_SEGMENT')
    return [{ id: 'display', label: 'DISP', type: 'output', signal: undefined, index: 0 }];
  if (type === 'JUNCTION')
    return [0, 1, 2, 3, 4].map((i) => ({
      id: `out_${i}`,
      label: `OUT${i}`,
      type: 'output' as const,
      signal: undefined as SignalState,
      index: i,
    }));

  // Default: single output
  return [{ id: 'out', label: 'OUT', type: 'output', signal: undefined, index: 0 }];
}

function createCircuitNodeData(
  type: ComponentType,
  id: string,
  label?: string,
  inputCount?: number,
  icDefinition?: ICDefinition
): CircuitNodeData {
  const inputs = icDefinition
    ? icDefinition.inputPins.map((p, i) => ({ id: p.pinId, label: p.label, type: 'input' as const, index: i, signal: undefined as SignalState }))
    : createInputPins(type, inputCount);

  const outputs = icDefinition
    ? icDefinition.outputPins.map((p, i) => ({ id: p.pinId, label: p.label, type: 'output' as const, index: i, signal: undefined as SignalState }))
    : createOutputPins(type);


  return {
    id,
    type,
    label: label ?? (icDefinition ? icDefinition.name : type),
    inputs,
    outputs,
    rotation: 0,
    properties: {
      ...(type === 'CLOCK' ? { frequency: 1, value: 0 } : type === 'INPUT' ? { value: 0 } : {}),
      ...(icDefinition ? { definition: icDefinition } : {}),
    },
  };
}


// ============================================================
// Store Types
// ============================================================

interface CircuitState {
  // React Flow state
  nodes: Node<CircuitNodeData>[];
  edges: Edge[];

  // Engine
  engine: SimulationEngine;
  simulationMode: SimulationMode;

  // Signal cache for rendering
  signalCache: Map<string, Map<string, SignalState>>;

  // Custom ICs
  customICs: ICDefinition[];

  // Undo/Redo
  history: HistoryEntry[];
  historyIndex: number;
  maxHistorySize: number;

  // Clipboard
  clipboard: { nodes: Node<CircuitNodeData>[]; edges: Edge[] } | null;

  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: RFConnection) => void;

  addNode: (type: ComponentType, position: XYPosition, label?: string, icDefinitionId?: string) => string;
  removeNodes: (ids: string[]) => void;
  removeEdges: (ids: string[]) => void;

  toggleInput: (nodeId: string) => void;
  setInputValue: (nodeId: string, value: Signal) => void;

  rotateNode: (nodeId: string) => void;
  setRotation: (nodeId: string, rotation: Rotation) => void;
  renameNode: (nodeId: string, label: string) => void;
  addInputToGate: (nodeId: string) => void;
  removeInputFromGate: (nodeId: string) => void;

  setSimulationMode: (mode: SimulationMode) => void;
  resetSimulation: () => void;
  stepSimulation: () => void;

  updateSignalCache: () => void;

  // Undo/Redo
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Copy/Paste
  copySelection: (selectedNodeIds: string[]) => void;
  pasteClipboard: (offset: XYPosition) => void;

  // Custom ICs
  createIC: (name: string, nodeIds: string[], inputMarkers: string[], outputMarkers: string[]) => ICDefinition | null;
  addCustomIC: (definition: ICDefinition) => void;

  // Project management
  clearCircuit: () => void;
  loadCircuit: (nodes: Node<CircuitNodeData>[], edges: Edge[], customICs?: ICDefinition[]) => void;

  // Copied from below
  setClockFrequency: (nodeId: string, frequency: number) => void;
  splitEdge: (edgeId: string, position: XYPosition) => void;
}

// ============================================================
// Store Implementation
// ============================================================

export const useCircuitStore = create<CircuitState>((set, get) => {
  const engine = new SimulationEngine();

  // Subscribe to engine changes to update signal cache
  engine.subscribeAll(() => {
    const state = get();
    state.updateSignalCache();
  });

  return {
    nodes: [],
    edges: [],
    engine,
    simulationMode: 'live',
    signalCache: new Map(),
    customICs: [],
    history: [],
    historyIndex: -1,
    maxHistorySize: 50,
    clipboard: null,

    // --------------------------------------------------------
    // React Flow Callbacks
    // --------------------------------------------------------

    onNodesChange: (changes) => {
      set((state) => ({
        nodes: applyNodeChanges(changes, state.nodes),
      }));
    },

    onEdgesChange: (changes) => {
      const state = get();
      // Handle edge removals in engine
      for (const change of changes) {
        if (change.type === 'remove') {
          state.engine.removeConnection(change.id);
        }
      }
      set((state) => ({
        edges: applyEdgeChanges(changes, state.edges),
      }));
    },

    onConnect: (connection) => {
      if (!connection.source || !connection.target) return;
      if (!connection.sourceHandle || !connection.targetHandle) return;

      const state = get();
      state.pushHistory();

      const edgeId = uuidv4();
      const engineConnection: Connection = {
        id: edgeId,
        sourceNodeId: connection.source,
        sourcePinId: connection.sourceHandle,
        targetNodeId: connection.target,
        targetPinId: connection.targetHandle,
      };

      state.engine.addConnection(engineConnection);

      const newEdge: Edge = {
        id: edgeId,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        type: 'wire',
      };

      set((state) => ({
        edges: addEdge(newEdge, state.edges),
      }));

      // Update signal cache after connection
      setTimeout(() => get().updateSignalCache(), 0);
    },

    // --------------------------------------------------------
    // Node Management
    // --------------------------------------------------------

    addNode: (type, position, label, icDefinitionId) => {
      const state = get();
      state.pushHistory();

      const icDef = icDefinitionId 
        ? state.customICs.find(ic => ic.id === icDefinitionId)
        : undefined;

      const id = uuidv4();
      const nodeData = createCircuitNodeData(type, id, label, undefined, icDef);

      const rfNode: Node<CircuitNodeData> = {
        id,
        type: getNodeType(type),
        position,
        data: nodeData,
      };

      state.engine.addNode(nodeData);

      set((state) => ({
        nodes: [...state.nodes, rfNode],
      }));

      get().updateSignalCache();
      return id;
    },


    removeNodes: (ids) => {
      const state = get();
      state.pushHistory();

      for (const id of ids) {
        state.engine.removeNode(id);
      }

      const idSet = new Set(ids);
      set((state) => ({
        nodes: state.nodes.filter((n) => !idSet.has(n.id)),
        edges: state.edges.filter(
          (e) => !idSet.has(e.source) && !idSet.has(e.target)
        ),
      }));
    },

    removeEdges: (ids) => {
      const state = get();
      state.pushHistory();

      for (const id of ids) {
        state.engine.removeConnection(id);
      }

      const idSet = new Set(ids);
      set((state) => ({
        edges: state.edges.filter((e) => !idSet.has(e.id)),
      }));

      get().updateSignalCache();
    },

    // --------------------------------------------------------
    // Input Control
    // --------------------------------------------------------

    toggleInput: (nodeId) => {
      const state = get();
      const node = state.nodes.find((n) => n.id === nodeId);
      if (!node || node.data.type !== 'INPUT') return;

      const currentValue = (node.data.properties.value as Signal) ?? 0;
      const newValue: Signal = currentValue === 0 ? 1 : 0;

      state.engine.setInputValue(nodeId, newValue);

      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  properties: { ...n.data.properties, value: newValue },
                  outputs: n.data.outputs.map((p) =>
                    p.id === 'out' ? { ...p, signal: newValue } : p
                  ),
                },
              }
            : n
        ),
      }));

      get().updateSignalCache();
    },

    setInputValue: (nodeId, value) => {
      const state = get();
      state.engine.setInputValue(nodeId, value);

      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  properties: { ...n.data.properties, value },
                  outputs: n.data.outputs.map((p) =>
                    p.id === 'out' ? { ...p, signal: value } : p
                  ),
                },
              }
            : n
        ),
      }));

      get().updateSignalCache();
    },

    // --------------------------------------------------------
    // Node Editing
    // --------------------------------------------------------

    rotateNode: (nodeId) => {
      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  rotation: (((n.data.rotation ?? 0) + 90) % 360) as Rotation,
                },
              }
            : n
        ),
      }));
    },

    setRotation: (nodeId, rotation) => {
      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, rotation } }
            : n
        ),
      }));
    },

    renameNode: (nodeId, label) => {
      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, label } }
            : n
        ),
      }));
    },

    addInputToGate: (nodeId) => {
      const state = get();
      const node = state.nodes.find((n) => n.id === nodeId);
      if (!node || !isGateType(node.data.type)) return;

      const currentInputs = node.data.inputs.length;
      const newPinIndex = currentInputs;
      const newPinId = `in_${newPinIndex}`;
      const newPin: Pin = {
        id: newPinId,
        label: String.fromCharCode(65 + newPinIndex),
        type: 'input',
        signal: undefined,
        index: newPinIndex,
      };

      state.engine.addInputPin(nodeId, newPinId);

      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  inputs: [...n.data.inputs, newPin],
                },
              }
            : n
        ),
      }));
    },

    removeInputFromGate: (nodeId) => {
      const state = get();
      const node = state.nodes.find((n) => n.id === nodeId);
      if (!node || !isGateType(node.data.type)) return;
      if (node.data.inputs.length <= 1) return;

      const lastPin = node.data.inputs[node.data.inputs.length - 1];
      state.engine.removeInputPin(nodeId, lastPin.id);

      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  inputs: n.data.inputs.slice(0, -1),
                },
              }
            : n
        ),
      }));
    },

    // --------------------------------------------------------
    // Simulation Control
    // --------------------------------------------------------

    setSimulationMode: (mode) => {
      const state = get();
      state.engine.setLiveMode(mode === 'live');
      set({ simulationMode: mode });

      if (mode === 'live') {
        get().updateSignalCache();
      }
    },

    resetSimulation: () => {
      const state = get();
      state.engine.reset();
      set((state) => ({
        nodes: state.nodes.map((n) => ({
          ...n,
          data: {
            ...n.data,
            outputs: n.data.outputs.map((p) => ({ ...p, signal: undefined })),
            properties:
              n.data.type === 'INPUT'
                ? { ...n.data.properties, value: 0 }
                : n.data.properties,
          },
        })),
        signalCache: new Map(),
      }));
    },

    stepSimulation: () => {
      const state = get();
      state.engine.step();
      state.updateSignalCache();
    },

    updateSignalCache: () => {
      const state = get();
      const newCache = new Map<string, Map<string, SignalState>>();

      for (const node of state.nodes) {
        const outputs = state.engine.getNodeOutputs(node.id);
        if (outputs.size > 0) {
          newCache.set(node.id, outputs);
        }
      }

      // Also update the React Flow node data with current signals
      set((prev) => ({
        signalCache: newCache,
        nodes: prev.nodes.map((n) => {
          const outputs = newCache.get(n.id);
          if (!outputs) return n;

          const inputs = state.engine.getNodeInputs(n.id);

          return {
            ...n,
            data: {
              ...n.data,
              outputs: n.data.outputs.map((p) => ({
                ...p,
                signal: outputs.get(p.id) ?? p.signal,
              })),
              inputs: n.data.inputs.map((p) => ({
                ...p,
                signal: inputs.get(p.id) ?? p.signal,
              })),
            },
          };
        }),
      }));
    },

    // --------------------------------------------------------
    // Undo/Redo
    // --------------------------------------------------------

    pushHistory: () => {
      const state = get();
      const entry: HistoryEntry = {
        nodes: state.nodes.map((n) => ({ ...n.data })),
        connections: state.edges.map((e) => ({
          id: e.id,
          sourceNodeId: e.source,
          sourcePinId: e.sourceHandle ?? '',
          targetNodeId: e.target,
          targetPinId: e.targetHandle ?? '',
        })),
        positions: state.nodes.map((n) => ({
          nodeId: n.id,
          x: n.position.x,
          y: n.position.y,
        })),
        timestamp: Date.now(),
      };

      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(entry);

      if (newHistory.length > state.maxHistorySize) {
        newHistory.shift();
      }

      set({
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    undo: () => {
      const state = get();
      if (state.historyIndex < 0) return;

      const entry = state.history[state.historyIndex];
      if (!entry) return;

      // Rebuild from history entry
      const posMap = new Map(entry.positions.map((p) => [p.nodeId, { x: p.x, y: p.y }]));

      const rfNodes: Node<CircuitNodeData>[] = entry.nodes.map((data) => ({
        id: data.id,
        type: getNodeType(data.type),
        position: posMap.get(data.id) ?? { x: 0, y: 0 },
        data,
      }));

      const rfEdges: Edge[] = entry.connections.map((c) => ({
        id: c.id,
        source: c.sourceNodeId,
        target: c.targetNodeId,
        sourceHandle: c.sourcePinId,
        targetHandle: c.targetPinId,
        type: 'wire',
      }));

      // Rebuild engine
      state.engine.dispose();
      const newEngine = new SimulationEngine();
      for (const data of entry.nodes) {
        newEngine.addNode(data);
      }
      for (const conn of entry.connections) {
        newEngine.addConnection(conn);
      }
      newEngine.evaluate();

      set({
        nodes: rfNodes,
        edges: rfEdges,
        engine: newEngine,
        historyIndex: state.historyIndex - 1,
      });
    },

    redo: () => {
      const state = get();
      if (state.historyIndex >= state.history.length - 1) return;

      const nextIndex = state.historyIndex + 1;
      const entry = state.history[nextIndex];
      if (!entry) return;

      const posMap = new Map(entry.positions.map((p) => [p.nodeId, { x: p.x, y: p.y }]));

      const rfNodes: Node<CircuitNodeData>[] = entry.nodes.map((data) => ({
        id: data.id,
        type: getNodeType(data.type),
        position: posMap.get(data.id) ?? { x: 0, y: 0 },
        data,
      }));

      const rfEdges: Edge[] = entry.connections.map((c) => ({
        id: c.id,
        source: c.sourceNodeId,
        target: c.targetNodeId,
        sourceHandle: c.sourcePinId,
        targetHandle: c.targetPinId,
        type: 'wire',
      }));

      // Rebuild engine
      state.engine.dispose();
      const newEngine = new SimulationEngine();
      for (const data of entry.nodes) {
        newEngine.addNode(data);
      }
      for (const conn of entry.connections) {
        newEngine.addConnection(conn);
      }
      newEngine.evaluate();

      set({
        nodes: rfNodes,
        edges: rfEdges,
        engine: newEngine,
        historyIndex: nextIndex,
      });
    },

    // --------------------------------------------------------
    // Copy/Paste
    // --------------------------------------------------------

    copySelection: (selectedNodeIds) => {
      const state = get();
      const idSet = new Set(selectedNodeIds);
      const selectedNodes = state.nodes.filter((n) => idSet.has(n.id));
      const selectedEdges = state.edges.filter(
        (e) => idSet.has(e.source) && idSet.has(e.target)
      );

      set({ clipboard: { nodes: selectedNodes, edges: selectedEdges } });
    },

    pasteClipboard: (offset) => {
      const state = get();
      if (!state.clipboard) return;
      state.pushHistory();

      const idMap = new Map<string, string>();

      // Create new IDs for pasted nodes
      for (const node of state.clipboard.nodes) {
        idMap.set(node.id, uuidv4());
      }

      const newNodes: Node<CircuitNodeData>[] = state.clipboard.nodes.map((n) => {
        const newId = idMap.get(n.id)!;
        const newData = { ...n.data, id: newId };
        state.engine.addNode(newData);
        return {
          ...n,
          id: newId,
          position: { x: n.position.x + offset.x, y: n.position.y + offset.y },
          data: newData,
          selected: true,
        };
      });

      const newEdges: Edge[] = state.clipboard.edges.map((e) => {
        const newId = uuidv4();
        const engineConn: Connection = {
          id: newId,
          sourceNodeId: idMap.get(e.source) ?? e.source,
          sourcePinId: e.sourceHandle ?? '',
          targetNodeId: idMap.get(e.target) ?? e.target,
          targetPinId: e.targetHandle ?? '',
        };
        state.engine.addConnection(engineConn);
        return {
          ...e,
          id: newId,
          source: idMap.get(e.source) ?? e.source,
          target: idMap.get(e.target) ?? e.target,
        };
      });

      set((prev) => ({
        nodes: [
          ...prev.nodes.map((n) => ({ ...n, selected: false })),
          ...newNodes,
        ],
        edges: [...prev.edges, ...newEdges],
      }));

      setTimeout(() => get().updateSignalCache(), 0);
    },

    // --------------------------------------------------------
    // Custom ICs
    // --------------------------------------------------------

    createIC: (name, nodeIds, inputMarkers, outputMarkers) => {
      const state = get();
      const idSet = new Set(nodeIds);

      const icNodes = state.nodes
        .filter((n) => idSet.has(n.id))
        .map((n) => n.data);

      const icConnections: Connection[] = state.edges
        .filter((e) => idSet.has(e.source) && idSet.has(e.target))
        .map((e) => ({
          id: e.id,
          sourceNodeId: e.source,
          sourcePinId: e.sourceHandle ?? '',
          targetNodeId: e.target,
          targetPinId: e.targetHandle ?? '',
        }));

      const inputPins = inputMarkers.map((nodeId, i) => ({
        pinId: `ic_in_${i}`,
        nodeId,
        label: `IN${i}`,
      }));

      const outputPins = outputMarkers.map((nodeId, i) => ({
        pinId: `ic_out_${i}`,
        nodeId,
        label: `OUT${i}`,
      }));

      const icDef: ICDefinition = {
        id: uuidv4(),
        name,
        description: `Custom IC: ${name}`,
        nodes: icNodes,
        connections: icConnections,
        inputPins,
        outputPins,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        customICs: [...state.customICs, icDef],
      }));

      return icDef;
    },

    addCustomIC: (definition) => {
      set((state) => ({
        customICs: [...state.customICs, definition],
      }));
    },

    // --------------------------------------------------------
    // Project Management
    // --------------------------------------------------------

    clearCircuit: () => {
      const state = get();
      state.engine.clear();

      set({
        nodes: [],
        edges: [],
        signalCache: new Map(),
        history: [],
        historyIndex: -1,
        clipboard: null,
      });
    },

    loadCircuit: (nodes, edges, customICs) => {
      const state = get();
      state.engine.clear();

      // Add nodes to engine
      for (const node of nodes) {
        state.engine.addNode(node.data);
      }

      // Add connections to engine
      for (const edge of edges) {
        state.engine.addConnection({
          id: edge.id,
          sourceNodeId: edge.source,
          sourcePinId: edge.sourceHandle ?? '',
          targetNodeId: edge.target,
          targetPinId: edge.targetHandle ?? '',
        });
      }

      state.engine.evaluate();

      set({
        nodes,
        edges,
        customICs: customICs ?? [],
        signalCache: new Map(),
        history: [],
        historyIndex: -1,
      });

      setTimeout(() => get().updateSignalCache(), 0);
    },

    // --------------------------------------------------------
    // Clock
    // --------------------------------------------------------

    setClockFrequency: (nodeId, frequency) => {
      const state = get();
      state.engine.updateNodeProperties(nodeId, { frequency });

      set((prev) => ({
        nodes: prev.nodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  properties: { ...n.data.properties, frequency },
                },
              }
            : n
        ),
      }));
    },

    splitEdge: (edgeId, position) => {
      const state = get();
      const edge = state.edges.find((e) => e.id === edgeId);
      if (!edge) return;

      state.pushHistory();

      const junctionId = uuidv4();
      const junctionData = createCircuitNodeData('JUNCTION', junctionId);
      state.engine.addNode(junctionData);

      const rfJunctionNode: Node<CircuitNodeData> = {
        id: junctionId,
        type: 'junction',
        position,
        data: junctionData,
      };

      state.engine.removeConnection(edgeId);

      const edgeAId = uuidv4();
      const edgeBId = uuidv4();

      state.engine.addConnection({
        id: edgeAId,
        sourceNodeId: edge.source,
        sourcePinId: edge.sourceHandle ?? '',
        targetNodeId: junctionId,
        targetPinId: 'in',
      });
      state.engine.addConnection({
        id: edgeBId,
        sourceNodeId: junctionId,
        sourcePinId: 'out_0',
        targetNodeId: edge.target,
        targetPinId: edge.targetHandle ?? '',
      });

      const edgeA: Edge = {
        id: edgeAId,
        source: edge.source,
        sourceHandle: edge.sourceHandle,
        target: junctionId,
        targetHandle: 'in',
        type: 'wire',
      };

      const edgeB: Edge = {
        id: edgeBId,
        source: junctionId,
        sourceHandle: 'out_0',
        target: edge.target,
        targetHandle: edge.targetHandle,
        type: 'wire',
      };

      set((prev) => ({
        nodes: [...prev.nodes, rfJunctionNode],
        edges: [...prev.edges.filter((e) => e.id !== edgeId), edgeA, edgeB],
      }));

      setTimeout(() => get().updateSignalCache(), 0);
    },
  };
});

// ============================================================
// Helper: Map ComponentType → React Flow node type
// ============================================================

export function getNodeType(type: ComponentType): string {
  switch (type) {
    case 'INPUT':
      return 'inputTerminal';
    case 'OUTPUT':
      return 'outputTerminal';
    case 'CLOCK':
      return 'clockSource';
    case 'LED':
      return 'led';
    case 'SEVEN_SEGMENT':
      return 'sevenSegment';
    case 'HALF_ADDER':
    case 'FULL_ADDER':
    case 'DECODER':
      return 'ic';
    case 'IC':
      return 'ic';
    case 'JUNCTION':
      return 'junction';
    default:
      return 'gate';
  }
}
