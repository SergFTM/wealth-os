/**
 * AI Exception Assistant - Provides AI-powered insights for exceptions
 * Note: All outputs are in Russian with human-in-the-loop disclaimer
 */

import { Exception } from './exceptionRouter';

export interface AiAnalysisResult {
  summary: string;
  proposedSteps: string[];
  confidence: 'high' | 'medium' | 'low';
  assumptions: string[];
  sources: string[];
  disclaimer: string;
}

export interface SimilarExceptionMatch {
  exceptionId: string;
  similarityScore: number;
  matchReason: string;
}

const DISCLAIMER_RU = 'Это предложение сгенерировано AI. Требуется проверка человеком.';

export function summarizeException(exception: Exception): AiAnalysisResult {
  const typeDescriptions: Record<string, string> = {
    sync: 'ошибка синхронизации данных',
    recon: 'расхождение при сверке',
    missing_doc: 'отсутствие обязательного документа',
    stale_price: 'устаревшие ценовые данные',
    approval: 'просроченное согласование',
    vendor_sla: 'нарушение SLA поставщиком',
    security: 'инцидент безопасности'
  };

  const severityDescriptions: Record<string, string> = {
    ok: 'низкой важности',
    warning: 'средней важности',
    critical: 'критической важности'
  };

  const typeDesc = typeDescriptions[exception.typeKey] || exception.typeKey;
  const severityDesc = severityDescriptions[exception.severity] || exception.severity;

  const summary = `Исключение ${severityDesc}: ${typeDesc}. ${exception.description || exception.title}`;

  const proposedSteps = generateProposedSteps(exception);
  const assumptions = generateAssumptions(exception);
  const sources = [`Модуль ${exception.sourceModuleKey}`, exception.sourceCollection || 'Неизвестный источник'];

  return {
    summary,
    proposedSteps,
    confidence: determineConfidence(exception),
    assumptions,
    sources,
    disclaimer: DISCLAIMER_RU
  };
}

function generateProposedSteps(exception: Exception): string[] {
  const stepsByType: Record<string, string[]> = {
    sync: [
      'Проверить статус подключения к источнику данных',
      'Проверить логи интеграции на наличие ошибок',
      'Перезапустить синхронизацию вручную',
      'При повторении — эскалировать на техническую поддержку'
    ],
    recon: [
      'Идентифицировать расхождение по позициям/суммам',
      'Сверить данные в источниках вручную',
      'Определить причину расхождения',
      'Внести корректировку или создать заявку на исправление'
    ],
    missing_doc: [
      'Проверить наличие документа в альтернативных источниках',
      'Связаться с ответственным за документ',
      'Запросить документ у контрагента/клиента',
      'Загрузить документ в систему'
    ],
    stale_price: [
      'Проверить дату последнего обновления цены',
      'Запросить актуальную цену из источника',
      'Обновить цену вручную если необходимо',
      'Проверить настройки автоматического обновления'
    ],
    approval: [
      'Уведомить ответственного за согласование',
      'Проверить делегирование полномочий',
      'Эскалировать на уровень выше при необходимости',
      'Зафиксировать причину задержки'
    ],
    vendor_sla: [
      'Зафиксировать факт нарушения SLA',
      'Связаться с представителем поставщика',
      'Запросить план устранения',
      'Оценить применение штрафных санкций'
    ],
    security: [
      'Немедленно уведомить службу безопасности',
      'Изолировать затронутые системы',
      'Зафиксировать все детали инцидента',
      'Следовать протоколу реагирования на инциденты'
    ]
  };

  return stepsByType[exception.typeKey] || [
    'Изучить детали исключения',
    'Определить первопричину',
    'Разработать план устранения',
    'Выполнить корректирующие действия'
  ];
}

function generateAssumptions(exception: Exception): string[] {
  const assumptions: string[] = [];

  if (exception.sourceModuleKey) {
    assumptions.push(`Источник данных: модуль ${exception.sourceModuleKey}`);
  }

  if (exception.severity === 'critical') {
    assumptions.push('Требует немедленного внимания');
  }

  if (exception.slaAtRisk) {
    assumptions.push('SLA под угрозой нарушения');
  }

  if (!exception.assignedToRole && !exception.assignedToUserId) {
    assumptions.push('Исключение не назначено — требуется триаж');
  }

  return assumptions;
}

function determineConfidence(exception: Exception): 'high' | 'medium' | 'low' {
  // More context = higher confidence
  let score = 0;

  if (exception.description && exception.description.length > 50) score += 2;
  if (exception.sourceCollection) score += 1;
  if (exception.sourceId) score += 1;
  if (exception.lineageJson) score += 2;

  if (score >= 4) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
}

export function findSimilarExceptions(
  target: Exception,
  allExceptions: Exception[],
  limit: number = 5
): SimilarExceptionMatch[] {
  const matches: SimilarExceptionMatch[] = [];

  for (const exception of allExceptions) {
    if (exception.id === target.id) continue;

    const score = calculateSimilarity(target, exception);
    if (score > 0.3) {
      matches.push({
        exceptionId: exception.id,
        similarityScore: score,
        matchReason: getMatchReason(target, exception)
      });
    }
  }

  return matches
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);
}

function calculateSimilarity(a: Exception, b: Exception): number {
  let score = 0;
  let factors = 0;

  // Type match
  factors++;
  if (a.typeKey === b.typeKey) score += 1;

  // Source module match
  factors++;
  if (a.sourceModuleKey === b.sourceModuleKey) score += 1;

  // Title similarity
  factors++;
  const titleScore = calculateTitleSimilarity(a.title, b.title);
  score += titleScore;

  // Severity match
  factors++;
  if (a.severity === b.severity) score += 0.5;

  return score / factors;
}

function calculateTitleSimilarity(a: string, b: string): number {
  const tokensA = a.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const tokensB = b.toLowerCase().split(/\s+/).filter(t => t.length > 2);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const commonTokens = tokensA.filter(t => tokensB.includes(t));
  return commonTokens.length / Math.max(tokensA.length, tokensB.length);
}

function getMatchReason(a: Exception, b: Exception): string {
  const reasons: string[] = [];

  if (a.typeKey === b.typeKey) {
    reasons.push('одинаковый тип');
  }

  if (a.sourceModuleKey === b.sourceModuleKey) {
    reasons.push('один источник');
  }

  const titleScore = calculateTitleSimilarity(a.title, b.title);
  if (titleScore > 0.5) {
    reasons.push('похожее название');
  }

  return reasons.join(', ') || 'частичное совпадение';
}

export function suggestCluster(
  exception: Exception,
  existingExceptions: Exception[]
): {
  shouldCluster: boolean;
  potentialClusterMembers: string[];
  clusterName: string;
} {
  const similar = findSimilarExceptions(exception, existingExceptions, 10);
  const highlySimiar = similar.filter(s => s.similarityScore > 0.6);

  if (highlySimiar.length < 2) {
    return {
      shouldCluster: false,
      potentialClusterMembers: [],
      clusterName: ''
    };
  }

  const typeLabels: Record<string, string> = {
    sync: 'Синхронизация',
    recon: 'Сверка',
    missing_doc: 'Документы',
    stale_price: 'Цены',
    approval: 'Согласования',
    vendor_sla: 'SLA вендоров',
    security: 'Безопасность'
  };

  return {
    shouldCluster: true,
    potentialClusterMembers: [exception.id, ...highlySimiar.map(s => s.exceptionId)],
    clusterName: `${typeLabels[exception.typeKey] || 'Исключения'}: модуль ${exception.sourceModuleKey}`
  };
}

export function generateDailyDigest(exceptions: Exception[]): {
  openCount: number;
  criticalCount: number;
  slaAtRiskCount: number;
  topIssues: string[];
  recommendation: string;
} {
  const open = exceptions.filter(e => e.status !== 'closed');
  const critical = open.filter(e => e.severity === 'critical');
  const slaAtRisk = open.filter(e => e.slaAtRisk);

  // Group by type
  const byType = new Map<string, number>();
  for (const e of open) {
    byType.set(e.typeKey, (byType.get(e.typeKey) || 0) + 1);
  }

  const topIssues = Array.from(byType.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, count]) => `${type}: ${count}`);

  let recommendation = '';
  if (critical.length > 0) {
    recommendation = `Приоритет: ${critical.length} критических исключений требуют немедленного внимания.`;
  } else if (slaAtRisk.length > 0) {
    recommendation = `Внимание: ${slaAtRisk.length} исключений с риском нарушения SLA.`;
  } else if (open.length > 50) {
    recommendation = 'Рекомендуется провести массовый триаж для снижения очереди.';
  } else {
    recommendation = 'Очередь под контролем. Продолжайте обработку в обычном режиме.';
  }

  return {
    openCount: open.length,
    criticalCount: critical.length,
    slaAtRiskCount: slaAtRisk.length,
    topIssues,
    recommendation
  };
}
