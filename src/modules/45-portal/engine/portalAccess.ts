// Module 45: Portal Access Control Engine

import { PortalRoleKey, ConsentScopeKey, PortalUser } from '../types';

export interface PortalSession {
  userId: string;
  role: PortalRoleKey;
  householdId: string;
  scopes: ConsentScopeKey[];
  expiresAt: number;
}

export interface AccessCheckResult {
  allowed: boolean;
  reason?: string;
}

// MVP: Simple cookie-based portal flag check
export function isPortalSession(): boolean {
  if (typeof window === 'undefined') return false;
  return document.cookie.includes('portal=1');
}

// MVP: Get mock portal session from cookie
export function getPortalSession(): PortalSession | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  if (cookies['portal'] !== '1') return null;

  // MVP: Return mock session
  return {
    userId: cookies['portal_user_id'] || 'pt-user-001',
    role: (cookies['portal_role'] as PortalRoleKey) || 'client_owner',
    householdId: cookies['portal_household'] || 'hh-001',
    scopes: [
      'view_networth',
      'view_portfolios',
      'view_performance',
      'view_liquidity',
      'view_documents',
      'manage_requests',
      'communicate',
    ],
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
}

// Check if user has specific scope
export function hasScope(session: PortalSession | null, scope: ConsentScopeKey): boolean {
  if (!session) return false;
  return session.scopes.includes(scope);
}

// Check access to specific resource
export function checkAccess(
  session: PortalSession | null,
  resource: string,
  action: 'view' | 'create' | 'update' | 'delete' = 'view'
): AccessCheckResult {
  if (!session) {
    return { allowed: false, reason: 'No active session' };
  }

  // Map resources to required scopes
  const resourceScopes: Record<string, ConsentScopeKey> = {
    'net-worth': 'view_networth',
    'portfolios': 'view_portfolios',
    'performance': 'view_performance',
    'liquidity': 'view_liquidity',
    'documents': 'view_documents',
    'packs': 'view_documents',
    'requests': 'manage_requests',
    'threads': 'communicate',
    'calendar': 'view_documents', // Uses documents scope for now
    'governance': 'view_documents',
    'consents': 'view_documents',
  };

  const requiredScope = resourceScopes[resource];
  if (!requiredScope) {
    return { allowed: true }; // Overview and settings are always allowed
  }

  if (!hasScope(session, requiredScope)) {
    return { allowed: false, reason: `Missing scope: ${requiredScope}` };
  }

  // Role-based restrictions for certain actions
  if (action === 'delete' && session.role !== 'client_owner') {
    return { allowed: false, reason: 'Only owner can delete' };
  }

  return { allowed: true };
}

// Validate household access
export function validateHouseholdAccess(
  session: PortalSession | null,
  resourceHouseholdId: string
): boolean {
  if (!session) return false;
  return session.householdId === resourceHouseholdId;
}

// Filter array by household
export function filterByHousehold<T extends { householdId?: string }>(
  session: PortalSession | null,
  items: T[]
): T[] {
  if (!session) return [];
  return items.filter(item => !item.householdId || item.householdId === session.householdId);
}

// Client-safe field checker
export function isClientSafeField(fieldName: string): boolean {
  const internalFields = [
    'internalNotes',
    'staffNotes',
    'internalTags',
    'costBasis',
    'taxLotId',
    'brokerAccountNumber',
    'rawAccountNumber',
    'ssn',
    'tin',
    'internalId',
    'staffAssignee',
    'internalStatus',
    'auditTrail',
    'systemMetadata',
  ];

  return !internalFields.includes(fieldName);
}

// Strip internal fields from object
export function stripInternalFields<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (isClientSafeField(key)) {
      result[key as keyof T] = value as T[keyof T];
    }
  }

  return result;
}

// Create portal session (for login flow - MVP mock)
export function createPortalSession(user: PortalUser, scopes: ConsentScopeKey[]): void {
  if (typeof window === 'undefined') return;

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();

  document.cookie = `portal=1; path=/; expires=${expires}; SameSite=Strict`;
  document.cookie = `portal_user_id=${user.id}; path=/; expires=${expires}; SameSite=Strict`;
  document.cookie = `portal_role=${user.role}; path=/; expires=${expires}; SameSite=Strict`;
  document.cookie = `portal_household=${user.householdId}; path=/; expires=${expires}; SameSite=Strict`;
}

// Clear portal session
export function clearPortalSession(): void {
  if (typeof window === 'undefined') return;

  document.cookie = 'portal=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'portal_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'portal_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'portal_household=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

// Middleware helper for API routes
export function requirePortalAuth(session: PortalSession | null): void {
  if (!session) {
    throw new Error('Unauthorized: Portal session required');
  }
}

// Audit log entry for portal actions
export interface PortalAuditEntry {
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

export function createAuditEntry(
  session: PortalSession,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>
): PortalAuditEntry {
  return {
    timestamp: new Date().toISOString(),
    userId: session.userId,
    action,
    resource,
    resourceId,
    details,
  };
}
