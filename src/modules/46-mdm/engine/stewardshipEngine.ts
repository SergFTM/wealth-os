/**
 * MDM Stewardship Engine
 * Creates and manages data quality exceptions queue
 */

import { MdmRecordTypeKey, StewardIssueTypeKey, SeverityKey } from '../config';

export interface StewardQueueItem {
  id: string;
  clientId: string;
  recordTypeKey: MdmRecordTypeKey;
  recordId: string;
  issueTypeKey: StewardIssueTypeKey;
  severity: SeverityKey;
  issueDetailsJson: {
    field?: string;
    description: string;
    currentValue?: unknown;
    suggestedValue?: unknown;
    conflictingValues?: unknown[];
    affectedSources?: string[];
  };
  status: 'open' | 'assigned' | 'resolved';
  assignedToUserId?: string;
  assignedAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  createdAt: string;
}

export interface DataQualityCheck {
  recordId: string;
  recordType: MdmRecordTypeKey;
  issues: Array<{
    issueType: StewardIssueTypeKey;
    severity: SeverityKey;
    field?: string;
    description: string;
    details: Record<string, unknown>;
  }>;
}

/**
 * Check a record for data quality issues
 */
export function checkRecordQuality(
  record: Record<string, unknown>,
  recordType: MdmRecordTypeKey
): DataQualityCheck {
  const issues: DataQualityCheck['issues'] = [];

  const chosenJson = (record.chosenJson || {}) as Record<string, unknown>;
  const sourcesJson = (record.sourcesJson || []) as Array<{
    sourceSystem: string;
    fieldsJson: Record<string, unknown>;
  }>;
  const confidenceJson = (record.confidenceJson || {}) as Record<string, number>;

  // Check for missing sources
  for (const [field, value] of Object.entries(chosenJson)) {
    if (value === null || value === undefined || value === '') continue;

    // Check if any source has this field
    const hasSource = sourcesJson.some((s) => {
      const fieldValue = s.fieldsJson[field];
      return fieldValue !== null && fieldValue !== undefined;
    });

    if (!hasSource) {
      issues.push({
        issueType: 'missing_source',
        severity: 'medium',
        field,
        description: `Field "${field}" has no source system backing`,
        details: { currentValue: value },
      });
    }
  }

  // Check for low confidence
  for (const [field, confidence] of Object.entries(confidenceJson)) {
    if (confidence < 50) {
      issues.push({
        issueType: 'low_confidence',
        severity: confidence < 30 ? 'high' : 'medium',
        field,
        description: `Field "${field}" has low confidence: ${confidence}%`,
        details: { confidence, threshold: 50 },
      });
    }
  }

  // Check for conflicting values
  const fieldValues: Record<string, unknown[]> = {};
  for (const source of sourcesJson) {
    for (const [field, value] of Object.entries(source.fieldsJson)) {
      if (value === null || value === undefined) continue;
      if (!fieldValues[field]) fieldValues[field] = [];
      fieldValues[field].push(value);
    }
  }

  for (const [field, values] of Object.entries(fieldValues)) {
    if (values.length <= 1) continue;

    const uniqueValues = new Set(
      values.map((v) => {
        if (typeof v === 'string') return v.toLowerCase().trim();
        return JSON.stringify(v);
      })
    );

    if (uniqueValues.size > 1) {
      issues.push({
        issueType: 'conflicting_values',
        severity: 'high',
        field,
        description: `Field "${field}" has ${uniqueValues.size} conflicting values across sources`,
        details: {
          values,
          affectedSources: sourcesJson
            .filter((s) => s.fieldsJson[field] !== undefined)
            .map((s) => s.sourceSystem),
        },
      });
    }
  }

  // Check for stale data
  const now = new Date();
  const staleThreshold = 365 * 24 * 60 * 60 * 1000; // 1 year

  for (const source of sourcesJson) {
    if (!source.fieldsJson) continue;
    const asOf = new Date((source as { asOf?: string }).asOf || 0);
    if (now.getTime() - asOf.getTime() > staleThreshold) {
      issues.push({
        issueType: 'stale_data',
        severity: 'low',
        description: `Source "${source.sourceSystem}" data is over 1 year old`,
        details: { source: source.sourceSystem, asOf: (source as { asOf?: string }).asOf },
      });
    }
  }

  // Check for invalid formats based on record type
  if (recordType === 'people') {
    // Email format
    if (chosenJson.email && typeof chosenJson.email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(chosenJson.email)) {
        issues.push({
          issueType: 'invalid_format',
          severity: 'medium',
          field: 'email',
          description: 'Email format is invalid',
          details: { value: chosenJson.email },
        });
      }
    }

    // Phone format
    if (chosenJson.phone && typeof chosenJson.phone === 'string') {
      const cleanPhone = chosenJson.phone.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        issues.push({
          issueType: 'invalid_format',
          severity: 'low',
          field: 'phone',
          description: 'Phone number length is unusual',
          details: { value: chosenJson.phone, digits: cleanPhone.length },
        });
      }
    }
  }

  if (recordType === 'assets') {
    // ISIN format (12 characters, starts with 2 letters)
    if (chosenJson.isin && typeof chosenJson.isin === 'string') {
      const isinRegex = /^[A-Z]{2}[A-Z0-9]{10}$/;
      if (!isinRegex.test(chosenJson.isin)) {
        issues.push({
          issueType: 'invalid_format',
          severity: 'medium',
          field: 'isin',
          description: 'ISIN format is invalid',
          details: { value: chosenJson.isin },
        });
      }
    }

    // CUSIP format (9 characters)
    if (chosenJson.cusip && typeof chosenJson.cusip === 'string') {
      const cusipRegex = /^[A-Z0-9]{9}$/;
      if (!cusipRegex.test(chosenJson.cusip)) {
        issues.push({
          issueType: 'invalid_format',
          severity: 'medium',
          field: 'cusip',
          description: 'CUSIP format is invalid',
          details: { value: chosenJson.cusip },
        });
      }
    }
  }

  return {
    recordId: record.id as string,
    recordType,
    issues,
  };
}

/**
 * Generate queue items from quality check results
 */
export function generateQueueItems(
  check: DataQualityCheck,
  clientId: string
): Omit<StewardQueueItem, 'id' | 'createdAt'>[] {
  return check.issues.map((issue) => ({
    clientId,
    recordTypeKey: check.recordType,
    recordId: check.recordId,
    issueTypeKey: issue.issueType,
    severity: issue.severity,
    issueDetailsJson: {
      field: issue.field,
      description: issue.description,
      ...issue.details,
    },
    status: 'open' as const,
  }));
}

/**
 * Calculate data quality score for a record
 */
export function calculateDqScore(
  record: Record<string, unknown>,
  recordType: MdmRecordTypeKey
): number {
  const check = checkRecordQuality(record, recordType);

  // Start with 100, deduct based on issues
  let score = 100;

  for (const issue of check.issues) {
    switch (issue.severity) {
      case 'critical':
        score -= 25;
        break;
      case 'high':
        score -= 15;
        break;
      case 'medium':
        score -= 10;
        break;
      case 'low':
        score -= 5;
        break;
    }
  }

  // Bonus for having multiple sources
  const sourcesJson = (record.sourcesJson || []) as unknown[];
  if (sourcesJson.length > 1) {
    score += 5;
  }
  if (sourcesJson.length > 3) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Prioritize queue items for steward attention
 */
export function prioritizeQueue(
  items: StewardQueueItem[]
): StewardQueueItem[] {
  return [...items].sort((a, b) => {
    // Sort by status (open first, then assigned)
    if (a.status !== b.status) {
      const statusOrder = { open: 0, assigned: 1, resolved: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }

    // Then by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (a.severity !== b.severity) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }

    // Then by creation date (oldest first)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

/**
 * Get summary statistics for the stewardship queue
 */
export function getQueueStats(items: StewardQueueItem[]): {
  total: number;
  open: number;
  assigned: number;
  resolved: number;
  bySeverity: Record<SeverityKey, number>;
  byIssueType: Record<StewardIssueTypeKey, number>;
  avgResolutionTime: number;
} {
  const stats = {
    total: items.length,
    open: 0,
    assigned: 0,
    resolved: 0,
    bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
    byIssueType: {
      missing_source: 0,
      conflicting_values: 0,
      low_confidence: 0,
      broken_link: 0,
      invalid_format: 0,
      stale_data: 0,
    },
    avgResolutionTime: 0,
  };

  let totalResolutionTime = 0;
  let resolvedCount = 0;

  for (const item of items) {
    stats.bySeverity[item.severity]++;
    stats.byIssueType[item.issueTypeKey]++;

    switch (item.status) {
      case 'open':
        stats.open++;
        break;
      case 'assigned':
        stats.assigned++;
        break;
      case 'resolved':
        stats.resolved++;
        if (item.resolvedAt) {
          const created = new Date(item.createdAt).getTime();
          const resolved = new Date(item.resolvedAt).getTime();
          totalResolutionTime += resolved - created;
          resolvedCount++;
        }
        break;
    }
  }

  if (resolvedCount > 0) {
    stats.avgResolutionTime = totalResolutionTime / resolvedCount;
  }

  return stats;
}
