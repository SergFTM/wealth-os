# Document Vault — Хранилище документов

## Что это?

Document Vault — централизованное хранилище всех документов семейного офиса с контролем версий, аудитом и безопасным шарингом.

## Основные возможности

### Загрузка и хранение
- Drag & drop загрузка PDF, изображений, Word
- Автоматическое присвоение метаданных
- Уникальные имена файлов для безопасности

### Теги и категории
- **Категории**: invoice, statement, agreement, quarterly_report, kyc, tax, misc
- Гибкая система тегов для быстрого поиска
- Фильтрация по клиенту, периоду, типу

### Привязка к объектам
Документы связываются с:
- Транзакциями (Bill Pay, GL)
- Фондами и valuations (Private Capital)
- Партнерствами и cap tables
- KYC кейсами (Onboarding)
- Отчетами (Reporting)

### Версионирование
- Загрузка новых версий без потери истории
- Просмотр любой версии
- Установка текущей версии

### Доступы (RBAC)
| Роль | Read | Add | Delete | Share |
|------|------|-----|--------|-------|
| Owner/Admin | ✓ | ✓ | ✓ | ✓ |
| CFO | ✓ | ✓ | — | ✓ |
| Operations | ✓ | ✓ | — | — |
| Compliance | ✓ | — | — | — |
| External Advisor | только shares | — | — | — |

### Client-Safe режим
- Документы с confidentiality=client_safe видимы клиентам
- Скрытие внутренних описаний и связей

### Evidence Packs
Пакеты доказательств для аудита:
1. Создайте пакет с именем и периодом
2. Добавьте документы вручную или по правилу
3. Заблокируйте пакет (locked)
4. Поделитесь с аудитором

### Безопасный шаринг
- Ссылки с ограниченным сроком действия
- Audience: client или advisor
- Отзыв доступа в любой момент
- Watermark (placeholder для MVP)

## Типовые сценарии

### 1. Загрузить инвойс и привязать к bill
1. Перетащите PDF в зону загрузки
2. Выберите категорию "invoice"
3. В панели связей нажмите "Добавить связь"
4. Выберите Bill Pay → конкретный bill

### 2. Прикрепить quarterly report к valuation
1. Откройте документ отчета
2. Перейдите на вкладку "Связи"
3. Добавьте связь типа "valuation"
4. Выберите valuation из Private Capital

### 3. Поделиться документом с external advisor
1. Откройте документ
2. Перейдите на вкладку "Шаринг"
3. Нажмите "Создать ссылку"
4. Выберите audience=advisor, срок действия
5. Скопируйте ссылку и отправьте advisor

### 4. Собрать evidence pack для аудита
1. Нажмите "Создать пакет" на dashboard
2. Укажите имя, период, цель
3. Добавьте документы из списка
4. Заблокируйте пакет
5. Создайте share link для аудитора

## Аудит

Все действия логируются:
- `document_uploaded` — загрузка
- `document_opened` — просмотр
- `document_downloaded` — скачивание
- `document_meta_updated` — изменение метаданных
- `link_added` / `link_removed` — связи
- `version_uploaded` — новая версия
- `share_created` / `share_revoked` — шаринг
- `pack_created` / `pack_locked` — пакеты

## Интеграции

| Модуль | Тип связи |
|--------|-----------|
| Bill Pay | bills, payments, check runs |
| General Ledger | journal entries, transactions |
| Private Capital | funds, calls, distributions, valuations |
| Partnerships | agreements, cap tables |
| Onboarding | KYC case evidence |
| Reporting | report pack attachments |
