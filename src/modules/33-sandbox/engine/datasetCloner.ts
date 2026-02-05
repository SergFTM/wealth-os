/**
 * Dataset Cloner Engine
 * Clone and manage sandbox datasets
 */

export interface DatasetTemplate {
  id: string;
  name: string;
  description: string;
  templateType: 'family_office_demo' | 'private_capital_heavy' | 'high_volume_transactions' | 'minimal' | 'custom';
  collections: string[];
  recordCounts: Record<string, number>;
}

export interface CloneOptions {
  targetEnvId: string;
  includeRelations: boolean;
  randomizeIds: boolean;
  dateOffset?: number; // days to offset dates
}

export interface CloneResult {
  success: boolean;
  datasetId: string;
  recordsCloned: number;
  collections: string[];
  errors: string[];
}

// Predefined dataset templates
export const datasetTemplates: DatasetTemplate[] = [
  {
    id: 'tpl-family-office',
    name: 'Family Office Demo',
    description: 'Typical family office with diversified portfolio',
    templateType: 'family_office_demo',
    collections: ['clients', 'entities', 'portfolios', 'accounts', 'transactions', 'documents'],
    recordCounts: { clients: 5, entities: 15, portfolios: 8, accounts: 25, transactions: 500, documents: 100 },
  },
  {
    id: 'tpl-private-capital',
    name: 'Private Capital Heavy',
    description: 'Focus on PE/VC investments',
    templateType: 'private_capital_heavy',
    collections: ['clients', 'entities', 'pcFunds', 'pcCommitments', 'pcCapitalCalls', 'pcDistributions'],
    recordCounts: { clients: 3, entities: 10, pcFunds: 20, pcCommitments: 30, pcCapitalCalls: 50, pcDistributions: 40 },
  },
  {
    id: 'tpl-high-volume',
    name: 'High Volume Transactions',
    description: 'Large transaction volumes for load testing',
    templateType: 'high_volume_transactions',
    collections: ['transactions', 'positions', 'cashMovements'],
    recordCounts: { transactions: 100000, positions: 5000, cashMovements: 20000 },
  },
  {
    id: 'tpl-minimal',
    name: 'Minimal Test',
    description: 'Minimal dataset for quick tests',
    templateType: 'minimal',
    collections: ['clients', 'accounts'],
    recordCounts: { clients: 2, accounts: 5 },
  },
];

export function getDatasetTemplate(templateType: string): DatasetTemplate | undefined {
  return datasetTemplates.find(t => t.templateType === templateType);
}

export function generateCloneId(): string {
  return `sbds-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}

export async function cloneDataset(
  sourceDatasetId: string,
  options: CloneOptions
): Promise<CloneResult> {
  // In MVP, this is a simulated clone operation
  const result: CloneResult = {
    success: true,
    datasetId: generateCloneId(),
    recordsCloned: 0,
    collections: [],
    errors: [],
  };

  try {
    // Fetch source dataset info
    const response = await fetch(`/api/collections/sbDatasets/${sourceDatasetId}`);
    if (!response.ok) {
      throw new Error('Source dataset not found');
    }

    const sourceDataset = await response.json();
    const collections = sourceDataset.includesJson || [];

    result.collections = collections;

    // Calculate total records (simulated)
    let totalRecords = 0;
    const template = getDatasetTemplate(sourceDataset.templateType);
    if (template) {
      totalRecords = Object.values(template.recordCounts).reduce((sum, count) => sum + count, 0);
    }

    result.recordsCloned = totalRecords;

    // Create the cloned dataset record
    const clonedDataset = {
      clientId: sourceDataset.clientId,
      name: `${sourceDataset.name} (Clone)`,
      description: `Cloned from ${sourceDataset.name}`,
      templateType: sourceDataset.templateType,
      includesJson: collections,
      statsJson: {
        totalRecords,
        collections: collections.length,
        sizeKb: Math.floor(totalRecords * 0.5),
      },
      status: 'active',
    };

    await fetch('/api/collections/sbDatasets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clonedDataset),
    });

  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Clone failed');
  }

  return result;
}

export async function resetDataset(datasetId: string): Promise<boolean> {
  // In MVP, reset is simulated
  console.log(`Resetting dataset ${datasetId}`);
  return true;
}

export function estimateCloneSize(template: DatasetTemplate): { records: number; sizeKb: number } {
  const records = Object.values(template.recordCounts).reduce((sum, count) => sum + count, 0);
  return {
    records,
    sizeKb: Math.floor(records * 0.5),
  };
}
