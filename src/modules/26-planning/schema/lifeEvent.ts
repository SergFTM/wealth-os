/**
 * Life Event Schema
 * Major life events that affect financial planning
 */

export type LifeEventCategory =
  | 'education'
  | 'property'
  | 'marriage'
  | 'birth'
  | 'retirement'
  | 'philanthropy'
  | 'debt_payoff'
  | 'inheritance'
  | 'business'
  | 'health'
  | 'other';

export interface LifeEvent {
  id: string;
  clientId?: string;
  householdId?: string;
  scopeType?: 'global' | 'household' | 'entity';
  scopeId?: string;
  title: string;
  description?: string;
  eventDate: string;
  category: LifeEventCategory;
  estimatedAmount?: number;
  estimatedImpact?: number;
  currency?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'annual' | 'one-time';
  linkedCashflowId?: string;
  linkedGoalId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LifeEventCreateInput {
  clientId?: string;
  scopeType?: LifeEvent['scopeType'];
  scopeId?: string;
  title: string;
  description?: string;
  eventDate: string;
  category: LifeEventCategory;
  estimatedAmount?: number;
  currency?: string;
  isRecurring?: boolean;
  recurringFrequency?: LifeEvent['recurringFrequency'];
  notes?: string;
}

export const lifeEventCategoryLabels: Record<LifeEventCategory, { en: string; ru: string; uk: string }> = {
  education: { en: 'Education', ru: 'Образование', uk: 'Освіта' },
  property: { en: 'Property Purchase', ru: 'Покупка недвижимости', uk: 'Купівля нерухомості' },
  marriage: { en: 'Marriage', ru: 'Свадьба', uk: 'Весілля' },
  birth: { en: 'Birth/Adoption', ru: 'Рождение/Усыновление', uk: 'Народження/Усиновлення' },
  retirement: { en: 'Retirement', ru: 'Выход на пенсию', uk: 'Вихід на пенсію' },
  philanthropy: { en: 'Philanthropy', ru: 'Благотворительность', uk: 'Благодійність' },
  debt_payoff: { en: 'Debt Payoff', ru: 'Погашение долга', uk: 'Погашення боргу' },
  inheritance: { en: 'Inheritance', ru: 'Наследство', uk: 'Спадщина' },
  business: { en: 'Business Event', ru: 'Бизнес событие', uk: 'Бізнес подія' },
  health: { en: 'Health', ru: 'Здоровье', uk: 'Здоров\'я' },
  other: { en: 'Other', ru: 'Другое', uk: 'Інше' },
};

export const lifeEventCategoryIcons: Record<LifeEventCategory, string> = {
  education: '🎓',
  property: '🏠',
  marriage: '💍',
  birth: '👶',
  retirement: '🏖️',
  philanthropy: '❤️',
  debt_payoff: '💳',
  inheritance: '📜',
  business: '💼',
  health: '🏥',
  other: '📌',
};

export const LIFE_EVENT_CATEGORIES: Record<LifeEventCategory, { label: { ru: string; en: string; uk: string }; icon: string }> = {
  education: { label: { ru: 'Образование', en: 'Education', uk: 'Освіта' }, icon: '🎓' },
  property: { label: { ru: 'Недвижимость', en: 'Property', uk: 'Нерухомість' }, icon: '🏠' },
  marriage: { label: { ru: 'Свадьба', en: 'Marriage', uk: 'Весілля' }, icon: '💍' },
  birth: { label: { ru: 'Рождение', en: 'Birth', uk: 'Народження' }, icon: '👶' },
  retirement: { label: { ru: 'Пенсия', en: 'Retirement', uk: 'Пенсія' }, icon: '🏖️' },
  philanthropy: { label: { ru: 'Благотворительность', en: 'Philanthropy', uk: 'Благодійність' }, icon: '❤️' },
  debt_payoff: { label: { ru: 'Погашение долга', en: 'Debt Payoff', uk: 'Погашення боргу' }, icon: '💳' },
  inheritance: { label: { ru: 'Наследство', en: 'Inheritance', uk: 'Спадщина' }, icon: '📜' },
  business: { label: { ru: 'Бизнес', en: 'Business', uk: 'Бізнес' }, icon: '💼' },
  health: { label: { ru: 'Здоровье', en: 'Health', uk: 'Здоров\'я' }, icon: '🏥' },
  other: { label: { ru: 'Другое', en: 'Other', uk: 'Інше' }, icon: '📌' },
};
