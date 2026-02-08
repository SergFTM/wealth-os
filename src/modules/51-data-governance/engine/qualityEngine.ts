import { DataQualityScore, QualityDetails } from './types';
import { QUALITY_THRESHOLDS } from '../config';

export interface QualityInput {
  clientId: string;
  scopeKey: 'kpi' | 'collection' | 'entity' | 'portfolio';
  scopeId?: string;
  domainKey: string;
  objectTypeKey: string;
  records: Array<Record<string, unknown>>;
  requiredFields: string[];
  asOf: string;
  sourceCount?: number;
  conflictCount?: number;
}

export interface QualityResult {
  scoreTotal: number;
  completenessScore: number;
  freshnessScore: number;
  consistencyScore: number;
  coverageScore: number;
  details: QualityDetails;
  thresholdStatus: 'high' | 'medium' | 'low';
}

/**
 * Compute quality scores for a data set
 */
export function computeQualityScores(input: QualityInput): QualityResult {
  const {
    records,
    requiredFields,
    asOf,
    sourceCount = 1,
    conflictCount = 0,
  } = input;

  // Compute completeness (% of required fields present)
  const completenessResult = computeCompleteness(records, requiredFields);

  // Compute freshness (based on asOf age)
  const freshnessScore = computeFreshness(asOf);

  // Compute consistency (based on conflicts)
  const consistencyScore = computeConsistency(records.length, conflictCount);

  // Compute coverage (based on source diversity)
  const coverageScore = computeCoverage(sourceCount);

  // Calculate total score (weighted average)
  const scoreTotal = Math.round(
    completenessResult.score * 0.3 +
    freshnessScore * 0.25 +
    consistencyScore * 0.25 +
    coverageScore * 0.2
  );

  // Determine threshold status
  let thresholdStatus: 'high' | 'medium' | 'low' = 'low';
  if (scoreTotal >= QUALITY_THRESHOLDS.high) thresholdStatus = 'high';
  else if (scoreTotal >= QUALITY_THRESHOLDS.medium) thresholdStatus = 'medium';

  return {
    scoreTotal,
    completenessScore: completenessResult.score,
    freshnessScore,
    consistencyScore,
    coverageScore,
    details: {
      missingFields: completenessResult.missingFields,
      staleRecords: freshnessScore < 80 ? Math.round(records.length * (100 - freshnessScore) / 100) : 0,
      conflictingSources: conflictCount > 0 ? [`${conflictCount} conflicts detected`] : undefined,
      coverageGaps: sourceCount < 2 ? ['Single source only'] : undefined,
    },
    thresholdStatus,
  };
}

/**
 * Compute completeness score
 */
function computeCompleteness(
  records: Array<Record<string, unknown>>,
  requiredFields: string[]
): { score: number; missingFields: string[] } {
  if (records.length === 0 || requiredFields.length === 0) {
    return { score: 100, missingFields: [] };
  }

  const missingFieldsSet = new Set<string>();
  let totalMissing = 0;
  const totalExpected = records.length * requiredFields.length;

  for (const record of records) {
    for (const field of requiredFields) {
      const value = record[field];
      if (value === undefined || value === null || value === '') {
        totalMissing++;
        missingFieldsSet.add(field);
      }
    }
  }

  const score = Math.round(((totalExpected - totalMissing) / totalExpected) * 100);

  return {
    score: Math.max(0, Math.min(100, score)),
    missingFields: Array.from(missingFieldsSet),
  };
}

/**
 * Compute freshness score based on data age
 */
function computeFreshness(asOf: string): number {
  const asOfDate = new Date(asOf);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - asOfDate.getTime()) / (1000 * 60 * 60 * 24));

  // Scoring: 100 for today, decreases by 10 per day, min 0
  if (daysDiff <= 0) return 100;
  if (daysDiff <= 1) return 95;
  if (daysDiff <= 3) return 85;
  if (daysDiff <= 7) return 70;
  if (daysDiff <= 14) return 50;
  if (daysDiff <= 30) return 30;
  return 10;
}

/**
 * Compute consistency score based on conflicts
 */
function computeConsistency(recordCount: number, conflictCount: number): number {
  if (recordCount === 0) return 100;
  if (conflictCount === 0) return 100;

  const conflictRate = conflictCount / recordCount;

  if (conflictRate >= 0.2) return 20;
  if (conflictRate >= 0.1) return 50;
  if (conflictRate >= 0.05) return 70;
  if (conflictRate >= 0.01) return 85;
  return 95;
}

/**
 * Compute coverage score based on source diversity
 */
function computeCoverage(sourceCount: number): number {
  if (sourceCount >= 4) return 100;
  if (sourceCount >= 3) return 85;
  if (sourceCount >= 2) return 70;
  return 50; // Single source
}

/**
 * Build DataQualityScore record from result
 */
export function buildQualityScoreRecord(
  input: QualityInput,
  result: QualityResult
): Omit<DataQualityScore, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId: input.clientId,
    scopeKey: input.scopeKey,
    scopeId: input.scopeId,
    domainKey: input.domainKey,
    objectTypeKey: input.objectTypeKey,
    scoreTotal: result.scoreTotal,
    completenessScore: result.completenessScore,
    freshnessScore: result.freshnessScore,
    consistencyScore: result.consistencyScore,
    coverageScore: result.coverageScore,
    asOf: input.asOf,
    computedAt: new Date().toISOString(),
    detailsJson: result.details,
  };
}

/**
 * Check if quality score requires exception
 */
export function shouldEmitException(
  score: number,
  threshold: number = QUALITY_THRESHOLDS.low
): boolean {
  return score < threshold;
}

/**
 * Get quality status label
 */
export function getQualityStatusLabel(
  score: number,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): { label: string; color: string } {
  const labels = {
    high: {
      ru: 'Высокое качество',
      en: 'High Quality',
      uk: 'Висока якість',
      color: 'emerald',
    },
    medium: {
      ru: 'Среднее качество',
      en: 'Medium Quality',
      uk: 'Середня якість',
      color: 'amber',
    },
    low: {
      ru: 'Низкое качество',
      en: 'Low Quality',
      uk: 'Низька якість',
      color: 'red',
    },
  };

  if (score >= QUALITY_THRESHOLDS.high) {
    return { label: labels.high[locale], color: labels.high.color };
  }
  if (score >= QUALITY_THRESHOLDS.medium) {
    return { label: labels.medium[locale], color: labels.medium.color };
  }
  return { label: labels.low[locale], color: labels.low.color };
}

/**
 * Generate quality improvement suggestions
 */
export function generateQualitySuggestions(
  result: QualityResult,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): string[] {
  const suggestions: string[] = [];

  const texts = {
    ru: {
      completeness: (fields: string[]) => `Заполните обязательные поля: ${fields.slice(0, 3).join(', ')}${fields.length > 3 ? '...' : ''}`,
      freshness: 'Обновите данные до актуальной даты',
      consistency: 'Устраните конфликты между источниками данных',
      coverage: 'Добавьте дополнительные источники данных для верификации',
    },
    en: {
      completeness: (fields: string[]) => `Fill required fields: ${fields.slice(0, 3).join(', ')}${fields.length > 3 ? '...' : ''}`,
      freshness: 'Update data to current date',
      consistency: 'Resolve conflicts between data sources',
      coverage: 'Add additional data sources for verification',
    },
    uk: {
      completeness: (fields: string[]) => `Заповніть обов'язкові поля: ${fields.slice(0, 3).join(', ')}${fields.length > 3 ? '...' : ''}`,
      freshness: 'Оновіть дані до актуальної дати',
      consistency: 'Усуньте конфлікти між джерелами даних',
      coverage: 'Додайте додаткові джерела даних для верифікації',
    },
  };

  const t = texts[locale];

  if (result.completenessScore < 80 && result.details.missingFields?.length) {
    suggestions.push(t.completeness(result.details.missingFields));
  }

  if (result.freshnessScore < 70) {
    suggestions.push(t.freshness);
  }

  if (result.consistencyScore < 80) {
    suggestions.push(t.consistency);
  }

  if (result.coverageScore < 70) {
    suggestions.push(t.coverage);
  }

  return suggestions;
}
