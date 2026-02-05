/**
 * Type definitions for Liquidity Planning module
 */

export interface CashPosition {
  id: string;
  clientId: string;
  scopeType: 'household' | 'entity' | 'portfolio' | 'account';
  scopeId?: string;
  accountName: string;
  entityName?: string;
  currency: string;
  balance: number;
  asOf: string;
  sourceType?: 'manual' | 'custodian' | 'bank' | 'gl';
  sourceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CashForecast {
  id: string;
  clientId: string;
  name: string;
  scopeType: 'household' | 'entity' | 'portfolio' | 'account';
  scopeId?: string;
  horizonDays: number;
  baseScenarioId?: string;
  status: 'active' | 'draft' | 'archived';
  assumptionsJson?: {
    inflowGrowth?: number;
    outflowGrowth?: number;
    minCashThreshold?: number;
    includeRecurring?: boolean;
    includePlanned?: boolean;
  };
  resultsJson?: {
    dailyBalances?: Array<{
      date: string;
      openingBalance: number;
      inflows: number;
      outflows: number;
      closingBalance: number;
    }>;
    minBalance?: number;
    minBalanceDate?: string;
    maxBalance?: number;
    totalInflows?: number;
    totalOutflows?: number;
    deficitDays?: number;
    computedAt?: string;
  };
  asOf?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CashFlow {
  id: string;
  clientId: string;
  scopeType: 'household' | 'entity' | 'portfolio' | 'account';
  scopeId?: string;
  flowType: 'inflow' | 'outflow';
  categoryKey: 'payroll' | 'rent' | 'tax' | 'capital_call' | 'distribution' | 'invoice' | 'debt' | 'dividend' | 'interest' | 'fee' | 'other';
  flowDate: string;
  amount: number;
  currency: string;
  description?: string;
  recurrenceJson?: {
    pattern: 'once' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
    endDate?: string;
    occurrences?: number;
  };
  isConfirmed?: boolean;
  sourceType?: 'manual' | 'invoice' | 'capital_call' | 'distribution' | 'tax_deadline' | 'gl';
  sourceId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CashScenario {
  id: string;
  clientId: string;
  name: string;
  scenarioType: 'base' | 'conservative' | 'aggressive' | 'custom';
  description?: string;
  adjustmentsJson: {
    inflowHaircut?: number;
    outflowIncrease?: number;
    distributionDelayDays?: number;
    capitalCallShiftDays?: number;
    interestRateShock?: number;
    customRules?: Array<{
      id: string;
      name: string;
      condition: {
        field: string;
        operator: string;
        value: string | number;
      };
      adjustment: {
        type: string;
        value: number;
      };
    }>;
  };
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CashStressTest {
  id: string;
  clientId: string;
  forecastId: string;
  scenarioId?: string;
  name: string;
  stressType: 'market_drawdown' | 'delayed_distributions' | 'tax_spike' | 'debt_rate_shock' | 'capital_call_acceleration';
  paramsJson: {
    severity?: 'mild' | 'moderate' | 'severe';
    drawdownPercent?: number;
    delayDays?: number;
    rateShockBps?: number;
    taxIncreasePercent?: number;
    accelerationDays?: number;
  };
  resultsJson?: {
    minCashReached?: number;
    minCashDate?: string;
    breachesCount?: number;
    breachDays?: string[];
    totalShortfall?: number;
    impactSummary?: string;
    alertsGenerated?: number;
  };
  runAt?: string;
  runBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LiquidityAlert {
  id: string;
  clientId: string;
  forecastId: string;
  scenarioId?: string;
  stressTestId?: string;
  deficitDate: string;
  shortfallAmount: number;
  currency: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'open' | 'acknowledged' | 'closed';
  title?: string;
  description?: string;
  suggestedActionsJson?: Array<{
    action: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  sourcesJson?: Array<{
    type: string;
    id: string;
    description?: string;
  }>;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  closedAt?: string;
  closedBy?: string;
  closedReason?: string;
  taskId?: string;
  createdAt: string;
  updatedAt: string;
}
