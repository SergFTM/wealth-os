/**
 * Notification Trigger Engine
 *
 * Evaluates events and conditions to determine if a notification rule should fire.
 * Handles different trigger types: event, schedule, condition, threshold, manual.
 */

export interface TriggerEvent {
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
  sourceId?: string;
  sourceType?: string;
  userId?: string;
  clientId: string;
}

export interface TriggerCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in' | 'notIn';
  value: unknown;
}

export interface NotificationRule {
  id: string;
  clientId: string;
  name: string;
  triggerType: 'event' | 'schedule' | 'condition' | 'threshold' | 'manual';
  triggerEvent?: string;
  triggerSchedule?: string;
  conditions: TriggerCondition[];
  status: 'active' | 'paused' | 'disabled';
  cooldownMinutes?: number | null;
  maxPerDay?: number | null;
  lastFiredAt?: string | null;
  firedCount: number;
}

export interface TriggerResult {
  shouldFire: boolean;
  rule: NotificationRule;
  reason?: string;
  matchedConditions?: string[];
}

/**
 * Evaluates a single condition against a payload value
 */
export function evaluateCondition(
  condition: TriggerCondition,
  payload: Record<string, unknown>
): boolean {
  const fieldValue = getNestedValue(payload, condition.field);

  switch (condition.operator) {
    case 'eq':
      return fieldValue === condition.value;
    case 'neq':
      return fieldValue !== condition.value;
    case 'gt':
      return typeof fieldValue === 'number' && fieldValue > (condition.value as number);
    case 'lt':
      return typeof fieldValue === 'number' && fieldValue < (condition.value as number);
    case 'gte':
      return typeof fieldValue === 'number' && fieldValue >= (condition.value as number);
    case 'lte':
      return typeof fieldValue === 'number' && fieldValue <= (condition.value as number);
    case 'contains':
      return typeof fieldValue === 'string' && fieldValue.includes(condition.value as string);
    case 'in':
      return Array.isArray(condition.value) && condition.value.includes(fieldValue);
    case 'notIn':
      return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
    default:
      return false;
  }
}

/**
 * Gets a nested value from an object using dot notation
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined;
  }, obj as unknown);
}

/**
 * Checks if a rule is within its cooldown period
 */
export function isInCooldown(rule: NotificationRule): boolean {
  if (!rule.cooldownMinutes || !rule.lastFiredAt) {
    return false;
  }

  const lastFired = new Date(rule.lastFiredAt).getTime();
  const cooldownMs = rule.cooldownMinutes * 60 * 1000;
  const now = Date.now();

  return now - lastFired < cooldownMs;
}

/**
 * Checks if a rule has exceeded its daily limit
 */
export function hasExceededDailyLimit(
  rule: NotificationRule,
  todayFiredCount: number
): boolean {
  if (!rule.maxPerDay) {
    return false;
  }

  return todayFiredCount >= rule.maxPerDay;
}

/**
 * Evaluates whether a rule should fire for a given event
 */
export function evaluateTrigger(
  event: TriggerEvent,
  rule: NotificationRule,
  todayFiredCount: number = 0
): TriggerResult {
  // Check if rule is active
  if (rule.status !== 'active') {
    return {
      shouldFire: false,
      rule,
      reason: `Rule is ${rule.status}`,
    };
  }

  // Check if rule applies to this client
  if (rule.clientId !== event.clientId) {
    return {
      shouldFire: false,
      rule,
      reason: 'Client mismatch',
    };
  }

  // Check trigger type match
  if (rule.triggerType === 'event' && rule.triggerEvent !== event.type) {
    return {
      shouldFire: false,
      rule,
      reason: 'Event type mismatch',
    };
  }

  // Check cooldown
  if (isInCooldown(rule)) {
    return {
      shouldFire: false,
      rule,
      reason: 'Rule is in cooldown period',
    };
  }

  // Check daily limit
  if (hasExceededDailyLimit(rule, todayFiredCount)) {
    return {
      shouldFire: false,
      rule,
      reason: 'Daily limit exceeded',
    };
  }

  // Evaluate conditions
  const matchedConditions: string[] = [];

  for (const condition of rule.conditions) {
    if (!evaluateCondition(condition, event.payload)) {
      return {
        shouldFire: false,
        rule,
        reason: `Condition not met: ${condition.field} ${condition.operator} ${JSON.stringify(condition.value)}`,
      };
    }
    matchedConditions.push(`${condition.field} ${condition.operator} ${JSON.stringify(condition.value)}`);
  }

  return {
    shouldFire: true,
    rule,
    matchedConditions,
  };
}

/**
 * Evaluates all rules for a given event and returns those that should fire
 */
export function evaluateAllRules(
  event: TriggerEvent,
  rules: NotificationRule[],
  todayFiredCounts: Record<string, number> = {}
): TriggerResult[] {
  return rules
    .map(rule => evaluateTrigger(event, rule, todayFiredCounts[rule.id] || 0))
    .filter(result => result.shouldFire);
}

/**
 * Parses a cron expression and checks if it matches current time
 * Simplified cron: minute hour day month dayOfWeek
 */
export function matchesCronSchedule(cronExpression: string, date: Date = new Date()): boolean {
  const parts = cronExpression.split(' ');
  if (parts.length !== 5) {
    return false;
  }

  const [minute, hour, day, month, dayOfWeek] = parts;

  const checks = [
    { value: date.getMinutes(), pattern: minute },
    { value: date.getHours(), pattern: hour },
    { value: date.getDate(), pattern: day },
    { value: date.getMonth() + 1, pattern: month },
    { value: date.getDay(), pattern: dayOfWeek },
  ];

  return checks.every(({ value, pattern }) => matchesCronPart(value, pattern));
}

function matchesCronPart(value: number, pattern: string): boolean {
  if (pattern === '*') return true;

  // Handle ranges (e.g., "1-5")
  if (pattern.includes('-')) {
    const [start, end] = pattern.split('-').map(Number);
    return value >= start && value <= end;
  }

  // Handle lists (e.g., "1,3,5")
  if (pattern.includes(',')) {
    return pattern.split(',').map(Number).includes(value);
  }

  // Handle steps (e.g., "*/5")
  if (pattern.includes('/')) {
    const [, step] = pattern.split('/');
    return value % Number(step) === 0;
  }

  return Number(pattern) === value;
}
