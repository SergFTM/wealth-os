import { ModuleConfig } from '../types';

export const aiConfig: ModuleConfig = {
  id: '20',
  slug: 'ai',
  order: 20,
  icon: 'sparkles',
  title: { ru: 'AI Copilot', en: 'AI Copilot', uk: 'AI Copilot' },
  description: {
    ru: 'AI слой платформы: Copilot, narratives, drafts, triage, feedback',
    en: 'Platform AI layer: Copilot, narratives, drafts, triage, feedback',
    uk: 'AI шар платформи: Copilot, narratives, drafts, triage, feedback',
  },
  disclaimer: {
    ru: 'AI выводы информационные и требуют проверки человеком',
    en: 'AI outputs are informational and require human verification',
    uk: 'AI висновки інформаційні і потребують перевірки людиною',
  },
  kpis: [
    { key: 'aiEventsToday', title: { ru: 'AI events сегодня', en: 'AI Events Today', uk: 'AI events сьогодні' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'narratives7d', title: { ru: 'Narratives 7д', en: 'Narratives 7d', uk: 'Narratives 7д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'draftsPending', title: { ru: 'Drafts на ревью', en: 'Drafts Pending', uk: 'Drafts на ревью' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'triageOpen', title: { ru: 'Triage открыто', en: 'Triage Open', uk: 'Triage відкрито' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'feedbackNegative', title: { ru: 'Негативный feedback', en: 'Negative Feedback', uk: 'Негативний feedback' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'clientSafeCount', title: { ru: 'Client-safe', en: 'Client-safe', uk: 'Client-safe' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'missingSources', title: { ru: 'Без источников', en: 'Missing Sources', uk: 'Без джерел' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'guardrailBlocks', title: { ru: 'Guardrail blocks', en: 'Guardrail Blocks', uk: 'Guardrail blocks' }, format: 'number', status: 'critical', linkToList: true },
  ],
  columns: [
    { key: 'promptType', header: { ru: 'Тип', en: 'Type', uk: 'Тип' }, type: 'badge' },
    { key: 'title', header: { ru: 'Тема', en: 'Subject', uk: 'Тема' } },
    { key: 'confidence', header: { ru: 'Уверенность', en: 'Confidence', uk: 'Впевненість' } },
    { key: 'sourcesCount', header: { ru: 'Источники', en: 'Sources', uk: 'Джерела' } },
    { key: 'clientSafe', header: { ru: 'Client-safe', en: 'Client-safe', uk: 'Client-safe' }, type: 'badge' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'createdAt', header: { ru: 'Создано', en: 'Created', uk: 'Створено' }, type: 'date' },
  ],
  actions: [
    { key: 'askCopilot', label: { ru: 'Спросить Copilot', en: 'Ask Copilot', uk: 'Запитати Copilot' }, variant: 'primary' },
    { key: 'createNarrative', label: { ru: 'Создать narrative', en: 'Create Narrative', uk: 'Створити narrative' }, variant: 'secondary' },
    { key: 'createDraft', label: { ru: 'Создать draft', en: 'Create Draft', uk: 'Створити draft' }, variant: 'secondary' },
    { key: 'runTriage', label: { ru: 'Запустить triage', en: 'Run Triage', uk: 'Запустити triage' }, variant: 'ghost' },
    { key: 'viewAudit', label: { ru: 'Audit trail', en: 'Audit Trail', uk: 'Audit trail' }, variant: 'ghost' },
    { key: 'exportData', label: { ru: 'Экспорт', en: 'Export', uk: 'Експорт' }, variant: 'ghost' },
  ],
};
