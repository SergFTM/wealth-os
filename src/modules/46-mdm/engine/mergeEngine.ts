/**
 * MDM Merge Engine
 * Handles merging duplicate records into a single golden record
 */

import { MdmRecordTypeKey } from '../config';
import { buildGoldenRecord, FieldDecision, SurvivorshipRule } from './survivorship';

export interface MergeSource {
  id: string;
  sourcesJson: Array<{
    sourceSystem: string;
    sourceId?: string;
    asOf: string;
    fieldsJson: Record<string, unknown>;
  }>;
  chosenJson: Record<string, unknown>;
  overridesJson?: Record<string, { value: unknown; overriddenBy: string; reason?: string }>;
}

export interface SurvivorshipPlan {
  [field: string]: {
    chosenValue: unknown;
    chosenSource: string;
    rule: string;
    manual: boolean;
  };
}

export interface MergeJob {
  id: string;
  recordTypeKey: MdmRecordTypeKey;
  primaryId: string;
  mergeIdsJson: string[];
  survivorshipPlanJson: SurvivorshipPlan;
  status: 'draft' | 'pending_approval' | 'applied' | 'cancelled';
  requestedByUserId: string;
  approvedByUserId?: string;
  approvedAt?: string;
  appliedAt?: string;
}

export interface MergeResult {
  success: boolean;
  goldenRecord: Record<string, unknown>;
  mergedRecordIds: string[];
  auditEvents: Array<{
    action: string;
    recordId: string;
    summary: string;
    details: Record<string, unknown>;
  }>;
  errors?: string[];
}

/**
 * Create a merge plan from candidate records
 */
export function createMergePlan(
  primaryRecord: MergeSource,
  secondaryRecords: MergeSource[],
  customRules?: Record<string, SurvivorshipRule>
): {
  survivorshipPlan: SurvivorshipPlan;
  decisions: FieldDecision[];
  conflicts: Array<{ field: string; values: unknown[] }>;
} {
  // Combine all sources from all records
  const allSources: Array<{
    sourceSystem: string;
    sourceId?: string;
    asOf: string;
    fieldsJson: Record<string, unknown>;
  }> = [];

  // Add primary record sources
  for (const source of primaryRecord.sourcesJson || []) {
    allSources.push({
      ...source,
      sourceSystem: `primary:${source.sourceSystem}`,
    });
  }

  // Add secondary record sources
  for (const secondary of secondaryRecords) {
    for (const source of secondary.sourcesJson || []) {
      allSources.push({
        ...source,
        sourceSystem: `secondary:${source.sourceSystem}`,
      });
    }
  }

  // Collect overrides from primary (these take precedence)
  const overrides: Record<string, { value: unknown; source: string }> = {};
  if (primaryRecord.overridesJson) {
    for (const [field, override] of Object.entries(primaryRecord.overridesJson)) {
      overrides[field] = {
        value: override.value,
        source: 'primary_override',
      };
    }
  }

  // Build golden record
  const { chosenJson, confidenceJson, decisions } = buildGoldenRecord(
    allSources,
    overrides,
    customRules
  );

  // Build survivorship plan
  const survivorshipPlan: SurvivorshipPlan = {};
  for (const decision of decisions) {
    survivorshipPlan[decision.field] = {
      chosenValue: decision.chosenValue,
      chosenSource: decision.chosenSource,
      rule: decision.rule,
      manual: decision.rule === 'manual_override',
    };
  }

  // Identify conflicts
  const conflicts: Array<{ field: string; values: unknown[] }> = [];
  for (const decision of decisions) {
    if (decision.alternatives.length > 0) {
      const uniqueValues = new Set([
        JSON.stringify(decision.chosenValue),
        ...decision.alternatives.map((a) => JSON.stringify(a.value)),
      ]);
      if (uniqueValues.size > 1) {
        conflicts.push({
          field: decision.field,
          values: [decision.chosenValue, ...decision.alternatives.map((a) => a.value)],
        });
      }
    }
  }

  return { survivorshipPlan, decisions, conflicts };
}

/**
 * Apply a merge job to update records
 */
export function applyMerge(
  mergeJob: MergeJob,
  primaryRecord: Record<string, unknown>,
  secondaryRecords: Record<string, unknown>[]
): MergeResult {
  const auditEvents: MergeResult['auditEvents'] = [];
  const errors: string[] = [];

  try {
    // Build the merged golden record
    const goldenRecord: Record<string, unknown> = {
      ...primaryRecord,
      chosenJson: {} as Record<string, unknown>,
      updatedAt: new Date().toISOString(),
    };

    // Apply survivorship plan
    for (const [field, plan] of Object.entries(mergeJob.survivorshipPlanJson)) {
      (goldenRecord.chosenJson as Record<string, unknown>)[field] = plan.chosenValue;
    }

    // Combine all sources
    const allSources: unknown[] = [...((primaryRecord.sourcesJson as unknown[]) || [])];
    for (const secondary of secondaryRecords) {
      const secondarySources = (secondary.sourcesJson as unknown[]) || [];
      for (const source of secondarySources) {
        allSources.push(source);
      }
    }
    goldenRecord.sourcesJson = allSources;

    // Audit event for the merge
    auditEvents.push({
      action: 'merge_applied',
      recordId: mergeJob.primaryId,
      summary: `Merged ${secondaryRecords.length} records into ${mergeJob.primaryId}`,
      details: {
        mergedFrom: mergeJob.mergeIdsJson,
        survivorshipPlan: mergeJob.survivorshipPlanJson,
        approvedBy: mergeJob.approvedByUserId,
      },
    });

    // Audit events for merged records
    for (const secondary of secondaryRecords) {
      auditEvents.push({
        action: 'record_merged_into',
        recordId: secondary.id as string,
        summary: `Record merged into ${mergeJob.primaryId}`,
        details: {
          mergedInto: mergeJob.primaryId,
          mergeJobId: mergeJob.id,
        },
      });
    }

    return {
      success: true,
      goldenRecord,
      mergedRecordIds: mergeJob.mergeIdsJson,
      auditEvents,
    };
  } catch (error) {
    errors.push(String(error));
    return {
      success: false,
      goldenRecord: primaryRecord,
      mergedRecordIds: [],
      auditEvents,
      errors,
    };
  }
}

/**
 * Generate a comparison view for duplicate candidates
 */
export function generateComparisonView(
  recordA: Record<string, unknown>,
  recordB: Record<string, unknown>
): Array<{
  field: string;
  valueA: unknown;
  valueB: unknown;
  match: boolean;
  sourceA?: string;
  sourceB?: string;
}> {
  const chosenA = (recordA.chosenJson || {}) as Record<string, unknown>;
  const chosenB = (recordB.chosenJson || {}) as Record<string, unknown>;

  const allFields = new Set([
    ...Object.keys(chosenA),
    ...Object.keys(chosenB),
  ]);

  const comparison: Array<{
    field: string;
    valueA: unknown;
    valueB: unknown;
    match: boolean;
    sourceA?: string;
    sourceB?: string;
  }> = [];

  for (const field of allFields) {
    const valueA = chosenA[field];
    const valueB = chosenB[field];

    let match = false;
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      match = valueA.toLowerCase().trim() === valueB.toLowerCase().trim();
    } else {
      match = JSON.stringify(valueA) === JSON.stringify(valueB);
    }

    comparison.push({
      field,
      valueA,
      valueB,
      match,
    });
  }

  return comparison.sort((a, b) => {
    // Sort non-matching fields first
    if (a.match !== b.match) return a.match ? 1 : -1;
    return a.field.localeCompare(b.field);
  });
}

/**
 * Validate a merge before applying
 */
export function validateMerge(
  mergeJob: MergeJob,
  primaryRecord: Record<string, unknown>,
  secondaryRecords: Record<string, unknown>[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check primary record exists and is not merged
  if (!primaryRecord) {
    errors.push('Primary record not found');
  } else if (primaryRecord.status === 'merged') {
    errors.push('Primary record is already merged');
  }

  // Check secondary records
  if (secondaryRecords.length === 0) {
    errors.push('No secondary records to merge');
  }

  for (const secondary of secondaryRecords) {
    if (!secondary) {
      errors.push('Secondary record not found');
    } else if (secondary.status === 'merged') {
      errors.push(`Secondary record ${secondary.id} is already merged`);
    }
  }

  // Check survivorship plan has values for key fields
  if (!mergeJob.survivorshipPlanJson || Object.keys(mergeJob.survivorshipPlanJson).length === 0) {
    errors.push('Survivorship plan is empty');
  }

  // Check merge job status
  if (mergeJob.status !== 'pending_approval') {
    errors.push(`Merge job status is ${mergeJob.status}, expected pending_approval`);
  }

  return { valid: errors.length === 0, errors };
}
