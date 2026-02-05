/**
 * Watchlist Engine
 * Manages watchlist items and alerts
 */

export interface Watchlist {
  id: string;
  clientId: string;
  name: string;
  listType: 'tickers' | 'funds' | 'deals' | 'managers' | 'custom';
  ownerUserId: string;
  alertsEnabled?: boolean;
}

export interface WatchlistItem {
  id: string;
  clientId: string;
  watchlistId: string;
  itemType: 'ticker' | 'fund' | 'deal' | 'asset' | 'manager' | 'custom';
  itemKey: string;
  itemName?: string;
  notes?: string;
  alertThresholdJson?: AlertThreshold;
  metadataJson?: ItemMetadata;
  linkedIdeaId?: string;
}

export interface AlertThreshold {
  priceAbove?: number;
  priceBelow?: number;
  changeAbovePct?: number;
  changeBelowPct?: number;
  enabled: boolean;
}

export interface ItemMetadata {
  lastPrice?: number;
  priceChange?: number;
  priceChangePct?: number;
  currency?: string;
  lastUpdated?: string;
  // Additional fields for different item types
  marketCap?: number;
  sector?: string;
  aum?: number; // for funds
  dealSize?: number; // for deals
}

export interface WatchlistStats {
  totalItems: number;
  itemsByType: Record<string, number>;
  alertsEnabled: number;
  linkedIdeas: number;
}

/**
 * Calculate watchlist statistics
 */
export function calculateWatchlistStats(items: WatchlistItem[]): WatchlistStats {
  const itemsByType: Record<string, number> = {};
  let alertsEnabled = 0;
  let linkedIdeas = 0;

  items.forEach(item => {
    itemsByType[item.itemType] = (itemsByType[item.itemType] || 0) + 1;
    if (item.alertThresholdJson?.enabled) alertsEnabled++;
    if (item.linkedIdeaId) linkedIdeas++;
  });

  return {
    totalItems: items.length,
    itemsByType,
    alertsEnabled,
    linkedIdeas
  };
}

/**
 * Check if item should trigger alert
 */
export function checkItemAlert(
  item: WatchlistItem,
  currentPrice: number,
  previousPrice?: number
): { shouldAlert: boolean; reason?: string } {
  const threshold = item.alertThresholdJson;
  if (!threshold?.enabled) {
    return { shouldAlert: false };
  }

  if (threshold.priceAbove && currentPrice >= threshold.priceAbove) {
    return {
      shouldAlert: true,
      reason: `Цена ${currentPrice} достигла уровня ${threshold.priceAbove}`
    };
  }

  if (threshold.priceBelow && currentPrice <= threshold.priceBelow) {
    return {
      shouldAlert: true,
      reason: `Цена ${currentPrice} упала до уровня ${threshold.priceBelow}`
    };
  }

  if (previousPrice && previousPrice > 0) {
    const changePct = ((currentPrice - previousPrice) / previousPrice) * 100;

    if (threshold.changeAbovePct && changePct >= threshold.changeAbovePct) {
      return {
        shouldAlert: true,
        reason: `Изменение +${changePct.toFixed(2)}% превысило порог ${threshold.changeAbovePct}%`
      };
    }

    if (threshold.changeBelowPct && changePct <= -threshold.changeBelowPct) {
      return {
        shouldAlert: true,
        reason: `Изменение ${changePct.toFixed(2)}% ниже порога -${threshold.changeBelowPct}%`
      };
    }
  }

  return { shouldAlert: false };
}

/**
 * Generate notification rule for watchlist alerts
 * Compatible with module 35 (notifications)
 */
export function generateNotificationRule(
  watchlist: Watchlist,
  item: WatchlistItem
): object {
  return {
    name: `Алерт: ${item.itemName || item.itemKey} в ${watchlist.name}`,
    ruleType: 'watchlist_alert',
    triggerCondition: 'threshold_breach',
    sourceCollection: 'watchlistItems',
    sourceId: item.id,
    metadata: {
      watchlistId: watchlist.id,
      watchlistName: watchlist.name,
      itemKey: item.itemKey,
      threshold: item.alertThresholdJson
    },
    channels: ['in_app', 'email'],
    enabled: true,
    clientId: watchlist.clientId
  };
}

/**
 * Validate watchlist item data
 */
export function validateWatchlistItem(item: Partial<WatchlistItem>): {
  valid: boolean;
  errors: string[]
} {
  const errors: string[] = [];

  if (!item.itemKey) {
    errors.push('Идентификатор элемента обязателен');
  }

  if (!item.itemType) {
    errors.push('Тип элемента обязателен');
  }

  if (!item.watchlistId) {
    errors.push('ID watchlist обязателен');
  }

  const validTypes = ['ticker', 'fund', 'deal', 'asset', 'manager', 'custom'];
  if (item.itemType && !validTypes.includes(item.itemType)) {
    errors.push(`Недопустимый тип элемента: ${item.itemType}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Sort watchlist items by various criteria
 */
export function sortWatchlistItems(
  items: WatchlistItem[],
  sortBy: 'name' | 'type' | 'change' | 'added',
  direction: 'asc' | 'desc' = 'asc'
): WatchlistItem[] {
  const sorted = [...items].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = (a.itemName || a.itemKey).localeCompare(b.itemName || b.itemKey);
        break;
      case 'type':
        comparison = a.itemType.localeCompare(b.itemType);
        break;
      case 'change':
        const aChange = a.metadataJson?.priceChangePct || 0;
        const bChange = b.metadataJson?.priceChangePct || 0;
        comparison = aChange - bChange;
        break;
      case 'added':
      default:
        comparison = 0; // Keep original order
    }

    return direction === 'desc' ? -comparison : comparison;
  });

  return sorted;
}

/**
 * Group watchlist items by type
 */
export function groupItemsByType(
  items: WatchlistItem[]
): Record<string, WatchlistItem[]> {
  return items.reduce((groups, item) => {
    const type = item.itemType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {} as Record<string, WatchlistItem[]>);
}
