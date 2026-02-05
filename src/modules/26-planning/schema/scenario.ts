/**
 * Planning Scenario Schema
 * Different scenarios for financial projections
 */

export type ScenarioType = 'base' | 'optimistic' | 'conservative' | 'stress' | 'custom';
export type ScenarioStatus = 'active' | 'archived' | 'draft';

export interface Scenario {
  id: string;
  clientId?: string;
  householdId?: string;
  scopeType?: 'global' | 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  name: string;
  description?: string;
  scenarioType?: ScenarioType;
  type: ScenarioType;
  horizonYears?: number;
  assumptionsRefId?: string;
  status?: ScenarioStatus;
  isActive?: boolean;
  terminalNetWorth?: number;
  customModifiers?: {
    returnMod?: number;
    inflationMod?: number;
    incomeEndYear?: number;
    shockYear1?: number;
  };
  lastRunId?: string;
  lastRunAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Alias for backwards compatibility
export type PlanningScenario = Scenario;

export interface ScenarioCreateInput {
  clientId?: string;
  scopeType?: Scenario['scopeType'];
  scopeId?: string;
  name: string;
  description?: string;
  scenarioType: ScenarioType;
  horizonYears?: number;
  assumptionsRefId?: string;
  status?: ScenarioStatus;
}

export const scenarioTypeLabels: Record<ScenarioType, { en: string; ru: string; uk: string }> = {
  base: { en: 'Base Case', ru: 'Базовый', uk: 'Базовий' },
  optimistic: { en: 'Optimistic', ru: 'Оптимистичный', uk: 'Оптимістичний' },
  conservative: { en: 'Conservative', ru: 'Консервативный', uk: 'Консервативний' },
  stress: { en: 'Stress Test', ru: 'Стресс-тест', uk: 'Стрес-тест' },
  custom: { en: 'Custom', ru: 'Пользовательский', uk: 'Користувацький' },
};

export const scenarioStatusLabels: Record<ScenarioStatus, { en: string; ru: string; uk: string }> = {
  active: { en: 'Active', ru: 'Активный', uk: 'Активний' },
  archived: { en: 'Archived', ru: 'Архивный', uk: 'Архівний' },
  draft: { en: 'Draft', ru: 'Черновик', uk: 'Чернетка' },
};

export const scenarioTypeColors: Record<ScenarioType, string> = {
  base: 'bg-blue-100 text-blue-800',
  optimistic: 'bg-emerald-100 text-emerald-800',
  conservative: 'bg-amber-100 text-amber-800',
  stress: 'bg-red-100 text-red-800',
  custom: 'bg-purple-100 text-purple-800',
};

// Default scenario modifiers
export const SCENARIO_MODIFIERS: Record<ScenarioType, { returnMod: number; inflationMod: number; shockYear1: number }> = {
  base: { returnMod: 0, inflationMod: 0, shockYear1: 0 },
  optimistic: { returnMod: 0.02, inflationMod: -0.005, shockYear1: 0 },
  conservative: { returnMod: -0.015, inflationMod: 0.005, shockYear1: 0 },
  stress: { returnMod: -0.04, inflationMod: 0.02, shockYear1: -0.15 },
  custom: { returnMod: 0, inflationMod: 0, shockYear1: 0 },
};

export const SCENARIO_CONFIG: Record<ScenarioType, { label: { ru: string; en: string; uk: string }; icon: string; color: string }> = {
  base: { label: { ru: 'Базовый', en: 'Base', uk: 'Базовий' }, icon: '📊', color: 'blue' },
  optimistic: { label: { ru: 'Оптимистичный', en: 'Optimistic', uk: 'Оптимістичний' }, icon: '🚀', color: 'green' },
  conservative: { label: { ru: 'Консервативный', en: 'Conservative', uk: 'Консервативний' }, icon: '🛡️', color: 'amber' },
  stress: { label: { ru: 'Стресс-тест', en: 'Stress', uk: 'Стрес-тест' }, icon: '⚠️', color: 'red' },
  custom: { label: { ru: 'Кастомный', en: 'Custom', uk: 'Кастомний' }, icon: '⚙️', color: 'purple' },
};
