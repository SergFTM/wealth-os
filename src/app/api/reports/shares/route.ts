import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/db/data');

interface ReportShare {
  id: string;
  packId: string;
  packVersion: number;
  publicId: string;
  shareUrl: string;
  accessLevel: string;
  status: string;
  requiresAuth: boolean;
  password?: string;
  allowedEmails?: string[];
  allowedDomains?: string[];
  allowedRoles?: string[];
  expiresAt?: string;
  viewCount: number;
  downloadCount: number;
  lastAccessAt?: string;
  shareNote?: string;
  recipientName?: string;
  recipientEmail?: string;
  createdBy: string;
  createdAt: string;
  revokedAt?: string;
  revokedBy?: string;
}

interface ReportPack {
  id: string;
  version: number;
  status: string;
  [key: string]: unknown;
}

async function readShares(): Promise<ReportShare[]> {
  try {
    const filePath = path.join(DATA_DIR, 'reportShares.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeShares(shares: ReportShare[]): Promise<void> {
  const filePath = path.join(DATA_DIR, 'reportShares.json');
  await fs.writeFile(filePath, JSON.stringify(shares, null, 2));
}

async function readPacks(): Promise<ReportPack[]> {
  try {
    const filePath = path.join(DATA_DIR, 'reportPacks.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function generateId(): string {
  return `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generatePublicId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let shares = await readShares();

    // Filter by packId
    const packId = searchParams.get('packId');
    if (packId) {
      shares = shares.filter((s) => s.packId === packId);
    }

    // Filter by status
    const status = searchParams.get('status');
    if (status) {
      shares = shares.filter((s) => s.status === status);
    }

    // Filter expiring soon
    const expiring = searchParams.get('expiring');
    if (expiring === 'true') {
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      shares = shares.filter((s) => {
        if (s.status !== 'active' || !s.expiresAt) return false;
        const expiry = new Date(s.expiresAt);
        return expiry > now && expiry <= sevenDaysFromNow;
      });
    }

    // Sort by createdAt desc
    shares.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ items: shares });
  } catch (error) {
    console.error('Error fetching shares:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shares' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packId, accessLevel } = body;

    if (!packId || !accessLevel) {
      return NextResponse.json(
        { error: 'packId and accessLevel are required' },
        { status: 400 }
      );
    }

    // Check pack exists and is published
    const packs = await readPacks();
    const pack = packs.find((p) => p.id === packId);

    if (!pack) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    if (pack.status !== 'published') {
      return NextResponse.json(
        { error: 'Only published packs can be shared' },
        { status: 400 }
      );
    }

    const shares = await readShares();
    const now = new Date().toISOString();
    const publicId = generatePublicId();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const newShare: ReportShare = {
      id: generateId(),
      packId,
      packVersion: pack.version,
      publicId,
      shareUrl: `${baseUrl}/share/${publicId}`,
      accessLevel,
      status: 'active',
      requiresAuth: body.requiresAuth ?? false,
      password: body.password,
      allowedEmails: body.allowedEmails,
      allowedDomains: body.allowedDomains,
      allowedRoles: body.allowedRoles,
      expiresAt: body.expiresAt,
      viewCount: 0,
      downloadCount: 0,
      shareNote: body.shareNote,
      recipientName: body.recipientName,
      recipientEmail: body.recipientEmail,
      createdBy: body.userId || 'usr-001',
      createdAt: now,
    };

    shares.push(newShare);
    await writeShares(shares);

    // Log audit event
    await logAuditEvent('report.share.created', newShare.id, newShare.createdBy, {
      packId,
      accessLevel,
      publicId,
    });

    return NextResponse.json(newShare, { status: 201 });
  } catch (error) {
    console.error('Error creating share:', error);
    return NextResponse.json(
      { error: 'Failed to create share' },
      { status: 500 }
    );
  }
}

async function logAuditEvent(
  action: string,
  resourceId: string,
  userId: string,
  details?: Record<string, unknown>
) {
  try {
    const auditPath = path.join(DATA_DIR, 'auditEvents.json');
    let events: unknown[] = [];
    try {
      const content = await fs.readFile(auditPath, 'utf-8');
      events = JSON.parse(content);
    } catch {
      events = [];
    }

    events.push({
      id: `audit-${Date.now()}`,
      action,
      resourceType: 'reportShare',
      resourceId,
      userId,
      details,
      timestamp: new Date().toISOString(),
    });

    await fs.writeFile(auditPath, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}
