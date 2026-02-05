import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/db/storage';

// POST /api/ai/feedback
// Submit feedback for an AI response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, rating, comment } = body;

    if (!eventId || !rating) {
      return NextResponse.json(
        { error: 'eventId and rating are required' },
        { status: 400 }
      );
    }

    if (!['up', 'down'].includes(rating)) {
      return NextResponse.json(
        { error: 'Rating must be "up" or "down"' },
        { status: 400 }
      );
    }

    const storage = getStorage();

    // Create feedback record
    const feedbackId = `aifb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const feedback = {
      id: feedbackId,
      eventId,
      rating,
      comment: comment || null,
      userId: 'user-rm-001', // Mock user
      createdAt: new Date().toISOString(),
    };

    await storage.create('aiFeedback', feedback);

    return NextResponse.json({
      success: true,
      feedbackId,
    });
  } catch (error) {
    console.error('AI feedback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/ai/feedback
// Get feedback statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    const storage = getStorage();
    const feedback = await storage.list('aiFeedback') as any[];

    // Calculate period start
    const now = new Date();
    let periodStart: Date;

    switch (period) {
      case '7d':
        periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        periodStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Filter by period
    const filteredFeedback = feedback.filter(
      (f: { createdAt: string }) => new Date(f.createdAt) >= periodStart
    );

    // Calculate stats
    const upCount = filteredFeedback.filter((f: { rating: string }) => f.rating === 'up').length;
    const downCount = filteredFeedback.filter((f: { rating: string }) => f.rating === 'down').length;
    const total = upCount + downCount;

    return NextResponse.json({
      period,
      total,
      upCount,
      downCount,
      upPercent: total > 0 ? Math.round((upCount / total) * 100) : 0,
      downPercent: total > 0 ? Math.round((downCount / total) * 100) : 0,
    });
  } catch (error) {
    console.error('AI feedback stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
