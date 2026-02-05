/**
 * Notification Template Renderer
 *
 * Renders notification templates with variable substitution,
 * supporting multiple output formats (text, HTML, Slack, Teams).
 */

export interface NotificationTemplate {
  id: string;
  name: string;
  category: string;
  locale: string;
  channels: string[];
  titleTemplate: string;
  bodyTemplate: string;
  htmlTemplate?: string | null;
  pushTemplate?: string | null;
  slackTemplate?: Record<string, unknown> | null;
  teamsTemplate?: Record<string, unknown> | null;
  variables: Array<{
    name: string;
    type: string;
    required: boolean;
    default?: unknown;
  }>;
  actions?: Array<{
    key: string;
    labelTemplate: string;
    urlTemplate: string;
    style: string;
  }>;
}

export interface RenderContext {
  variables: Record<string, unknown>;
  locale?: string;
  timezone?: string;
}

export interface RenderedNotification {
  title: string;
  body: string;
  html?: string;
  push?: string;
  slack?: Record<string, unknown>;
  teams?: Record<string, unknown>;
  actions?: Array<{
    key: string;
    label: string;
    url: string;
    style: string;
  }>;
}

/**
 * Replaces template variables with actual values
 * Supports {{variable}} and {{variable|format}} syntax
 */
export function replaceVariables(
  template: string,
  variables: Record<string, unknown>,
  locale: string = 'ru',
  timezone: string = 'Europe/Moscow'
): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, expr) => {
    const [varName, format] = expr.trim().split('|').map((s: string) => s.trim());

    let value = getNestedValue(variables, varName);

    if (value === undefined || value === null) {
      return match; // Keep original if variable not found
    }

    // Apply formatting
    if (format) {
      value = applyFormat(value, format, locale, timezone);
    }

    return String(value);
  });
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
 * Applies formatting to a value
 */
function applyFormat(
  value: unknown,
  format: string,
  locale: string,
  timezone: string
): string {
  switch (format) {
    case 'date':
      return formatDate(value, locale, timezone);
    case 'datetime':
      return formatDateTime(value, locale, timezone);
    case 'time':
      return formatTime(value, locale, timezone);
    case 'number':
      return formatNumber(value, locale);
    case 'currency':
      return formatCurrency(value, locale);
    case 'uppercase':
      return String(value).toUpperCase();
    case 'lowercase':
      return String(value).toLowerCase();
    case 'capitalize':
      return capitalize(String(value));
    default:
      return String(value);
  }
}

function formatDate(value: unknown, locale: string, timezone: string): string {
  const date = new Date(String(value));
  return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    timeZone: timezone,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateTime(value: unknown, locale: string, timezone: string): string {
  const date = new Date(String(value));
  return date.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    timeZone: timezone,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime(value: unknown, locale: string, timezone: string): string {
  const date = new Date(String(value));
  return date.toLocaleTimeString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatNumber(value: unknown, locale: string): string {
  const num = Number(value);
  return num.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US');
}

function formatCurrency(value: unknown, locale: string): string {
  const num = Number(value);
  return num.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    style: 'currency',
    currency: locale === 'ru' ? 'RUB' : 'USD',
  });
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Validates that all required variables are present
 */
export function validateVariables(
  template: NotificationTemplate,
  variables: Record<string, unknown>
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const varDef of template.variables) {
    if (varDef.required && !(varDef.name in variables)) {
      // Check if default value exists
      if (varDef.default === undefined) {
        missing.push(varDef.name);
      }
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Merges variables with default values from template
 */
export function mergeWithDefaults(
  template: NotificationTemplate,
  variables: Record<string, unknown>
): Record<string, unknown> {
  const merged = { ...variables };

  for (const varDef of template.variables) {
    if (!(varDef.name in merged) && varDef.default !== undefined) {
      merged[varDef.name] = varDef.default;
    }
  }

  return merged;
}

/**
 * Renders actions from template
 */
export function renderActions(
  template: NotificationTemplate,
  variables: Record<string, unknown>,
  locale: string
): Array<{ key: string; label: string; url: string; style: string }> | undefined {
  if (!template.actions || template.actions.length === 0) {
    return undefined;
  }

  return template.actions.map(action => ({
    key: action.key,
    label: replaceVariables(action.labelTemplate, variables, locale),
    url: replaceVariables(action.urlTemplate, variables, locale),
    style: action.style,
  }));
}

/**
 * Renders Slack block kit template
 */
export function renderSlackTemplate(
  slackTemplate: Record<string, unknown>,
  variables: Record<string, unknown>,
  locale: string
): Record<string, unknown> {
  const jsonStr = JSON.stringify(slackTemplate);
  const rendered = replaceVariables(jsonStr, variables, locale);
  return JSON.parse(rendered);
}

/**
 * Renders Teams adaptive card template
 */
export function renderTeamsTemplate(
  teamsTemplate: Record<string, unknown>,
  variables: Record<string, unknown>,
  locale: string
): Record<string, unknown> {
  const jsonStr = JSON.stringify(teamsTemplate);
  const rendered = replaceVariables(jsonStr, variables, locale);
  return JSON.parse(rendered);
}

/**
 * Main render function - renders all formats from a template
 */
export function renderNotification(
  template: NotificationTemplate,
  context: RenderContext
): RenderedNotification {
  const locale = context.locale || template.locale || 'ru';
  const timezone = context.timezone || 'Europe/Moscow';

  // Merge with defaults
  const variables = mergeWithDefaults(template, context.variables);

  // Validate required variables
  const validation = validateVariables(template, variables);
  if (!validation.valid) {
    console.warn(`Missing required variables: ${validation.missing.join(', ')}`);
  }

  // Render basic templates
  const title = replaceVariables(template.titleTemplate, variables, locale, timezone);
  const body = replaceVariables(template.bodyTemplate, variables, locale, timezone);

  const result: RenderedNotification = { title, body };

  // Render HTML if available
  if (template.htmlTemplate) {
    result.html = replaceVariables(template.htmlTemplate, variables, locale, timezone);
  }

  // Render push if available
  if (template.pushTemplate) {
    result.push = replaceVariables(template.pushTemplate, variables, locale, timezone);
  }

  // Render Slack if available
  if (template.slackTemplate) {
    result.slack = renderSlackTemplate(template.slackTemplate, variables, locale);
  }

  // Render Teams if available
  if (template.teamsTemplate) {
    result.teams = renderTeamsTemplate(template.teamsTemplate, variables, locale);
  }

  // Render actions
  result.actions = renderActions(template, variables, locale);

  return result;
}

/**
 * Renders a simple text template without a full template object
 */
export function renderSimpleTemplate(
  titleTemplate: string,
  bodyTemplate: string,
  variables: Record<string, unknown>,
  locale: string = 'ru'
): { title: string; body: string } {
  return {
    title: replaceVariables(titleTemplate, variables, locale),
    body: replaceVariables(bodyTemplate, variables, locale),
  };
}

/**
 * Extracts variable names from a template string
 */
export function extractVariableNames(template: string): string[] {
  const matches = template.matchAll(/\{\{([^|}]+)/g);
  const names = new Set<string>();

  for (const match of matches) {
    names.add(match[1].trim());
  }

  return Array.from(names);
}

/**
 * Previews a template with sample data
 */
export function previewTemplate(
  template: NotificationTemplate,
  sampleData?: Record<string, unknown>
): RenderedNotification {
  // Generate sample data if not provided
  const variables = sampleData || generateSampleData(template);

  return renderNotification(template, { variables });
}

/**
 * Generates sample data for template preview
 */
function generateSampleData(template: NotificationTemplate): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  for (const varDef of template.variables) {
    if (varDef.default !== undefined) {
      data[varDef.name] = varDef.default;
      continue;
    }

    switch (varDef.type) {
      case 'string':
        data[varDef.name] = `[${varDef.name}]`;
        break;
      case 'number':
        data[varDef.name] = 42;
        break;
      case 'date':
        data[varDef.name] = new Date().toISOString();
        break;
      case 'boolean':
        data[varDef.name] = true;
        break;
      case 'array':
        data[varDef.name] = [];
        break;
      default:
        data[varDef.name] = `[${varDef.name}]`;
    }
  }

  return data;
}
