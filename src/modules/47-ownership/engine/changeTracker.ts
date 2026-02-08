/**
 * Change Tracker Engine
 * Tracks and records ownership structure changes
 */

export interface OwnershipChange {
  id: string;
  clientId: string;
  changeTypeKey: 'link_created' | 'link_updated' | 'link_deleted' | 'pct_changed' | 'effective_date_changed';
  linkId: string;
  changedFieldsJson: Record<string, { old: unknown; new: unknown }>;
  changedByUserId: string;
  changedAt: string;
  notes?: string;
}

export interface LinkSnapshot {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  ownershipPct: number;
  profitSharePct?: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

/**
 * Create change record for link creation
 */
export function trackLinkCreated(
  clientId: string,
  link: LinkSnapshot,
  userId: string,
  notes?: string
): OwnershipChange {
  return {
    id: generateChangeId(),
    clientId,
    changeTypeKey: 'link_created',
    linkId: link.id,
    changedFieldsJson: {
      fromNodeId: { old: null, new: link.fromNodeId },
      toNodeId: { old: null, new: link.toNodeId },
      ownershipPct: { old: null, new: link.ownershipPct },
      profitSharePct: { old: null, new: link.profitSharePct },
      effectiveFrom: { old: null, new: link.effectiveFrom },
    },
    changedByUserId: userId,
    changedAt: new Date().toISOString(),
    notes,
  };
}

/**
 * Create change record for link update
 */
export function trackLinkUpdated(
  clientId: string,
  oldLink: LinkSnapshot,
  newLink: LinkSnapshot,
  userId: string,
  notes?: string
): OwnershipChange {
  const changedFields: Record<string, { old: unknown; new: unknown }> = {};

  if (oldLink.ownershipPct !== newLink.ownershipPct) {
    changedFields.ownershipPct = { old: oldLink.ownershipPct, new: newLink.ownershipPct };
  }
  if (oldLink.profitSharePct !== newLink.profitSharePct) {
    changedFields.profitSharePct = { old: oldLink.profitSharePct, new: newLink.profitSharePct };
  }
  if (oldLink.effectiveFrom !== newLink.effectiveFrom) {
    changedFields.effectiveFrom = { old: oldLink.effectiveFrom, new: newLink.effectiveFrom };
  }
  if (oldLink.effectiveTo !== newLink.effectiveTo) {
    changedFields.effectiveTo = { old: oldLink.effectiveTo, new: newLink.effectiveTo };
  }

  // Determine specific change type
  let changeType: OwnershipChange['changeTypeKey'] = 'link_updated';
  if (changedFields.ownershipPct || changedFields.profitSharePct) {
    changeType = 'pct_changed';
  } else if (changedFields.effectiveFrom || changedFields.effectiveTo) {
    changeType = 'effective_date_changed';
  }

  return {
    id: generateChangeId(),
    clientId,
    changeTypeKey: changeType,
    linkId: oldLink.id,
    changedFieldsJson: changedFields,
    changedByUserId: userId,
    changedAt: new Date().toISOString(),
    notes,
  };
}

/**
 * Create change record for link deletion
 */
export function trackLinkDeleted(
  clientId: string,
  link: LinkSnapshot,
  userId: string,
  notes?: string
): OwnershipChange {
  return {
    id: generateChangeId(),
    clientId,
    changeTypeKey: 'link_deleted',
    linkId: link.id,
    changedFieldsJson: {
      fromNodeId: { old: link.fromNodeId, new: null },
      toNodeId: { old: link.toNodeId, new: null },
      ownershipPct: { old: link.ownershipPct, new: null },
      profitSharePct: { old: link.profitSharePct, new: null },
      effectiveFrom: { old: link.effectiveFrom, new: null },
      effectiveTo: { old: link.effectiveTo, new: null },
    },
    changedByUserId: userId,
    changedAt: new Date().toISOString(),
    notes,
  };
}

/**
 * Format change for display
 */
export function formatChange(change: OwnershipChange): string {
  const typeLabels: Record<string, string> = {
    link_created: 'Создана связь',
    link_updated: 'Обновлена связь',
    link_deleted: 'Удалена связь',
    pct_changed: 'Изменена доля',
    effective_date_changed: 'Изменена дата',
  };

  let description = typeLabels[change.changeTypeKey] || change.changeTypeKey;

  // Add details for pct changes
  if (change.changeTypeKey === 'pct_changed' && change.changedFieldsJson.ownershipPct) {
    const { old: oldPct, new: newPct } = change.changedFieldsJson.ownershipPct as { old: number; new: number };
    description += `: ${oldPct}% → ${newPct}%`;
  }

  return description;
}

/**
 * Get changes for a specific link
 */
export function filterChangesByLink(changes: OwnershipChange[], linkId: string): OwnershipChange[] {
  return changes.filter(c => c.linkId === linkId);
}

/**
 * Get changes in date range
 */
export function filterChangesByDateRange(
  changes: OwnershipChange[],
  startDate: Date,
  endDate: Date
): OwnershipChange[] {
  return changes.filter(c => {
    const changeDate = new Date(c.changedAt);
    return changeDate >= startDate && changeDate <= endDate;
  });
}

/**
 * Get changes in last N days
 */
export function getRecentChanges(changes: OwnershipChange[], days: number): OwnershipChange[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return changes.filter(c => new Date(c.changedAt) >= cutoff);
}

/**
 * Group changes by date
 */
export function groupChangesByDate(
  changes: OwnershipChange[]
): Map<string, OwnershipChange[]> {
  const groups = new Map<string, OwnershipChange[]>();

  for (const change of changes) {
    const date = change.changedAt.split('T')[0];
    if (!groups.has(date)) {
      groups.set(date, []);
    }
    groups.get(date)!.push(change);
  }

  return groups;
}

/**
 * Generate unique change ID
 */
function generateChangeId(): string {
  return `chg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Summarize changes
 */
export function summarizeChanges(changes: OwnershipChange[]): {
  created: number;
  updated: number;
  deleted: number;
  total: number;
} {
  let created = 0;
  let updated = 0;
  let deleted = 0;

  for (const change of changes) {
    switch (change.changeTypeKey) {
      case 'link_created':
        created++;
        break;
      case 'link_deleted':
        deleted++;
        break;
      default:
        updated++;
    }
  }

  return { created, updated, deleted, total: changes.length };
}
