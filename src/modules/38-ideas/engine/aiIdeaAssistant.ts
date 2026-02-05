/**
 * AI Idea Assistant Engine
 * Rules-based AI assistance for investment ideas
 * Always outputs in Russian with disclaimers
 */

import { RISK_LEVELS, ASSET_CLASSES, TIME_HORIZONS } from '../config';

export interface Idea {
  id: string;
  ideaNumber: string;
  title: string;
  assetClass: string;
  horizonKey: string;
  thesisText: string;
  catalystsJson?: Array<{ description: string; timing?: string }>;
  risksJson?: Array<{ description: string; severity?: string }>;
  riskLevel: string;
  status: string;
}

export interface AiResponse {
  content: string;
  sources: string[];
  confidence: number;
  assumptions: string[];
  disclaimer: string;
}

const DISCLAIMER_RU = 'Данный анализ носит информационный характер. Не является индивидуальной инвестиционной рекомендацией.';

/**
 * Summarize an investment idea
 */
export function summarizeIdea(idea: Idea): AiResponse {
  const assetLabel = ASSET_CLASSES[idea.assetClass as keyof typeof ASSET_CLASSES]?.ru || idea.assetClass;
  const horizonLabel = TIME_HORIZONS[idea.horizonKey as keyof typeof TIME_HORIZONS]?.ru || idea.horizonKey;
  const riskLabel = RISK_LEVELS[idea.riskLevel as keyof typeof RISK_LEVELS]?.ru || idea.riskLevel;

  const catalysts = idea.catalystsJson || [];
  const risks = idea.risksJson || [];

  let summary = `## Краткое резюме идеи ${idea.ideaNumber}\n\n`;
  summary += `**${idea.title}**\n\n`;
  summary += `- **Класс актива:** ${assetLabel}\n`;
  summary += `- **Горизонт:** ${horizonLabel}\n`;
  summary += `- **Уровень риска:** ${riskLabel}\n`;
  summary += `- **Статус:** ${idea.status}\n\n`;

  // Thesis summary (first 200 chars)
  const thesisSummary = idea.thesisText.length > 200
    ? idea.thesisText.slice(0, 200) + '...'
    : idea.thesisText;
  summary += `### Тезис\n${thesisSummary}\n\n`;

  // Key catalysts
  if (catalysts.length > 0) {
    summary += `### Ключевые катализаторы\n`;
    catalysts.slice(0, 3).forEach((c, i) => {
      summary += `${i + 1}. ${c.description}\n`;
    });
    summary += '\n';
  }

  // Key risks
  if (risks.length > 0) {
    summary += `### Основные риски\n`;
    risks.slice(0, 3).forEach((r, i) => {
      summary += `${i + 1}. ${r.description}\n`;
    });
    summary += '\n';
  }

  // Calculate confidence based on completeness
  let confidence = 60;
  if (idea.thesisText.length > 200) confidence += 10;
  if (catalysts.length >= 2) confidence += 10;
  if (risks.length >= 2) confidence += 10;
  confidence = Math.min(confidence, 90);

  return {
    content: summary,
    sources: [`Идея ${idea.ideaNumber}`],
    confidence,
    assumptions: [
      'Резюме основано на предоставленных данных идеи',
      'Рыночные условия могут измениться'
    ],
    disclaimer: DISCLAIMER_RU
  };
}

/**
 * Compare two investment ideas
 */
export function compareIdeas(idea1: Idea, idea2: Idea): AiResponse {
  const getLabel = (idea: Idea) => ({
    asset: ASSET_CLASSES[idea.assetClass as keyof typeof ASSET_CLASSES]?.ru || idea.assetClass,
    horizon: TIME_HORIZONS[idea.horizonKey as keyof typeof TIME_HORIZONS]?.ru || idea.horizonKey,
    risk: RISK_LEVELS[idea.riskLevel as keyof typeof RISK_LEVELS]?.ru || idea.riskLevel
  });

  const l1 = getLabel(idea1);
  const l2 = getLabel(idea2);

  let comparison = `## Сравнение идей\n\n`;
  comparison += `| Параметр | ${idea1.ideaNumber} | ${idea2.ideaNumber} |\n`;
  comparison += `| --- | --- | --- |\n`;
  comparison += `| Название | ${idea1.title} | ${idea2.title} |\n`;
  comparison += `| Класс актива | ${l1.asset} | ${l2.asset} |\n`;
  comparison += `| Горизонт | ${l1.horizon} | ${l2.horizon} |\n`;
  comparison += `| Риск | ${l1.risk} | ${l2.risk} |\n`;
  comparison += `| Статус | ${idea1.status} | ${idea2.status} |\n`;
  comparison += `| Катализаторы | ${idea1.catalystsJson?.length || 0} | ${idea2.catalystsJson?.length || 0} |\n`;
  comparison += `| Риски определены | ${idea1.risksJson?.length || 0} | ${idea2.risksJson?.length || 0} |\n\n`;

  // Key differences
  comparison += `### Ключевые отличия\n\n`;

  const differences: string[] = [];

  if (idea1.assetClass !== idea2.assetClass) {
    differences.push(`- Разные классы активов: ${l1.asset} vs ${l2.asset}`);
  }

  if (idea1.horizonKey !== idea2.horizonKey) {
    differences.push(`- Разные горизонты: ${l1.horizon} vs ${l2.horizon}`);
  }

  if (idea1.riskLevel !== idea2.riskLevel) {
    differences.push(`- Разный уровень риска: ${l1.risk} vs ${l2.risk}`);
  }

  if (differences.length === 0) {
    differences.push('- Идеи схожи по основным параметрам');
  }

  comparison += differences.join('\n') + '\n\n';

  // Recommendation
  comparison += `### Рекомендация\n\n`;

  const riskOrder = { low: 1, medium: 2, high: 3, very_high: 4 };
  const risk1 = riskOrder[idea1.riskLevel as keyof typeof riskOrder] || 2;
  const risk2 = riskOrder[idea2.riskLevel as keyof typeof riskOrder] || 2;

  if (risk1 < risk2) {
    comparison += `${idea1.ideaNumber} имеет более консервативный профиль риска.\n`;
  } else if (risk2 < risk1) {
    comparison += `${idea2.ideaNumber} имеет более консервативный профиль риска.\n`;
  } else {
    comparison += `Обе идеи имеют сопоставимый профиль риска.\n`;
  }

  return {
    content: comparison,
    sources: [`Идея ${idea1.ideaNumber}`, `Идея ${idea2.ideaNumber}`],
    confidence: 75,
    assumptions: [
      'Сравнение основано на структурированных данных идей',
      'Качественные аспекты требуют экспертной оценки',
      'Рыночный контекст может влиять на приоритеты'
    ],
    disclaimer: DISCLAIMER_RU
  };
}

/**
 * Draft committee memo outline
 */
export function draftMemoOutline(idea: Idea): AiResponse {
  const assetLabel = ASSET_CLASSES[idea.assetClass as keyof typeof ASSET_CLASSES]?.ru || idea.assetClass;
  const horizonLabel = TIME_HORIZONS[idea.horizonKey as keyof typeof TIME_HORIZONS]?.ru || idea.horizonKey;
  const riskLabel = RISK_LEVELS[idea.riskLevel as keyof typeof RISK_LEVELS]?.ru || idea.riskLevel;

  let outline = `## Проект меморандума для комитета\n\n`;
  outline += `**Идея:** ${idea.ideaNumber} — ${idea.title}\n\n`;

  outline += `### 1. Резюме для руководства\n\n`;
  outline += `Инвестиционная идея в классе активов "${assetLabel}" с горизонтом "${horizonLabel}" и уровнем риска "${riskLabel}".\n\n`;
  outline += `[Краткое изложение тезиса и ключевой рекомендации]\n\n`;

  outline += `### 2. Инвестиционный тезис\n\n`;
  outline += `${idea.thesisText.slice(0, 300)}${idea.thesisText.length > 300 ? '...' : ''}\n\n`;

  outline += `### 3. Катализаторы и сроки\n\n`;
  const catalysts = idea.catalystsJson || [];
  if (catalysts.length > 0) {
    catalysts.forEach((c, i) => {
      outline += `${i + 1}. ${c.description}${c.timing ? ` (${c.timing})` : ''}\n`;
    });
  } else {
    outline += `[Требуется определить катализаторы]\n`;
  }
  outline += '\n';

  outline += `### 4. Анализ рисков\n\n`;
  const risks = idea.risksJson || [];
  if (risks.length > 0) {
    risks.forEach((r, i) => {
      outline += `${i + 1}. ${r.description}${r.severity ? ` [${r.severity}]` : ''}\n`;
    });
  } else {
    outline += `[Требуется анализ рисков]\n`;
  }
  outline += '\n';

  outline += `### 5. Соответствие IPS\n\n`;
  outline += `[Требуется проверка соответствия инвестиционной политике]\n\n`;

  outline += `### 6. План реализации\n\n`;
  outline += `- **Зоны входа:** [Определить]\n`;
  outline += `- **Размер позиции:** [Рекомендация]\n`;
  outline += `- **Стоп-лосс/выход:** [Определить]\n\n`;

  outline += `### 7. Рекомендация комитету\n\n`;
  outline += `[Рекомендация: ОДОБРИТЬ / ОТКЛОНИТЬ / ДОРАБОТАТЬ]\n\n`;

  outline += `---\n\n`;
  outline += `*${DISCLAIMER_RU}*\n`;

  // Calculate confidence
  let confidence = 50;
  if (idea.thesisText.length > 200) confidence += 15;
  if (catalysts.length >= 2) confidence += 10;
  if (risks.length >= 2) confidence += 10;
  confidence = Math.min(confidence, 85);

  return {
    content: outline,
    sources: [`Идея ${idea.ideaNumber}`],
    confidence,
    assumptions: [
      'Проект требует доработки экспертами',
      'IPS соответствие требует отдельной проверки',
      'План реализации требует уточнения'
    ],
    disclaimer: DISCLAIMER_RU
  };
}

/**
 * Suggest improvements for an idea
 */
export function suggestImprovements(idea: Idea): AiResponse {
  const suggestions: string[] = [];

  // Check thesis completeness
  if (idea.thesisText.length < 100) {
    suggestions.push('- **Расширить тезис:** текущее описание слишком краткое для полноценного анализа');
  }

  // Check catalysts
  const catalysts = idea.catalystsJson || [];
  if (catalysts.length === 0) {
    suggestions.push('- **Добавить катализаторы:** определите события/факторы, которые могут реализовать тезис');
  } else if (catalysts.length < 2) {
    suggestions.push('- **Дополнить катализаторы:** рекомендуется минимум 2-3 катализатора');
  }

  // Check timing on catalysts
  const catalystsWithTiming = catalysts.filter(c => c.timing);
  if (catalysts.length > 0 && catalystsWithTiming.length < catalysts.length) {
    suggestions.push('- **Добавить сроки:** укажите ожидаемые сроки для катализаторов');
  }

  // Check risks
  const risks = idea.risksJson || [];
  if (risks.length === 0) {
    suggestions.push('- **Добавить риски:** каждая идея должна иметь анализ рисков');
  } else if (risks.length < 3) {
    suggestions.push('- **Дополнить анализ рисков:** рекомендуется минимум 3 риск-фактора');
  }

  // Check severity on risks
  const risksWithSeverity = risks.filter(r => r.severity);
  if (risks.length > 0 && risksWithSeverity.length < risks.length) {
    suggestions.push('- **Оценить серьёзность рисков:** добавьте оценку (низкий/средний/высокий)');
  }

  // Status specific suggestions
  if (idea.status === 'draft') {
    suggestions.push('- **Изменить статус:** если идея готова, переведите в "Активная"');
  }

  // Build response
  let content = `## Рекомендации по улучшению идеи ${idea.ideaNumber}\n\n`;

  if (suggestions.length === 0) {
    content += 'Идея хорошо проработана. Рекомендаций по улучшению нет.\n';
  } else {
    content += 'Следующие аспекты рекомендуется доработать:\n\n';
    content += suggestions.join('\n') + '\n';
  }

  const completeness = Math.max(0, 100 - suggestions.length * 15);
  content += `\n**Полнота проработки:** ${completeness}%\n`;

  return {
    content,
    sources: [`Идея ${idea.ideaNumber}`],
    confidence: 80,
    assumptions: [
      'Рекомендации основаны на структурной полноте',
      'Качество контента требует экспертной оценки'
    ],
    disclaimer: DISCLAIMER_RU
  };
}

/**
 * Generate AI panel response based on action type
 */
export function generateAiResponse(
  action: 'summarize' | 'compare' | 'draft_memo' | 'suggest',
  ideas: Idea[]
): AiResponse {
  switch (action) {
    case 'summarize':
      if (ideas.length < 1) {
        return {
          content: 'Ошибка: выберите идею для анализа',
          sources: [],
          confidence: 0,
          assumptions: [],
          disclaimer: DISCLAIMER_RU
        };
      }
      return summarizeIdea(ideas[0]);

    case 'compare':
      if (ideas.length < 2) {
        return {
          content: 'Ошибка: выберите две идеи для сравнения',
          sources: [],
          confidence: 0,
          assumptions: [],
          disclaimer: DISCLAIMER_RU
        };
      }
      return compareIdeas(ideas[0], ideas[1]);

    case 'draft_memo':
      if (ideas.length < 1) {
        return {
          content: 'Ошибка: выберите идею для создания меморандума',
          sources: [],
          confidence: 0,
          assumptions: [],
          disclaimer: DISCLAIMER_RU
        };
      }
      return draftMemoOutline(ideas[0]);

    case 'suggest':
      if (ideas.length < 1) {
        return {
          content: 'Ошибка: выберите идею для анализа',
          sources: [],
          confidence: 0,
          assumptions: [],
          disclaimer: DISCLAIMER_RU
        };
      }
      return suggestImprovements(ideas[0]);

    default:
      return {
        content: 'Неизвестное действие',
        sources: [],
        confidence: 0,
        assumptions: [],
        disclaimer: DISCLAIMER_RU
      };
  }
}
