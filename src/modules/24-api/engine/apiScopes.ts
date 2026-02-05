/**
 * API Scopes Engine
 * Manages and validates API key scopes
 */

import { ApiKeyScope, ActionKey, ScopeType, availableModules } from '../schema/apiKeyScope';
import { KeyMode } from '../schema/apiKey';

// Default scopes for each key mode
export function getDefaultScopes(
  apiKeyId: string,
  keyMode: KeyMode,
  clientId?: string,
  householdId?: string
): Partial<ApiKeyScope>[] {
  const now = new Date().toISOString();

  if (keyMode === 'server') {
    // Server keys get global read access to all modules
    return availableModules.map((moduleKey) => ({
      apiKeyId,
      moduleKey,
      actionKey: 'view' as ActionKey,
      scopeType: 'global' as ScopeType,
      clientSafe: false,
      createdAt: now,
    }));
  }

  if (keyMode === 'advisor') {
    // Advisor keys get household-scoped read access
    return availableModules.slice(0, 8).map((moduleKey) => ({
      apiKeyId,
      moduleKey,
      actionKey: 'view' as ActionKey,
      scopeType: 'household' as ScopeType,
      scopeId: householdId,
      clientSafe: false,
      createdAt: now,
    }));
  }

  if (keyMode === 'client') {
    // Client keys get limited client-safe access
    const clientModules = ['net-worth', 'performance', 'documents', 'invoices'];
    return clientModules.map((moduleKey) => ({
      apiKeyId,
      moduleKey,
      actionKey: 'view' as ActionKey,
      scopeType: 'household' as ScopeType,
      scopeId: householdId,
      clientSafe: true,
      createdAt: now,
    }));
  }

  return [];
}

// Validate scope configuration
export interface ScopeValidation {
  valid: boolean;
  errors: string[];
}

export function validateScope(scope: Partial<ApiKeyScope>): ScopeValidation {
  const errors: string[] = [];

  if (!scope.moduleKey) {
    errors.push('moduleKey is required');
  } else if (!availableModules.includes(scope.moduleKey)) {
    errors.push(`Invalid moduleKey: ${scope.moduleKey}`);
  }

  if (!scope.actionKey) {
    errors.push('actionKey is required');
  }

  if (!scope.scopeType) {
    errors.push('scopeType is required');
  }

  // Non-global scopes should have scopeId
  if (scope.scopeType !== 'global' && !scope.scopeId) {
    errors.push(`scopeId is required for scopeType: ${scope.scopeType}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Check if scope allows access to resource
export function scopeAllowsAccess(
  scope: ApiKeyScope,
  resource: {
    moduleKey: string;
    actionKey: ActionKey;
    scopeType?: ScopeType;
    scopeId?: string;
  }
): boolean {
  // Module must match
  if (scope.moduleKey !== resource.moduleKey) return false;

  // Action must match
  if (scope.actionKey !== resource.actionKey) return false;

  // Global scope grants access to everything
  if (scope.scopeType === 'global') return true;

  // Check scope hierarchy
  if (resource.scopeType) {
    if (scope.scopeType !== resource.scopeType) return false;
  }

  // Check specific scope ID
  if (scope.scopeId && resource.scopeId) {
    if (scope.scopeId !== resource.scopeId) return false;
  }

  return true;
}

// Get human-readable scope description
export function describeScopeRu(scope: ApiKeyScope): string {
  const actions: Record<ActionKey, string> = {
    view: 'Просмотр',
    create: 'Создание',
    edit: 'Редактирование',
    approve: 'Утверждение',
    export: 'Экспорт',
  };

  const scopes: Record<ScopeType, string> = {
    global: 'глобально',
    household: 'домохозяйство',
    entity: 'структура',
    portfolio: 'портфель',
  };

  let desc = `${actions[scope.actionKey]} ${scope.moduleKey}`;
  desc += ` (${scopes[scope.scopeType]}`;
  if (scope.scopeId) {
    desc += `: ${scope.scopeId}`;
  }
  desc += ')';

  if (scope.clientSafe) {
    desc += ' [client-safe]';
  }

  return desc;
}

// Count scopes by type
export function countScopesByType(scopes: ApiKeyScope[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const scope of scopes) {
    const key = `${scope.actionKey}:${scope.scopeType}`;
    counts[key] = (counts[key] || 0) + 1;
  }

  return counts;
}
