export interface TopologicalResult {
  order: string[];
  hasCycle: boolean;
  cycleNodes: string[];
}

export type AdjacencyList = Map<string, Set<string>>;

export function topologicalSort(
  nodeIds: string[],
  adjacency: AdjacencyList
): TopologicalResult {
  const inDegree = new Map<string, number>();
  for (const id of nodeIds) {
    inDegree.set(id, 0);
  }

  for (const [, targets] of adjacency) {
    for (const target of targets) {
      inDegree.set(target, (inDegree.get(target) ?? 0) + 1);
    }
  }

  const queue: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree === 0) {
      queue.push(id);
    }
  }

  const order: string[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);

    const neighbors = adjacency.get(node);
    if (neighbors) {
      for (const neighbor of neighbors) {
        const newDegree = (inDegree.get(neighbor) ?? 1) - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      }
    }
  }

  if (order.length < nodeIds.length) {
    const sortedSet = new Set(order);
    const cycleNodes = nodeIds.filter((id) => !sortedSet.has(id));
    return { order, hasCycle: true, cycleNodes };
  }

  return { order, hasCycle: false, cycleNodes: [] };
}

export function buildAdjacencyList(
  connections: { sourceNodeId: string; targetNodeId: string }[],
  nodeIds: string[]
): AdjacencyList {
  const adjacency: AdjacencyList = new Map();

  for (const id of nodeIds) {
    adjacency.set(id, new Set());
  }

  for (const conn of connections) {
    const sources = adjacency.get(conn.sourceNodeId);
    if (sources) {
      sources.add(conn.targetNodeId);
    }
  }

  return adjacency;
}

export function findDownstream(
  startNodes: string[],
  adjacency: AdjacencyList
): Set<string> {
  const visited = new Set<string>();
  const queue = [...startNodes];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (visited.has(node)) continue;
    visited.add(node);

    const neighbors = adjacency.get(node);
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
  }

  return visited;
}

export function sortSubset(
  subset: Set<string>,
  fullOrder: string[]
): string[] {
  return fullOrder.filter((id) => subset.has(id));
}
