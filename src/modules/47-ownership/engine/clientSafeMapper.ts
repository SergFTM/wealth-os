/**
 * Client Safe Mapper Engine
 * Creates sanitized ownership views for client portal
 */

import { OwnershipGraph, OwnershipNode, OwnershipLink, GraphNode } from './graphBuilder';

export interface MaskRules {
  maskAccountNumbers: boolean;
  maskAssetValues: boolean;
  excludeNodeTypes: string[];
  excludeJurisdictions: string[];
  simplifyPercentages: boolean; // Round to nearest 5%
  hideInternalNotes: boolean;
}

export interface ClientSafeNode {
  id: string;
  name: string;
  type: string;
  typeLabel: string;
  jurisdiction?: string;
}

export interface ClientSafeLink {
  id: string;
  from: string;
  to: string;
  ownershipPct: number;
  profitSharePct?: number;
}

export interface ClientSafeView {
  id: string;
  clientId: string;
  scopeHouseholdNodeId: string;
  publishedAt: string;
  publishedByUserId: string;
  maskRulesJson: MaskRules;
  snapshotJson: {
    nodes: ClientSafeNode[];
    links: ClientSafeLink[];
  };
  clientSafe: true;
}

const DEFAULT_MASK_RULES: MaskRules = {
  maskAccountNumbers: true,
  maskAssetValues: true,
  excludeNodeTypes: [],
  excludeJurisdictions: [],
  simplifyPercentages: false,
  hideInternalNotes: true,
};

const TYPE_LABELS: Record<string, string> = {
  household: 'Семья',
  trust: 'Траст',
  entity: 'Юр. лицо',
  partnership: 'Партнерство',
  spv: 'SPV',
  account: 'Счет',
  asset: 'Актив',
};

/**
 * Create client-safe view from ownership graph
 */
export function createClientSafeView(
  graph: OwnershipGraph,
  scopeHouseholdNodeId: string,
  userId: string,
  clientId: string,
  rules: Partial<MaskRules> = {}
): ClientSafeView {
  const maskRules: MaskRules = { ...DEFAULT_MASK_RULES, ...rules };

  // Filter and map nodes
  const safeNodes: ClientSafeNode[] = [];
  const includedNodeIds = new Set<string>();

  for (const [id, node] of graph.nodes) {
    // Skip excluded types
    if (maskRules.excludeNodeTypes.includes(node.nodeTypeKey)) {
      continue;
    }

    // Skip excluded jurisdictions
    if (node.jurisdiction && maskRules.excludeJurisdictions.includes(node.jurisdiction)) {
      continue;
    }

    includedNodeIds.add(id);

    safeNodes.push({
      id: node.id,
      name: maskNodeName(node, maskRules),
      type: node.nodeTypeKey,
      typeLabel: TYPE_LABELS[node.nodeTypeKey] || node.nodeTypeKey,
      jurisdiction: node.jurisdiction,
    });
  }

  // Filter and map links
  const safeLinks: ClientSafeLink[] = [];

  for (const link of graph.links) {
    // Only include links between included nodes
    if (!includedNodeIds.has(link.fromNodeId) || !includedNodeIds.has(link.toNodeId)) {
      continue;
    }

    let ownershipPct = link.ownershipPct;
    let profitSharePct = link.profitSharePct;

    // Simplify percentages if requested
    if (maskRules.simplifyPercentages) {
      ownershipPct = Math.round(ownershipPct / 5) * 5;
      if (profitSharePct !== undefined) {
        profitSharePct = Math.round(profitSharePct / 5) * 5;
      }
    }

    safeLinks.push({
      id: link.id,
      from: link.fromNodeId,
      to: link.toNodeId,
      ownershipPct,
      profitSharePct,
    });
  }

  return {
    id: `view-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    clientId,
    scopeHouseholdNodeId,
    publishedAt: new Date().toISOString(),
    publishedByUserId: userId,
    maskRulesJson: maskRules,
    snapshotJson: {
      nodes: safeNodes,
      links: safeLinks,
    },
    clientSafe: true,
  };
}

/**
 * Mask node name based on rules
 */
function maskNodeName(node: GraphNode, rules: MaskRules): string {
  let name = node.name;

  // Mask account numbers
  if (rules.maskAccountNumbers && node.nodeTypeKey === 'account') {
    // Replace digits in the name with X, keeping last 4
    name = name.replace(/\d{5,}/g, (match) => {
      return 'X'.repeat(match.length - 4) + match.slice(-4);
    });
  }

  return name;
}

/**
 * Validate view before publishing
 */
export function validateClientSafeView(view: ClientSafeView): {
  valid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check if there are any nodes
  if (view.snapshotJson.nodes.length === 0) {
    errors.push('Нет узлов для публикации');
  }

  // Check if there are any links
  if (view.snapshotJson.links.length === 0 && view.snapshotJson.nodes.length > 1) {
    warnings.push('Нет связей между узлами');
  }

  // Check for orphan nodes
  const linkedNodes = new Set<string>();
  for (const link of view.snapshotJson.links) {
    linkedNodes.add(link.from);
    linkedNodes.add(link.to);
  }

  for (const node of view.snapshotJson.nodes) {
    if (!linkedNodes.has(node.id) && view.snapshotJson.nodes.length > 1) {
      warnings.push(`Узел "${node.name}" не связан с другими узлами`);
    }
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Get default mask rules
 */
export function getDefaultMaskRules(): MaskRules {
  return { ...DEFAULT_MASK_RULES };
}

/**
 * Create mask rules from user options
 */
export function createMaskRules(options: {
  maskAccountNumbers?: boolean;
  maskAssetValues?: boolean;
  excludeNodeTypes?: string[];
  excludeJurisdictions?: string[];
  simplifyPercentages?: boolean;
}): MaskRules {
  return {
    ...DEFAULT_MASK_RULES,
    ...options,
    hideInternalNotes: true, // Always hide internal notes
  };
}

/**
 * Get view summary for display
 */
export function getViewSummary(view: ClientSafeView): {
  nodesCount: number;
  linksCount: number;
  nodeTypes: string[];
  publishedAt: string;
} {
  const nodeTypes = [...new Set(view.snapshotJson.nodes.map(n => n.typeLabel))];

  return {
    nodesCount: view.snapshotJson.nodes.length,
    linksCount: view.snapshotJson.links.length,
    nodeTypes,
    publishedAt: view.publishedAt,
  };
}

/**
 * Compare two views
 */
export function compareViews(
  oldView: ClientSafeView,
  newView: ClientSafeView
): {
  nodesAdded: string[];
  nodesRemoved: string[];
  linksAdded: string[];
  linksRemoved: string[];
} {
  const oldNodeIds = new Set(oldView.snapshotJson.nodes.map(n => n.id));
  const newNodeIds = new Set(newView.snapshotJson.nodes.map(n => n.id));
  const oldLinkIds = new Set(oldView.snapshotJson.links.map(l => l.id));
  const newLinkIds = new Set(newView.snapshotJson.links.map(l => l.id));

  return {
    nodesAdded: [...newNodeIds].filter(id => !oldNodeIds.has(id)),
    nodesRemoved: [...oldNodeIds].filter(id => !newNodeIds.has(id)),
    linksAdded: [...newLinkIds].filter(id => !oldLinkIds.has(id)),
    linksRemoved: [...oldLinkIds].filter(id => !newLinkIds.has(id)),
  };
}
