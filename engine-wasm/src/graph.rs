use std::collections::{HashMap, HashSet, VecDeque};

use crate::types::Connection;

/// Result of topological sorting
pub struct TopologicalResult {
    pub order: Vec<String>,
    pub has_cycle: bool,
    pub cycle_nodes: Vec<String>,
}

/// Kahn's algorithm for topological sort with cycle detection.
pub fn topological_sort(
    node_ids: &[String],
    adjacency: &HashMap<String, HashSet<String>>,
) -> TopologicalResult {
    // Compute in-degrees
    let mut in_degree: HashMap<&str, usize> = HashMap::new();
    for id in node_ids {
        in_degree.entry(id.as_str()).or_insert(0);
    }
    for (_, targets) in adjacency {
        for t in targets {
            *in_degree.entry(t.as_str()).or_insert(0) += 1;
        }
    }

    // Initialize queue with zero in-degree nodes
    let mut queue: VecDeque<String> = VecDeque::new();
    for id in node_ids {
        if *in_degree.get(id.as_str()).unwrap_or(&0) == 0 {
            queue.push_back(id.clone());
        }
    }

    let mut order: Vec<String> = Vec::with_capacity(node_ids.len());

    while let Some(node) = queue.pop_front() {
        order.push(node.clone());
        if let Some(neighbors) = adjacency.get(&node) {
            for neighbor in neighbors {
                if let Some(deg) = in_degree.get_mut(neighbor.as_str()) {
                    *deg -= 1;
                    if *deg == 0 {
                        queue.push_back(neighbor.clone());
                    }
                }
            }
        }
    }

    if order.len() < node_ids.len() {
        let sorted_set: HashSet<&str> = order.iter().map(|s| s.as_str()).collect();
        let cycle_nodes: Vec<String> = node_ids
            .iter()
            .filter(|id| !sorted_set.contains(id.as_str()))
            .cloned()
            .collect();
        TopologicalResult {
            order,
            has_cycle: true,
            cycle_nodes,
        }
    } else {
        TopologicalResult {
            order,
            has_cycle: false,
            cycle_nodes: vec![],
        }
    }
}

/// Build adjacency list from connections (source -> set of targets).
pub fn build_adjacency_list(
    connections: &[Connection],
) -> HashMap<String, HashSet<String>> {
    let mut adj: HashMap<String, HashSet<String>> = HashMap::new();
    for conn in connections {
        adj.entry(conn.source_node_id.clone())
            .or_default()
            .insert(conn.target_node_id.clone());
    }
    adj
}

/// Build connection index: target_node_id -> Vec<&Connection>
pub fn build_connection_index(
    connections: &[Connection],
) -> HashMap<String, Vec<usize>> {
    let mut index: HashMap<String, Vec<usize>> = HashMap::new();
    for (i, conn) in connections.iter().enumerate() {
        index
            .entry(conn.target_node_id.clone())
            .or_default()
            .push(i);
    }
    index
}

/// Find all downstream nodes reachable from start_ids via BFS.
pub fn find_downstream(
    start_ids: &[String],
    adjacency: &HashMap<String, HashSet<String>>,
) -> HashSet<String> {
    let mut visited: HashSet<String> = HashSet::new();
    let mut queue: VecDeque<String> = VecDeque::new();
    for id in start_ids {
        if visited.insert(id.clone()) {
            queue.push_back(id.clone());
        }
    }
    while let Some(node) = queue.pop_front() {
        if let Some(neighbors) = adjacency.get(&node) {
            for neighbor in neighbors {
                if visited.insert(neighbor.clone()) {
                    queue.push_back(neighbor.clone());
                }
            }
        }
    }
    visited
}

/// Sort a subset of nodes, preserving topological order from the full order.
pub fn sort_subset(full_order: &[String], subset: &HashSet<String>) -> Vec<String> {
    full_order
        .iter()
        .filter(|id| subset.contains(id.as_str()))
        .cloned()
        .collect()
}
