import { DataKpi, DataLineage, DataReconciliation, DataQualityScore, AiExplanation, AiReconCause, AiQualityRisk } from './types';
import { WhyThisNumber } from './types';

const DISCLAIMER = {
  ru: 'Пояснения носят информационный характер. Финальные выводы требуют проверки бухгалтером и ответственными лицами.',
  en: 'Explanations are informational. Final conclusions require verification by an accountant and responsible persons.',
  uk: 'Пояснення носять інформаційний характер. Фінальні висновки потребують перевірки бухгалтером та відповідальними особами.',
};

/**
 * Explain lineage in simple language
 */
export function explainLineage(
  kpi: DataKpi,
  lineage: DataLineage,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): AiExplanation {
  const sourceCollections = lineage.inputsJson.map(i => i.collection);
  const transformCount = lineage.transformsJson.length;

  const explanations = {
    ru: {
      intro: `KPI "${kpi.name}" рассчитывается на основе данных из ${sourceCollections.length} источника(ов).`,
      sources: `Источники: ${sourceCollections.join(', ')}.`,
      process: transformCount > 0
        ? `Данные проходят через ${transformCount} этап(ов) обработки: ${lineage.transformsJson.map(t => t.title).join(' → ')}.`
        : 'Данные используются напрямую без дополнительных трансформаций.',
      formula: kpi.formulaText ? `Формула расчета: ${kpi.formulaText}` : '',
      risks: lineage.transformsJson.filter(t => t.riskKey === 'high').length > 0
        ? 'Обратите внимание на этапы с высоким риском в цепочке расчета.'
        : '',
    },
    en: {
      intro: `KPI "${kpi.name}" is calculated based on data from ${sourceCollections.length} source(s).`,
      sources: `Sources: ${sourceCollections.join(', ')}.`,
      process: transformCount > 0
        ? `Data passes through ${transformCount} processing step(s): ${lineage.transformsJson.map(t => t.title).join(' → ')}.`
        : 'Data is used directly without additional transformations.',
      formula: kpi.formulaText ? `Calculation formula: ${kpi.formulaText}` : '',
      risks: lineage.transformsJson.filter(t => t.riskKey === 'high').length > 0
        ? 'Note the high-risk steps in the calculation chain.'
        : '',
    },
    uk: {
      intro: `KPI "${kpi.name}" розраховується на основі даних з ${sourceCollections.length} джерела(ел).`,
      sources: `Джерела: ${sourceCollections.join(', ')}.`,
      process: transformCount > 0
        ? `Дані проходять через ${transformCount} етап(ів) обробки: ${lineage.transformsJson.map(t => t.title).join(' → ')}.`
        : 'Дані використовуються напряму без додаткових трансформацій.',
      formula: kpi.formulaText ? `Формула розрахунку: ${kpi.formulaText}` : '',
      risks: lineage.transformsJson.filter(t => t.riskKey === 'high').length > 0
        ? 'Зверніть увагу на етапи з високим ризиком у ланцюзі розрахунку.'
        : '',
    },
  };

  const e = explanations[locale];
  const text = [e.intro, e.sources, e.process, e.formula, e.risks].filter(Boolean).join('\n\n');

  return {
    text,
    confidence: lineage.transformsJson.filter(t => t.riskKey === 'high').length > 0 ? 'medium' : 'high',
    sources: sourceCollections,
    assumptions: kpi.assumptionsText?.split('\n').filter(a => a.trim()) || [],
    disclaimer: DISCLAIMER[locale],
  };
}

/**
 * Propose causes for reconciliation break
 */
export function proposeReconCauses(
  recon: DataReconciliation,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): { causes: AiReconCause[]; disclaimer: string } {
  const causesMap = {
    ibor_abor: {
      ru: [
        { cause: 'Различия в методологии оценки (mark-to-market vs book value)', likelihood: 'high' as const, suggestedAction: 'Сравните методы оценки в обеих системах' },
        { cause: 'Непроведенные корпоративные действия в одной из систем', likelihood: 'medium' as const, suggestedAction: 'Проверьте очередь корпоративных действий' },
        { cause: 'Разница во времени расчета (T+0 vs T+1)', likelihood: 'medium' as const, suggestedAction: 'Убедитесь в синхронизации дат расчета' },
        { cause: 'Ошибки в маппинге инструментов между системами', likelihood: 'low' as const, suggestedAction: 'Проверьте таблицу соответствия кодов' },
      ],
      en: [
        { cause: 'Valuation methodology differences (mark-to-market vs book value)', likelihood: 'high' as const, suggestedAction: 'Compare valuation methods in both systems' },
        { cause: 'Unprocessed corporate actions in one system', likelihood: 'medium' as const, suggestedAction: 'Check corporate actions queue' },
        { cause: 'Calculation timing difference (T+0 vs T+1)', likelihood: 'medium' as const, suggestedAction: 'Ensure calculation dates are synchronized' },
        { cause: 'Instrument mapping errors between systems', likelihood: 'low' as const, suggestedAction: 'Review code mapping table' },
      ],
      uk: [
        { cause: 'Різниця в методології оцінки (mark-to-market vs book value)', likelihood: 'high' as const, suggestedAction: 'Порівняйте методи оцінки в обох системах' },
        { cause: 'Необроблені корпоративні дії в одній з систем', likelihood: 'medium' as const, suggestedAction: 'Перевірте чергу корпоративних дій' },
        { cause: 'Різниця у часі розрахунку (T+0 vs T+1)', likelihood: 'medium' as const, suggestedAction: 'Переконайтесь у синхронізації дат розрахунку' },
        { cause: 'Помилки в мапінгу інструментів між системами', likelihood: 'low' as const, suggestedAction: 'Перевірте таблицю відповідності кодів' },
      ],
    },
    cash_bank: {
      ru: [
        { cause: 'Неотраженные банковские транзакции (задержка выписки)', likelihood: 'high' as const, suggestedAction: 'Загрузите актуальную банковскую выписку' },
        { cause: 'Различия во времени проведения платежей', likelihood: 'high' as const, suggestedAction: 'Сравните даты платежей' },
        { cause: 'Банковские комиссии и сборы', likelihood: 'medium' as const, suggestedAction: 'Проверьте начисленные комиссии' },
        { cause: 'Курсовые разницы при валютной переоценке', likelihood: 'low' as const, suggestedAction: 'Сверьте используемые курсы валют' },
      ],
      en: [
        { cause: 'Unrecorded bank transactions (statement delay)', likelihood: 'high' as const, suggestedAction: 'Load current bank statement' },
        { cause: 'Payment timing differences', likelihood: 'high' as const, suggestedAction: 'Compare payment dates' },
        { cause: 'Bank fees and charges', likelihood: 'medium' as const, suggestedAction: 'Check accrued fees' },
        { cause: 'FX differences from currency revaluation', likelihood: 'low' as const, suggestedAction: 'Verify exchange rates used' },
      ],
      uk: [
        { cause: 'Невідображені банківські транзакції (затримка виписки)', likelihood: 'high' as const, suggestedAction: 'Завантажте актуальну банківську виписку' },
        { cause: 'Різниця в часі проведення платежів', likelihood: 'high' as const, suggestedAction: 'Порівняйте дати платежів' },
        { cause: 'Банківські комісії та збори', likelihood: 'medium' as const, suggestedAction: 'Перевірте нараховані комісії' },
        { cause: 'Курсові різниці при валютній переоцінці', likelihood: 'low' as const, suggestedAction: 'Звірте використані курси валют' },
      ],
    },
    positions_custodian: {
      ru: [
        { cause: 'Непроведенные сделки в одной из систем', likelihood: 'high' as const, suggestedAction: 'Сверьте список открытых ордеров' },
        { cause: 'Корпоративные действия в процессе обработки', likelihood: 'medium' as const, suggestedAction: 'Проверьте события по инструментам' },
        { cause: 'Ошибки в идентификаторах инструментов (ISIN/CUSIP)', likelihood: 'medium' as const, suggestedAction: 'Сравните справочники инструментов' },
        { cause: 'Различия в учете дробных позиций', likelihood: 'low' as const, suggestedAction: 'Проверьте округление позиций' },
      ],
      en: [
        { cause: 'Unprocessed trades in one system', likelihood: 'high' as const, suggestedAction: 'Compare open order lists' },
        { cause: 'Corporate actions being processed', likelihood: 'medium' as const, suggestedAction: 'Check instrument events' },
        { cause: 'Instrument identifier errors (ISIN/CUSIP)', likelihood: 'medium' as const, suggestedAction: 'Compare instrument reference data' },
        { cause: 'Fractional position handling differences', likelihood: 'low' as const, suggestedAction: 'Check position rounding' },
      ],
      uk: [
        { cause: 'Необроблені угоди в одній з систем', likelihood: 'high' as const, suggestedAction: 'Звірте список відкритих ордерів' },
        { cause: 'Корпоративні дії в процесі обробки', likelihood: 'medium' as const, suggestedAction: 'Перевірте події по інструментах' },
        { cause: 'Помилки в ідентифікаторах інструментів (ISIN/CUSIP)', likelihood: 'medium' as const, suggestedAction: 'Порівняйте довідники інструментів' },
        { cause: 'Різниця в обліку дробових позицій', likelihood: 'low' as const, suggestedAction: 'Перевірте округлення позицій' },
      ],
    },
    gl_subledger: {
      ru: [
        { cause: 'Непроведенные проводки в GL', likelihood: 'high' as const, suggestedAction: 'Проверьте журнал ожидающих проводок' },
        { cause: 'Различия в периодах закрытия', likelihood: 'medium' as const, suggestedAction: 'Сверьте статус закрытия периодов' },
        { cause: 'Корректирующие записи в процессе согласования', likelihood: 'medium' as const, suggestedAction: 'Проверьте очередь корректировок' },
        { cause: 'Ошибки интерфейса между системами', likelihood: 'low' as const, suggestedAction: 'Проверьте логи интеграции' },
      ],
      en: [
        { cause: 'Unposted GL entries', likelihood: 'high' as const, suggestedAction: 'Check pending entries journal' },
        { cause: 'Period close differences', likelihood: 'medium' as const, suggestedAction: 'Compare period close status' },
        { cause: 'Adjusting entries pending approval', likelihood: 'medium' as const, suggestedAction: 'Check adjustment queue' },
        { cause: 'Interface errors between systems', likelihood: 'low' as const, suggestedAction: 'Review integration logs' },
      ],
      uk: [
        { cause: 'Непроведені проводки в GL', likelihood: 'high' as const, suggestedAction: 'Перевірте журнал очікуючих проводок' },
        { cause: 'Різниця в періодах закриття', likelihood: 'medium' as const, suggestedAction: 'Звірте статус закриття періодів' },
        { cause: 'Коригуючі записи в процесі погодження', likelihood: 'medium' as const, suggestedAction: 'Перевірте чергу коригувань' },
        { cause: 'Помилки інтерфейсу між системами', likelihood: 'low' as const, suggestedAction: 'Перевірте логи інтеграції' },
      ],
    },
  };

  return {
    causes: causesMap[recon.reconTypeKey]?.[locale] || [],
    disclaimer: DISCLAIMER[locale],
  };
}

/**
 * Summarize quality risks
 */
export function summarizeQualityRisks(
  scores: DataQualityScore[],
  locale: 'ru' | 'en' | 'uk' = 'ru'
): { risks: AiQualityRisk[]; summary: string; disclaimer: string } {
  const risks: AiQualityRisk[] = [];

  // Find low completeness
  const lowCompleteness = scores.filter(s => s.completenessScore < 70);
  if (lowCompleteness.length > 0) {
    risks.push({
      risk: locale === 'ru'
        ? 'Неполные данные в нескольких доменах'
        : locale === 'uk'
          ? 'Неповні дані в кількох доменах'
          : 'Incomplete data in multiple domains',
      severity: 'high',
      affectedKpis: lowCompleteness.map(s => s.domainKey),
      mitigation: locale === 'ru'
        ? 'Заполните обязательные поля или пометьте как оценочные'
        : locale === 'uk'
          ? 'Заповніть обов\'язкові поля або позначте як оцінкові'
          : 'Fill required fields or mark as estimated',
    });
  }

  // Find stale data
  const lowFreshness = scores.filter(s => s.freshnessScore < 50);
  if (lowFreshness.length > 0) {
    risks.push({
      risk: locale === 'ru'
        ? 'Устаревшие данные требуют обновления'
        : locale === 'uk'
          ? 'Застарілі дані потребують оновлення'
          : 'Stale data requires update',
      severity: 'medium',
      affectedKpis: lowFreshness.map(s => s.domainKey),
      mitigation: locale === 'ru'
        ? 'Запустите синхронизацию с источниками данных'
        : locale === 'uk'
          ? 'Запустіть синхронізацію з джерелами даних'
          : 'Run synchronization with data sources',
    });
  }

  // Find consistency issues
  const lowConsistency = scores.filter(s => s.consistencyScore < 70);
  if (lowConsistency.length > 0) {
    risks.push({
      risk: locale === 'ru'
        ? 'Обнаружены конфликты между источниками данных'
        : locale === 'uk'
          ? 'Виявлено конфлікти між джерелами даних'
          : 'Conflicts detected between data sources',
      severity: 'high',
      affectedKpis: lowConsistency.map(s => s.domainKey),
      mitigation: locale === 'ru'
        ? 'Разрешите конфликты в MDM или создайте override'
        : locale === 'uk'
          ? 'Вирішіть конфлікти в MDM або створіть override'
          : 'Resolve conflicts in MDM or create override',
    });
  }

  // Build summary
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + s.scoreTotal, 0) / scores.length)
    : 0;

  const summaryTemplates = {
    ru: `Средний показатель качества данных: ${avgScore}%. Выявлено ${risks.length} риск(ов) требующих внимания.`,
    en: `Average data quality score: ${avgScore}%. Found ${risks.length} risk(s) requiring attention.`,
    uk: `Середній показник якості даних: ${avgScore}%. Виявлено ${risks.length} ризик(ів) що потребують уваги.`,
  };

  return {
    risks,
    summary: summaryTemplates[locale],
    disclaimer: DISCLAIMER[locale],
  };
}

/**
 * Generate simple explanation for Why This Number
 */
export function explainWhyThisNumber(
  why: WhyThisNumber,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): AiExplanation {
  const templates = {
    ru: {
      intro: `**${why.kpiName}** показывает ${why.definition}`,
      value: `Текущее значение: ${formatValue(why.currentValue.value, why.currentValue.currency)} по состоянию на ${formatDate(why.asOf, locale)}.`,
      formula: why.formula ? `Расчет выполняется по формуле: ${why.formula}` : '',
      sources: `Данные получены из: ${why.sources.map(s => s.name).join(', ')}.`,
      quality: why.qualityScore !== undefined
        ? `Качество данных: ${why.qualityScore}% (${why.trustBadge}).`
        : '',
      confidence: `Уровень уверенности: ${why.confidence === 'high' ? 'высокий' : why.confidence === 'medium' ? 'средний' : 'низкий'}.`,
    },
    en: {
      intro: `**${why.kpiName}** shows ${why.definition}`,
      value: `Current value: ${formatValue(why.currentValue.value, why.currentValue.currency)} as of ${formatDate(why.asOf, locale)}.`,
      formula: why.formula ? `Calculated using formula: ${why.formula}` : '',
      sources: `Data sourced from: ${why.sources.map(s => s.name).join(', ')}.`,
      quality: why.qualityScore !== undefined
        ? `Data quality: ${why.qualityScore}% (${why.trustBadge}).`
        : '',
      confidence: `Confidence level: ${why.confidence}.`,
    },
    uk: {
      intro: `**${why.kpiName}** показує ${why.definition}`,
      value: `Поточне значення: ${formatValue(why.currentValue.value, why.currentValue.currency)} станом на ${formatDate(why.asOf, locale)}.`,
      formula: why.formula ? `Розрахунок виконується за формулою: ${why.formula}` : '',
      sources: `Дані отримані з: ${why.sources.map(s => s.name).join(', ')}.`,
      quality: why.qualityScore !== undefined
        ? `Якість даних: ${why.qualityScore}% (${why.trustBadge}).`
        : '',
      confidence: `Рівень впевненості: ${why.confidence === 'high' ? 'високий' : why.confidence === 'medium' ? 'середній' : 'низький'}.`,
    },
  };

  const t = templates[locale];
  const text = [t.intro, t.value, t.formula, t.sources, t.quality, t.confidence].filter(Boolean).join('\n\n');

  return {
    text,
    confidence: why.confidence,
    sources: why.sources.map(s => s.name),
    assumptions: why.assumptions,
    disclaimer: DISCLAIMER[locale],
  };
}

// Helper functions
function formatValue(value: number, currency?: string): string {
  if (currency) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat('ru-RU').format(value);
}

function formatDate(dateStr: string, locale: 'ru' | 'en' | 'uk'): string {
  const localeMap = { ru: 'ru-RU', en: 'en-US', uk: 'uk-UA' };
  return new Date(dateStr).toLocaleDateString(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
