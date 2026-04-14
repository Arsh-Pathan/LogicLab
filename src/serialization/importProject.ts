// ============================================================
// Import Project — Deserialize .logic file to circuit state
// ============================================================

import { Node, Edge } from 'reactflow';
import {
  CircuitNodeData,
  ICDefinition,
  LogicProject,
} from '../types/circuit';
import { getNodeType } from '@/lib/nodeTypeUtils';

interface ImportResult {
  nodes: Node<CircuitNodeData>[];
  edges: Edge[];
  customICs: ICDefinition[];
  projectName: string;
  projectDescription: string;
}

/**
 * Import a project from a JSON string.
 */
export function importProject(jsonString: string): ImportResult | null {
  try {
    const project: LogicProject = JSON.parse(jsonString);

    // Version check
    if (!project.version) {
      console.warn('Project has no version, assuming compatible');
    }

    // Validate basic structure
    if (!project.nodes || !Array.isArray(project.nodes)) {
      console.error('Invalid project: missing nodes');
      return null;
    }

    if (!project.connections || !Array.isArray(project.connections)) {
      console.error('Invalid project: missing connections');
      return null;
    }

    // Convert to React Flow nodes
    const nodes: Node<CircuitNodeData>[] = project.nodes.map((nodeData) => {
      const { position, ...data } = nodeData;
      return {
        id: data.id,
        type: getNodeType(data.type),
        position: position ?? { x: 0, y: 0 },
        data: data as CircuitNodeData,
      };
    });

    // Convert to React Flow edges
    const edges: Edge[] = project.connections.map((conn) => ({
      id: conn.id,
      source: conn.sourceNodeId,
      target: conn.targetNodeId,
      sourceHandle: conn.sourcePinId,
      targetHandle: conn.targetPinId,
      type: 'wire',
    }));

    return {
      nodes,
      edges,
      customICs: project.customICs ?? [],
      projectName: project.name ?? 'Imported Project',
      projectDescription: project.description ?? '',
    };
  } catch (error) {
    console.error('Failed to parse project file:', error);
    return null;
  }
}

/**
 * Validate a project file structure.
 */
export function validateProject(project: unknown): project is LogicProject {
  if (!project || typeof project !== 'object') return false;
  const p = project as Record<string, unknown>;
  return (
    typeof p.version === 'string' &&
    Array.isArray(p.nodes) &&
    Array.isArray(p.connections)
  );
}
