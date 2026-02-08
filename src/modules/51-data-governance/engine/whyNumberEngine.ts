import { DataKpi, DataLineage, DataQualityScore, WhyThisNumber } from './types';

export interface WhyNumberInput {
  kpi: DataKpi;
  lineage?: DataLineage;
  qualityScore?: DataQualityScore;
  sourceData?: Record<string, unknown>;
}

/**
 * Build "Why This Number" explanation for a KPI
 */
export function buildWhyThisNumber(input: WhyNumberInput): WhyThisNumber {
  const { kpi, lineage, qualityScore } = input;

  // Parse current value
  const currentValue = kpi.lastValueJson || { value: 0, computedAt: new Date().toISOString() };

  // Build inputs from lineage
  const inputs = lineage?.inputsJson.map(inp => ({
    name: inp.collection,
    collection: inp.collection,
    fields: inp.fields,
    sourceLink: `/api/collections/${inp.collection}`,
  })) || [];

  // Build transforms from lineage
  const transforms = lineage?.transformsJson.map(t => ({
    step: t.stepNo,
    title: t.title,
    description: t.description,
    formula: t.formula,
    risk: t.riskKey,
  })) || [];

  // Parse assumptions
  const assumptions = kpi.assumptionsText?.split('\n').filter(a => a.trim()) || [];

  // Determine confidence based on quality score and trust badge
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  if (qualityScore) {
    if (qualityScore.scoreTotal >= 80) confidence = 'high';
    else if (qualityScore.scoreTotal < 60) confidence = 'low';
  }
  if (kpi.trustBadgeKey === 'stale') confidence = 'low';

  // Build sources list
  const sources = inputs.map(inp => ({
    name: inp.collection,
    type: 'collection',
    lastSync: kpi.asOf,
  }));

  return {
    kpiId: kpi.id,
    kpiName: kpi.name,
    definition: kpi.description,
    formula: kpi.formulaText,
    currentValue: {
      value: currentValue.value,
      currency: currentValue.currency || kpi.currency,
      unit: currentValue.unit,
    },
    asOf: kpi.asOf,
    inputs,
    transforms,
    assumptions,
    confidence,
    qualityScore: qualityScore?.scoreTotal,
    trustBadge: kpi.trustBadgeKey,
    lastUpdated: kpi.updatedAt,
    sources,
  };
}

/**
 * Generate human-readable explanation text
 */
export function generateExplanationText(why: WhyThisNumber, locale: 'ru' | 'en' | 'uk' = 'ru'): string {
  const templates = {
    ru: {
      intro: `**${why.kpiName}** — ${why.definition}`,
      formula: `\n\n**Формула:** ${why.formula}`,
      value: `\n\n**Текущее значение:** ${formatValue(why.currentValue.value, why.currentValue.currency)}`,
      asOf: `\n**По состоянию на:** ${formatDate(why.asOf)}`,
      sources: `\n\n**Источники данных:** ${why.sources.map(s => s.name).join(', ')}`,
      transforms: why.transforms.length > 0
        ? `\n\n**Этапы расчета:**\n${why.transforms.map(t => `${t.step}. ${t.title}: ${t.description}`).join('\n')}`
        : '',
      assumptions: why.assumptions.length > 0
        ? `\n\n**Допущения:**\n${why.assumptions.map(a => `• ${a}`).join('\n')}`
        : '',
      quality: why.qualityScore !== undefined
        ? `\n\n**Качество данных:** ${why.qualityScore}%`
        : '',
      badge: `\n**Trust Badge:** ${why.trustBadge}`,
    },
    en: {
      intro: `**${why.kpiName}** — ${why.definition}`,
      formula: `\n\n**Formula:** ${why.formula}`,
      value: `\n\n**Current Value:** ${formatValue(why.currentValue.value, why.currentValue.currency)}`,
      asOf: `\n**As of:** ${formatDate(why.asOf)}`,
      sources: `\n\n**Data Sources:** ${why.sources.map(s => s.name).join(', ')}`,
      transforms: why.transforms.length > 0
        ? `\n\n**Calculation Steps:**\n${why.transforms.map(t => `${t.step}. ${t.title}: ${t.description}`).join('\n')}`
        : '',
      assumptions: why.assumptions.length > 0
        ? `\n\n**Assumptions:**\n${why.assumptions.map(a => `• ${a}`).join('\n')}`
        : '',
      quality: why.qualityScore !== undefined
        ? `\n\n**Data Quality:** ${why.qualityScore}%`
        : '',
      badge: `\n**Trust Badge:** ${why.trustBadge}`,
    },
    uk: {
      intro: `**${why.kpiName}** — ${why.definition}`,
      formula: `\n\n**Формула:** ${why.formula}`,
      value: `\n\n**Поточне значення:** ${formatValue(why.currentValue.value, why.currentValue.currency)}`,
      asOf: `\n**Станом на:** ${formatDate(why.asOf)}`,
      sources: `\n\n**Джерела даних:** ${why.sources.map(s => s.name).join(', ')}`,
      transforms: why.transforms.length > 0
        ? `\n\n**Етапи розрахунку:**\n${why.transforms.map(t => `${t.step}. ${t.title}: ${t.description}`).join('\n')}`
        : '',
      assumptions: why.assumptions.length > 0
        ? `\n\n**Припущення:**\n${why.assumptions.map(a => `• ${a}`).join('\n')}`
        : '',
      quality: why.qualityScore !== undefined
        ? `\n\n**Якість даних:** ${why.qualityScore}%`
        : '',
      badge: `\n**Trust Badge:** ${why.trustBadge}`,
    },
  };

  const t = templates[locale];
  return t.intro + t.formula + t.value + t.asOf + t.sources + t.transforms + t.assumptions + t.quality + t.badge;
}

/**
 * Get confidence explanation
 */
export function getConfidenceExplanation(confidence: 'high' | 'medium' | 'low', locale: 'ru' | 'en' | 'uk' = 'ru'): string {
  const explanations = {
    high: {
      ru: 'Высокая уверенность: данные актуальны, качество высокое, все источники подтверждены.',
      en: 'High confidence: data is current, quality is high, all sources are verified.',
      uk: 'Висока впевненість: дані актуальні, якість висока, всі джерела підтверджені.',
    },
    medium: {
      ru: 'Средняя уверенность: некоторые данные могут быть неполными или требуют проверки.',
      en: 'Medium confidence: some data may be incomplete or requires verification.',
      uk: 'Середня впевненість: деякі дані можуть бути неповними або потребують перевірки.',
    },
    low: {
      ru: 'Низкая уверенность: данные устарели или имеют значительные проблемы с качеством.',
      en: 'Low confidence: data is stale or has significant quality issues.',
      uk: 'Низька впевненість: дані застаріли або мають значні проблеми з якістю.',
    },
  };

  return explanations[confidence][locale];
}

// Helper functions
function formatValue(value: number, currency?: string): string {
  if (currency) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat('ru-RU').format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
