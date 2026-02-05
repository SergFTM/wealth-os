/**
 * Case Reports Engine
 * Generates metrics and reports for case management
 */

export interface Case {
  id: string;
  caseType: string;
  priority: string;
  status: string;
  assignedToUserId?: string | null;
  assignedToUserName?: string | null;
  slaBreached?: boolean;
  dueAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CaseMetrics {
  totalCases: number;
  openCases: number;
  resolvedCases: number;
  closedCases: number;
  slaMetCount: number;
  slaBreachedCount: number;
  slaComplianceRate: number;
  avgResolutionHours: number;
  avgFirstResponseHours: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  byStatus: Record<string, number>;
  byAssignee: Record<string, number>;
}

export interface WeeklyTrend {
  week: string;
  created: number;
  resolved: number;
  slaBreached: number;
}

export function calculateMetrics(cases: Case[]): CaseMetrics {
  const totalCases = cases.length;
  const openCases = cases.filter(c => c.status === 'open' || c.status === 'in_progress' || c.status === 'awaiting_client').length;
  const resolvedCases = cases.filter(c => c.status === 'resolved').length;
  const closedCases = cases.filter(c => c.status === 'closed').length;

  const completedCases = cases.filter(c => c.status === 'resolved' || c.status === 'closed');
  const slaMetCount = completedCases.filter(c => !c.slaBreached).length;
  const slaBreachedCount = completedCases.filter(c => c.slaBreached).length;
  const slaComplianceRate = completedCases.length > 0
    ? slaMetCount / completedCases.length
    : 1;

  // Calculate average resolution time
  let totalResolutionHours = 0;
  let resolvedWithTime = 0;
  for (const c of completedCases) {
    if (c.resolvedAt) {
      const created = new Date(c.createdAt).getTime();
      const resolved = new Date(c.resolvedAt).getTime();
      totalResolutionHours += (resolved - created) / (1000 * 60 * 60);
      resolvedWithTime++;
    }
  }
  const avgResolutionHours = resolvedWithTime > 0
    ? totalResolutionHours / resolvedWithTime
    : 0;

  // Group by dimensions
  const byType: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byAssignee: Record<string, number> = {};

  for (const c of cases) {
    byType[c.caseType] = (byType[c.caseType] || 0) + 1;
    byPriority[c.priority] = (byPriority[c.priority] || 0) + 1;
    byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    if (c.assignedToUserName) {
      byAssignee[c.assignedToUserName] = (byAssignee[c.assignedToUserName] || 0) + 1;
    }
  }

  return {
    totalCases,
    openCases,
    resolvedCases,
    closedCases,
    slaMetCount,
    slaBreachedCount,
    slaComplianceRate,
    avgResolutionHours,
    avgFirstResponseHours: 0, // Would need response tracking
    byType,
    byPriority,
    byStatus,
    byAssignee,
  };
}

export function calculateWeeklyTrends(cases: Case[], weeks: number = 8): WeeklyTrend[] {
  const trends: WeeklyTrend[] = [];
  const now = new Date();

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weekCases = cases.filter(c => {
      const created = new Date(c.createdAt);
      return created >= weekStart && created < weekEnd;
    });

    const resolvedThisWeek = cases.filter(c => {
      if (!c.resolvedAt) return false;
      const resolved = new Date(c.resolvedAt);
      return resolved >= weekStart && resolved < weekEnd;
    });

    const breachedThisWeek = weekCases.filter(c => c.slaBreached);

    trends.push({
      week: weekStart.toISOString().split('T')[0],
      created: weekCases.length,
      resolved: resolvedThisWeek.length,
      slaBreached: breachedThisWeek.length,
    });
  }

  return trends;
}

export function generateSlaReport(
  cases: Case[],
  periodStart: Date,
  periodEnd: Date
): {
  summary: string;
  metrics: CaseMetrics;
  recommendations: string[];
} {
  const periodCases = cases.filter(c => {
    const created = new Date(c.createdAt);
    return created >= periodStart && created <= periodEnd;
  });

  const metrics = calculateMetrics(periodCases);

  const recommendations: string[] = [];

  if (metrics.slaComplianceRate < 0.9) {
    recommendations.push('SLA compliance below 90%. Review capacity and prioritization.');
  }

  if (metrics.avgResolutionHours > 48) {
    recommendations.push('Average resolution time exceeds 48 hours. Consider process improvements.');
  }

  const incidentRatio = (metrics.byType.incident || 0) / metrics.totalCases;
  if (incidentRatio > 0.3) {
    recommendations.push('High incident ratio. Investigate root causes and implement preventive measures.');
  }

  if (metrics.byPriority.critical > 5) {
    recommendations.push('Elevated critical case count. Review escalation procedures.');
  }

  const summary = `
Period: ${periodStart.toISOString().split('T')[0]} to ${periodEnd.toISOString().split('T')[0]}
Total Cases: ${metrics.totalCases}
Resolved: ${metrics.resolvedCases}
SLA Compliance: ${(metrics.slaComplianceRate * 100).toFixed(1)}%
Avg Resolution: ${metrics.avgResolutionHours.toFixed(1)} hours
  `.trim();

  return { summary, metrics, recommendations };
}

export function getTopPerformers(
  cases: Case[],
  limit: number = 5
): { name: string; resolved: number; slaRate: number }[] {
  const assigneeStats: Record<string, { resolved: number; slaMet: number; total: number }> = {};

  const completedCases = cases.filter(c => c.status === 'resolved' || c.status === 'closed');

  for (const c of completedCases) {
    if (!c.assignedToUserName) continue;

    if (!assigneeStats[c.assignedToUserName]) {
      assigneeStats[c.assignedToUserName] = { resolved: 0, slaMet: 0, total: 0 };
    }

    assigneeStats[c.assignedToUserName].resolved++;
    assigneeStats[c.assignedToUserName].total++;
    if (!c.slaBreached) {
      assigneeStats[c.assignedToUserName].slaMet++;
    }
  }

  return Object.entries(assigneeStats)
    .map(([name, stats]) => ({
      name,
      resolved: stats.resolved,
      slaRate: stats.total > 0 ? stats.slaMet / stats.total : 1,
    }))
    .sort((a, b) => b.resolved - a.resolved)
    .slice(0, limit);
}

export function getCaseVelocity(
  cases: Case[],
  days: number = 30
): { created: number; resolved: number; netChange: number } {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const recentCases = cases.filter(c => new Date(c.createdAt) >= cutoff);
  const recentResolved = cases.filter(c => c.resolvedAt && new Date(c.resolvedAt) >= cutoff);

  return {
    created: recentCases.length,
    resolved: recentResolved.length,
    netChange: recentCases.length - recentResolved.length,
  };
}
