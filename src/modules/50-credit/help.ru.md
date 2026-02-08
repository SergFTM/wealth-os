# Banking и Credit Management

Модуль управления банковскими отношениями, кредитными линиями, займами и ковенантами.

## Иерархия данных

```
Банк (Bank)
  └── Facility (Кредитная линия)
        └── Loan (Займ)
              ├── Collateral (Залог)
              ├── Covenants (Ковенанты)
              ├── Payments (Платежи)
              └── Schedule (График)
```

## Основные сущности

### Банки (Banks)
Финансовые учреждения, с которыми установлены кредитные отношения:
- Контакты relationship manager
- Регион присутствия
- Связанные facilities

### Facilities (Кредитные линии)
Типы facilities:
- **Revolver** — возобновляемая кредитная линия
- **Term** — срочный кредит
- **Margin** — маржинальное кредитование
- **Lombard** — ломбардный кредит под ценные бумаги
- **Bridge** — бридж-финансирование
- **Construction** — строительное финансирование

Ключевые параметры:
- Limit (лимит)
- Drawn (выбрано)
- Available (доступно)
- Maturity (дата погашения)
- Commitment fee (комиссия за неиспользование)

### Loans (Займы)
Конкретные drawdown под facility:
- Principal (основная сумма)
- Rate type: Fixed / Floating
- Base rate: SOFR, EURIBOR, SONIA, Prime
- Spread (маржа)
- Amortization: Interest-only, Amortizing, Bullet

### Collateral (Залог)
Обеспечение займов:
- Cash (денежные средства)
- Securities (ценные бумаги)
- Real Estate (недвижимость)
- Equipment, Inventory, Receivables

Ключевые метрики:
- Current Value (текущая стоимость)
- Haircut (дисконт)
- Pledged Value (залоговая стоимость)
- LTV (Loan-to-Value)

### Covenants (Ковенанты)
Финансовые обязательства заёмщика:
- Min Liquidity — минимальная ликвидность
- Max LTV — максимальный LTV
- Min Net Worth — минимальная чистая стоимость
- Max Leverage — максимальный leverage
- DSCR — коэффициент покрытия долга

Статусы:
- **OK** — в пределах нормы
- **At Risk** — близко к порогу (buffer zone)
- **Breach** — нарушение

### Payments (Платежи)
График платежей по займам:
- Principal (основной долг)
- Interest (проценты)
- Due date (дата платежа)
- Status: Scheduled, Paid, Late

## LTV мониторинг

LTV = Loan Outstanding / Pledged Collateral Value

При превышении target LTV:
1. Статус collateral → At Risk / Breach
2. Создается Exception в модуле 48
3. Отправляется Notification
4. Требуется margin call или дополнительный залог

## Covenant тестирование

1. Расчёт текущего значения из источников:
   - Liquidity (модуль 39) для cash covenants
   - Net Worth из модуля 2
   - Collateral LTV
2. Сравнение с threshold
3. Обновление статуса
4. При breach:
   - Создание Exception
   - Workflow для waiver request
   - Уведомление банка

## График платежей

Автоматическая генерация amortization schedule:
- Interest-only: только проценты, principal в конце
- Amortizing: равномерное погашение principal
- Bullet: весь principal в конце

## Refinancing календарь

Автоматические напоминания:
- Maturity dates
- Covenant test dates
- Payment due dates
- Refinancing deadlines (180 дней до maturity)

Интеграция с Calendar (модуль 41).

## Интеграции

- **Liquidity (39)**: cash forecast учитывает scheduled payments
- **Calendar (41)**: refi dates, covenant tests, payments
- **Deals (42)**: refinancing transactions
- **Vendors (43)**: банки как vendors (опционально)
- **Exceptions (48)**: covenant breaches, LTV breaches
- **GL (6)**: payment stubs для бухгалтерии
- **Notifications (35)**: payment reminders

## AI Assist

- **Explain Interest Cost**: анализ процентных расходов
- **Covenant Risk Memo**: оценка ковенантных рисков
- **Refinancing Checklist**: план рефинансирования

## RBAC

| Роль | Права |
|------|-------|
| CFO/Controller | Полный доступ, создание loans, payments, GL stubs |
| CIO | Просмотр exposures, covenants |
| Ops | Schedules, reminders, documents |
| Compliance | Просмотр covenant breaches, waivers |
| Client | Read-only summary в портале |
| External Advisor | Просмотр с согласия |

## Аудит

Все действия логируются:
- Создание/изменение bank, facility, loan
- Создание/тестирование covenant
- Обновление valuation collateral
- Платежи scheduled/paid
- Exception при breach
- Calendar events

---

**Дисклеймер**: Не является финансовой рекомендацией. Условия кредитов требуют подтверждения банком и юристами. Данные для информационных целей.
