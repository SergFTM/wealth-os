import { DataReconciliation, ReconSource, ReconBreakdown } from './types';
import { RECON_TYPES } from '../config';

export interface ReconInput {
  clientId: string;
  reconTypeKey: keyof typeof RECON_TYPES;
  scope: {
    entityId?: string;
    portfolioId?: string;
    accountId?: string;
    currency?: string;
  };
  leftSource: ReconSource;
  rightSource: ReconSource;
  breakdownItems?: Array<{
    category: string;
    leftValue: number;
    rightValue: number;
  }>;
  tolerancePercent?: number;
}

export interface ReconResult {
  delta: number;
  deltaPercent: number;
  status: 'ok' | 'break' | 'pending';
  breakdown: ReconBreakdown[];
  breakCount: number;
  matchCount: number;
}

/**
 * Compute reconciliation between two sources
 */
export function computeReconciliation(input: ReconInput): ReconResult {
  const { leftSource, rightSource, breakdownItems, tolerancePercent = 0.01 } = input;

  // Compute top-level delta
  const delta = leftSource.value - rightSource.value;
  const baseValue = Math.max(Math.abs(leftSource.value), Math.abs(rightSource.value), 1);
  const deltaPercent = (Math.abs(delta) / baseValue) * 100;

  // Determine status based on tolerance
  const status: 'ok' | 'break' = deltaPercent <= tolerancePercent ? 'ok' : 'break';

  // Process breakdown items
  const breakdown: ReconBreakdown[] = [];
  let breakCount = 0;
  let matchCount = 0;

  if (breakdownItems) {
    for (const item of breakdownItems) {
      const itemDelta = item.leftValue - item.rightValue;
      const itemBaseValue = Math.max(Math.abs(item.leftValue), Math.abs(item.rightValue), 1);
      const itemDeltaPercent = (Math.abs(itemDelta) / itemBaseValue) * 100;
      const itemStatus: 'ok' | 'break' = itemDeltaPercent <= tolerancePercent ? 'ok' : 'break';

      breakdown.push({
        category: item.category,
        leftValue: item.leftValue,
        rightValue: item.rightValue,
        delta: itemDelta,
        status: itemStatus,
      });

      if (itemStatus === 'ok') matchCount++;
      else breakCount++;
    }
  }

  return {
    delta,
    deltaPercent,
    status,
    breakdown,
    breakCount,
    matchCount,
  };
}

/**
 * Build DataReconciliation record from result
 */
export function buildReconciliationRecord(
  input: ReconInput,
  result: ReconResult,
  name?: string
): Omit<DataReconciliation, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId: input.clientId,
    name: name || `${RECON_TYPES[input.reconTypeKey].en} - ${new Date().toISOString().split('T')[0]}`,
    reconTypeKey: input.reconTypeKey,
    scopeJson: input.scope,
    asOf: input.leftSource.asOf,
    leftSourceJson: input.leftSource,
    rightSourceJson: input.rightSource,
    deltaValueJson: {
      amount: result.delta,
      percent: result.deltaPercent,
      currency: input.leftSource.currency,
    },
    statusKey: result.status,
    breakdownJson: result.breakdown,
    computedAt: new Date().toISOString(),
  };
}

/**
 * Compute IBOR vs ABOR reconciliation
 */
export function computeIborAbor(
  iborPositions: Array<{ value: number; currency: string }>,
  aborPositions: Array<{ value: number; currency: string }>,
  currency: string = 'USD'
): { leftValue: number; rightValue: number } {
  const iborTotal = iborPositions
    .filter(p => p.currency === currency)
    .reduce((sum, p) => sum + p.value, 0);

  const aborTotal = aborPositions
    .filter(p => p.currency === currency)
    .reduce((sum, p) => sum + p.value, 0);

  return { leftValue: iborTotal, rightValue: aborTotal };
}

/**
 * Compute Cash vs Bank reconciliation
 */
export function computeCashBank(
  cashForecasts: Array<{ amount: number; currency: string }>,
  bankStatements: Array<{ balance: number; currency: string }>,
  currency: string = 'USD'
): { leftValue: number; rightValue: number } {
  const cashTotal = cashForecasts
    .filter(c => c.currency === currency)
    .reduce((sum, c) => sum + c.amount, 0);

  const bankTotal = bankStatements
    .filter(b => b.currency === currency)
    .reduce((sum, b) => sum + b.balance, 0);

  return { leftValue: cashTotal, rightValue: bankTotal };
}

/**
 * Compute Positions vs Custodian reconciliation
 */
export function computePositionsCustodian(
  internalPositions: Array<{ quantity: number; assetId: string }>,
  custodianPositions: Array<{ quantity: number; assetId: string }>
): { leftValue: number; rightValue: number; breakdown: Array<{ category: string; leftValue: number; rightValue: number }> } {
  const internalTotal = internalPositions.reduce((sum, p) => sum + p.quantity, 0);
  const custodianTotal = custodianPositions.reduce((sum, p) => sum + p.quantity, 0);

  // Build breakdown by asset
  const assetIds = new Set([
    ...internalPositions.map(p => p.assetId),
    ...custodianPositions.map(p => p.assetId),
  ]);

  const breakdown: Array<{ category: string; leftValue: number; rightValue: number }> = [];

  for (const assetId of assetIds) {
    const internal = internalPositions.find(p => p.assetId === assetId);
    const custodian = custodianPositions.find(p => p.assetId === assetId);

    breakdown.push({
      category: assetId,
      leftValue: internal?.quantity || 0,
      rightValue: custodian?.quantity || 0,
    });
  }

  return { leftValue: internalTotal, rightValue: custodianTotal, breakdown };
}

/**
 * Get recon break explanation
 */
export function getBreakExplanation(
  recon: DataReconciliation,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): string {
  const templates = {
    ru: {
      intro: `Расхождение в ${recon.reconTypeKey === 'ibor_abor' ? 'IBOR/ABOR' : recon.reconTypeKey}`,
      delta: `Разница: ${formatCurrency(recon.deltaValueJson.amount, recon.deltaValueJson.currency)} (${recon.deltaValueJson.percent.toFixed(2)}%)`,
      left: `${recon.leftSourceJson.name}: ${formatCurrency(recon.leftSourceJson.value, recon.leftSourceJson.currency)}`,
      right: `${recon.rightSourceJson.name}: ${formatCurrency(recon.rightSourceJson.value, recon.rightSourceJson.currency)}`,
    },
    en: {
      intro: `Break in ${recon.reconTypeKey === 'ibor_abor' ? 'IBOR/ABOR' : recon.reconTypeKey}`,
      delta: `Difference: ${formatCurrency(recon.deltaValueJson.amount, recon.deltaValueJson.currency)} (${recon.deltaValueJson.percent.toFixed(2)}%)`,
      left: `${recon.leftSourceJson.name}: ${formatCurrency(recon.leftSourceJson.value, recon.leftSourceJson.currency)}`,
      right: `${recon.rightSourceJson.name}: ${formatCurrency(recon.rightSourceJson.value, recon.rightSourceJson.currency)}`,
    },
    uk: {
      intro: `Розбіжність в ${recon.reconTypeKey === 'ibor_abor' ? 'IBOR/ABOR' : recon.reconTypeKey}`,
      delta: `Різниця: ${formatCurrency(recon.deltaValueJson.amount, recon.deltaValueJson.currency)} (${recon.deltaValueJson.percent.toFixed(2)}%)`,
      left: `${recon.leftSourceJson.name}: ${formatCurrency(recon.leftSourceJson.value, recon.leftSourceJson.currency)}`,
      right: `${recon.rightSourceJson.name}: ${formatCurrency(recon.rightSourceJson.value, recon.rightSourceJson.currency)}`,
    },
  };

  const t = templates[locale];
  return `${t.intro}\n${t.delta}\n${t.left}\n${t.right}`;
}

/**
 * Suggest possible causes for recon break
 */
export function suggestBreakCauses(
  recon: DataReconciliation,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): string[] {
  const causes = {
    ibor_abor: {
      ru: [
        'Разница в методологии оценки активов',
        'Непроведенные корпоративные действия',
        'Разница в учете дивидендов',
        'Задержка в синхронизации данных',
      ],
      en: [
        'Difference in asset valuation methodology',
        'Unprocessed corporate actions',
        'Dividend accrual differences',
        'Data synchronization delay',
      ],
      uk: [
        'Різниця в методології оцінки активів',
        'Необроблені корпоративні дії',
        'Різниця в обліку дивідендів',
        'Затримка в синхронізації даних',
      ],
    },
    cash_bank: {
      ru: [
        'Неотраженные банковские транзакции',
        'Разница во времени проведения платежей',
        'Комиссии и сборы банка',
        'Валютная переоценка',
      ],
      en: [
        'Unrecorded bank transactions',
        'Payment timing differences',
        'Bank fees and charges',
        'Currency revaluation',
      ],
      uk: [
        'Невідображені банківські транзакції',
        'Різниця в часі проведення платежів',
        'Комісії та збори банку',
        'Валютна переоцінка',
      ],
    },
    positions_custodian: {
      ru: [
        'Непроведенные сделки',
        'Корпоративные действия в процессе',
        'Ошибки в маппинге инструментов',
        'Разница в справочных данных',
      ],
      en: [
        'Unprocessed trades',
        'Pending corporate actions',
        'Instrument mapping errors',
        'Reference data differences',
      ],
      uk: [
        'Необроблені угоди',
        'Корпоративні дії в процесі',
        'Помилки в мапінгу інструментів',
        'Різниця в довідкових даних',
      ],
    },
    gl_subledger: {
      ru: [
        'Непроведенные проводки',
        'Разница в периодах закрытия',
        'Корректирующие записи',
        'Интерфейсные ошибки',
      ],
      en: [
        'Unposted entries',
        'Period close differences',
        'Adjusting entries',
        'Interface errors',
      ],
      uk: [
        'Непроведені проводки',
        'Різниця в періодах закриття',
        'Коригуючі записи',
        'Інтерфейсні помилки',
      ],
    },
  };

  return causes[recon.reconTypeKey]?.[locale] || [];
}

// Helper function
function formatCurrency(value: number, currency?: string): string {
  return new Intl.NumberFormat('ru-RU', {
    style: currency ? 'currency' : 'decimal',
    currency: currency || undefined,
    maximumFractionDigits: 2,
  }).format(value);
}
