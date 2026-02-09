/**
 * Portal Builder Engine
 * Builds client portal menu and configuration
 */

import { PortalConfig, PortalModule, portalModuleLabels, ALL_PORTAL_MODULES } from '../schema/portalConfig';
import { SupportedLanguage } from '../schema/languageOverrides';

export interface PortalMenuItem {
  key: string;
  label: string;
  href: string;
  icon: string;
}

const moduleToRoute: Record<PortalModule, { href: string; icon: string }> = {
  'net-worth-summary': { href: '/portal/net-worth', icon: 'pie-chart' },
  'documents': { href: '/portal/documents', icon: 'file-text' },
  'communications': { href: '/portal/communications', icon: 'message-square' },
  'reports-share': { href: '/portal/reports', icon: 'bar-chart-2' },
  'invoices-view': { href: '/portal/invoices', icon: 'receipt' },
  'tasks-view': { href: '/portal/tasks', icon: 'check-square' },
};

export function buildPortalMenu(
  config: PortalConfig | null,
  lang: SupportedLanguage = 'en'
): PortalMenuItem[] {
  if (!config || !config.portalEnabled) {
    return [];
  }

  const allowedModules = config.allowedModules || ALL_PORTAL_MODULES;

  return allowedModules.map(moduleKey => {
    // Check for custom label
    const customLabel = config.clientMenuLabels?.find(l => l.moduleKey === moduleKey);
    let label: string;

    if (customLabel) {
      label = lang === 'ru' ? customLabel.labelRu :
              lang === 'uk' ? customLabel.labelUk :
              customLabel.labelEn;
    } else {
      const defaultLabels = portalModuleLabels[moduleKey] as Record<string, string>;
      label = defaultLabels[lang] || defaultLabels['en'];
    }

    const route = moduleToRoute[moduleKey];

    return {
      key: moduleKey,
      label,
      href: route.href,
      icon: route.icon,
    };
  });
}

export function isModuleAllowed(
  config: PortalConfig | null,
  moduleKey: PortalModule
): boolean {
  if (!config || !config.portalEnabled) {
    return false;
  }
  return config.allowedModules?.includes(moduleKey) ?? false;
}

export function getWelcomeMessage(
  config: PortalConfig | null,
  lang: SupportedLanguage = 'en'
): string | null {
  if (!config || !config.showWelcomeMessage) {
    return null;
  }

  switch (lang) {
    case 'ru': return config.welcomeMessageRu || null;
    case 'uk': return config.welcomeMessageUk || null;
    default: return config.welcomeMessageEn || null;
  }
}

export function getDefaultPortalConfig(): PortalConfig {
  return {
    id: 'default',
    portalEnabled: true,
    allowedModules: ['net-worth-summary', 'documents', 'communications'],
    clientMenuLabels: [],
    clientSafeDefault: true,
    showOnlyPublishedPacks: true,
    showWelcomeMessage: false,
    updatedAt: new Date().toISOString(),
  };
}
