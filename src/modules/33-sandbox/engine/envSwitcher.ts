/**
 * Environment Switcher Engine
 * Manages switching between Production and Sandbox environments
 */

export type SandboxEnvironment = 'production' | 'sandbox';

const STORAGE_KEY = 'wealth-os-sandbox-env';

export function getCurrentEnvironment(): SandboxEnvironment {
  if (typeof window === 'undefined') return 'production';
  const stored = sessionStorage.getItem(STORAGE_KEY);
  return (stored as SandboxEnvironment) || 'production';
}

export function setEnvironment(env: SandboxEnvironment): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, env);
  window.dispatchEvent(new CustomEvent('sandbox-env-change', { detail: env }));
}

export function toggleEnvironment(): SandboxEnvironment {
  const current = getCurrentEnvironment();
  const next = current === 'production' ? 'sandbox' : 'production';
  setEnvironment(next);
  return next;
}

export function isSandboxMode(): boolean {
  return getCurrentEnvironment() === 'sandbox';
}

export function getCollectionPrefix(): string {
  return isSandboxMode() ? 'sb_' : '';
}

export function prefixCollection(collection: string): string {
  if (isSandboxMode() && !collection.startsWith('sb')) {
    return `sb${collection.charAt(0).toUpperCase()}${collection.slice(1)}`;
  }
  return collection;
}

export function getApiEndpoint(collection: string, id?: string): string {
  const prefixedCollection = prefixCollection(collection);
  const base = `/api/collections/${prefixedCollection}`;
  return id ? `${base}/${id}` : base;
}

export function subscribeToEnvChange(callback: (env: SandboxEnvironment) => void): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<SandboxEnvironment>;
    callback(customEvent.detail);
  };

  window.addEventListener('sandbox-env-change', handler);
  return () => window.removeEventListener('sandbox-env-change', handler);
}

export interface EnvContext {
  environment: SandboxEnvironment;
  isSandbox: boolean;
  prefix: string;
  apiBase: string;
}

export function getEnvContext(): EnvContext {
  const env = getCurrentEnvironment();
  return {
    environment: env,
    isSandbox: env === 'sandbox',
    prefix: getCollectionPrefix(),
    apiBase: '/api/collections',
  };
}
