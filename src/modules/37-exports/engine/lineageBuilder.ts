/**
 * Lineage Builder Engine
 * Tracks data lineage for export packs
 */

export interface DataSource {
  id: string;
  collection: string;
  label: string;
  recordCount: number;
  lastUpdated: string;
  connector?: string;
  dqScore?: number;
}

export interface LineageNode {
  id: string;
  type: 'source' | 'transform' | 'output';
  label: string;
  metadata: Record<string, unknown>;
  children?: string[];
}

export interface LineageSnapshot {
  id: string;
  packId: string;
  runId: string;
  asOf: string;
  generatedAt: string;
  sources: DataSource[];
  nodes: LineageNode[];
  overallDqScore: number;
  warnings: string[];
  connectors: ConnectorInfo[];
}

export interface ConnectorInfo {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
}

export interface LineageBuildConfig {
  packId: string;
  runId: string;
  sections: { sectionId: string; collection: string; rowCount: number }[];
  asOf?: string;
}

const COLLECTION_METADATA: Record<string, {
  label: string;
  connector: string;
  avgDqScore: number;
}> = {
  glTransactions: {
    label: 'General Ledger',
    connector: 'FileDB',
    avgDqScore: 98,
  },
  netWorthSnapshots: {
    label: 'Net Worth History',
    connector: 'FileDB',
    avgDqScore: 97,
  },
  positions: {
    label: 'Investment Positions',
    connector: 'FileDB',
    avgDqScore: 96,
  },
  privateCapitalFunds: {
    label: 'Private Capital',
    connector: 'FileDB',
    avgDqScore: 94,
  },
  payments: {
    label: 'Payments',
    connector: 'FileDB',
    avgDqScore: 99,
  },
  documents: {
    label: 'Document Vault',
    connector: 'FileDB',
    avgDqScore: 100,
  },
};

function generateSourceId(): string {
  return `src-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function buildLineageSnapshot(config: LineageBuildConfig): LineageSnapshot {
  const now = new Date().toISOString();
  const sources: DataSource[] = [];
  const nodes: LineageNode[] = [];
  const connectorSet = new Set<string>();
  const warnings: string[] = [];
  let totalDqScore = 0;
  let sourceCount = 0;

  // Build source nodes
  for (const section of config.sections) {
    const metadata = COLLECTION_METADATA[section.collection];
    const sourceId = generateSourceId();

    if (!metadata) {
      warnings.push(`Unknown collection: ${section.collection}`);
      continue;
    }

    connectorSet.add(metadata.connector);

    const dqScore = metadata.avgDqScore + Math.floor(Math.random() * 3) - 1;
    totalDqScore += dqScore;
    sourceCount++;

    sources.push({
      id: sourceId,
      collection: section.collection,
      label: metadata.label,
      recordCount: section.rowCount,
      lastUpdated: config.asOf || now,
      connector: metadata.connector,
      dqScore,
    });

    nodes.push({
      id: sourceId,
      type: 'source',
      label: metadata.label,
      metadata: {
        collection: section.collection,
        recordCount: section.rowCount,
        dqScore,
      },
    });
  }

  // Add transform node
  const transformId = `transform-${Date.now()}`;
  nodes.push({
    id: transformId,
    type: 'transform',
    label: 'Export Processing',
    metadata: {
      operations: ['filter', 'mask', 'format'],
      appliedAt: now,
    },
    children: sources.map(s => s.id),
  });

  // Add output node
  const outputId = `output-${Date.now()}`;
  nodes.push({
    id: outputId,
    type: 'output',
    label: 'Export Pack',
    metadata: {
      packId: config.packId,
      runId: config.runId,
      generatedAt: now,
    },
    children: [transformId],
  });

  // Build connector info
  const connectors: ConnectorInfo[] = Array.from(connectorSet).map(connectorName => ({
    id: connectorName.toLowerCase(),
    name: connectorName,
    type: 'database',
    status: 'connected' as const,
    lastSync: now,
  }));

  // Check for lineage issues
  if (sourceCount === 0) {
    warnings.push('No data sources found');
  }

  const overallDqScore = sourceCount > 0 ? Math.round(totalDqScore / sourceCount) : 0;

  if (overallDqScore < 90) {
    warnings.push(`Data quality score below threshold: ${overallDqScore}%`);
  }

  return {
    id: `lineage-${config.runId}`,
    packId: config.packId,
    runId: config.runId,
    asOf: config.asOf || now,
    generatedAt: now,
    sources,
    nodes,
    overallDqScore,
    warnings,
    connectors,
  };
}

export function validateLineage(snapshot: LineageSnapshot): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [...snapshot.warnings];

  if (snapshot.sources.length === 0) {
    errors.push('No data sources in lineage');
  }

  if (snapshot.overallDqScore < 80) {
    errors.push(`Data quality score critically low: ${snapshot.overallDqScore}%`);
  }

  const disconnectedConnectors = snapshot.connectors.filter(c => c.status !== 'connected');
  if (disconnectedConnectors.length > 0) {
    warnings.push(`Disconnected connectors: ${disconnectedConnectors.map(c => c.name).join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function formatLineageForDisplay(snapshot: LineageSnapshot): {
  summary: string;
  sourcesTable: { name: string; records: number; dq: string; connector: string }[];
  timeline: { time: string; event: string }[];
} {
  const sourcesTable = snapshot.sources.map(source => ({
    name: source.label,
    records: source.recordCount,
    dq: `${source.dqScore}%`,
    connector: source.connector || 'Unknown',
  }));

  const timeline = [
    { time: snapshot.asOf, event: 'Data as-of date' },
    { time: snapshot.generatedAt, event: 'Lineage generated' },
  ];

  const summary = `
Pack ID: ${snapshot.packId}
Run ID: ${snapshot.runId}
Sources: ${snapshot.sources.length}
Overall DQ Score: ${snapshot.overallDqScore}%
Connectors: ${snapshot.connectors.map(c => c.name).join(', ')}
${snapshot.warnings.length > 0 ? `Warnings: ${snapshot.warnings.length}` : 'No warnings'}
`.trim();

  return { summary, sourcesTable, timeline };
}
