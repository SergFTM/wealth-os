/**
 * SLA Monitor Engine
 * Computes SLA metrics from incidents and response times
 */

export interface SlaMetrics {
  responseTimeAvg: number; // minutes
  uptime: number; // percentage
  accuracy: number; // percentage
  resolutionTimeAvg: number; // hours
  breachCount: number;
  warningCount: number;
}

export interface SlaStatus {
  slaId: string;
  vendorId: string;
  status: 'ok' | 'warning' | 'breached';
  metrics: SlaMetrics;
  breaches: SlaBreachEvent[];
  lastUpdated: string;
}

export interface SlaBreachEvent {
  date: string;
  kpiName: string;
  expected: number;
  actual: number;
  severity: 'warning' | 'breach';
  linkedIncidentId?: string;
}

export interface SlaKpi {
  name: string;
  target: number;
  unit: string;
  direction: 'higher' | 'lower';
  weight: number;
}

interface IncidentData {
  id: string;
  vendorId: string;
  slaId?: string;
  severity: string;
  status: string;
  reportedAt: string;
  resolvedAt?: string;
  category?: string;
}

interface SlaData {
  id: string;
  vendorId: string;
  kpisJson?: SlaKpi[];
  metricsJson?: SlaMetrics;
  status: string;
}

/**
 * Calculate SLA metrics from incidents
 */
export function calculateSlaMetrics(
  incidents: IncidentData[],
  periodDays: number = 30
): SlaMetrics {
  const now = new Date();
  const periodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

  const recentIncidents = incidents.filter(
    inc => new Date(inc.reportedAt) >= periodStart
  );

  // Calculate response time (time to start working on incident)
  const resolvedIncidents = recentIncidents.filter(inc => inc.resolvedAt);

  let responseTimeAvg = 0;
  let resolutionTimeAvg = 0;

  if (resolvedIncidents.length > 0) {
    const resolutionTimes = resolvedIncidents.map(inc => {
      const reported = new Date(inc.reportedAt).getTime();
      const resolved = new Date(inc.resolvedAt!).getTime();
      return (resolved - reported) / (1000 * 60 * 60); // hours
    });

    resolutionTimeAvg = resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length;
    responseTimeAvg = resolutionTimeAvg * 0.1 * 60; // Estimate: 10% of resolution time in minutes
  }

  // Calculate uptime (inverse of incident count weighted by severity)
  const severeIncidents = recentIncidents.filter(
    inc => inc.severity === 'critical' || inc.severity === 'high'
  ).length;

  const uptimeDeduction = Math.min(severeIncidents * 2, 20); // Max 20% deduction
  const uptime = 100 - uptimeDeduction;

  // Breach and warning counts
  const breachCount = recentIncidents.filter(inc => inc.category === 'sla_breach').length;
  const warningCount = recentIncidents.filter(
    inc => inc.severity === 'medium' || inc.severity === 'low'
  ).length;

  // Accuracy (simplified - based on incident categories)
  const dataBreaches = recentIncidents.filter(inc => inc.category === 'data_breach').length;
  const qualityIssues = recentIncidents.filter(inc => inc.category === 'quality').length;
  const accuracy = 100 - (dataBreaches * 5) - (qualityIssues * 2);

  return {
    responseTimeAvg: Math.round(responseTimeAvg),
    uptime: Math.max(0, uptime),
    accuracy: Math.max(0, accuracy),
    resolutionTimeAvg: Math.round(resolutionTimeAvg * 10) / 10,
    breachCount,
    warningCount,
  };
}

/**
 * Evaluate SLA status based on KPIs and metrics
 */
export function evaluateSlaStatus(
  sla: SlaData,
  metrics: SlaMetrics
): SlaStatus {
  const breaches: SlaBreachEvent[] = [];
  const kpis = sla.kpisJson || [];
  const now = new Date().toISOString();

  let hasBreaches = false;
  let hasWarnings = false;

  // Check each KPI
  kpis.forEach(kpi => {
    let actual: number | undefined;

    switch (kpi.name.toLowerCase()) {
      case 'response_time':
      case 'response time':
        actual = metrics.responseTimeAvg;
        break;
      case 'uptime':
        actual = metrics.uptime;
        break;
      case 'accuracy':
        actual = metrics.accuracy;
        break;
      case 'resolution_time':
      case 'resolution time':
        actual = metrics.resolutionTimeAvg;
        break;
    }

    if (actual === undefined) return;

    const isBreached = kpi.direction === 'higher'
      ? actual < kpi.target
      : actual > kpi.target;

    // Calculate warning threshold (10% margin)
    const warningThreshold = kpi.direction === 'higher'
      ? kpi.target * 1.1
      : kpi.target * 0.9;

    const isWarning = kpi.direction === 'higher'
      ? actual < warningThreshold && !isBreached
      : actual > warningThreshold && !isBreached;

    if (isBreached) {
      hasBreaches = true;
      breaches.push({
        date: now,
        kpiName: kpi.name,
        expected: kpi.target,
        actual,
        severity: 'breach',
      });
    } else if (isWarning) {
      hasWarnings = true;
      breaches.push({
        date: now,
        kpiName: kpi.name,
        expected: kpi.target,
        actual,
        severity: 'warning',
      });
    }
  });

  // Also consider direct breach count
  if (metrics.breachCount > 0) {
    hasBreaches = true;
  }

  let status: 'ok' | 'warning' | 'breached' = 'ok';
  if (hasBreaches) {
    status = 'breached';
  } else if (hasWarnings || metrics.warningCount > 2) {
    status = 'warning';
  }

  return {
    slaId: sla.id,
    vendorId: sla.vendorId,
    status,
    metrics,
    breaches,
    lastUpdated: now,
  };
}

/**
 * Get SLAs requiring attention
 */
export function getSlasRequiringAttention(
  slaStatuses: SlaStatus[]
): SlaStatus[] {
  return slaStatuses.filter(s => s.status === 'breached' || s.status === 'warning');
}

/**
 * Create notification for SLA breach
 */
export function createSlaBreachNotification(
  slaStatus: SlaStatus,
  vendorName: string
): {
  type: string;
  severity: string;
  title: string;
  message: string;
  linkedEntityType: string;
  linkedEntityId: string;
} {
  const isBreached = slaStatus.status === 'breached';

  return {
    type: 'sla_alert',
    severity: isBreached ? 'critical' : 'warning',
    title: isBreached
      ? `SLA нарушение: ${vendorName}`
      : `SLA предупреждение: ${vendorName}`,
    message: slaStatus.breaches.length > 0
      ? `Нарушены KPI: ${slaStatus.breaches.map(b => b.kpiName).join(', ')}`
      : `Метрики SLA близки к пороговым значениям`,
    linkedEntityType: 'sla',
    linkedEntityId: slaStatus.slaId,
  };
}

/**
 * Calculate SLA compliance rate for vendor
 */
export function calculateVendorSlaCompliance(
  slaStatuses: SlaStatus[]
): number {
  if (slaStatuses.length === 0) return 100;

  const compliant = slaStatuses.filter(s => s.status === 'ok').length;
  return Math.round((compliant / slaStatuses.length) * 100);
}
