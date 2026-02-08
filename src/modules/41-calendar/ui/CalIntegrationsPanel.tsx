"use client";

import { Button } from '@/components/ui/Button';
import { CalStatusPill } from './CalStatusPill';
import { cn } from '@/lib/utils';

interface CalendarIntegration {
  id: string;
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
}

interface CalIntegrationsPanelProps {
  integrations: CalendarIntegration[];
  onConnect?: (integration: CalendarIntegration) => void;
  onDisconnect?: (integration: CalendarIntegration) => void;
  onConfigure?: (integration: CalendarIntegration) => void;
  className?: string;
}

const providerInfo: Record<string, { name: string; icon: React.ReactNode; color: string }> = {
  google: {
    name: 'Google Calendar',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    color: 'bg-white border-stone-200',
  },
  microsoft: {
    name: 'Microsoft Outlook',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M11.5 3v8.5H3V3h8.5z" fill="#F25022"/>
        <path d="M21 3v8.5h-8.5V3H21z" fill="#7FBA00"/>
        <path d="M11.5 12.5V21H3v-8.5h8.5z" fill="#00A4EF"/>
        <path d="M21 12.5V21h-8.5v-8.5H21z" fill="#FFB900"/>
      </svg>
    ),
    color: 'bg-white border-stone-200',
  },
  apple: {
    name: 'Apple Calendar',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    color: 'bg-white border-stone-200',
  },
  webcal: {
    name: 'WebCal Import',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-stone-50 border-stone-200',
  },
};

export function CalIntegrationsPanel({
  integrations,
  onConnect,
  onDisconnect,
  onConfigure,
  className,
}: CalIntegrationsPanelProps) {
  // Ensure all providers are shown
  const allProviders: ('google' | 'microsoft' | 'apple' | 'webcal')[] = ['google', 'microsoft', 'apple', 'webcal'];

  const getIntegration = (providerKey: string) => {
    return integrations.find(i => i.providerKey === providerKey);
  };

  return (
    <div className={cn("bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50", className)}>
      <div className="px-4 py-3 border-b border-stone-200/50">
        <h3 className="font-semibold text-stone-800">Интеграции календаря</h3>
        <p className="text-xs text-stone-500">Синхронизация с внешними календарями</p>
      </div>

      {/* MVP Disclaimer */}
      <div className="mx-4 mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
        <div className="flex items-start gap-2 text-sm text-amber-800">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-medium">MVP режим</p>
            <p className="text-xs mt-0.5">Интеграции недоступны в демо-версии. Для production требуется настройка OAuth.</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {allProviders.map(providerKey => {
          const integration = getIntegration(providerKey);
          const info = providerInfo[providerKey];

          return (
            <div
              key={providerKey}
              className={cn(
                "p-4 rounded-lg border transition-colors",
                info.color,
                integration?.status === 'error' && "border-rose-200 bg-rose-50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {info.icon}
                  <div>
                    <p className="font-medium text-stone-800">{info.name}</p>
                    {integration?.configJson.lastSyncAt && (
                      <p className="text-xs text-stone-500">
                        Последняя синхронизация: {new Date(integration.configJson.lastSyncAt).toLocaleString('ru-RU')}
                      </p>
                    )}
                    {integration?.errorMessage && (
                      <p className="text-xs text-rose-600">{integration.errorMessage}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {integration && (
                    <CalStatusPill status={integration.status} size="sm" />
                  )}

                  {!integration || integration.status === 'disabled' ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        if (integration) {
                          onConnect?.(integration);
                        }
                      }}
                      disabled={true}
                    >
                      Coming soon
                    </Button>
                  ) : integration.status === 'connected' ? (
                    <>
                      {onConfigure && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onConfigure(integration)}
                        >
                          Настроить
                        </Button>
                      )}
                      {onDisconnect && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDisconnect(integration)}
                        >
                          Отключить
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={true}
                    >
                      Coming soon
                    </Button>
                  )}
                </div>
              </div>

              {integration?.status === 'configured' && integration.configJson && (
                <div className="mt-3 pt-3 border-t border-stone-200 text-xs text-stone-500">
                  <div className="flex gap-4">
                    {integration.configJson.syncDirection && (
                      <span>
                        Направление: {
                          integration.configJson.syncDirection === 'import' ? 'Импорт' :
                          integration.configJson.syncDirection === 'export' ? 'Экспорт' :
                          'Двусторонняя'
                        }
                      </span>
                    )}
                    {integration.configJson.syncFrequencyMinutes && (
                      <span>Интервал: {integration.configJson.syncFrequencyMinutes} мин</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
