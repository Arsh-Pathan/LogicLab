// ============================================================
// LogicLab — Core Type Definitions
// ============================================================

/** Binary signal value */
export type Signal = 0 | 1;

/** Signal state: defined signal, or undefined (floating/unconnected) */
export type SignalState = Signal | undefined;

/** All supported logic gate types */
export type GateType =
  | 'AND'
  | 'OR'
  | 'NOT'
  | 'NAND'
  | 'NOR'
  | 'XOR'
  | 'XNOR'
  | 'BUFFER';

/** All supported component types */
export type ComponentType =
  | GateType
  | 'INPUT'
  | 'OUTPUT'
  | 'CLOCK'
  | 'LED'
  | 'SEVEN_SEGMENT'
  | 'HALF_ADDER'
  | 'FULL_ADDER'
  | 'DECODER'
  | 'JUNCTION'
  | 'IC';

/** Rotation angles for components */
export type Rotation = 0 | 90 | 180 | 270;

/** Simulation execution mode */
export type SimulationMode = 'live' | 'frozen';

// ============================================================
// Pin Definitions
// ============================================================

export interface Pin {
  id: string;
  label: string;
  type: 'input' | 'output';
  signal: SignalState;
  /** Position index for ordering handles */
  index: number;
}

// ============================================================
// Circuit Node (Engine-level representation)
// ============================================================

export interface CircuitNodeData {
  id: string;
  type: ComponentType;
  label: string;
  inputs: Pin[];
  outputs: Pin[];
  rotation: Rotation;
  /** Additional properties (e.g., clock frequency, IC definition ID) */
  properties: Record<string, unknown>;
}

/** Default input counts for different gate types */
export const DEFAULT_INPUT_COUNTS: Record<GateType, number> = {
  AND: 2,
  OR: 2,
  NOT: 1,
  NAND: 2,
  NOR: 2,
  XOR: 2,
  XNOR: 2,
  BUFFER: 1,
};

/** Minimum input counts */
export const MIN_INPUT_COUNTS: Record<GateType, number> = {
  AND: 1,
  OR: 1,
  NOT: 1,
  NAND: 1,
  NOR: 1,
  XOR: 2,
  XNOR: 2,
  BUFFER: 1,
};

/** Maximum input counts */
export const MAX_INPUT_COUNTS: Record<GateType, number> = {
  AND: 16,
  OR: 16,
  NOT: 1,
  NAND: 16,
  NOR: 16,
  XOR: 16,
  XNOR: 16,
  BUFFER: 1,
};

// ============================================================
// Connection
// ============================================================

export interface Connection {
  id: string;
  sourceNodeId: string;
  sourcePinId: string;
  targetNodeId: string;
  targetPinId: string;
}

// ============================================================
// Custom IC Definitions
// ============================================================

export interface ICPinMapping {
  pinId: string;
  nodeId: string;
  label: string;
}

export interface ICDefinition {
  id: string;
  name: string;
  description: string;
  /** Internal circuit nodes */
  nodes: CircuitNodeData[];
  /** Internal connections */
  connections: Connection[];
  /** External input pin mappings */
  inputPins: ICPinMapping[];
  /** External output pin mappings */
  outputPins: ICPinMapping[];
  /** Creation timestamp */
  createdAt: string;
}

// ============================================================
// Project Format (.logic files)
// ============================================================

export interface ViewportTransform {
  x: number;
  y: number;
  zoom: number;
}

export interface NodePosition {
  nodeId: string;
  x: number;
  y: number;
}

export interface LogicProject {
  /** Format version for migration support */
  version: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  /** All circuit nodes with their data */
  nodes: (CircuitNodeData & { position: { x: number; y: number } })[];
  /** All connections */
  connections: Connection[];
  /** Custom IC definitions */
  customICs: ICDefinition[];
  /** Viewport state */
  viewport?: ViewportTransform;
}

/** Current project format version */
export const PROJECT_VERSION = '1.0.0';

// ============================================================
// Simulation Engine Types
// ============================================================

export interface EngineNode {
  id: string;
  type: ComponentType;
  inputs: Map<string, SignalState>;
  outputs: Map<string, SignalState>;
  properties: Record<string, unknown>;
  /** For IC nodes, the internal engine instance */
  subEngine?: unknown;
}

export interface PropagationEvent {
  nodeId: string;
  pinId: string;
  previousSignal: SignalState;
  newSignal: SignalState;
  timestamp: number;
}

export type EngineSubscriber = (event: PropagationEvent) => void;

export interface EngineState {
  mode: SimulationMode;
  nodeCount: number;
  connectionCount: number;
  evaluationCount: number;
  lastEvaluationTime: number;
}

// ============================================================
// UI Types
// ============================================================

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  nodeId?: string;
  edgeId?: string;
}

export interface HistoryEntry {
  nodes: CircuitNodeData[];
  connections: Connection[];
  positions: NodePosition[];
  timestamp: number;
}

export interface DragItem {
  type: ComponentType;
  label: string;
}

// ============================================================
// Supabase / Backend Types
// ============================================================

export interface SavedProject {
  id: string;
  user_id: string;
  name: string;
  description: string;
  data: LogicProject;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
}
