// AI responses in portal mode
// Rules: no internal notes, sources required, as-of required,
// confidence required, disclaimers (AI, tax, trust)

import { Locale } from '@/lib/i18n';
import { PORTAL_DISCLAIMERS } from '../config';

export interface PortalAiResponse {
  answer: string;
  sources: string[];
  asOfDate: string;
  confidence: 'high' | 'medium' | 'low';
  assumptions: string[];
  disclaimers: string[];
  locale: Locale;
}

export function buildPortalAiResponse(
  answer: string,
  opts: {
    sources: string[];
    asOfDate: string;
    confidence: 'high' | 'medium' | 'low';
    assumptions?: string[];
    locale?: Locale;
    includeTaxDisclaimer?: boolean;
    includeTrustDisclaimer?: boolean;
  }
): PortalAiResponse {
  const locale = opts.locale || 'ru';
  const disclaimers = [PORTAL_DISCLAIMERS.ai[locale]];

  if (opts.includeTaxDisclaimer) {
    disclaimers.push(PORTAL_DISCLAIMERS.tax[locale]);
  }
  if (opts.includeTrustDisclaimer) {
    disclaimers.push(PORTAL_DISCLAIMERS.trust[locale]);
  }

  return {
    answer,
    sources: opts.sources,
    asOfDate: opts.asOfDate,
    confidence: opts.confidence,
    assumptions: opts.assumptions || [],
    disclaimers,
    locale
  };
}

export function getExplainNetWorthPrompt(locale: Locale): string {
  const prompts: Record<string, string> = {
    ru: 'Объясните изменение чистой стоимости простым языком. Укажите основные факторы роста или снижения. Без внутренних комментариев.',
    en: 'Explain the net worth change in simple terms. Highlight key growth or decline factors. No internal comments.',
    uk: 'Поясніть зміну чистої вартості простою мовою. Вкажіть основні фактори зростання або зниження. Без внутрішніх коментарів.'
  };
  return prompts[locale];
}

export function getExplainPerformancePrompt(locale: Locale): string {
  const prompts: Record<string, string> = {
    ru: 'Объясните результаты доходности портфеля простым языком. Какие факторы повлияли на результат? Без внутренних комментариев.',
    en: 'Explain portfolio performance results in simple terms. What factors influenced the results? No internal comments.',
    uk: 'Поясніть результати дохідності портфеля простою мовою. Які фактори вплинули на результат? Без внутрішніх коментарів.'
  };
  return prompts[locale];
}
