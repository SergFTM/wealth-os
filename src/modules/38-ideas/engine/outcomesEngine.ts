/**
 * Outcomes Engine
 * Track and compute performance outcomes for investment ideas
 */

export interface IdeaOutcome {
  id: string;
  clientId: string;
  ideaId: string;
  outcomeType: 'monitored' | 'implemented' | 'closed';
  startAt: string;
  endAt?: string;
  entryPrice?: number;
  exitPrice?: number;
  realizedPct?: number;
  unrealizedPct?: number;
  notes?: string;
  linkedRefsJson?: LinkedRef[];
  linkedDecisionId?: string;
}

export interface LinkedRef {
  type: 'position' | 'trade' | 'decision' | 'task';
  id: string;
  label?: string;
}

export interface OutcomeStats {
  totalOutcomes: number;
  monitored: number;
  implemented: number;
  closed: number;
  avgRealizedPct: number;
  positiveOutcomes: number;
  negativeOutcomes: number;
  winRate: number;
}

export interface PerformanceMetrics {
  totalReturn: number;
  avgReturn: number;
  bestReturn: number;
  worstReturn: number;
  avgHoldingDays: number;
}

/**
 * Calculate outcome statistics
 */
export function calculateOutcomeStats(outcomes: IdeaOutcome[]): OutcomeStats {
  const stats: OutcomeStats = {
    totalOutcomes: outcomes.length,
    monitored: 0,
    implemented: 0,
    closed: 0,
    avgRealizedPct: 0,
    positiveOutcomes: 0,
    negativeOutcomes: 0,
    winRate: 0
  };

  const realizedReturns: number[] = [];

  outcomes.forEach(outcome => {
    switch (outcome.outcomeType) {
      case 'monitored':
        stats.monitored++;
        break;
      case 'implemented':
        stats.implemented++;
        break;
      case 'closed':
        stats.closed++;
        break;
    }

    if (outcome.realizedPct !== undefined && outcome.realizedPct !== null) {
      realizedReturns.push(outcome.realizedPct);
      if (outcome.realizedPct > 0) {
        stats.positiveOutcomes++;
      } else if (outcome.realizedPct < 0) {
        stats.negativeOutcomes++;
      }
    }
  });

  if (realizedReturns.length > 0) {
    stats.avgRealizedPct = realizedReturns.reduce((a, b) => a + b, 0) / realizedReturns.length;
  }

  const closedWithReturns = stats.positiveOutcomes + stats.negativeOutcomes;
  if (closedWithReturns > 0) {
    stats.winRate = (stats.positiveOutcomes / closedWithReturns) * 100;
  }

  return stats;
}

/**
 * Calculate performance metrics for closed outcomes
 */
export function calculatePerformanceMetrics(outcomes: IdeaOutcome[]): PerformanceMetrics {
  const closedOutcomes = outcomes.filter(
    o => o.outcomeType === 'closed' && o.realizedPct !== undefined
  );

  if (closedOutcomes.length === 0) {
    return {
      totalReturn: 0,
      avgReturn: 0,
      bestReturn: 0,
      worstReturn: 0,
      avgHoldingDays: 0
    };
  }

  const returns = closedOutcomes.map(o => o.realizedPct || 0);
  const totalReturn = returns.reduce((a, b) => a + b, 0);
  const avgReturn = totalReturn / returns.length;
  const bestReturn = Math.max(...returns);
  const worstReturn = Math.min(...returns);

  // Calculate holding periods
  const holdingDays: number[] = [];
  closedOutcomes.forEach(outcome => {
    if (outcome.startAt && outcome.endAt) {
      const start = new Date(outcome.startAt);
      const end = new Date(outcome.endAt);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      holdingDays.push(days);
    }
  });

  const avgHoldingDays = holdingDays.length > 0
    ? holdingDays.reduce((a, b) => a + b, 0) / holdingDays.length
    : 0;

  return {
    totalReturn,
    avgReturn,
    bestReturn,
    worstReturn,
    avgHoldingDays
  };
}

/**
 * Compute return from entry and exit prices
 */
export function computeReturn(
  entryPrice: number,
  exitPrice: number
): number {
  if (entryPrice <= 0) return 0;
  return ((exitPrice - entryPrice) / entryPrice) * 100;
}

/**
 * Compute unrealized return from entry and current price
 */
export function computeUnrealizedReturn(
  entryPrice: number,
  currentPrice: number
): number {
  return computeReturn(entryPrice, currentPrice);
}

/**
 * Update outcome with new prices
 */
export function updateOutcomeWithPrices(
  outcome: IdeaOutcome,
  currentPrice?: number,
  exitPrice?: number
): Partial<IdeaOutcome> {
  const updates: Partial<IdeaOutcome> = {};

  if (exitPrice !== undefined && outcome.entryPrice) {
    updates.exitPrice = exitPrice;
    updates.realizedPct = computeReturn(outcome.entryPrice, exitPrice);
    updates.outcomeType = 'closed';
    updates.endAt = new Date().toISOString();
  } else if (currentPrice !== undefined && outcome.entryPrice) {
    updates.unrealizedPct = computeUnrealizedReturn(outcome.entryPrice, currentPrice);
  }

  return updates;
}

/**
 * Generate outcome summary text
 */
export function generateOutcomeSummary(outcome: IdeaOutcome, locale: 'ru' | 'en' | 'uk' = 'ru'): string {
  const labels = {
    ru: {
      monitored: 'На мониторинге',
      implemented: 'Реализована',
      closed: 'Закрыта',
      return: 'Доходность',
      unrealized: 'Нереализованная',
      holding: 'Срок удержания'
    },
    en: {
      monitored: 'Monitored',
      implemented: 'Implemented',
      closed: 'Closed',
      return: 'Return',
      unrealized: 'Unrealized',
      holding: 'Holding period'
    },
    uk: {
      monitored: 'На моніторингу',
      implemented: 'Реалізована',
      closed: 'Закрита',
      return: 'Дохідність',
      unrealized: 'Нереалізована',
      holding: 'Термін утримання'
    }
  };

  const l = labels[locale];
  let summary = `**${l[outcome.outcomeType]}**`;

  if (outcome.realizedPct !== undefined) {
    const sign = outcome.realizedPct >= 0 ? '+' : '';
    summary += ` | ${l.return}: ${sign}${outcome.realizedPct.toFixed(2)}%`;
  } else if (outcome.unrealizedPct !== undefined) {
    const sign = outcome.unrealizedPct >= 0 ? '+' : '';
    summary += ` | ${l.unrealized}: ${sign}${outcome.unrealizedPct.toFixed(2)}%`;
  }

  if (outcome.startAt && outcome.endAt) {
    const start = new Date(outcome.startAt);
    const end = new Date(outcome.endAt);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    summary += ` | ${l.holding}: ${days}д`;
  }

  return summary;
}

/**
 * Get outcome status color
 */
export function getOutcomeColor(outcome: IdeaOutcome): string {
  if (outcome.outcomeType === 'monitored') return 'blue';
  if (outcome.outcomeType === 'implemented') return 'amber';

  // Closed - color by performance
  if (outcome.realizedPct !== undefined) {
    if (outcome.realizedPct >= 10) return 'emerald';
    if (outcome.realizedPct >= 0) return 'green';
    if (outcome.realizedPct >= -10) return 'orange';
    return 'red';
  }

  return 'gray';
}

/**
 * Validate outcome data
 */
export function validateOutcome(outcome: Partial<IdeaOutcome>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!outcome.ideaId) {
    errors.push('ID идеи обязателен');
  }

  if (!outcome.outcomeType) {
    errors.push('Тип результата обязателен');
  }

  if (!outcome.startAt) {
    errors.push('Дата начала обязательна');
  }

  if (outcome.outcomeType === 'closed' && !outcome.endAt) {
    errors.push('Дата закрытия обязательна для закрытых результатов');
  }

  if (outcome.entryPrice !== undefined && outcome.entryPrice <= 0) {
    errors.push('Цена входа должна быть положительной');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
