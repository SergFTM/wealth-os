import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'db', 'data');

async function loadCollection<T>(name: string): Promise<T[]> {
  try {
    const filePath = path.join(DATA_PATH, `${name}.json`);
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as T[];
  } catch {
    return [];
  }
}

async function saveCollection<T>(name: string, data: T[]): Promise<void> {
  const filePath = path.join(DATA_PATH, `${name}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

function hashSecret(secret: string): string {
  let hash = 0;
  for (let i = 0; i < secret.length; i++) {
    const char = secret.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

function generateApiKeySecret(): { secret: string; hash: string; prefix: string } {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let secret = 'wos_';
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return {
    secret,
    hash: hashSecret(secret),
    prefix: secret.substring(0, 12),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const keyMode = searchParams.get('keyMode');

    let apiKeys = await loadCollection<Record<string, unknown>>('apiKeys');

    if (status) {
      apiKeys = apiKeys.filter((k) => k.status === status);
    }
    if (keyMode) {
      apiKeys = apiKeys.filter((k) => k.keyMode === keyMode);
    }

    // Sort by createdAt descending
    apiKeys.sort((a, b) =>
      new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
    );

    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error('Error loading API keys:', error);
    return NextResponse.json({ error: 'Failed to load keys' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, keyMode, expiresAt, notes, clientId } = body;

    if (!name || !keyMode) {
      return NextResponse.json(
        { error: 'name and keyMode are required' },
        { status: 400 }
      );
    }

    const apiKeys = await loadCollection<Record<string, unknown>>('apiKeys');
    const now = new Date().toISOString();

    const { secret, hash, prefix } = generateApiKeySecret();

    const newKey = {
      id: generateId('key'),
      clientId,
      name,
      ownerUserId: 'user_admin',
      keyMode,
      secretHash: hash,
      keyPrefix: prefix,
      createdAt: now,
      expiresAt: expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      notes,
    };

    apiKeys.push(newKey);
    await saveCollection('apiKeys', apiKeys);

    // Create default rate limits
    const rateLimits = await loadCollection<Record<string, unknown>>('rateLimits');
    const newLimits = [
      {
        id: generateId('rl'),
        clientId,
        apiKeyId: newKey.id,
        windowKey: '1m',
        limit: 60,
        used: 0,
        hits: 0,
        windowStart: now,
        updatedAt: now,
      },
      {
        id: generateId('rl'),
        clientId,
        apiKeyId: newKey.id,
        windowKey: '1h',
        limit: 1000,
        used: 0,
        hits: 0,
        windowStart: now,
        updatedAt: now,
      },
    ];
    rateLimits.push(...newLimits);
    await saveCollection('rateLimits', rateLimits);

    // Log audit event
    const auditEvents = await loadCollection<Record<string, unknown>>('auditEvents');
    auditEvents.push({
      id: generateId('aud'),
      action: 'api_key.created',
      collection: 'apiKeys',
      recordId: newKey.id,
      summary: `API key "${name}" created (${keyMode})`,
      actorRole: 'admin',
      severity: 'info',
      createdAt: now,
    });
    await saveCollection('auditEvents', auditEvents);

    // Return with secret (one-time only!)
    return NextResponse.json({
      ...newKey,
      secret, // Only returned on creation
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json({ error: 'Failed to create key' }, { status: 500 });
  }
}
