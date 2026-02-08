# Сделки и корпоративные действия

## Назначение модуля

Модуль "Сделки и корпоративные действия" предназначен для комплексного учета корпоративных событий и сделок, влияющих на капитал семьи:

- Корпоративные действия по публичным бумагам (splits, dividends, mergers, tender offers)
- Private deals: подписки, secondary, co-invest, SPV
- События по фондам: capital call, distribution, NAV update
- Workflow согласований и документооборот
- Влияние на performance, tax lots и GL проводки

## Corporate Actions

### Типы корпоративных действий

- **Дивиденды**: cash и stock dividends
- **Сплиты**: прямые и обратные сплиты акций
- **Слияния и поглощения**: mergers, acquisitions
- **Тендерные предложения**: tender offers, buybacks
- **Спин-оффы**: spin-off, split-off
- **Выпуск прав**: rights issues

### Обработка действий

1. Создание записи о корпоративном действии
2. Автоматический расчет влияния на позиции
3. Генерация placeholder проводок для GL
4. Создание заметок о влиянии на tax lots
5. Отметка как "обработано" с фиксацией времени

### Влияние на капитал

- Корректировка количества акций (для сплитов)
- Создание записей о cash inflow (для дивидендов)
- Пересчет cost basis (для спин-оффов)
- Фиксация налоговых последствий

## Private Deals

### Типы сделок

- **Subscription**: подписка на новые выпуски фондов
- **Secondary**: покупка/продажа на вторичном рынке
- **Co-investment**: прямые co-invest сделки
- **SPV**: участие через SPV структуры
- **Direct**: прямые инвестиции в компании
- **Fund commitment**: новые commitments в фонды

### Жизненный цикл сделки

1. **Draft**: создание черновика сделки
2. **In Review**: на рассмотрении (due diligence)
3. **Approved**: утверждено (все согласования получены)
4. **Executed**: исполнено (документы подписаны)
5. **Closed**: закрыто (финансирование завершено)

### Ключевые условия (Terms)

- Management fee
- Carried interest
- Preferred return
- Lock-up period
- Redemption terms
- Legal structure
- Jurisdiction

## Fund Events

### Типы событий

- **Capital Call**: запрос на внесение капитала
- **Distribution**: распределение от фонда
- **NAV Update**: обновление стоимости
- **Recallable**: возвратная distribution
- **Equalization**: выравнивание между инвесторами

### Связь с модулем Private Capital

Fund events автоматически связываются с записями в модуле Private Capital (модуль 4):
- Capital calls создают записи в pcCapitalCalls
- Distributions создают записи в pcDistributions
- NAV updates обновляют pcValuations

### Влияние на ликвидность

Fund events автоматически создают записи в модуле Liquidity Planning (модуль 39):
- Capital call = outflow (отток средств)
- Distribution = inflow (приток средств)

## Checklists

### Назначение чеклистов

Чеклисты обеспечивают структурированный контроль над процессом:
- Стандартизация процедур
- Отслеживание прогресса
- Назначение ответственных
- Контроль сроков

### Типовые пункты чеклиста

- **Legal Review**: юридическая проверка
- **Compliance Check**: проверка соответствия
- **Tax Review**: налоговый анализ
- **Docs Complete**: все документы получены
- **Approval Obtained**: согласования получены
- **Funding Ready**: готовность к финансированию

### Автоматизация

- Генерация чеклистов из шаблонов по типу сделки
- Автоматическое создание tasks для исполнителей
- Синхронизация статуса с прогрессом сделки

## Approvals (Согласования)

### Роли согласующих

- **CIO**: Chief Investment Officer
- **CFO**: Chief Financial Officer
- **Controller**: финансовый контролер
- **Compliance**: комплаенс офицер
- **Legal**: юридический советник
- **IC**: Investment Committee
- **Tax**: налоговый советник

### Workflow согласований

1. Запрос согласования с указанием роли
2. Уведомление согласующего
3. Проверка материалов
4. Решение: утверждено / отклонено
5. Фиксация решения и комментариев

### Эскалация

- Автоматическая эскалация при просрочке
- Связь с модулем Committee (модуль 28)

## Documents

### Типы документов

- Term Sheet
- Subscription Agreement
- Side Letter
- PPM (Private Placement Memorandum)
- LPA (Limited Partnership Agreement)
- Financial Statements
- Due Diligence Reports
- Legal Opinion
- Tax Opinion
- K-1 формы
- Capital Call Notice
- Distribution Notice
- NAV Statement
- Audit Report

### Статусы документов

- **Missing**: отсутствует
- **Requested**: запрошен
- **Received**: получен
- **Under Review**: на проверке
- **Approved**: одобрен

### Интеграция с Document Vault

Все документы хранятся в модуле Document Vault (модуль 5):
- Версионирование
- Права доступа
- Audit trail

## AI-ассистент

### Возможности

- **Summarize Deal Pack**: краткое резюме пакета документов
- **Generate Checklist**: генерация чеклиста по типу сделки
- **Draft Approval Memo**: черновик memo для согласования

### Формат результатов

Все AI-результаты включают:
- Текст на русском языке
- Уровень уверенности (confidence)
- Список допущений (assumptions)
- Источники данных (sources)

## Audit Trail

Все действия фиксируются:
- Создание сделок и действий
- Изменение стадий
- Генерация и обновление чеклистов
- Запросы и решения по согласованиям
- Прикрепление документов
- Обработка corporate actions

## RBAC (Права доступа)

### CIO
- Создание и управление сделками
- Запрос согласований
- Полный доступ к данным

### CFO / Controller
- Просмотр влияния на капитал
- Просмотр GL stubs
- Утверждение финансовых аспектов

### Compliance
- Утверждение compliance пунктов
- Просмотр документов
- Проверка соответствия политикам

### Client
- Client-safe просмотр утвержденных сделок
- Ограниченный доступ к деталям

### External Advisor
- Просмотр по приглашению
- Возможность комментирования

## Интеграции

### Module 4: Private Capital
- Fund events связываются с pcFunds
- Capital calls и distributions синхронизируются

### Module 5: Document Vault
- Все документы хранятся централизованно
- Связь через documentId

### Module 11: Tax Center
- Tax impact notes создаются автоматически
- Связь через taxLotIds

### Module 28: Committee
- Решения комитета связываются с согласованиями
- Связь через committeeDecisionId

### Module 37: Exports
- Генерация deal pack exports
- Отчеты по сделкам

### Module 39: Liquidity Planning
- Fund events создают cashFlow записи
- Capital call = outflow
- Distribution = inflow

## Дисклеймер

**Важно**: Deal документы носят информационный характер. Данный модуль не является юридической или инвестиционной консультацией. Для принятия юридически значимых решений обратитесь к квалифицированным специалистам (юристам, налоговым консультантам, инвестиционным советникам).
