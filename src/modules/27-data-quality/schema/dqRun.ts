/**
 * Data Quality Run Schema
 * Records of rule execution batches
 */

export type DqRunTrigger = 'scheduled' | 'manual' | 'on_change' | 'api';

export interface DqRunSummary {
  totalRecordsScanned: number;
  exceptionsCreated: number;
  exceptionsBySeverity: Record<string, number>;
  duration_ms: number;
}

export interface DqRun {
  id: string;
  clientId?: string;
  runAt: string;
  triggeredBy: DqRunTrigger;
  triggeredByUserId?: string;
  rulesExecuted: string[];
  rulesCount: number;
  exceptionsCreated: number;
  summary: DqRunSummary;
  status: 'completed' | 'failed' | 'running';
  errorMessage?: string;
  createdAt: string;
}

export interface DqRunCreateInput {
  clientId?: string;
  triggeredBy: DqRunTrigger;
  triggeredByUserId?: string;
  rulesExecuted?: string[];
}

export function formatRunDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}
