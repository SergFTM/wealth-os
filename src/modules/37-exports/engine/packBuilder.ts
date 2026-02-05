/**
 * Pack Builder Engine
 * Builds export pack datasets from configured sections
 */

export interface PackSection {
  sectionId: string;
  enabled: boolean;
  filters?: Record<string, unknown>;
  columns?: string[];
  format?: 'csv' | 'pdf';
}

export interface PackConfig {
  id: string;
  name: string;
  packType: 'audit' | 'tax' | 'bank' | 'ops';
  scopeType: string;
  scopeId?: string;
  asOf?: string;
  clientSafe: boolean;
  sections: PackSection[];
}

export interface DatasetResult {
  sectionId: string;
  label: string;
  data: Record<string, unknown>[];
  columns: string[];
  rowCount: number;
  sources: string[];
  asOf: string;
}

export interface PackBuildResult {
  packId: string;
  datasets: DatasetResult[];
  lineage: {
    sources: string[];
    asOf: string;
    dqScore: number;
    connectors: string[];
  };
  errors: { sectionId: string; message: string }[];
}

const SECTION_CONFIGS: Record<string, {
  label: string;
  collection: string;
  defaultColumns: string[];
  clientSafeColumns: string[];
}> = {
  gl_journal: {
    label: 'GL Journal',
    collection: 'glTransactions',
    defaultColumns: ['date', 'account', 'debit', 'credit', 'description', 'reference'],
    clientSafeColumns: ['date', 'description', 'amount'],
  },
  net_worth: {
    label: 'Net Worth Snapshot',
    collection: 'netWorthSnapshots',
    defaultColumns: ['date', 'totalAssets', 'totalLiabilities', 'netWorth', 'change'],
    clientSafeColumns: ['date', 'netWorth', 'change'],
  },
  positions: {
    label: 'Positions',
    collection: 'positions',
    defaultColumns: ['symbol', 'name', 'quantity', 'price', 'value', 'costBasis', 'gainLoss'],
    clientSafeColumns: ['symbol', 'name', 'value', 'gainLossPercent'],
  },
  private_capital: {
    label: 'Private Capital Schedule',
    collection: 'privateCapitalFunds',
    defaultColumns: ['fundName', 'commitment', 'called', 'distributed', 'nav', 'irr'],
    clientSafeColumns: ['fundName', 'nav', 'irr'],
  },
  payments: {
    label: 'Payments Summary',
    collection: 'payments',
    defaultColumns: ['date', 'payee', 'amount', 'category', 'status', 'reference'],
    clientSafeColumns: ['date', 'category', 'amount'],
  },
  documents: {
    label: 'Documents Index',
    collection: 'documents',
    defaultColumns: ['name', 'category', 'uploadedAt', 'size', 'tags'],
    clientSafeColumns: ['name', 'category', 'uploadedAt'],
  },
};

function generateDemoData(sectionId: string, count: number = 25): Record<string, unknown>[] {
  const now = new Date();
  const data: Record<string, unknown>[] = [];

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];

    switch (sectionId) {
      case 'gl_journal':
        data.push({
          id: `gl-${i}`,
          date: dateStr,
          account: `${1000 + Math.floor(Math.random() * 9000)}`,
          debit: Math.random() > 0.5 ? Math.floor(Math.random() * 100000) : 0,
          credit: Math.random() > 0.5 ? Math.floor(Math.random() * 100000) : 0,
          description: `Transaction ${i + 1}`,
          reference: `REF-${String(i + 1).padStart(6, '0')}`,
        });
        break;
      case 'net_worth':
        data.push({
          id: `nw-${i}`,
          date: dateStr,
          totalAssets: 50000000 + Math.floor(Math.random() * 10000000),
          totalLiabilities: 5000000 + Math.floor(Math.random() * 2000000),
          netWorth: 45000000 + Math.floor(Math.random() * 8000000),
          change: (Math.random() - 0.5) * 5,
        });
        break;
      case 'positions':
        const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'NVDA', 'TSLA', 'JPM', 'V', 'MA'];
        const symbol = symbols[i % symbols.length];
        const quantity = Math.floor(Math.random() * 10000);
        const price = 100 + Math.random() * 400;
        const costBasis = price * (0.7 + Math.random() * 0.3);
        data.push({
          id: `pos-${i}`,
          symbol,
          name: `${symbol} Inc.`,
          quantity,
          price: Math.round(price * 100) / 100,
          value: Math.round(quantity * price),
          costBasis: Math.round(quantity * costBasis),
          gainLoss: Math.round(quantity * (price - costBasis)),
          gainLossPercent: Math.round((price / costBasis - 1) * 10000) / 100,
        });
        break;
      case 'private_capital':
        const fundNames = ['Growth Fund I', 'Venture Partners II', 'Real Estate Fund III', 'Infrastructure IV', 'Credit Opportunities V'];
        data.push({
          id: `pc-${i}`,
          fundName: fundNames[i % fundNames.length] + (i >= fundNames.length ? ` - ${Math.floor(i / fundNames.length) + 1}` : ''),
          commitment: 5000000 + Math.floor(Math.random() * 10000000),
          called: 3000000 + Math.floor(Math.random() * 5000000),
          distributed: 1000000 + Math.floor(Math.random() * 3000000),
          nav: 4000000 + Math.floor(Math.random() * 8000000),
          irr: Math.round((5 + Math.random() * 20) * 100) / 100,
        });
        break;
      case 'payments':
        const payees = ['Vendor Corp', 'Service LLC', 'Consulting Inc', 'Management Co', 'Advisory Group'];
        const categories = ['Operations', 'Professional Fees', 'Insurance', 'Taxes', 'Distributions'];
        data.push({
          id: `pmt-${i}`,
          date: dateStr,
          payee: payees[i % payees.length],
          amount: Math.floor(Math.random() * 500000),
          category: categories[i % categories.length],
          status: Math.random() > 0.1 ? 'completed' : 'pending',
          reference: `PMT-${String(i + 1).padStart(6, '0')}`,
        });
        break;
      case 'documents':
        const docCategories = ['Financial Statements', 'Tax Returns', 'Legal Documents', 'Insurance', 'Agreements'];
        data.push({
          id: `doc-${i}`,
          name: `Document_${i + 1}.pdf`,
          category: docCategories[i % docCategories.length],
          uploadedAt: date.toISOString(),
          size: Math.floor(Math.random() * 5000000),
          tags: ['audit', 'archive'],
        });
        break;
    }
  }

  return data;
}

function applyClientSafeMasking(data: Record<string, unknown>[], sectionId: string): Record<string, unknown>[] {
  const config = SECTION_CONFIGS[sectionId];
  if (!config) return data;

  return data.map(row => {
    const masked: Record<string, unknown> = {};
    config.clientSafeColumns.forEach(col => {
      if (col in row) {
        // Mask account numbers
        if (col === 'account' && typeof row[col] === 'string') {
          masked[col] = '****' + (row[col] as string).slice(-4);
        } else {
          masked[col] = row[col];
        }
      }
    });
    return masked;
  });
}

export async function buildPackDatasets(config: PackConfig): Promise<PackBuildResult> {
  const datasets: DatasetResult[] = [];
  const errors: { sectionId: string; message: string }[] = [];
  const allSources: Set<string> = new Set();

  for (const section of config.sections) {
    if (!section.enabled) continue;

    const sectionConfig = SECTION_CONFIGS[section.sectionId];
    if (!sectionConfig) {
      errors.push({ sectionId: section.sectionId, message: 'Unknown section type' });
      continue;
    }

    try {
      // In production, fetch from API
      // For MVP, generate demo data
      let data = generateDemoData(section.sectionId, 25);

      // Apply client-safe masking if needed
      if (config.clientSafe) {
        data = applyClientSafeMasking(data, section.sectionId);
      }

      // Apply column selection
      const columns = config.clientSafe
        ? sectionConfig.clientSafeColumns
        : section.columns || sectionConfig.defaultColumns;

      datasets.push({
        sectionId: section.sectionId,
        label: sectionConfig.label,
        data,
        columns,
        rowCount: data.length,
        sources: [sectionConfig.collection],
        asOf: config.asOf || new Date().toISOString(),
      });

      allSources.add(sectionConfig.collection);
    } catch (err) {
      errors.push({
        sectionId: section.sectionId,
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return {
    packId: config.id,
    datasets,
    lineage: {
      sources: Array.from(allSources),
      asOf: config.asOf || new Date().toISOString(),
      dqScore: 95 + Math.floor(Math.random() * 5),
      connectors: ['FileDB', 'DemoGenerator'],
    },
    errors,
  };
}

export function getAvailableSections(): { id: string; label: string; collection: string }[] {
  return Object.entries(SECTION_CONFIGS).map(([id, config]) => ({
    id,
    label: config.label,
    collection: config.collection,
  }));
}

export function getDefaultSectionsForPackType(packType: string): PackSection[] {
  const allSections = Object.keys(SECTION_CONFIGS);

  const packSections: Record<string, string[]> = {
    audit: ['gl_journal', 'net_worth', 'positions', 'private_capital', 'payments', 'documents'],
    tax: ['positions', 'payments', 'documents'],
    bank: ['net_worth', 'positions', 'documents'],
    ops: ['payments', 'documents'],
  };

  const enabledSections = packSections[packType] || allSections;

  return allSections.map(sectionId => ({
    sectionId,
    enabled: enabledSections.includes(sectionId),
    format: 'csv' as const,
  }));
}
