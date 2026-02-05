/**
 * Sandbox Logging Engine
 * Unified logging for sandbox operations
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';
export type LogSource = 'connector' | 'job' | 'mapping' | 'replay' | 'system';

export interface LogEntry {
  envId: string;
  level: LogLevel;
  source: LogSource;
  message: string;
  refs?: {
    jobId?: string;
    connectorId?: string;
    payloadId?: string;
    replayRunId?: string;
    mappingId?: string;
    eventId?: string;
    deliveryId?: string;
  };
  details?: Record<string, unknown>;
  stackTrace?: string;
}

export interface AuditEntry {
  actorRole: string;
  actorName: string;
  action: 'create' | 'update' | 'delete' | 'activate' | 'archive' | 'run' | 'toggle';
  collection: string;
  recordId: string;
  summary: string;
  scope?: string;
  severity?: 'info' | 'warning' | 'critical';
  details?: Record<string, unknown>;
}

// In-memory log buffer for demo purposes
const logBuffer: Array<LogEntry & { id: string; createdAt: string }> = [];
const MAX_BUFFER_SIZE = 1000;

function generateLogId(): string {
  return `sblog-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}

export async function logToSandbox(entry: LogEntry): Promise<string> {
  const logId = generateLogId();
  const timestamp = new Date().toISOString();

  const fullEntry = {
    ...entry,
    id: logId,
    clientId: 'client-001', // Default client
    createdAt: timestamp,
  };

  // Add to buffer
  logBuffer.unshift(fullEntry);
  if (logBuffer.length > MAX_BUFFER_SIZE) {
    logBuffer.pop();
  }

  // Console output for debugging
  const levelColors: Record<LogLevel, string> = {
    debug: '\x1b[90m',
    info: '\x1b[36m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    critical: '\x1b[35m',
  };

  console.log(
    `${levelColors[entry.level]}[SANDBOX ${entry.level.toUpperCase()}]\x1b[0m`,
    `[${entry.source}]`,
    entry.message,
    entry.refs ? JSON.stringify(entry.refs) : ''
  );

  // In production, this would POST to /api/collections/sbLogs
  // For MVP, we use the in-memory buffer

  return logId;
}

export async function logAuditEvent(entry: AuditEntry): Promise<string> {
  // In MVP, audit events are logged via the standard logging
  await logToSandbox({
    envId: 'audit',
    level: entry.severity === 'critical' ? 'error' : entry.severity === 'warning' ? 'warn' : 'info',
    source: 'system',
    message: `AUDIT: ${entry.action} ${entry.collection}/${entry.recordId} - ${entry.summary}`,
    details: {
      ...entry,
      isAudit: true,
    },
  });

  // In production, this would POST to /api/collections/auditEvents
  const auditId = `audit-${Date.now().toString(36)}`;

  return auditId;
}

export function getRecentLogs(options?: {
  envId?: string;
  level?: LogLevel;
  source?: LogSource;
  limit?: number;
}): Array<LogEntry & { id: string; createdAt: string }> {
  let filtered = [...logBuffer];

  if (options?.envId) {
    filtered = filtered.filter(log => log.envId === options.envId);
  }

  if (options?.level) {
    filtered = filtered.filter(log => log.level === options.level);
  }

  if (options?.source) {
    filtered = filtered.filter(log => log.source === options.source);
  }

  const limit = options?.limit || 100;
  return filtered.slice(0, limit);
}

export function clearLogBuffer(): void {
  logBuffer.length = 0;
}

export function exportLogs(format: 'json' | 'csv' = 'json'): string {
  if (format === 'csv') {
    const headers = ['id', 'createdAt', 'envId', 'level', 'source', 'message'];
    const rows = logBuffer.map(log => [
      log.id,
      log.createdAt,
      log.envId,
      log.level,
      log.source,
      `"${log.message.replace(/"/g, '""')}"`,
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  return JSON.stringify(logBuffer, null, 2);
}

// Convenience functions for common log patterns
export const sbLog = {
  debug: (envId: string, source: LogSource, message: string, refs?: LogEntry['refs']) =>
    logToSandbox({ envId, level: 'debug', source, message, refs }),

  info: (envId: string, source: LogSource, message: string, refs?: LogEntry['refs']) =>
    logToSandbox({ envId, level: 'info', source, message, refs }),

  warn: (envId: string, source: LogSource, message: string, refs?: LogEntry['refs']) =>
    logToSandbox({ envId, level: 'warn', source, message, refs }),

  error: (envId: string, source: LogSource, message: string, refs?: LogEntry['refs'], stackTrace?: string) =>
    logToSandbox({ envId, level: 'error', source, message, refs, stackTrace }),

  critical: (envId: string, source: LogSource, message: string, refs?: LogEntry['refs'], stackTrace?: string) =>
    logToSandbox({ envId, level: 'critical', source, message, refs, stackTrace }),
};
