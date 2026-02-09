'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { MbStatusPill } from './MbStatusPill';
import { getPlatformLabel, getSecurityChecklist, type MobileDevice } from '../engine';
import type { PushSubscription } from '../engine';

const labels = {
  back: { ru: '← Назад', en: '← Back', uk: '← Назад' },
  deviceInfo: { ru: 'Информация об устройстве', en: 'Device Info', uk: 'Інформація про пристрій' },
  subscriptions: { ru: 'Подписки', en: 'Subscriptions', uk: 'Підписки' },
  security: { ru: 'Безопасность', en: 'Security', uk: 'Безпека' },
  revoke: { ru: 'Отозвать устройство', en: 'Revoke Device', uk: 'Відкликати пристрій' },
  revoking: { ru: 'Отзыв...', en: 'Revoking...', uk: 'Відкликання...' },
  notFound: { ru: 'Устройство не найдено', en: 'Device not found', uk: 'Пристрій не знайдено' },
  platform: { ru: 'Платформа', en: 'Platform', uk: 'Платформа' },
  browser: { ru: 'Браузер', en: 'Browser', uk: 'Браузер' },
  lastSeen: { ru: 'Последний вход', en: 'Last Seen', uk: 'Останній вхід' },
  registered: { ru: 'Зарегистрировано', en: 'Registered', uk: 'Зареєстровано' },
  ip: { ru: 'IP адрес', en: 'IP Address', uk: 'IP адреса' },
  noSubs: { ru: 'Нет подписок', en: 'No subscriptions', uk: 'Немає підписок' },
};

interface MbDeviceDetailProps {
  deviceId: string;
}

export function MbDeviceDetail({ deviceId }: MbDeviceDetailProps) {
  const { locale } = useApp();
  const [device, setDevice] = useState<MobileDevice | null>(null);
  const [subscriptions, setSubscriptions] = useState<PushSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/collections/mobileDevices').then(r => r.json()),
      fetch('/api/collections/pushSubscriptions').then(r => r.json()),
    ]).then(([devicesRaw, subsRaw]) => {
      const devices = devicesRaw.items ?? devicesRaw ?? [];
      const subs = subsRaw.items ?? subsRaw ?? [];
      const found = devices.find((d: MobileDevice) => d.id === deviceId);
      setDevice(found || null);
      setSubscriptions(subs.filter((s: PushSubscription) => s.deviceId === deviceId));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [deviceId]);

  const handleRevoke = async () => {
    if (!device) return;
    setRevoking(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDevice({ ...device, status: 'revoked' });
    setRevoking(false);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" /></div>;
  }

  if (!device) {
    return <div className="text-center py-12 text-stone-500">{labels.notFound[locale]}</div>;
  }

  const securityChecks = getSecurityChecklist(device, locale);

  return (
    <div className="space-y-6">
      {/* Device Info */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-800">{device.deviceName}</h2>
              <MbStatusPill status={device.status} size="md" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><div className="text-xs text-stone-500">{labels.platform[locale]}</div><div className="font-medium">{getPlatformLabel(device.platform, locale)}</div></div>
          <div><div className="text-xs text-stone-500">{labels.browser[locale]}</div><div className="font-medium capitalize">{device.browser}</div></div>
          <div><div className="text-xs text-stone-500">{labels.lastSeen[locale]}</div><div className="font-medium">{new Date(device.lastSeenAt).toLocaleString()}</div></div>
          <div><div className="text-xs text-stone-500">{labels.ip[locale]}</div><div className="font-medium">{device.lastIp || '-'}</div></div>
        </div>
      </div>

      {/* Subscriptions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h3 className="font-semibold text-stone-800 mb-4">{labels.subscriptions[locale]}</h3>
        {subscriptions.length === 0 ? (
          <div className="text-stone-500 text-sm">{labels.noSubs[locale]}</div>
        ) : (
          <div className="space-y-2">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                <div className="flex flex-wrap gap-1">
                  {sub.topicsJson.map((topic) => (
                    <span key={topic} className="px-2 py-0.5 bg-blue-100 rounded text-xs text-blue-700">{topic}</span>
                  ))}
                </div>
                <MbStatusPill status={sub.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h3 className="font-semibold text-stone-800 mb-4">{labels.security[locale]}</h3>
        <div className="space-y-2">
          {securityChecks.map((check) => (
            <div key={check.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <span className="font-medium text-sm">{check.label}</span>
              <span className="text-sm text-stone-600">{check.message}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revoke */}
      {device.status !== 'revoked' && (
        <button onClick={handleRevoke} disabled={revoking} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium text-sm hover:bg-red-100 disabled:opacity-50">
          {revoking ? labels.revoking[locale] : labels.revoke[locale]}
        </button>
      )}
    </div>
  );
}
