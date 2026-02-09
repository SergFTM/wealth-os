// Module Insights Engine — generates context-aware insights and decision suggestions

import { getModuleKnowledge, type IndustryRule, type BestPractice } from './moduleKnowledge';

export type InsightSeverity = 'info' | 'warning' | 'critical';

export interface InsightSource {
  label: string;
  href: string;
}

export interface ModuleInsight {
  id: string;
  title: string;
  description: string;
  severity: InsightSeverity;
  confidence: number;
  sources: InsightSource[];
  ruleId?: string;
}

export interface DecisionSuggestion {
  id: string;
  title: string;
  description: string;
  impact: string;
  confidence: number;
  sources: InsightSource[];
}

export interface ModuleInsightsResult {
  insights: ModuleInsight[];
  decisions: DecisionSuggestion[];
  contextSummary: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CollectionData = Record<string, any[]>;

/** Main entry: build insights for a given module */
export function buildModuleInsights(
  slug: string,
  collections: CollectionData,
  locale: string,
): ModuleInsightsResult {
  const knowledge = getModuleKnowledge(slug);

  // Try module-specific generator, fall back to generic
  const generator = MODULE_GENERATORS[slug] || generateGenericInsights;
  const { insights, decisions } = generator(slug, collections, knowledge.industryRules, knowledge.bestPractices);

  const contextSummary = buildContextSummary(slug, collections, locale);

  return { insights, decisions, contextSummary };
}

// --- Per-module generators ---------------------------------------------------

type Generator = (
  slug: string,
  data: CollectionData,
  rules: IndustryRule[],
  practices: BestPractice[],
) => { insights: ModuleInsight[]; decisions: DecisionSuggestion[] };

const MODULE_GENERATORS: Record<string, Generator> = {
  'net-worth': generateNetWorthInsights,
  'performance': generatePerformanceInsights,
  'data-quality': generateDataQualityInsights,
  'risk': generateRiskInsights,
  'committee': generateCommitteeInsights,
  'tax': generateTaxInsights,
  'fees': generateFeeInsights,
  'ips': generateIpsInsights,
};

// --- Net Worth ---------------------------------------------------------------

function generateNetWorthInsights(slug: string, data: CollectionData, rules: IndustryRule[], practices: BestPractice[]) {
  const insights: ModuleInsight[] = [];
  const decisions: DecisionSuggestion[] = [];
  const holdings = data['holdings'] || [];
  const liabilities = data['liabilities'] || [];

  // Concentration check
  if (holdings.length > 0) {
    const totalValue = holdings.reduce((s, h) => s + (Number(h.value) || 0), 0);
    const sorted = [...holdings].sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0));
    const top = sorted[0];
    if (top && totalValue > 0) {
      const pct = ((Number(top.value) || 0) / totalValue) * 100;
      if (pct > 15) {
        insights.push({
          id: 'nw-concentration',
          title: `Концентрация: ${top.name || top.id} — ${pct.toFixed(1)}%`,
          description: `Позиция превышает рекомендуемый лимит 15%. Рекомендуется ребалансировка.`,
          severity: 'critical',
          confidence: 88,
          sources: [{ label: 'IPS — лимит концентрации', href: '/m/ips' }],
          ruleId: 'nw-conc-01',
        });
        decisions.push({
          id: 'nw-dec-rebalance',
          title: 'Инициировать ребалансировку',
          description: `Снизить долю ${top.name || top.id} до целевых 10-12% от портфеля`,
          impact: 'Снижение risk concentration, соответствие IPS',
          confidence: 82,
          sources: [{ label: 'Ребалансировка (best practice)', href: '/m/net-worth' }],
        });
      } else if (pct > 10) {
        insights.push({
          id: 'nw-concentration-watch',
          title: `Концентрация под наблюдением: ${top.name || top.id} — ${pct.toFixed(1)}%`,
          description: `Позиция приближается к лимиту 15%. Мониторить динамику.`,
          severity: 'warning',
          confidence: 75,
          sources: [{ label: 'IPS — лимит концентрации', href: '/m/ips' }],
          ruleId: 'nw-conc-01',
        });
      }
    }
  }

  // Stale valuations
  const stale = holdings.filter(h => h.valuationStatus === 'stale' || h.status === 'stale');
  if (stale.length > 0) {
    insights.push({
      id: 'nw-stale',
      title: `${stale.length} позиций с устаревшей оценкой`,
      description: 'Оценки старше 30 дней снижают достоверность Net Worth. Обновите данные из источников.',
      severity: stale.length > 3 ? 'warning' : 'info',
      confidence: 90,
      sources: [{ label: 'Устаревшие оценки', href: '/m/net-worth/list?valuationStatus=stale' }],
      ruleId: 'nw-val-01',
    });
    if (stale.length > 3) {
      decisions.push({
        id: 'nw-dec-refresh',
        title: 'Запросить обновление оценок',
        description: `Запустить синхронизацию для ${stale.length} позиций с устаревшими данными`,
        impact: 'Повышение достоверности Net Worth',
        confidence: 85,
        sources: [{ label: 'Sync Jobs', href: '/m/integrations' }],
      });
    }
  }

  // Liquidity check
  const liquid = holdings.filter(h => h.liquidity === 'liquid' || h.assetClass === 'Cash');
  const illiquid = holdings.filter(h => h.liquidity === 'illiquid');
  if (holdings.length > 0) {
    const totalVal = holdings.reduce((s, h) => s + (Number(h.value) || 0), 0);
    const liquidVal = liquid.reduce((s, h) => s + (Number(h.value) || 0), 0);
    const liquidPct = totalVal > 0 ? (liquidVal / totalVal) * 100 : 0;
    if (liquidPct < 20 && totalVal > 0) {
      insights.push({
        id: 'nw-liquidity',
        title: `Ликвидность: ${liquidPct.toFixed(1)}% (ниже рекомендуемых 20%)`,
        description: 'Доля ликвидных активов ниже минимального порога. Риск при необходимости срочных выплат.',
        severity: 'warning',
        confidence: 80,
        sources: [{ label: 'Ликвидность — IPS', href: '/m/ips' }],
        ruleId: 'nw-liq-01',
      });
    }
  }

  // Liabilities check
  if (liabilities.length > 0) {
    const maturing = liabilities.filter(l => {
      if (!l.maturityDate) return false;
      const diff = new Date(l.maturityDate).getTime() - Date.now();
      return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000;
    });
    if (maturing.length > 0) {
      insights.push({
        id: 'nw-maturity',
        title: `${maturing.length} обязательств к погашению в ближайшие 90 дней`,
        description: 'Проверьте наличие средств для погашения и план рефинансирования.',
        severity: 'info',
        confidence: 85,
        sources: [{ label: 'Обязательства', href: '/m/net-worth/list?type=liabilities' }],
      });
    }
  }

  addGenericFromRules(insights, decisions, rules, practices, slug, data);
  return { insights: insights.slice(0, 5), decisions: decisions.slice(0, 3) };
}

// --- Performance -------------------------------------------------------------

function generatePerformanceInsights(slug: string, data: CollectionData, rules: IndustryRule[], practices: BestPractice[]) {
  const insights: ModuleInsight[] = [];
  const decisions: DecisionSuggestion[] = [];
  const portfolios = data['portfolioReturns'] || data['portfolios'] || [];

  if (portfolios.length > 0) {
    const underperforming = portfolios.filter(p => {
      const vs = Number(p.vsBenchmark || p.alpha || 0);
      return vs < -3;
    });
    if (underperforming.length > 0) {
      insights.push({
        id: 'pf-underperform',
        title: `${underperforming.length} портфелей отстают от benchmark более 3%`,
        description: 'Существенное отклонение от benchmark. Требуется анализ атрибуции и решение комитета.',
        severity: 'warning',
        confidence: 78,
        sources: [{ label: 'Performance Attribution', href: '/m/performance' }],
        ruleId: 'pf-bench-01',
      });
      decisions.push({
        id: 'pf-dec-review',
        title: 'Подготовить review для комитета',
        description: 'Провести атрибуцию доходности и подготовить material для Investment Committee',
        impact: 'Понимание причин отклонения, корректирующие действия',
        confidence: 80,
        sources: [{ label: 'Комитет', href: '/m/committee' }],
      });
    }

    // Drawdown check
    const drawdowns = portfolios.filter(p => Number(p.drawdown || p.maxDrawdown || 0) > 15);
    if (drawdowns.length > 0) {
      insights.push({
        id: 'pf-drawdown',
        title: `Просадка >15% в ${drawdowns.length} портфелях`,
        description: 'Максимальная просадка превышает типичный IPS лимит. Рассмотрите защитные меры.',
        severity: 'critical',
        confidence: 85,
        sources: [{ label: 'Risk limits', href: '/m/risk' }],
        ruleId: 'pf-draw-01',
      });
    }
  }

  // If no data, provide generic insight
  if (insights.length === 0) {
    insights.push({
      id: 'pf-nodata',
      title: 'Данные по доходности загружаются',
      description: 'Проверьте наличие актуальных данных performance в системе.',
      severity: 'info',
      confidence: 60,
      sources: [{ label: 'Performance', href: '/m/performance' }],
    });
  }

  addGenericFromRules(insights, decisions, rules, practices, slug, data);
  return { insights: insights.slice(0, 5), decisions: decisions.slice(0, 3) };
}

// --- Data Quality ------------------------------------------------------------

function generateDataQualityInsights(slug: string, data: CollectionData, rules: IndustryRule[], practices: BestPractice[]) {
  const insights: ModuleInsight[] = [];
  const decisions: DecisionSuggestion[] = [];
  const exceptions = data['dqExceptions'] || [];
  const conflicts = data['dqConflicts'] || [];
  const syncJobs = data['dqSyncJobs'] || [];
  const metrics = data['dqMetrics'] || [];

  // Health score from metrics
  const latestMetric = metrics.sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).at(0);
  const healthScore = latestMetric ? Number(latestMetric.healthScore || latestMetric.score || 0) : null;

  if (healthScore !== null && healthScore < 70) {
    insights.push({
      id: 'dq-health-low',
      title: `Health Score: ${healthScore} — ниже порога 70`,
      description: 'Качество данных требует срочного внимания. Данные могут быть недостоверны для отчётов.',
      severity: healthScore < 50 ? 'critical' : 'warning',
      confidence: 92,
      sources: [{ label: 'Health Score', href: '/m/data-quality' }],
      ruleId: 'dq-health-01',
    });
  }

  // Critical exceptions
  const critical = exceptions.filter(e => e.severity === 'critical' && e.status !== 'resolved' && e.status !== 'closed');
  if (critical.length > 0) {
    insights.push({
      id: 'dq-critical',
      title: `${critical.length} critical исключений не закрыты`,
      description: `SLA 24 часа. Проблемы: ${critical.slice(0, 3).map(e => e.ruleType || e.type || e.title || 'n/a').join(', ')}`,
      severity: 'critical',
      confidence: 95,
      sources: [{ label: 'Critical exceptions', href: '/m/data-quality/list?severity=critical' }],
      ruleId: 'dq-sla-01',
    });
    decisions.push({
      id: 'dq-dec-remediate',
      title: 'Запустить remediation workflow',
      description: `Создать задачи для ${critical.length} critical исключений и назначить ответственных`,
      impact: 'Исправление критических проблем в SLA, повышение Health Score',
      confidence: 90,
      sources: [{ label: 'Remediation (help)', href: '/m/data-quality' }],
    });
  }

  // Unresolved conflicts
  const openConflicts = conflicts.filter(c => c.status !== 'resolved' && c.status !== 'closed');
  if (openConflicts.length > 0) {
    insights.push({
      id: 'dq-conflicts',
      title: `${openConflicts.length} нерешённых конфликтов данных`,
      description: 'Дубликаты, расхождения валют или позиций. Требуется ручной разбор.',
      severity: openConflicts.length > 5 ? 'warning' : 'info',
      confidence: 85,
      sources: [{ label: 'Конфликты', href: '/m/data-quality/list?tab=conflicts' }],
    });
  }

  // Failed sync jobs
  const failedJobs = syncJobs.filter(j => j.status === 'failed' || j.status === 'error');
  if (failedJobs.length > 0) {
    insights.push({
      id: 'dq-sync-fail',
      title: `${failedJobs.length} sync job(s) завершились ошибкой`,
      description: `Проверьте коннекторы: ${failedJobs.slice(0, 2).map(j => j.connector || j.name || j.id).join(', ')}`,
      severity: 'warning',
      confidence: 88,
      sources: [{ label: 'Sync Jobs', href: '/m/data-quality/list?tab=jobs' }],
    });
    decisions.push({
      id: 'dq-dec-retry',
      title: 'Перезапустить неуспешные синхронизации',
      description: `Retry для ${failedJobs.length} неуспешных sync jobs`,
      impact: 'Восстановление потока данных из внешних систем',
      confidence: 82,
      sources: [{ label: 'Sync Jobs', href: '/m/integrations' }],
    });
  }

  addGenericFromRules(insights, decisions, rules, practices, slug, data);
  return { insights: insights.slice(0, 5), decisions: decisions.slice(0, 3) };
}

// --- Risk --------------------------------------------------------------------

function generateRiskInsights(slug: string, data: CollectionData, rules: IndustryRule[], practices: BestPractice[]) {
  const insights: ModuleInsight[] = [];
  const decisions: DecisionSuggestion[] = [];
  const alerts = data['riskAlerts'] || data['alerts'] || [];
  const limits = data['riskLimits'] || [];

  const breaches = alerts.filter(a => a.type === 'breach' || a.severity === 'critical' || a.status === 'breach');
  if (breaches.length > 0) {
    insights.push({
      id: 'rsk-breaches',
      title: `${breaches.length} IPS breach(es) обнаружено`,
      description: 'Нарушения лимитов требуют немедленного уведомления compliance и плана коррекции.',
      severity: 'critical',
      confidence: 92,
      sources: [{ label: 'IPS Breaches', href: '/m/risk' }],
      ruleId: 'rsk-breach-01',
    });
    decisions.push({
      id: 'rsk-dec-notify',
      title: 'Уведомить compliance и клиента',
      description: 'Отправить breach notification в соответствии с регламентом',
      impact: 'Соблюдение регуляторных требований, прозрачность',
      confidence: 95,
      sources: [{ label: 'IPS Compliance', href: '/m/ips' }],
    });
  }

  const warnings = alerts.filter(a => a.severity === 'warning' || a.type === 'warning');
  if (warnings.length > 0) {
    insights.push({
      id: 'rsk-warnings',
      title: `${warnings.length} рисковых предупреждений`,
      description: 'Приближение к лимитам или повышенная волатильность. Рекомендуется мониторинг.',
      severity: 'warning',
      confidence: 78,
      sources: [{ label: 'Risk Alerts', href: '/m/risk' }],
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'rsk-ok',
      title: 'Риск-метрики в пределах лимитов',
      description: 'Текущие позиции соответствуют ограничениям IPS. Продолжайте мониторинг.',
      severity: 'info',
      confidence: 75,
      sources: [{ label: 'Risk Dashboard', href: '/m/risk' }],
    });
  }

  addGenericFromRules(insights, decisions, rules, practices, slug, data);
  return { insights: insights.slice(0, 5), decisions: decisions.slice(0, 3) };
}

// --- Committee ---------------------------------------------------------------

function generateCommitteeInsights(slug: string, data: CollectionData, rules: IndustryRule[], practices: BestPractice[]) {
  const insights: ModuleInsight[] = [];
  const decisions: DecisionSuggestion[] = [];
  const meetings = data['committeeMeetings'] || [];
  const followUps = data['committeeFollowUps'] || [];
  const pendingDecisions = data['committeeDecisions'] || [];

  // Upcoming meetings without quorum
  const upcoming = meetings.filter(m => m.status === 'scheduled');
  if (upcoming.length > 0) {
    insights.push({
      id: 'cm-upcoming',
      title: `${upcoming.length} запланированных заседаний`,
      description: 'Проверьте кворум и наличие материалов за 3 рабочих дня.',
      severity: 'info',
      confidence: 85,
      sources: [{ label: 'Заседания', href: '/m/committee' }],
    });
  }

  // Overdue follow-ups
  const overdue = followUps.filter(f => {
    if (f.status === 'completed' || f.status === 'closed') return false;
    if (!f.dueDate) return false;
    return new Date(f.dueDate) < new Date();
  });
  if (overdue.length > 0) {
    insights.push({
      id: 'cm-overdue',
      title: `${overdue.length} просроченных follow-up задач`,
      description: 'Решения комитета не исполнены в срок. Требуется эскалация.',
      severity: 'warning',
      confidence: 90,
      sources: [{ label: 'Follow-ups', href: '/m/committee' }],
    });
    decisions.push({
      id: 'cm-dec-escalate',
      title: 'Эскалировать просроченные задачи',
      description: 'Уведомить ответственных и включить в повестку следующего заседания',
      impact: 'Контроль исполнения решений',
      confidence: 85,
      sources: [{ label: 'Follow-ups', href: '/m/committee' }],
    });
  }

  // Pending decisions
  const pending = pendingDecisions.filter(d => d.result === 'deferred' || d.status === 'pending');
  if (pending.length > 0) {
    insights.push({
      id: 'cm-pending',
      title: `${pending.length} отложенных решений`,
      description: 'Решения отложены и требуют повторного рассмотрения.',
      severity: 'info',
      confidence: 80,
      sources: [{ label: 'Решения', href: '/m/committee' }],
    });
  }

  addGenericFromRules(insights, decisions, rules, practices, slug, data);
  return { insights: insights.slice(0, 5), decisions: decisions.slice(0, 3) };
}

// --- Tax ---------------------------------------------------------------------

function generateTaxInsights(slug: string, data: CollectionData, rules: IndustryRule[], practices: BestPractice[]) {
  const insights: ModuleInsight[] = [];
  const decisions: DecisionSuggestion[] = [];
  const filings = data['taxFilings'] || data['filings'] || [];
  const lots = data['taxLots'] || [];

  const upcoming = filings.filter(f => {
    if (f.status === 'filed' || f.status === 'completed') return false;
    if (!f.deadline) return false;
    const diff = new Date(f.deadline).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  });

  if (upcoming.length > 0) {
    insights.push({
      id: 'tx-deadline',
      title: `${upcoming.length} дедлайнов подачи в ближайшие 30 дней`,
      description: 'Убедитесь в готовности документов и данных для подачи.',
      severity: 'warning',
      confidence: 90,
      sources: [{ label: 'Tax Filings', href: '/m/tax' }],
      ruleId: 'tx-deadline-01',
    });
    decisions.push({
      id: 'tx-dec-prepare',
      title: 'Подготовить документы к подаче',
      description: 'Проверить данные и сформировать пакет документов для ближайших дедлайнов',
      impact: 'Своевременная подача, избежание штрафов',
      confidence: 88,
      sources: [{ label: 'Tax Filings', href: '/m/tax' }],
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'tx-ok',
      title: 'Нет срочных налоговых дедлайнов',
      description: 'Все текущие обязательства выполнены или далеко от дедлайна.',
      severity: 'info',
      confidence: 70,
      sources: [{ label: 'Tax', href: '/m/tax' }],
    });
  }

  addGenericFromRules(insights, decisions, rules, practices, slug, data);
  return { insights: insights.slice(0, 5), decisions: decisions.slice(0, 3) };
}

// --- Fees --------------------------------------------------------------------

function generateFeeInsights(slug: string, data: CollectionData, rules: IndustryRule[], practices: BestPractice[]) {
  const insights: ModuleInsight[] = [];
  const decisions: DecisionSuggestion[] = [];
  const invoices = data['feeInvoices'] || data['invoices'] || [];
  const schedules = data['feeSchedules'] || [];

  const unpaid = invoices.filter(i => i.status === 'pending' || i.status === 'unpaid' || i.status === 'overdue');
  if (unpaid.length > 0) {
    insights.push({
      id: 'fee-unpaid',
      title: `${unpaid.length} неоплаченных счетов`,
      description: 'Проверьте сроки и суммы для своевременной оплаты.',
      severity: unpaid.some(i => i.status === 'overdue') ? 'warning' : 'info',
      confidence: 85,
      sources: [{ label: 'Fee Billing', href: '/m/fees' }],
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'fee-ok',
      title: 'Все комиссии рассчитаны и оплачены',
      description: 'Нет просроченных или нерассчитанных комиссий.',
      severity: 'info',
      confidence: 70,
      sources: [{ label: 'Fee Billing', href: '/m/fees' }],
    });
  }

  addGenericFromRules(insights, decisions, rules, practices, slug, data);
  return { insights: insights.slice(0, 5), decisions: decisions.slice(0, 3) };
}

// --- IPS ---------------------------------------------------------------------

function generateIpsInsights(slug: string, data: CollectionData, rules: IndustryRule[], practices: BestPractice[]) {
  const insights: ModuleInsight[] = [];
  const decisions: DecisionSuggestion[] = [];
  const policies = data['ipsPolicies'] || data['policies'] || [];
  const breaches = data['ipsBreaches'] || data['breaches'] || [];
  const waivers = data['ipsWaivers'] || data['waivers'] || [];

  const activeBreaches = breaches.filter(b => b.status !== 'resolved' && b.status !== 'closed');
  if (activeBreaches.length > 0) {
    insights.push({
      id: 'ips-breach-active',
      title: `${activeBreaches.length} активных IPS нарушений`,
      description: 'Необходимо уведомление клиента и план коррекции в 24ч.',
      severity: 'critical',
      confidence: 95,
      sources: [{ label: 'IPS Breaches', href: '/m/ips' }],
      ruleId: 'ips-breach-01',
    });
    decisions.push({
      id: 'ips-dec-correct',
      title: 'Создать план коррекции нарушений',
      description: 'Подготовить waiver request или план приведения в соответствие',
      impact: 'Compliance, доверие клиента',
      confidence: 90,
      sources: [{ label: 'IPS Waivers', href: '/m/ips' }],
    });
  }

  // Expiring waivers
  const expiring = waivers.filter(w => {
    if (w.status === 'expired' || w.status === 'closed') return false;
    if (!w.expiryDate) return false;
    const diff = new Date(w.expiryDate).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  });
  if (expiring.length > 0) {
    insights.push({
      id: 'ips-waiver-expiry',
      title: `${expiring.length} waivers истекают в ближайшие 30 дней`,
      description: 'Необходимо продлить или привести позиции в соответствие.',
      severity: 'warning',
      confidence: 85,
      sources: [{ label: 'Waivers', href: '/m/ips' }],
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'ips-compliant',
      title: 'Портфели соответствуют IPS',
      description: 'Нет активных нарушений. Следующий пересмотр по расписанию.',
      severity: 'info',
      confidence: 80,
      sources: [{ label: 'IPS', href: '/m/ips' }],
    });
  }

  addGenericFromRules(insights, decisions, rules, practices, slug, data);
  return { insights: insights.slice(0, 5), decisions: decisions.slice(0, 3) };
}

// --- Generic fallback --------------------------------------------------------

function generateGenericInsights(slug: string, data: CollectionData, rules: IndustryRule[], practices: BestPractice[]) {
  const insights: ModuleInsight[] = [];
  const decisions: DecisionSuggestion[] = [];

  // Count records across all collections
  const totalRecords = Object.values(data).reduce((s, arr) => s + (arr?.length || 0), 0);

  insights.push({
    id: `${slug}-summary`,
    title: `${totalRecords} записей в модуле`,
    description: 'AI проанализировал доступные данные. Используйте чат для уточнений.',
    severity: 'info',
    confidence: 60,
    sources: [{ label: 'Модуль', href: `/m/${slug}` }],
  });

  addGenericFromRules(insights, decisions, rules, practices, slug, data);
  return { insights: insights.slice(0, 5), decisions: decisions.slice(0, 3) };
}

// --- Helpers -----------------------------------------------------------------

function addGenericFromRules(
  insights: ModuleInsight[],
  decisions: DecisionSuggestion[],
  rules: IndustryRule[],
  practices: BestPractice[],
  slug: string,
  _data: CollectionData,
) {
  // Add best practice suggestions if we have room
  if (decisions.length < 2 && practices.length > 0) {
    const practice = practices[0];
    decisions.push({
      id: `bp-${practice.id}`,
      title: practice.title,
      description: practice.description,
      impact: practice.applicableWhen,
      confidence: 70,
      sources: [{ label: 'Best Practice', href: `/m/${slug}` }],
    });
  }
}

function buildContextSummary(slug: string, collections: CollectionData, locale: string): string {
  const counts = Object.entries(collections)
    .map(([name, items]) => `${name}: ${items?.length || 0}`)
    .join(', ');

  if (locale === 'en') {
    return `AI analyzed the module "${slug}" with data: ${counts}. Insights are generated based on industry standards for wealth management.`;
  }
  if (locale === 'uk') {
    return `AI проаналізував модуль "${slug}" з даними: ${counts}. Висновки згенеровано на основі галузевих стандартів wealth management.`;
  }
  return `AI проанализировал модуль «${slug}» с данными: ${counts}. Выводы сформированы на основе отраслевых стандартов wealth management.`;
}
