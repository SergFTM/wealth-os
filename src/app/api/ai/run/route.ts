import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/db/storage';
import {
  generateResponse,
  PromptType,
  AiContext,
  AiSource,
} from '@/modules/20-ai/engine/aiRules';
import { renderResponse, renderBlocked, renderNoData } from '@/modules/20-ai/engine/aiRender';
import { generateMockSources } from '@/modules/20-ai/engine/aiSources';
import { buildContext } from '@/modules/20-ai/engine/aiContext';
import type { AiResponse } from '@/modules/20-ai/engine/aiRules';

// POST /api/ai/run
// Run AI query and return response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt,
      promptType = 'general_query',
      clientSafe = false,
      context: moduleContext,
    } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const storage = getStorage();

    // Check if prompt type is allowed (mock RBAC check)
    const blockedTypes = ['admin_override', 'bulk_delete'];
    if (blockedTypes.includes(promptType)) {
      const eventId = await logAiEvent(storage, {
        promptType,
        prompt,
        blocked: true,
        blockReason: 'Prompt type not allowed',
        clientSafe,
      });

      return NextResponse.json({
        response: renderBlocked('Этот тип запроса недоступен для вашей роли.'),
        blocked: true,
        eventId,
      });
    }

    // Build context from module context
    const aiContext = buildContext(moduleContext);

    // Generate mock sources based on prompt type
    const sources = generateMockSources(promptType as PromptType, aiContext);

    // If no sources, return no data response
    if (sources.length === 0 && !['general_query'].includes(promptType)) {
      const eventId = await logAiEvent(storage, {
        promptType,
        prompt,
        response: renderNoData(),
        confidence: 0,
        sources: [],
        clientSafe,
      });

      return NextResponse.json({
        response: renderNoData(),
        confidence: 0,
        sources: [],
        eventId,
      });
    }

    // Generate response using rules engine
    const aiResponse = generateResponse(promptType as PromptType, aiContext, sources);

    // Apply client-safe redactions if needed
    let finalResponse: AiResponse = aiResponse;
    if (clientSafe) {
      // Remove internal assumptions and filter sensitive sources in client-safe mode
      finalResponse = {
        ...aiResponse,
        assumptions: [], // Hide internal assumptions from clients
        sources: aiResponse.sources.filter(s => !s.module.includes('internal')),
      };
    }

    // Render to markdown
    const renderedResponse = renderResponse(finalResponse, {
      showSources: true,
      showAssumptions: !clientSafe,
      showConfidence: true,
      clientSafe,
    });

    // Log AI event
    const eventId = await logAiEvent(storage, {
      promptType,
      prompt,
      response: renderedResponse,
      confidence: finalResponse.confidence,
      sources: finalResponse.sources,
      clientSafe,
    });

    // Format sources for client
    const clientSources = finalResponse.sources.map(s => ({
      label: s.label,
      href: `/m/${s.module}/item/${s.recordId}`,
    }));

    return NextResponse.json({
      response: renderedResponse,
      confidence: finalResponse.confidence,
      sources: clientSources,
      eventId,
      clientSafe,
    });
  } catch (error) {
    console.error('AI run error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function logAiEvent(
  storage: ReturnType<typeof getStorage>,
  data: {
    promptType: string;
    prompt: string;
    response?: string;
    confidence?: number;
    sources?: AiSource[];
    clientSafe: boolean;
    blocked?: boolean;
    blockReason?: string;
  }
): Promise<string> {
  const eventId = `aievt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const event = {
    id: eventId,
    promptType: data.promptType,
    promptText: data.prompt,
    responseText: data.response || '',
    confidencePct: data.confidence || 0,
    sourcesJson: JSON.stringify(data.sources || []),
    clientSafe: data.clientSafe,
    blocked: data.blocked || false,
    blockReason: data.blockReason || null,
    userId: 'user-rm-001', // Mock user
    clientId: 'client-001', // Mock client
    createdAt: new Date().toISOString(),
  };

  try {
    await storage.create('aiEvents', event);
  } catch (error) {
    console.error('Failed to log AI event:', error);
  }

  return eventId;
}
