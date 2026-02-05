/**
 * Data Quality Scoring Engine
 * Computes health scores by domain and scope
 */

import { DqMetric, DomainIssue } from '../schema/dqMetric';
import { DqException } from '../schema/dqException';
import { DqConflict } from '../schema/dqConflict';
import { DqReconCheck } from '../schema/dqReconCheck';
import { DQ_SEVERITY, DqDomain, DQ_DOMAINS } from '../config';

export interface ScoringInput {
  exceptions: DqException[];
  conflicts: DqConflict[];
  reconChecks: DqReconCheck[];
  staleSources?: number;
}

export interface DomainScore {
  domain: DqDomain;
  score: number;
  openExceptionsCount: number;
  criticalCount: number;
  warningCount: number;
  topIssues: DomainIssue[];
}

function computeDomainScore(
  domain: DqDomain,
  exceptions: DqException[],
  conflicts: DqConflict[],
  reconChecks: DqReconCheck[]
): DomainScore {
  // Filter to domain
  const domainExceptions = exceptions.filter(e =>
    e.domain === domain && (e.status === 'open' || e.status === 'in_progress')
  );
  const domainConflicts = conflicts.filter(c => c.status === 'open');

  // Start at 100 and subtract
  let score = 100;

  // Subtract for exceptions by severity
  for (const exc of domainExceptions) {
    score -= DQ_SEVERITY[exc.severity].weight;
  }

  // Subtract for conflicts
  score -= domainConflicts.length * 5;

  // Subtract for recon breaks
  const breaks = reconChecks.filter(r => r.status === 'break').length;
  score -= breaks * 10;

  // Ensure score is in valid range
  score = Math.max(0, Math.min(100, score));

  // Count by severity
  const criticalCount = domainExceptions.filter(e => e.severity === 'critical').length;
  const warningCount = domainExceptions.filter(e => e.severity === 'warning').length;

  // Build top issues
  const issueMap = new Map<string, { title: string; severity: string; count: number }>();
  for (const exc of domainExceptions) {
    const key = exc.ruleName || exc.title;
    if (!issueMap.has(key)) {
      issueMap.set(key, { title: key, severity: exc.severity, count: 0 });
    }
    issueMap.get(key)!.count++;
  }

  const topIssues = Array.from(issueMap.values())
    .sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2, ok: 3 };
      const aSev = severityOrder[a.severity as keyof typeof severityOrder] ?? 4;
      const bSev = severityOrder[b.severity as keyof typeof severityOrder] ?? 4;
      if (aSev !== bSev) return aSev - bSev;
      return b.count - a.count;
    })
    .slice(0, 3);

  return {
    domain,
    score: Math.round(score),
    openExceptionsCount: domainExceptions.length,
    criticalCount,
    warningCount,
    topIssues,
  };
}

export function computeAllDomainScores(input: ScoringInput): DomainScore[] {
  const domains = Object.keys(DQ_DOMAINS) as DqDomain[];

  return domains.map(domain =>
    computeDomainScore(
      domain,
      input.exceptions,
      input.conflicts,
      input.reconChecks
    )
  );
}

export function computeOverallHealthScore(domainScores: DomainScore[]): number {
  if (domainScores.length === 0) return 100;

  // Weighted average - domains with issues get more weight
  let totalWeight = 0;
  let weightedSum = 0;

  for (const ds of domainScores) {
    const weight = ds.openExceptionsCount > 0 ? 2 : 1;
    totalWeight += weight;
    weightedSum += ds.score * weight;
  }

  return Math.round(weightedSum / totalWeight);
}

export function scoresToMetrics(
  scores: DomainScore[],
  scopeType: 'global' | 'household' | 'entity' | 'account' = 'global',
  scopeId: string = 'global',
  existingMetrics?: DqMetric[]
): Omit<DqMetric, 'id' | 'createdAt'>[] {
  const now = new Date().toISOString();

  return scores.map(ds => {
    const existing = existingMetrics?.find(
      m => m.domain === ds.domain && m.scopeId === scopeId
    );
    const previousScore = existing?.score;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (previousScore !== undefined) {
      if (ds.score > previousScore) trend = 'up';
      else if (ds.score < previousScore) trend = 'down';
    }

    return {
      scopeType,
      scopeId,
      domain: ds.domain,
      score: ds.score,
      previousScore,
      trend,
      openExceptionsCount: ds.openExceptionsCount,
      criticalCount: ds.criticalCount,
      warningCount: ds.warningCount,
      topIssues: ds.topIssues,
      lastComputedAt: now,
      updatedAt: now,
    };
  });
}

export function getHealthStatus(score: number): {
  status: 'healthy' | 'at_risk' | 'critical';
  label: { ru: string; en: string; uk: string };
} {
  if (score >= 80) {
    return {
      status: 'healthy',
      label: { ru: 'Здоровье в норме', en: 'Healthy', uk: 'Здоров\'я в нормі' },
    };
  }
  if (score >= 50) {
    return {
      status: 'at_risk',
      label: { ru: 'Требует внимания', en: 'At Risk', uk: 'Потребує уваги' },
    };
  }
  return {
    status: 'critical',
    label: { ru: 'Критично', en: 'Critical', uk: 'Критично' },
  };
}
