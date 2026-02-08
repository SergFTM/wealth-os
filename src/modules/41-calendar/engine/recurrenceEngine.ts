/**
 * Recurrence Engine - Handle recurring events (MVP: simple weekly/monthly rules)
 */

import { CalendarEvent } from './calendarEngine';

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  byDay?: string[];  // MO, TU, WE, TH, FR, SA, SU
  byMonthDay?: number[];
  count?: number;
  until?: string;
}

export function parseRecurrenceRule(ruleStr: string): RecurrenceRule | null {
  if (!ruleStr) return null;

  const parts = ruleStr.split(';');
  const rule: Partial<RecurrenceRule> = { interval: 1 };

  for (const part of parts) {
    const [key, value] = part.split('=');
    switch (key) {
      case 'FREQ':
        rule.frequency = value.toLowerCase() as RecurrenceRule['frequency'];
        break;
      case 'INTERVAL':
        rule.interval = parseInt(value, 10);
        break;
      case 'BYDAY':
        rule.byDay = value.split(',');
        break;
      case 'BYMONTHDAY':
        rule.byMonthDay = value.split(',').map(v => parseInt(v, 10));
        break;
      case 'COUNT':
        rule.count = parseInt(value, 10);
        break;
      case 'UNTIL':
        rule.until = value;
        break;
    }
  }

  if (!rule.frequency) return null;
  return rule as RecurrenceRule;
}

export function formatRecurrenceRule(rule: RecurrenceRule): string {
  const parts: string[] = [`FREQ=${rule.frequency.toUpperCase()}`];

  if (rule.interval && rule.interval > 1) {
    parts.push(`INTERVAL=${rule.interval}`);
  }
  if (rule.byDay && rule.byDay.length > 0) {
    parts.push(`BYDAY=${rule.byDay.join(',')}`);
  }
  if (rule.byMonthDay && rule.byMonthDay.length > 0) {
    parts.push(`BYMONTHDAY=${rule.byMonthDay.join(',')}`);
  }
  if (rule.count) {
    parts.push(`COUNT=${rule.count}`);
  }
  if (rule.until) {
    parts.push(`UNTIL=${rule.until}`);
  }

  return parts.join(';');
}

export function expandRecurrence(
  event: CalendarEvent,
  rangeStart: Date,
  rangeEnd: Date,
  maxOccurrences: number = 100
): CalendarEvent[] {
  if (!event.recurrenceRule) {
    return [event];
  }

  const rule = parseRecurrenceRule(event.recurrenceRule);
  if (!rule) return [event];

  const occurrences: CalendarEvent[] = [];
  const eventStart = new Date(event.startAt);
  const eventEnd = new Date(event.endAt);
  const duration = eventEnd.getTime() - eventStart.getTime();

  let currentDate = new Date(eventStart);
  let count = 0;

  while (currentDate <= rangeEnd && count < maxOccurrences) {
    if (rule.count && count >= rule.count) break;
    if (rule.until && currentDate > new Date(rule.until)) break;

    if (currentDate >= rangeStart) {
      const occStart = new Date(currentDate);
      const occEnd = new Date(currentDate.getTime() + duration);

      occurrences.push({
        ...event,
        id: `${event.id}_${count}`,
        startAt: occStart.toISOString(),
        endAt: occEnd.toISOString(),
      });
    }

    // Advance to next occurrence
    switch (rule.frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + rule.interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (7 * rule.interval));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + rule.interval);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + rule.interval);
        break;
    }

    count++;
  }

  return occurrences;
}

export function getRecurrenceDescription(ruleStr: string, locale: string = 'ru'): string {
  const rule = parseRecurrenceRule(ruleStr);
  if (!rule) return '';

  const labels: Record<string, Record<string, string>> = {
    ru: {
      daily: 'Ежедневно',
      weekly: 'Еженедельно',
      monthly: 'Ежемесячно',
      yearly: 'Ежегодно',
    },
    en: {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
    },
  };

  const dayLabels: Record<string, Record<string, string>> = {
    ru: { MO: 'Пн', TU: 'Вт', WE: 'Ср', TH: 'Чт', FR: 'Пт', SA: 'Сб', SU: 'Вс' },
    en: { MO: 'Mon', TU: 'Tue', WE: 'Wed', TH: 'Thu', FR: 'Fri', SA: 'Sat', SU: 'Sun' },
  };

  let desc = labels[locale]?.[rule.frequency] || rule.frequency;

  if (rule.interval > 1) {
    desc = `${locale === 'ru' ? 'Каждые' : 'Every'} ${rule.interval} ${desc.toLowerCase()}`;
  }

  if (rule.byDay && rule.byDay.length > 0) {
    const days = rule.byDay.map(d => dayLabels[locale]?.[d] || d).join(', ');
    desc += ` (${days})`;
  }

  return desc;
}

export function isRecurring(event: CalendarEvent): boolean {
  return !!event.recurrenceRule;
}

export function createWeeklyRule(daysOfWeek: string[] = ['MO']): string {
  return formatRecurrenceRule({
    frequency: 'weekly',
    interval: 1,
    byDay: daysOfWeek,
  });
}

export function createMonthlyRule(dayOfMonth: number = 1): string {
  return formatRecurrenceRule({
    frequency: 'monthly',
    interval: 1,
    byMonthDay: [dayOfMonth],
  });
}
