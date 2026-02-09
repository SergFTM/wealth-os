/**
 * Memo Builder Engine
 * Generates investment memos from ideas with AI assistance
 */

import { RISK_LEVELS, ASSET_CLASSES, TIME_HORIZONS } from '../config';

export interface Idea {
  id: string;
  ideaNumber: string;
  title: string;
  assetKey?: string;
  assetClass: string;
  horizonKey: string;
  thesisText: string;
  catalystsJson?: Array<{ description: string; timing?: string }>;
  risksJson?: Array<{ description: string; severity?: string }>;
  ipsRefsJson?: Array<{ constraintId: string; constraintName?: string; status?: string }>;
  entryPlanJson?: { zones?: string[]; triggers?: string[]; conditions?: string };
  sizingJson?: { recommendation?: string; maxAllocation?: number };
  exitPlanJson?: { targets?: string[]; stops?: string[]; timeExit?: string };
  riskLevel: string;
  sourceRefsJson?: Array<{ type: string; id?: string; url?: string; title?: string }>;
}

export interface ResearchNote {
  id: string;
  title: string;
  sourceType: string;
  sourceUrl?: string;
  sourceAuthor?: string;
  bodyMd: string;
}

export interface IpsConstraint {
  id: string;
  name: string;
  constraintType: string;
  status: string;
}

export interface MemoSections {
  executiveSummary: string;
  thesisSection: string;
  risksSection: string;
  ipsFitSection: string;
  recommendationSection: string;
  sourcesSection: string;
  fullBodyMd: string;
}

export interface AiMeta {
  confidence: number;
  assumptions: string[];
  sources: string[];
  generatedAt: string;
  disclaimer: string;
}

type Locale = 'ru' | 'en' | 'uk';

/**
 * Build memo sections from idea and related data
 */
export function buildMemoSections(
  idea: Idea,
  notes: ResearchNote[],
  ipsConstraints: IpsConstraint[],
  locale: Locale = 'ru'
): MemoSections {
  const assetClassLabel = ASSET_CLASSES[idea.assetClass as keyof typeof ASSET_CLASSES]?.[locale] || idea.assetClass;
  const horizonLabel = TIME_HORIZONS[idea.horizonKey as keyof typeof TIME_HORIZONS]?.[locale] || idea.horizonKey;
  const riskLabel = RISK_LEVELS[idea.riskLevel as keyof typeof RISK_LEVELS]?.[locale] || idea.riskLevel;

  // Executive Summary
  const executiveSummary = buildExecutiveSummary(idea, assetClassLabel, horizonLabel, riskLabel, locale);

  // Thesis Section
  const thesisSection = buildThesisSection(idea, locale);

  // Risks Section
  const risksSection = buildRisksSection(idea, locale);

  // IPS Fit Section
  const ipsFitSection = buildIpsFitSection(idea, ipsConstraints, locale);

  // Recommendation Section
  const recommendationSection = buildRecommendationSection(idea, locale);

  // Sources Section
  const sourcesSection = buildSourcesSection(idea, notes, locale);

  // Full body combining all sections
  const fullBodyMd = `# ${idea.title}

**${idea.ideaNumber}** | ${assetClassLabel} | ${horizonLabel} | Риск: ${riskLabel}

---

## Резюме

${executiveSummary}

---

## Инвестиционный тезис

${thesisSection}

---

## Риски

${risksSection}

---

## Соответствие IPS

${ipsFitSection}

---

## Рекомендация

${recommendationSection}

---

## Источники

${sourcesSection}

---

*Дисклеймер: Данный документ носит информационный характер. Не является индивидуальной инвестиционной рекомендацией.*
`;

  return {
    executiveSummary,
    thesisSection,
    risksSection,
    ipsFitSection,
    recommendationSection,
    sourcesSection,
    fullBodyMd
  };
}

function buildExecutiveSummary(
  idea: Idea,
  assetClassLabel: string,
  horizonLabel: string,
  riskLabel: string,
  _locale: Locale
): string {
  const catalysts = idea.catalystsJson || [];
  const catalystSummary = catalysts.length > 0
    ? `Ключевые катализаторы: ${catalysts.slice(0, 2).map(c => c.description).join('; ')}.`
    : '';

  return `**${idea.title}** — инвестиционная идея в классе активов "${assetClassLabel}" с горизонтом "${horizonLabel}" и уровнем риска "${riskLabel}".

${idea.thesisText.slice(0, 300)}${idea.thesisText.length > 300 ? '...' : ''}

${catalystSummary}`;
}

function buildThesisSection(idea: Idea, _locale: Locale): string {
  let section = idea.thesisText;

  const catalysts = idea.catalystsJson || [];
  if (catalysts.length > 0) {
    section += '\n\n### Катализаторы\n\n';
    catalysts.forEach((c, i) => {
      section += `${i + 1}. **${c.description}**${c.timing ? ` — ${c.timing}` : ''}\n`;
    });
  }

  return section;
}

function buildRisksSection(idea: Idea, _locale: Locale): string {
  const risks = idea.risksJson || [];
  if (risks.length === 0) {
    return 'Риски не указаны.';
  }

  let section = '';
  risks.forEach((r, i) => {
    const severityBadge = r.severity ? ` [${r.severity.toUpperCase()}]` : '';
    section += `${i + 1}. ${r.description}${severityBadge}\n`;
  });

  return section;
}

function buildIpsFitSection(idea: Idea, constraints: IpsConstraint[], _locale: Locale): string {
  const ipsRefs = idea.ipsRefsJson || [];

  if (ipsRefs.length === 0 && constraints.length === 0) {
    return 'Анализ соответствия IPS не проведён.';
  }

  let section = '| Ограничение | Статус |\n| --- | --- |\n';

  ipsRefs.forEach(ref => {
    const constraint = constraints.find(c => c.id === ref.constraintId);
    const name = ref.constraintName || constraint?.name || ref.constraintId;
    const status = ref.status || constraint?.status || 'Не проверено';
    section += `| ${name} | ${status} |\n`;
  });

  return section;
}

function buildRecommendationSection(idea: Idea, _locale: Locale): string {
  const entry = idea.entryPlanJson;
  const sizing = idea.sizingJson;
  const exit = idea.exitPlanJson;

  let section = '';

  if (entry) {
    section += '### План входа\n\n';
    if (entry.zones?.length) {
      section += `**Зоны входа:** ${entry.zones.join(', ')}\n\n`;
    }
    if (entry.triggers?.length) {
      section += `**Триггеры:** ${entry.triggers.join(', ')}\n\n`;
    }
    if (entry.conditions) {
      section += `**Условия:** ${entry.conditions}\n\n`;
    }
  }

  if (sizing) {
    section += '### Размер позиции\n\n';
    if (sizing.recommendation) {
      section += `${sizing.recommendation}\n\n`;
    }
    if (sizing.maxAllocation) {
      section += `**Макс. аллокация:** ${sizing.maxAllocation}%\n\n`;
    }
  }

  if (exit) {
    section += '### План выхода\n\n';
    if (exit.targets?.length) {
      section += `**Цели:** ${exit.targets.join(', ')}\n\n`;
    }
    if (exit.stops?.length) {
      section += `**Стопы:** ${exit.stops.join(', ')}\n\n`;
    }
    if (exit.timeExit) {
      section += `**Временной выход:** ${exit.timeExit}\n\n`;
    }
  }

  return section || 'Рекомендации не сформулированы.';
}

function buildSourcesSection(idea: Idea, notes: ResearchNote[], _locale: Locale): string {
  const sources = idea.sourceRefsJson || [];

  let section = '';

  if (notes.length > 0) {
    section += '### Исследовательские заметки\n\n';
    notes.forEach((n, i) => {
      section += `${i + 1}. **${n.title}** (${n.sourceType})`;
      if (n.sourceUrl) section += ` — [Источник](${n.sourceUrl})`;
      if (n.sourceAuthor) section += ` — ${n.sourceAuthor}`;
      section += '\n';
    });
    section += '\n';
  }

  if (sources.length > 0) {
    section += '### Дополнительные источники\n\n';
    sources.forEach((s, i) => {
      section += `${i + 1}. ${s.title || s.type}`;
      if (s.url) section += ` — [Ссылка](${s.url})`;
      section += '\n';
    });
  }

  if (!section) {
    section = 'Источники не указаны.';
  }

  return section;
}

/**
 * Generate AI metadata for memo
 */
export function generateAiMeta(
  idea: Idea,
  notes: ResearchNote[],
  locale: Locale = 'ru'
): AiMeta {
  const sources = [
    `Идея: ${idea.ideaNumber}`,
    ...notes.map(n => `Заметка: ${n.title}`)
  ];

  const assumptions = [
    'Тезис основан на предоставленных данных',
    'Рыночные условия могут измениться',
    'IPS ограничения требуют верификации'
  ];

  // Calculate confidence based on completeness
  let confidence = 50;
  if (idea.thesisText.length > 200) confidence += 10;
  if (idea.catalystsJson?.length) confidence += 10;
  if (idea.risksJson?.length) confidence += 10;
  if (idea.entryPlanJson) confidence += 5;
  if (idea.sizingJson) confidence += 5;
  if (notes.length > 0) confidence += 10;
  confidence = Math.min(confidence, 95);

  const disclaimers: Record<string, string> = {
    ru: 'Данный документ сгенерирован автоматически и носит информационный характер. Не является индивидуальной инвестиционной рекомендацией.',
    en: 'This document was auto-generated and is for informational purposes only. This does not constitute individual investment advice.',
    uk: 'Цей документ згенеровано автоматично і має інформаційний характер. Не є індивідуальною інвестиційною рекомендацією.'
  };

  return {
    confidence,
    assumptions,
    sources,
    generatedAt: new Date().toISOString(),
    disclaimer: disclaimers[locale]
  };
}

/**
 * Generate memo title from idea
 */
export function generateMemoTitle(idea: Idea): string {
  return `Инвестиционный меморандум: ${idea.title} (${idea.ideaNumber})`;
}
