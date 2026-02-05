// Simple in-memory search index for Knowledge Base
// MVP implementation - no external search services

interface SearchDocument {
  id: string;
  type: 'article' | 'lesson' | 'faq' | 'policy' | 'course';
  titleRu: string;
  titleEn?: string;
  bodyRu?: string;
  bodyEn?: string;
  tagsJson?: string[];
  audience: string;
  score?: number;
}

interface SearchResult {
  id: string;
  type: string;
  title: string;
  excerpt: string;
  score: number;
  tags: string[];
  audience: string;
}

// Simple tokenizer
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

// Build inverted index from documents
export function buildSearchIndex(documents: SearchDocument[]): Map<string, Set<string>> {
  const index = new Map<string, Set<string>>();

  for (const doc of documents) {
    const text = [
      doc.titleRu,
      doc.titleEn || '',
      doc.bodyRu || '',
      doc.bodyEn || '',
      ...(doc.tagsJson || []),
    ].join(' ');

    const tokens = tokenize(text);

    for (const token of tokens) {
      if (!index.has(token)) {
        index.set(token, new Set());
      }
      index.get(token)!.add(doc.id);
    }
  }

  return index;
}

// Search using the index
export function searchDocuments(
  query: string,
  documents: SearchDocument[],
  index: Map<string, Set<string>>,
  options: {
    audience?: 'staff' | 'client' | 'both';
    type?: string;
    limit?: number;
  } = {}
): SearchResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  // Score documents by number of matching tokens
  const scores = new Map<string, number>();

  for (const token of queryTokens) {
    const matchingDocs = index.get(token);
    if (matchingDocs) {
      for (const docId of matchingDocs) {
        scores.set(docId, (scores.get(docId) || 0) + 1);
      }
    }
  }

  // Filter and sort by score
  const results: SearchResult[] = [];

  for (const doc of documents) {
    const score = scores.get(doc.id) || 0;
    if (score === 0) continue;

    // Filter by audience
    if (options.audience === 'client' && doc.audience === 'staff') continue;

    // Filter by type
    if (options.type && doc.type !== options.type) continue;

    // Create excerpt
    const body = doc.bodyRu || doc.bodyEn || '';
    const excerpt = body.substring(0, 150).replace(/[#*_]/g, '') + '...';

    results.push({
      id: doc.id,
      type: doc.type,
      title: doc.titleRu || doc.titleEn || '',
      excerpt,
      score: score / queryTokens.length,
      tags: doc.tagsJson || [],
      audience: doc.audience,
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Limit results
  return results.slice(0, options.limit || 20);
}

// Highlight matching terms in text
export function highlightMatches(text: string, query: string): string {
  const queryTokens = tokenize(query);
  let result = text;

  for (const token of queryTokens) {
    const regex = new RegExp(`(${token})`, 'gi');
    result = result.replace(regex, '**$1**');
  }

  return result;
}

// Export types
export type { SearchDocument, SearchResult };
