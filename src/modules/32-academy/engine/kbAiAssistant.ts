// AI Assistant for Knowledge Base
// MVP implementation - rules-based with search

import { searchDocuments, SearchDocument, SearchResult } from './searchIndex';

interface AiResponse {
  answer: string;
  sources: { id: string; type: string; title: string }[];
  confidence: 'high' | 'medium' | 'low';
  disclaimer?: string;
}

interface AiContext {
  documents: SearchDocument[];
  index: Map<string, Set<string>>;
  audience: 'staff' | 'client';
  locale: 'ru' | 'en' | 'uk';
}

// Keywords that trigger disclaimers
const TAX_KEYWORDS = ['налог', 'tax', 'ндфл', 'декларация', 'вычет', 'tax lot', 'harvesting'];
const TRUST_KEYWORDS = ['траст', 'trust', 'бенефициар', 'beneficiary', 'trustee', 'estate'];

// Check if query contains sensitive topics
function containsTaxTopics(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return TAX_KEYWORDS.some(kw => lowerQuery.includes(kw));
}

function containsTrustTopics(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return TRUST_KEYWORDS.some(kw => lowerQuery.includes(kw));
}

// Generate answer based on search results
function generateAnswer(
  query: string,
  results: SearchResult[],
  locale: string
): string {
  if (results.length === 0) {
    return locale === 'ru'
      ? 'К сожалению, я не нашел релевантной информации в базе знаний. Попробуйте переформулировать вопрос или обратитесь к вашему advisor.'
      : 'Unfortunately, I could not find relevant information in the knowledge base. Try rephrasing your question or contact your advisor.';
  }

  const topResult = results[0];
  const otherResults = results.slice(1, 4);

  let answer = locale === 'ru'
    ? `На основе базы знаний:\n\n**${topResult.title}**\n\n${topResult.excerpt}`
    : `Based on the knowledge base:\n\n**${topResult.title}**\n\n${topResult.excerpt}`;

  if (otherResults.length > 0) {
    const alsoSee = locale === 'ru' ? '\n\nСм. также:' : '\n\nSee also:';
    answer += alsoSee;
    for (const r of otherResults) {
      answer += `\n- ${r.title}`;
    }
  }

  return answer;
}

// Calculate confidence based on search results
function calculateConfidence(results: SearchResult[]): 'high' | 'medium' | 'low' {
  if (results.length === 0) return 'low';

  const topScore = results[0].score;
  const highScoreCount = results.filter(r => r.score > 0.6).length;

  if (topScore > 0.8 && highScoreCount >= 3) return 'high';
  if (topScore > 0.5 && highScoreCount >= 1) return 'medium';
  return 'low';
}

// Main AI assistant function
export async function askKnowledgeBase(
  question: string,
  context: AiContext
): Promise<AiResponse> {
  // Search for relevant content
  const results = searchDocuments(question, context.documents, context.index, {
    audience: context.audience === 'client' ? 'client' : undefined,
    limit: 5,
  });

  // Generate answer
  const answer = generateAnswer(question, results, context.locale);

  // Calculate confidence
  const confidence = calculateConfidence(results);

  // Build sources list
  const sources = results.slice(0, 5).map(r => ({
    id: r.id,
    type: r.type,
    title: r.title,
  }));

  // Check for disclaimers
  let disclaimer: string | undefined;

  if (containsTaxTopics(question)) {
    disclaimer = context.locale === 'ru'
      ? '⚠️ Информация о налогах носит справочный характер и не является налоговой консультацией. Обратитесь к налоговому консультанту.'
      : '⚠️ Tax information is for reference only and does not constitute tax advice. Please consult a tax professional.';
  } else if (containsTrustTopics(question)) {
    disclaimer = context.locale === 'ru'
      ? '⚠️ Информация о трастах носит справочный характер и не является юридической консультацией. Обратитесь к юристу.'
      : '⚠️ Trust information is for reference only and does not constitute legal advice. Please consult a legal professional.';
  }

  return {
    answer,
    sources,
    confidence,
    disclaimer,
  };
}

// Quick answer check - returns if we have enough data
export function canAnswerQuestion(
  question: string,
  context: AiContext
): boolean {
  const results = searchDocuments(question, context.documents, context.index, {
    audience: context.audience === 'client' ? 'client' : undefined,
    limit: 3,
  });

  return results.length > 0 && results[0].score > 0.3;
}

export type { AiResponse, AiContext };
