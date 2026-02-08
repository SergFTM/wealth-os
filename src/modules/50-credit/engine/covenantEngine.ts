/**
 * Covenant Engine
 * Tests covenants and determines compliance status
 */

import { CreditCovenant, CovenantTestResult } from './types';

export interface CovenantDataSources {
  cashBalance?: number;
  netWorth?: number;
  totalDebt?: number;
  ebitda?: number;
  collateralValue?: number;
  loanOutstanding?: number;
}

/**
 * Get current value for a covenant based on its type
 */
export function getCovenantCurrentValue(
  covenant: CreditCovenant,
  dataSources: CovenantDataSources
): number | null {
  switch (covenant.covenantTypeKey) {
    case 'min_liquidity':
      return dataSources.cashBalance ?? null;

    case 'min_net_worth':
      return dataSources.netWorth ?? null;

    case 'max_leverage':
      if (dataSources.totalDebt !== undefined && dataSources.netWorth !== undefined && dataSources.netWorth > 0) {
        return dataSources.totalDebt / dataSources.netWorth;
      }
      return null;

    case 'max_ltv':
      if (dataSources.loanOutstanding !== undefined && dataSources.collateralValue !== undefined && dataSources.collateralValue > 0) {
        return (dataSources.loanOutstanding / dataSources.collateralValue) * 100;
      }
      return null;

    case 'min_ebitda':
      return dataSources.ebitda ?? null;

    case 'debt_service_coverage':
      // Would need more complex calculation with debt service
      return null;

    default:
      return covenant.currentValueJson?.value ?? null;
  }
}

/**
 * Check if covenant is compliant
 */
export function isCovenantCompliant(
  currentValue: number,
  threshold: { operator: string; value: number }
): boolean {
  switch (threshold.operator) {
    case '>=':
      return currentValue >= threshold.value;
    case '<=':
      return currentValue <= threshold.value;
    case '>':
      return currentValue > threshold.value;
    case '<':
      return currentValue < threshold.value;
    case '==':
      return currentValue === threshold.value;
    default:
      return false;
  }
}

/**
 * Determine covenant status based on current value, threshold, and buffer
 */
export function determineCovenantStatus(
  currentValue: number,
  threshold: { operator: string; value: number },
  bufferPct: number = 10
): 'ok' | 'at_risk' | 'breach' {
  const isCompliant = isCovenantCompliant(currentValue, threshold);

  if (!isCompliant) {
    return 'breach';
  }

  // Check if within buffer zone (at_risk)
  const bufferMultiplier = 1 + (bufferPct / 100);
  const inverseBufferMultiplier = 1 - (bufferPct / 100);

  switch (threshold.operator) {
    case '>=':
    case '>':
      // For minimum thresholds, at_risk if close to falling below
      if (currentValue < threshold.value * bufferMultiplier) {
        return 'at_risk';
      }
      break;
    case '<=':
    case '<':
      // For maximum thresholds, at_risk if close to exceeding
      if (currentValue > threshold.value * inverseBufferMultiplier) {
        return 'at_risk';
      }
      break;
  }

  return 'ok';
}

/**
 * Test a covenant and return result
 */
export function testCovenant(
  covenant: CreditCovenant,
  dataSources: CovenantDataSources
): CovenantTestResult {
  const currentValue = getCovenantCurrentValue(covenant, dataSources);
  const previousStatus = covenant.statusKey;

  if (currentValue === null) {
    return {
      covenantId: covenant.id,
      testedAt: new Date().toISOString(),
      previousStatus,
      newStatus: previousStatus, // Keep previous status if can't calculate
      currentValue: 0,
      threshold: covenant.thresholdJson.value,
      isCompliant: previousStatus === 'ok',
      requiresAction: false
    };
  }

  const newStatus = determineCovenantStatus(
    currentValue,
    covenant.thresholdJson,
    covenant.bufferPct ?? 10
  );

  const isCompliant = isCovenantCompliant(currentValue, covenant.thresholdJson);
  const requiresAction = newStatus === 'breach' ||
    (newStatus === 'at_risk' && previousStatus === 'ok');

  return {
    covenantId: covenant.id,
    testedAt: new Date().toISOString(),
    previousStatus,
    newStatus,
    currentValue,
    threshold: covenant.thresholdJson.value,
    isCompliant,
    requiresAction
  };
}

/**
 * Test all covenants and return results
 */
export function testAllCovenants(
  covenants: CreditCovenant[],
  dataSources: CovenantDataSources
): CovenantTestResult[] {
  return covenants.map(covenant => testCovenant(covenant, dataSources));
}

/**
 * Get next test date based on frequency
 */
export function getNextTestDate(
  lastTestDate: Date,
  frequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual'
): Date {
  const next = new Date(lastTestDate);

  switch (frequency) {
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'semi_annual':
      next.setMonth(next.getMonth() + 6);
      break;
    case 'annual':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
}

/**
 * Get covenants due for testing
 */
export function getCovenantsDueForTesting(
  covenants: CreditCovenant[],
  asOfDate: Date = new Date()
): CreditCovenant[] {
  return covenants.filter(covenant => {
    if (!covenant.nextTestAt) return true;
    return new Date(covenant.nextTestAt) <= asOfDate;
  });
}

/**
 * Generate covenant risk memo (for AI panel)
 */
export function generateCovenantRiskMemo(
  covenants: CreditCovenant[],
  testResults: CovenantTestResult[]
): string {
  const breaches = testResults.filter(r => r.newStatus === 'breach');
  const atRisk = testResults.filter(r => r.newStatus === 'at_risk');
  const ok = testResults.filter(r => r.newStatus === 'ok');

  const lines: string[] = [
    '## Отчёт о состоянии ковенантов',
    '',
    `**Дата проверки:** ${new Date().toLocaleDateString('ru-RU')}`,
    '',
    '### Сводка:',
    `- OK: ${ok.length}`,
    `- At Risk: ${atRisk.length}`,
    `- Breach: ${breaches.length}`,
    ''
  ];

  if (breaches.length > 0) {
    lines.push('### Нарушения (требуют немедленного внимания):');
    lines.push('');
    for (const result of breaches) {
      const covenant = covenants.find(c => c.id === result.covenantId);
      if (covenant) {
        lines.push(`- **${covenant.name}**: текущее значение ${formatValue(result.currentValue, covenant.covenantTypeKey)} vs порог ${formatValue(result.threshold, covenant.covenantTypeKey)}`);
      }
    }
    lines.push('');
  }

  if (atRisk.length > 0) {
    lines.push('### Под угрозой (мониторинг):');
    lines.push('');
    for (const result of atRisk) {
      const covenant = covenants.find(c => c.id === result.covenantId);
      if (covenant) {
        lines.push(`- **${covenant.name}**: ${formatValue(result.currentValue, covenant.covenantTypeKey)} (буфер ${covenant.bufferPct || 10}%)`);
      }
    }
    lines.push('');
  }

  lines.push('### Рекомендации:');
  lines.push('');

  if (breaches.length > 0) {
    lines.push('1. Уведомить банк о нарушении ковенанта');
    lines.push('2. Подготовить запрос на waiver');
    lines.push('3. Разработать план восстановления compliance');
  } else if (atRisk.length > 0) {
    lines.push('1. Усилить мониторинг показателей');
    lines.push('2. Подготовить сценарии улучшения');
    lines.push('3. Рассмотреть превентивные меры');
  } else {
    lines.push('Все ковенанты в норме. Продолжить регулярный мониторинг.');
  }

  lines.push('');
  lines.push('---');
  lines.push('*Не является финансовой или юридической консультацией.*');

  return lines.join('\n');
}

function formatValue(value: number, covenantType: string): string {
  switch (covenantType) {
    case 'max_ltv':
    case 'max_leverage':
      return `${value.toFixed(1)}%`;
    case 'min_liquidity':
    case 'min_net_worth':
    case 'min_ebitda':
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    default:
      return value.toFixed(2);
  }
}
