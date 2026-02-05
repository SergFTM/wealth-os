# IPS и ограничения

## Что такое IPS?
Investment Policy Statement (IPS) — формальный документ, описывающий инвестиционную политику: цели, риск-толерантность, ликвидность, горизонт инвестирования и ограничения.

## Зачем MFO?
- Governance: формализованный инвестиционный процесс
- Compliance: мониторинг соблюдения ограничений
- Accountability: audit trail всех изменений и решений
- Client transparency: публикуемые summary для клиентов

## Scope
Политики применяются на разных уровнях:
- **Household** — вся семья, общий IPS
- **Entity** — юридическое лицо, траст, фонд
- **Portfolio** — конкретный портфель с отдельными ограничениями

## Политика и версии
Каждая политика может иметь несколько версий:
- **Draft** — черновик, можно редактировать
- **Submitted** — отправлено на согласование
- **Approved** — одобрено комитетом, active

Версии read-only после approval. Для изменений — создаётся новая версия.

## Ограничения (Constraints)
Типы лимитов:
- **Asset class limits** — доля по классам активов (equities max 60%)
- **Concentration** — максимальная доля одной позиции (max 5%)
- **Geographic** — лимиты по регионам (EM max 20%)
- **Sector** — лимиты по секторам (Tech max 30%)
- **Liquidity** — минимум ликвидных активов (liquid min 10%)
- **Leverage** — максимальное плечо (leverage max 1.2x)
- **ESG** — флаги ESG screening

Метрики: weight (%), value ($), exposure.

## Breaches (Нарушения)
Breach — это превышение или нарушение ограничения:
- **Detected** — дата обнаружения
- **Measured vs Limit** — фактическое vs допустимое
- **Severity**: OK, Warning, Critical
- **Status**: Open → In Review → Resolved
- **Source**: Auto (системная проверка) / Manual (ручная фиксация)

Действия при breach:
- Assign owner
- Create task (mitigation)
- Propose waiver
- Resolve

## Waivers (Исключения)
Waiver — временное разрешение на отклонение от ограничения:
- **Reason** — обоснование
- **Start/End** — период действия
- **Allowed deviation** — допустимое отклонение
- **Approval** — требуется согласование комитета

Статусы: Pending → Active → Expired / Revoked

## Инвестиционный комитет
Meetings:
- **Agenda** — список вопросов (breaches, waivers, IPS changes)
- **Decisions** — решения с голосованием (Yes/No/Abstain)
- **Minutes** — протокол заседания
- **Documents** — прикреплённые материалы

Publish minutes: опционально client-safe.

## Типовые сценарии
1. Создать IPS на household, задать return target и risk tolerance
2. Добавить constraint: equities max 60%
3. Зафиксировать breach: equities = 65%, severity = warning
4. Создать task: reduce equities exposure
5. Оформить waiver на 90 дней пока рынок стабилизируется
6. Провести заседание комитета, approve waiver
7. Сформировать committee pack для отчётности

## Проверка ограничений
Кнопка "Проверить ограничения" запускает проверку:
- Сравнивает текущие exposures с лимитами
- Создаёт breaches при превышениях
- Пишет audit event

## Дисклеймер
Информация об IPS носит справочный характер и требует подтверждения инвестиционным комитетом.

## Audit
Все действия логируются:
- Create/update policy, version
- Add/edit constraint
- Check constraints run
- Create breach, status change
- Create waiver, approve, revoke
- Committee meetings, decisions, publish

## RBAC
- **Owner/Admin**: полный доступ
- **CIO**: создание политик, constraints, waivers
- **Compliance**: мониторинг, аудит
- **Operations**: задачи, документы
- **External advisor**: read-only по published summaries
- **Client-safe**: только policy summary, без внутренних деталей
