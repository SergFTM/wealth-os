/**
 * Cashflow Item Schema
 * Planned inflows and outflows for scenarios
 */

export type FlowType = 'inflow' | 'outflow';
export type FlowFrequency = 'monthly' | 'quarterly' | 'annual' | 'one-time';
export type FlowCategory =
  | 'income'
  | 'investment_return'
  | 'living'
  | 'education'
  | 'tax'
  | 'capex'
  | 'philanthropy'
  | 'debt'
  | 'insurance'
  | 'other';

export interface LinkedRef {
  type: 'invoice' | 'obligation' | 'transaction';
  id: string;
}

export interface CashflowItem {
  id: string;
  clientId?: string;
  householdId?: string;
  scenarioId?: string;
  title: string;
  description?: string;
  flowType: FlowType;
  amount: number;
  currency?: string;
  frequency: FlowFrequency;
  startDate: string;
  endDate?: string;
  category: FlowCategory;
  linkedRef?: LinkedRef;
  inflationAdjusted?: boolean;
  confidencePct?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CashflowItemCreateInput {
  clientId?: string;
  scenarioId: string;
  title: string;
  description?: string;
  flowType: FlowType;
  amount: number;
  currency?: string;
  frequency: FlowFrequency;
  startDate: string;
  endDate?: string;
  category: FlowCategory;
  linkedRef?: LinkedRef;
  inflationAdjusted?: boolean;
  confidencePct?: number;
  notes?: string;
}

export const flowTypeLabels: Record<FlowType, { en: string; ru: string; uk: string }> = {
  inflow: { en: 'Inflow', ru: 'Приток', uk: 'Приток' },
  outflow: { en: 'Outflow', ru: 'Отток', uk: 'Відтік' },
};

export const FLOW_TYPES: Record<FlowType, { label: { ru: string; en: string; uk: string }; icon: string }> = {
  inflow: { label: { ru: 'Поступления', en: 'Inflows', uk: 'Надходження' }, icon: '📈' },
  outflow: { label: { ru: 'Расходы', en: 'Outflows', uk: 'Витрати' }, icon: '📉' },
};

export const flowFrequencyLabels: Record<FlowFrequency, { en: string; ru: string; uk: string }> = {
  monthly: { en: 'Monthly', ru: 'Ежемесячно', uk: 'Щомісячно' },
  quarterly: { en: 'Quarterly', ru: 'Ежеквартально', uk: 'Щоквартально' },
  annual: { en: 'Annual', ru: 'Ежегодно', uk: 'Щорічно' },
  'one-time': { en: 'One-time', ru: 'Разово', uk: 'Разово' },
};

export const FREQUENCIES: Record<FlowFrequency, { label: { ru: string; en: string; uk: string } }> = {
  monthly: { label: { ru: 'Ежемесячно', en: 'Monthly', uk: 'Щомісячно' } },
  quarterly: { label: { ru: 'Ежеквартально', en: 'Quarterly', uk: 'Щоквартально' } },
  annual: { label: { ru: 'Ежегодно', en: 'Annual', uk: 'Щорічно' } },
  'one-time': { label: { ru: 'Разово', en: 'One-time', uk: 'Разово' } },
};

export const flowCategoryLabels: Record<FlowCategory, { en: string; ru: string; uk: string }> = {
  income: { en: 'Income', ru: 'Доход', uk: 'Дохід' },
  investment_return: { en: 'Investment Return', ru: 'Инвестиционный доход', uk: 'Інвестиційний дохід' },
  living: { en: 'Living Expenses', ru: 'Расходы на жизнь', uk: 'Витрати на життя' },
  education: { en: 'Education', ru: 'Образование', uk: 'Освіта' },
  tax: { en: 'Tax', ru: 'Налоги', uk: 'Податки' },
  capex: { en: 'Capital Expenditure', ru: 'Капитальные затраты', uk: 'Капітальні витрати' },
  philanthropy: { en: 'Philanthropy', ru: 'Благотворительность', uk: 'Благодійність' },
  debt: { en: 'Debt Service', ru: 'Обслуживание долга', uk: 'Обслуговування боргу' },
  insurance: { en: 'Insurance', ru: 'Страхование', uk: 'Страхування' },
  other: { en: 'Other', ru: 'Другое', uk: 'Інше' },
};

export const CASHFLOW_CATEGORIES: Record<FlowCategory, { label: { ru: string; en: string; uk: string }; icon: string }> = {
  income: { label: { ru: 'Доход', en: 'Income', uk: 'Дохід' }, icon: '💵' },
  investment_return: { label: { ru: 'Инвест. доход', en: 'Investment', uk: 'Інвест. дохід' }, icon: '📊' },
  living: { label: { ru: 'Жизнь', en: 'Living', uk: 'Життя' }, icon: '🏠' },
  education: { label: { ru: 'Образование', en: 'Education', uk: 'Освіта' }, icon: '🎓' },
  tax: { label: { ru: 'Налоги', en: 'Tax', uk: 'Податки' }, icon: '🏛️' },
  capex: { label: { ru: 'Капзатраты', en: 'CapEx', uk: 'Капвитрати' }, icon: '🔧' },
  philanthropy: { label: { ru: 'Благотворительность', en: 'Philanthropy', uk: 'Благодійність' }, icon: '❤️' },
  debt: { label: { ru: 'Долг', en: 'Debt', uk: 'Борг' }, icon: '💳' },
  insurance: { label: { ru: 'Страхование', en: 'Insurance', uk: 'Страхування' }, icon: '🛡️' },
  other: { label: { ru: 'Другое', en: 'Other', uk: 'Інше' }, icon: '📦' },
};

export function getAnnualAmount(item: CashflowItem): number {
  switch (item.frequency) {
    case 'monthly': return item.amount * 12;
    case 'quarterly': return item.amount * 4;
    case 'annual': return item.amount;
    case 'one-time': return item.amount;
  }
}
