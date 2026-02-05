/**
 * Liquidity Alerts Engine
 * Generates and manages liquidity alerts
 */

import { LiquidityAlert, CashForecast } from './types';
import { ForecastResult } from './forecastEngine';

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'open' | 'acknowledged' | 'closed';

export interface AlertRule {
  id: string;
  name: string;
  condition: AlertCondition;
  severity: AlertSeverity;
  enabled: boolean;
}

export interface AlertCondition {
  type: 'deficit_days' | 'min_balance' | 'shortfall_amount' | 'deficit_proximity';
  threshold: number;
  operator: 'lt' | 'gt' | 'eq' | 'lte' | 'gte';
}

export interface SuggestedAction {
  action: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Default alert rules
 */
export const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    id: 'rule-critical-deficit-30d',
    name: 'Critical: Deficit within 30 days',
    condition: {
      type: 'deficit_proximity',
      threshold: 30,
      operator: 'lte',
    },
    severity: 'critical',
    enabled: true,
  },
  {
    id: 'rule-warning-deficit-90d',
    name: 'Warning: Deficit within 90 days',
    condition: {
      type: 'deficit_proximity',
      threshold: 90,
      operator: 'lte',
    },
    severity: 'warning',
    enabled: true,
  },
  {
    id: 'rule-warning-min-balance',
    name: 'Warning: Low minimum balance',
    condition: {
      type: 'min_balance',
      threshold: 100000,
      operator: 'lt',
    },
    severity: 'warning',
    enabled: true,
  },
  {
    id: 'rule-info-shortfall',
    name: 'Info: Potential shortfall under stress',
    condition: {
      type: 'shortfall_amount',
      threshold: 0,
      operator: 'gt',
    },
    severity: 'info',
    enabled: true,
  },
];

/**
 * Generate alerts from forecast results
 */
export function generateAlerts(
  forecast: CashForecast,
  forecastResult: ForecastResult,
  minCashThreshold: number,
  rules: AlertRule[] = DEFAULT_ALERT_RULES
): Omit<LiquidityAlert, 'id' | 'createdAt' | 'updatedAt'>[] {
  const alerts: Omit<LiquidityAlert, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  // Find first deficit date
  const firstDeficitDate = forecastResult.deficitDates[0];
  const daysToDeficit = firstDeficitDate
    ? Math.ceil(
        (new Date(firstDeficitDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  // Calculate shortfall
  const shortfall =
    forecastResult.minBalance < minCashThreshold
      ? minCashThreshold - forecastResult.minBalance
      : 0;

  for (const rule of rules.filter((r) => r.enabled)) {
    let shouldAlert = false;

    switch (rule.condition.type) {
      case 'deficit_proximity':
        if (daysToDeficit !== null) {
          shouldAlert = evaluateCondition(
            daysToDeficit,
            rule.condition.operator,
            rule.condition.threshold
          );
        }
        break;

      case 'min_balance':
        shouldAlert = evaluateCondition(
          forecastResult.minBalance,
          rule.condition.operator,
          rule.condition.threshold
        );
        break;

      case 'shortfall_amount':
        shouldAlert = evaluateCondition(
          shortfall,
          rule.condition.operator,
          rule.condition.threshold
        );
        break;

      case 'deficit_days':
        shouldAlert = evaluateCondition(
          forecastResult.deficitDays,
          rule.condition.operator,
          rule.condition.threshold
        );
        break;
    }

    if (shouldAlert && firstDeficitDate) {
      const alert = createAlert(
        forecast,
        forecastResult,
        rule,
        shortfall,
        firstDeficitDate
      );
      alerts.push(alert);
    }
  }

  // Deduplicate by severity (keep highest severity alert for same deficit date)
  const uniqueAlerts = deduplicateAlerts(alerts);

  return uniqueAlerts;
}

/**
 * Evaluate a condition
 */
function evaluateCondition(
  value: number,
  operator: string,
  threshold: number
): boolean {
  switch (operator) {
    case 'lt':
      return value < threshold;
    case 'gt':
      return value > threshold;
    case 'eq':
      return value === threshold;
    case 'lte':
      return value <= threshold;
    case 'gte':
      return value >= threshold;
    default:
      return false;
  }
}

/**
 * Create an alert object
 */
function createAlert(
  forecast: CashForecast,
  result: ForecastResult,
  rule: AlertRule,
  shortfall: number,
  deficitDate: string
): Omit<LiquidityAlert, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId: forecast.clientId,
    forecastId: forecast.id,
    scenarioId: forecast.baseScenarioId,
    deficitDate,
    shortfallAmount: shortfall,
    currency: 'USD',
    severity: rule.severity,
    status: 'open',
    title: generateAlertTitle(rule.severity, deficitDate, shortfall),
    description: generateAlertDescription(result, deficitDate, shortfall),
    suggestedActionsJson: getSuggestedActions(rule.severity, shortfall),
    sourcesJson: [
      {
        type: 'forecast',
        id: forecast.id,
        description: forecast.name,
      },
    ],
  };
}

/**
 * Generate alert title
 */
function generateAlertTitle(
  severity: AlertSeverity,
  deficitDate: string,
  shortfall: number
): string {
  const severityLabels = {
    critical: 'КРИТИЧНО',
    warning: 'ВНИМАНИЕ',
    info: 'ИНФОРМАЦИЯ',
  };

  const formattedDate = new Date(deficitDate).toLocaleDateString('ru-RU');
  const formattedAmount = formatCurrency(shortfall);

  return `${severityLabels[severity]}: Дефицит ${formattedAmount} на ${formattedDate}`;
}

/**
 * Generate alert description
 */
function generateAlertDescription(
  result: ForecastResult,
  deficitDate: string,
  shortfall: number
): string {
  const daysAway = Math.ceil(
    (new Date(deficitDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  let desc = `Прогнозируется дефицит ликвидности через ${daysAway} дней. `;
  desc += `Минимальный баланс: ${formatCurrency(result.minBalance)}. `;
  desc += `Недостаток: ${formatCurrency(shortfall)}. `;
  desc += `Всего дней с дефицитом: ${result.deficitDays}.`;

  return desc;
}

/**
 * Get suggested actions based on severity and shortfall
 */
function getSuggestedActions(
  severity: AlertSeverity,
  shortfall: number
): SuggestedAction[] {
  const actions: SuggestedAction[] = [];

  if (severity === 'critical') {
    actions.push({
      action: 'delay_payment',
      description: 'Согласовать перенос ближайших платежей',
      priority: 'high',
    });
    actions.push({
      action: 'short_term_financing',
      description: 'Рассмотреть краткосрочное финансирование',
      priority: 'high',
    });
  }

  if (shortfall > 500000) {
    actions.push({
      action: 'sell_liquid_assets',
      description: 'Реализовать ликвидные активы',
      priority: severity === 'critical' ? 'high' : 'medium',
    });
  }

  actions.push({
    action: 'contact_counterparties',
    description: 'Связаться с контрагентами для уточнения сроков',
    priority: 'medium',
  });

  actions.push({
    action: 'review_forecast',
    description: 'Проверить актуальность прогноза',
    priority: 'low',
  });

  return actions;
}

/**
 * Deduplicate alerts by deficit date, keeping highest severity
 */
function deduplicateAlerts(
  alerts: Omit<LiquidityAlert, 'id' | 'createdAt' | 'updatedAt'>[]
): Omit<LiquidityAlert, 'id' | 'createdAt' | 'updatedAt'>[] {
  const severityOrder = { critical: 3, warning: 2, info: 1 };
  const byDate = new Map<
    string,
    Omit<LiquidityAlert, 'id' | 'createdAt' | 'updatedAt'>
  >();

  for (const alert of alerts) {
    const existing = byDate.get(alert.deficitDate);
    if (
      !existing ||
      severityOrder[alert.severity] > severityOrder[existing.severity]
    ) {
      byDate.set(alert.deficitDate, alert);
    }
  }

  return Array.from(byDate.values());
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Check if alert should be escalated
 */
export function shouldEscalate(alert: LiquidityAlert): boolean {
  // Escalate if critical and not acknowledged within 24 hours
  if (alert.severity === 'critical' && alert.status === 'open') {
    const createdAt = new Date(alert.createdAt);
    const now = new Date();
    const hoursOld = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return hoursOld > 24;
  }
  return false;
}

/**
 * Get alert priority for sorting
 */
export function getAlertPriority(alert: LiquidityAlert): number {
  const severityScore = { critical: 1000, warning: 100, info: 10 };
  const statusScore = { open: 100, acknowledged: 10, closed: 1 };

  const daysToDeficit = Math.ceil(
    (new Date(alert.deficitDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Lower score = higher priority
  return (
    -severityScore[alert.severity] -
    statusScore[alert.status] +
    daysToDeficit
  );
}
