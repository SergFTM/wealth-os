/**
 * Data Quality Rule Engine
 * Executes rules and produces exceptions
 */

import { DqRule } from '../schema/dqRule';
import { DqException, DqExceptionCreateInput, EvidenceRef } from '../schema/dqException';
import { DqRun, DqRunSummary } from '../schema/dqRun';
import { DQ_SLA, DqSeverity } from '../config';

export interface RuleExecutionResult {
  ruleId: string;
  exceptionsFound: DqExceptionCreateInput[];
  recordsScanned: number;
  duration_ms: number;
}

export interface RunResult {
  run: Omit<DqRun, 'id' | 'createdAt'>;
  exceptions: DqExceptionCreateInput[];
}

function calculateSlaDue(severity: DqSeverity): string {
  const hours = DQ_SLA[severity]?.hours || 168;
  const due = new Date();
  due.setHours(due.getHours() + hours);
  return due.toISOString();
}

export function executeRule(
  rule: DqRule,
  targetData: Record<string, unknown>[]
): RuleExecutionResult {
  const startTime = Date.now();
  const exceptions: DqExceptionCreateInput[] = [];

  for (const record of targetData) {
    const recordId = (record.id as string) || 'unknown';

    switch (rule.ruleType) {
      case 'missing_field': {
        for (const field of rule.targetFields) {
          const value = record[field];
          if (value === undefined || value === null || value === '') {
            exceptions.push({
              domain: rule.domain,
              ruleId: rule.id,
              ruleName: rule.name,
              title: `Отсутствует поле: ${field}`,
              description: `Запись ${recordId} в ${rule.targetCollection} не содержит обязательное поле "${field}"`,
              severity: rule.severityDefault,
              evidenceRefs: [{
                collection: rule.targetCollection,
                recordId,
                field,
              }],
            });
          }
        }
        break;
      }

      case 'invalid_currency': {
        const currency = record.currency as string;
        const validCurrencies = ['USD', 'EUR', 'GBP', 'RUB', 'CHF', 'JPY', 'CNY'];
        if (currency && !validCurrencies.includes(currency)) {
          exceptions.push({
            domain: rule.domain,
            ruleId: rule.id,
            ruleName: rule.name,
            title: `Неверная валюта: ${currency}`,
            description: `Запись ${recordId} содержит нераспознанную валюту "${currency}"`,
            severity: rule.severityDefault,
            evidenceRefs: [{
              collection: rule.targetCollection,
              recordId,
              field: 'currency',
              value: currency,
            }],
          });
        }
        break;
      }

      case 'stale_as_of': {
        const asOf = record.asOf as string || record.updatedAt as string;
        if (asOf) {
          const date = new Date(asOf);
          const now = new Date();
          const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
          const threshold = rule.threshold?.value || 30;
          if (daysDiff > threshold) {
            exceptions.push({
              domain: rule.domain,
              ruleId: rule.id,
              ruleName: rule.name,
              title: `Устаревшие данные (${Math.round(daysDiff)} дней)`,
              description: `Запись ${recordId} не обновлялась более ${threshold} дней`,
              severity: rule.severityDefault,
              evidenceRefs: [{
                collection: rule.targetCollection,
                recordId,
                field: 'asOf',
                value: asOf,
              }],
            });
          }
        }
        break;
      }

      case 'range_violation': {
        for (const field of rule.targetFields) {
          const value = record[field] as number;
          if (typeof value === 'number' && rule.threshold) {
            const { operator, value: threshold } = rule.threshold;
            let violated = false;
            if (operator === 'gt' && value <= threshold) violated = true;
            if (operator === 'lt' && value >= threshold) violated = true;
            if (operator === 'gte' && value < threshold) violated = true;
            if (operator === 'lte' && value > threshold) violated = true;

            if (violated) {
              exceptions.push({
                domain: rule.domain,
                ruleId: rule.id,
                ruleName: rule.name,
                title: `Значение вне диапазона: ${field}`,
                description: `Поле ${field} = ${value}, ожидалось ${operator} ${threshold}`,
                severity: rule.severityDefault,
                evidenceRefs: [{
                  collection: rule.targetCollection,
                  recordId,
                  field,
                  value,
                  expectedValue: threshold,
                }],
              });
            }
          }
        }
        break;
      }

      default:
        break;
    }
  }

  return {
    ruleId: rule.id,
    exceptionsFound: exceptions.map(e => ({
      ...e,
      slaDueAt: calculateSlaDue(e.severity),
    })) as DqExceptionCreateInput[],
    recordsScanned: targetData.length,
    duration_ms: Date.now() - startTime,
  };
}

export function runAllRules(
  rules: DqRule[],
  dataByCollection: Record<string, Record<string, unknown>[]>,
  triggeredBy: 'manual' | 'scheduled' = 'manual',
  userId?: string
): RunResult {
  const activeRules = rules.filter(r => r.status === 'active');
  const allExceptions: DqExceptionCreateInput[] = [];
  let totalRecords = 0;
  let totalDuration = 0;
  const severityCounts: Record<string, number> = { ok: 0, info: 0, warning: 0, critical: 0 };

  for (const rule of activeRules) {
    const data = dataByCollection[rule.targetCollection] || [];
    const result = executeRule(rule, data);

    allExceptions.push(...result.exceptionsFound);
    totalRecords += result.recordsScanned;
    totalDuration += result.duration_ms;

    for (const exc of result.exceptionsFound) {
      severityCounts[exc.severity] = (severityCounts[exc.severity] || 0) + 1;
    }
  }

  const summary: DqRunSummary = {
    totalRecordsScanned: totalRecords,
    exceptionsCreated: allExceptions.length,
    exceptionsBySeverity: severityCounts,
    duration_ms: totalDuration,
  };

  return {
    run: {
      runAt: new Date().toISOString(),
      triggeredBy,
      triggeredByUserId: userId,
      rulesExecuted: activeRules.map(r => r.id),
      rulesCount: activeRules.length,
      exceptionsCreated: allExceptions.length,
      summary,
      status: 'completed',
    },
    exceptions: allExceptions,
  };
}
