/**
 * Committee Follow-up Schema
 * Задачи на исполнение решений
 */

export type FollowUpStatus = 'open' | 'in_progress' | 'done' | 'cancelled';

export const FOLLOWUP_STATUS_CONFIG: Record<FollowUpStatus, { label: { ru: string; en: string; uk: string }; color: string }> = {
  open: { label: { ru: 'Открыто', en: 'Open', uk: 'Відкрито' }, color: 'blue' },
  in_progress: { label: { ru: 'В работе', en: 'In Progress', uk: 'В роботі' }, color: 'amber' },
  done: { label: { ru: 'Выполнено', en: 'Done', uk: 'Виконано' }, color: 'emerald' },
  cancelled: { label: { ru: 'Отменено', en: 'Cancelled', uk: 'Скасовано' }, color: 'gray' },
};

export interface CommitteeFollowUp {
  id: string;
  clientId?: string;
  decisionId: string;
  meetingId: string;
  taskId?: string;
  title: string;
  description?: string;
  ownerUserId: string;
  ownerName?: string;
  dueAt: string;
  status: FollowUpStatus;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommitteeFollowUpCreateInput {
  clientId?: string;
  decisionId: string;
  meetingId: string;
  title: string;
  description?: string;
  ownerUserId: string;
  ownerName?: string;
  dueAt: string;
  taskId?: string;
}

export function getFollowUpStatusConfig(status: FollowUpStatus) {
  return FOLLOWUP_STATUS_CONFIG[status];
}

export function isFollowUpOverdue(followUp: CommitteeFollowUp): boolean {
  if (followUp.status === 'done' || followUp.status === 'cancelled') return false;
  return new Date(followUp.dueAt) < new Date();
}

export function getDaysUntilDue(followUp: CommitteeFollowUp): number {
  const now = new Date();
  const due = new Date(followUp.dueAt);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDueDate(dueAt: string, lang: 'ru' | 'en' | 'uk' = 'ru'): string {
  const date = new Date(dueAt);
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US';
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function countFollowUpsByStatus(followUps: CommitteeFollowUp[]): Record<FollowUpStatus, number> {
  return {
    open: followUps.filter(f => f.status === 'open').length,
    in_progress: followUps.filter(f => f.status === 'in_progress').length,
    done: followUps.filter(f => f.status === 'done').length,
    cancelled: followUps.filter(f => f.status === 'cancelled').length,
  };
}

export function getOverdueFollowUps(followUps: CommitteeFollowUp[]): CommitteeFollowUp[] {
  return followUps.filter(isFollowUpOverdue);
}
