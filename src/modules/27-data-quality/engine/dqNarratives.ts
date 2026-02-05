/**
 * Data Quality Narratives Engine
 * Rules-based AI summary generation
 */

import { DqException } from '../schema/dqException';
import { DqConflict } from '../schema/dqConflict';
import { DqReconCheck } from '../schema/dqReconCheck';
import { DqSyncJob } from '../schema/dqSyncJob';
import { DomainScore } from './dqScoring';
import { DQ_DOMAINS, DqDomain } from '../config';

export type Lang = 'ru' | 'en' | 'uk';

export interface DqInsight {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: { ru: string; en: string; uk: string };
  description: { ru: string; en: string; uk: string };
  action?: { ru: string; en: string; uk: string };
  relatedIds: string[];
  domain?: DqDomain;
}

export interface NarrativeInput {
  exceptions: DqException[];
  conflicts: DqConflict[];
  reconChecks: DqReconCheck[];
  syncJobs: DqSyncJob[];
  domainScores: DomainScore[];
}

function generateId(): string {
  return `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateInsights(input: NarrativeInput): DqInsight[] {
  const insights: DqInsight[] = [];
  const { exceptions, conflicts, reconChecks, syncJobs, domainScores } = input;

  // Critical exceptions insight
  const criticalExceptions = exceptions.filter(
    e => e.severity === 'critical' && e.status === 'open'
  );
  if (criticalExceptions.length > 0) {
    const byDomain = new Map<string, number>();
    for (const exc of criticalExceptions) {
      byDomain.set(exc.domain, (byDomain.get(exc.domain) || 0) + 1);
    }
    const domainSummary = Array.from(byDomain.entries())
      .map(([d, c]) => `${c} в ${DQ_DOMAINS[d as DqDomain]?.label.ru || d}`)
      .join(', ');

    insights.push({
      id: generateId(),
      priority: 'high',
      title: {
        ru: `${criticalExceptions.length} критичных исключений`,
        en: `${criticalExceptions.length} critical exceptions`,
        uk: `${criticalExceptions.length} критичних винятків`,
      },
      description: {
        ru: `Обнаружено ${criticalExceptions.length} критичных проблем с данными: ${domainSummary}. Требуется срочное исправление.`,
        en: `Found ${criticalExceptions.length} critical data issues: ${domainSummary}. Urgent fix required.`,
        uk: `Виявлено ${criticalExceptions.length} критичних проблем з даними: ${domainSummary}. Потрібне термінове виправлення.`,
      },
      action: {
        ru: 'Перейти к критичным исключениям',
        en: 'Go to critical exceptions',
        uk: 'Перейти до критичних винятків',
      },
      relatedIds: criticalExceptions.slice(0, 5).map(e => e.id),
      domain: criticalExceptions[0]?.domain,
    });
  }

  // Recon breaks insight
  const reconBreaks = reconChecks.filter(r => r.status === 'break');
  if (reconBreaks.length > 0) {
    const totalDelta = reconBreaks.reduce((sum, r) => sum + Math.abs(r.deltaAmount), 0);

    insights.push({
      id: generateId(),
      priority: 'high',
      title: {
        ru: `${reconBreaks.length} расхождений в сверках`,
        en: `${reconBreaks.length} reconciliation breaks`,
        uk: `${reconBreaks.length} розбіжностей у звірках`,
      },
      description: {
        ru: `Обнаружены расхождения на общую сумму $${totalDelta.toLocaleString()}. Рекомендуется сначала исправить bank_ledger.`,
        en: `Discrepancies totaling $${totalDelta.toLocaleString()} found. Recommend fixing bank_ledger first.`,
        uk: `Виявлено розбіжності на загальну суму $${totalDelta.toLocaleString()}. Рекомендується спочатку виправити bank_ledger.`,
      },
      action: {
        ru: 'Открыть сверки',
        en: 'Open reconciliations',
        uk: 'Відкрити звірки',
      },
      relatedIds: reconBreaks.map(r => r.id),
    });
  }

  // Sync failures insight
  const failedJobs = syncJobs.filter(j => j.status === 'failed');
  if (failedJobs.length > 0) {
    const connectors = [...new Set(failedJobs.map(j => j.connectorName || j.connectorKey))];

    insights.push({
      id: generateId(),
      priority: failedJobs.length >= 3 ? 'high' : 'medium',
      title: {
        ru: `${failedJobs.length} неудачных синхронизаций`,
        en: `${failedJobs.length} failed sync jobs`,
        uk: `${failedJobs.length} невдалих синхронізацій`,
      },
      description: {
        ru: `Проблемы с коннекторами: ${connectors.slice(0, 3).join(', ')}. Данные могут быть неактуальны.`,
        en: `Connector issues: ${connectors.slice(0, 3).join(', ')}. Data may be stale.`,
        uk: `Проблеми з коннекторами: ${connectors.slice(0, 3).join(', ')}. Дані можуть бути неактуальні.`,
      },
      action: {
        ru: 'Проверить синхронизации',
        en: 'Check sync jobs',
        uk: 'Перевірити синхронізації',
      },
      relatedIds: failedJobs.slice(0, 5).map(j => j.id),
      domain: 'integrations',
    });
  }

  // Unresolved conflicts insight
  const openConflicts = conflicts.filter(c => c.status === 'open');
  if (openConflicts.length > 0) {
    insights.push({
      id: generateId(),
      priority: openConflicts.length >= 5 ? 'medium' : 'low',
      title: {
        ru: `${openConflicts.length} нерешённых конфликтов`,
        en: `${openConflicts.length} unresolved conflicts`,
        uk: `${openConflicts.length} невирішених конфліктів`,
      },
      description: {
        ru: `Обнаружены дубликаты и несоответствия данных, требующие ручного решения.`,
        en: `Found duplicates and data mismatches requiring manual resolution.`,
        uk: `Виявлено дублікати та невідповідності даних, що потребують ручного вирішення.`,
      },
      action: {
        ru: 'Открыть конфликты',
        en: 'Open conflicts',
        uk: 'Відкрити конфлікти',
      },
      relatedIds: openConflicts.slice(0, 5).map(c => c.id),
    });
  }

  // Low score domain insight
  const lowScoreDomains = domainScores.filter(ds => ds.score < 70);
  if (lowScoreDomains.length > 0) {
    const worstDomain = lowScoreDomains.sort((a, b) => a.score - b.score)[0];
    const domainLabel = DQ_DOMAINS[worstDomain.domain]?.label.ru || worstDomain.domain;

    insights.push({
      id: generateId(),
      priority: worstDomain.score < 50 ? 'high' : 'medium',
      title: {
        ru: `Низкое качество данных: ${domainLabel}`,
        en: `Low data quality: ${DQ_DOMAINS[worstDomain.domain]?.label.en || worstDomain.domain}`,
        uk: `Низька якість даних: ${DQ_DOMAINS[worstDomain.domain]?.label.uk || worstDomain.domain}`,
      },
      description: {
        ru: `Оценка качества ${worstDomain.score}/100. ${worstDomain.criticalCount} критичных и ${worstDomain.warningCount} предупреждений.`,
        en: `Quality score ${worstDomain.score}/100. ${worstDomain.criticalCount} critical and ${worstDomain.warningCount} warnings.`,
        uk: `Оцінка якості ${worstDomain.score}/100. ${worstDomain.criticalCount} критичних та ${worstDomain.warningCount} попереджень.`,
      },
      action: {
        ru: `Открыть исключения ${domainLabel}`,
        en: `Open ${DQ_DOMAINS[worstDomain.domain]?.label.en || worstDomain.domain} exceptions`,
        uk: `Відкрити винятки ${DQ_DOMAINS[worstDomain.domain]?.label.uk || worstDomain.domain}`,
      },
      relatedIds: [],
      domain: worstDomain.domain,
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return insights.slice(0, 5);
}

export function generateSummaryText(
  insights: DqInsight[],
  overallScore: number,
  lang: Lang = 'ru'
): string {
  const highPriorityCount = insights.filter(i => i.priority === 'high').length;

  const templates = {
    ru: {
      good: `Качество данных в норме (${overallScore}/100). Рекомендуется регулярно запускать проверки.`,
      warning: `Качество данных требует внимания (${overallScore}/100). Обнаружено ${highPriorityCount} важных проблем.`,
      critical: `Качество данных критическое (${overallScore}/100). Требуется срочное вмешательство. ${highPriorityCount} высокоприоритетных проблем.`,
    },
    en: {
      good: `Data quality is healthy (${overallScore}/100). Regular checks recommended.`,
      warning: `Data quality needs attention (${overallScore}/100). Found ${highPriorityCount} important issues.`,
      critical: `Data quality is critical (${overallScore}/100). Urgent intervention required. ${highPriorityCount} high-priority issues.`,
    },
    uk: {
      good: `Якість даних в нормі (${overallScore}/100). Рекомендуються регулярні перевірки.`,
      warning: `Якість даних потребує уваги (${overallScore}/100). Виявлено ${highPriorityCount} важливих проблем.`,
      critical: `Якість даних критична (${overallScore}/100). Потрібне термінове втручання. ${highPriorityCount} високопріоритетних проблем.`,
    },
  };

  if (overallScore >= 80) return templates[lang].good;
  if (overallScore >= 50) return templates[lang].warning;
  return templates[lang].critical;
}
