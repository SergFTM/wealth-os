/**
 * Share Engine
 *
 * Manages secure share links with TTL, passwords, and download limits.
 */

import {
  PackShare,
  ShareRequest,
  ShareResult,
  ShareStatus,
  ReportPack
} from './types';

/**
 * Generate secure random token
 */
export function generateShareToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32;
  let token = '';

  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return token;
}

/**
 * Hash token for storage (simple hash for demo)
 */
export function hashToken(token: string): string {
  // In production, use proper hashing like bcrypt
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'h_' + Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Get token preview (first 8 chars)
 */
export function getTokenPreview(token: string): string {
  return token.substring(0, 8) + '...';
}

/**
 * Create share link
 */
export function createShare(
  request: ShareRequest,
  pack: ReportPack,
  createdByUserId: string,
  baseUrl: string = '/share/pack'
): { share: Partial<PackShare>; token: string; url: string } {
  const token = generateShareToken();
  const tokenHash = hashToken(token);
  const tokenPreview = getTokenPreview(token);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + request.expiresInDays);

  const share: Partial<PackShare> = {
    packId: request.packId,
    clientId: pack.clientId,
    tokenHash,
    tokenPreview,
    statusKey: 'active',
    expiresAt: expiresAt.toISOString(),
    allowDownload: request.allowDownload,
    maxDownloads: request.maxDownloads,
    downloadCount: 0,
    viewCount: 0,
    watermarkEnabled: request.watermarkEnabled ?? true,
    watermarkText: request.watermarkText || `Confidential - ${pack.recipientJson.org}`,
    recipientEmail: request.recipientEmail,
    notifyOnAccess: request.notifyOnAccess ?? true,
    passwordHash: request.password ? hashToken(request.password) : undefined,
    createdByUserId,
    createdAt: new Date().toISOString()
  };

  const url = `${baseUrl}/${token}`;

  return { share, token, url };
}

/**
 * Validate share token
 */
export function validateShareToken(
  share: PackShare,
  providedToken: string,
  providedPassword?: string
): { valid: boolean; error?: string } {
  // Check token hash
  const tokenHash = hashToken(providedToken);
  if (tokenHash !== share.tokenHash) {
    return { valid: false, error: 'Недействительный токен' };
  }

  // Check status
  if (share.statusKey === 'revoked') {
    return { valid: false, error: 'Ссылка отозвана' };
  }

  if (share.statusKey === 'expired') {
    return { valid: false, error: 'Срок действия ссылки истёк' };
  }

  // Check expiration
  if (new Date(share.expiresAt) < new Date()) {
    return { valid: false, error: 'Срок действия ссылки истёк' };
  }

  // Check download limit
  if (share.maxDownloads && share.downloadCount >= share.maxDownloads) {
    return { valid: false, error: 'Достигнут лимит скачиваний' };
  }

  // Check password
  if (share.passwordHash) {
    if (!providedPassword) {
      return { valid: false, error: 'Требуется пароль' };
    }
    if (hashToken(providedPassword) !== share.passwordHash) {
      return { valid: false, error: 'Неверный пароль' };
    }
  }

  return { valid: true };
}

/**
 * Revoke share
 */
export function revokeShare(
  share: PackShare,
  revokedByUserId: string,
  reason?: string
): Partial<PackShare> {
  return {
    ...share,
    statusKey: 'revoked',
    revokedAt: new Date().toISOString(),
    revokedByUserId,
    revokeReason: reason
  };
}

/**
 * Check and update share status
 */
export function updateShareStatus(share: PackShare): Partial<PackShare> {
  // Check expiration
  if (share.statusKey === 'active' && new Date(share.expiresAt) < new Date()) {
    return {
      ...share,
      statusKey: 'expired'
    };
  }

  // Check download limit
  if (share.statusKey === 'active' && share.maxDownloads && share.downloadCount >= share.maxDownloads) {
    return {
      ...share,
      statusKey: 'expired'
    };
  }

  return share;
}

/**
 * Increment share counters
 */
export function incrementShareCounter(
  share: PackShare,
  action: 'view' | 'download'
): Partial<PackShare> {
  if (action === 'view') {
    return {
      ...share,
      viewCount: (share.viewCount || 0) + 1
    };
  }

  return {
    ...share,
    downloadCount: share.downloadCount + 1
  };
}

/**
 * Get share statistics
 */
export function getShareStats(shares: PackShare[]): {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  totalViews: number;
  totalDownloads: number;
  expiringIn7Days: number;
} {
  const stats = {
    total: shares.length,
    active: 0,
    expired: 0,
    revoked: 0,
    totalViews: 0,
    totalDownloads: 0,
    expiringIn7Days: 0
  };

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  for (const share of shares) {
    switch (share.statusKey) {
      case 'active':
        stats.active++;
        if (new Date(share.expiresAt) <= sevenDaysFromNow) {
          stats.expiringIn7Days++;
        }
        break;
      case 'expired':
        stats.expired++;
        break;
      case 'revoked':
        stats.revoked++;
        break;
    }

    stats.totalViews += share.viewCount || 0;
    stats.totalDownloads += share.downloadCount;
  }

  return stats;
}

/**
 * Generate share notification
 */
export function generateShareNotification(
  share: PackShare,
  pack: ReportPack,
  action: 'created' | 'accessed' | 'downloaded' | 'revoked' | 'expiring'
): {
  title: string;
  message: string;
} {
  const packName = pack.name;

  const notifications = {
    created: {
      title: 'Ссылка на пакет создана',
      message: `Ссылка на пакет "${packName}" активна до ${new Date(share.expiresAt).toLocaleDateString('ru-RU')}.`
    },
    accessed: {
      title: 'Пакет просмотрен',
      message: `Пакет "${packName}" был просмотрен по ссылке.`
    },
    downloaded: {
      title: 'Пакет скачан',
      message: `Документы из пакета "${packName}" были скачаны.`
    },
    revoked: {
      title: 'Ссылка отозвана',
      message: `Ссылка на пакет "${packName}" была отозвана.`
    },
    expiring: {
      title: 'Ссылка скоро истечёт',
      message: `Ссылка на пакет "${packName}" истечёт ${new Date(share.expiresAt).toLocaleDateString('ru-RU')}.`
    }
  };

  return notifications[action];
}

/**
 * Calculate time until expiration
 */
export function getTimeUntilExpiration(share: PackShare): {
  expired: boolean;
  days: number;
  hours: number;
  label: string;
} {
  const now = new Date();
  const expires = new Date(share.expiresAt);
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) {
    return { expired: true, days: 0, hours: 0, label: 'Истёк' };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  let label = '';
  if (days > 0) {
    label = `${days} д.`;
  } else if (hours > 0) {
    label = `${hours} ч.`;
  } else {
    label = '< 1 ч.';
  }

  return { expired: false, days, hours, label };
}

/**
 * Validate share request
 */
export function validateShareRequest(
  pack: ReportPack,
  existingShares: PackShare[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check pack status
  if (pack.statusKey !== 'approved' && pack.statusKey !== 'shared') {
    errors.push('Пакет должен быть одобрен перед публикацией');
  }

  // Check for too many active shares
  const activeShares = existingShares.filter(s => s.statusKey === 'active');
  if (activeShares.length >= 10) {
    errors.push('Достигнут лимит активных ссылок (10)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
