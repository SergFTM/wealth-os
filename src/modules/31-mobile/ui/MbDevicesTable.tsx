'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { MbStatusPill } from './MbStatusPill';
import { getPlatformLabel, type MobileDevice } from '../engine';

const labels = {
  title: { ru: 'Устройства', en: 'Devices', uk: 'Пристрої' },
  noDevices: { ru: 'Нет устройств', en: 'No devices', uk: 'Немає пристроїв' },
  device: { ru: 'Устройство', en: 'Device', uk: 'Пристрій' },
  platform: { ru: 'Платформа', en: 'Platform', uk: 'Платформа' },
  browser: { ru: 'Браузер', en: 'Browser', uk: 'Браузер' },
  lastSeen: { ru: 'Последний вход', en: 'Last Seen', uk: 'Останній вхід' },
  status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
  all: { ru: 'Все', en: 'All', uk: 'Всі' },
  active: { ru: 'Активные', en: 'Active', uk: 'Активні' },
};

export function MbDevicesTable() {
  const { locale } = useApp();
  const [devices, setDevices] = useState<MobileDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active'>('all');

  useEffect(() => {
    fetch('/api/collections/mobileDevices')
      .then(r => r.json())
      .then(data => {
        setDevices((data || []).sort((a: MobileDevice, b: MobileDevice) => 
          new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime()
        ));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredDevices = devices.filter(d => filter === 'all' || d.status === 'active');

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-emerald-100 text-emerald-700' : 'bg-white/80 text-stone-600'}`}>
          {labels.all[locale]} ({devices.length})
        </button>
        <button onClick={() => setFilter('active')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-white/80 text-stone-600'}`}>
          {labels.active[locale]} ({devices.filter(d => d.status === 'active').length})
        </button>
      </div>
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 overflow-hidden">
        {filteredDevices.length === 0 ? (
          <div className="p-8 text-center text-stone-500">{labels.noDevices[locale]}</div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredDevices.map((device) => (
              <Link key={device.id} href={`/m/mobile/device/${device.id}`} className="flex items-center p-4 hover:bg-emerald-50/30">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-stone-800">{device.deviceName}</div>
                  <div className="text-xs text-stone-500">{getPlatformLabel(device.platform, locale)} · {device.browser}</div>
                </div>
                <div className="text-xs text-stone-400 mr-4">{new Date(device.lastSeenAt).toLocaleDateString()}</div>
                <MbStatusPill status={device.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
