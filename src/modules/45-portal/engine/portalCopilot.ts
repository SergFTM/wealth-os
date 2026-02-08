// Module 45: Portal Copilot - Client-Safe AI Assistant

import { portalI18n, Locale, NetWorthSummary, PerformanceSummary, LiquiditySummary } from '../types';

export interface CopilotQuery {
  query: string;
  context?: CopilotContext;
  locale?: Locale;
}

export interface CopilotContext {
  netWorth?: NetWorthSummary;
  performance?: PerformanceSummary;
  liquidity?: LiquiditySummary;
  recentChanges?: Array<{
    date: string;
    description: string;
    impact?: number;
  }>;
}

export interface CopilotResponse {
  answer: string;
  confidence: 'high' | 'medium' | 'low';
  sources: CopilotSource[];
  assumptions: string[];
  disclaimer: string;
  insufficientData: boolean;
}

export interface CopilotSource {
  type: string;
  label: string;
  asOfDate?: string;
}

// Predefined query patterns
const queryPatterns = {
  netWorthChange: /изменил|изменен|капитал|net\s*worth|состояни/i,
  performance: /доходност|performance|результат|прибыл/i,
  liquidity: /ликвидност|денежн|cash|наличн/i,
  forecast: /прогноз|forecast|ожида|план/i,
  explain: /объясн|explain|поясн|расскаж/i,
  compare: /сравн|compare|разниц|versus/i,
};

// Process copilot query (client-safe)
export function processCopilotQuery(query: CopilotQuery): CopilotResponse {
  const locale = query.locale || 'ru';
  const context = query.context;

  // Check for insufficient data
  if (!context || (!context.netWorth && !context.performance && !context.liquidity)) {
    return createInsufficientDataResponse(locale);
  }

  // Detect query intent
  const intent = detectQueryIntent(query.query);

  // Generate response based on intent
  switch (intent) {
    case 'netWorthChange':
      return generateNetWorthChangeResponse(context, locale);
    case 'performance':
      return generatePerformanceResponse(context, locale);
    case 'liquidity':
      return generateLiquidityResponse(context, locale);
    case 'forecast':
      return generateForecastResponse(context, locale);
    case 'explain':
      return generateExplanationResponse(context, locale);
    default:
      return generateGeneralResponse(context, locale);
  }
}

// Detect query intent
function detectQueryIntent(queryText: string): string {
  for (const [intent, pattern] of Object.entries(queryPatterns)) {
    if (pattern.test(queryText)) {
      return intent;
    }
  }
  return 'general';
}

// Generate insufficient data response
function createInsufficientDataResponse(locale: Locale): CopilotResponse {
  const messages: Record<Locale, string> = {
    ru: 'Недостаточно данных для формирования ответа. Пожалуйста, попробуйте позже.',
    en: 'Insufficient data to generate a response. Please try again later.',
    uk: 'Недостатньо даних для формування відповіді. Будь ласка, спробуйте пізніше.',
  };

  return {
    answer: messages[locale],
    confidence: 'low',
    sources: [],
    assumptions: [],
    disclaimer: portalI18n.disclaimers.ai[locale],
    insufficientData: true,
  };
}

// Generate net worth change response
function generateNetWorthChangeResponse(context: CopilotContext, locale: Locale): CopilotResponse {
  const nw = context.netWorth;
  if (!nw) {
    return createInsufficientDataResponse(locale);
  }

  const changeDirection = nw.change30d >= 0 ? 'вырос' : 'снизился';
  const changeAbs = Math.abs(nw.change30d);
  const changePercent = Math.abs(nw.changePercent30d).toFixed(1);

  const answers: Record<Locale, string> = {
    ru: `За последние 30 дней ваш капитал ${changeDirection} на ${formatNumber(changeAbs)} (${changePercent}%). ` +
        `Текущая стоимость составляет ${formatNumber(nw.total)}. ` +
        `Основные изменения произошли в следующих классах активов: ${nw.byAssetClass.slice(0, 3).map(a => a.name).join(', ')}.`,
    en: `Over the last 30 days, your net worth has ${nw.change30d >= 0 ? 'increased' : 'decreased'} by ${formatNumber(changeAbs)} (${changePercent}%). ` +
        `Current value is ${formatNumber(nw.total)}. ` +
        `Main changes occurred in: ${nw.byAssetClass.slice(0, 3).map(a => a.name).join(', ')}.`,
    uk: `За останні 30 днів ваш капітал ${nw.change30d >= 0 ? 'зріс' : 'знизився'} на ${formatNumber(changeAbs)} (${changePercent}%). ` +
        `Поточна вартість становить ${formatNumber(nw.total)}. ` +
        `Основні зміни відбулися у: ${nw.byAssetClass.slice(0, 3).map(a => a.name).join(', ')}.`,
  };

  return {
    answer: answers[locale],
    confidence: 'high',
    sources: [
      { type: 'netWorth', label: 'Net Worth Snapshot', asOfDate: nw.asOfDate },
    ],
    assumptions: [
      locale === 'ru' ? 'Изменения рассчитаны за 30 календарных дней' :
        locale === 'en' ? 'Changes calculated over 30 calendar days' :
          'Зміни розраховані за 30 календарних днів',
    ],
    disclaimer: portalI18n.disclaimers.ai[locale],
    insufficientData: false,
  };
}

// Generate performance response
function generatePerformanceResponse(context: CopilotContext, locale: Locale): CopilotResponse {
  const perf = context.performance;
  if (!perf || !perf.periods.length) {
    return createInsufficientDataResponse(locale);
  }

  const ytd = perf.periods.find(p => p.period === 'YTD');
  const oneYear = perf.periods.find(p => p.period === '1Y');

  const perfData = ytd || perf.periods[0];
  const returnStr = `${perfData.return >= 0 ? '+' : ''}${perfData.return.toFixed(2)}%`;
  const benchmarkStr = perfData.benchmark !== undefined
    ? `${perfData.benchmark >= 0 ? '+' : ''}${perfData.benchmark.toFixed(2)}%`
    : null;

  const answers: Record<Locale, string> = {
    ru: `Доходность вашего портфеля за период ${perfData.period}: ${returnStr}. ` +
        (benchmarkStr ? `Бенчмарк (${perf.benchmarkName}): ${benchmarkStr}. ` : '') +
        `Данные актуальны на ${formatDate(perf.asOfDate, locale)}.`,
    en: `Your portfolio performance for ${perfData.period}: ${returnStr}. ` +
        (benchmarkStr ? `Benchmark (${perf.benchmarkName}): ${benchmarkStr}. ` : '') +
        `Data as of ${formatDate(perf.asOfDate, locale)}.`,
    uk: `Дохідність вашого портфеля за період ${perfData.period}: ${returnStr}. ` +
        (benchmarkStr ? `Бенчмарк (${perf.benchmarkName}): ${benchmarkStr}. ` : '') +
        `Дані актуальні на ${formatDate(perf.asOfDate, locale)}.`,
  };

  return {
    answer: answers[locale],
    confidence: 'high',
    sources: [
      { type: 'performance', label: 'Performance Report', asOfDate: perf.asOfDate },
    ],
    assumptions: [
      locale === 'ru' ? 'Доходность рассчитана по TWR методологии' :
        locale === 'en' ? 'Returns calculated using TWR methodology' :
          'Дохідність розрахована за TWR методологією',
    ],
    disclaimer: portalI18n.disclaimers.investment[locale],
    insufficientData: false,
  };
}

// Generate liquidity response
function generateLiquidityResponse(context: CopilotContext, locale: Locale): CopilotResponse {
  const liq = context.liquidity;
  if (!liq) {
    return createInsufficientDataResponse(locale);
  }

  const alerts = liq.alerts.length > 0
    ? liq.alerts.map(a => a.message).join('; ')
    : locale === 'ru' ? 'Нет критических уведомлений' :
      locale === 'en' ? 'No critical alerts' : 'Немає критичних повідомлень';

  const answers: Record<Locale, string> = {
    ru: `Текущие денежные средства: ${formatNumber(liq.cashToday)}. ` +
        `Прогноз на 30 дней: ${formatNumber(liq.cashForecast30d)}. ` +
        `Ожидаемые поступления: ${formatNumber(liq.inflows30d)}, расходы: ${formatNumber(liq.outflows30d)}. ` +
        `Уведомления: ${alerts}.`,
    en: `Current cash: ${formatNumber(liq.cashToday)}. ` +
        `30-day forecast: ${formatNumber(liq.cashForecast30d)}. ` +
        `Expected inflows: ${formatNumber(liq.inflows30d)}, outflows: ${formatNumber(liq.outflows30d)}. ` +
        `Alerts: ${alerts}.`,
    uk: `Поточні грошові кошти: ${formatNumber(liq.cashToday)}. ` +
        `Прогноз на 30 днів: ${formatNumber(liq.cashForecast30d)}. ` +
        `Очікувані надходження: ${formatNumber(liq.inflows30d)}, витрати: ${formatNumber(liq.outflows30d)}. ` +
        `Повідомлення: ${alerts}.`,
  };

  return {
    answer: answers[locale],
    confidence: 'medium',
    sources: [
      { type: 'liquidity', label: 'Liquidity Forecast', asOfDate: liq.asOfDate },
    ],
    assumptions: [
      locale === 'ru' ? 'Прогноз основан на плановых операциях' :
        locale === 'en' ? 'Forecast based on planned operations' :
          'Прогноз базується на планових операціях',
    ],
    disclaimer: portalI18n.disclaimers.forecast[locale],
    insufficientData: false,
  };
}

// Generate forecast response
function generateForecastResponse(context: CopilotContext, locale: Locale): CopilotResponse {
  return generateLiquidityResponse(context, locale);
}

// Generate explanation response
function generateExplanationResponse(context: CopilotContext, locale: Locale): CopilotResponse {
  // Combine all available data into an explanation
  const parts: string[] = [];

  if (context.netWorth) {
    const nw = context.netWorth;
    parts.push(locale === 'ru'
      ? `Ваш капитал составляет ${formatNumber(nw.total)}, изменение за месяц: ${nw.change30d >= 0 ? '+' : ''}${formatNumber(nw.change30d)}.`
      : locale === 'en'
        ? `Your net worth is ${formatNumber(nw.total)}, monthly change: ${nw.change30d >= 0 ? '+' : ''}${formatNumber(nw.change30d)}.`
        : `Ваш капітал становить ${formatNumber(nw.total)}, зміна за місяць: ${nw.change30d >= 0 ? '+' : ''}${formatNumber(nw.change30d)}.`);
  }

  if (context.performance) {
    const ytd = context.performance.periods.find(p => p.period === 'YTD');
    if (ytd) {
      parts.push(locale === 'ru'
        ? `Доходность с начала года: ${ytd.return >= 0 ? '+' : ''}${ytd.return.toFixed(2)}%.`
        : locale === 'en'
          ? `Year-to-date return: ${ytd.return >= 0 ? '+' : ''}${ytd.return.toFixed(2)}%.`
          : `Дохідність з початку року: ${ytd.return >= 0 ? '+' : ''}${ytd.return.toFixed(2)}%.`);
    }
  }

  if (context.liquidity) {
    const liq = context.liquidity;
    parts.push(locale === 'ru'
      ? `Доступные денежные средства: ${formatNumber(liq.cashToday)}.`
      : locale === 'en'
        ? `Available cash: ${formatNumber(liq.cashToday)}.`
        : `Доступні грошові кошти: ${formatNumber(liq.cashToday)}.`);
  }

  if (parts.length === 0) {
    return createInsufficientDataResponse(locale);
  }

  const sources: CopilotSource[] = [];
  if (context.netWorth) sources.push({ type: 'netWorth', label: 'Net Worth', asOfDate: context.netWorth.asOfDate });
  if (context.performance) sources.push({ type: 'performance', label: 'Performance', asOfDate: context.performance.asOfDate });
  if (context.liquidity) sources.push({ type: 'liquidity', label: 'Liquidity', asOfDate: context.liquidity.asOfDate });

  return {
    answer: parts.join(' '),
    confidence: 'high',
    sources,
    assumptions: [],
    disclaimer: portalI18n.disclaimers.ai[locale],
    insufficientData: false,
  };
}

// Generate general response
function generateGeneralResponse(context: CopilotContext, locale: Locale): CopilotResponse {
  return generateExplanationResponse(context, locale);
}

// Helper: Format number as currency
function formatNumber(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Helper: Format date
function formatDate(dateStr: string, locale: Locale): string {
  const date = new Date(dateStr);
  const localeMap: Record<Locale, string> = {
    ru: 'ru-RU',
    en: 'en-US',
    uk: 'uk-UA',
  };
  return date.toLocaleDateString(localeMap[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Suggested queries for the copilot UI
export function getSuggestedQueries(locale: Locale): string[] {
  const suggestions: Record<Locale, string[]> = {
    ru: [
      'Что изменилось в моем капитале за 30 дней?',
      'Какова доходность моего портфеля?',
      'Каково состояние моей ликвидности?',
      'Объясни текущую ситуацию простыми словами',
    ],
    en: [
      'What changed in my net worth over 30 days?',
      'What is my portfolio performance?',
      'What is my liquidity status?',
      'Explain my current situation in simple terms',
    ],
    uk: [
      'Що змінилося в моєму капіталі за 30 днів?',
      'Яка дохідність мого портфеля?',
      'Який стан моєї ліквідності?',
      'Поясни поточну ситуацію простими словами',
    ],
  };

  return suggestions[locale];
}
