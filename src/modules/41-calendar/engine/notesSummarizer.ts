/**
 * Notes Summarizer - Summarize meeting notes to bullet points
 */

export interface MeetingNote {
  id: string;
  clientId: string;
  eventId: string;
  authorUserId: string;
  authorName?: string;
  bodyMdRu?: string;
  bodyMdEn?: string;
  bodyMdUk?: string;
  status: 'draft' | 'published';
  clientSafePublished: boolean;
  attachmentDocIdsJson: string[];
  aiMetaJson?: {
    generatedAt: string;
    confidence: number;
    assumptions: string[];
    sources: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  clientId: string;
  eventId: string;
  authorUserId: string;
  authorName?: string;
  bodyMdRu?: string;
  bodyMdEn?: string;
  bodyMdUk?: string;
}

export interface SummarizeResult {
  summary: string;
  bulletPoints: string[];
  keyDecisions: string[];
  actionItems: string[];
  confidence: number;
  assumptions: string[];
  sources: string[];
}

export function createNoteData(data: CreateNoteData): Omit<MeetingNote, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId: data.clientId,
    eventId: data.eventId,
    authorUserId: data.authorUserId,
    authorName: data.authorName,
    bodyMdRu: data.bodyMdRu,
    bodyMdEn: data.bodyMdEn,
    bodyMdUk: data.bodyMdUk,
    status: 'draft',
    clientSafePublished: false,
    attachmentDocIdsJson: [],
  };
}

export function publishNote(note: MeetingNote): Partial<MeetingNote> {
  return {
    status: 'published',
    updatedAt: new Date().toISOString(),
  };
}

export function publishClientSafe(note: MeetingNote): Partial<MeetingNote> {
  return {
    status: 'published',
    clientSafePublished: true,
    updatedAt: new Date().toISOString(),
  };
}

export function summarizeNotes(bodyMd: string, locale: string = 'ru'): SummarizeResult {
  // MVP: Rule-based summarization
  const lines = bodyMd.split('\n').filter(line => line.trim());

  const bulletPoints: string[] = [];
  const keyDecisions: string[] = [];
  const actionItems: string[] = [];

  // Extract bullet points and key items
  for (const line of lines) {
    const trimmed = line.trim();

    // Skip headers
    if (trimmed.startsWith('#')) continue;

    // Check for decisions
    if (
      trimmed.toLowerCase().includes('решен') ||
      trimmed.toLowerCase().includes('утвержд') ||
      trimmed.toLowerCase().includes('одобр') ||
      trimmed.toLowerCase().includes('approved') ||
      trimmed.toLowerCase().includes('decided')
    ) {
      keyDecisions.push(extractContent(trimmed));
    }

    // Check for action items
    if (
      trimmed.includes('@') ||
      trimmed.toLowerCase().includes('action') ||
      trimmed.toLowerCase().includes('задач') ||
      trimmed.toLowerCase().includes('сделать') ||
      trimmed.toLowerCase().includes('подготовить') ||
      trimmed.toLowerCase().includes('провер')
    ) {
      actionItems.push(extractContent(trimmed));
    }

    // Regular bullet points
    if (
      trimmed.startsWith('-') ||
      trimmed.startsWith('*') ||
      trimmed.match(/^\d+\./)
    ) {
      bulletPoints.push(extractContent(trimmed));
    }
  }

  // Generate summary
  const summaryParts: string[] = [];

  if (bulletPoints.length > 0) {
    summaryParts.push(`Обсуждено ${bulletPoints.length} пунктов`);
  }
  if (keyDecisions.length > 0) {
    summaryParts.push(`принято ${keyDecisions.length} решений`);
  }
  if (actionItems.length > 0) {
    summaryParts.push(`назначено ${actionItems.length} задач`);
  }

  const summary = summaryParts.length > 0
    ? summaryParts.join(', ') + '.'
    : 'Заметки без структурированного содержания.';

  return {
    summary,
    bulletPoints: bulletPoints.slice(0, 10),
    keyDecisions: keyDecisions.slice(0, 5),
    actionItems: actionItems.slice(0, 10),
    confidence: calculateConfidence(bulletPoints, keyDecisions, actionItems),
    assumptions: [
      'Текст заметок полный',
      'Используется стандартное форматирование',
      'Ключевые слова на русском языке',
    ],
    sources: ['Meeting notes body'],
  };
}

function extractContent(line: string): string {
  return line
    .replace(/^[-*]\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .replace(/\*\*/g, '')
    .trim();
}

function calculateConfidence(
  bullets: string[],
  decisions: string[],
  actions: string[]
): number {
  const totalItems = bullets.length + decisions.length + actions.length;
  if (totalItems === 0) return 0.3;
  if (totalItems < 3) return 0.5;
  if (totalItems < 10) return 0.7;
  return 0.85;
}

export function formatSummaryMarkdown(result: SummarizeResult, locale: string = 'ru'): string {
  let md = '## Резюме\n\n';
  md += result.summary + '\n\n';

  if (result.keyDecisions.length > 0) {
    md += '### Ключевые решения\n';
    result.keyDecisions.forEach(d => {
      md += `- ${d}\n`;
    });
    md += '\n';
  }

  if (result.actionItems.length > 0) {
    md += '### Action Items\n';
    result.actionItems.forEach(a => {
      md += `- ${a}\n`;
    });
    md += '\n';
  }

  md += `---\n*Уверенность: ${(result.confidence * 100).toFixed(0)}%*\n`;

  return md;
}

export function getBody(note: MeetingNote, locale: string = 'ru'): string {
  switch (locale) {
    case 'en':
      return note.bodyMdEn || note.bodyMdRu || '';
    case 'uk':
      return note.bodyMdUk || note.bodyMdRu || '';
    default:
      return note.bodyMdRu || '';
  }
}

export function updateNoteWithAiMeta(
  note: MeetingNote,
  result: SummarizeResult
): Partial<MeetingNote> {
  return {
    aiMetaJson: {
      generatedAt: new Date().toISOString(),
      confidence: result.confidence,
      assumptions: result.assumptions,
      sources: result.sources,
    },
    updatedAt: new Date().toISOString(),
  };
}
