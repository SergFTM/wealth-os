import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

async function loadCollection<T>(name: string): Promise<T[]> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'db', 'data', `${name}.json`);
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as T[];
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const [apiKeys, webhooks, deliveries, rateLimits, accessLogs] = await Promise.all([
      loadCollection<{ id: string; status: string; expiresAt: string; keyMode: string }>('apiKeys'),
      loadCollection<{ id: string; status: string }>('webhooks'),
      loadCollection<{ id: string; status: string; createdAt: string }>('webhookDeliveries'),
      loadCollection<{ id: string; hits: number; updatedAt: string }>('rateLimits'),
      loadCollection<{ id: string; createdAt: string }>('apiAccessLogs'),
    ]);

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const activeKeys = apiKeys.filter((k) => k.status === 'active').length;
    const expiringKeys30d = apiKeys.filter((k) => {
      const expiresAt = new Date(k.expiresAt);
      return k.status === 'active' && expiresAt <= thirtyDaysFromNow && expiresAt > now;
    }).length;

    const webhooksActive = webhooks.filter((w) => w.status === 'active').length;

    const deliveriesFailed7d = deliveries.filter((d) => {
      const createdAt = new Date(d.createdAt);
      return (d.status === 'failed' || d.status === 'dead') && createdAt >= sevenDaysAgo;
    }).length;

    const retriesPending = deliveries.filter((d) => d.status === 'retrying').length;

    const rateLimitHits24h = rateLimits
      .filter((rl) => new Date(rl.updatedAt) >= oneDayAgo)
      .reduce((sum, rl) => sum + rl.hits, 0);

    const apiCalls24h = accessLogs.filter((log) => new Date(log.createdAt) >= oneDayAgo).length;

    const clientSafeKeys = apiKeys.filter((k) => k.keyMode === 'client' && k.status === 'active').length;

    const kpis = {
      activeKeys,
      expiringKeys30d,
      webhooksActive,
      deliveriesFailed7d,
      retriesPending,
      rateLimitHits24h,
      apiCalls24h,
      clientSafeKeys,
    };

    return NextResponse.json(kpis);
  } catch (error) {
    console.error('Error loading API KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to load KPIs' },
      { status: 500 }
    );
  }
}
