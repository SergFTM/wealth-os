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

// Resource to collection mapping
const RESOURCE_MAP: Record<string, { collection: string; moduleKey: string }> = {
  networth: { collection: 'assets', moduleKey: 'net-worth' },
  performance: { collection: 'performance', moduleKey: 'performance' },
  invoices: { collection: 'invoices', moduleKey: 'invoices' },
  tasks: { collection: 'tasks', moduleKey: 'tasks' },
  documents: { collection: 'documents', moduleKey: 'documents' },
};

interface ApiKey {
  id: string;
  name: string;
  secretHash: string;
  status: string;
  keyMode: string;
  expiresAt: string;
}

interface ApiKeyScope {
  apiKeyId: string;
  moduleKey: string;
  actionKey: string;
  scopeType: string;
  scopeId?: string;
  clientSafe: boolean;
}

interface RateLimit {
  id: string;
  apiKeyId: string;
  windowKey: string;
  limit: number;
  used: number;
  hits: number;
  windowStart: string;
  updatedAt: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const startTime = Date.now();
  const { resource } = await params;
  const apiKeyHeader = request.headers.get('x-api-key');

  // Check resource exists
  const resourceConfig = RESOURCE_MAP[resource];
  if (!resourceConfig) {
    return NextResponse.json(
      { error: 'Unknown resource', code: 'UNKNOWN_RESOURCE' },
      { status: 404 }
    );
  }

  // Validate API key
  if (!apiKeyHeader) {
    return NextResponse.json(
      { error: 'Missing x-api-key header', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  const [apiKeys, apiKeyScopes, rateLimits] = await Promise.all([
    loadCollection<ApiKey>('apiKeys'),
    loadCollection<ApiKeyScope>('apiKeyScopes'),
    loadCollection<RateLimit>('rateLimits'),
  ]);

  const secretHash = hashSecret(apiKeyHeader);
  const apiKey = apiKeys.find((k) => k.secretHash === secretHash);

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Invalid API key', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  if (apiKey.status !== 'active') {
    return NextResponse.json(
      { error: `API key is ${apiKey.status}`, code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  if (new Date(apiKey.expiresAt) < new Date()) {
    return NextResponse.json(
      { error: 'API key has expired', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  // Check rate limits
  const keyRateLimits = rateLimits.filter((rl) => rl.apiKeyId === apiKey.id && rl.windowKey === '1m');
  if (keyRateLimits.length > 0) {
    const rateLimit = keyRateLimits[0];
    const windowEnd = new Date(new Date(rateLimit.windowStart).getTime() + 60 * 1000);

    if (new Date() < windowEnd && rateLimit.used >= rateLimit.limit) {
      // Update hits counter
      const rlIndex = rateLimits.findIndex((rl) => rl.id === rateLimit.id);
      rateLimits[rlIndex] = {
        ...rateLimit,
        hits: rateLimit.hits + 1,
        updatedAt: new Date().toISOString(),
      };
      await saveCollection('rateLimits', rateLimits);

      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          code: 'RATE_LIMITED',
          retryAfter: Math.ceil((windowEnd.getTime() - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(windowEnd.getTime() / 1000)),
          },
        }
      );
    }
  }

  // Check scopes
  const scopes = apiKeyScopes.filter((s) => s.apiKeyId === apiKey.id);
  const hasScope = scopes.some(
    (s) => s.moduleKey === resourceConfig.moduleKey && s.actionKey === 'view'
  );

  if (!hasScope) {
    return NextResponse.json(
      { error: 'Insufficient permissions', code: 'FORBIDDEN' },
      { status: 403 }
    );
  }

  // Check if client-safe mode
  const isClientSafe = apiKey.keyMode === 'client';

  try {
    // Load data
    let data = await loadCollection<Record<string, unknown>>(resourceConfig.collection);

    // Filter for client-safe
    if (isClientSafe) {
      data = data.map((item) => {
        const filtered = { ...item };
        delete filtered.internalNotes;
        delete filtered.staffNotes;
        delete filtered.auditId;
        delete filtered.staffOnly;
        delete filtered.adminOnly;
        return filtered;
      });

      // Filter out staff-only items
      data = data.filter((item) => !item.staffOnly);
    }

    // Update rate limit counter
    if (keyRateLimits.length > 0) {
      const rateLimit = keyRateLimits[0];
      const windowEnd = new Date(new Date(rateLimit.windowStart).getTime() + 60 * 1000);

      const rlIndex = rateLimits.findIndex((rl) => rl.id === rateLimit.id);

      if (new Date() >= windowEnd) {
        // Reset window
        rateLimits[rlIndex] = {
          ...rateLimit,
          used: 1,
          windowStart: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        rateLimits[rlIndex] = {
          ...rateLimit,
          used: rateLimit.used + 1,
          updatedAt: new Date().toISOString(),
        };
      }
      await saveCollection('rateLimits', rateLimits);
    }

    // Update lastUsedAt
    const keyIndex = apiKeys.findIndex((k) => k.id === apiKey.id);
    apiKeys[keyIndex] = {
      ...apiKey,
      lastUsedAt: new Date().toISOString(),
    } as ApiKey & { lastUsedAt: string };
    await saveCollection('apiKeys', apiKeys);

    // Log access
    const accessLogs = await loadCollection<Record<string, unknown>>('apiAccessLogs');
    accessLogs.push({
      id: generateId('log'),
      apiKeyId: apiKey.id,
      apiKeyName: apiKey.name,
      endpoint: `/api/public/${resource}`,
      method: 'GET',
      statusCode: 200,
      latencyMs: Date.now() - startTime,
      scopeType: 'global',
      responseSize: JSON.stringify(data).length,
      createdAt: new Date().toISOString(),
    });
    await saveCollection('apiAccessLogs', accessLogs);

    return NextResponse.json({
      data,
      meta: {
        total: data.length,
        asOf: new Date().toISOString(),
        resource,
      },
    });
  } catch (error) {
    console.error('Error in public API:', error);

    // Log error
    const accessLogs = await loadCollection<Record<string, unknown>>('apiAccessLogs');
    accessLogs.push({
      id: generateId('log'),
      apiKeyId: apiKey.id,
      apiKeyName: apiKey.name,
      endpoint: `/api/public/${resource}`,
      method: 'GET',
      statusCode: 500,
      latencyMs: Date.now() - startTime,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      createdAt: new Date().toISOString(),
    });
    await saveCollection('apiAccessLogs', accessLogs);

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
