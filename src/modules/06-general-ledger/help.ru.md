# Главная книга (General Ledger)

## Обзор
Главная книга — центральный учётный реестр для всех финансовых транзакций по стандартам IFRS/GAAP.

**Возможности:**
- План счетов (CoA) с иерархией
- Журнальные проводки дебет/кредит
- Мультисущность и консолидация
- Мультивалюта с FX-курсами
- Закрытие периодов с approval

## Ключевые понятия

### Journal Entry vs Posted
- **Journal Entry** — черновик, можно редактировать
- **Posted Transaction** — проведено, неизменяемо

### Мультивалюта
- Functional Currency — валюта учёта entity
- FX Rates — ежедневные курсы
- Пересчёт в базовую валюту

### Периоды
- Open → Closing → Closed
- Чеклист перед закрытием
- Approval от CFO/Controller

## Типовые сценарии

1. **Создать проводку** — entity, период, линии дебет=кредит, документ
2. **Сверить выписку** — сопоставить транзакции, отметить matched
3. **IBOR/ABOR issues** — найти расхождения, создать task
4. **P&L отчёт** — выбрать entity/период, экспорт CSV
5. **Закрыть период** — чеклист → approval → close

## RBAC
| Роль | Доступ |
|------|--------|
| Owner/CFO | Полный + close |
| Controller | Post, close |
| Operations | Draft, submit |
| Compliance | Approve/reject |
| Client | Только отчёты |

## Audit Trail
Логируются: создание счетов, проводки, post, import, reconcile, FX, close period.
