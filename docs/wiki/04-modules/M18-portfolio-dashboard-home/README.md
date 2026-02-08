# M18 Portfolio Dashboard and Home

## 1. Назначение модуля
Главная страница платформы с агрегированным обзором.
- Основной пользователь: все роли
- KPI overview, saved views, quick actions, drill-down
- Результат: персонализированный dashboard

**Value outcomes:**
- Personalized home screen with role-based widgets
- Saved views and custom layouts
- Quick drill-down to any module

---

## 2. Границы MVP
### Включено в MVP
- [ ] Dashboard с KPI strip
- [ ] List с фильтрами и сортировкой
- [ ] Detail view с вкладками
- [ ] CRUD через Collections API
- [ ] Audit trail (auditEvents)
- [ ] RBAC scope ограничения

### Не включено в MVP
- [ ] Real-time push notifications
- [ ] Advanced analytics / ML
- [ ] External API integrations (beyond mock)
- [ ] Mobile-specific UI

---

## 3. Пользователи и роли
| Роль | Права | Ограничения client-safe |
|---|---|---|
| Owner/Admin | Полный доступ | — |
| CIO | Чтение + аналитика | Скрыты внутренние комментарии |
| CFO/Controller | Чтение + финансовые операции | Скрыты персональные данные |
| Operations | CRUD в рамках scope | Скрыты стратегические данные |
| Compliance | Чтение + audit + reviews | Скрыты коммерческие данные |
| RM | Чтение + клиентские данные | Скрыты внутренние операции |
| External Advisor | Только опубликованные данные | client-safe фильтрация |
| Client (Portal) | Только свои данные | Полная client-safe фильтрация |

---

## 4. Экранная модель
### Маршруты
- `/m/dashboard-home`

### Экран: Dashboard
**Блоки:**
- KPI strip: 6–10 метрик
- Preview tables: 2–3 таблицы
- Alerts panel: уведомления и предупреждения
- AI panel: explain / summarize
- Actions bar: основные действия

**Клики:**
- KPI → list с предустановленным фильтром
- Preview row → detail page
- Actions → modal / wizard

### Экран: List
**Фильтры:**
- Status
- Period (daterange)
- Search (полнотекстовый)
- Scope switcher (household / entity / portfolio)

**Таблица:**
- Колонки с сортировкой, sticky header
- Row actions: Open, Edit, Archive
- Bulk actions (если применимо)

### Экран: Detail
**Вкладки:**
- Overview — summary cards, key metrics
- Data — полные данные, editable fields
- Documents — прикреплённые файлы
- Activity — timeline событий
- Audit — history changes

---

## 5. Данные и сущности
### Коллекции FileDB (локальный MVP)
- `savedViews`
- `quickActions`
- `userNotificationPrefs`
- `auditEvents` (обязательно)

### Сущности (логическая модель)
**SavedView**
- Поля: id, userId, name, module, filters, columns, sortBy, isDefault
- Связи: через objectRef / foreignKey

**QuickAction**
- Поля: id, label, module, route, icon, roles[]
- Связи: через objectRef / foreignKey

### Source and As-of
- Все финансовые поля должны иметь `asOf` timestamp
- `sourceRef` указывает на источник данных (connector, manual, calculation)
- Правила source-first: внешний источник имеет приоритет над ручным вводом

---

## 6. CRUD и Actions
### Collections API (универсальный контракт)
- `GET /api/collections/<collection>` — список записей
- `GET /api/collections/<collection>/{id}` — одна запись
- `POST /api/collections/<collection>` — создание
- `PUT /api/collections/<collection>/{id}` — обновление
- `DELETE /api/collections/<collection>/{id}` — удаление

### Actions API (процедурные операции)
- `POST /api/actions/m18/<actionKey>`
  - Вход: payload JSON
  - Выход: `{ ok, result, linkedObjects, warnings, auditEventId }`

**Список actions в модуле:**
- `refresh`: Обновить данные из источников
- `export`: Экспортировать в PDF/Excel
- `archive`: Архивировать запись

---

## 7. Workflow и Approvals
- Триггеры: создание/изменение ключевых сущностей
- Статусы: draft → pending_review → approved → published
- Правила: «Human in the loop» для критичных решений
- Уведомления: email + in-app при смене статуса

---

## 8. Документы и Evidence
- Прикрепление документов через `documentRef`
- Версионирование: автоматическое при перезаливке
- Client-safe: публикация через M45 Client Safe Publishing
- Audit: логирование всех операций с документами

---

## 9. RBAC и client-safe правила
### RBAC
- Scope: household → entity → portfolio → account
- Каждая коллекция привязана к scope через `scopeRef`
- Роли определяют допустимые операции (read / write / delete / approve)

### Client-safe
- Скрытие внутренних полей: `internalNotes`, `costBasis`, `marginNotes`
- Snapshot публикации: point-in-time данные
- External advisor: ограниченный набор полей

---

## 10. Audit trail
**События, которые обязаны писаться в auditEvents:**
- create / update / delete ключевых сущностей
- approval decisions (approve / reject / escalate)
- publish / share / revoke
- downloads / views для shares и portal

Формат:
- `objectRef`: ссылка на объект (collection/id)
- `action`: тип действия
- `actor`: userId
- `before / after`: diff данных
- `timestamp`: ISO 8601

---

## 11. AI Copilot в модуле
### Режимы
- **Explain**: объяснить показатель или изменение
- **Draft**: подготовить текст, запрос, письмо
- **Summarize**: резюмировать данные, треды, документы
- **Triage**: предложить приоритеты задач и исключений

### Обязательные требования к ответу AI
- RU по умолчанию (переключаемый язык)
- `sources[]` — ссылки на объекты (objectRef)
- `asOf` — дата актуальности данных
- `confidence` — уровень уверенности (high / medium / low)
- `assumptions[]` — допущения
- Guardrails: если sources нет → «Недостаточно данных»
- Client-safe enforcement: AI не раскрывает скрытые поля

---

## 12. Дисклеймеры
- Данные носят информационный характер
- Не является финансовой / налоговой / юридической консультацией
- AI-выводы требуют проверки человеком
- Актуальность данных определяется полем `asOf`

---

## 13. Demo Data
### Seed данные
- Файл: `src/db/seed/seed-module-18.json`
- Коллекции: `savedViews`, `quickActions`, `userNotificationPrefs`
- Связи: cross-references через id

### Demo сценарии
- Типовой workflow от создания до завершения
- Edge cases: просроченные, отклонённые, escalated
- Мульти-entity данные для демонстрации scope

---

## 14. Критерии приёмки
- [ ] Dashboard открывается, KPI кликаются
- [ ] List фильтруется и сортируется
- [ ] Detail открывается, вкладки работают
- [ ] Create / Edit сохраняет и пишет audit
- [ ] Actions выполняются и пишут audit
- [ ] RBAC ограничивает данные по scope
- [ ] Client-safe скрывает внутренние поля
- [ ] i18n: RU / EN / UK для ключей
- [ ] AI панель отвечает с sources и asOf

---

## 15. Ошибки и обработка исключений
- Ошибки валидации → inline сообщение
- Ошибки sync → exception в M48 Exception Center
- Ошибки бизнес-логики → уведомление + audit event
- Network errors → retry с exponential backoff

---

## 16. Ссылки на связанные модули
- **Sources:** All modules (KPIs)
- **Consumers:** —
- **Governance:** M17 Security (RBAC)
