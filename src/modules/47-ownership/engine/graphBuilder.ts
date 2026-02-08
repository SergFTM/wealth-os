/**
 * Graph Builder Engine
 * Builds and analyzes ownership graph structure
 */

export interface OwnershipNode {
  id: string;
  clientId: string;
  name: string;
  nodeTypeKey: string;
  jurisdiction?: string;
  mdmRefType?: string;
  mdmRefId?: string;
  status: string;
}

export interface OwnershipLink {
  id: string;
  clientId: string;
  fromNodeId: string;
  toNodeId: string;
  ownershipPct: number;
  profitSharePct?: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface GraphNode extends OwnershipNode {
  level: number;
  incomingLinks: OwnershipLink[];
  outgoingLinks: OwnershipLink[];
  x?: number;
  y?: number;
}

export interface OwnershipGraph {
  nodes: Map<string, GraphNode>;
  links: OwnershipLink[];
  roots: string[];
  leaves: string[];
  loops: string[][];
  maxDepth: number;
}

export interface LayoutConfig {
  nodeWidth: number;
  nodeHeight: number;
  horizontalGap: number;
  verticalGap: number;
  startX: number;
  startY: number;
}

const DEFAULT_LAYOUT: LayoutConfig = {
  nodeWidth: 180,
  nodeHeight: 80,
  horizontalGap: 60,
  verticalGap: 100,
  startX: 100,
  startY: 50,
};

/**
 * Build ownership graph from nodes and links
 */
export function buildGraph(nodes: OwnershipNode[], links: OwnershipLink[]): OwnershipGraph {
  const nodeMap = new Map<string, GraphNode>();

  // Initialize nodes
  for (const node of nodes) {
    nodeMap.set(node.id, {
      ...node,
      level: -1,
      incomingLinks: [],
      outgoingLinks: [],
    });
  }

  // Connect links
  for (const link of links) {
    const fromNode = nodeMap.get(link.fromNodeId);
    const toNode = nodeMap.get(link.toNodeId);

    if (fromNode && toNode) {
      fromNode.outgoingLinks.push(link);
      toNode.incomingLinks.push(link);
    }
  }

  // Find roots (nodes with no incoming links)
  const roots: string[] = [];
  for (const [id, node] of nodeMap) {
    if (node.incomingLinks.length === 0) {
      roots.push(id);
    }
  }

  // Find leaves (nodes with no outgoing links)
  const leaves: string[] = [];
  for (const [id, node] of nodeMap) {
    if (node.outgoingLinks.length === 0) {
      leaves.push(id);
    }
  }

  // Detect loops using DFS
  const loops = detectLoops(nodeMap, links);

  // Assign levels (topological order)
  const maxDepth = assignLevels(nodeMap, roots);

  return {
    nodes: nodeMap,
    links,
    roots,
    leaves,
    loops,
    maxDepth,
  };
}

/**
 * Detect cycles in the graph
 */
function detectLoops(nodes: Map<string, GraphNode>, links: OwnershipLink[]): string[][] {
  const loops: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const currentPath: string[] = [];

  function dfs(nodeId: string): void {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    currentPath.push(nodeId);

    const node = nodes.get(nodeId);
    if (node) {
      for (const link of node.outgoingLinks) {
        if (recursionStack.has(link.toNodeId)) {
          // Found a cycle
          const cycleStart = currentPath.indexOf(link.toNodeId);
          if (cycleStart !== -1) {
            loops.push([...currentPath.slice(cycleStart), link.toNodeId]);
          }
        } else if (!visited.has(link.toNodeId)) {
          dfs(link.toNodeId);
        }
      }
    }

    currentPath.pop();
    recursionStack.delete(nodeId);
  }

  for (const [id] of nodes) {
    if (!visited.has(id)) {
      dfs(id);
    }
  }

  return loops;
}

/**
 * Assign levels to nodes using BFS from roots
 */
function assignLevels(nodes: Map<string, GraphNode>, roots: string[]): number {
  let maxDepth = 0;
  const queue: Array<{ id: string; level: number }> = [];

  // Start from roots
  for (const rootId of roots) {
    queue.push({ id: rootId, level: 0 });
  }

  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    const node = nodes.get(id);

    if (node && (node.level === -1 || node.level < level)) {
      node.level = level;
      maxDepth = Math.max(maxDepth, level);

      for (const link of node.outgoingLinks) {
        queue.push({ id: link.toNodeId, level: level + 1 });
      }
    }
  }

  // Assign level 0 to orphan nodes
  for (const [, node] of nodes) {
    if (node.level === -1) {
      node.level = 0;
    }
  }

  return maxDepth;
}

/**
 * Calculate layout positions for nodes (layered DAG layout)
 */
export function calculateLayout(
  graph: OwnershipGraph,
  config: LayoutConfig = DEFAULT_LAYOUT
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();

  // Group nodes by level
  const levels: Map<number, string[]> = new Map();
  for (const [id, node] of graph.nodes) {
    const level = node.level;
    if (!levels.has(level)) {
      levels.set(level, []);
    }
    levels.get(level)!.push(id);
  }

  // Calculate positions level by level
  for (const [level, nodeIds] of levels) {
    const y = config.startY + level * (config.nodeHeight + config.verticalGap);
    const totalWidth = nodeIds.length * config.nodeWidth + (nodeIds.length - 1) * config.horizontalGap;
    const startX = config.startX + (800 - totalWidth) / 2; // Center horizontally

    for (let i = 0; i < nodeIds.length; i++) {
      const x = startX + i * (config.nodeWidth + config.horizontalGap);
      positions.set(nodeIds[i], { x, y });

      const node = graph.nodes.get(nodeIds[i]);
      if (node) {
        node.x = x;
        node.y = y;
      }
    }
  }

  return positions;
}

/**
 * Find all paths between two nodes
 */
export function findPaths(
  graph: OwnershipGraph,
  fromId: string,
  toId: string,
  maxDepth: number = 10
): Array<{ path: string[]; ownershipPct: number }> {
  const paths: Array<{ path: string[]; ownershipPct: number }> = [];

  function dfs(currentId: string, currentPath: string[], currentPct: number, depth: number): void {
    if (depth > maxDepth) return;
    if (currentId === toId) {
      paths.push({ path: [...currentPath, toId], ownershipPct: currentPct });
      return;
    }

    const node = graph.nodes.get(currentId);
    if (!node) return;

    for (const link of node.outgoingLinks) {
      if (!currentPath.includes(link.toNodeId)) {
        dfs(
          link.toNodeId,
          [...currentPath, currentId],
          currentPct * (link.ownershipPct / 100),
          depth + 1
        );
      }
    }
  }

  dfs(fromId, [], 100, 0);
  return paths;
}

/**
 * Get subgraph for a specific node (ancestors and descendants)
 */
export function getSubgraph(
  graph: OwnershipGraph,
  nodeId: string,
  includeAncestors: boolean = true,
  includeDescendants: boolean = true
): { nodeIds: Set<string>; linkIds: Set<string> } {
  const nodeIds = new Set<string>([nodeId]);
  const linkIds = new Set<string>();

  // BFS for ancestors
  if (includeAncestors) {
    const queue = [nodeId];
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const node = graph.nodes.get(currentId);
      if (node) {
        for (const link of node.incomingLinks) {
          linkIds.add(link.id);
          if (!nodeIds.has(link.fromNodeId)) {
            nodeIds.add(link.fromNodeId);
            queue.push(link.fromNodeId);
          }
        }
      }
    }
  }

  // BFS for descendants
  if (includeDescendants) {
    const queue = [nodeId];
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const node = graph.nodes.get(currentId);
      if (node) {
        for (const link of node.outgoingLinks) {
          linkIds.add(link.id);
          if (!nodeIds.has(link.toNodeId)) {
            nodeIds.add(link.toNodeId);
            queue.push(link.toNodeId);
          }
        }
      }
    }
  }

  return { nodeIds, linkIds };
}

/**
 * Validate graph structure
 */
export function validateGraph(graph: OwnershipGraph): Array<{ type: string; message: string; nodeIds?: string[] }> {
  const issues: Array<{ type: string; message: string; nodeIds?: string[] }> = [];

  // Check for loops
  if (graph.loops.length > 0) {
    for (const loop of graph.loops) {
      issues.push({
        type: 'loop',
        message: `Обнаружен цикл: ${loop.join(' → ')}`,
        nodeIds: loop,
      });
    }
  }

  // Check for orphan nodes (not connected to any household)
  const connectedToRoot = new Set<string>();
  const visited = new Set<string>();

  function markConnected(nodeId: string): void {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    connectedToRoot.add(nodeId);

    const node = graph.nodes.get(nodeId);
    if (node) {
      for (const link of node.outgoingLinks) {
        markConnected(link.toNodeId);
      }
    }
  }

  for (const rootId of graph.roots) {
    markConnected(rootId);
  }

  for (const [id, node] of graph.nodes) {
    if (!connectedToRoot.has(id) && node.nodeTypeKey !== 'household') {
      issues.push({
        type: 'orphan',
        message: `Узел "${node.name}" не связан с домохозяйством`,
        nodeIds: [id],
      });
    }
  }

  // Check for ownership > 100%
  for (const [, node] of graph.nodes) {
    const totalOwnership = node.incomingLinks.reduce((sum, link) => sum + link.ownershipPct, 0);
    if (totalOwnership > 100.01) { // Small tolerance for floating point
      issues.push({
        type: 'over_ownership',
        message: `Узел "${node.name}" имеет суммарное владение ${totalOwnership.toFixed(1)}%`,
        nodeIds: [node.id],
      });
    }
  }

  return issues;
}
