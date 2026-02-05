/**
 * Webhook Schema
 * Webhook subscription for events
 */

export type WebhookStatus = 'active' | 'paused' | 'deleted';

export type EventType =
  | 'invoice.paid'
  | 'invoice.created'
  | 'invoice.overdue'
  | 'approval.approved'
  | 'approval.rejected'
  | 'approval.pending'
  | 'document.uploaded'
  | 'document.shared'
  | 'document.deleted'
  | 'sync.completed'
  | 'sync.failed'
  | 'risk.breach'
  | 'risk.alert'
  | 'task.created'
  | 'task.completed'
  | 'networth.updated'
  | 'performance.calculated';

export interface Webhook {
  id: string;
  clientId?: string;
  name: string;
  targetUrl: string;
  targetUrlMasked: string;
  eventTypes: EventType[];
  scopeType: 'global' | 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  status: WebhookStatus;
  signingSecretHash?: string;
  headers?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  lastDeliveryAt?: string;
  failRate7d?: number;
  createdBy: string;
}

export interface WebhookCreateInput {
  name: string;
  targetUrl: string;
  eventTypes: EventType[];
  scopeType: 'global' | 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  clientId?: string;
  headers?: Record<string, string>;
}

export interface WebhookUpdateInput {
  name?: string;
  targetUrl?: string;
  eventTypes?: EventType[];
  scopeType?: 'global' | 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  status?: WebhookStatus;
  headers?: Record<string, string>;
}

export const eventTypeLabels: Record<EventType, { en: string; ru: string; uk: string }> = {
  'invoice.paid': { en: 'Invoice Paid', ru: 'Счет оплачен', uk: 'Рахунок оплачено' },
  'invoice.created': { en: 'Invoice Created', ru: 'Счет создан', uk: 'Рахунок створено' },
  'invoice.overdue': { en: 'Invoice Overdue', ru: 'Счет просрочен', uk: 'Рахунок прострочено' },
  'approval.approved': { en: 'Approval Approved', ru: 'Утверждено', uk: 'Затверджено' },
  'approval.rejected': { en: 'Approval Rejected', ru: 'Отклонено', uk: 'Відхилено' },
  'approval.pending': { en: 'Approval Pending', ru: 'Ожидает утверждения', uk: 'Очікує затвердження' },
  'document.uploaded': { en: 'Document Uploaded', ru: 'Документ загружен', uk: 'Документ завантажено' },
  'document.shared': { en: 'Document Shared', ru: 'Документ передан', uk: 'Документ передано' },
  'document.deleted': { en: 'Document Deleted', ru: 'Документ удален', uk: 'Документ видалено' },
  'sync.completed': { en: 'Sync Completed', ru: 'Синхронизация завершена', uk: 'Синхронізація завершена' },
  'sync.failed': { en: 'Sync Failed', ru: 'Ошибка синхронизации', uk: 'Помилка синхронізації' },
  'risk.breach': { en: 'Risk Breach', ru: 'Нарушение риска', uk: 'Порушення ризику' },
  'risk.alert': { en: 'Risk Alert', ru: 'Предупреждение риска', uk: 'Попередження ризику' },
  'task.created': { en: 'Task Created', ru: 'Задача создана', uk: 'Завдання створено' },
  'task.completed': { en: 'Task Completed', ru: 'Задача выполнена', uk: 'Завдання виконано' },
  'networth.updated': { en: 'Net Worth Updated', ru: 'Состояние обновлено', uk: 'Стан оновлено' },
  'performance.calculated': { en: 'Performance Calculated', ru: 'Доходность рассчитана', uk: 'Дохідність розрахована' },
};

export const webhookStatusLabels: Record<WebhookStatus, { en: string; ru: string; uk: string }> = {
  active: { en: 'Active', ru: 'Активен', uk: 'Активний' },
  paused: { en: 'Paused', ru: 'Приостановлен', uk: 'Призупинено' },
  deleted: { en: 'Deleted', ru: 'Удален', uk: 'Видалено' },
};
