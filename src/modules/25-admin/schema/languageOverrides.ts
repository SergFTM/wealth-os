/**
 * Language Overrides Schema
 * i18n settings and term customization
 */

export type SupportedLanguage = 'ru' | 'en' | 'uk';

export interface LanguageOverride {
  key: string;
  valueRu?: string;
  valueEn?: string;
  valueUk?: string;
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

export const languageLabels: Record<SupportedLanguage, { en: string; ru: string; uk: string }> = {
  ru: { en: 'Russian', ru: 'Русский', uk: 'Російська' },
  en: { en: 'English', ru: 'Английский', uk: 'Англійська' },
  uk: { en: 'Ukrainian', ru: 'Украинский', uk: 'Українська' },
};

export const ALL_LANGUAGES: SupportedLanguage[] = ['ru', 'en', 'uk'];

export function getOverrideValue(
  overrides: LanguageOverride[],
  key: string,
  lang: SupportedLanguage
): string | undefined {
  const override = overrides.find(o => o.key === key);
  if (!override) return undefined;
  switch (lang) {
    case 'ru': return override.valueRu;
    case 'en': return override.valueEn;
    case 'uk': return override.valueUk;
  }
}
