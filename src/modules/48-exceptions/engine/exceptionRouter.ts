/**
 * Exception Router - Routes exceptions from any module to the exception center
 */

export interface CreateExceptionInput {
  clientId: string;
  title: string;
  description?: string;
  typeKey: 'sync' | 'recon' | 'missing_doc' | 'stale_price' | 'approval' | 'vendor_sla' | 'security';
  severity: 'ok' | 'warning' | 'critical';
  sourceModuleKey: string;
  sourceCollection?: string;
  sourceId?: string;
  linkUrl?: string;
  lineageJson?: {
    reason: string;
    chain?: Array<{
      module: string;
      collection: string;
      id: string;
      label: string;
    }>;
  };
  sourceAsOf?: string;
}

export interface Exception {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  typeKey: 'sync' | 'recon' | 'missing_doc' | 'stale_price' | 'approval' | 'vendor_sla' | 'security';
  severity: 'ok' | 'warning' | 'critical';
  status: 'open' | 'triage' | 'in_progress' | 'closed';
  sourceModuleKey: string;
  sourceCollection?: string;
  sourceId?: string;
  linkUrl?: string;
  lineageJson?: object;
  sourceAsOf?: string;
  assignedToUserId?: string;
  assignedToRole?: string;
  watchersJson?: string[];
  slaPolicyId?: string;
  slaDueAt?: string;
  slaAtRisk?: boolean;
  remediationJson?: Array<{
    title: string;
    status: string;
    ownerRole?: string;
    dueAt?: string;
    completedAt?: string;
    notes?: string;
  }>;
  timelineJson?: Array<{
    at: string;
    type: 'created' | 'assigned' | 'severity_changed' | 'status_changed' | 'closed' | 'reopened' | 'escalated' | 'remediation_updated' | 'comment';
    by?: string;
    notes?: string;
  }>;
  clusterId?: string;
  sourceResolved?: boolean;
  aiSummary?: string;
  aiProposedSteps?: string[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export function buildExceptionFromInput(input: CreateExceptionInput): Omit<Exception, 'id' | 'createdAt' | 'updatedAt'> {
  const now = new Date().toISOString();

  return {
    clientId: input.clientId,
    title: input.title,
    description: input.description,
    typeKey: input.typeKey,
    severity: input.severity,
    status: 'open',
    sourceModuleKey: input.sourceModuleKey,
    sourceCollection: input.sourceCollection,
    sourceId: input.sourceId,
    linkUrl: input.linkUrl,
    lineageJson: input.lineageJson,
    sourceAsOf: input.sourceAsOf,
    slaAtRisk: false,
    sourceResolved: false,
    remediationJson: [],
    timelineJson: [
      {
        at: now,
        type: 'created',
        notes: `Исключение создано из модуля ${input.sourceModuleKey}`
      }
    ]
  };
}

export function buildLinkUrl(moduleKey: string, collection?: string, id?: string): string {
  const moduleRoutes: Record<string, string> = {
    '14': '/m/integrations',
    '2': '/m/gl',
    '39': '/m/liquidity',
    '42': '/m/deals',
    '5': '/m/documents',
    '16': '/m/pricing',
    '7': '/m/approvals',
    '28': '/m/workflows',
    '44': '/m/policies',
    '43': '/m/vendors',
    '17': '/m/security'
  };

  const baseRoute = moduleRoutes[moduleKey] || `/m/module-${moduleKey}`;

  if (collection && id) {
    return `${baseRoute}/${collection}/${id}`;
  }

  return baseRoute;
}

export const moduleLabels: Record<string, { ru: string; en: string }> = {
  '14': { ru: 'Интеграции', en: 'Integrations' },
  '2': { ru: 'Главная книга', en: 'General Ledger' },
  '39': { ru: 'Ликвидность', en: 'Liquidity' },
  '42': { ru: 'Сделки', en: 'Deals' },
  '5': { ru: 'Документы', en: 'Documents' },
  '16': { ru: 'Ценообразование', en: 'Pricing' },
  '7': { ru: 'Согласования', en: 'Approvals' },
  '28': { ru: 'Воркфлоу', en: 'Workflows' },
  '44': { ru: 'Политики', en: 'Policies' },
  '43': { ru: 'Вендоры', en: 'Vendors' },
  '17': { ru: 'Безопасность', en: 'Security' }
};
