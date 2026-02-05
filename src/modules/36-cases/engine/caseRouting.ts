/**
 * Case Routing Engine
 * Routes cases to appropriate teams and users
 */

export interface RoutingRule {
  id: string;
  name: string;
  conditions: RoutingCondition[];
  targetType: 'role' | 'user' | 'team';
  targetId: string;
  targetName: string;
  priority: number;
  isActive: boolean;
}

export interface RoutingCondition {
  field: 'caseType' | 'priority' | 'sourceType' | 'scopeType' | 'tags';
  operator: 'equals' | 'in' | 'contains';
  value: string | string[];
}

export interface CaseForRouting {
  caseType: string;
  priority: string;
  sourceType: string;
  scopeType?: string | null;
  tagsJson?: string | null;
}

export interface RoutingResult {
  targetType: 'role' | 'user' | 'team';
  targetId: string;
  targetName: string;
  matchedRule?: string;
  confidence: number;
}

// Default routing map
const defaultRouting: Record<string, Record<string, string>> = {
  request: {
    portal: 'rm',
    internal: 'operations',
    billing: 'finance',
    default: 'operations',
  },
  incident: {
    sync: 'data_ops',
    dq: 'data_ops',
    portal: 'support',
    default: 'support',
  },
  change: {
    default: 'compliance',
  },
  problem: {
    default: 'engineering',
  },
};

// Role display names
const roleNames: Record<string, Record<string, string>> = {
  rm: { ru: 'Relationship Manager', en: 'Relationship Manager', uk: 'Relationship Manager' },
  operations: { ru: 'Operations', en: 'Operations', uk: 'Operations' },
  finance: { ru: 'Finance', en: 'Finance', uk: 'Finance' },
  data_ops: { ru: 'Data Operations', en: 'Data Operations', uk: 'Data Operations' },
  support: { ru: 'Support', en: 'Support', uk: 'Support' },
  compliance: { ru: 'Compliance', en: 'Compliance', uk: 'Compliance' },
  engineering: { ru: 'Engineering', en: 'Engineering', uk: 'Engineering' },
};

export function routeCase(
  caseData: CaseForRouting,
  customRules?: RoutingRule[]
): RoutingResult {
  // Try custom rules first
  if (customRules && customRules.length > 0) {
    const matchingRules = customRules
      .filter(rule => rule.isActive && evaluateConditions(caseData, rule.conditions))
      .sort((a, b) => b.priority - a.priority);

    if (matchingRules.length > 0) {
      const rule = matchingRules[0];
      return {
        targetType: rule.targetType,
        targetId: rule.targetId,
        targetName: rule.targetName,
        matchedRule: rule.name,
        confidence: 0.9,
      };
    }
  }

  // Fall back to default routing
  const typeRouting = defaultRouting[caseData.caseType] || defaultRouting.request;
  const role = typeRouting[caseData.sourceType] || typeRouting.default || 'operations';

  return {
    targetType: 'role',
    targetId: role,
    targetName: roleNames[role]?.en || role,
    confidence: 0.7,
  };
}

function evaluateConditions(
  caseData: CaseForRouting,
  conditions: RoutingCondition[]
): boolean {
  return conditions.every(condition => {
    const fieldValue = getFieldValue(caseData, condition.field);

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue as string);
      case 'contains':
        if (typeof fieldValue === 'string') {
          return fieldValue.includes(condition.value as string);
        }
        if (Array.isArray(fieldValue)) {
          return fieldValue.some(v =>
            Array.isArray(condition.value)
              ? condition.value.includes(v)
              : v === condition.value
          );
        }
        return false;
      default:
        return false;
    }
  });
}

function getFieldValue(caseData: CaseForRouting, field: string): string | string[] | null {
  switch (field) {
    case 'caseType':
      return caseData.caseType;
    case 'priority':
      return caseData.priority;
    case 'sourceType':
      return caseData.sourceType;
    case 'scopeType':
      return caseData.scopeType || null;
    case 'tags':
      return caseData.tagsJson ? JSON.parse(caseData.tagsJson) : [];
    default:
      return null;
  }
}

export function getAvailableAssignees(
  role: string,
  users: { id: string; name: string; role: string; isActive: boolean }[]
): { id: string; name: string }[] {
  return users
    .filter(u => u.isActive && u.role === role)
    .map(u => ({ id: u.id, name: u.name }));
}

export function autoAssign(
  role: string,
  users: { id: string; name: string; role: string; isActive: boolean; caseCount?: number }[]
): { id: string; name: string } | null {
  const eligibleUsers = users.filter(u => u.isActive && u.role === role);

  if (eligibleUsers.length === 0) return null;

  // Simple round-robin based on case count
  const sorted = eligibleUsers.sort((a, b) => (a.caseCount || 0) - (b.caseCount || 0));
  return { id: sorted[0].id, name: sorted[0].name };
}

export function suggestReassignment(
  currentAssignee: string,
  caseType: string,
  priority: string,
  users: { id: string; name: string; role: string; skills?: string[]; isActive: boolean }[]
): { id: string; name: string; reason: string }[] {
  const suggestions: { id: string; name: string; reason: string }[] = [];

  // Find users with relevant skills
  const skillMap: Record<string, string[]> = {
    incident: ['incident_management', 'troubleshooting'],
    change: ['change_management', 'compliance'],
    problem: ['root_cause_analysis', 'engineering'],
  };

  const relevantSkills = skillMap[caseType] || [];

  for (const user of users) {
    if (!user.isActive || user.id === currentAssignee) continue;

    if (user.skills?.some(s => relevantSkills.includes(s))) {
      suggestions.push({
        id: user.id,
        name: user.name,
        reason: `Has relevant skills for ${caseType}`,
      });
    }
  }

  return suggestions.slice(0, 5);
}
