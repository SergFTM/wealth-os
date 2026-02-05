/**
 * Plan vs Actual Link Schema
 * Links planned cashflow items to actual transactions
 */

export type GapStatus = 'ok' | 'warning' | 'critical';

export interface ActualRef {
  type: 'invoice' | 'transaction' | 'gl_entry';
  id: string;
  amount: number;
  date: string;
}

export interface PlanActualLink {
  id: string;
  clientId?: string;
  planItemId: string;
  planItemTitle: string;
  planCategory: string;
  actualRefs: ActualRef[];
  periodStart: string;
  periodEnd: string;
  plannedAmount: number;
  actualAmount: number;
  gapAmount: number;
  gapPct: number;
  explained: boolean;
  explanationNote?: string;
  linkedTaskId?: string;
  updatedAt: string;
}

export interface PlanActualLinkCreateInput {
  clientId?: string;
  planItemId: string;
  planItemTitle: string;
  planCategory: string;
  actualRefs?: ActualRef[];
  periodStart: string;
  periodEnd: string;
  plannedAmount: number;
  actualAmount?: number;
}

export function calculateGap(planned: number, actual: number): { amount: number; pct: number } {
  const amount = actual - planned;
  const pct = planned !== 0 ? Math.round((amount / Math.abs(planned)) * 100) : 0;
  return { amount, pct };
}

export function getGapStatus(gapPct: number): GapStatus {
  const absGap = Math.abs(gapPct);
  if (absGap <= 5) return 'ok';
  if (absGap <= 15) return 'warning';
  return 'critical';
}

export const gapStatusColors: Record<string, string> = {
  ok: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  critical: 'bg-red-100 text-red-800',
};

export const GAP_STATUS_CONFIG: Record<GapStatus, { label: { ru: string; en: string; uk: string }; color: string }> = {
  ok: { label: { ru: 'В норме', en: 'On Track', uk: 'В нормі' }, color: 'bg-emerald-100 text-emerald-800' },
  warning: { label: { ru: 'Отклонение', en: 'Variance', uk: 'Відхилення' }, color: 'bg-amber-100 text-amber-800' },
  critical: { label: { ru: 'Критично', en: 'Critical', uk: 'Критично' }, color: 'bg-red-100 text-red-800' },
};

export function formatGap(amount: number, pct: number): string {
  const sign = amount >= 0 ? '+' : '';
  const formattedAmount = Math.abs(amount) >= 1000
    ? `${sign}$${(amount / 1000).toFixed(0)}K`
    : `${sign}$${amount.toFixed(0)}`;
  return `${formattedAmount} (${sign}${pct}%)`;
}
