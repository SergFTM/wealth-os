# Relationship Hub — Модуль 53

## Обзор

Relationship Hub — это CRM-слой для Multi-Family Office, обеспечивающий управление отношениями с клиентами, их семьями, доверенными лицами и контрагентами.

## Ключевые возможности

### People 360 View
- Единая карточка человека на базе MDM (модуль 46)
- Семья, trustees, advisors, vendors в одном месте
- История взаимодействий и связей

### Relationship Map
- Визуализация связей между людьми и сущностями
- Роли, доверенности, контактные данные
- Связи с ownership graph (модуль 47)

### Interaction Log
- Встречи, звонки, сообщения, заметки
- Follow-up с напоминаниями
- Интеграция с communications (модуль 15)

### Initiatives Pipeline
- Идеи → Анализ → В работе → Завершено
- Связь с cases (модуль 36) и tasks (модуль 7)
- Критерии успеха и сроки

### Service Coverage
- Назначение Relationship Managers
- Primary и Backup RM
- Specialists (CIO, CFO, Compliance, Tax, Legal)
- SLA и client tiering (A, B, C)

### VIP Cockpit
- Карточка VIP домохозяйства
- Open items, upcoming meetings
- Approvals pending, alerts
- Quick actions

### Client-Safe Publishing
- Публикация безопасной версии карточки в Client Portal
- Скрытие внутренних заметок
- Интеграция с модулем 45

## AI-помощник

- **Сводка истории** — анализ взаимодействий и инициатив
- **Черновик письма** — генерация follow-up сообщения
- **Следующий шаг** — рекомендации по действиям

> ⚠️ Рекомендации AI носят информационный характер и требуют проверки человеком

## Роли и доступ

| Роль | Права |
|------|-------|
| Relationship Manager | Создание взаимодействий, инициатив, управление своими клиентами |
| Admin | Полный доступ |
| CIO/CFO | Просмотр и комментарии |
| Compliance | Просмотр связей и документов |
| Client | Только client-safe карточки в портале |
| External Advisor | Ограниченный доступ по согласию |

## Коллекции данных

- `relHouseholds` — домохозяйства
- `relRelationships` — связи между сущностями
- `relInteractions` — лог взаимодействий
- `relInitiatives` — инициативы и pipeline
- `relCoverage` — покрытие RM
- `relVipViews` — VIP снимки

## Типы связей

- **Family** — семейные отношения
- **Role** — роль в структуре
- **Authority** — доверенность
- **Vendor Contact** — контакт вендора
- **Ownership Link** — связь владения

## Типы взаимодействий

- **Meeting** — встреча
- **Call** — звонок
- **Message** — сообщение (без email в MVP)
- **Note** — внутренняя заметка

## Stages инициатив

1. **Idea** — первоначальная идея
2. **In Analysis** — анализ и проработка
3. **In Progress** — выполнение
4. **Done** — завершено

## Audit Events

Все изменения логируются:
- Создание/редактирование взаимодействий
- Создание/обновление связей с документами
- Изменение стадии инициативы
- Назначение coverage
- Публикация client-safe карточки
- Создание связанных cases/tasks

## Навигация

- `/m/relationships` — Dashboard
- `/m/relationships/list` — Списки с вкладками
- `/m/relationships/person/[id]` — Карточка человека
- `/m/relationships/household/[id]` — Карточка домохозяйства
- `/m/relationships/relationship/[id]` — Детали связи
- `/m/relationships/interaction/[id]` — Детали взаимодействия
- `/m/relationships/initiative/[id]` — Детали инициативы
