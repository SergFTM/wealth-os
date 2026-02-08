/**
 * MDM AI Assistant
 * AI-powered suggestions for duplicates, merges, normalization
 * Always requires human confirmation (Human in the loop)
 */

import { MdmRecordTypeKey } from '../config';
import { MatchResult } from './matchEngine';
import { NormalizationResult } from './normalization';

export interface AiSuggestion {
  id: string;
  type: 'duplicate_detection' | 'merge_recommendation' | 'normalization' | 'data_enrichment';
  confidence: number;
  title: string;
  description: string;
  reasoning: string;
  sources: string[];
  assumptions: string[];
  actionRequired: boolean;
  suggestedAction?: {
    type: string;
    params: Record<string, unknown>;
  };
  createdAt: string;
}

export interface DuplicateSuggestion extends AiSuggestion {
  type: 'duplicate_detection';
  recordType: MdmRecordTypeKey;
  candidateA: {
    id: string;
    displayName: string;
    keyFields: Record<string, unknown>;
  };
  candidateB: {
    id: string;
    displayName: string;
    keyFields: Record<string, unknown>;
  };
  matchReasons: MatchResult['reasons'];
}

export interface MergeSuggestion extends AiSuggestion {
  type: 'merge_recommendation';
  recordType: MdmRecordTypeKey;
  primaryRecordId: string;
  secondaryRecordIds: string[];
  survivorshipRecommendations: Array<{
    field: string;
    recommendedValue: unknown;
    reason: string;
    alternatives: unknown[];
  }>;
}

export interface NormalizationSuggestion extends AiSuggestion {
  type: 'normalization';
  recordId: string;
  recordType: MdmRecordTypeKey;
  fieldChanges: Array<{
    field: string;
    original: string;
    normalized: string;
    changes: string[];
  }>;
}

/**
 * Generate AI suggestions for potential duplicates
 */
export function suggestDuplicates(
  matchResults: MatchResult[],
  recordType: MdmRecordTypeKey,
  recordsMap: Map<string, Record<string, unknown>>
): DuplicateSuggestion[] {
  const suggestions: DuplicateSuggestion[] = [];

  for (const match of matchResults) {
    const recordA = recordsMap.get(match.candidateAId);
    const recordB = recordsMap.get(match.candidateBId);

    if (!recordA || !recordB) continue;

    const chosenA = (recordA.chosenJson || {}) as Record<string, unknown>;
    const chosenB = (recordB.chosenJson || {}) as Record<string, unknown>;

    const getDisplayName = (chosen: Record<string, unknown>): string => {
      if (chosen.displayName) return String(chosen.displayName);
      if (chosen.firstName && chosen.lastName) {
        return `${chosen.firstName} ${chosen.lastName}`;
      }
      if (chosen.legalName) return String(chosen.legalName);
      if (chosen.name) return String(chosen.name);
      return 'Unknown';
    };

    const suggestion: DuplicateSuggestion = {
      id: `dup-${match.candidateAId}-${match.candidateBId}`,
      type: 'duplicate_detection',
      confidence: Math.round(match.matchScore * 100),
      title: 'Возможный дубликат обнаружен',
      description: `Записи "${getDisplayName(chosenA)}" и "${getDisplayName(chosenB)}" могут быть дубликатами`,
      reasoning: generateDuplicateReasoning(match),
      sources: ['MDM Match Engine', 'Fuzzy Matching Algorithm'],
      assumptions: [
        'Сопоставление основано на алгоритмах нечеткого поиска',
        'Точность зависит от качества исходных данных',
        'Рекомендуется ручная проверка перед слиянием',
      ],
      actionRequired: true,
      suggestedAction: {
        type: 'review_duplicate',
        params: {
          candidateAId: match.candidateAId,
          candidateBId: match.candidateBId,
          recordType,
        },
      },
      createdAt: new Date().toISOString(),
      recordType,
      candidateA: {
        id: match.candidateAId,
        displayName: getDisplayName(chosenA),
        keyFields: extractKeyFields(chosenA, recordType),
      },
      candidateB: {
        id: match.candidateBId,
        displayName: getDisplayName(chosenB),
        keyFields: extractKeyFields(chosenB, recordType),
      },
      matchReasons: match.reasons,
    };

    suggestions.push(suggestion);
  }

  return suggestions;
}

/**
 * Generate reasoning text for duplicate suggestion
 */
function generateDuplicateReasoning(match: MatchResult): string {
  const reasons: string[] = [];

  for (const reason of match.reasons) {
    if (reason.weight > 0.1) {
      reasons.push(`${reason.field}: ${reason.reason}`);
    }
  }

  if (reasons.length === 0) {
    return 'Обнаружено общее сходство записей';
  }

  return `Совпадения: ${reasons.join('; ')}. Общий показатель: ${Math.round(match.matchScore * 100)}%`;
}

/**
 * Extract key fields for display based on record type
 */
function extractKeyFields(
  chosen: Record<string, unknown>,
  recordType: MdmRecordTypeKey
): Record<string, unknown> {
  switch (recordType) {
    case 'people':
      return {
        name: chosen.displayName || `${chosen.firstName || ''} ${chosen.lastName || ''}`.trim(),
        email: maskEmail(String(chosen.email || '')),
        phone: maskPhone(String(chosen.phone || '')),
      };
    case 'entities':
      return {
        legalName: chosen.legalName,
        jurisdiction: chosen.jurisdiction,
        registrationNumber: chosen.registrationNumber,
      };
    case 'accounts':
      return {
        institution: chosen.institution,
        accountNumber: maskAccountNumber(String(chosen.accountNumber || '')),
        currency: chosen.currency,
      };
    case 'assets':
      return {
        name: chosen.name,
        ticker: chosen.ticker,
        isin: chosen.isin,
      };
    default:
      return chosen;
  }
}

/**
 * Mask email for privacy
 */
function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}

/**
 * Mask phone for privacy
 */
function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  return `${'*'.repeat(phone.length - 4)}${phone.slice(-4)}`;
}

/**
 * Mask account number for privacy
 */
function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber || accountNumber.length < 4) return accountNumber;
  return `${'*'.repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`;
}

/**
 * Generate merge recommendation
 */
export function suggestMerge(
  duplicateSuggestion: DuplicateSuggestion,
  recordA: Record<string, unknown>,
  recordB: Record<string, unknown>
): MergeSuggestion {
  const chosenA = (recordA.chosenJson || {}) as Record<string, unknown>;
  const chosenB = (recordB.chosenJson || {}) as Record<string, unknown>;
  const confidenceA = (recordA.confidenceJson || {}) as Record<string, number>;
  const confidenceB = (recordB.confidenceJson || {}) as Record<string, number>;

  const allFields = new Set([...Object.keys(chosenA), ...Object.keys(chosenB)]);
  const recommendations: MergeSuggestion['survivorshipRecommendations'] = [];

  for (const field of allFields) {
    const valueA = chosenA[field];
    const valueB = chosenB[field];
    const confA = confidenceA[field] || 50;
    const confB = confidenceB[field] || 50;

    let recommendedValue: unknown;
    let reason: string;
    const alternatives: unknown[] = [];

    if (valueA === valueB) {
      recommendedValue = valueA;
      reason = 'Значения идентичны';
    } else if (valueA && !valueB) {
      recommendedValue = valueA;
      reason = 'Только запись A имеет значение';
      alternatives.push(null);
    } else if (!valueA && valueB) {
      recommendedValue = valueB;
      reason = 'Только запись B имеет значение';
      alternatives.push(null);
    } else if (confA > confB) {
      recommendedValue = valueA;
      reason = `Запись A имеет более высокую уверенность (${confA}% vs ${confB}%)`;
      alternatives.push(valueB);
    } else if (confB > confA) {
      recommendedValue = valueB;
      reason = `Запись B имеет более высокую уверенность (${confB}% vs ${confA}%)`;
      alternatives.push(valueA);
    } else {
      // Equal confidence, prefer A as primary
      recommendedValue = valueA;
      reason = 'Уверенность одинакова, выбрана первичная запись';
      alternatives.push(valueB);
    }

    recommendations.push({
      field,
      recommendedValue,
      reason,
      alternatives,
    });
  }

  // Determine primary (record with more sources or higher avg confidence)
  const sourcesA = (recordA.sourcesJson as unknown[])?.length || 0;
  const sourcesB = (recordB.sourcesJson as unknown[])?.length || 0;
  const primaryId = sourcesA >= sourcesB ? duplicateSuggestion.candidateA.id : duplicateSuggestion.candidateB.id;
  const secondaryId = primaryId === duplicateSuggestion.candidateA.id
    ? duplicateSuggestion.candidateB.id
    : duplicateSuggestion.candidateA.id;

  return {
    id: `merge-${primaryId}-${secondaryId}`,
    type: 'merge_recommendation',
    confidence: duplicateSuggestion.confidence,
    title: 'План слияния записей',
    description: `Рекомендуется объединить записи с сохранением "${duplicateSuggestion.candidateA.displayName}" как основной`,
    reasoning: `Основная запись выбрана на основе количества источников (${sourcesA} vs ${sourcesB}) и общей уверенности`,
    sources: ['MDM Survivorship Engine', 'AI Recommendation'],
    assumptions: [
      'Рекомендации основаны на правилах survivorship',
      'Ручной выбор полей возможен в процессе слияния',
      'Требуется подтверждение ответственного лица',
    ],
    actionRequired: true,
    suggestedAction: {
      type: 'start_merge',
      params: {
        primaryId,
        secondaryIds: [secondaryId],
        recordType: duplicateSuggestion.recordType,
      },
    },
    createdAt: new Date().toISOString(),
    recordType: duplicateSuggestion.recordType,
    primaryRecordId: primaryId,
    secondaryRecordIds: [secondaryId],
    survivorshipRecommendations: recommendations,
  };
}

/**
 * Generate normalization suggestions
 */
export function suggestNormalization(
  recordId: string,
  recordType: MdmRecordTypeKey,
  normalizations: Array<{ field: string; result: NormalizationResult }>
): NormalizationSuggestion | null {
  const fieldChanges = normalizations
    .filter((n) => n.result.changes.length > 0)
    .map((n) => ({
      field: n.field,
      original: n.result.original,
      normalized: n.result.normalized,
      changes: n.result.changes,
    }));

  if (fieldChanges.length === 0) return null;

  return {
    id: `norm-${recordId}-${Date.now()}`,
    type: 'normalization',
    confidence: 95,
    title: 'Предложения по нормализации',
    description: `Обнаружены возможности улучшения данных для ${fieldChanges.length} полей`,
    reasoning: fieldChanges.map((c) => `${c.field}: ${c.changes.join(', ')}`).join('; '),
    sources: ['MDM Normalization Engine'],
    assumptions: [
      'Нормализация улучшает качество данных',
      'Оригинальные значения сохраняются в истории',
    ],
    actionRequired: true,
    suggestedAction: {
      type: 'apply_normalization',
      params: {
        recordId,
        recordType,
        changes: fieldChanges,
      },
    },
    createdAt: new Date().toISOString(),
    recordId,
    recordType,
    fieldChanges,
  };
}

/**
 * Format AI response in Russian with disclaimer
 */
export function formatAiResponse(
  suggestion: AiSuggestion
): {
  message: string;
  disclaimer: string;
} {
  let message = `**${suggestion.title}**\n\n`;
  message += `${suggestion.description}\n\n`;
  message += `**Обоснование:** ${suggestion.reasoning}\n\n`;

  if (suggestion.assumptions.length > 0) {
    message += `**Предположения:**\n`;
    for (const assumption of suggestion.assumptions) {
      message += `- ${assumption}\n`;
    }
  }

  message += `\n**Уверенность:** ${suggestion.confidence}%`;

  const disclaimer = 'MDM рекомендации и совпадения носят информационный характер. ' +
    'Слияние записей требует подтверждения ответственным лицом.';

  return { message, disclaimer };
}
