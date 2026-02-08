import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── portalUsers (5) ──
const portalUsers = [
  { id: "pu-001", clientId: "c1", email: "a.petrov@family.ru", displayName: "Алексей Петров", pinHash: "pin_a1b2c3", languageDefaultKey: "ru", householdId: "hh-001", status: "active", createdAt: "2025-03-10T09:00:00Z", updatedAt: "2025-12-15T14:30:00Z" },
  { id: "pu-002", clientId: "c1", email: "m.petrova@family.ru", displayName: "Мария Петрова", pinHash: "pin_d4e5f6", languageDefaultKey: "ru", householdId: "hh-001", status: "active", createdAt: "2025-03-10T09:05:00Z", updatedAt: "2025-11-20T10:00:00Z" },
  { id: "pu-003", clientId: "c1", email: "d.petrov@family.ru", displayName: "Дмитрий Петров", pinHash: "pin_g7h8i9", languageDefaultKey: "en", householdId: "hh-001", status: "active", createdAt: "2025-06-01T12:00:00Z", updatedAt: "2026-01-05T08:15:00Z" },
  { id: "pu-004", clientId: "c1", email: "e.petrova@family.ru", displayName: "Елена Петрова", pinHash: "pin_j0k1l2", languageDefaultKey: "uk", householdId: "hh-001", status: "disabled", createdAt: "2025-03-10T09:10:00Z", updatedAt: "2025-09-01T16:00:00Z" },
  { id: "pu-005", clientId: "c1", email: "s.petrov@family.ru", displayName: "Сергей Петров", pinHash: "pin_m3n4o5", languageDefaultKey: "ru", householdId: "hh-001", status: "active", createdAt: "2025-08-15T11:00:00Z", updatedAt: "2026-01-28T09:45:00Z" }
];

// ── portalSessions (3) ──
const portalSessions = [
  { id: "ps-001", portalUserId: "pu-001", sessionTokenHash: "tok_sha256_abc123def456", createdAt: "2026-02-07T08:30:00Z", expiresAt: "2026-02-07T20:30:00Z", lastSeenAt: "2026-02-07T15:42:00Z" },
  { id: "ps-002", portalUserId: "pu-002", sessionTokenHash: "tok_sha256_789ghi012jkl", createdAt: "2026-02-06T19:10:00Z", expiresAt: "2026-02-07T07:10:00Z", lastSeenAt: "2026-02-06T23:58:00Z" },
  { id: "ps-003", portalUserId: "pu-003", sessionTokenHash: "tok_sha256_mno345pqr678", createdAt: "2026-02-07T10:05:00Z", expiresAt: "2026-02-07T22:05:00Z", lastSeenAt: "2026-02-07T14:20:00Z" }
];

// ── portalAnnouncements (12) ──
const portalAnnouncements = [
  { id: "pa-001", clientId: "c1", title: "Обзор рынков за январь 2026", bodyMdRu: "## Итоги января\n\nФондовые рынки продемонстрировали умеренный рост. Индекс S&P 500 прибавил 2.3%. Портфель семьи показал доходность +1.8% за месяц.", bodyMdEn: "## January Review\n\nEquity markets showed moderate growth. The S&P 500 gained 2.3%. Family portfolio returned +1.8% for the month.", bodyMdUk: "## Огляд ринків за січень\n\nФондові ринки продемонстрували помірне зростання. Індекс S&P 500 додав 2.3%.", publishedAt: "2026-02-01T09:00:00Z", expiresAt: null, createdAt: "2026-01-31T16:00:00Z", updatedAt: "2026-02-01T09:00:00Z" },
  { id: "pa-002", clientId: "c1", title: "Новая функция: отслеживание структуры владения", bodyMdRu: "Теперь вы можете просматривать полную структуру владения активами в разделе «Структура». Интерактивная диаграмма позволяет анализировать цепочки владения.", bodyMdEn: "You can now view the full ownership structure in the Structure section. The interactive diagram allows you to analyze ownership chains.", bodyMdUk: "Тепер ви можете переглядати повну структуру володіння активами у розділі «Структура».", publishedAt: "2025-12-15T10:00:00Z", expiresAt: null, createdAt: "2025-12-14T18:00:00Z", updatedAt: "2025-12-15T10:00:00Z" },
  { id: "pa-003", clientId: "c1", title: "Плановое техническое обслуживание 15 февраля", bodyMdRu: "Уважаемые клиенты, 15 февраля с 02:00 до 06:00 (МСК) будет проведено плановое обновление системы. Портал будет временно недоступен.", bodyMdEn: "Dear clients, on February 15 from 02:00 to 06:00 (MSK) a scheduled system update will be performed. The portal will be temporarily unavailable.", bodyMdUk: "Шановні клієнти, 15 лютого з 02:00 до 06:00 (МСК) буде проведено планове оновлення системи.", publishedAt: "2026-02-05T12:00:00Z", expiresAt: "2026-02-16T00:00:00Z", createdAt: "2026-02-05T11:00:00Z", updatedAt: "2026-02-05T12:00:00Z" },
  { id: "pa-004", clientId: "c1", title: "С Новым годом!", bodyMdRu: "Команда Wealth Office поздравляет вас с Новым 2026 годом! Желаем финансового благополучия и успешных инвестиций в наступающем году.", bodyMdEn: "The Wealth Office team wishes you a Happy New Year 2026! We wish you financial prosperity and successful investments.", bodyMdUk: "Команда Wealth Office вітає вас з Новим 2026 роком! Бажаємо фінансового добробуту та успішних інвестицій.", publishedAt: "2025-12-31T09:00:00Z", expiresAt: "2026-01-15T00:00:00Z", createdAt: "2025-12-30T15:00:00Z", updatedAt: "2025-12-31T09:00:00Z" },
  { id: "pa-005", clientId: "c1", title: "Квартальный отчёт Q4 2025 готов", bodyMdRu: "Ваш квартальный отчёт за Q4 2025 доступен для скачивания в разделе «Отчёты». Отчёт включает обзор портфеля, анализ доходности и рекомендации.", bodyMdEn: "Your Q4 2025 quarterly report is available for download in the Reports section. The report includes portfolio overview, performance analysis, and recommendations.", bodyMdUk: "Ваш квартальний звіт за Q4 2025 доступний для завантаження у розділі «Звіти».", publishedAt: "2026-01-15T10:00:00Z", expiresAt: null, createdAt: "2026-01-14T17:00:00Z", updatedAt: "2026-01-15T10:00:00Z" },
  { id: "pa-006", clientId: "c1", title: "Обновление политики конфиденциальности", bodyMdRu: "В связи с изменениями в законодательстве обновлена политика конфиденциальности. Просим ознакомиться с изменениями в разделе «Документы».", bodyMdEn: "The privacy policy has been updated due to regulatory changes. Please review the changes in the Documents section.", bodyMdUk: "У зв'язку зі змінами у законодавстві оновлено політику конфіденційності.", publishedAt: "2026-01-20T08:00:00Z", expiresAt: null, createdAt: "2026-01-19T14:00:00Z", updatedAt: "2026-01-20T08:00:00Z" },
  { id: "pa-007", clientId: "c1", title: "Вебинар: инвестиционные перспективы 2026", bodyMdRu: "Приглашаем вас на вебинар 20 февраля в 15:00 (МСК). Наши аналитики представят прогноз по основным классам активов и обсудят стратегию портфеля.", bodyMdEn: "We invite you to a webinar on February 20 at 15:00 (MSK). Our analysts will present forecasts for major asset classes and discuss portfolio strategy.", bodyMdUk: "Запрошуємо вас на вебінар 20 лютого о 15:00 (МСК).", publishedAt: "2026-02-03T10:00:00Z", expiresAt: "2026-02-21T00:00:00Z", createdAt: "2026-02-02T16:00:00Z", updatedAt: "2026-02-03T10:00:00Z" },
  { id: "pa-008", clientId: "c1", title: "Рыночная волатильность: комментарий аналитиков", bodyMdRu: "В связи с повышенной волатильностью на рынках публикуем комментарий нашей аналитической команды. Текущая ситуация не требует изменений в стратегии.", bodyMdEn: "Due to increased market volatility, we are publishing a commentary from our analytical team. The current situation does not require strategy changes.", bodyMdUk: "У зв'язку з підвищеною волатильністю на ринках публікуємо коментар нашої аналітичної команди.", publishedAt: "2026-01-28T14:00:00Z", expiresAt: null, createdAt: "2026-01-28T12:00:00Z", updatedAt: "2026-01-28T14:00:00Z" },
  { id: "pa-009", clientId: "c1", title: "Новый раздел: благотворительность", bodyMdRu: "В портале появился новый раздел для отслеживания благотворительной деятельности. Вы можете просматривать историю пожертвований и отчёты о социальном воздействии.", bodyMdEn: "A new section for tracking charitable activities has been added to the portal. You can view donation history and social impact reports.", bodyMdUk: "У порталі з'явився новий розділ для відстеження благодійної діяльності.", publishedAt: "2025-11-10T09:00:00Z", expiresAt: null, createdAt: "2025-11-09T17:00:00Z", updatedAt: "2025-11-10T09:00:00Z" },
  { id: "pa-010", clientId: "c1", title: "Напоминание: срок подачи налоговой декларации", bodyMdRu: "Напоминаем, что срок подачи налоговой декларации за 2025 год — 30 апреля 2026. Налоговые документы доступны в разделе «Документы».", bodyMdEn: "Reminder: the deadline for filing the 2025 tax return is April 30, 2026. Tax documents are available in the Documents section.", bodyMdUk: "Нагадуємо, що термін подання податкової декларації за 2025 рік — 30 квітня 2026.", publishedAt: "2026-02-01T08:00:00Z", expiresAt: "2026-05-01T00:00:00Z", createdAt: "2026-01-31T15:00:00Z", updatedAt: "2026-02-01T08:00:00Z" },
  { id: "pa-011", clientId: "c1", title: "Обновление мобильного приложения", bodyMdRu: "Доступна новая версия мобильного приложения (v3.2). Обновление включает улучшенную навигацию, тёмную тему и push-уведомления о важных событиях.", bodyMdEn: "A new version of the mobile app (v3.2) is available. The update includes improved navigation, dark theme, and push notifications for important events.", bodyMdUk: "Доступна нова версія мобільного додатку (v3.2). Оновлення включає покращену навігацію.", publishedAt: "2026-01-10T09:00:00Z", expiresAt: null, createdAt: "2026-01-09T18:00:00Z", updatedAt: "2026-01-10T09:00:00Z" },
  { id: "pa-012", clientId: "c1", title: "Поздравляем с Рождеством!", bodyMdRu: "Команда Wealth Office поздравляет вас с Рождеством Христовым! Желаем мира, здоровья и благополучия вашей семье.", bodyMdEn: "The Wealth Office team wishes you a Merry Christmas! We wish peace, health, and prosperity to your family.", bodyMdUk: "Команда Wealth Office вітає вас з Різдвом Христовим! Бажаємо миру, здоров'я та добробуту вашій родині.", publishedAt: "2026-01-07T08:00:00Z", expiresAt: "2026-01-14T00:00:00Z", createdAt: "2026-01-06T17:00:00Z", updatedAt: "2026-01-07T08:00:00Z" }
];

// ── portalViews (200) ──
// Distribution: documents(60) reportPacks(30) ownershipViews(20) philImpactReports(20)
//               commThreads(25) consents(15) relHouseholds(15) portalRequests(15)
// 80% view, 20% download
function pad(n, w) { return String(n).padStart(w, "0"); }
function dt(base, offsetH) {
  const d = new Date(base);
  d.setHours(d.getHours() + offsetH);
  return d.toISOString().replace(/\.\d+Z$/, "Z");
}

const collDist = [];
for (let i = 0; i < 60; i++) collDist.push({ collection: "documents", id: `doc-${pad(i + 1, 3)}` });
for (let i = 0; i < 30; i++) collDist.push({ collection: "reportPacks", id: `rp-${pad(i + 1, 3)}` });
for (let i = 0; i < 20; i++) collDist.push({ collection: "ownershipViews", id: `ov-${pad(i + 1, 3)}` });
for (let i = 0; i < 20; i++) collDist.push({ collection: "philImpactReports", id: `pir-${pad(i + 1, 3)}` });
for (let i = 0; i < 25; i++) collDist.push({ collection: "commThreads", id: `ct-${pad(i + 1, 3)}` });
for (let i = 0; i < 15; i++) collDist.push({ collection: "consents", id: `con-${pad(i + 1, 3)}` });
for (let i = 0; i < 15; i++) collDist.push({ collection: "relHouseholds", id: `rh-${pad(i + 1, 3)}` });
for (let i = 0; i < 15; i++) collDist.push({ collection: "portalRequests", id: `pr-${pad(i + 1, 3)}` });

const users3 = ["pu-001", "pu-002", "pu-003"];
const ips = ["185.12.xx.xx", "91.234.xx.xx", "77.88.xx.xx", "2a02:6b8:xx::xx", null];
const portalViews = [];
const baseDate = new Date("2026-01-02T06:00:00Z");

for (let i = 0; i < 200; i++) {
  const idx = i;
  const isDownload = i % 5 === 0; // 20% download
  const ref = collDist[i];
  const user = users3[i % 3];
  const hoursOffset = Math.floor(i * 4.4); // spread across Jan-Feb
  const ip = ips[i % ips.length];
  const rec = {
    id: `pv-${pad(i + 1, 3)}`,
    portalUserId: user,
    actionKey: isDownload ? "download" : "view",
    targetRefJson: ref,
    at: dt(baseDate, hoursOffset),
    ...(ip ? { ipMasked: ip } : {}),
    ...(i % 7 === 0 ? { metaJson: { userAgent: "Mozilla/5.0", screen: "1920x1080" } } : {})
  };
  portalViews.push(rec);
}

// ── portalRequests (80) ──
// Category: ~30% documents(24), ~20% reporting(16), ~15% payments(12), ~15% tax(12), ~10% trust(8), ~10% other(8)
// Status: ~25% open(20), ~35% in_progress(28), ~40% resolved(32)

const catPool = [];
for (let i = 0; i < 24; i++) catPool.push("documents");
for (let i = 0; i < 16; i++) catPool.push("reporting");
for (let i = 0; i < 12; i++) catPool.push("payments");
for (let i = 0; i < 12; i++) catPool.push("tax");
for (let i = 0; i < 8; i++) catPool.push("trust");
for (let i = 0; i < 8; i++) catPool.push("other");

const statusPool = [];
for (let i = 0; i < 20; i++) statusPool.push("open");
for (let i = 0; i < 28; i++) statusPool.push("in_progress");
for (let i = 0; i < 32; i++) statusPool.push("resolved");

const urgencies = ["low", "medium", "high"];

const docTitles = [
  "Запрос копии договора доверительного управления",
  "Получение выписки по счёту за декабрь",
  "Копия налогового уведомления",
  "Запрос справки о состоянии портфеля",
  "Получение сертификата о праве собственности",
  "Копия акта приёма-передачи активов",
  "Запрос письма-подтверждения от банка",
  "Получение копии страхового полиса",
  "Заверенная копия учредительного договора",
  "Архивные документы за 2024 год",
  "Справка для визового центра",
  "Копия лицензии управляющей компании",
  "Запрос нотариально заверенной доверенности",
  "Получение инвестиционной декларации",
  "Копия отчёта независимого оценщика",
  "Запрос выписки ЕГРН на объект недвижимости",
  "Копия протокола собрания учредителей",
  "Запрос справки об отсутствии задолженности",
  "Получение подтверждения банковского перевода",
  "Заверенная копия паспорта для KYC",
  "Запрос истории операций по трастовому счёту",
  "Получение копии аудиторского заключения",
  "Запрос выписки из реестра акционеров",
  "Копия соглашения о неразглашении"
];
const docDescs = [
  "Необходима актуальная копия договора для предоставления в банк-партнёр.",
  "Прошу предоставить детализированную выписку по основному инвестиционному счёту.",
  "Требуется копия уведомления ФНС для подготовки налоговой декларации.",
  "Нужна справка для предоставления в иностранный банк.",
  "Запрашиваю сертификат для оформления страхования имущества.",
  "Необходим акт для завершения процедуры передачи активов между структурами.",
  "Прошу подготовить письмо для предоставления контрагенту.",
  "Копия полиса необходима для обновления информации у кастодиана.",
  "Требуется для регистрации изменений в структуре владения.",
  "Прошу собрать архив документов за прошлый год для внутреннего аудита.",
  "Необходима справка о финансовом состоянии для оформления визы.",
  "Запрашиваю для проверки соответствия регуляторным требованиям.",
  "Доверенность необходима для представления интересов в суде.",
  "Прошу предоставить актуальную инвестиционную декларацию.",
  "Отчёт оценщика нужен для пересмотра залоговой стоимости.",
  "Выписка необходима для сделки купли-продажи недвижимости.",
  "Протокол нужен для оформления банковской карточки подписей.",
  "Справка требуется для участия в тендере.",
  "Подтверждение нужно для урегулирования спора с контрагентом.",
  "Копия паспорта запрашивается банком для обновления KYC-профиля.",
  "Прошу предоставить полную историю за последние 12 месяцев.",
  "Заключение необходимо для предоставления регулятору.",
  "Выписка нужна для подтверждения доли участия.",
  "NDA необходимо для начала переговоров с потенциальным партнёром."
];

const repTitles = [
  "Формирование отчёта по доходности портфеля",
  "Запрос аналитического обзора рынка",
  "Консолидированный отчёт по всем структурам",
  "Отчёт о движении денежных средств за январь",
  "Сравнительный анализ доходности по бенчмарку",
  "Запрос кастомного отчёта по недвижимости",
  "Отчёт об аллокации активов",
  "Детализация комиссий и расходов",
  "Прогноз денежных потоков на Q1 2026",
  "Запрос отчёта по альтернативным инвестициям",
  "Квартальный отчёт по ESG-метрикам",
  "Отчёт о валютных позициях",
  "Детализация процентных доходов по облигациям",
  "Отчёт по ликвидности портфеля",
  "Историческая доходность за 5 лет",
  "Отчёт по стресс-тестированию портфеля"
];
const repDescs = [
  "Прошу сформировать отчёт по доходности за последний квартал с разбивкой по классам активов.",
  "Необходим аналитический обзор текущей рыночной ситуации от команды аналитиков.",
  "Прошу подготовить консолидированный отчёт по всем юридическим лицам и трастам.",
  "Необходима детализация всех поступлений и списаний за январь 2026.",
  "Прошу подготовить сравнение доходности портфеля с индексом MSCI World.",
  "Нужен отдельный отчёт по портфелю недвижимости с оценкой текущей стоимости.",
  "Прошу предоставить текущую аллокацию с рекомендациями по ребалансировке.",
  "Необходима полная детализация всех комиссий, уплаченных за 2025 год.",
  "Прошу подготовить прогноз входящих и исходящих потоков на ближайший квартал.",
  "Нужен обзор портфеля альтернативных инвестиций: PE, VC, хедж-фонды.",
  "Прошу предоставить обновлённые ESG-рейтинги и метрики портфеля.",
  "Необходим обзор валютных позиций и рекомендации по хеджированию.",
  "Прошу детализировать купонные доходы по всем облигационным позициям.",
  "Нужен анализ ликвидности портфеля с учётом рыночных условий.",
  "Прошу подготовить отчёт по исторической доходности за 5 лет.",
  "Необходимы результаты стресс-тестирования при различных сценариях."
];

const payTitles = [
  "Перевод средств между счетами",
  "Оплата страховой премии",
  "Перечисление благотворительного взноса",
  "Оплата услуг управляющей компании",
  "Перевод на счёт в иностранном банке",
  "Оплата налогов за Q4 2025",
  "Регулярный платёж по ипотеке",
  "Оплата юридических услуг",
  "Перевод дивидендов на личный счёт",
  "Оплата коммунальных услуг по объектам",
  "Перечисление средств в трастовый фонд",
  "Оплата услуг консультантов"
];
const payDescs = [
  "Прошу перевести 500,000 USD со счёта в UBS на счёт в Credit Suisse.",
  "Необходимо оплатить ежегодную страховую премию по полису имущества.",
  "Прошу перечислить 100,000 USD в благотворительный фонд согласно плану.",
  "Оплата ежемесячной комиссии за управление портфелем.",
  "Прошу инициировать перевод 200,000 EUR на счёт в Deutsche Bank.",
  "Необходимо оплатить налоги за четвёртый квартал 2025 года.",
  "Прошу провести очередной платёж по ипотечному кредиту.",
  "Оплата счёта юридической фирмы за консультационные услуги.",
  "Прошу перевести начисленные дивиденды на личный расчётный счёт.",
  "Необходимо оплатить коммунальные услуги по объектам недвижимости.",
  "Прошу перечислить средства в трастовый фонд согласно графику.",
  "Оплата услуг налоговых и финансовых консультантов."
];

const taxTitles = [
  "Подготовка налоговой декларации за 2025",
  "Вопрос по налогообложению дивидендов",
  "Оптимизация налоговой нагрузки",
  "Запрос налогового календаря на 2026",
  "Консультация по налогам при продаже недвижимости",
  "Вопрос по двойному налогообложению",
  "Анализ налоговых последствий реструктуризации",
  "Запрос справки 2-НДФЛ",
  "Консультация по налогам при дарении активов",
  "Оптимизация налогов по иностранным структурам",
  "Вопрос по CRS-отчётности",
  "Подготовка документов для налогового резидентства"
];
const taxDescs = [
  "Прошу начать подготовку налоговой декларации. Все документы загружены в систему.",
  "Необходима консультация по порядку налогообложения дивидендов от иностранных компаний.",
  "Прошу рассмотреть варианты оптимизации налоговой нагрузки на 2026 год.",
  "Необходим календарь ключевых налоговых дат и сроков на текущий год.",
  "Планируется продажа квартиры в Москве. Необходима консультация по НДФЛ.",
  "Прошу разъяснить применение соглашения об избежании двойного налогообложения с Кипром.",
  "Рассматривается реструктуризация холдинга. Нужен анализ налоговых последствий.",
  "Прошу подготовить справку 2-НДФЛ за 2025 год для предоставления в банк.",
  "Планируется дарение доли в компании. Нужна консультация по налоговым последствиям.",
  "Прошу проанализировать налоговую эффективность текущей структуры иностранных компаний.",
  "Необходима помощь в подготовке CRS-отчётности для иностранных счетов.",
  "Прошу подготовить комплект документов для подтверждения налогового резидентства."
];

const trustTitles = [
  "Распределение из семейного траста",
  "Изменение бенефициаров траста",
  "Ежегодный обзор трастовой структуры",
  "Назначение нового попечителя",
  "Вопрос по инвестиционной политике траста",
  "Передача активов в траст",
  "Запрос копии трастового соглашения",
  "Консультация по ликвидации траста"
];
const trustDescs = [
  "Прошу инициировать распределение средств из траста согласно графику.",
  "Необходимо внести изменения в список бенефициаров семейного траста.",
  "Прошу провести ежегодный обзор структуры и деятельности траста.",
  "Рассматривается кандидатура нового попечителя. Прошу подготовить документы.",
  "Необходимо обсудить изменение инвестиционной политики траста.",
  "Прошу подготовить документы для передачи дополнительных активов в траст.",
  "Необходима заверенная копия трастового соглашения для банка.",
  "Прошу проконсультировать по процедуре и последствиям ликвидации траста."
];

const otherTitles = [
  "Обновление контактных данных",
  "Запрос на добавление пользователя портала",
  "Настройка уведомлений",
  "Вопрос по работе портала",
  "Запрос на изменение языка интерфейса",
  "Обратная связь по новому дизайну",
  "Запрос на обучение работе с порталом",
  "Проблема с авторизацией"
];
const otherDescs = [
  "Прошу обновить номер телефона и адрес электронной почты в профиле.",
  "Необходимо добавить доступ к порталу для нового члена семьи.",
  "Прошу настроить email-уведомления о важных событиях и документах.",
  "Не удаётся скачать отчёт в формате PDF. Прошу помочь.",
  "Прошу переключить язык интерфейса по умолчанию на английский.",
  "Хотел бы поделиться замечаниями по новому дизайну портала.",
  "Прошу организовать краткое обучение по новым функциям портала.",
  "Не удаётся войти в систему после смены пароля."
];

const titleMap = { documents: docTitles, reporting: repTitles, payments: payTitles, tax: taxTitles, trust: trustTitles, other: otherTitles };
const descMap = { documents: docDescs, reporting: repDescs, payments: payDescs, tax: taxDescs, trust: trustDescs, other: otherDescs };

const catCounters = { documents: 0, reporting: 0, payments: 0, tax: 0, trust: 0, other: 0 };

const portalRequests = [];
const reqBase = new Date("2025-10-01T08:00:00Z");

for (let i = 0; i < 80; i++) {
  const cat = catPool[i];
  const status = statusPool[i];
  const urg = urgencies[i % 3];
  const user = users3[i % 3];
  const ci = catCounters[cat];
  catCounters[cat]++;
  const titles = titleMap[cat];
  const descs = descMap[cat];
  const title = titles[ci % titles.length];
  const desc = descs[ci % descs.length];
  const hoursOff = Math.floor(i * 30);
  const created = dt(reqBase, hoursOff);
  const updHours = status === "open" ? 0 : (status === "in_progress" ? 12 + (i % 24) : 24 + (i % 48));
  const updated = dt(reqBase, hoursOff + updHours);
  const hasCase = status === "resolved" && i % 3 === 0;
  const hasTasks = status === "in_progress" && i % 4 === 0;

  portalRequests.push({
    id: `pr-${pad(i + 1, 3)}`,
    portalUserId: user,
    categoryKey: cat,
    title,
    description: desc,
    urgencyKey: urg,
    statusKey: status,
    linkedCaseId: hasCase ? `case-${pad(100 + i, 3)}` : null,
    linkedTaskIdsJson: hasTasks ? [`task-${pad(200 + i, 3)}`] : [],
    createdAt: created,
    updatedAt: updated
  });
}

// ── Assemble and write ──
const seed = {
  portalUsers,
  portalSessions,
  portalAnnouncements,
  portalViews,
  portalRequests
};

const outPath = join(__dirname, "seed-module-55.json");
writeFileSync(outPath, JSON.stringify(seed, null, 1), "utf8");

// verify
const parsed = JSON.parse(require("fs").readFileSync(outPath, "utf8"));
console.log("portalUsers:", parsed.portalUsers.length);
console.log("portalSessions:", parsed.portalSessions.length);
console.log("portalAnnouncements:", parsed.portalAnnouncements.length);
console.log("portalViews:", parsed.portalViews.length);
console.log("portalRequests:", parsed.portalRequests.length);
console.log("DONE - valid JSON written");
