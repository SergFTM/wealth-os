/**
 * Concentration Engine
 * Analyzes ownership concentrations and risks
 */

import { OwnershipGraph, GraphNode } from './graphBuilder';

export interface ConcentrationMetric {
  id: string;
  type: 'entity_concentration' | 'custodian_concentration' | 'jurisdiction_concentration' | 'single_point_failure';
  targetId: string;
  targetName: string;
  value: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details: Record<string, unknown>;
}

export interface ConcentrationAnalysis {
  metrics: ConcentrationMetric[];
  summary: {
    totalNodes: number;
    totalLinks: number;
    avgOwnershipDepth: number;
    maxOwnershipDepth: number;
    riskScore: number;
  };
  warnings: string[];
}

/**
 * Analyze ownership concentrations
 */
export function analyzeConcentrations(graph: OwnershipGraph): ConcentrationAnalysis {
  const metrics: ConcentrationMetric[] = [];
  const warnings: string[] = [];

  // 1. Entity concentration (how much flows through single entities)
  const entityFlows = calculateEntityFlows(graph);
  for (const [nodeId, flow] of entityFlows) {
    const node = graph.nodes.get(nodeId);
    if (!node || node.nodeTypeKey === 'household') continue;

    const riskLevel = getRiskLevel(flow);
    if (riskLevel !== 'low') {
      metrics.push({
        id: `conc-entity-${nodeId}`,
        type: 'entity_concentration',
        targetId: nodeId,
        targetName: node.name,
        value: flow,
        riskLevel,
        description: `${node.name} контролирует ${flow.toFixed(1)}% структуры`,
        details: { nodeType: node.nodeTypeKey },
      });
    }
  }

  // 2. Jurisdiction concentration
  const jurisdictions = calculateJurisdictionConcentration(graph);
  for (const [jurisdiction, pct] of jurisdictions) {
    if (!jurisdiction) continue;

    const riskLevel = getRiskLevel(pct);
    if (riskLevel !== 'low') {
      metrics.push({
        id: `conc-jurisdiction-${jurisdiction}`,
        type: 'jurisdiction_concentration',
        targetId: jurisdiction,
        targetName: jurisdiction,
        value: pct,
        riskLevel,
        description: `${pct.toFixed(1)}% узлов в юрисдикции ${jurisdiction}`,
        details: {},
      });
    }
  }

  // 3. Single point of failure (nodes that if removed disconnect the graph)
  const criticalNodes = findCriticalNodes(graph);
  for (const nodeId of criticalNodes) {
    const node = graph.nodes.get(nodeId);
    if (!node) continue;

    metrics.push({
      id: `conc-spof-${nodeId}`,
      type: 'single_point_failure',
      targetId: nodeId,
      targetName: node.name,
      value: 100,
      riskLevel: 'high',
      description: `${node.name} является критической точкой в структуре`,
      details: { nodeType: node.nodeTypeKey },
    });

    warnings.push(`Узел "${node.name}" является единственной связью для части структуры`);
  }

  // Calculate summary
  const depths: number[] = [];
  for (const [, node] of graph.nodes) {
    depths.push(node.level);
  }

  const avgDepth = depths.length > 0 ? depths.reduce((a, b) => a + b, 0) / depths.length : 0;
  const maxDepth = Math.max(...depths, 0);

  // Risk score (0-100)
  const riskScore = calculateOverallRiskScore(metrics, graph);

  return {
    metrics,
    summary: {
      totalNodes: graph.nodes.size,
      totalLinks: graph.links.length,
      avgOwnershipDepth: Math.round(avgDepth * 10) / 10,
      maxOwnershipDepth: maxDepth,
      riskScore,
    },
    warnings,
  };
}

/**
 * Calculate how much ownership flows through each entity
 */
function calculateEntityFlows(graph: OwnershipGraph): Map<string, number> {
  const flows = new Map<string, number>();

  for (const [nodeId, node] of graph.nodes) {
    // Sum of incoming ownership
    const incomingSum = node.incomingLinks.reduce((sum, link) => sum + link.ownershipPct, 0);
    // Sum of outgoing ownership
    const outgoingSum = node.outgoingLinks.reduce((sum, link) => sum + link.ownershipPct, 0);

    // Flow is the average of incoming and outgoing (simplified)
    const flow = Math.max(incomingSum, outgoingSum);
    flows.set(nodeId, flow);
  }

  return flows;
}

/**
 * Calculate jurisdiction concentration
 */
function calculateJurisdictionConcentration(graph: OwnershipGraph): Map<string, number> {
  const jurisdictionCounts = new Map<string, number>();
  let total = 0;

  for (const [, node] of graph.nodes) {
    const jurisdiction = node.jurisdiction || 'Unknown';
    jurisdictionCounts.set(jurisdiction, (jurisdictionCounts.get(jurisdiction) || 0) + 1);
    total++;
  }

  const concentrations = new Map<string, number>();
  for (const [jurisdiction, count] of jurisdictionCounts) {
    concentrations.set(jurisdiction, (count / total) * 100);
  }

  return concentrations;
}

/**
 * Find critical nodes (articulation points)
 */
function findCriticalNodes(graph: OwnershipGraph): string[] {
  const critical: string[] = [];

  // Simple approach: check if removing a node disconnects any leaves from roots
  for (const [nodeId, node] of graph.nodes) {
    // Skip roots and leaves
    if (node.incomingLinks.length === 0 || node.outgoingLinks.length === 0) {
      continue;
    }

    // Check if this is the only path for any downstream node
    for (const link of node.outgoingLinks) {
      const toNode = graph.nodes.get(link.toNodeId);
      if (toNode && toNode.incomingLinks.length === 1) {
        // This node is the only connection for toNode
        critical.push(nodeId);
        break;
      }
    }
  }

  return [...new Set(critical)];
}

/**
 * Get risk level based on concentration percentage
 */
function getRiskLevel(pct: number): 'low' | 'medium' | 'high' | 'critical' {
  if (pct >= 80) return 'critical';
  if (pct >= 60) return 'high';
  if (pct >= 40) return 'medium';
  return 'low';
}

/**
 * Calculate overall risk score
 */
function calculateOverallRiskScore(metrics: ConcentrationMetric[], graph: OwnershipGraph): number {
  let score = 0;

  // Points for each metric based on risk level
  const riskPoints = { low: 0, medium: 10, high: 25, critical: 40 };

  for (const metric of metrics) {
    score += riskPoints[metric.riskLevel];
  }

  // Points for loops
  score += graph.loops.length * 20;

  // Points for depth (deeper = more complex = more risk)
  if (graph.maxDepth > 5) {
    score += (graph.maxDepth - 5) * 5;
  }

  return Math.min(100, score);
}

/**
 * Get concentration summary for display
 */
export function getConcentrationSummary(analysis: ConcentrationAnalysis): string[] {
  const lines: string[] = [];

  lines.push(`Всего узлов: ${analysis.summary.totalNodes}`);
  lines.push(`Всего связей: ${analysis.summary.totalLinks}`);
  lines.push(`Средняя глубина: ${analysis.summary.avgOwnershipDepth}`);
  lines.push(`Максимальная глубина: ${analysis.summary.maxOwnershipDepth}`);
  lines.push(`Общий риск-скор: ${analysis.summary.riskScore}/100`);

  if (analysis.warnings.length > 0) {
    lines.push('');
    lines.push('Предупреждения:');
    for (const warning of analysis.warnings) {
      lines.push(`  - ${warning}`);
    }
  }

  return lines;
}

/**
 * Get top concentrations for dashboard
 */
export function getTopConcentrations(
  analysis: ConcentrationAnalysis,
  limit: number = 5
): ConcentrationMetric[] {
  return analysis.metrics
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}
