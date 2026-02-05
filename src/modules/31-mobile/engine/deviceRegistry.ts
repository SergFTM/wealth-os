/**
 * Device registry utilities for Mobile module
 */

export type Platform = 'ios' | 'android' | 'desktop';
export type Browser = 'safari' | 'chrome' | 'firefox' | 'edge' | 'other';
export type DeviceStatus = 'active' | 'inactive' | 'revoked';

export interface MobileDevice {
  id: string;
  clientId: string;
  userId: string;
  deviceName: string;
  platform: Platform;
  browser: Browser;
  status: DeviceStatus;
  biometricEnabled: boolean;
  lastSeenAt: string;
  lastIp?: string;
  createdAt: string;
}

export function getPlatformLabel(platform: Platform, locale: 'ru' | 'en' | 'uk' = 'ru') {
  const labels: Record<Platform, Record<'ru' | 'en' | 'uk', string>> = {
    ios: { ru: 'iOS', en: 'iOS', uk: 'iOS' },
    android: { ru: 'Android', en: 'Android', uk: 'Android' },
    desktop: { ru: 'Десктоп', en: 'Desktop', uk: 'Десктоп' },
  };
  return labels[platform][locale];
}

export function getPlatformIcon(platform: Platform): string {
  const icons: Record<Platform, string> = {
    ios: 'Smartphone',
    android: 'Smartphone',
    desktop: 'Monitor',
  };
  return icons[platform];
}

export function getStatusLabel(status: DeviceStatus, locale: 'ru' | 'en' | 'uk' = 'ru') {
  const labels: Record<DeviceStatus, Record<'ru' | 'en' | 'uk', string>> = {
    active: { ru: 'Активно', en: 'Active', uk: 'Активно' },
    inactive: { ru: 'Неактивно', en: 'Inactive', uk: 'Неактивно' },
    revoked: { ru: 'Отозвано', en: 'Revoked', uk: 'Відкликано' },
  };
  return labels[status][locale];
}

export function getStatusColor(status: DeviceStatus): string {
  const colors: Record<DeviceStatus, string> = {
    active: 'text-emerald-600 bg-emerald-100',
    inactive: 'text-amber-600 bg-amber-100',
    revoked: 'text-red-600 bg-red-100',
  };
  return colors[status];
}

export function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  return 'desktop';
}

export function detectBrowser(): Browser {
  if (typeof window === 'undefined') return 'other';
  const ua = navigator.userAgent.toLowerCase();
  if (/edg/.test(ua)) return 'edge';
  if (/firefox/.test(ua)) return 'firefox';
  if (/chrome/.test(ua)) return 'chrome';
  if (/safari/.test(ua)) return 'safari';
  return 'other';
}

export function generateDeviceName(): string {
  const platform = detectPlatform();
  const browser = detectBrowser();
  const browserNames: Record<Browser, string> = {
    safari: 'Safari',
    chrome: 'Chrome',
    firefox: 'Firefox',
    edge: 'Edge',
    other: 'Browser',
  };
  const platformNames: Record<Platform, string> = {
    ios: 'iPhone/iPad',
    android: 'Android Device',
    desktop: 'Desktop',
  };
  return `${platformNames[platform]} (${browserNames[browser]})`;
}

export function generateDemoDevice(userId: string, clientId: string): Omit<MobileDevice, 'id'> {
  const platforms: Platform[] = ['ios', 'android', 'desktop'];
  const browsers: Browser[] = ['safari', 'chrome', 'firefox', 'edge'];
  const deviceNames = [
    'iPhone 15 Pro', 'iPhone 14', 'iPad Pro', 'Samsung Galaxy S24',
    'Pixel 8', 'MacBook Pro', 'Windows Laptop', 'iMac', 'ThinkPad',
  ];

  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  const browser = browsers[Math.floor(Math.random() * browsers.length)];
  const deviceName = deviceNames[Math.floor(Math.random() * deviceNames.length)];

  return {
    clientId,
    userId,
    deviceName,
    platform,
    browser,
    status: 'active',
    biometricEnabled: Math.random() > 0.5,
    lastSeenAt: new Date().toISOString(),
    lastIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    createdAt: new Date().toISOString(),
  };
}

export function getSecurityChecklist(device: MobileDevice, locale: 'ru' | 'en' | 'uk' = 'ru') {
  return [
    {
      id: 'biometric',
      label: { ru: 'Биометрия', en: 'Biometrics', uk: 'Біометрія' }[locale],
      status: device.biometricEnabled ? 'ok' : 'warning',
      message: device.biometricEnabled
        ? { ru: 'Включена', en: 'Enabled', uk: 'Увімкнено' }[locale]
        : { ru: 'MVP placeholder', en: 'MVP placeholder', uk: 'MVP placeholder' }[locale],
    },
    {
      id: 'mfa',
      label: { ru: 'MFA', en: 'MFA', uk: 'MFA' }[locale],
      status: 'info',
      message: { ru: 'Рекомендуется', en: 'Recommended', uk: 'Рекомендовано' }[locale],
    },
    {
      id: 'lastSeen',
      label: { ru: 'Последняя активность', en: 'Last Activity', uk: 'Остання активність' }[locale],
      status: 'ok',
      message: new Date(device.lastSeenAt).toLocaleString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US'),
    },
  ];
}

export function isDeviceRecent(device: MobileDevice, daysThreshold = 7): boolean {
  const lastSeen = new Date(device.lastSeenAt);
  const now = new Date();
  const daysDiff = (now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff <= daysThreshold;
}
