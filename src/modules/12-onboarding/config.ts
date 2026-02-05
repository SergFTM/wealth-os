import { ModuleConfig } from '../types';

export const onboardingConfig: ModuleConfig = {
  id: '15',
  slug: 'onboarding',
  order: 15,
  icon: 'user-plus',
  title: {
    ru: 'Онбординг и комплаенс',
    en: 'Onboarding & Compliance',
    uk: 'Онбординг і комплаєнс',
  },
  description: {
    ru: 'Intake, KYC/KYB, AML-скрининг, риск-оценка, кейс-менеджмент и финальное согласование',
    en: 'Intake, KYC/KYB, AML screening, risk scoring, case management and final approval',
    uk: 'Intake, KYC/KYB, AML-скринінг, ризик-оцінка, кейс-менеджмент і фінальне погодження',
  },
  disclaimer: {
    ru: 'Комплаенс функции информационные, не являются юридической консультацией',
    en: 'Compliance features are informational and do not constitute legal advice',
    uk: 'Комплаєнс функції інформаційні, не є юридичною консультацією',
  },
  kpis: [
    { key: 'activeCases', title: { ru: 'Активные кейсы', en: 'Active Cases', uk: 'Активні кейси' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'newIntakes30d', title: { ru: 'Новые intake 30д', en: 'New Intakes 30d', uk: 'Нові intake 30д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'screeningPending', title: { ru: 'Скрининг ожидает', en: 'Screening Pending', uk: 'Скринінг очікує' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'highRisk', title: { ru: 'Высокий риск', en: 'High Risk', uk: 'Високий ризик' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'slaAtRisk', title: { ru: 'SLA под угрозой', en: 'SLA at Risk', uk: 'SLA під загрозою' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'missingDocs', title: { ru: 'Нет документов', en: 'Missing Docs', uk: 'Немає документів' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'pendingApproval', title: { ru: 'Ожидают согласования', en: 'Pending Approval', uk: 'Очікують погодження' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'onHold', title: { ru: 'На удержании', en: 'On Hold', uk: 'На утриманні' }, format: 'number', status: 'critical', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { ru: 'Кейс', en: 'Case', uk: 'Кейс' } },
    { key: 'caseType', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'stage', header: { ru: 'Этап', en: 'Stage', uk: 'Етап' }, type: 'badge' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'riskTier', header: { ru: 'Риск', en: 'Risk', uk: 'Ризик' }, type: 'badge' },
    { key: 'assignee', header: { ru: 'Ответственный', en: 'Assignee', uk: 'Відповідальний' } },
    { key: 'createdAt', header: { ru: 'Создан', en: 'Created', uk: 'Створено' }, type: 'date' },
  ],
  actions: [
    { key: 'createCase', label: { ru: 'Создать кейс', en: 'Create Case', uk: 'Створити кейс' }, variant: 'primary' },
    { key: 'createIntake', label: { ru: 'Создать intake', en: 'Create Intake', uk: 'Створити intake' }, variant: 'secondary' },
    { key: 'createScreening', label: { ru: 'Скрининг', en: 'Screening', uk: 'Скринінг' }, variant: 'secondary' },
    { key: 'calcRisk', label: { ru: 'Рассчитать риск', en: 'Calculate Risk', uk: 'Розрахувати ризик' }, variant: 'ghost' },
    { key: 'submitApproval', label: { ru: 'На согласование', en: 'Submit Approval', uk: 'На погодження' }, variant: 'ghost' },
    { key: 'createEvidence', label: { ru: 'Evidence pack', en: 'Evidence Pack', uk: 'Evidence pack' }, variant: 'ghost' },
  ],
};

export default onboardingConfig;
