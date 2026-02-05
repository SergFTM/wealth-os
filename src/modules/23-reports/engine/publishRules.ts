/**
 * Publish Rules Engine
 * Manages publishing, sharing, and access control for reports
 */

import {
  ReportPack,
  PackStatus,
} from '../schema/reportPack';
import {
  ReportShare,
  ReportShareCreateInput,
  ShareAccessLevel,
  ShareAccessCheck,
} from '../schema/reportShare';

// Generate unique IDs
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate short public ID for share URLs
function generatePublicId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Get current timestamp
function now(): string {
  return new Date().toISOString();
}

/**
 * Check if a pack can be published
 */
export function canPublish(pack: ReportPack): { allowed: boolean; reason?: string } {
  if (pack.status === 'published') {
    return { allowed: false, reason: 'Pack is already published' };
  }

  if (pack.status === 'archived') {
    return { allowed: false, reason: 'Cannot publish archived pack' };
  }

  if (pack.status === 'draft') {
    return { allowed: false, reason: 'Pack must be locked before publishing' };
  }

  return { allowed: true };
}

/**
 * Check if a share can be created
 */
export function canCreateShare(pack: ReportPack): { allowed: boolean; reason?: string } {
  if (pack.status !== 'published') {
    return { allowed: false, reason: 'Only published packs can be shared' };
  }

  return { allowed: true };
}

/**
 * Create a share link
 */
export function createShare(
  input: ReportShareCreateInput,
  pack: ReportPack,
  userId: string,
  baseUrl: string
): ReportShare {
  const timestamp = now();
  const publicId = generatePublicId();

  return {
    id: generateId('share'),
    packId: input.packId,
    packVersion: pack.version,

    publicId,
    shareUrl: `${baseUrl}/share/${publicId}`,

    accessLevel: input.accessLevel,
    status: 'active',

    requiresAuth: input.requiresAuth ?? false,
    password: input.password, // Should be hashed before storage
    allowedEmails: input.allowedEmails,
    allowedDomains: input.allowedDomains,
    allowedRoles: input.allowedRoles,

    expiresAt: input.expiresAt,

    viewCount: 0,
    downloadCount: 0,

    shareNote: input.shareNote,
    recipientName: input.recipientName,
    recipientEmail: input.recipientEmail,

    createdBy: userId,
    createdAt: timestamp,
  };
}

/**
 * Check if a share is valid for access
 */
export function checkShareAccess(
  share: ReportShare,
  context?: {
    email?: string;
    role?: string;
    password?: string;
  }
): ShareAccessCheck {
  // Check if share is active
  if (share.status !== 'active') {
    return {
      shareId: share.id,
      isValid: false,
      reason: share.status === 'expired' ? 'Share link has expired' : 'Share link has been revoked',
    };
  }

  // Check expiry
  if (share.expiresAt) {
    const expiryDate = new Date(share.expiresAt);
    if (expiryDate < new Date()) {
      return {
        shareId: share.id,
        isValid: false,
        reason: 'Share link has expired',
      };
    }
  }

  // Check password if required
  if (share.password && context?.password !== share.password) {
    return {
      shareId: share.id,
      isValid: false,
      reason: 'Invalid password',
    };
  }

  // Check email whitelist
  if (share.allowedEmails?.length && context?.email) {
    if (!share.allowedEmails.includes(context.email.toLowerCase())) {
      return {
        shareId: share.id,
        isValid: false,
        reason: 'Email not authorized',
      };
    }
  }

  // Check domain whitelist
  if (share.allowedDomains?.length && context?.email) {
    const emailDomain = context.email.split('@')[1]?.toLowerCase();
    if (!emailDomain || !share.allowedDomains.includes(emailDomain)) {
      return {
        shareId: share.id,
        isValid: false,
        reason: 'Domain not authorized',
      };
    }
  }

  // Check role whitelist
  if (share.allowedRoles?.length && context?.role) {
    if (!share.allowedRoles.includes(context.role)) {
      return {
        shareId: share.id,
        isValid: false,
        reason: 'Role not authorized',
      };
    }
  }

  // Check if auth is required but no context provided
  if (share.requiresAuth && !context?.email) {
    return {
      shareId: share.id,
      isValid: false,
      reason: 'Authentication required',
    };
  }

  return {
    shareId: share.id,
    isValid: true,
    accessLevel: share.accessLevel,
    packId: share.packId,
    packVersion: share.packVersion,
  };
}

/**
 * Revoke a share
 */
export function revokeShare(share: ReportShare, userId: string): ReportShare {
  const timestamp = now();

  return {
    ...share,
    status: 'revoked',
    revokedAt: timestamp,
    revokedBy: userId,
  };
}

/**
 * Update share expiry to expired status
 */
export function expireShare(share: ReportShare): ReportShare {
  return {
    ...share,
    status: 'expired',
  };
}

/**
 * Record share view
 */
export function recordShareView(share: ReportShare): ReportShare {
  const timestamp = now();

  return {
    ...share,
    viewCount: share.viewCount + 1,
    lastAccessAt: timestamp,
  };
}

/**
 * Record share download
 */
export function recordShareDownload(share: ReportShare): ReportShare {
  const timestamp = now();

  return {
    ...share,
    downloadCount: share.downloadCount + 1,
    lastAccessAt: timestamp,
  };
}

/**
 * Get access level capabilities
 */
export function getAccessLevelCapabilities(level: ShareAccessLevel): {
  canView: boolean;
  canDownload: boolean;
  canExport: boolean;
} {
  switch (level) {
    case 'view':
      return { canView: true, canDownload: false, canExport: false };
    case 'download':
      return { canView: true, canDownload: true, canExport: false };
    case 'full':
      return { canView: true, canDownload: true, canExport: true };
    default:
      return { canView: false, canDownload: false, canExport: false };
  }
}

/**
 * Check if user can perform action on pack
 */
export function canUserPerformAction(
  pack: ReportPack,
  action: 'view' | 'edit' | 'lock' | 'publish' | 'share' | 'delete' | 'archive',
  userRole: string,
  userId: string
): boolean {
  const isOwner = pack.createdBy === userId;
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';

  switch (action) {
    case 'view':
      return true; // All roles can view

    case 'edit':
      if (pack.status !== 'draft') return false;
      return isOwner || isAdmin || isManager;

    case 'lock':
      if (pack.status !== 'draft') return false;
      return isOwner || isAdmin || isManager;

    case 'publish':
      if (pack.status !== 'locked') return false;
      return isAdmin || isManager;

    case 'share':
      if (pack.status !== 'published') return false;
      return isOwner || isAdmin || isManager;

    case 'delete':
      if (pack.status === 'published') return isAdmin;
      return isOwner || isAdmin;

    case 'archive':
      return isAdmin || isManager;

    default:
      return false;
  }
}

/**
 * Get default expiry for share based on access level
 */
export function getDefaultShareExpiry(accessLevel: ShareAccessLevel): string {
  const now = new Date();
  let daysToAdd: number;

  switch (accessLevel) {
    case 'view':
      daysToAdd = 30; // 30 days for view-only
      break;
    case 'download':
      daysToAdd = 14; // 14 days for download
      break;
    case 'full':
      daysToAdd = 7; // 7 days for full access
      break;
    default:
      daysToAdd = 7;
  }

  const expiryDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return expiryDate.toISOString();
}

/**
 * Validate share input
 */
export function validateShareInput(
  input: ReportShareCreateInput
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.packId) {
    errors.push('Pack ID is required');
  }

  if (!input.accessLevel) {
    errors.push('Access level is required');
  }

  if (input.allowedEmails?.length) {
    const invalidEmails = input.allowedEmails.filter(
      email => !email.includes('@')
    );
    if (invalidEmails.length > 0) {
      errors.push(`Invalid email addresses: ${invalidEmails.join(', ')}`);
    }
  }

  if (input.expiresAt) {
    const expiryDate = new Date(input.expiresAt);
    if (expiryDate < new Date()) {
      errors.push('Expiry date cannot be in the past');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
