import { ModuleConfig } from './types';
import * as configs from './configs';
import { SIDEBAR_CLUSTERS, SLUG_TO_CLUSTER, FALLBACK_CLUSTER_ID, type SidebarCluster } from './clusters';

export const moduleRegistry: ModuleConfig[] = [
  configs.dashboardHome,
  configs.netWorth,
  configs.reconciliation,
  configs.performance,
  configs.reporting,
  configs.generalLedger,
  configs.partnerships,
  configs.privateCapital,
  configs.liquidity,
  configs.documentVault,
  configs.billpayChecks,
  configs.arRevenue,
  configs.feeBilling,
  configs.workflow,
  configs.onboarding,
  configs.ips,
  configs.risk,
  configs.tax,
  configs.trustEstate,
  configs.integrations,
  configs.communications,
  configs.security,
  configs.platform,
  configs.reports,
  configs.api,
  configs.admin,
  configs.planning,
  configs.dataQuality,
  configs.committee,
  configs.deals,
  configs.mobile,
  configs.academy,
  configs.sandbox,
  configs.consents,
  configs.notifications,
  configs.cases,
  configs.exports,
  configs.ideas,
  configs.liquidityPlanning,
  configs.governance,
  configs.calendar,
  configs.dealsCorpActions,
  configs.vendors,
  configs.policies,
  configs.clientPortal,
  configs.mdm,
  configs.exceptions,
  configs.ownership,
  configs.philanthropy,
  configs.credit,
  configs.dataGovernance,
  configs.packs,
  configs.relationships,
  configs.consentPrivacy,
  configs.clientPortalSafe,
].sort((a, b) => a.order - b.order);

export function getModuleBySlug(slug: string): ModuleConfig | undefined {
  return moduleRegistry.find(m => m.slug === slug);
}

export function getVisibleModules(clientSafe: boolean): ModuleConfig[] {
  if (clientSafe) {
    return moduleRegistry.filter(m => !m.clientSafeHidden);
  }
  return moduleRegistry;
}

export interface ClusteredGroup {
  cluster: SidebarCluster;
  modules: ModuleConfig[];
}

export function getClusteredModules(clientSafe: boolean): ClusteredGroup[] {
  const visible = getVisibleModules(clientSafe);
  const groups: Map<number, ModuleConfig[]> = new Map();

  for (const mod of visible) {
    const clusterId = SLUG_TO_CLUSTER[mod.slug] ?? FALLBACK_CLUSTER_ID;
    if (!groups.has(clusterId)) groups.set(clusterId, []);
    groups.get(clusterId)!.push(mod);
  }

  return SIDEBAR_CLUSTERS
    .filter(c => groups.has(c.id))
    .map(c => ({ cluster: c, modules: groups.get(c.id)! }));
}

export function getModulesForCluster(clusterId: number, clientSafe: boolean): ModuleConfig[] {
  const visible = getVisibleModules(clientSafe);
  return visible.filter(mod => (SLUG_TO_CLUSTER[mod.slug] ?? FALLBACK_CLUSTER_ID) === clusterId);
}

export * from './types';
export * from './configs';
export * from './clusters';
