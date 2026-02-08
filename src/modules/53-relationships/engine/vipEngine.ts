/**
 * VIP Engine
 * Builds VIP cockpit views by aggregating data from multiple sources
 */

export interface VipSnapshot {
  openItems: number;
  openInitiatives: number;
  overdueFollowups: number;
  pendingApprovals: number;
  nextMeeting?: string;
  nextMeetingTitle?: string;
  cashAlertSummary?: string;
  recentChanges: Array<{
    type: string;
    summary: string;
    timestamp: string;
  }>;
  alerts: Array<{
    level: 'info' | 'warning' | 'critical';
    message: string;
  }>;
}

export interface RelVipView {
  id: string;
  clientId: string;
  householdId: string;
  computedAt: string;
  snapshotJson: VipSnapshot;
  createdAt: string;
}

export interface RelHousehold {
  id: string;
  clientId: string;
  name: string;
  tierKey: 'A' | 'B' | 'C';
  primaryRmUserId: string;
  membersMdmIdsJson: string[];
  clientSafePublished: boolean;
}

export interface VipCockpitData {
  household: RelHousehold;
  vipView?: RelVipView;
  isStale: boolean;
}

export async function computeVipView(
  householdId: string,
  clientId: string,
  apiBase: string = '/api/collections'
): Promise<VipSnapshot> {
  // Fetch related data
  const [
    initiativesRes,
    interactionsRes,
    approvalsRes,
    eventsRes,
  ] = await Promise.all([
    fetch(`${apiBase}/relInitiatives?search=${householdId}`),
    fetch(`${apiBase}/relInteractions?search=${householdId}`),
    fetch(`${apiBase}/approvals?status=pending`),
    fetch(`${apiBase}/calendarEvents?limit=5`),
  ]);

  const initiatives = initiativesRes.ok ? (await initiativesRes.json()).items || [] : [];
  const interactions = interactionsRes.ok ? (await interactionsRes.json()).items || [] : [];
  const approvals = approvalsRes.ok ? (await approvalsRes.json()).items || [] : [];
  const events = eventsRes.ok ? (await eventsRes.json()).items || [] : [];

  // Calculate metrics
  const openInitiatives = initiatives.filter((i: any) => i.stageKey !== 'done').length;

  const now = new Date();
  const overdueFollowups = interactions.filter((i: any) =>
    i.statusKey === 'open' &&
    i.followUpDueAt &&
    new Date(i.followUpDueAt) < now
  ).length;

  const pendingApprovals = approvals.length;

  // Find next meeting
  const upcomingEvents = events
    .filter((e: any) => new Date(e.startAt || e.start) > now)
    .sort((a: any, b: any) =>
      new Date(a.startAt || a.start).getTime() - new Date(b.startAt || b.start).getTime()
    );

  const nextEvent = upcomingEvents[0];

  // Calculate open items (sum of various open items)
  const openItems = openInitiatives + overdueFollowups + pendingApprovals;

  // Recent changes from interactions
  const recentChanges = interactions
    .slice(0, 5)
    .map((i: any) => ({
      type: i.interactionTypeKey,
      summary: i.summary,
      timestamp: i.occurredAt,
    }));

  // Build alerts
  const alerts: VipSnapshot['alerts'] = [];

  if (overdueFollowups > 0) {
    alerts.push({
      level: 'warning',
      message: `${overdueFollowups} просроченных follow-up`,
    });
  }

  if (pendingApprovals > 0) {
    alerts.push({
      level: 'info',
      message: `${pendingApprovals} согласований ожидают`,
    });
  }

  return {
    openItems,
    openInitiatives,
    overdueFollowups,
    pendingApprovals,
    nextMeeting: nextEvent?.startAt || nextEvent?.start,
    nextMeetingTitle: nextEvent?.title,
    recentChanges,
    alerts,
  };
}

export async function saveVipView(
  householdId: string,
  clientId: string,
  snapshot: VipSnapshot,
  apiBase: string = '/api/collections'
): Promise<RelVipView> {
  const record = {
    clientId,
    householdId,
    computedAt: new Date().toISOString(),
    snapshotJson: snapshot,
  };

  const res = await fetch(`${apiBase}/relVipViews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });

  if (!res.ok) throw new Error('Failed to save VIP view');
  return res.json();
}

export async function refreshVipView(
  householdId: string,
  clientId: string,
  apiBase: string = '/api/collections'
): Promise<RelVipView> {
  const snapshot = await computeVipView(householdId, clientId, apiBase);
  return saveVipView(householdId, clientId, snapshot, apiBase);
}

export function isVipViewStale(vipView: RelVipView, maxAgeMinutes: number = 30): boolean {
  const computedAt = new Date(vipView.computedAt);
  const now = new Date();
  const ageMs = now.getTime() - computedAt.getTime();
  return ageMs > maxAgeMinutes * 60 * 1000;
}

export function getVipHouseholds(households: RelHousehold[]): RelHousehold[] {
  return households.filter(h => h.tierKey === 'A');
}

export function sortByPriority(vipData: VipCockpitData[]): VipCockpitData[] {
  return [...vipData].sort((a, b) => {
    // Sort by open items descending
    const aItems = a.vipView?.snapshotJson.openItems || 0;
    const bItems = b.vipView?.snapshotJson.openItems || 0;
    if (aItems !== bItems) return bItems - aItems;

    // Then by tier
    const tierOrder = { A: 0, B: 1, C: 2 };
    return tierOrder[a.household.tierKey] - tierOrder[b.household.tierKey];
  });
}

export function getAlertSeverityColor(level: string): string {
  const colors: Record<string, string> = {
    info: 'blue',
    warning: 'amber',
    critical: 'red',
  };
  return colors[level] || 'gray';
}
