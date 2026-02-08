// Portal Authentication (MVP)
// In production: replace with SSO / OAuth

export interface PortalUser {
  id: string;
  clientId: string;
  email: string;
  displayName: string;
  pinHash: string;
  languageDefaultKey: 'ru' | 'en' | 'uk';
  householdId?: string;
  status: 'active' | 'disabled';
  createdAt: string;
}

export interface PortalSession {
  id: string;
  portalUserId: string;
  sessionTokenHash: string;
  createdAt: string;
  expiresAt: string;
  lastSeenAt: string;
}

export function hashPin(pin: string): string {
  // MVP: simple hash. Production: bcrypt/argon2
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `pin_${Math.abs(hash).toString(36)}`;
}

export function verifyPin(pin: string, pinHash: string): boolean {
  return hashPin(pin) === pinHash;
}

export function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function createSessionExpiry(hoursFromNow: number = 24): string {
  const d = new Date();
  d.setHours(d.getHours() + hoursFromNow);
  return d.toISOString();
}

export function isSessionExpired(session: PortalSession): boolean {
  return new Date(session.expiresAt) < new Date();
}

export function getPortalCookieName(): string {
  return 'portal_session_55';
}
