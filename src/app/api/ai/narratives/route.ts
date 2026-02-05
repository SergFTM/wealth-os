import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/db/storage';
import { generateResponse, PromptType, AiContext } from '@/modules/20-ai/engine/aiRules';
import { generateMockSources } from '@/modules/20-ai/engine/aiSources';
import { buildContext } from '@/modules/20-ai/engine/aiContext';

// GET /api/ai/narratives
// List AI narratives with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const clientId = searchParams.get('clientId');
    const scopeType = searchParams.get('scopeType');
    const period = searchParams.get('period');

    const storage = getStorage();
    let narratives = await storage.list('aiNarratives') as any[];

    // Apply filters
    if (category) {
      narratives = narratives.filter((n: { category: string }) => n.category === category);
    }

    if (clientId) {
      narratives = narratives.filter((n: { clientId: string }) => n.clientId === clientId);
    }

    if (scopeType) {
      narratives = narratives.filter((n: { scopeType: string }) => n.scopeType === scopeType);
    }

    // Filter by period
    if (period) {
      const now = new Date();
      let periodStart: Date;

      switch (period) {
        case '7d':
          periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          periodStart = new Date(0);
      }

      narratives = narratives.filter(
        (n: { createdAt: string }) => new Date(n.createdAt) >= periodStart
      );
    }

    // Sort by created date descending
    narratives.sort((a: { createdAt: string }, b: { createdAt: string }) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ narratives });
  } catch (error) {
    console.error('AI narratives list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/ai/narratives
// Generate a new narrative
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, category, scopeType, scopeId, periodStart, periodEnd } = body;

    if (!clientId || !category) {
      return NextResponse.json(
        { error: 'clientId and category are required' },
        { status: 400 }
      );
    }

    const validCategories = [
      'net_worth_change',
      'performance_summary',
      'risk_summary',
      'liquidity_analysis',
      'allocation_drift',
      'fee_analysis',
    ];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const storage = getStorage();

    // Build context
    const context: AiContext = buildContext({
      module: 'ai',
      scope: {
        type: (scopeType || 'household') as 'household' | 'entity' | 'portfolio' | 'account' | 'global',
        id: scopeId || clientId,
      },
    });

    // Map category to prompt type
    const categoryToPromptType: Record<string, PromptType> = {
      net_worth_change: 'explain_change',
      performance_summary: 'summarize_performance',
      risk_summary: 'summarize_risk',
      liquidity_analysis: 'general_query',
      allocation_drift: 'general_query',
      fee_analysis: 'general_query',
    };

    const promptType = categoryToPromptType[category];
    const sources = generateMockSources(promptType, context);
    const response = generateResponse(promptType, context, sources);

    const narrativeId = `ainarr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const narrative = {
      id: narrativeId,
      clientId,
      scopeType: scopeType || 'client',
      scopeId: scopeId || clientId,
      category,
      periodStart: periodStart || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      periodEnd: periodEnd || new Date().toISOString(),
      title: response.summary.split('.')[0] || `${category} Summary`,
      narrativeText: response.keyPoints.join('\n\n'),
      confidencePct: response.confidence,
      sourcesJson: JSON.stringify(sources),
      createdAt: new Date().toISOString(),
    };

    await storage.create('aiNarratives', narrative);

    return NextResponse.json({
      success: true,
      narrative,
    });
  } catch (error) {
    console.error('AI narratives create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
