// Unified reading of publications for portal
// Aggregates data from multiple modules into portal-consumable format

export interface PortalPublication {
  id: string;
  type: 'net-worth' | 'performance' | 'document' | 'pack' | 'ownership' | 'philanthropy' | 'relationship';
  title: string;
  summary?: string;
  asOfDate: string;
  sourceModule: string;
  sourceCollection: string;
  sourceRecordId: string;
  publishedAt: string;
  tags?: string[];
}

export function mapDocumentToPublication(doc: Record<string, unknown>): PortalPublication {
  return {
    id: `pub-doc-${doc.id}`,
    type: 'document',
    title: (doc.name || doc.title || 'Document') as string,
    summary: (doc.category || '') as string,
    asOfDate: (doc.updatedAt || doc.createdAt || new Date().toISOString()) as string,
    sourceModule: 'documents',
    sourceCollection: 'documents',
    sourceRecordId: doc.id as string,
    publishedAt: (doc.createdAt || new Date().toISOString()) as string,
    tags: (doc.tags || []) as string[]
  };
}

export function mapPackToPublication(pack: Record<string, unknown>): PortalPublication {
  return {
    id: `pub-pack-${pack.id}`,
    type: 'pack',
    title: (pack.name || pack.title || 'Pack') as string,
    summary: (pack.description || '') as string,
    asOfDate: (pack.asOfDate || pack.updatedAt || new Date().toISOString()) as string,
    sourceModule: 'packs',
    sourceCollection: 'reportPacks',
    sourceRecordId: pack.id as string,
    publishedAt: (pack.publishedAt || pack.createdAt || new Date().toISOString()) as string,
    tags: (pack.tags || []) as string[]
  };
}

export function mapOwnershipViewToPublication(view: Record<string, unknown>): PortalPublication {
  return {
    id: `pub-own-${view.id}`,
    type: 'ownership',
    title: (view.name || view.label || 'Ownership View') as string,
    summary: (view.description || '') as string,
    asOfDate: (view.asOfDate || view.updatedAt || new Date().toISOString()) as string,
    sourceModule: 'ownership',
    sourceCollection: 'ownershipViews',
    sourceRecordId: view.id as string,
    publishedAt: (view.publishedAt || view.createdAt || new Date().toISOString()) as string
  };
}

export function mapImpactReportToPublication(report: Record<string, unknown>): PortalPublication {
  return {
    id: `pub-phil-${report.id}`,
    type: 'philanthropy',
    title: (report.title || report.name || 'Impact Report') as string,
    summary: (report.summaryRu || report.summary || '') as string,
    asOfDate: (report.periodEnd || report.updatedAt || new Date().toISOString()) as string,
    sourceModule: 'philanthropy',
    sourceCollection: 'philImpactReports',
    sourceRecordId: report.id as string,
    publishedAt: (report.publishedAt || report.createdAt || new Date().toISOString()) as string
  };
}
