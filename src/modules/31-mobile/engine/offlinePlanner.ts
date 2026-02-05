/**
 * Offline planner utilities for Mobile module
 * MVP: Snapshot-based offline caching without service worker
 */

export interface OfflinePlan {
  id: string;
  clientId: string;
  userId: string;
  planName: string;
  audience: 'portal' | 'staff';
  routesJson: string[];
  cacheStrategy: 'static' | 'stale-while-revalidate' | 'network-first';
  payloadJson: Record<string, unknown>;
  payloadSizeBytes: number;
  maxAgeDays: number;
  status: 'active' | 'stale' | 'expired';
  lastSyncedAt: string | null;
  createdAt: string;
}

export interface OfflineRoute {
  path: string;
  label: { ru: string; en: string; uk: string };
  audience: 'portal' | 'staff';
}

export function getAvailableRoutes(): OfflineRoute[] {
  return [
    { path: '/portal', label: { ru: 'Портал: Главная', en: 'Portal: Home', uk: 'Портал: Головна' }, audience: 'portal' },
    { path: '/portal/reports', label: { ru: 'Портал: Отчеты', en: 'Portal: Reports', uk: 'Портал: Звіти' }, audience: 'portal' },
    { path: '/portal/documents', label: { ru: 'Портал: Документы', en: 'Portal: Documents', uk: 'Портал: Документи' }, audience: 'portal' },
    { path: '/portal/messages', label: { ru: 'Портал: Сообщения', en: 'Portal: Messages', uk: 'Портал: Повідомлення' }, audience: 'portal' },
    { path: '/portal/performance', label: { ru: 'Портал: Performance', en: 'Portal: Performance', uk: 'Портал: Performance' }, audience: 'portal' },
    { path: '/portal/fees', label: { ru: 'Портал: Счета', en: 'Portal: Fees', uk: 'Портал: Рахунки' }, audience: 'portal' },
    { path: '/m/tasks', label: { ru: 'Staff: Задачи', en: 'Staff: Tasks', uk: 'Staff: Задачі' }, audience: 'staff' },
    { path: '/m/approvals', label: { ru: 'Staff: Согласования', en: 'Staff: Approvals', uk: 'Staff: Погодження' }, audience: 'staff' },
    { path: '/m/risk/alerts', label: { ru: 'Staff: Risk Alerts', en: 'Staff: Risk Alerts', uk: 'Staff: Risk Alerts' }, audience: 'staff' },
    { path: '/m/reports', label: { ru: 'Staff: Отчеты', en: 'Staff: Reports', uk: 'Staff: Звіти' }, audience: 'staff' },
    { path: '/m/clients', label: { ru: 'Staff: Клиенты', en: 'Staff: Clients', uk: 'Staff: Клієнти' }, audience: 'staff' },
  ];
}

export function getCacheStrategies() {
  return [
    { value: 'static', label: { ru: 'Статический', en: 'Static', uk: 'Статичний' } },
    { value: 'stale-while-revalidate', label: { ru: 'Stale While Revalidate', en: 'Stale While Revalidate', uk: 'Stale While Revalidate' } },
    { value: 'network-first', label: { ru: 'Network First', en: 'Network First', uk: 'Network First' } },
  ];
}

export interface SyncResult {
  success: boolean;
  planId: string;
  syncedAt: string;
  payloadSizeBytes: number;
  routesSynced: number;
}

/**
 * Generate a mock offline snapshot payload
 * In MVP, this simulates what a real service worker would cache
 */
export function generateOfflinePayload(audience: 'portal' | 'staff'): Record<string, unknown> {
  if (audience === 'portal') {
    return {
      networth: 47250000,
      changeMonth: 0.024,
      lastReport: 'Q4-2024',
      openRequests: 3,
      unpaidInvoices: 1,
      recentDocuments: [
        { id: 'doc-1', name: 'Annual Review 2024', category: 'Reports' },
        { id: 'doc-2', name: 'IPS Statement', category: 'Policies' },
      ],
      cachedAt: new Date().toISOString(),
    };
  }
  return {
    pendingTasks: 8,
    pendingApprovals: 3,
    criticalAlerts: 1,
    clientsCount: 45,
    todayMeetings: 2,
    cachedAt: new Date().toISOString(),
  };
}

export function calculatePayloadSize(payload: Record<string, unknown>): number {
  return JSON.stringify(payload).length;
}

export function isPlanStale(plan: OfflinePlan): boolean {
  if (!plan.lastSyncedAt) return true;
  const syncDate = new Date(plan.lastSyncedAt);
  const now = new Date();
  const daysDiff = (now.getTime() - syncDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff > plan.maxAgeDays;
}

export function getDefaultPlanConfig(audience: 'portal' | 'staff') {
  if (audience === 'portal') {
    return {
      planName: 'Portal Basic',
      routesJson: ['/portal', '/portal/reports', '/portal/documents'],
      cacheStrategy: 'stale-while-revalidate' as const,
      maxAgeDays: 7,
    };
  }
  return {
    planName: 'Staff Tasks',
    routesJson: ['/m/tasks', '/m/approvals', '/m/risk/alerts'],
    cacheStrategy: 'network-first' as const,
    maxAgeDays: 1,
  };
}
