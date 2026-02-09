/**
 * Policy Banner Manager Engine
 * Retrieves and filters policy banners for modules
 */

import { PolicyBanner, PolicyModuleKey, PolicyPlacement, PolicySeverity } from '../schema/policyBanner';
import { SupportedLanguage } from '../schema/languageOverrides';

export interface ResolvedBanner {
  id: string;
  text: string;
  severity: PolicySeverity;
  placement: PolicyPlacement;
  moduleKey: PolicyModuleKey;
}

export function getBannersForModule(
  banners: PolicyBanner[],
  moduleKey: PolicyModuleKey,
  lang: SupportedLanguage = 'en'
): ResolvedBanner[] {
  const activeBanners = banners.filter(
    b => b.status === 'active' && (b.moduleKey === moduleKey || b.moduleKey === 'global')
  );

  // Sort by order, then by moduleKey (module-specific first)
  activeBanners.sort((a, b) => {
    if (a.moduleKey === moduleKey && b.moduleKey === 'global') return -1;
    if (a.moduleKey === 'global' && b.moduleKey === moduleKey) return 1;
    return a.order - b.order;
  });

  return activeBanners.map(banner => ({
    id: banner.id,
    text: getBannerText(banner, lang),
    severity: banner.severity,
    placement: banner.placement,
    moduleKey: banner.moduleKey,
  }));
}

export function getBannerText(
  banner: PolicyBanner,
  lang: SupportedLanguage
): string {
  switch (lang) {
    case 'ru': return banner.textRu;
    case 'uk': return banner.textUk || banner.textRu;
    default: return banner.textEn || banner.textRu;
  }
}

export function getTopBanners(
  banners: PolicyBanner[],
  moduleKey: PolicyModuleKey,
  lang: SupportedLanguage = 'en'
): ResolvedBanner[] {
  return getBannersForModule(banners, moduleKey, lang)
    .filter(b => b.placement === 'top-banner');
}

export function getFooterBanners(
  banners: PolicyBanner[],
  moduleKey: PolicyModuleKey,
  lang: SupportedLanguage = 'en'
): ResolvedBanner[] {
  return getBannersForModule(banners, moduleKey, lang)
    .filter(b => b.placement === 'section-footer');
}

export function getGlobalBanners(
  banners: PolicyBanner[],
  lang: SupportedLanguage = 'en'
): ResolvedBanner[] {
  return getBannersForModule(banners, 'global', lang);
}

export function countActiveBanners(banners: PolicyBanner[]): number {
  return banners.filter(b => b.status === 'active').length;
}

export function countBannersByModule(
  banners: PolicyBanner[]
): Record<PolicyModuleKey, number> {
  const counts: Record<PolicyModuleKey, number> = {
    tax: 0,
    trusts: 0,
    ai: 0,
    api: 0,
    reports: 0,
    global: 0,
  };

  banners.forEach(b => {
    if (b.status === 'active') {
      counts[b.moduleKey]++;
    }
  });

  return counts;
}
