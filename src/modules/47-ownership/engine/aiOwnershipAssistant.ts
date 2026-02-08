/**
 * AI Ownership Assistant Engine
 * Provides AI-powered insights and suggestions for ownership structures
 */

import { OwnershipGraph } from './graphBuilder';
import { ConcentrationAnalysis } from './concentrationEngine';
import { UboRecord } from './uboCalculator';

export interface AiSuggestion {
  id: string;
  type: 'explain' | 'warning' | 'optimization' | 'question';
  title: string;
  description: string;
  confidence: number; // 0-100
  sources: string[];
  assumptions: string[];
  relatedNodeIds?: string[];
}

export interface AiExplanation {
  summary: string;
  details: string[];
  keyPoints: string[];
  sources: string[];
}

/**
 * Generate structure explanation
 */
export function explainStructure(
  graph: OwnershipGraph,
  concentrations: ConcentrationAnalysis,
  ubos: UboRecord[]
): AiExplanation {
  const details: string[] = [];
  const keyPoints: string[] = [];

  // Count node types
  const typeCounts = new Map<string, number>();
  for (const [, node] of graph.nodes) {
    typeCounts.set(node.nodeTypeKey, (typeCounts.get(node.nodeTypeKey) || 0) + 1);
  }

  // Summary
  let summary = `Структура владения состоит из ${graph.nodes.size} узлов и ${graph.links.length} связей.`;

  // Details by type
  const typeLabels: Record<string, string> = {
    household: 'домохозяйств',
    trust: 'трастов',
    entity: 'юридических лиц',
    partnership: 'партнерств',
    spv: 'SPV',
    account: 'счетов',
    asset: 'активов',
  };

  for (const [type, count] of typeCounts) {
    if (count > 0) {
      details.push(`${count} ${typeLabels[type] || type}`);
    }
  }

  // Depth info
  if (graph.maxDepth > 0) {
    details.push(`Максимальная глубина владения: ${graph.maxDepth} уровней`);

    if (graph.maxDepth >= 4) {
      keyPoints.push(`Глубокая структура (${graph.maxDepth} уровней) может затруднить отслеживание UBO`);
    }
  }

  // UBO info
  if (ubos.length > 0) {
    const uniquePersons = new Set(ubos.map(u => u.personMdmId)).size;
    details.push(`Выявлено ${uniquePersons} конечных бенефициаров`);

    // Top UBO
    const topUbo = ubos.sort((a, b) => b.computedPct - a.computedPct)[0];
    if (topUbo) {
      keyPoints.push(`Наибольшая доля владения: ${topUbo.personName} (${topUbo.computedPct.toFixed(1)}%)`);
    }
  }

  // Concentration warnings
  if (concentrations.summary.riskScore > 50) {
    keyPoints.push(`Повышенный риск концентрации (${concentrations.summary.riskScore}/100)`);
  }

  // Loop warnings
  if (graph.loops.length > 0) {
    keyPoints.push(`Обнаружено ${graph.loops.length} циклов в структуре владения`);
  }

  return {
    summary,
    details,
    keyPoints,
    sources: ['Расчет на основе данных структуры владения'],
  };
}

/**
 * Find concentration risks
 */
export function findConcentrationRisks(
  graph: OwnershipGraph,
  concentrations: ConcentrationAnalysis
): AiSuggestion[] {
  const suggestions: AiSuggestion[] = [];

  // Critical and high concentrations
  const criticalMetrics = concentrations.metrics.filter(
    m => m.riskLevel === 'critical' || m.riskLevel === 'high'
  );

  for (const metric of criticalMetrics) {
    suggestions.push({
      id: `risk-${metric.id}`,
      type: 'warning',
      title: `Высокая концентрация: ${metric.targetName}`,
      description: metric.description,
      confidence: 90,
      sources: ['Анализ структуры владения'],
      assumptions: ['Текущее состояние структуры'],
      relatedNodeIds: [metric.targetId],
    });
  }

  // Single point of failure warnings
  const spofMetrics = concentrations.metrics.filter(m => m.type === 'single_point_failure');
  if (spofMetrics.length > 0) {
    suggestions.push({
      id: 'risk-spof-summary',
      type: 'warning',
      title: 'Единые точки отказа',
      description: `Обнаружено ${spofMetrics.length} узлов, являющихся единственными связями в структуре. Их удаление может разорвать цепочку владения.`,
      confidence: 95,
      sources: ['Анализ графа владения'],
      assumptions: ['Текущее состояние связей'],
      relatedNodeIds: spofMetrics.map(m => m.targetId),
    });
  }

  return suggestions;
}

/**
 * Check for orphan nodes
 */
export function checkOrphanNodes(graph: OwnershipGraph): AiSuggestion[] {
  const suggestions: AiSuggestion[] = [];
  const orphans: string[] = [];

  // Find nodes not connected to any household
  const visited = new Set<string>();

  function markConnected(nodeId: string): void {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = graph.nodes.get(nodeId);
    if (node) {
      for (const link of node.outgoingLinks) {
        markConnected(link.toNodeId);
      }
    }
  }

  for (const rootId of graph.roots) {
    const rootNode = graph.nodes.get(rootId);
    if (rootNode?.nodeTypeKey === 'household') {
      markConnected(rootId);
    }
  }

  for (const [id, node] of graph.nodes) {
    if (!visited.has(id) && node.nodeTypeKey !== 'household') {
      orphans.push(id);
    }
  }

  if (orphans.length > 0) {
    suggestions.push({
      id: 'orphan-nodes',
      type: 'warning',
      title: 'Несвязанные узлы',
      description: `Обнаружено ${orphans.length} узлов, не связанных с домохозяйством. Возможно, требуется добавить связи.`,
      confidence: 85,
      sources: ['Анализ графа владения'],
      assumptions: ['Все узлы должны быть связаны с домохозяйством'],
      relatedNodeIds: orphans,
    });
  }

  return suggestions;
}

/**
 * Suggest optimizations
 */
export function suggestOptimizations(
  graph: OwnershipGraph,
  concentrations: ConcentrationAnalysis
): AiSuggestion[] {
  const suggestions: AiSuggestion[] = [];

  // Suggest simplification if too deep
  if (graph.maxDepth >= 5) {
    suggestions.push({
      id: 'opt-simplify-depth',
      type: 'optimization',
      title: 'Упрощение структуры',
      description: `Структура имеет ${graph.maxDepth} уровней вложенности. Рассмотрите возможность упрощения для облегчения управления и compliance.`,
      confidence: 70,
      sources: ['Анализ глубины структуры'],
      assumptions: ['Глубокие структуры сложнее для управления'],
    });
  }

  // Suggest documentation if missing sources
  let noSourceCount = 0;
  for (const link of graph.links) {
    // Check if source exists (simplified check)
    if (!link.id.includes('src')) {
      noSourceCount++;
    }
  }

  if (noSourceCount > 5) {
    suggestions.push({
      id: 'opt-add-sources',
      type: 'optimization',
      title: 'Документирование источников',
      description: `${noSourceCount} связей не имеют документальных источников. Рекомендуется прикрепить подтверждающие документы.`,
      confidence: 80,
      sources: ['Проверка наличия источников'],
      assumptions: ['Все связи должны иметь документальное подтверждение'],
    });
  }

  return suggestions;
}

/**
 * Generate all AI suggestions
 */
export function generateAllSuggestions(
  graph: OwnershipGraph,
  concentrations: ConcentrationAnalysis,
  ubos: UboRecord[]
): AiSuggestion[] {
  return [
    ...findConcentrationRisks(graph, concentrations),
    ...checkOrphanNodes(graph),
    ...suggestOptimizations(graph, concentrations),
  ];
}

/**
 * Format suggestion for display
 */
export function formatSuggestion(suggestion: AiSuggestion): string {
  const lines: string[] = [];

  lines.push(`**${suggestion.title}**`);
  lines.push(suggestion.description);
  lines.push('');
  lines.push(`Уверенность: ${suggestion.confidence}%`);

  if (suggestion.assumptions.length > 0) {
    lines.push('');
    lines.push('Допущения:');
    for (const assumption of suggestion.assumptions) {
      lines.push(`  - ${assumption}`);
    }
  }

  return lines.join('\n');
}
