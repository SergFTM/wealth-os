/**
 * Admin KPIs API
 * Returns aggregated KPIs for admin dashboard
 */

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

async function readJsonFile(filename: string) {
  try {
    const content = await readFile(
      path.join(process.cwd(), 'src/db/data', filename),
      'utf-8'
    );
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function GET() {
  const [
    brandings,
    portalConfigs,
    languageConfigs,
    templates,
    banners,
    flags,
    domains,
    dataPolicies,
  ] = await Promise.all([
    readJsonFile('brandings.json'),
    readJsonFile('portalConfigs.json'),
    readJsonFile('languageConfigs.json'),
    readJsonFile('notificationTemplates.json'),
    readJsonFile('policyBanners.json'),
    readJsonFile('featureFlags.json'),
    readJsonFile('tenantDomains.json'),
    readJsonFile('dataPolicies.json'),
  ]);

  const branding = brandings[0];
  const portalConfig = portalConfigs[0];
  const languageConfig = languageConfigs[0];
  const domain = domains[0];
  const dataPolicy = dataPolicies[0];

  const kpis = {
    brandingConfigured: branding !== undefined && branding.id !== 'default',
    portalModulesEnabled: portalConfig?.allowedModules?.length || 0,
    languageOverrides: languageConfig?.overrides?.length || 0,
    notificationTemplates: templates.filter((t: { isActive: boolean }) => t.isActive).length,
    activePolicyBanners: banners.filter((b: { status: string }) => b.status === 'active').length,
    featureFlagsEnabled: flags.filter((f: { enabled: boolean }) => f.enabled).length,
    domainsConfigured: domain?.customDomains?.length || 0,
    retentionDays: dataPolicy?.retentionDays || 2555,
  };

  return NextResponse.json({ data: kpis });
}
