// AI Context Builder - Builds context from platform data

export interface ContextScope {
  type: 'household' | 'entity' | 'portfolio' | 'account' | 'global';
  id: string;
}

export interface ContextPeriod {
  start: string;
  end: string;
}

export interface BuiltContext {
  scope?: ContextScope;
  module?: string;
  period?: ContextPeriod;
  clientSafe: boolean;
  userRole: string;
  userId: string;
  data: Record<string, unknown>;
}

export interface ContextBuilderOptions {
  scope?: ContextScope;
  module?: string;
  period?: ContextPeriod;
  clientSafe?: boolean;
  userRole?: string;
  userId?: string;
  includeModules?: string[];
}

// Default periods
export function getDefaultPeriod(): ContextPeriod {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

// Build context from options
export function buildContext(options: ContextBuilderOptions): BuiltContext {
  const period = options.period || getDefaultPeriod();

  return {
    scope: options.scope,
    module: options.module,
    period,
    clientSafe: options.clientSafe ?? false,
    userRole: options.userRole || 'user',
    userId: options.userId || 'anonymous',
    data: {},
  };
}

// Get relevant modules for a prompt type
export function getRelevantModules(promptType: string): string[] {
  const moduleMap: Record<string, string[]> = {
    explain_change: ['net-worth', 'performance', 'general-ledger'],
    summarize_risk: ['risk', 'ips', 'compliance'],
    summarize_performance: ['performance', 'net-worth'],
    draft_message: ['comms', 'reporting'],
    draft_committee_pack: ['ips', 'risk', 'performance', 'net-worth'],
    draft_policy_summary: ['ips'],
    triage_tasks: ['workflow', 'integrations', 'ips', 'fees'],
    check_data_quality: ['integrations'],
    general_query: ['net-worth', 'performance', 'risk'],
  };

  return moduleMap[promptType] || ['net-worth'];
}

// Filter context based on user role
export function filterContextByRole(
  context: BuiltContext,
  allowedModules: string[]
): BuiltContext {
  // If allowedModules contains '*', return full context
  if (allowedModules.includes('*')) {
    return context;
  }

  // Filter data to only allowed modules
  const filteredData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context.data)) {
    if (allowedModules.some(mod => key.startsWith(mod))) {
      filteredData[key] = value;
    }
  }

  return {
    ...context,
    data: filteredData,
  };
}

// Apply client-safe redactions
export function applyClientSafeRedactions(
  context: BuiltContext,
  redactionRules: string[]
): BuiltContext {
  if (!context.clientSafe) {
    return context;
  }

  const redactedData: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(context.data)) {
    // Check if this key should be redacted
    const shouldRedact = redactionRules.some(rule => {
      if (rule.includes('*')) {
        const pattern = new RegExp(rule.replace('*', '.*'));
        return pattern.test(key);
      }
      return key === rule;
    });

    if (!shouldRedact) {
      redactedData[key] = value;
    }
  }

  return {
    ...context,
    data: redactedData,
  };
}

// Get context summary for logging
export function getContextSummary(context: BuiltContext): string {
  const parts: string[] = [];

  if (context.scope) {
    parts.push(`scope: ${context.scope.type}/${context.scope.id}`);
  }
  if (context.module) {
    parts.push(`module: ${context.module}`);
  }
  if (context.period) {
    parts.push(`period: ${context.period.start} to ${context.period.end}`);
  }
  parts.push(`clientSafe: ${context.clientSafe}`);
  parts.push(`role: ${context.userRole}`);

  return parts.join(', ');
}
