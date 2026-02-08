// Portal audit-lite: track what client viewed / downloaded

export interface PortalView {
  id: string;
  portalUserId: string;
  actionKey: 'view' | 'download';
  targetRefJson: { collection: string; id: string };
  at: string;
  ipMasked?: string;
  metaJson?: Record<string, unknown>;
}

export function createViewRecord(
  portalUserId: string,
  action: 'view' | 'download',
  collection: string,
  recordId: string,
  meta?: Record<string, unknown>
): Omit<PortalView, 'id'> {
  return {
    portalUserId,
    actionKey: action,
    targetRefJson: { collection, id: recordId },
    at: new Date().toISOString(),
    metaJson: meta
  };
}

export function filterViewsLast30d(views: PortalView[]): PortalView[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  return views.filter(v => new Date(v.at) >= cutoff);
}

export function groupViewsByDate(views: PortalView[]): Record<string, PortalView[]> {
  const grouped: Record<string, PortalView[]> = {};
  for (const view of views) {
    const dateKey = view.at.split('T')[0];
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(view);
  }
  return grouped;
}

export function countViewsByAction(views: PortalView[]): { views: number; downloads: number } {
  let viewCount = 0;
  let downloadCount = 0;
  for (const v of views) {
    if (v.actionKey === 'view') viewCount++;
    else downloadCount++;
  }
  return { views: viewCount, downloads: downloadCount };
}
