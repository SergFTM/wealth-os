// AI Sources - Source reference management

export interface SourceReference {
  module: string;
  recordType: string;
  recordId: string;
  label: string;
  value?: string | number;
  url?: string;
}

export interface SourceFilter {
  modules?: string[];
  recordTypes?: string[];
  clientSafe?: boolean;
  userRole?: string;
  allowedModules?: string[];
}

// Create a source reference
export function createSourceRef(
  module: string,
  recordType: string,
  recordId: string,
  label: string,
  value?: string | number
): SourceReference {
  return {
    module,
    recordType,
    recordId,
    label,
    value,
    url: `/m/${module}/item/${recordId}`,
  };
}

// Normalize sources list
export function normalizeSources(
  sources: SourceReference[],
  filter?: SourceFilter
): SourceReference[] {
  let filtered = [...sources];

  // Filter by modules
  if (filter?.modules && filter.modules.length > 0) {
    filtered = filtered.filter(s => filter.modules!.includes(s.module));
  }

  // Filter by record types
  if (filter?.recordTypes && filter.recordTypes.length > 0) {
    filtered = filtered.filter(s => filter.recordTypes!.includes(s.recordType));
  }

  // Apply RBAC filtering
  if (filter?.allowedModules && !filter.allowedModules.includes('*')) {
    filtered = filtered.filter(s => filter.allowedModules!.includes(s.module));
  }

  // Remove duplicates
  const seen = new Set<string>();
  return filtered.filter(s => {
    const key = `${s.module}:${s.recordType}:${s.recordId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Generate mock sources for a prompt type (MVP simulation)
export function generateMockSources(
  promptType: string,
  context: { scope?: { type: string; id: string }; module?: string }
): SourceReference[] {
  const sources: SourceReference[] = [];
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  switch (promptType) {
    case 'explain_change':
      sources.push(
        createSourceRef('net-worth', 'position', `pos-${dateStr}-001`, 'Позиция AAPL', '+12.5%'),
        createSourceRef('net-worth', 'position', `pos-${dateStr}-002`, 'Позиция MSFT', '+8.3%'),
        createSourceRef('net-worth', 'position', `pos-${dateStr}-003`, 'Позиция облигации', '+1.2%'),
        createSourceRef('general-ledger', 'transaction', `txn-${dateStr}-001`, 'Дивиденды Q4', '$15,000'),
        createSourceRef('general-ledger', 'transaction', `txn-${dateStr}-002`, 'Комиссия управления', '-$3,500')
      );
      break;

    case 'summarize_risk':
      sources.push(
        createSourceRef('risk', 'alert', `alert-${dateStr}-001`, 'Концентрация TECH', 'critical'),
        createSourceRef('risk', 'alert', `alert-${dateStr}-002`, 'Валютная экспозиция', 'warning'),
        createSourceRef('ips', 'breach', `breach-${dateStr}-001`, 'Превышение лимита', 'open'),
        createSourceRef('risk', 'metric', `metric-${dateStr}-001`, 'VaR 95%', '4.2%')
      );
      break;

    case 'summarize_performance':
      sources.push(
        createSourceRef('performance', 'portfolio', 'port-001', 'Основной портфель', '+15.2% YTD'),
        createSourceRef('performance', 'portfolio', 'port-002', 'Консервативный', '+6.8% YTD'),
        createSourceRef('performance', 'benchmark', 'bench-001', '60/40 Benchmark', '+11.5% YTD')
      );
      break;

    case 'triage_tasks':
      sources.push(
        createSourceRef('workflow', 'task', 'task-001', 'Согласование IPS', 'SLA: 2ч'),
        createSourceRef('integrations', 'issue', 'issue-001', 'Расхождение данных', 'critical'),
        createSourceRef('ips', 'breach', 'breach-001', 'Breach требует waiver', 'pending'),
        createSourceRef('fees', 'invoice', 'inv-001', 'Неоплаченный счет', '$12,500')
      );
      break;

    case 'check_data_quality':
      sources.push(
        createSourceRef('integrations', 'issue', 'dq-001', 'Дубликаты позиций', '3 записи'),
        createSourceRef('integrations', 'issue', 'dq-002', 'Устаревшие данные', '> 24ч'),
        createSourceRef('integrations', 'run', 'run-001', 'Последняя синхронизация', 'partial')
      );
      break;

    case 'draft_message':
    case 'draft_committee_pack':
    case 'draft_policy_summary':
      sources.push(
        createSourceRef('net-worth', 'summary', 'nw-001', 'Net Worth Summary', '$45.2M'),
        createSourceRef('performance', 'summary', 'perf-001', 'Performance Summary', '+12.3%'),
        createSourceRef('ips', 'policy', 'ips-001', 'Текущий IPS', 'active')
      );
      break;

    default:
      sources.push(
        createSourceRef('net-worth', 'summary', 'nw-001', 'Net Worth Summary', '$45.2M')
      );
  }

  return sources;
}

// Format sources for display
export function formatSourcesForDisplay(sources: SourceReference[]): string {
  if (sources.length === 0) {
    return 'Источники не найдены';
  }

  return sources
    .map(s => `• ${s.label}${s.value ? ` (${s.value})` : ''} — ${s.module}`)
    .join('\n');
}

// Serialize sources to JSON
export function serializeSources(sources: SourceReference[]): string {
  return JSON.stringify(sources);
}

// Deserialize sources from JSON
export function deserializeSources(json: string): SourceReference[] {
  try {
    return JSON.parse(json) as SourceReference[];
  } catch {
    return [];
  }
}
