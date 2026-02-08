/**
 * MDM Match Engine
 * Finds duplicate candidates across People, Entities, Accounts, Assets
 */

import { MdmRecordTypeKey } from '../config';

export interface MatchReason {
  field: string;
  reason: string;
  weight: number;
  valueA: unknown;
  valueB: unknown;
}

export interface MatchResult {
  candidateAId: string;
  candidateBId: string;
  matchScore: number;
  reasons: MatchReason[];
}

export interface MatchingWeights {
  [field: string]: number;
}

export interface MatchingConfig {
  weights: MatchingWeights;
  threshold: number;
  fuzzyFields: string[];
  exactFields: string[];
}

const DEFAULT_PEOPLE_CONFIG: MatchingConfig = {
  weights: {
    firstName: 0.15,
    lastName: 0.20,
    email: 0.25,
    phone: 0.15,
    dateOfBirth: 0.15,
    ssn: 0.10,
  },
  threshold: 0.65,
  fuzzyFields: ['firstName', 'lastName'],
  exactFields: ['email', 'phone', 'ssn', 'dateOfBirth'],
};

const DEFAULT_ENTITIES_CONFIG: MatchingConfig = {
  weights: {
    legalName: 0.30,
    jurisdiction: 0.15,
    registrationNumber: 0.25,
    taxId: 0.20,
    lei: 0.10,
  },
  threshold: 0.70,
  fuzzyFields: ['legalName'],
  exactFields: ['registrationNumber', 'taxId', 'lei', 'jurisdiction'],
};

const DEFAULT_ACCOUNTS_CONFIG: MatchingConfig = {
  weights: {
    institution: 0.20,
    accountNumber: 0.35,
    currency: 0.10,
    linkedEntityId: 0.20,
    iban: 0.15,
  },
  threshold: 0.75,
  fuzzyFields: [],
  exactFields: ['institution', 'accountNumber', 'currency', 'iban'],
};

const DEFAULT_ASSETS_CONFIG: MatchingConfig = {
  weights: {
    isin: 0.30,
    cusip: 0.25,
    ticker: 0.20,
    exchange: 0.15,
    name: 0.10,
  },
  threshold: 0.70,
  fuzzyFields: ['name'],
  exactFields: ['isin', 'cusip', 'ticker', 'exchange'],
};

/**
 * Simple Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Calculate fuzzy similarity (0-1)
 */
function fuzzyMatch(a: string, b: string): number {
  if (!a || !b) return 0;
  const aLower = a.toLowerCase().trim();
  const bLower = b.toLowerCase().trim();
  if (aLower === bLower) return 1;
  const maxLen = Math.max(aLower.length, bLower.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(aLower, bLower);
  return 1 - distance / maxLen;
}

/**
 * Calculate exact match (0 or 1)
 */
function exactMatch(a: unknown, b: unknown): number {
  if (a === null || a === undefined || b === null || b === undefined) return 0;
  const aStr = String(a).toLowerCase().trim();
  const bStr = String(b).toLowerCase().trim();
  return aStr === bStr ? 1 : 0;
}

/**
 * Get field value from record (handles nested chosenJson)
 */
function getFieldValue(record: Record<string, unknown>, field: string): unknown {
  if (record.chosenJson && typeof record.chosenJson === 'object') {
    const chosen = record.chosenJson as Record<string, unknown>;
    if (field in chosen) {
      return chosen[field];
    }
  }
  return record[field];
}

/**
 * Calculate match score between two records
 */
export function calculateMatchScore(
  recordA: Record<string, unknown>,
  recordB: Record<string, unknown>,
  config: MatchingConfig
): MatchResult {
  const reasons: MatchReason[] = [];
  let totalScore = 0;
  let totalWeight = 0;

  // Process exact fields
  for (const field of config.exactFields) {
    const weight = config.weights[field] || 0;
    if (weight === 0) continue;

    const valueA = getFieldValue(recordA, field);
    const valueB = getFieldValue(recordB, field);
    const score = exactMatch(valueA, valueB);

    if (score > 0) {
      reasons.push({
        field,
        reason: 'Exact match',
        weight,
        valueA,
        valueB,
      });
    }

    totalScore += score * weight;
    totalWeight += weight;
  }

  // Process fuzzy fields
  for (const field of config.fuzzyFields) {
    const weight = config.weights[field] || 0;
    if (weight === 0) continue;

    const valueA = getFieldValue(recordA, field);
    const valueB = getFieldValue(recordB, field);
    const score = fuzzyMatch(String(valueA || ''), String(valueB || ''));

    if (score >= 0.7) {
      reasons.push({
        field,
        reason: score === 1 ? 'Exact match' : `Fuzzy match (${Math.round(score * 100)}%)`,
        weight,
        valueA,
        valueB,
      });
    }

    totalScore += score * weight;
    totalWeight += weight;
  }

  const matchScore = totalWeight > 0 ? totalScore / totalWeight : 0;

  return {
    candidateAId: recordA.id as string,
    candidateBId: recordB.id as string,
    matchScore,
    reasons,
  };
}

/**
 * Get default config for record type
 */
export function getDefaultConfig(recordType: MdmRecordTypeKey): MatchingConfig {
  switch (recordType) {
    case 'people':
      return DEFAULT_PEOPLE_CONFIG;
    case 'entities':
      return DEFAULT_ENTITIES_CONFIG;
    case 'accounts':
      return DEFAULT_ACCOUNTS_CONFIG;
    case 'assets':
      return DEFAULT_ASSETS_CONFIG;
    default:
      return DEFAULT_PEOPLE_CONFIG;
  }
}

/**
 * Find duplicate candidates in a list of records
 */
export function findDuplicateCandidates(
  records: Record<string, unknown>[],
  recordType: MdmRecordTypeKey,
  customConfig?: Partial<MatchingConfig>
): MatchResult[] {
  const config = { ...getDefaultConfig(recordType), ...customConfig };
  const candidates: MatchResult[] = [];

  // Filter out already merged records
  const activeRecords = records.filter(
    (r) => r.status !== 'merged' && !r.mergedIntoId
  );

  // Compare each pair
  for (let i = 0; i < activeRecords.length; i++) {
    for (let j = i + 1; j < activeRecords.length; j++) {
      const result = calculateMatchScore(activeRecords[i], activeRecords[j], config);
      if (result.matchScore >= config.threshold) {
        candidates.push(result);
      }
    }
  }

  // Sort by score descending
  return candidates.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Run matching for a specific pair of records
 */
export function matchRecords(
  recordA: Record<string, unknown>,
  recordB: Record<string, unknown>,
  recordType: MdmRecordTypeKey,
  customConfig?: Partial<MatchingConfig>
): MatchResult {
  const config = { ...getDefaultConfig(recordType), ...customConfig };
  return calculateMatchScore(recordA, recordB, config);
}
