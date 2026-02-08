/**
 * Scorecard Engine
 * Generates and manages vendor scorecards
 */

export interface ScorecardCriteria {
  responsiveness: CriteriaScore;
  accuracy: CriteriaScore;
  securityPosture: CriteriaScore;
  costEfficiency: CriteriaScore;
  partnership: CriteriaScore;
}

export interface CriteriaScore {
  score: number; // 0-10
  weight: number; // 0-1
  computed: boolean;
  notes: string;
}

export interface ScorecardResult {
  vendorId: string;
  periodStart: string;
  periodEnd: string;
  criteria: ScorecardCriteria;
  overallScore: number;
  trend: 'improving' | 'stable' | 'declining';
  recommendations: string[];
  confidence: number;
  assumptions: string[];
}

interface IncidentData {
  id: string;
  vendorId: string;
  severity: string;
  status: string;
  reportedAt: string;
  resolvedAt?: string;
}

interface InvoiceData {
  id: string;
  vendorId: string;
  amount: number;
  anomalyFlag?: boolean;
  anomalyScore?: number;
}

interface SlaStatusData {
  vendorId: string;
  status: 'ok' | 'warning' | 'breached';
  metrics?: {
    responseTimeAvg?: number;
    accuracy?: number;
  };
}

interface PreviousScorecard {
  overallScore: number;
  periodEnd: string;
}

const DEFAULT_WEIGHTS = {
  responsiveness: 0.25,
  accuracy: 0.25,
  securityPosture: 0.2,
  costEfficiency: 0.15,
  partnership: 0.15,
};

/**
 * Generate scorecard from data
 */
export function generateScorecard(
  vendorId: string,
  periodStart: string,
  periodEnd: string,
  incidents: IncidentData[],
  invoices: InvoiceData[],
  slaStatus: SlaStatusData | null,
  previousScorecard: PreviousScorecard | null
): ScorecardResult {
  const assumptions: string[] = [];
  const recommendations: string[] = [];

  // Filter data for the period
  const periodIncidents = incidents.filter(
    inc => inc.vendorId === vendorId &&
    new Date(inc.reportedAt) >= new Date(periodStart) &&
    new Date(inc.reportedAt) <= new Date(periodEnd)
  );

  const periodInvoices = invoices.filter(
    inv => inv.vendorId === vendorId
  );

  // Calculate Responsiveness (from SLA metrics and incident resolution)
  let responsivenessScore = 7;
  let responsivenessNotes = '';

  if (slaStatus?.metrics?.responseTimeAvg !== undefined) {
    const responseTime = slaStatus.metrics.responseTimeAvg;
    if (responseTime <= 30) responsivenessScore = 10;
    else if (responseTime <= 60) responsivenessScore = 8;
    else if (responseTime <= 120) responsivenessScore = 6;
    else if (responseTime <= 240) responsivenessScore = 4;
    else responsivenessScore = 2;

    responsivenessNotes = `Среднее время ответа: ${responseTime} мин`;
  } else {
    assumptions.push('Данные о времени ответа недоступны');
    responsivenessNotes = 'На основе общих показателей';
  }

  // Calculate Accuracy (from SLA and incidents)
  let accuracyScore = 8;
  let accuracyNotes = '';

  const qualityIncidents = periodIncidents.filter(
    inc => inc.severity === 'high' || inc.severity === 'critical'
  );

  if (slaStatus?.metrics?.accuracy !== undefined) {
    const accuracy = slaStatus.metrics.accuracy;
    accuracyScore = Math.round(accuracy / 10);
    accuracyNotes = `Точность по SLA: ${accuracy}%`;
  } else {
    accuracyScore = Math.max(2, 10 - qualityIncidents.length);
    accuracyNotes = `${qualityIncidents.length} серьезных инцидентов`;
    assumptions.push('Оценка основана на количестве инцидентов');
  }

  // Calculate Security Posture
  let securityScore = 8;
  let securityNotes = 'Без инцидентов безопасности';

  const securityIncidents = periodIncidents.filter(
    inc => inc.severity === 'critical'
  );

  if (securityIncidents.length > 0) {
    securityScore = Math.max(1, 8 - securityIncidents.length * 2);
    securityNotes = `${securityIncidents.length} критических инцидентов`;
    recommendations.push('Запросить обновленный security questionnaire');
  }

  // Calculate Cost Efficiency
  let costScore = 7;
  let costNotes = '';

  const anomalousInvoices = periodInvoices.filter(inv => inv.anomalyFlag);
  const totalSpend = periodInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  if (periodInvoices.length > 0) {
    const anomalyRate = anomalousInvoices.length / periodInvoices.length;
    if (anomalyRate === 0) costScore = 10;
    else if (anomalyRate < 0.1) costScore = 8;
    else if (anomalyRate < 0.2) costScore = 6;
    else costScore = 4;

    costNotes = `${anomalousInvoices.length} счетов с аномалиями из ${periodInvoices.length}`;
  } else {
    assumptions.push('Нет данных о счетах за период');
    costNotes = 'Нет данных о расходах';
  }

  if (anomalousInvoices.length > 0) {
    recommendations.push('Провести анализ аномальных счетов');
  }

  // Calculate Partnership (simplified - based on overall relationship health)
  let partnershipScore = 7;
  let partnershipNotes = 'Стабильные отношения';

  const openIncidents = periodIncidents.filter(inc => inc.status === 'open').length;
  if (openIncidents > 3) {
    partnershipScore = 5;
    partnershipNotes = `${openIncidents} открытых инцидентов`;
    recommendations.push('Провести встречу с провайдером для обсуждения проблем');
  } else if (openIncidents === 0 && periodIncidents.length < 2) {
    partnershipScore = 9;
    partnershipNotes = 'Отличное сотрудничество';
  }

  // Build criteria object
  const criteria: ScorecardCriteria = {
    responsiveness: {
      score: responsivenessScore,
      weight: DEFAULT_WEIGHTS.responsiveness,
      computed: true,
      notes: responsivenessNotes,
    },
    accuracy: {
      score: accuracyScore,
      weight: DEFAULT_WEIGHTS.accuracy,
      computed: true,
      notes: accuracyNotes,
    },
    securityPosture: {
      score: securityScore,
      weight: DEFAULT_WEIGHTS.securityPosture,
      computed: true,
      notes: securityNotes,
    },
    costEfficiency: {
      score: costScore,
      weight: DEFAULT_WEIGHTS.costEfficiency,
      computed: true,
      notes: costNotes,
    },
    partnership: {
      score: partnershipScore,
      weight: DEFAULT_WEIGHTS.partnership,
      computed: true,
      notes: partnershipNotes,
    },
  };

  // Calculate overall score
  const overallScore = Object.values(criteria).reduce(
    (sum, c) => sum + c.score * c.weight,
    0
  );

  // Determine trend
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (previousScorecard) {
    const diff = overallScore - previousScorecard.overallScore;
    if (diff > 0.5) trend = 'improving';
    else if (diff < -0.5) trend = 'declining';
  } else {
    assumptions.push('Нет предыдущего scorecard для сравнения');
  }

  // Add general recommendations based on overall score
  if (overallScore < 5) {
    recommendations.push('Рассмотреть смену провайдера или пересмотр контракта');
  } else if (overallScore < 7) {
    recommendations.push('Составить план улучшения с провайдером');
  }

  // Calculate confidence
  let confidence = 80;
  if (periodIncidents.length === 0 && periodInvoices.length === 0) {
    confidence = 40;
    assumptions.push('Мало данных для объективной оценки');
  }

  return {
    vendorId,
    periodStart,
    periodEnd,
    criteria,
    overallScore: Math.round(overallScore * 10) / 10,
    trend,
    recommendations,
    confidence,
    assumptions,
  };
}

/**
 * Get score category label
 */
export function getScoreCategory(score: number): {
  label: { ru: string; en: string };
  color: string;
} {
  if (score >= 9) return { label: { ru: 'Отлично', en: 'Excellent' }, color: '#10B981' };
  if (score >= 7) return { label: { ru: 'Хорошо', en: 'Good' }, color: '#22C55E' };
  if (score >= 5) return { label: { ru: 'Удовлетворительно', en: 'Satisfactory' }, color: '#F59E0B' };
  if (score >= 3) return { label: { ru: 'Требует внимания', en: 'Needs Attention' }, color: '#EF4444' };
  return { label: { ru: 'Критично', en: 'Critical' }, color: '#DC2626' };
}

/**
 * Get vendors needing attention based on scorecards
 */
export function getVendorsNeedingAttention(
  scorecards: Array<{ vendorId: string; overallScore: number; trend: string }>
): string[] {
  return scorecards
    .filter(sc => sc.overallScore < 6 || sc.trend === 'declining')
    .map(sc => sc.vendorId);
}
