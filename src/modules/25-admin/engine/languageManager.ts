/**
 * Language Manager Engine
 * Handles language configuration and overrides
 */

import { LanguageConfig, SupportedLanguage, LanguageOverride, getOverrideValue } from '../schema/languageOverrides';

export interface TranslationResult {
  value: string;
  isOverridden: boolean;
}

export function translate(
  config: LanguageConfig | null,
  key: string,
  defaultValues: { ru: string; en?: string; uk?: string },
  lang?: SupportedLanguage
): TranslationResult {
  const currentLang = lang || config?.defaultLanguage || 'ru';

  // Check for override first
  if (config?.overrides) {
    const overrideValue = getOverrideValue(config.overrides, key, currentLang);
    if (overrideValue) {
      return { value: overrideValue, isOverridden: true };
    }
  }

  // Return default value
  const defaultValue = currentLang === 'ru' ? defaultValues.ru :
                       currentLang === 'en' ? (defaultValues.en || defaultValues.ru) :
                       (defaultValues.uk || defaultValues.ru);

  return { value: defaultValue, isOverridden: false };
}

export function isLanguageEnabled(
  config: LanguageConfig | null,
  lang: SupportedLanguage
): boolean {
  if (!config) return lang === 'ru'; // Default to RU only
  return config.enabledLanguages?.includes(lang) ?? false;
}

export function getEnabledLanguages(config: LanguageConfig | null): SupportedLanguage[] {
  return config?.enabledLanguages || ['ru'];
}

export function countOverrides(config: LanguageConfig | null): number {
  return config?.overrides?.length || 0;
}

export function exportOverridesAsJson(overrides: LanguageOverride[]): string {
  return JSON.stringify(overrides, null, 2);
}

export function importOverridesFromJson(json: string): LanguageOverride[] | null {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return null;

    // Validate structure
    const isValid = parsed.every(item =>
      typeof item === 'object' &&
      typeof item.key === 'string'
    );

    return isValid ? parsed : null;
  } catch {
    return null;
  }
}

export function getDefaultLanguageConfig(): LanguageConfig {
  return {
    id: 'default',
    defaultLanguage: 'ru',
    enabledLanguages: ['ru', 'en', 'uk'],
    overrides: [],
    updatedAt: new Date().toISOString(),
  };
}

export function mergeOverrides(
  existing: LanguageOverride[],
  imported: LanguageOverride[]
): LanguageOverride[] {
  const merged = [...existing];

  imported.forEach(imp => {
    const existingIndex = merged.findIndex(e => e.key === imp.key);
    if (existingIndex >= 0) {
      merged[existingIndex] = { ...merged[existingIndex], ...imp };
    } else {
      merged.push(imp);
    }
  });

  return merged;
}
