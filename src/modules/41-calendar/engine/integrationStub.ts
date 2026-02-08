/**
 * Integration Stub - Placeholder for calendar integrations (MVP)
 */

export interface CalendarIntegration {
  id: string;
  clientId: string;
  providerKey: 'google' | 'microsoft' | 'webcal' | 'apple';
  status: 'disabled' | 'configured' | 'connected' | 'error';
  configJson: {
    calendarId?: string;
    syncDirection?: 'import' | 'export' | 'bidirectional';
    filterTags?: string[];
    lastSyncAt?: string;
    syncFrequencyMinutes?: number;
  };
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderInfo {
  key: string;
  name: string;
  description: string;
  iconUrl?: string;
  available: boolean;
  comingSoon: boolean;
}

export const providers: ProviderInfo[] = [
  {
    key: 'google',
    name: 'Google Calendar',
    description: 'Синхронизация с Google Calendar через OAuth',
    available: false,
    comingSoon: true,
  },
  {
    key: 'microsoft',
    name: 'Microsoft Outlook',
    description: 'Синхронизация с Outlook Calendar через Microsoft Graph',
    available: false,
    comingSoon: true,
  },
  {
    key: 'apple',
    name: 'Apple Calendar',
    description: 'Интеграция с Apple Calendar через CalDAV',
    available: false,
    comingSoon: true,
  },
  {
    key: 'webcal',
    name: 'WebCal Import',
    description: 'Импорт событий из внешнего .ics URL',
    available: false,
    comingSoon: true,
  },
];

export function getProviderInfo(providerKey: string): ProviderInfo | undefined {
  return providers.find(p => p.key === providerKey);
}

export function createIntegrationData(
  clientId: string,
  providerKey: 'google' | 'microsoft' | 'webcal' | 'apple'
): Omit<CalendarIntegration, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId,
    providerKey,
    status: 'disabled',
    configJson: {
      syncDirection: 'bidirectional',
      filterTags: [],
      syncFrequencyMinutes: 15,
    },
  };
}

export function configureIntegration(
  integration: CalendarIntegration,
  config: CalendarIntegration['configJson']
): Partial<CalendarIntegration> {
  return {
    configJson: {
      ...integration.configJson,
      ...config,
    },
    status: 'configured',
    updatedAt: new Date().toISOString(),
  };
}

export function enableIntegration(integration: CalendarIntegration): Partial<CalendarIntegration> {
  // MVP: Always return error since integrations are not implemented
  return {
    status: 'error',
    errorMessage: 'Интеграции недоступны в MVP. Для production требуется настройка OAuth.',
    updatedAt: new Date().toISOString(),
  };
}

export function disableIntegration(integration: CalendarIntegration): Partial<CalendarIntegration> {
  return {
    status: 'disabled',
    errorMessage: undefined,
    updatedAt: new Date().toISOString(),
  };
}

export function testConnection(integration: CalendarIntegration): {
  success: boolean;
  message: string;
} {
  // MVP: Always fail
  return {
    success: false,
    message: `Интеграция с ${getProviderInfo(integration.providerKey)?.name || integration.providerKey} недоступна в MVP. Coming soon!`,
  };
}

export function syncNow(integration: CalendarIntegration): {
  success: boolean;
  message: string;
  eventsImported?: number;
  eventsExported?: number;
} {
  // MVP: Always fail
  return {
    success: false,
    message: 'Синхронизация недоступна в MVP версии.',
  };
}

export function getLastSyncStatus(integration: CalendarIntegration): {
  lastSync: string | null;
  nextSync: string | null;
  status: 'ok' | 'warning' | 'error' | 'never';
} {
  if (integration.status === 'disabled') {
    return { lastSync: null, nextSync: null, status: 'never' };
  }

  if (integration.status === 'error') {
    return {
      lastSync: integration.configJson.lastSyncAt || null,
      nextSync: null,
      status: 'error',
    };
  }

  const lastSync = integration.configJson.lastSyncAt;
  if (!lastSync) {
    return { lastSync: null, nextSync: null, status: 'warning' };
  }

  const lastSyncDate = new Date(lastSync);
  const nextSyncDate = new Date(lastSyncDate);
  nextSyncDate.setMinutes(
    nextSyncDate.getMinutes() + (integration.configJson.syncFrequencyMinutes || 15)
  );

  return {
    lastSync,
    nextSync: nextSyncDate.toISOString(),
    status: 'ok',
  };
}

export function getIntegrationStatusLabel(status: CalendarIntegration['status'], locale: string = 'ru'): string {
  const labels: Record<string, Record<CalendarIntegration['status'], string>> = {
    ru: {
      disabled: 'Отключено',
      configured: 'Настроено',
      connected: 'Подключено',
      error: 'Ошибка',
    },
    en: {
      disabled: 'Disabled',
      configured: 'Configured',
      connected: 'Connected',
      error: 'Error',
    },
  };

  return labels[locale]?.[status] || status;
}

export function generateIcsExport(events: Array<{
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  location?: string;
  description?: string;
}>): string {
  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WealthOS//Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

  for (const event of events) {
    const start = formatIcsDate(new Date(event.startAt));
    const end = formatIcsDate(new Date(event.endAt));

    ics += `BEGIN:VEVENT
UID:${event.id}@wealthos
DTSTART:${start}
DTEND:${end}
SUMMARY:${escapeIcsText(event.title)}
`;

    if (event.location) {
      ics += `LOCATION:${escapeIcsText(event.location)}\n`;
    }
    if (event.description) {
      ics += `DESCRIPTION:${escapeIcsText(event.description)}\n`;
    }

    ics += `END:VEVENT\n`;
  }

  ics += 'END:VCALENDAR';
  return ics;
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}
