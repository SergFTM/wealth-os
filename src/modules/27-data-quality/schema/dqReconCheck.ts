/**
 * Data Quality Reconciliation Check Schema
 * Results of reconciliation checks
 */

import { DqReconType } from '../config';

export type DqReconStatus = 'ok' | 'break' | 'pending' | 'error';

export interface ReconDetail {
  leftSource: string;
  rightSource: string;
  leftValue: number;
  rightValue: number;
  field: string;
  recordRef?: string;
}

export interface DqReconCheck {
  id: string;
  clientId?: string;
  reconType: DqReconType;
  scopeType?: 'global' | 'household' | 'entity' | 'account';
  scopeId?: string;
  status: DqReconStatus;
  deltaAmount: number;
  deltaPct?: number;
  currency: string;
  details: ReconDetail[];
  tolerance?: number;
  linkedExceptionId?: string;
  lastRunAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DqReconCheckCreateInput {
  clientId?: string;
  reconType: DqReconType;
  scopeType?: DqReconCheck['scopeType'];
  scopeId?: string;
  currency?: string;
  tolerance?: number;
}

export const DQ_RECON_STATUS_CONFIG: Record<DqReconStatus, { label: { ru: string; en: string; uk: string }; color: string; icon: string }> = {
  ok: { label: { ru: 'Сходится', en: 'OK', uk: 'Сходиться' }, color: 'emerald', icon: '✓' },
  break: { label: { ru: 'Расхождение', en: 'Break', uk: 'Розбіжність' }, color: 'red', icon: '⚠' },
  pending: { label: { ru: 'Ожидает', en: 'Pending', uk: 'Очікує' }, color: 'gray', icon: '⏳' },
  error: { label: { ru: 'Ошибка', en: 'Error', uk: 'Помилка' }, color: 'amber', icon: '!' },
};

export function formatReconDelta(delta: number, currency: string): string {
  const sign = delta >= 0 ? '+' : '';
  const formatted = Math.abs(delta) >= 1000
    ? `${(delta / 1000).toFixed(1)}K`
    : delta.toFixed(2);
  return `${sign}${formatted} ${currency}`;
}

export function isWithinTolerance(delta: number, total: number, tolerancePct: number = 0.01): boolean {
  if (total === 0) return delta === 0;
  return Math.abs(delta / total) <= tolerancePct;
}
