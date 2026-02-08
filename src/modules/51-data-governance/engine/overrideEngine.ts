import { DataOverride, OverrideValue } from './types';
import { OVERRIDE_STATUSES, OVERRIDE_TYPES } from '../config';

export interface CreateOverrideInput {
  clientId: string;
  targetTypeKey: 'kpi' | 'object' | 'recon';
  targetId: string;
  targetName?: string;
  overrideTypeKey: keyof typeof OVERRIDE_TYPES;
  value: OverrideValue;
  reason: string;
  requestedByUserId: string;
  requestedByName?: string;
}

export interface ApproveOverrideInput {
  overrideId: string;
  approvedByUserId: string;
  approvedByName?: string;
}

export interface RejectOverrideInput {
  overrideId: string;
  rejectedByUserId: string;
  rejectionReason: string;
}

/**
 * Create a new override request
 */
export function createOverride(
  input: CreateOverrideInput
): Omit<DataOverride, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId: input.clientId,
    targetTypeKey: input.targetTypeKey,
    targetId: input.targetId,
    targetName: input.targetName,
    overrideTypeKey: input.overrideTypeKey,
    valueJson: input.value,
    reason: input.reason,
    statusKey: 'draft',
    requestedByUserId: input.requestedByUserId,
    requestedByName: input.requestedByName,
  };
}

/**
 * Submit override for approval
 */
export function submitForApproval(override: DataOverride): Partial<DataOverride> {
  if (override.statusKey !== 'draft') {
    throw new Error('Only draft overrides can be submitted for approval');
  }

  return {
    statusKey: 'pending',
  };
}

/**
 * Approve an override
 */
export function approveOverride(
  override: DataOverride,
  approvedByUserId: string,
  approvedByName?: string
): Partial<DataOverride> {
  if (override.statusKey !== 'pending') {
    throw new Error('Only pending overrides can be approved');
  }

  return {
    statusKey: 'approved',
    approvedByUserId,
    approvedByName,
  };
}

/**
 * Reject an override
 */
export function rejectOverride(
  override: DataOverride,
  rejectionReason: string
): Partial<DataOverride> {
  if (override.statusKey !== 'pending') {
    throw new Error('Only pending overrides can be rejected');
  }

  return {
    statusKey: 'rejected',
    rejectionReason,
  };
}

/**
 * Apply an approved override
 */
export function applyOverride(override: DataOverride): Partial<DataOverride> {
  if (override.statusKey !== 'approved') {
    throw new Error('Only approved overrides can be applied');
  }

  return {
    statusKey: 'applied',
    appliedAt: new Date().toISOString(),
  };
}

/**
 * Calculate adjusted value after override
 */
export function calculateAdjustedValue(
  originalValue: number,
  override: DataOverride
): number {
  const { valueJson, overrideTypeKey } = override;

  switch (overrideTypeKey) {
    case 'adjustment':
      // Add adjustment amount to original
      return originalValue + (valueJson.adjustmentAmount || 0);

    case 'reclass':
      // Replace with new value
      return typeof valueJson.newValue === 'number' ? valueJson.newValue : originalValue;

    case 'mapping_fix':
      // Replace with new value
      return typeof valueJson.newValue === 'number' ? valueJson.newValue : originalValue;

    default:
      return originalValue;
  }
}

/**
 * Get override effect description
 */
export function getOverrideEffectDescription(
  override: DataOverride,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): string {
  const { valueJson, overrideTypeKey } = override;

  const templates = {
    adjustment: {
      ru: `Корректировка на ${formatValue(valueJson.adjustmentAmount || 0, valueJson.currency)}`,
      en: `Adjustment of ${formatValue(valueJson.adjustmentAmount || 0, valueJson.currency)}`,
      uk: `Коригування на ${formatValue(valueJson.adjustmentAmount || 0, valueJson.currency)}`,
    },
    reclass: {
      ru: `Реклассификация: ${valueJson.oldValue} → ${valueJson.newValue}`,
      en: `Reclassification: ${valueJson.oldValue} → ${valueJson.newValue}`,
      uk: `Рекласифікація: ${valueJson.oldValue} → ${valueJson.newValue}`,
    },
    mapping_fix: {
      ru: `Исправление маппинга: ${valueJson.field || 'поле'} = ${valueJson.newValue}`,
      en: `Mapping fix: ${valueJson.field || 'field'} = ${valueJson.newValue}`,
      uk: `Виправлення мапінгу: ${valueJson.field || 'поле'} = ${valueJson.newValue}`,
    },
  };

  return templates[overrideTypeKey][locale];
}

/**
 * Validate override can be created
 */
export function validateOverride(input: CreateOverrideInput): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.targetId) {
    errors.push('Target ID is required');
  }

  if (!input.reason || input.reason.trim().length < 10) {
    errors.push('Reason must be at least 10 characters');
  }

  if (!input.requestedByUserId) {
    errors.push('Requester user ID is required');
  }

  // Validate value based on type
  if (input.overrideTypeKey === 'adjustment' && !input.value.adjustmentAmount) {
    errors.push('Adjustment amount is required');
  }

  if (input.overrideTypeKey === 'reclass' && !input.value.newValue) {
    errors.push('New value is required for reclassification');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get status transition options
 */
export function getAvailableTransitions(
  currentStatus: keyof typeof OVERRIDE_STATUSES
): Array<{ action: string; nextStatus: keyof typeof OVERRIDE_STATUSES }> {
  const transitions: Record<string, Array<{ action: string; nextStatus: keyof typeof OVERRIDE_STATUSES }>> = {
    draft: [
      { action: 'submit', nextStatus: 'pending' },
    ],
    pending: [
      { action: 'approve', nextStatus: 'approved' },
      { action: 'reject', nextStatus: 'rejected' },
    ],
    approved: [
      { action: 'apply', nextStatus: 'applied' },
    ],
    rejected: [],
    applied: [],
  };

  return transitions[currentStatus] || [];
}

/**
 * Get pending overrides for a target
 */
export function filterPendingOverrides(
  overrides: DataOverride[],
  targetId: string
): DataOverride[] {
  return overrides.filter(
    o => o.targetId === targetId && (o.statusKey === 'pending' || o.statusKey === 'approved')
  );
}

/**
 * Get applied overrides for a target
 */
export function filterAppliedOverrides(
  overrides: DataOverride[],
  targetId: string
): DataOverride[] {
  return overrides.filter(o => o.targetId === targetId && o.statusKey === 'applied');
}

// Helper function
function formatValue(value: number, currency?: string): string {
  if (currency) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat('ru-RU').format(value);
}
