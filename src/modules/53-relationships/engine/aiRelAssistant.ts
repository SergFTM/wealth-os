/**
 * AI Relationship Assistant
 * Summarize history, draft follow-up, suggest next best action
 * Always in RU, informational, no auto-send
 */

export interface AiSuggestion {
  type: 'summary' | 'draft' | 'next_action';
  content: string;
  confidence: 'high' | 'medium' | 'low';
  sources: string[];
  assumptions: string[];
  disclaimer: string;
}

export interface RelInteraction {
  id: string;
  occurredAt: string;
  summary: string;
  interactionTypeKey: string;
  statusKey: string;
  followUpDueAt?: string;
}

export interface RelInitiative {
  id: string;
  title: string;
  stageKey: string;
  dueAt?: string;
}

export interface RelHousehold {
  id: string;
  name: string;
  tierKey: string;
}

const DISCLAIMER_RU = 'Рекомендации AI носят информационный характер и требуют проверки человеком';
const DISCLAIMER_EN = 'AI recommendations are informational and require human verification';
const DISCLAIMER_UK = 'Рекомендації AI носять інформаційний характер і потребують перевірки людиною';

export function getDisclaimer(locale: 'ru' | 'en' | 'uk' = 'ru'): string {
  const disclaimers = { ru: DISCLAIMER_RU, en: DISCLAIMER_EN, uk: DISCLAIMER_UK };
  return disclaimers[locale];
}

export async function summarizeRelationshipHistory(
  household: RelHousehold,
  interactions: RelInteraction[],
  initiatives: RelInitiative[],
  locale: 'ru' | 'en' | 'uk' = 'ru'
): Promise<AiSuggestion> {
  const sources: string[] = [];
  const assumptions: string[] = [];

  // Count interactions by type
  const interactionCounts = interactions.reduce((acc, i) => {
    acc[i.interactionTypeKey] = (acc[i.interactionTypeKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent interactions
  const recentInteractions = interactions
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 5);

  sources.push(`${interactions.length} взаимодействий за всё время`);
  sources.push(`${initiatives.length} инициатив`);

  // Open initiatives
  const openInitiatives = initiatives.filter(i => i.stageKey !== 'done');

  // Build summary
  let summary = '';

  if (locale === 'ru') {
    summary = `## Сводка по ${household.name}\n\n`;
    summary += `**Tier:** ${household.tierKey}\n\n`;
    summary += `### Статистика взаимодействий\n`;
    summary += `- Всего: ${interactions.length}\n`;
    summary += `- Встречи: ${interactionCounts.meeting || 0}\n`;
    summary += `- Звонки: ${interactionCounts.call || 0}\n`;
    summary += `- Сообщения: ${interactionCounts.message || 0}\n\n`;

    if (recentInteractions.length > 0) {
      summary += `### Последние взаимодействия\n`;
      for (const i of recentInteractions) {
        const date = new Date(i.occurredAt).toLocaleDateString('ru-RU');
        summary += `- ${date}: ${i.summary}\n`;
      }
      summary += '\n';
    }

    if (openInitiatives.length > 0) {
      summary += `### Открытые инициативы (${openInitiatives.length})\n`;
      for (const init of openInitiatives.slice(0, 3)) {
        summary += `- ${init.title} (${getStageLabel(init.stageKey)})\n`;
      }
    }
  } else {
    summary = `## Summary for ${household.name}\n\n`;
    summary += `**Tier:** ${household.tierKey}\n\n`;
    summary += `Total interactions: ${interactions.length}\n`;
    summary += `Open initiatives: ${openInitiatives.length}\n`;
  }

  assumptions.push('Анализ основан на доступных данных');

  return {
    type: 'summary',
    content: summary,
    confidence: interactions.length > 10 ? 'high' : 'medium',
    sources,
    assumptions,
    disclaimer: getDisclaimer(locale),
  };
}

export async function draftFollowUpMessage(
  household: RelHousehold,
  lastInteraction: RelInteraction | null,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): Promise<AiSuggestion> {
  const sources: string[] = [];
  const assumptions: string[] = [];

  let draft = '';

  if (locale === 'ru') {
    draft = `Уважаемый клиент,\n\n`;

    if (lastInteraction) {
      const date = new Date(lastInteraction.occurredAt).toLocaleDateString('ru-RU');
      draft += `Благодарим вас за встречу ${date}. `;
      draft += `По итогам нашего разговора хотел(а) бы уточнить следующие моменты:\n\n`;
      draft += `1. [Первый вопрос]\n`;
      draft += `2. [Второй вопрос]\n\n`;
      sources.push(`Последнее взаимодействие: ${lastInteraction.summary}`);
    } else {
      draft += `Надеюсь, у вас всё хорошо. Хотел(а) бы связаться с вами по следующим вопросам:\n\n`;
      draft += `1. [Первый вопрос]\n`;
      draft += `2. [Второй вопрос]\n\n`;
      assumptions.push('Нет данных о предыдущих взаимодействиях');
    }

    draft += `Буду рад(а) обсудить в удобное для вас время.\n\n`;
    draft += `С уважением,\n[Ваше имя]\n[Должность]`;
  } else {
    draft = `Dear Client,\n\n`;
    draft += `I hope this message finds you well. I wanted to follow up regarding:\n\n`;
    draft += `1. [First item]\n`;
    draft += `2. [Second item]\n\n`;
    draft += `Please let me know a convenient time to discuss.\n\n`;
    draft += `Best regards,\n[Your name]\n[Title]`;
  }

  return {
    type: 'draft',
    content: draft,
    confidence: lastInteraction ? 'medium' : 'low',
    sources,
    assumptions,
    disclaimer: getDisclaimer(locale),
  };
}

export async function suggestNextBestAction(
  household: RelHousehold,
  interactions: RelInteraction[],
  initiatives: RelInitiative[],
  locale: 'ru' | 'en' | 'uk' = 'ru'
): Promise<AiSuggestion> {
  const sources: string[] = [];
  const assumptions: string[] = [];
  const suggestions: string[] = [];

  const now = new Date();

  // Check overdue follow-ups
  const overdueFollowups = interactions.filter(i =>
    i.statusKey === 'open' &&
    i.followUpDueAt &&
    new Date(i.followUpDueAt) < now
  );

  if (overdueFollowups.length > 0) {
    if (locale === 'ru') {
      suggestions.push(`**Срочно:** ${overdueFollowups.length} просроченных follow-up. Рекомендуется связаться с клиентом.`);
    } else {
      suggestions.push(`**Urgent:** ${overdueFollowups.length} overdue follow-ups. Contact client recommended.`);
    }
    sources.push('Просроченные follow-up');
  }

  // Check stalled initiatives
  const stalledInitiatives = initiatives.filter(i =>
    i.stageKey === 'in_analysis' &&
    i.dueAt &&
    new Date(i.dueAt) < now
  );

  if (stalledInitiatives.length > 0) {
    if (locale === 'ru') {
      suggestions.push(`**Внимание:** ${stalledInitiatives.length} инициатив застряли в анализе. Требуется продвижение.`);
    } else {
      suggestions.push(`**Attention:** ${stalledInitiatives.length} initiatives stalled in analysis. Progress needed.`);
    }
    sources.push('Застрявшие инициативы');
  }

  // Check last interaction date
  const lastInteraction = interactions
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())[0];

  if (lastInteraction) {
    const daysSince = Math.floor((now.getTime() - new Date(lastInteraction.occurredAt).getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince > 30) {
      if (locale === 'ru') {
        suggestions.push(`**Рекомендация:** Прошло ${daysSince} дней с последнего контакта. Запланируйте check-in звонок.`);
      } else {
        suggestions.push(`**Recommendation:** ${daysSince} days since last contact. Schedule a check-in call.`);
      }
      sources.push('Давность последнего контакта');
    }
  }

  // VIP tier specific
  if (household.tierKey === 'A' && suggestions.length === 0) {
    if (locale === 'ru') {
      suggestions.push(`**VIP клиент:** Всё в порядке. Рекомендуется проактивный контакт раз в 2 недели.`);
    } else {
      suggestions.push(`**VIP Client:** All good. Proactive contact every 2 weeks recommended.`);
    }
    assumptions.push('VIP клиенты требуют более частого контакта');
  }

  if (suggestions.length === 0) {
    if (locale === 'ru') {
      suggestions.push('Нет срочных действий. Продолжайте текущую работу.');
    } else {
      suggestions.push('No urgent actions. Continue current work.');
    }
  }

  return {
    type: 'next_action',
    content: suggestions.join('\n\n'),
    confidence: overdueFollowups.length > 0 ? 'high' : 'medium',
    sources,
    assumptions,
    disclaimer: getDisclaimer(locale),
  };
}

function getStageLabel(stageKey: string): string {
  const labels: Record<string, string> = {
    idea: 'Идея',
    in_analysis: 'В анализе',
    in_progress: 'В работе',
    done: 'Завершено',
  };
  return labels[stageKey] || stageKey;
}

export function formatAiSuggestion(suggestion: AiSuggestion): string {
  let formatted = suggestion.content + '\n\n';
  formatted += '---\n';
  formatted += `**Уверенность:** ${suggestion.confidence}\n`;

  if (suggestion.sources.length > 0) {
    formatted += `**Источники:** ${suggestion.sources.join(', ')}\n`;
  }

  if (suggestion.assumptions.length > 0) {
    formatted += `**Допущения:** ${suggestion.assumptions.join(', ')}\n`;
  }

  formatted += `\n_${suggestion.disclaimer}_`;

  return formatted;
}
