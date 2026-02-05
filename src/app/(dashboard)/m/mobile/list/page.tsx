"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import {
  MbPwaPanel,
  MbOfflinePanel,
  MbPushPanel,
  MbPushInbox,
  MbQuickActionsPanel,
  MbDevicesTable,
  MbSettingsPanel,
} from '@/modules/31-mobile/ui';

const tabs = [
  { id: 'pwa', label: { ru: 'PWA', en: 'PWA', uk: 'PWA' }, icon: 'Download' },
  { id: 'offline', label: { ru: 'Offline Cache', en: 'Offline Cache', uk: 'Offline Cache' }, icon: 'WifiOff' },
  { id: 'push', label: { ru: 'Push', en: 'Push', uk: 'Push' }, icon: 'Bell' },
  { id: 'actions', label: { ru: 'Быстрые действия', en: 'Quick Actions', uk: 'Швидкі дії' }, icon: 'Zap' },
  { id: 'devices', label: { ru: 'Устройства', en: 'Devices', uk: 'Пристрої' }, icon: 'Smartphone' },
  { id: 'settings', label: { ru: 'Настройки', en: 'Settings', uk: 'Налаштування' }, icon: 'Settings' },
];

const i18n = {
  ru: {
    title: 'Мобильный режим',
    subtitle: 'PWA, Offline и Push уведомления',
    back: '← Дашборд',
  },
  en: {
    title: 'Mobile Mode',
    subtitle: 'PWA, Offline and Push notifications',
    back: '← Dashboard',
  },
  uk: {
    title: 'Мобільний режим',
    subtitle: 'PWA, Offline та Push сповіщення',
    back: '← Дашборд',
  },
};

function MobileListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useApp();
  const t = i18n[locale];

  const initialTab = searchParams.get('tab') || 'pwa';
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/m/mobile/list?tab=${tabId}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">{t.title}</h1>
          <p className="text-sm text-stone-500">{t.subtitle}</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/m/mobile')}>
          {t.back}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap flex items-center gap-2",
              activeTab === tab.id
                ? "border-emerald-500 text-emerald-700"
                : "border-transparent text-stone-500 hover:text-stone-700"
            )}
          >
            {tab.label[locale]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'pwa' && <MbPwaPanel />}
        {activeTab === 'offline' && <MbOfflinePanel />}
        {activeTab === 'push' && (
          <div className="space-y-6">
            <MbPushPanel />
            <MbPushInbox />
          </div>
        )}
        {activeTab === 'actions' && <MbQuickActionsPanel />}
        {activeTab === 'devices' && <MbDevicesTable />}
        {activeTab === 'settings' && <MbSettingsPanel />}
      </div>
    </div>
  );
}

export default function MobileListPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-stone-500">Загрузка...</div>}>
      <MobileListContent />
    </Suspense>
  );
}
