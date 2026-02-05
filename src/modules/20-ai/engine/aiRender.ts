// AI Render - Render AI responses in markdown format

import type { AiResponse, AiSource } from './aiRules';

export interface RenderOptions {
  showSources?: boolean;
  showAssumptions?: boolean;
  showConfidence?: boolean;
  clientSafe?: boolean;
  format?: 'markdown' | 'plain' | 'html';
}

const defaultOptions: RenderOptions = {
  showSources: true,
  showAssumptions: true,
  showConfidence: true,
  clientSafe: false,
  format: 'markdown',
};

// Render full response in markdown
export function renderResponse(
  response: AiResponse,
  options: RenderOptions = {}
): string {
  const opts = { ...defaultOptions, ...options };
  const sections: string[] = [];

  // Summary section
  sections.push('## Резюме\n');
  sections.push(response.summary);
  sections.push('');

  // Key points section
  if (response.keyPoints.length > 0) {
    sections.push('## Ключевые моменты\n');
    response.keyPoints.forEach(point => {
      sections.push(`• ${point}`);
    });
    sections.push('');
  }

  // Sources section
  if (opts.showSources && response.sources.length > 0) {
    sections.push('## Источники\n');
    response.sources.forEach(source => {
      const valueStr = source.value ? ` — ${source.value}` : '';
      sections.push(`• [${source.label}](/m/${source.module}/item/${source.recordId})${valueStr}`);
    });
    sections.push('');
  }

  // Assumptions section
  if (opts.showAssumptions && response.assumptions.length > 0) {
    sections.push('## Предположения\n');
    response.assumptions.forEach(assumption => {
      sections.push(`• ${assumption}`);
    });
    sections.push('');
  }

  // Confidence section
  if (opts.showConfidence) {
    sections.push(`---\n`);
    sections.push(`**Уверенность:** ${response.confidence}%`);
    if (response.confidence < 50) {
      sections.push('\n_Низкая уверенность — требуется дополнительная проверка_');
    }
  }

  return sections.join('\n');
}

// Render compact response (for chat messages)
export function renderCompact(response: AiResponse): string {
  const parts: string[] = [];

  parts.push(response.summary);

  if (response.keyPoints.length > 0) {
    parts.push('\n');
    response.keyPoints.slice(0, 3).forEach(point => {
      parts.push(`• ${point}`);
    });
    if (response.keyPoints.length > 3) {
      parts.push(`... и еще ${response.keyPoints.length - 3} пунктов`);
    }
  }

  return parts.join('\n');
}

// Render sources as a list
export function renderSourcesList(sources: AiSource[]): string {
  if (sources.length === 0) {
    return '_Источники не найдены_';
  }

  return sources
    .map(s => {
      const valueStr = s.value ? ` (${s.value})` : '';
      return `• ${s.label}${valueStr}`;
    })
    .join('\n');
}

// Render confidence badge
export function renderConfidenceBadge(confidence: number): {
  label: string;
  color: 'emerald' | 'amber' | 'red';
  description: string;
} {
  if (confidence >= 80) {
    return {
      label: `${confidence}%`,
      color: 'emerald',
      description: 'Высокая уверенность',
    };
  } else if (confidence >= 50) {
    return {
      label: `${confidence}%`,
      color: 'amber',
      description: 'Средняя уверенность — рекомендуется проверка',
    };
  } else {
    return {
      label: `${confidence}%`,
      color: 'red',
      description: 'Низкая уверенность — требуется верификация',
    };
  }
}

// Render blocked response
export function renderBlocked(reason: string): string {
  return `## Запрос заблокирован

${reason}

---
Если вы считаете это ошибкой, обратитесь к администратору.`;
}

// Render no data response
export function renderNoData(): string {
  return `## Недостаточно данных

К сожалению, недостаточно данных для формирования ответа.

**Возможные причины:**
• Данные еще не загружены
• Период не содержит релевантной информации
• Нет доступа к необходимым модулям

---
_Попробуйте изменить параметры запроса или обратитесь к администратору._`;
}

// Render disclaimer
export function renderDisclaimer(): string {
  return `> **Дисклеймер:** AI выводы информационные и требуют проверки человеком.`;
}

// Convert markdown to plain text
export function markdownToPlain(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/_(.*?)_/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/^\s*•\s/gm, '- ') // Convert bullets
    .replace(/---/g, '—') // Convert horizontal rules
    .replace(/>/g, '') // Remove blockquotes
    .trim();
}

// Format for export
export function formatForExport(
  response: AiResponse,
  format: 'markdown' | 'plain' | 'json'
): string {
  switch (format) {
    case 'json':
      return JSON.stringify(response, null, 2);
    case 'plain':
      return markdownToPlain(renderResponse(response));
    case 'markdown':
    default:
      return renderResponse(response);
  }
}
