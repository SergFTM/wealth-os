/**
 * Scenario Engine
 * Creates and manages cash flow scenarios with adjustments
 */

import { CashScenario } from './types';

export interface ScenarioAdjustments {
  inflowHaircut?: number;       // Percentage reduction on inflows (0-100)
  outflowIncrease?: number;     // Percentage increase on outflows (0-100)
  distributionDelayDays?: number; // Days to delay distributions
  capitalCallShiftDays?: number;  // Days to shift capital calls earlier
  interestRateShock?: number;     // Interest rate shock in basis points
  customRules?: CustomRule[];
}

export interface CustomRule {
  id: string;
  name: string;
  condition: {
    field: 'categoryKey' | 'flowType' | 'amount';
    operator: 'equals' | 'gt' | 'lt' | 'contains';
    value: string | number;
  };
  adjustment: {
    type: 'multiply' | 'add' | 'delay';
    value: number;
  };
}

/**
 * Default scenario presets
 */
export const SCENARIO_PRESETS: Record<string, ScenarioAdjustments> = {
  base: {
    inflowHaircut: 0,
    outflowIncrease: 0,
    distributionDelayDays: 0,
    capitalCallShiftDays: 0,
    interestRateShock: 0,
  },
  conservative: {
    inflowHaircut: 15,
    outflowIncrease: 10,
    distributionDelayDays: 30,
    capitalCallShiftDays: 14,
    interestRateShock: 50,
  },
  aggressive: {
    inflowHaircut: -5, // Negative = increase
    outflowIncrease: -5,
    distributionDelayDays: -14, // Negative = earlier
    capitalCallShiftDays: -7,
    interestRateShock: -25,
  },
};

/**
 * Create a new scenario from preset
 */
export function createScenarioFromPreset(
  type: 'base' | 'conservative' | 'aggressive',
  clientId: string,
  name?: string
): Omit<CashScenario, 'id' | 'createdAt' | 'updatedAt'> {
  const preset = SCENARIO_PRESETS[type];

  return {
    clientId,
    name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} Scenario`,
    scenarioType: type,
    description: getScenarioDescription(type),
    adjustmentsJson: preset,
    isDefault: type === 'base',
  };
}

/**
 * Get human-readable scenario description
 */
function getScenarioDescription(type: string): string {
  switch (type) {
    case 'base':
      return 'Базовый сценарий без корректировок. Используются введённые данные как есть.';
    case 'conservative':
      return 'Консервативный сценарий: снижение притоков на 15%, увеличение оттоков на 10%, задержка дистрибуций на 30 дней.';
    case 'aggressive':
      return 'Агрессивный сценарий: ускорение притоков, снижение оттоков, более ранние дистрибуции.';
    default:
      return 'Пользовательский сценарий с индивидуальными настройками.';
  }
}

/**
 * Validate scenario adjustments
 */
export function validateAdjustments(adjustments: ScenarioAdjustments): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (adjustments.inflowHaircut !== undefined) {
    if (adjustments.inflowHaircut < -100 || adjustments.inflowHaircut > 100) {
      errors.push('Inflow haircut must be between -100 and 100');
    }
  }

  if (adjustments.outflowIncrease !== undefined) {
    if (adjustments.outflowIncrease < -100 || adjustments.outflowIncrease > 500) {
      errors.push('Outflow increase must be between -100 and 500');
    }
  }

  if (adjustments.distributionDelayDays !== undefined) {
    if (adjustments.distributionDelayDays < -365 || adjustments.distributionDelayDays > 365) {
      errors.push('Distribution delay must be between -365 and 365 days');
    }
  }

  if (adjustments.capitalCallShiftDays !== undefined) {
    if (adjustments.capitalCallShiftDays < -180 || adjustments.capitalCallShiftDays > 180) {
      errors.push('Capital call shift must be between -180 and 180 days');
    }
  }

  if (adjustments.interestRateShock !== undefined) {
    if (adjustments.interestRateShock < -500 || adjustments.interestRateShock > 1000) {
      errors.push('Interest rate shock must be between -500 and 1000 basis points');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Merge two scenario adjustments
 */
export function mergeAdjustments(
  base: ScenarioAdjustments,
  override: Partial<ScenarioAdjustments>
): ScenarioAdjustments {
  return {
    ...base,
    ...override,
    customRules: [
      ...(base.customRules || []),
      ...(override.customRules || []),
    ],
  };
}

/**
 * Calculate effective adjustment summary
 */
export function getAdjustmentSummary(adjustments: ScenarioAdjustments): string {
  const parts: string[] = [];

  if (adjustments.inflowHaircut && adjustments.inflowHaircut !== 0) {
    const direction = adjustments.inflowHaircut > 0 ? 'снижение' : 'увеличение';
    parts.push(`притоки: ${direction} ${Math.abs(adjustments.inflowHaircut)}%`);
  }

  if (adjustments.outflowIncrease && adjustments.outflowIncrease !== 0) {
    const direction = adjustments.outflowIncrease > 0 ? 'увеличение' : 'снижение';
    parts.push(`оттоки: ${direction} ${Math.abs(adjustments.outflowIncrease)}%`);
  }

  if (adjustments.distributionDelayDays && adjustments.distributionDelayDays !== 0) {
    const direction = adjustments.distributionDelayDays > 0 ? 'задержка' : 'ускорение';
    parts.push(`дистрибуции: ${direction} ${Math.abs(adjustments.distributionDelayDays)}д`);
  }

  if (adjustments.capitalCallShiftDays && adjustments.capitalCallShiftDays !== 0) {
    const direction = adjustments.capitalCallShiftDays > 0 ? 'раньше' : 'позже';
    parts.push(`capital calls: ${direction} на ${Math.abs(adjustments.capitalCallShiftDays)}д`);
  }

  if (adjustments.interestRateShock && adjustments.interestRateShock !== 0) {
    const direction = adjustments.interestRateShock > 0 ? '+' : '';
    parts.push(`ставки: ${direction}${adjustments.interestRateShock}bp`);
  }

  return parts.length > 0 ? parts.join(', ') : 'без корректировок';
}
