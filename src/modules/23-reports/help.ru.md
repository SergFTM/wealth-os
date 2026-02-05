# Модуль 23: Отчеты и пакеты (Reporting Studio)

## Обзор

Студия отчетов — ключевой модуль для Family Office, позволяющий быстро собирать отчеты и комитетские пакеты из данных всех модулей системы, публиковать client-safe версии, хранить версии и вести полный аудит.

> **Важно**: Пакеты отчетов формируются на основе источников данных. Всегда проверяйте актуальность данных (as of) и источники перед распространением.

## Что такое Report Pack

Report Pack — это структурированный пакет секций отчета, который:
- Собирает данные из разных модулей системы
- Версионируется и аудируется
- Может быть опубликован для внешнего доступа
- Поддерживает client-safe режим для безопасного шаринга

### Типы пакетов

| Тип | Назначение | Типичный контент |
|-----|-----------|------------------|
| **Executive** | Для топ-менеджмента | Net Worth, Performance, Risk, Liquidity, Fees, Tasks |
| **Committee** | Для инвесткомитета | IPS breaches, risk notes, approvals, decisions log |
| **Client** | Для клиентов | Client-safe тексты, графики, таблицы, документы |
| **Compliance** | Для комплаенс | Регуляторные метрики, нарушения, проверки |
| **Custom** | Произвольный | Любые секции по выбору |

### Жизненный цикл пакета

```
Draft → Locked → Published → Archived
  ↑       │
  └───────┘ (unlock для исправлений)
```

1. **Draft** — редактирование, добавление секций
2. **Locked** — финализация, готов к экспорту/публикации
3. **Published** — создана share-ссылка, доступ извне
4. **Archived** — исторический пакет

## Секции и источники данных

Каждая секция пакета:
- Имеет **категорию** (net_worth, performance, risk, etc.)
- Может быть **auto** (данные из модуля) или **manual** (ручной ввод)
- Показывает **sources** — откуда взяты данные
- Показывает **as of** — на какую дату данные
- Может содержать **disclaimers** — предупреждения

### Режимы секций

| Режим | Описание |
|-------|----------|
| **Auto** | Данные автоматически подтягиваются из модулей |
| **Manual** | Контент вводится вручную в редакторе |

### Источники (Sources)

Для каждой auto-секции система показывает:
- Модуль-источник данных
- ID записей
- Дату актуальности (as of)
- Ссылку на первичные данные

> **Внимание**: Если секция показывает "Недостаточно данных", проверьте наличие данных в источнике или добавьте данные вручную.

## Шаблоны (Templates)

Шаблоны позволяют создать пакет в один клик с предустановленными секциями.

### Стандартные шаблоны

**1. Executive Quarterly Report**
- Cover Page
- Executive Summary
- Net Worth Overview
- Performance YTD
- Asset Allocation
- Risk Summary
- Liquidity Forecast
- Fee Summary
- Team Commentary

**2. Committee Pack**
- Cover Page
- Table of Contents
- IPS Status & Breaches
- Risk Analysis
- Concentration Report
- Recommendations
- Decisions Log
- Appendix

**3. Client Statement**
- Cover Page
- Portfolio Overview
- Performance vs Benchmark
- Holdings by Asset Class
- Transaction Summary
- Fee Disclosure
- Disclaimers

**4. Compliance Annual**
- Regulatory Summary
- AML/KYC Status
- IPS Compliance
- Risk Metrics
- Audit Trail

## Экспорт

### Форматы

| Формат | Описание |
|--------|----------|
| **PDF** | Полный отчет (placeholder в MVP) |
| **CSV** | Табличные данные секций |
| **XLSX** | Excel с форматированием |
| **JSON** | Структурированные данные |
| **Manifest** | Метаданные: секции, источники, as of |

### Manifest содержит

- Имя и тип пакета
- Версия и период
- Список секций с источниками
- Дисклеймеры
- Timestamp экспорта

## Публикация и Share Links

### Создание share-ссылки

1. Пакет должен быть **locked**
2. Все секции должны иметь sources (или override с причиной)
3. Для share требуется **client safe** пакет

### Настройки доступа

| Параметр | Описание |
|----------|----------|
| **Access Level** | view / download / full |
| **Expiry** | Срок действия (default 30 дней) |
| **Password** | Опциональная защита |
| **Allowed Emails** | Whitelist email |
| **Allowed Domains** | Whitelist доменов |
| **Allowed Roles** | client / advisor |

### Client Safe режим

В client-safe пакете:
- Скрыты внутренние заметки
- Скрыты staff-only источники
- Показаны только clientVisible секции
- Применены все disclaimers

## Дисклеймеры

### Обязательные предупреждения по категориям

| Категория | Дисклеймер |
|-----------|------------|
| **Tax** | Не является налоговой консультацией. Обратитесь к квалифицированному налоговому специалисту. |
| **Trusts** | Не является юридической консультацией. Обратитесь к квалифицированному юристу. |
| **AI** | Контент, сгенерированный AI, носит информационный характер и требует проверки человеком. |

## Типовые сценарии

### 1. Собрать investor demo pack за 1 минуту

1. Нажмите "Из шаблона"
2. Выберите "Executive Quarterly"
3. Укажите период и scope
4. Секции заполнятся автоматически
5. Проверьте и заблокируйте
6. Экспортируйте для презентации

### 2. Собрать committee pack на инвесткомитет

1. Создайте pack типа "Committee"
2. Добавьте секции: IPS Status, Risk Analysis, Recommendations
3. Добавьте Decision Log секцию
4. Внесите manual комментарии
5. Заблокируйте и распечатайте для митинга

### 3. Собрать client quarterly и опубликовать

1. Используйте шаблон "Client Statement"
2. Выберите client и период Q4 2024
3. Проверьте что все данные client-safe
4. Заблокируйте пакет
5. Нажмите "Опубликовать"
6. Укажите срок ссылки 30 дней
7. Отправьте ссылку клиенту

### 4. Добавить документы из Vault в пакет

1. Откройте секцию "Appendix"
2. Выберите "Add from Vault"
3. Найдите нужные документы
4. Они появятся как ссылки в секции
5. Источник покажет documentId

### 5. Взять narrative от AI и вставить в секцию

1. Создайте секцию типа "AI Narrative"
2. Источник автоматически подтянет последний AI draft
3. Отредактируйте если нужно
4. Секция покажет disclaimer: "AI контент требует проверки"

## RBAC — Права доступа

| Роль | Create | Edit | Lock | Export | Publish | Revoke |
|------|--------|------|------|--------|---------|--------|
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| CFO/CIO | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Operations | ✓ | ✓ | — | ✓ | с разрешения | — |
| Compliance | view | — | — | ✓ | override | ✓ |
| Advisor | view | — | — | — | — | — |
| Client | view shared | — | — | — | — | — |

## Аудит

Все операции логируются:

- `pack.created` — создание пакета
- `pack.section.added` — добавление секции
- `pack.section.removed` — удаление секции
- `pack.section.reordered` — изменение порядка
- `pack.locked` — блокировка
- `pack.unlocked` — разблокировка
- `pack.exported` — экспорт
- `pack.published` — публикация
- `share.created` — создание ссылки
- `share.viewed` — просмотр ссылки
- `share.revoked` — отзыв ссылки

Каждое событие содержит:
- action, collection, recordId
- actorRole, userId
- timestamp
- scope (clientId если релевантно)
- summary текст

## API Reference

```
GET    /api/reports/kpis               — KPI метрики
GET    /api/reports/packs              — список пакетов
POST   /api/reports/packs              — создать пакет
GET    /api/reports/packs/:id          — получить пакет
PATCH  /api/reports/packs/:id          — обновить пакет
DELETE /api/reports/packs/:id          — удалить пакет
POST   /api/reports/packs/:id/lock     — заблокировать
POST   /api/reports/packs/:id/publish  — опубликовать
POST   /api/reports/packs/:id/clone    — клонировать

GET    /api/reports/sections           — секции
POST   /api/reports/sections           — создать секцию
GET    /api/reports/sections/:id       — получить секцию
PATCH  /api/reports/sections/:id       — обновить секцию
DELETE /api/reports/sections/:id       — удалить секцию
POST   /api/reports/sections/:id/resolve — разрешить данные

GET    /api/reports/templates          — шаблоны
POST   /api/reports/templates          — создать шаблон
POST   /api/reports/templates/:id/use  — применить шаблон

GET    /api/reports/exports            — экспорты
POST   /api/reports/exports            — создать экспорт

GET    /api/reports/shares             — share-ссылки
POST   /api/reports/shares             — создать ссылку
DELETE /api/reports/shares/:id         — отозвать

GET    /api/reports/library            — библиотека секций
```

## Интеграция с модулями

| Модуль | Данные для секций |
|--------|-------------------|
| Net Worth | Unified Net Worth, Top Assets, Liabilities |
| Performance | Portfolio YTD, Benchmark Comparison |
| Risk | Breaches Summary, Top Exposures, VaR |
| Liquidity | Cash Balances, Upcoming Obligations |
| Fees | Invoices Summary, AR Aging |
| Tax | Gains Summary, Deadlines |
| Trusts | Distributions Summary |
| IPS | Constraints, Waivers, Breaches |
| AI | Latest Narrative, Draft Insights |
| Documents | Attachments, Links |

## Best Practices

1. **Используйте шаблоны** — для консистентности
2. **Проверяйте as of** — данные должны быть актуальны
3. **Добавляйте disclaimers** — где требуется
4. **Устанавливайте expiry** — для безопасности
5. **Документируйте в notes** — что изменено и почему
6. **Архивируйте регулярно** — старые пакеты

## Troubleshooting

**Секция показывает "Недостаточно данных"**
- Проверьте наличие данных в модуле-источнике
- Проверьте фильтры (период, scope)
- Переключите на manual режим если данных нет

**Не удается опубликовать**
- Пакет должен быть locked
- Все секции должны иметь sources или override
- Пакет должен быть client-safe

**Share ссылка не работает**
- Проверьте срок действия (expiry)
- Проверьте статус (не revoked)
- Проверьте права доступа (email/domain whitelist)
