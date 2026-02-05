/**
 * Planning Goal Schema
 * Financial goals with targets and timelines
 */

export type GoalPriority = 'critical' | 'high' | 'medium' | 'low';
export type GoalStatus = 'active' | 'paused' | 'achieved' | 'abandoned';
export type GoalCategory = 'retirement' | 'education' | 'property' | 'legacy' | 'lifestyle' | 'real_estate' | 'emergency' | 'healthcare' | 'wedding' | 'business' | 'debt_payoff' | 'philanthropy' | 'luxury' | 'other';

export interface PlanningGoal {
  id: string;
  clientId?: string;
  householdId?: string;
  scopeType?: 'global' | 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  title: string;
  name?: string; // alias for title
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  currency?: string;
  targetDate: string;
  priority: GoalPriority;
  status: GoalStatus;
  linkedScenarioId?: string;
  linkedAssetIds?: string[];
  category: GoalCategory;
  fundingRatio: number;
  fundingRatioPct?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanningGoalCreateInput {
  clientId?: string;
  scopeType?: PlanningGoal['scopeType'];
  scopeId?: string;
  name: string;
  description?: string;
  targetAmount: number;
  currency?: string;
  targetDate: string;
  priority?: GoalPriority;
  status?: GoalStatus;
  linkedScenarioId?: string;
  category?: PlanningGoal['category'];
}

export const goalPriorityLabels: Record<GoalPriority, { en: string; ru: string; uk: string }> = {
  critical: { en: 'Critical', ru: 'Критический', uk: 'Критичний' },
  high: { en: 'High', ru: 'Высокий', uk: 'Високий' },
  medium: { en: 'Medium', ru: 'Средний', uk: 'Середній' },
  low: { en: 'Low', ru: 'Низкий', uk: 'Низький' },
};

export const GOAL_PRIORITY_CONFIG: Record<GoalPriority, { label: { ru: string; en: string; uk: string }; icon: string }> = {
  critical: { label: { ru: 'Критический', en: 'Critical', uk: 'Критичний' }, icon: '🔴' },
  high: { label: { ru: 'Высокий', en: 'High', uk: 'Високий' }, icon: '🟠' },
  medium: { label: { ru: 'Средний', en: 'Medium', uk: 'Середній' }, icon: '🟡' },
  low: { label: { ru: 'Низкий', en: 'Low', uk: 'Низький' }, icon: '🟢' },
};

export const goalStatusLabels: Record<GoalStatus, { en: string; ru: string; uk: string }> = {
  active: { en: 'Active', ru: 'Активна', uk: 'Активна' },
  paused: { en: 'Paused', ru: 'Приостановлена', uk: 'Призупинена' },
  achieved: { en: 'Achieved', ru: 'Достигнута', uk: 'Досягнута' },
  abandoned: { en: 'Abandoned', ru: 'Отменена', uk: 'Скасована' },
};

export const GOAL_STATUS_CONFIG: Record<GoalStatus, { label: { ru: string; en: string; uk: string }; color: string }> = {
  active: { label: { ru: 'Активна', en: 'Active', uk: 'Активна' }, color: 'green' },
  paused: { label: { ru: 'Пауза', en: 'Paused', uk: 'Пауза' }, color: 'gray' },
  achieved: { label: { ru: 'Достигнута', en: 'Achieved', uk: 'Досягнута' }, color: 'blue' },
  abandoned: { label: { ru: 'Отменена', en: 'Abandoned', uk: 'Скасована' }, color: 'red' },
};

export const goalCategoryLabels: Record<GoalCategory, { en: string; ru: string; uk: string }> = {
  retirement: { en: 'Retirement', ru: 'Пенсия', uk: 'Пенсія' },
  education: { en: 'Education', ru: 'Образование', uk: 'Освіта' },
  property: { en: 'Property', ru: 'Недвижимость', uk: 'Нерухомість' },
  legacy: { en: 'Legacy', ru: 'Наследство', uk: 'Спадщина' },
  lifestyle: { en: 'Lifestyle', ru: 'Образ жизни', uk: 'Спосіб життя' },
  real_estate: { en: 'Real Estate', ru: 'Недвижимость', uk: 'Нерухомість' },
  emergency: { en: 'Emergency Fund', ru: 'Резервный фонд', uk: 'Резервний фонд' },
  healthcare: { en: 'Healthcare', ru: 'Здоровье', uk: 'Здоров\'я' },
  wedding: { en: 'Wedding', ru: 'Свадьба', uk: 'Весілля' },
  business: { en: 'Business', ru: 'Бизнес', uk: 'Бізнес' },
  debt_payoff: { en: 'Debt Payoff', ru: 'Погашение долга', uk: 'Погашення боргу' },
  philanthropy: { en: 'Philanthropy', ru: 'Благотворительность', uk: 'Благодійність' },
  luxury: { en: 'Luxury', ru: 'Роскошь', uk: 'Розкіш' },
  other: { en: 'Other', ru: 'Другое', uk: 'Інше' },
};

export function calculateFundingRatio(currentAmount: number, targetAmount: number): number {
  if (targetAmount <= 0) return 0;
  return Math.min(100, Math.round((currentAmount / targetAmount) * 100));
}

export function getYearsToGoal(targetDate: string): number {
  const now = new Date();
  const target = new Date(targetDate);
  const diffMs = target.getTime() - now.getTime();
  const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, years);
}

export function calculateRequiredMonthlySaving(
  targetAmount: number,
  currentAmount: number,
  yearsRemaining: number,
  annualReturn: number = 0.06
): number {
  if (yearsRemaining <= 0) return targetAmount - currentAmount;
  const months = yearsRemaining * 12;
  const monthlyRate = annualReturn / 12;

  // Future value of current amount
  const futureValueCurrent = currentAmount * Math.pow(1 + monthlyRate, months);
  const remainingNeeded = targetAmount - futureValueCurrent;

  if (remainingNeeded <= 0) return 0;

  // PMT formula for monthly savings
  if (monthlyRate === 0) return remainingNeeded / months;
  const pmt = remainingNeeded * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.max(0, pmt);
}
