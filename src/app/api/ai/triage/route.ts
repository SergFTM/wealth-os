import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/db/storage';

// GET /api/ai/triage
// List triage items with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const category = searchParams.get('category');
    const clientId = searchParams.get('clientId');

    const storage = getStorage();
    let triageItems = await storage.list('aiTriageItems') as any[];

    // Apply filters
    if (status) {
      triageItems = triageItems.filter((t: { status: string }) => t.status === status);
    }

    if (severity) {
      triageItems = triageItems.filter((t: { severity: string }) => t.severity === severity);
    }

    if (category) {
      triageItems = triageItems.filter((t: { category: string }) => t.category === category);
    }

    if (clientId) {
      triageItems = triageItems.filter((t: { clientId: string }) => t.clientId === clientId);
    }

    // Sort by severity (critical first) then by date
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    triageItems.sort((a: { severity: string; createdAt: string }, b: { severity: string; createdAt: string }) => {
      const severityDiff =
        (severityOrder[a.severity as keyof typeof severityOrder] || 4) -
        (severityOrder[b.severity as keyof typeof severityOrder] || 4);
      if (severityDiff !== 0) return severityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({ triageItems });
  } catch (error) {
    console.error('AI triage list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/ai/triage
// Create a new triage item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, category, title, severity, suggestedAction, sourceModule, sourceRecordId } = body;

    if (!clientId || !category || !title || !severity || !suggestedAction) {
      return NextResponse.json(
        { error: 'clientId, category, title, severity, and suggestedAction are required' },
        { status: 400 }
      );
    }

    const validSeverities = ['critical', 'high', 'medium', 'low'];
    if (!validSeverities.includes(severity)) {
      return NextResponse.json(
        { error: 'Invalid severity' },
        { status: 400 }
      );
    }

    const storage = getStorage();

    const triageId = `aitriage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const triageItem = {
      id: triageId,
      clientId,
      category,
      title,
      severity,
      suggestedAction,
      sourceModule: sourceModule || null,
      sourceRecordId: sourceRecordId || null,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storage.create('aiTriageItems', triageItem);

    return NextResponse.json({
      success: true,
      triageItem,
    });
  } catch (error) {
    console.error('AI triage create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/ai/triage
// Update triage item status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, resolution } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Triage item id is required' },
        { status: 400 }
      );
    }

    const storage = getStorage();
    const item = await storage.get('aiTriageItems', id);

    if (!item) {
      return NextResponse.json(
        { error: 'Triage item not found' },
        { status: 404 }
      );
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (status) {
      const validStatuses = ['open', 'accepted', 'dismissed', 'completed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
      updates.status = status;

      // Set resolved timestamp if completing
      if (status === 'completed' || status === 'dismissed') {
        updates.resolvedAt = new Date().toISOString();
        updates.resolvedBy = 'user-rm-001'; // Mock user
      }
    }

    if (resolution !== undefined) {
      updates.resolution = resolution;
    }

    const updated = await storage.update('aiTriageItems', id, updates);

    return NextResponse.json({
      success: true,
      triageItem: updated,
    });
  } catch (error) {
    console.error('AI triage update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
