/**
 * Auto-Close Engine - Automatically closes exceptions when source issues are resolved
 */

import { Exception } from './exceptionRouter';

export interface AutoCloseResult {
  exceptionId: string;
  wasAutoClosable: boolean;
  reason: string;
  updates?: Partial<Exception>;
}

export function checkAutoClose(
  exception: Exception,
  performedBy: string = 'system'
): AutoCloseResult {
  // Skip if already closed
  if (exception.status === 'closed') {
    return {
      exceptionId: exception.id,
      wasAutoClosable: false,
      reason: 'Уже закрыто'
    };
  }

  // Check if source is marked as resolved
  if (!exception.sourceResolved) {
    return {
      exceptionId: exception.id,
      wasAutoClosable: false,
      reason: 'Источник не помечен как исправленный'
    };
  }

  const now = new Date().toISOString();

  const timelineEntry = {
    at: now,
    type: 'closed' as const,
    by: performedBy,
    notes: 'Авто-закрыто: источник исправлен'
  };

  return {
    exceptionId: exception.id,
    wasAutoClosable: true,
    reason: 'Источник исправлен',
    updates: {
      status: 'closed',
      closedAt: now,
      timelineJson: [...(exception.timelineJson || []), timelineEntry],
      updatedAt: now
    }
  };
}

export function markSourceResolved(
  exception: Exception,
  resolved: boolean,
  performedBy: string
): Partial<Exception> {
  const now = new Date().toISOString();

  const timelineEntry = {
    at: now,
    type: 'comment' as const,
    by: performedBy,
    notes: resolved ? 'Источник помечен как исправленный' : 'Источник помечен как неисправленный'
  };

  return {
    sourceResolved: resolved,
    timelineJson: [...(exception.timelineJson || []), timelineEntry],
    updatedAt: now
  };
}

export function runAutoCloseOnBatch(
  exceptions: Exception[],
  performedBy: string = 'system'
): AutoCloseResult[] {
  return exceptions
    .filter(e => e.status !== 'closed')
    .map(e => checkAutoClose(e, performedBy));
}

export function getAutoCloseStats(results: AutoCloseResult[]): {
  total: number;
  closed: number;
  notClosable: number;
  reasonBreakdown: Record<string, number>;
} {
  const closed = results.filter(r => r.wasAutoClosable).length;
  const notClosable = results.filter(r => !r.wasAutoClosable).length;

  const reasonBreakdown: Record<string, number> = {};
  for (const result of results) {
    reasonBreakdown[result.reason] = (reasonBreakdown[result.reason] || 0) + 1;
  }

  return {
    total: results.length,
    closed,
    notClosable,
    reasonBreakdown
  };
}

export function shouldAutoClose(exception: Exception): boolean {
  return exception.sourceResolved === true && exception.status !== 'closed';
}

export function getAutoCloseableExceptions(exceptions: Exception[]): Exception[] {
  return exceptions.filter(shouldAutoClose);
}
