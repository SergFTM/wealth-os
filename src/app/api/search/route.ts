import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  module: string;
  route: string;
  matchScore: number;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'db', 'data');

async function loadCollection(name: string): Promise<Record<string, unknown>[]> {
  try {
    const filePath = path.join(DATA_DIR, `${name}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function searchInCollection(
  items: Record<string, unknown>[],
  query: string,
  type: string,
  module: string,
  titleField: string,
  subtitleField?: string
): SearchResult[] {
  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const item of items) {
    const title = String(item[titleField] || item.name || item.title || '');
    const subtitle = subtitleField ? String(item[subtitleField] || '') : undefined;
    const id = String(item.id || '');

    const titleMatch = title.toLowerCase().includes(lowerQuery);
    const subtitleMatch = subtitle?.toLowerCase().includes(lowerQuery);
    const idMatch = id.toLowerCase().includes(lowerQuery);

    if (titleMatch || subtitleMatch || idMatch) {
      results.push({
        id,
        type,
        title,
        subtitle,
        module,
        route: `/m/${module}/item/${id}`,
        matchScore: titleMatch ? 100 : subtitleMatch ? 50 : 25,
      });
    }

    if (results.length >= 5) break; // Limit per collection
  }

  return results;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const scope = searchParams.get('scope') || 'all';

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const allResults: SearchResult[] = [];

  // Define searchable collections
  const collections: { name: string; type: string; module: string; titleField: string; subtitleField?: string }[] = [
    { name: 'clients', type: 'household', module: 'net-worth', titleField: 'name', subtitleField: 'type' },
    { name: 'entities', type: 'entity', module: 'partnerships', titleField: 'name', subtitleField: 'type' },
    { name: 'portfolios', type: 'portfolio', module: 'performance', titleField: 'name', subtitleField: 'strategy' },
    { name: 'documents', type: 'document', module: 'documents', titleField: 'name', subtitleField: 'category' },
    { name: 'tasks', type: 'task', module: 'workflow', titleField: 'title', subtitleField: 'status' },
    { name: 'commThreads', type: 'thread', module: 'comms', titleField: 'subject', subtitleField: 'status' },
    { name: 'feeInvoices', type: 'invoice', module: 'fees', titleField: 'invoiceNumber', subtitleField: 'status' },
    { name: 'riskAlerts', type: 'alert', module: 'risk', titleField: 'title', subtitleField: 'severity' },
  ];

  // Filter by scope if not 'all'
  const filteredCollections = scope === 'all'
    ? collections
    : collections.filter(c => c.type === scope);

  // Search in each collection
  for (const col of filteredCollections) {
    const items = await loadCollection(col.name);
    const results = searchInCollection(items, query, col.type, col.module, col.titleField, col.subtitleField);
    allResults.push(...results);
  }

  // Sort by match score and limit
  allResults.sort((a, b) => b.matchScore - a.matchScore);
  const limitedResults = allResults.slice(0, 20);

  return NextResponse.json({ results: limitedResults });
}
