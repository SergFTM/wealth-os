/**
 * Committee Template Schema
 * Шаблоны повестки, протоколов и пакетов
 */

import { CmAgendaCategory } from '../config';

export interface AgendaDefault {
  title: string;
  categoryKey: CmAgendaCategory;
  estimatedMinutes: number;
  required: boolean;
}

export interface CommitteeTemplate {
  id: string;
  clientId?: string;
  name: string;
  description?: string;
  type: 'agenda' | 'minutes' | 'pack';
  agendaDefaults: AgendaDefault[];
  minutesTemplateMd?: string;
  defaultPackTemplateId?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommitteeTemplateCreateInput {
  clientId?: string;
  name: string;
  description?: string;
  type: CommitteeTemplate['type'];
  agendaDefaults?: AgendaDefault[];
  minutesTemplateMd?: string;
  defaultPackTemplateId?: string;
  isDefault?: boolean;
}

export const DEFAULT_AGENDA_TEMPLATE: AgendaDefault[] = [
  { title: 'Утверждение повестки', categoryKey: 'other', estimatedMinutes: 5, required: true },
  { title: 'Утверждение протокола предыдущего заседания', categoryKey: 'other', estimatedMinutes: 5, required: true },
  { title: 'Обзор рынка и портфеля', categoryKey: 'allocation', estimatedMinutes: 15, required: true },
  { title: 'Анализ рисков', categoryKey: 'risk', estimatedMinutes: 10, required: true },
  { title: 'Проверка IPS соответствия', categoryKey: 'ips_waiver', estimatedMinutes: 10, required: false },
  { title: 'Предложения по ребалансировке', categoryKey: 'rebalancing', estimatedMinutes: 15, required: false },
  { title: 'Выбор/замена менеджеров', categoryKey: 'manager_selection', estimatedMinutes: 10, required: false },
  { title: 'Разное', categoryKey: 'other', estimatedMinutes: 10, required: true },
];

export const DEFAULT_MINUTES_TEMPLATE = `# Протокол заседания инвестиционного комитета

**Дата:** {{date}}
**Время:** {{time}}
**Место:** {{location}}

## Участники

{{#each attendees}}
- {{name}} ({{role}}){{#if present}} — присутствовал{{else}} — отсутствовал{{/if}}
{{/each}}

**Кворум:** {{quorumStatus}}

## Повестка дня

{{#each agendaItems}}
{{orderIndex}}. {{title}} ({{category}})
{{/each}}

## Обсуждение и решения

{{#each decisions}}
### {{title}}

**Результат:** {{result}}

{{decisionText}}

{{#if rationale}}
**Обоснование:** {{rationale}}
{{/if}}

{{#if voteResults}}
**Голосование:** За: {{voteResults.for}}, Против: {{voteResults.against}}, Воздержались: {{voteResults.abstain}}
{{/if}}

{{/each}}

## Задачи на исполнение

{{#each followUps}}
- [ ] {{title}} — {{ownerName}}, срок: {{dueDate}}
{{/each}}

## Следующее заседание

{{nextMeetingDate}}

---

*Протокол подготовлен автоматически. {{disclaimer}}*
`;

export function getDefaultAgendaTemplate(): AgendaDefault[] {
  return [...DEFAULT_AGENDA_TEMPLATE];
}

export function getDefaultMinutesTemplate(): string {
  return DEFAULT_MINUTES_TEMPLATE;
}

export function applyAgendaTemplate(template: CommitteeTemplate, meetingId: string): Array<Omit<AgendaDefault, 'required'> & { meetingId: string; orderIndex: number }> {
  return template.agendaDefaults.map((item, index) => ({
    meetingId,
    title: item.title,
    categoryKey: item.categoryKey,
    estimatedMinutes: item.estimatedMinutes,
    orderIndex: index + 1,
  }));
}
