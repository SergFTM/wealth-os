# Онбординг и комплаенс (KYC/KYB/AML)

## Что такое онбординг MFO?
Онбординг — структурированный процесс приёма нового клиента (Household, Entity, Trust, Advisor) в MFO. Включает:
- **Intake** — сбор анкетных данных
- **KYC/KYB** — верификация личности и бизнеса
- **AML-скрининг** — проверка санкционных списков, PEP, adverse media
- **Риск-оценка** — расчёт уровня риска (low/medium/high)
- **Финальное согласование** — approve/reject с audit trail

## Кейс
Каждый онбординг — это **кейс** с единой карточкой:
- **Тип**: Household, Entity, Trust, External Advisor
- **Этап** (Stage): Intake → Docs → Screening → Risk → Review
- **Статус**: Active, On Hold, Ready for Approval, Approved, Rejected
- **SLA**: срок завершения, отслеживание просрочки
- **Ответственный**: Compliance Officer или Operations

## Intake анкеты
Для каждого типа — свой набор шагов wizard:
1. Basic Info (ФИО, контакты, тип)
2. Addresses and Residency
3. Tax Residency
4. Source of Wealth (SOW)
5. Source of Funds (SOF)
6. Consents and Declarations

Можно отправить клиенту для заполнения (client portal).

## Beneficial Owners (BO/EBO)
Дерево бенефициарного владения:
- Имя, тип (person/entity), доля, контроль
- Multi-level: entity может владеть entity
- Документы: паспорт, учредительные

## Screening (MVP Placeholder)
Проверки по трём направлениям:
- **Санкции** — OFAC, EU, UN
- **PEP** — Politically Exposed Person
- **Adverse Media** — негативные публикации

Статусы: Pending → Clear / Match / Needs Info

## Risk Score
Итоговый уровень риска (0–100):
- **Low** (0–30): стандартный клиент
- **Medium** (31–60): повышенный контроль
- **High** (61–100): усиленная проверка

Факторы (drivers):
- Country risk
- PEP status
- Complex structure
- SOF/SOW concerns
- Adverse media hits

## Evidence Pack
Сбор документов по кейсу:
- Passport/ID
- Proof of address
- Incorporation docs (KYB)
- Trust deed
- W-9/W-8

Статус каждого: Missing / Uploaded / Verified.
Можно собрать в evidence pack и поделиться client-safe.

## Финальное Approval
- Запрос на согласование
- Approvers: Compliance Officer + Owner/Admin
- Approve → кейс approved, entity активирован
- Reject → требует комментарий

## Audit
Полный audit trail: создание кейса, шаги intake, загрузка документов, скрининг, риск, approval.

## Типовые сценарии
- Создать кейс household и отправить intake клиенту
- Загрузить документы и привязать к кейсу
- Выполнить screening и поставить статус
- Рассчитать риск и отправить на approval
- Собрать evidence pack для аудита

## Дисклеймер
Комплаенс функции информационные, не являются юридической консультацией.
