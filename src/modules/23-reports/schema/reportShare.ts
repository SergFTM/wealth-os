/**
 * ReportShare Schema
 * Secure sharing links for published reports
 */

export type ShareAccessLevel = 'view' | 'download' | 'full';
export type ShareStatus = 'active' | 'expired' | 'revoked';

export interface ReportShare {
  id: string;
  packId: string;
  packVersion: number;

  // Public link
  publicId: string; // Short unique ID for URL
  shareUrl?: string; // Full URL (generated)

  // Access control
  accessLevel: ShareAccessLevel;
  status: ShareStatus;

  // Authentication
  requiresAuth: boolean;
  password?: string; // Hashed
  allowedEmails?: string[];
  allowedDomains?: string[];

  // Role-based access
  allowedRoles?: string[];

  // Expiry
  expiresAt?: string;

  // Usage tracking
  viewCount: number;
  downloadCount: number;
  lastAccessAt?: string;

  // Sharing metadata
  shareNote?: string;
  recipientName?: string;
  recipientEmail?: string;

  // Audit
  createdBy: string;
  createdAt: string;
  revokedAt?: string;
  revokedBy?: string;
}

export interface ReportShareCreateInput {
  packId: string;
  accessLevel: ShareAccessLevel;
  requiresAuth?: boolean;
  password?: string;
  allowedEmails?: string[];
  allowedDomains?: string[];
  allowedRoles?: string[];
  expiresAt?: string;
  shareNote?: string;
  recipientName?: string;
  recipientEmail?: string;
}

export interface ReportShareUpdateInput {
  accessLevel?: ShareAccessLevel;
  requiresAuth?: boolean;
  password?: string;
  allowedEmails?: string[];
  allowedDomains?: string[];
  allowedRoles?: string[];
  expiresAt?: string;
  shareNote?: string;
}

export interface ShareAccessCheck {
  shareId: string;
  isValid: boolean;
  reason?: string;
  accessLevel?: ShareAccessLevel;
  packId?: string;
  packVersion?: number;
}
