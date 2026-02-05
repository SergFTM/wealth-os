/**
 * Data Quality Conflict Schema
 * Data conflicts requiring manual resolution
 */

import { DqConflictType, DqSeverity } from '../config';

export type DqConflictStatus = 'open' | 'resolved' | 'merged';

export interface ConflictRef {
  collection: string;
  recordId: string;
  displayLabel: string;
  keyFields: Record<string, unknown>;
}

export interface DqConflict {
  id: string;
  clientId?: string;
  conflictType: DqConflictType;
  severity: DqSeverity;
  status: DqConflictStatus;
  title: string;
  description?: string;
  leftRef: ConflictRef;
  rightRef: ConflictRef;
  mergedRef?: ConflictRef;
  resolution?: 'keep_left' | 'keep_right' | 'merge' | 'delete_both';
  resolvedByUserId?: string;
  createdAt: string;
  resolvedAt?: string;
  updatedAt: string;
}

export interface DqConflictCreateInput {
  clientId?: string;
  conflictType: DqConflictType;
  severity?: DqSeverity;
  title: string;
  description?: string;
  leftRef: ConflictRef;
  rightRef: ConflictRef;
}

export const DQ_CONFLICT_STATUS_CONFIG: Record<DqConflictStatus, { label: { ru: string; en: string; uk: string }; color: string }> = {
  open: { label: { ru: 'Открыт', en: 'Open', uk: 'Відкритий' }, color: 'red' },
  resolved: { label: { ru: 'Решён', en: 'Resolved', uk: 'Вирішений' }, color: 'emerald' },
  merged: { label: { ru: 'Объединён', en: 'Merged', uk: 'Об\'єднаний' }, color: 'blue' },
};

export function formatConflictDiff(left: unknown, right: unknown): string {
  const leftStr = JSON.stringify(left);
  const rightStr = JSON.stringify(right);
  if (leftStr === rightStr) return 'Идентичны';
  return `${leftStr} ≠ ${rightStr}`;
}
