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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apiKeys = await loadCollection<Record<string, unknown>>('apiKeys');
    const index = apiKeys.findIndex((k) => k.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    }

    const oldKey = apiKeys[index];

    if (oldKey.status !== 'active') {
      return NextResponse.json(
        { error: 'Can only rotate active keys' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const { secret, hash, prefix } = generateApiKeySecret();

    // Mark old key as rotated
    apiKeys[index] = {
      ...oldKey,
      status: 'rotated',
      // Expires in 24 hours to allow transition
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    // Create new key
    const newKey = {
      id: generateId('key'),
      clientId: oldKey.clientId,
      name: oldKey.name,
      ownerUserId: oldKey.ownerUserId,
      keyMode: oldKey.keyMode,
      secretHash: hash,
      keyPrefix: prefix,
      createdAt: now,
      expiresAt: oldKey.expiresAt, // Keep original expiry
      status: 'active',
      rotatedFromId: oldKey.id,
      notes: oldKey.notes,
    };

    apiKeys.push(newKey);
    await saveCollection('apiKeys', apiKeys);

    // Copy scopes to new key
    const scopes = await loadCollection<Record<string, unknown>>('apiKeyScopes');
    const oldScopes = scopes.filter((s) => s.apiKeyId === id);
    const newScopes = oldScopes.map((scope) => ({
      ...scope,
      id: generateId('scope'),
      apiKeyId: newKey.id,
      createdAt: now,
    }));
    scopes.push(...newScopes);
    await saveCollection('apiKeyScopes', scopes);

    // Copy rate limits to new key
    const rateLimits = await loadCollection<Record<string, unknown>>('rateLimits');
    const oldLimits = rateLimits.filter((rl) => rl.apiKeyId === id);
    const newLimits = oldLimits.map((limit) => ({
      ...limit,
      id: generateId('rl'),
      apiKeyId: newKey.id,
      used: 0,
      hits: 0,
      windowStart: now,
      updatedAt: now,
    }));
    rateLimits.push(...newLimits);
    await saveCollection('rateLimits', rateLimits);

    // Log audit event
    const auditEvents = await loadCollection<Record<string, unknown>>('auditEvents');
    auditEvents.push({
      id: generateId('aud'),
      action: 'api_key.rotated',
      collection: 'apiKeys',
      recordId: newKey.id,
      summary: `API key "${newKey.name}" rotated`,
      actorRole: 'admin',
      severity: 'info',
      metadata: {
        oldKeyId: oldKey.id,
        newKeyId: newKey.id,
      },
      createdAt: now,
    });
    await saveCollection('auditEvents', auditEvents);

    // Return new key with secret (one-time only!)
    return NextResponse.json({
      ...newKey,
      secret, // Only returned on rotation
      oldKeyId: oldKey.id,
    });
  } catch (error) {
    console.error('Error rotating API key:', error);
    return NextResponse.json({ error: 'Failed to rotate key' }, { status: 500 });
  }
}
