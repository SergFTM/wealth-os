import { ModuleConfig } from './types';
import * as configs from './configs';

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

export * from './types';
export * from './configs';
