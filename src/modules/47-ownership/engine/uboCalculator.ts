/**
 * UBO Calculator Engine
 * Computes Ultimate Beneficial Owners from ownership graph
 */

import { OwnershipGraph, findPaths } from './graphBuilder';

export interface UboRecord {
  id: string;
  clientId: string;
  personMdmId: string;
  personName: string;
  rootHouseholdNodeId: string;
  targetNodeId: string;
  targetNodeName: string;
  computedPct: number;
  pathsJson: Array<{ nodeIds: string[]; pct: number }>;
  computedAt: string;
  sourcesJson: string[];
}

export interface UboComputeOptions {
  clientId: string;
  householdNodeId: string;
  minPctThreshold?: number; // Minimum % to be considered UBO (default: 25%)
  maxPathDepth?: number;    // Maximum path depth to traverse
}

export interface PersonNode {
  id: string;
  mdmId: string;
  name: string;
}

/**
 * Compute UBO for all entities/trusts from a household
 */
export function computeUbo(
  graph: OwnershipGraph,
  persons: PersonNode[],
  options: UboComputeOptions
): UboRecord[] {
  const results: UboRecord[] = [];
  const now = new Date().toISOString();
  const minPct = options.minPctThreshold ?? 25;
  const maxDepth = options.maxPathDepth ?? 10;

  // Find all target nodes (entities, trusts, partnerships, SPVs)
  const targetTypes = ['entity', 'trust', 'partnership', 'spv'];
  const targetNodes: Array<{ id: string; name: string }> = [];

  for (const [id, node] of graph.nodes) {
    if (targetTypes.includes(node.nodeTypeKey)) {
      targetNodes.push({ id, name: node.name });
    }
  }

  // For each person, compute ownership in each target
  for (const person of persons) {
    // Find household node linked to this person
    let personNodeId: string | null = null;
    for (const [id, node] of graph.nodes) {
      if (node.mdmRefId === person.mdmId && node.mdmRefType === 'person') {
        personNodeId = id;
        break;
      }
    }

    // If person is not directly in graph, check if they're connected via household
    if (!personNodeId) {
      // Person might be implicit member of household
      personNodeId = options.householdNodeId;
    }

    if (!personNodeId) continue;

    for (const target of targetNodes) {
      const paths = findPaths(graph, personNodeId, target.id, maxDepth);

      if (paths.length === 0) continue;

      // Aggregate ownership across all paths
      const totalPct = paths.reduce((sum, p) => sum + p.ownershipPct, 0);

      if (totalPct >= minPct) {
        const sourceLinkIds: string[] = [];

        // Collect all link IDs used in paths
        for (const pathInfo of paths) {
          for (let i = 0; i < pathInfo.path.length - 1; i++) {
            const fromId = pathInfo.path[i];
            const toId = pathInfo.path[i + 1];
            const node = graph.nodes.get(fromId);
            if (node) {
              const link = node.outgoingLinks.find(l => l.toNodeId === toId);
              if (link) {
                sourceLinkIds.push(link.id);
              }
            }
          }
        }

        results.push({
          id: `ubo-${person.mdmId}-${target.id}`,
          clientId: options.clientId,
          personMdmId: person.mdmId,
          personName: person.name,
          rootHouseholdNodeId: options.householdNodeId,
          targetNodeId: target.id,
          targetNodeName: target.name,
          computedPct: Math.round(totalPct * 100) / 100,
          pathsJson: paths.map(p => ({
            nodeIds: p.path,
            pct: Math.round(p.ownershipPct * 100) / 100,
          })),
          computedAt: now,
          sourcesJson: [...new Set(sourceLinkIds)],
        });
      }
    }
  }

  return results;
}

/**
 * Compute direct ownership for a single target node
 */
export function computeDirectOwnership(
  graph: OwnershipGraph,
  targetNodeId: string
): Array<{ nodeId: string; nodeName: string; ownershipPct: number }> {
  const node = graph.nodes.get(targetNodeId);
  if (!node) return [];

  return node.incomingLinks.map(link => {
    const fromNode = graph.nodes.get(link.fromNodeId);
    return {
      nodeId: link.fromNodeId,
      nodeName: fromNode?.name ?? 'Unknown',
      ownershipPct: link.ownershipPct,
    };
  });
}

/**
 * Get effective ownership chain for display
 */
export function getOwnershipChain(
  graph: OwnershipGraph,
  paths: Array<{ nodeIds: string[]; pct: number }>
): Array<{
  path: Array<{ id: string; name: string; type: string }>;
  pct: number;
}> {
  return paths.map(p => ({
    path: p.nodeIds.map(id => {
      const node = graph.nodes.get(id);
      return {
        id,
        name: node?.name ?? 'Unknown',
        type: node?.nodeTypeKey ?? 'unknown',
      };
    }),
    pct: p.pct,
  }));
}

/**
 * Validate UBO computation
 */
export function validateUboResults(
  results: UboRecord[]
): Array<{ type: string; message: string; recordIds?: string[] }> {
  const issues: Array<{ type: string; message: string; recordIds?: string[] }> = [];

  // Group by target node
  const byTarget = new Map<string, UboRecord[]>();
  for (const record of results) {
    if (!byTarget.has(record.targetNodeId)) {
      byTarget.set(record.targetNodeId, []);
    }
    byTarget.get(record.targetNodeId)!.push(record);
  }

  // Check if total UBO exceeds 100%
  for (const [targetId, records] of byTarget) {
    const totalPct = records.reduce((sum, r) => sum + r.computedPct, 0);
    if (totalPct > 100.01) {
      issues.push({
        type: 'over_100',
        message: `Суммарное владение UBO для ${records[0]?.targetNodeName} превышает 100% (${totalPct.toFixed(1)}%)`,
        recordIds: records.map(r => r.id),
      });
    }
  }

  // Check for persons with >25% not flagged
  // This would require access to all persons, so it's a placeholder

  return issues;
}

/**
 * Format UBO explanation text
 */
export function formatUboExplanation(record: UboRecord, graph: OwnershipGraph): string {
  const lines: string[] = [];

  lines.push(`${record.personName} является конечным бенефициаром ${record.targetNodeName} с долей ${record.computedPct.toFixed(2)}%.`);
  lines.push('');
  lines.push('Пути владения:');

  for (let i = 0; i < record.pathsJson.length; i++) {
    const pathInfo = record.pathsJson[i];
    const pathNames = pathInfo.nodeIds.map(id => {
      const node = graph.nodes.get(id);
      return node?.name ?? id;
    });

    lines.push(`  ${i + 1}. ${pathNames.join(' → ')} (${pathInfo.pct.toFixed(2)}%)`);
  }

  return lines.join('\n');
}
