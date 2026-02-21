// ============================================================
// Export Project — Serialize circuit to .logic format
// ============================================================

import { Node, Edge } from 'reactflow';
import {
  CircuitNodeData,
  ICDefinition,
  LogicProject,
  PROJECT_VERSION,
} from '../types/circuit';

/**
 * Export the current circuit state to a LogicProject object.
 */
export function exportProject(
  nodes: Node<CircuitNodeData>[],
  edges: Edge[],
  customICs: ICDefinition[],
  name: string = 'Untitled Project',
  description: string = ''
): LogicProject {
  const now = new Date().toISOString();

  const projectNodes = nodes.map((node) => ({
    ...node.data,
    position: { x: node.position.x, y: node.position.y },
  }));

  const connections = edges.map((edge) => ({
    id: edge.id,
    sourceNodeId: edge.source,
    sourcePinId: edge.sourceHandle ?? '',
    targetNodeId: edge.target,
    targetPinId: edge.targetHandle ?? '',
  }));

  return {
    version: PROJECT_VERSION,
    name,
    description,
    createdAt: now,
    updatedAt: now,
    nodes: projectNodes,
    connections,
    customICs: customICs.map((ic) => ({ ...ic })),
  };
}

/**
 * Serialize a project to a JSON string.
 */
export function serializeProject(project: LogicProject): string {
  return JSON.stringify(project, null, 2);
}
