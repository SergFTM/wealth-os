/**
 * Share Engine
 * Manages sharing of export packs with external parties
 */

export interface ShareConfig {
  packId: string;
  runId?: string;
  name: string;
  audienceType: 'advisor' | 'auditor' | 'client' | 'bank' | 'regulator';
  audienceId?: string;
  audienceName?: string;
  audienceEmail?: string;
  clientSafe: boolean;
  expiresInDays?: number;
  maxDownloads?: number;
  password?: string;
  notifyOnAccess?: boolean;
  ipWhitelist?: string[];
}

export interface ShareResult {
  id: string;
  accessToken: string;
  shareUrl: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface AccessCheckResult {
  allowed: boolean;
  reason?: string;
  remainingDownloads?: number;
}

export interface DownloadAttempt {
  shareId: string;
  fileId: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  reason?: string;
}

function generateAccessToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

function generateShareId(): string {
  return `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createShare(config: ShareConfig): ShareResult {
  const id = generateShareId();
  const accessToken = generateAccessToken();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (config.expiresInDays || 30));

  const shareUrl = `/m/exports/share/${id}?token=${accessToken}`;

  return {
    id,
    accessToken,
    shareUrl,
    expiresAt: expiresAt.toISOString(),
    status: 'active',
  };
}

export function checkAccess(
  share: {
    status: string;
    expiresAt: string;
    maxDownloads?: number;
    downloadCount: number;
    password?: string;
    ipWhitelist?: string[];
    accessToken: string;
  },
  request: {
    token: string;
    password?: string;
    ipAddress?: string;
  }
): AccessCheckResult {
  // Check if share is active
  if (share.status !== 'active') {
    return { allowed: false, reason: `Share is ${share.status}` };
  }

  // Check expiration
  if (new Date(share.expiresAt) < new Date()) {
    return { allowed: false, reason: 'Share has expired' };
  }

  // Check token
  if (share.accessToken !== request.token) {
    return { allowed: false, reason: 'Invalid access token' };
  }

  // Check password if required
  if (share.password && share.password !== request.password) {
    return { allowed: false, reason: 'Invalid password' };
  }

  // Check IP whitelist
  if (share.ipWhitelist && share.ipWhitelist.length > 0 && request.ipAddress) {
    if (!share.ipWhitelist.includes(request.ipAddress)) {
      return { allowed: false, reason: 'IP address not allowed' };
    }
  }

  // Check download limit
  if (share.maxDownloads && share.downloadCount >= share.maxDownloads) {
    return { allowed: false, reason: 'Download limit reached' };
  }

  const remainingDownloads = share.maxDownloads
    ? share.maxDownloads - share.downloadCount
    : undefined;

  return { allowed: true, remainingDownloads };
}

export function revokeShare(shareId: string, reason?: string): {
  revokedAt: string;
  reason?: string;
} {
  return {
    revokedAt: new Date().toISOString(),
    reason: reason || 'Manually revoked',
  };
}

export function recordDownloadAttempt(
  shareId: string,
  fileId: string,
  success: boolean,
  reason?: string,
  metadata?: { ipAddress?: string; userAgent?: string }
): DownloadAttempt {
  return {
    shareId,
    fileId,
    timestamp: new Date().toISOString(),
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
    success,
    reason,
  };
}

// Consent integration (module 34)
export interface ConsentCheck {
  consentId?: string;
  audienceType: string;
  audienceId?: string;
  dataTypes: string[];
}

export function checkConsentForShare(consent: ConsentCheck): {
  allowed: boolean;
  missingConsents: string[];
} {
  // MVP: Always allow, log what would be checked
  // In production, integrate with module 34 consents

  const requiredConsents = consent.dataTypes.map(dt => `consent:${dt}:${consent.audienceType}`);

  // Simulate consent check
  const missingConsents: string[] = [];

  // For demo, randomly mark some as missing
  // requiredConsents.forEach(rc => {
  //   if (Math.random() > 0.9) {
  //     missingConsents.push(rc);
  //   }
  // });

  return {
    allowed: missingConsents.length === 0,
    missingConsents,
  };
}

export function generateShareSummary(shares: {
  id: string;
  name: string;
  audienceType: string;
  status: string;
  expiresAt: string;
  downloadCount: number;
}[]): {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  byAudience: Record<string, number>;
  totalDownloads: number;
} {
  const summary = {
    total: shares.length,
    active: 0,
    expired: 0,
    revoked: 0,
    byAudience: {} as Record<string, number>,
    totalDownloads: 0,
  };

  for (const share of shares) {
    switch (share.status) {
      case 'active':
        summary.active++;
        break;
      case 'expired':
        summary.expired++;
        break;
      case 'revoked':
        summary.revoked++;
        break;
    }

    summary.byAudience[share.audienceType] = (summary.byAudience[share.audienceType] || 0) + 1;
    summary.totalDownloads += share.downloadCount;
  }

  return summary;
}

export const AUDIENCE_LABELS: Record<string, string> = {
  advisor: 'Налоговый консультант',
  auditor: 'Аудитор',
  client: 'Клиент',
  bank: 'Банк',
  regulator: 'Регулятор',
};
