/**
 * Language Overrides Schema
 * i18n settings and term customization
 */

export type SupportedLanguage = 'ru' | 'en' | 'uk' | 'es' | 'de' | 'it' | 'fr' | 'el';

export interface LanguageOverride {
  key: string;
  valueRu?: string;
  valueEn?: string;
  valueUk?: string;
  valueEs?: string;
  valueDe?: string;
  valueIt?: string;
  valueFr?: string;
  valueEl?: string;
}

export interface LanguageConfig {
  id: string;
  clientId?: string;
  defaultLanguage: SupportedLanguage;
  enabledLanguages: SupportedLanguage[];
  overrides: LanguageOverride[];
  updatedAt: string;
}

export interface LanguageConfigCreateInput {
  clientId?: string;
  defaultLanguage?: SupportedLanguage;
  enabledLanguages?: SupportedLanguage[];
  overrides?: LanguageOverride[];
}

export const languageLabels: Record<SupportedLanguage, Record<string, string>> = {
  en: { en: 'English', ru: 'Английский', uk: 'Англійська' },
  ru: { en: 'Russian', ru: 'Русский', uk: 'Російська' },
  uk: { en: 'Ukrainian', ru: 'Украинский', uk: 'Українська' },
  es: { en: 'Spanish', ru: 'Испанский', uk: 'Іспанська' },
  de: { en: 'German', ru: 'Немецкий', uk: 'Німецька' },
  it: { en: 'Italian', ru: 'Итальянский', uk: 'Італійська' },
  fr: { en: 'French', ru: 'Французский', uk: 'Французька' },
  el: { en: 'Greek', ru: 'Греческий', uk: 'Грецька' },
};

export const ALL_LANGUAGES: SupportedLanguage[] = ['en', 'ru', 'uk', 'es', 'de', 'it', 'fr', 'el'];

export function getOverrideValue(
  overrides: LanguageOverride[],
  key: string,
  lang: SupportedLanguage
): string | undefined {
  const override = overrides.find(o => o.key === key);
  if (!override) return undefined;
  switch (lang) {
    case 'ru': return override.valueRu;
    case 'uk': return override.valueUk;
    case 'es': return override.valueEs;
    case 'de': return override.valueDe;
    case 'it': return override.valueIt;
    case 'fr': return override.valueFr;
    case 'el': return override.valueEl;
    default: return override.valueEn;
  }
}
