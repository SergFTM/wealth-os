"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { BaseRecord, QueryOptions } from '@/db/storage/storage.types';
import { getCollection, createRecord, updateRecord, deleteRecord, clearCache } from './apiClient';

interface UseCollectionResult<T> {
  items: T[];
  data: T[]; // Alias for items
  total: number;
  loading: boolean;
  isLoading: boolean; // Alias for loading
  error: string | null;
  refetch: () => void;
  create: (data: Partial<T>) => Promise<T | null>;
  update: (id: string, data: Partial<T>) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
}

export function useCollection<T extends BaseRecord>(
  collection: string,
  query?: QueryOptions
): UseCollectionResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const queryString = JSON.stringify(query || {});

  const fetchData = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    
    setLoading(true);
    setError(null);
    
    try {
      const queryObj: Record<string, string> = {};
      if (query?.search) queryObj.search = query.search;
      if (query?.status) queryObj.status = query.status;
      if (query?.clientId) queryObj.clientId = query.clientId;
      if (query?.limit) queryObj.limit = String(query.limit);
      if (query?.offset) queryObj.offset = String(query.offset);
      if (query?.sortBy) queryObj.sortBy = query.sortBy;
      if (query?.sortOrder) queryObj.sortOrder = query.sortOrder;
      
      const data = await getCollection<T>(collection, queryObj);
      setItems(data.items);
      setTotal(data.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [collection, queryString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (data: Partial<T>): Promise<T | null> => {
    try {
      const item = await createRecord<T>(collection, data);
      await fetchData();
      return item;
    } catch {
      return null;
    }
  };

  const update = async (id: string, data: Partial<T>): Promise<T | null> => {
    try {
      const item = await updateRecord<T>(collection, id, data);
      await fetchData();
      return item;
    } catch {
      return null;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      await deleteRecord(collection, id);
      await fetchData();
      return true;
    } catch {
      return false;
    }
  };

  return {
    items,
    data: items, // Alias for items
    total,
    loading,
    isLoading: loading, // Alias for loading
    error,
    refetch: fetchData,
    create,
    update,
    remove
  };
}

/**
 * Batch-load multiple collections in a single render cycle.
 * Prevents the re-render storm caused by N separate useCollection calls.
 *
 * @example
 * const { data, loading } = useCollections(['cashForecasts', 'cashPositions', 'liquidityAlerts']);
 * const forecasts = data.cashForecasts ?? [];
 */
export function useCollections<T extends BaseRecord = BaseRecord>(
  collections: string[]
): { data: Record<string, T[]>; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<Record<string, T[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);
  const key = collections.join(',');

  const fetchAll = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        collections.map(c => getCollection<T>(c, {}).then(r => [c, r.items] as const))
      );
      const map: Record<string, T[]> = {};
      for (const [name, items] of results) {
        map[name] = items;
      }
      setData(map);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load collections');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, error, refetch: fetchAll };
}

export function useRecord<T extends BaseRecord>(collection: string, id: string | null) {
  const [record, setRecord] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (!id) {
      setRecord(null);
      return;
    }

    if (fetchingRef.current) return;
    fetchingRef.current = true;

    setLoading(true);
    try {
      const res = await fetch(`/api/collections/${collection}/${id}`);
      const data = res.ok ? await res.json() : null;
      setRecord(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [collection, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    record,
    data: record, // Alias for record
    loading,
    isLoading: loading, // Alias for loading
    error,
    refetch: fetchData
  };
}

export function useMutateRecord(collection: string, id: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (data: Record<string, unknown>): Promise<boolean> => {
    if (!id) return false;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/collections/${collection}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Update failed');
      }

      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, isLoading: loading, error };
}

export function useAuditEvents(recordId: string | null) {
  const [events, setEvents] = useState<Array<{id: string; ts: string; actorName: string; action: string; summary: string}>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!recordId) {
      setEvents([]);
      return;
    }

    setLoading(true);
    fetch(`/api/audit/${recordId}`)
      .then(res => res.json())
      .then(data => setEvents(data.events || []))
      .finally(() => setLoading(false));
  }, [recordId]);

  return { events, loading };
}

// ============================================================================
// RBAC Permission Types
// ============================================================================

export type RbacAction = 'view' | 'create' | 'update' | 'delete' | 'approve' | 'export' | 'admin';

export interface PermissionContext {
  module: string;
  action: RbacAction;
  scope?: 'global' | 'client' | 'entity' | 'portfolio' | 'account';
  clientId?: string;
  entityId?: string;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  clientSafeOverride?: boolean;
}

// Role hierarchy for permission escalation
const roleHierarchy: Record<string, number> = {
  admin: 100,
  cio: 90,
  cfo: 85,
  compliance: 80,
  operations: 70,
  rm: 60,
  advisor: 50,
  client: 10,
};

// Shared role groups for DRY module access definitions
const ALL_ROLES = ['admin', 'cio', 'cfo', 'compliance', 'operations', 'rm', 'advisor', 'client'] as const;
const INTERNAL_ROLES = ['admin', 'cio', 'cfo', 'compliance', 'operations', 'rm'] as const;
const FINANCE_ROLES = ['admin', 'cio', 'cfo', 'operations'] as const;
const BACKOFFICE_ROLES = ['admin', 'cfo', 'operations'] as const;

// Module access rules: which roles can access which modules
const moduleAccess: Record<string, string[]> = {
  // Core Wealth (M01–M09)
  'dashboard-home': [...ALL_ROLES],
  'net-worth': [...ALL_ROLES],
  'reconciliation': [...FINANCE_ROLES],
  'performance': [...ALL_ROLES],
  'reporting': [...ALL_ROLES],
  'general-ledger': [...FINANCE_ROLES],
  'partnerships': [...INTERNAL_ROLES],
  'private-capital': [...INTERNAL_ROLES],
  'liquidity': ['admin', 'cio', 'cfo', 'operations', 'rm'],
  'documents': [...ALL_ROLES],
  'billpay-checks': [...BACKOFFICE_ROLES],
  'ar-revenue': [...BACKOFFICE_ROLES],
  'fee-billing': [...BACKOFFICE_ROLES],
  'workflow': [...INTERNAL_ROLES],
  'onboarding': ['admin', 'cio', 'compliance', 'operations', 'rm'],
  'ips': ['admin', 'cio', 'compliance', 'operations', 'rm'],
  'risk': ['admin', 'cio', 'cfo', 'compliance', 'operations', 'rm'],
  'tax': ['admin', 'cio', 'cfo', 'operations', 'advisor'],
  'trusts': ['admin', 'cio', 'cfo', 'compliance', 'operations', 'rm', 'advisor'],
  'fees': [...BACKOFFICE_ROLES],
  'integrations': ['admin', 'cio', 'operations'],
  'communications': [...ALL_ROLES],
  'comms': [...ALL_ROLES],
  'ai': [...ALL_ROLES],
  'security': ['admin'],
  // Operations (M22–M33)
  'platform': ['admin', 'operations'],
  'reports': [...ALL_ROLES],
  'api': ['admin'],
  'admin': ['admin'],
  'planning': ['admin', 'cio', 'cfo', 'operations'],
  'data-quality': ['admin', 'cio', 'operations'],
  'committee': ['admin', 'cio', 'compliance', 'operations'],
  'deals': ['admin', 'cio', 'cfo', 'compliance', 'operations', 'rm'],
  'portal': ['admin', 'cio', 'cfo', 'compliance', 'operations', 'rm'],
  'mobile': [...ALL_ROLES],
  'academy': [...INTERNAL_ROLES],
  'sandbox': ['admin', 'operations'],
  'consents': ['admin', 'compliance', 'operations', 'rm'],
  'notifications': [...ALL_ROLES],
  'cases': [...INTERNAL_ROLES],
  'exports': [...INTERNAL_ROLES],
  'ideas': ['admin', 'cio', 'cfo', 'operations', 'rm'],
  // Liquidity Planning (M39)
  'liquidity-planning': ['admin', 'cio', 'cfo', 'operations', 'rm'],
  // Governance (M40)
  'governance': ['admin', 'cio', 'compliance', 'operations'],
  // Calendar (M41)
  'calendar': [...INTERNAL_ROLES],
  // Deals & Corp Actions (M42)
  'deals-corp-actions': ['admin', 'cio', 'cfo', 'compliance', 'operations'],
  // Vendors (M43)
  'vendors': ['admin', 'cfo', 'compliance', 'operations'],
  // Policies (M44)
  'policies': ['admin', 'compliance', 'operations'],
  // MDM (M46)
  'mdm': ['admin', 'operations'],
  // Ownership (M47)
  'ownership': ['admin', 'cio', 'compliance', 'operations', 'rm'],
  // Exceptions (M48)
  'exceptions': ['admin', 'cio', 'operations'],
  // Philanthropy (M49)
  'philanthropy': ['admin', 'cio', 'cfo', 'operations', 'rm', 'advisor'],
  // Credit (M50)
  'credit': ['admin', 'cio', 'cfo', 'operations', 'rm'],
  // Data Governance (M51)
  'data-governance': ['admin', 'cio', 'operations'],
  'governance-data': ['admin', 'cio', 'operations'],
  // Packs (M52)
  'packs': ['admin', 'cio', 'cfo', 'operations', 'rm'],
  // Relationships (M53)
  'relationships': ['admin', 'cio', 'cfo', 'operations', 'rm'],
  // Consent & Privacy (M54)
  'consent': ['admin', 'cio', 'cfo', 'compliance', 'operations', 'rm', 'advisor', 'client'],
  'consent-privacy': ['admin', 'compliance', 'operations'],
  // Client Portal (M55)
  'client-portal': [...INTERNAL_ROLES],
};

// Actions allowed per role for each module type
const actionPermissions: Record<string, Record<string, RbacAction[]>> = {
  admin: {
    default: ['view', 'create', 'update', 'delete', 'approve', 'export', 'admin'],
  },
  cio: {
    default: ['view', 'create', 'update', 'approve', 'export'],
  },
  cfo: {
    default: ['view', 'create', 'update', 'approve', 'export'],
  },
  compliance: {
    default: ['view', 'create', 'update', 'approve', 'export'],
  },
  operations: {
    default: ['view', 'create', 'update', 'export'],
  },
  rm: {
    default: ['view', 'create', 'update', 'export'],
  },
  advisor: {
    default: ['view', 'export'],
  },
  client: {
    default: ['view'],
  },
};

// Modules hidden in client-safe mode (backoffice / internal-only)
const clientSafeHiddenModules = [
  'reconciliation',
  'general-ledger',
  'billpay-checks',
  'ar-revenue',
  'fee-billing',
  'fees',
  'integrations',
  'security',
  'admin',
  'api',
  'platform',
  'sandbox',
  'data-quality',
  'mdm',
  'data-governance',
  'governance-data',
  'exceptions',
  'policies',
  'deals-corp-actions',
  'client-portal',
  'consent-privacy',
];

/**
 * Check if a user has permission to perform an action on a module
 *
 * @param userRole - Current user's role
 * @param context - Permission context including module, action, scope
 * @param clientSafe - Whether client-safe mode is enabled
 * @returns PermissionResult with allowed status and reason
 *
 * @example
 * const result = checkPermission('rm', { module: 'documents', action: 'create' });
 * if (!result.allowed) {
 *   console.log(result.reason);
 * }
 */
export function checkPermission(
  userRole: string,
  context: PermissionContext,
  clientSafe: boolean = false
): PermissionResult {
  const { module, action } = context;

  // Check if module is hidden in client-safe mode
  if (clientSafe && clientSafeHiddenModules.includes(module)) {
    return {
      allowed: false,
      reason: 'Module hidden in client-safe mode',
      clientSafeOverride: true,
    };
  }

  // Check if role has access to module
  const allowedRoles = moduleAccess[module];
  if (!allowedRoles) {
    // Module not defined, allow admin only
    return userRole === 'admin'
      ? { allowed: true }
      : { allowed: false, reason: `Module "${module}" not found in access rules` };
  }

  if (!allowedRoles.includes(userRole)) {
    return {
      allowed: false,
      reason: `Role "${userRole}" does not have access to module "${module}"`,
    };
  }

  // Check if role can perform the action
  const rolePermissions = actionPermissions[userRole];
  if (!rolePermissions) {
    return {
      allowed: false,
      reason: `Role "${userRole}" has no defined permissions`,
    };
  }

  const allowedActions = rolePermissions[module] || rolePermissions.default || [];
  if (!allowedActions.includes(action)) {
    return {
      allowed: false,
      reason: `Role "${userRole}" cannot perform action "${action}" on module "${module}"`,
    };
  }

  return { allowed: true };
}

/**
 * React hook for RBAC permission checking
 *
 * @param module - Module slug to check permissions for
 * @returns Object with permission checking functions and state
 *
 * @example
 * const { canView, canCreate, canDelete, checkAction } = usePermission('documents');
 *
 * if (canCreate) {
 *   // Show create button
 * }
 */
export function usePermission(module: string) {
  const [permissions, setPermissions] = useState<{
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canApprove: boolean;
    canExport: boolean;
    canAdmin: boolean;
  }>({
    canView: false,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    canApprove: false,
    canExport: false,
    canAdmin: false,
  });

  const checkAction = useCallback((action: RbacAction, userRole: string, clientSafe: boolean = false): PermissionResult => {
    return checkPermission(userRole, { module, action }, clientSafe);
  }, [module]);

  const computePermissions = useCallback((userRole: string, clientSafe: boolean = false) => {
    setPermissions({
      canView: checkPermission(userRole, { module, action: 'view' }, clientSafe).allowed,
      canCreate: checkPermission(userRole, { module, action: 'create' }, clientSafe).allowed,
      canUpdate: checkPermission(userRole, { module, action: 'update' }, clientSafe).allowed,
      canDelete: checkPermission(userRole, { module, action: 'delete' }, clientSafe).allowed,
      canApprove: checkPermission(userRole, { module, action: 'approve' }, clientSafe).allowed,
      canExport: checkPermission(userRole, { module, action: 'export' }, clientSafe).allowed,
      canAdmin: checkPermission(userRole, { module, action: 'admin' }, clientSafe).allowed,
    });
  }, [module]);

  return {
    ...permissions,
    checkAction,
    computePermissions,
  };
}

/**
 * Check if a module should be visible to a role
 *
 * @param module - Module slug
 * @param userRole - User's role
 * @param clientSafe - Whether client-safe mode is enabled
 * @returns boolean indicating if module is visible
 */
export function isModuleVisible(module: string, userRole: string, clientSafe: boolean = false): boolean {
  const result = checkPermission(userRole, { module, action: 'view' }, clientSafe);
  return result.allowed;
}

/**
 * Get list of visible modules for a role
 *
 * @param userRole - User's role
 * @param clientSafe - Whether client-safe mode is enabled
 * @returns Array of module slugs visible to the role
 */
export function getVisibleModulesForRole(userRole: string, clientSafe: boolean = false): string[] {
  return Object.keys(moduleAccess).filter(module =>
    isModuleVisible(module, userRole, clientSafe)
  );
}

/**
 * Get the role hierarchy level (higher = more permissions)
 *
 * @param role - Role to check
 * @returns Number representing role's hierarchy level
 */
export function getRoleLevel(role: string): number {
  return roleHierarchy[role] || 0;
}

/**
 * Check if one role has higher or equal privileges than another
 *
 * @param role - Role to check
 * @param targetRole - Role to compare against
 * @returns boolean
 */
export function hasHigherOrEqualRole(role: string, targetRole: string): boolean {
  return getRoleLevel(role) >= getRoleLevel(targetRole);
}
