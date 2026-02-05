import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'db', 'data');

async function loadJson(filename: string): Promise<Record<string, unknown>[]> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function saveJson(filename: string, data: Record<string, unknown>[]): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET - Get demo state
export async function GET() {
  const seeds = await loadJson('demoSeeds.json');
  const seed = seeds[0] || {
    id: 'demo-001',
    demoInitialized: false,
    seedVersion: '1.0.0',
    seedProfile: 'medium',
    personaRole: 'admin',
    lastResetAt: null,
    totalsJson: '{}',
  };

  // Count records in key collections
  const collections = ['clients', 'tasks', 'documents', 'riskAlerts', 'notifications'];
  let totalRecords = 0;
  for (const col of collections) {
    const items = await loadJson(`${col}.json`);
    totalRecords += items.length;
  }

  // Count open tasks and alerts
  const tasks = await loadJson('tasks.json');
  const openTasks = tasks.filter((t: Record<string, unknown>) => t.status !== 'completed' && t.status !== 'cancelled').length;

  const alerts = await loadJson('riskAlerts.json');
  const openAlerts = alerts.filter((a: Record<string, unknown>) => a.status === 'open' || a.status === 'active').length;

  const notifications = await loadJson('notifications.json');
  const unreadNotifications = notifications.filter((n: Record<string, unknown>) => n.status === 'unread').length;

  return NextResponse.json({
    demoInitialized: seed.demoInitialized,
    seedVersion: seed.seedVersion,
    seedProfile: seed.seedProfile,
    personaRole: seed.personaRole,
    lastResetAt: seed.lastResetAt,
    totalRecords,
    openTasks,
    openAlerts,
    unreadNotifications,
    navHealth: 100, // All routes OK in MVP
  });
}

// POST - Demo actions
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, payload } = body;

  const seeds = await loadJson('demoSeeds.json');
  let seed = seeds[0] || {
    id: 'demo-001',
    demoInitialized: false,
    seedVersion: '1.0.0',
    seedProfile: 'medium',
    personaRole: 'admin',
    lastResetAt: null,
    totalsJson: '{}',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  switch (action) {
    case 'init':
      seed.demoInitialized = true;
      seed.updatedAt = new Date().toISOString();
      seed.seedProfile = payload?.profile || 'medium';
      break;

    case 'reset':
      seed.demoInitialized = false;
      seed.lastResetAt = new Date().toISOString();
      seed.updatedAt = new Date().toISOString();
      break;

    case 'generate':
      if (!seed.demoInitialized) {
        return NextResponse.json({ error: 'Demo not initialized' }, { status: 400 });
      }
      // Generate events based on type
      const eventType = payload?.type || 'daily';
      await generateEvents(eventType);
      seed.updatedAt = new Date().toISOString();
      break;

    case 'persona':
      seed.personaRole = payload?.role || 'admin';
      seed.updatedAt = new Date().toISOString();
      break;

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }

  // Save updated seed
  await saveJson('demoSeeds.json', [seed]);

  // Log audit event
  await logAuditEvent(action, payload);

  return NextResponse.json({
    success: true,
    seed,
  });
}

async function generateEvents(type: string): Promise<void> {
  const now = new Date();

  // Generate notifications
  const notifications = await loadJson('notifications.json');
  const newNotifications: Record<string, unknown>[] = [];

  if (type === 'daily' || type === 'audit') {
    newNotifications.push({
      id: `notif-${Date.now()}-1`,
      type: 'task',
      severity: 'info',
      title: 'New task assigned: Review Q4 performance report',
      link: '/m/workflow/list',
      status: 'unread',
      createdAt: now.toISOString(),
    });
    newNotifications.push({
      id: `notif-${Date.now()}-2`,
      type: 'alert',
      severity: 'warning',
      title: 'IPS constraint near breach threshold',
      link: '/m/ips/list',
      status: 'unread',
      createdAt: now.toISOString(),
    });
  }

  if (type === 'monthEnd') {
    newNotifications.push({
      id: `notif-${Date.now()}-3`,
      type: 'system',
      severity: 'info',
      title: 'Month-end fee calculation completed',
      link: '/m/fees/list',
      status: 'unread',
      createdAt: now.toISOString(),
    });
    newNotifications.push({
      id: `notif-${Date.now()}-4`,
      type: 'approval',
      severity: 'warning',
      title: '5 invoices pending approval',
      link: '/m/fees/list?tab=invoices',
      status: 'unread',
      createdAt: now.toISOString(),
    });
  }

  if (type === 'audit') {
    newNotifications.push({
      id: `notif-${Date.now()}-5`,
      type: 'system',
      severity: 'info',
      title: 'Audit log export ready for download',
      link: '/m/security/list?tab=audit',
      status: 'unread',
      createdAt: now.toISOString(),
    });
  }

  notifications.push(...newNotifications);
  await saveJson('notifications.json', notifications);
}

async function logAuditEvent(action: string, payload: Record<string, unknown> | null): Promise<void> {
  const auditEvents = await loadJson('auditEvents.json');

  auditEvents.push({
    id: `ae-${Date.now()}`,
    ts: new Date().toISOString(),
    actorRole: 'admin',
    actorName: 'System',
    action: `demo_${action}`,
    collection: 'demoSeeds',
    recordId: 'demo-001',
    summary: `Demo action: ${action}`,
    scope: 'global',
    severity: 'info',
    details: payload,
  });

  await saveJson('auditEvents.json', auditEvents);
}
