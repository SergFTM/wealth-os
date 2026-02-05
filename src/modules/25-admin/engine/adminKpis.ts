/**
 * Admin KPIs Calculator
 * Calculates KPIs for admin dashboard
 */

import { Branding } from '../schema/branding';
import { PortalConfig } from '../schema/portalConfig';
import { LanguageConfig } from '../schema/languageOverrides';
import { NotificationTemplate } from '../schema/notificationTemplate';
import { PolicyBanner } from '../schema/policyBanner';
import { FeatureFlag } from '../schema/featureFlag';
import { TenantDomain } from '../schema/tenantDomain';
import { DataPolicy } from '../schema/dataPolicy';

export interface AdminKpis {
  brandingConfigured: boolean;
  portalModulesEnabled: number;
  languageOverrides: number;
  notificationTemplates: number;
  activePolicyBanners: number;
  featureFlagsEnabled: number;
  domainsConfigured: number;
  retentionDays: number;
}

export function calculateAdminKpis(
  branding: Branding | null,
  portalConfig: PortalConfig | null,
  languageConfig: LanguageConfig | null,
  templates: NotificationTemplate[],
  banners: PolicyBanner[],
  flags: FeatureFlag[],
  domains: TenantDomain | null,
  dataPolicy: DataPolicy | null
): AdminKpis {
  return {
    brandingConfigured: branding !== null && branding.id !== 'default',
    portalModulesEnabled: portalConfig?.allowedModules?.length || 0,
    languageOverrides: languageConfig?.overrides?.length || 0,
    notificationTemplates: templates.filter(t => t.isActive).length,
    activePolicyBanners: banners.filter(b => b.status === 'active').length,
    featureFlagsEnabled: flags.filter(f => f.enabled).length,
    domainsConfigured: domains?.customDomains?.length || 0,
    retentionDays: dataPolicy?.retentionDays || 2555,
  };
}

export function getKpiStatus(key: keyof AdminKpis, value: number | boolean): 'ok' | 'warning' | 'critical' {
  switch (key) {
    case 'brandingConfigured':
      return value ? 'ok' : 'warning';
    case 'portalModulesEnabled':
      return (value as number) > 0 ? 'ok' : 'warning';
    case 'activePolicyBanners':
      return (value as number) > 0 ? 'ok' : 'warning';
    case 'featureFlagsEnabled':
      return 'ok';
    case 'retentionDays':
      return (value as number) >= 365 ? 'ok' : 'warning';
    default:
      return 'ok';
  }
}

export function formatKpiValue(key: keyof AdminKpis, value: number | boolean): string {
  if (typeof value === 'boolean') {
    return value ? 'Да' : 'Нет';
  }
  return value.toString();
}
