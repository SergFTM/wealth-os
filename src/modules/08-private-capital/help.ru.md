# Частный капитал и альтернативные инвестиции

## Что такое Private Capital учет

Private Capital (частный капитал) — это инвестиции в фонды прямых инвестиций (PE), венчурного капитала (VC), недвижимости (RE) и частного кредита. В отличие от публичных рынков, эти активы имеют ограниченную ликвидность и требуют специального учета.

### Ключевые понятия

**Commitment (обязательство)** — сумма, которую инвестор обязуется внести в фонд на протяжении инвестиционного периода.

**Capital Call (запрос капитала)** — уведомление от GP (управляющего) о необходимости внести часть обязательства.

**Distribution (распределение)** — возврат капитала или прибыли от фонда инвестору.

**Unfunded Commitment** — разница между Commitment и уже внесенной суммой:
```
Unfunded = Commitment - Called
```

**NAV (Net Asset Value)** — текущая стоимость доли в фонде по оценке GP.

## Метрики Vintage Analysis

**DPI (Distributions to Paid-In)** — сколько распределено относительно внесенного капитала:
```
DPI = Distributions / Paid-In Capital
```

**RVPI (Residual Value to Paid-In)** — текущая стоимость относительно внесенного:
```
RVPI = NAV / Paid-In Capital
```

**TVPI (Total Value to Paid-In)** — общая ценность (DPI + RVPI):
```
TVPI = (Distributions + NAV) / Paid-In Capital
```

**IRR (Internal Rate of Return)** — доходность с учетом времени денежных потоков.

## PME (Public Market Equivalent)

PME сравнивает доходность фонда с гипотетической инвестицией в публичный индекс. Если PME > 1, фонд превзошел бенчмарк.

MVP: хранится как показатель, полный расчет за пределами текущей версии.

## J-Curve и прогнозирование

**J-Curve** — типичный паттерн PE фондов: отрицательные потоки в первые годы (calls), затем положительные (distributions).

Прогноз:
- Expected Calls = историческая скорость выборки × unfunded
- Expected Distributions = на основе стадии фонда и vintage

## Документы

Quarterly Reports и Capital Account Statements — ключевые документы для:
- Подтверждения NAV
- Верификации calls/distributions
- Audit-ready отчетности

## Источники данных

- GP reports (отчеты управляющего)
- Admin statements (отчеты администратора)
- Manual entry (ручной ввод)

## Audit-Ready

Все изменения фиксируются:
- Создание/редактирование фонда
- Добавление commitment
- Регистрация call/distribution
- Обновление valuation
- Прикрепление документов

Критичные правки требуют approvals.

## Типовые сценарии

1. **"Какой unfunded по всем фондам?"**
   → KPI "Невыбрано" или вкладка Commitments

2. **"Какие calls ожидаются?"**
   → Вкладка Calls + фильтр planned/overdue

3. **"Какие фонды отстают от vintages?"**
   → Vintage panel → flag underperform

4. **"Прикрепить квартальный отчет"**
   → Fund detail → Documents → Attach

5. **"Создать задачу на missing valuation"**
   → Valuations table → Create task

## RBAC

- **Owner/Admin/CFO/Ops**: полный CRUD, mark paid/received, post to GL
- **CIO**: read-only + создание report section
- **Compliance**: read-only, export, approvals
- **Client-safe**: только summary, скрыты fees/notes/internal sources
