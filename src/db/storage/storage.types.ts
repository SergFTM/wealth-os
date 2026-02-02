export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueryOptions {
  search?: string;
  status?: string;
  clientId?: string;
  entityId?: string;
  portfolioId?: string;
  accountId?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuditEvent {
  id: string;
  ts: string;
  actorRole: string;
  actorName: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'view' | 'share' | 'revoke';
  collection: string;
  recordId: string;
  summary: string;
  scope?: string;
  severity?: 'info' | 'warning' | 'critical';
  details?: Record<string, unknown>;
}

export interface StorageAdapter {
  list<T extends BaseRecord>(collection: string, query?: QueryOptions): Promise<T[]>;
  get<T extends BaseRecord>(collection: string, id: string): Promise<T | null>;
  create<T extends BaseRecord>(collection: string, record: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update<T extends BaseRecord>(collection: string, id: string, patch: Partial<T>): Promise<T | null>;
  remove(collection: string, id: string): Promise<boolean>;
  appendAudit(event: Omit<AuditEvent, 'id' | 'ts'>): Promise<AuditEvent>;
  getAuditEvents(recordId: string): Promise<AuditEvent[]>;
  count(collection: string, query?: QueryOptions): Promise<number>;
}

export type Collection = 
  | 'clients'
  | 'entities'
  | 'portfolios'
  | 'accounts'
  | 'documents'
  | 'tasks'
  | 'approvals'
  | 'breaches'
  | 'alerts'
  | 'invoices'
  | 'payments'
  | 'syncJobs'
  | 'dataQualityIssues'
  | 'messages'
  | 'threads'
  | 'accessReviews'
  | 'auditEvents'
  | 'taxLots'
  | 'trusts'
  | 'beneficiaries'
  | 'reports'
  | 'glEntries'
  | 'partnerships'
  | 'capitalCalls'
  | 'distributions'
  | 'cashflows'
  | 'ipsRules'
  | 'riskAlerts'
  | 'sessions'
  | 'connections'
  // Private Capital collections
  | 'pcFunds'
  | 'pcCommitments'
  | 'pcCapitalCalls'
  | 'pcDistributions'
  | 'pcValuations'
  | 'pcVintageMetrics'
  | 'pcForecasts'
  // Liquidity collections
  | 'cashAccounts'
  | 'cashMovements'
  | 'cashForecast'
  | 'obligations'
  | 'liquidityAlerts'
  | 'liquidityBuckets';
