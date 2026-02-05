/**
 * Notification Template Schema
 * Email and notification templates
 */

export type TemplateKey =
  | 'invoice-ready'
  | 'invoice-overdue'
  | 'doc-requested'
  | 'approval-needed'
  | 'access-review-due'
  | 'report-ready'
  | 'task-assigned'
  | 'welcome';

export interface NotificationTemplate {
  id: string;
  clientId?: string;
  templateKey: TemplateKey;
  subjectRu: string;
  subjectEn: string;
  subjectUk: string;
  bodyRu: string;
  bodyEn: string;
  bodyUk: string;
  senderName: string;
  signature: string;
  isActive: boolean;
  updatedAt: string;
}

export interface NotificationTemplateCreateInput {
  clientId?: string;
  templateKey: TemplateKey;
  subjectRu: string;
  subjectEn?: string;
  subjectUk?: string;
  bodyRu: string;
  bodyEn?: string;
  bodyUk?: string;
  senderName?: string;
  signature?: string;
  isActive?: boolean;
}

export const templateKeyLabels: Record<TemplateKey, { en: string; ru: string; uk: string }> = {
  'invoice-ready': { en: 'Invoice Ready', ru: 'Счет готов', uk: 'Рахунок готовий' },
  'invoice-overdue': { en: 'Invoice Overdue', ru: 'Счет просрочен', uk: 'Рахунок прострочений' },
  'doc-requested': { en: 'Document Requested', ru: 'Запрос документа', uk: 'Запит документа' },
  'approval-needed': { en: 'Approval Needed', ru: 'Требуется одобрение', uk: 'Потрібне схвалення' },
  'access-review-due': { en: 'Access Review Due', ru: 'Ревью доступа', uk: 'Ревю доступу' },
  'report-ready': { en: 'Report Ready', ru: 'Отчет готов', uk: 'Звіт готовий' },
  'task-assigned': { en: 'Task Assigned', ru: 'Задача назначена', uk: 'Задача призначена' },
  'welcome': { en: 'Welcome', ru: 'Добро пожаловать', uk: 'Ласкаво просимо' },
};

export const ALL_TEMPLATE_KEYS: TemplateKey[] = [
  'invoice-ready',
  'invoice-overdue',
  'doc-requested',
  'approval-needed',
  'access-review-due',
  'report-ready',
  'task-assigned',
  'welcome',
];
