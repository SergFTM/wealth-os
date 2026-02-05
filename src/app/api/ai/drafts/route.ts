import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/db/storage';

// GET /api/ai/drafts
// List AI drafts with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const draftType = searchParams.get('type');
    const clientId = searchParams.get('clientId');

    const storage = getStorage();
    let drafts = await storage.list('aiDrafts') as any[];

    // Apply filters
    if (status) {
      drafts = drafts.filter((d) => d.status === status);
    }

    if (draftType) {
      drafts = drafts.filter((d) => d.draftType === draftType);
    }

    if (clientId) {
      drafts = drafts.filter((d) => d.clientId === clientId);
    }

    // Sort by created date descending
    drafts.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ drafts });
  } catch (error) {
    console.error('AI drafts list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/ai/drafts
// Create a new AI draft
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, draftType, title, contentText, targetModule } = body;

    if (!clientId || !draftType || !title || !contentText) {
      return NextResponse.json(
        { error: 'clientId, draftType, title, and contentText are required' },
        { status: 400 }
      );
    }

    const storage = getStorage();

    const draftId = `aidraft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const draft = {
      id: draftId,
      clientId,
      draftType,
      title,
      contentText,
      status: 'draft',
      targetModule: targetModule || null,
      createdBy: 'user-rm-001', // Mock user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storage.create('aiDrafts', draft);

    return NextResponse.json({
      success: true,
      draft,
    });
  } catch (error) {
    console.error('AI drafts create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/ai/drafts
// Update a draft (status, content)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, contentText, title } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Draft id is required' },
        { status: 400 }
      );
    }

    const storage = getStorage();
    const draft = await storage.get('aiDrafts', id);

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (status) {
      if (!['draft', 'reviewed', 'sent', 'archived'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    if (contentText !== undefined) {
      updates.contentText = contentText;
    }

    if (title !== undefined) {
      updates.title = title;
    }

    const updated = await storage.update('aiDrafts', id, updates);

    return NextResponse.json({
      success: true,
      draft: updated,
    });
  } catch (error) {
    console.error('AI drafts update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
