'use client';

/**
 * Admin Dashboard Page
 * /m/admin
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdKpiStrip } from '@/modules/25-admin/ui/AdKpiStrip';
import { AdPreviewFrame } from '@/modules/25-admin/ui/AdPreviewFrame';
import { AdActionsBar } from '@/modules/25-admin/ui/AdActionsBar';
import { AdminKpis } from '@/modules/25-admin/engine/adminKpis';
import { Branding } from '@/modules/25-admin/schema/branding';
import { PortalConfig } from '@/modules/25-admin/schema/portalConfig';

const labels = {
  title: { ru: 'Администрирование', en: 'Administration', uk: 'Адміністрування' },
  disclaimer: {
    ru: 'White label настройки в MVP демонстрационные. Для production требуется инфраструктура и доменная настройка.',
    en: 'White label settings are demonstrational in MVP. Production requires infrastructure and domain configuration.',
    uk: 'White label налаштування в MVP демонстраційні. Для production потрібна інфраструктура і доменна конфігурація.',
  },
  preview: { ru: 'Предпросмотр интерфейса', en: 'Interface Preview', uk: 'Попередній перегляд інтерфейсу' },
  quickLinks: { ru: 'Быстрые ссылки', en: 'Quick Links', uk: 'Швидкі посилання' },
  branding: { ru: 'Брендинг', en: 'Branding', uk: 'Брендинг' },
  portal: { ru: 'Портал клиента', en: 'Client Portal', uk: 'Портал клієнта' },
  languages: { ru: 'Языки', en: 'Languages', uk: 'Мови' },
  notifications: { ru: 'Уведомления', en: 'Notifications', uk: 'Сповіщення' },
  policies: { ru: 'Политики', en: 'Policies', uk: 'Політики' },
  flags: { ru: 'Флаги функций', en: 'Feature Flags', uk: 'Флаги функцій' },
  tenant: { ru: 'Тенант', en: 'Tenant', uk: 'Тенант' },
  data: { ru: 'Данные', en: 'Data', uk: 'Дані' },
};

const quickLinks = [
  { key: 'branding', href: '/m/admin/list?tab=branding', icon: '🎨' },
  { key: 'portal', href: '/m/admin/list?tab=portal', icon: '🌐' },
  { key: 'languages', href: '/m/admin/list?tab=languages', icon: '🌍' },
  { key: 'notifications', href: '/m/admin/list?tab=notifications', icon: '📧' },
  { key: 'policies', href: '/m/admin/list?tab=policies', icon: '📋' },
  { key: 'flags', href: '/m/admin/list?tab=flags', icon: '🚩' },
  { key: 'tenant', href: '/m/admin/list?tab=tenant', icon: '🏢' },
  { key: 'data', href: '/m/admin/list?tab=data', icon: '💾' },
];

export default function AdminDashboardPage() {
  const lang = 'ru';
  const [kpis, setKpis] = useState<AdminKpis | null>(null);
  const [branding, setBranding] = useState<Branding | null>(null);
  const [portalConfig, setPortalConfig] = useState<PortalConfig | null>(null);

  useEffect(() => {
    // Fetch KPIs
    fetch('/api/admin/kpis')
      .then(r => r.json())
      .then(d => setKpis(d.data))
      .catch(() => {});

    // Fetch branding
    fetch('/api/tenant/branding')
      .then(r => r.json())
      .then(d => setBranding(d.data))
      .catch(() => {});

    // Fetch portal config
    fetch('/api/tenant/portal')
      .then(r => r.json())
      .then(d => setPortalConfig(d.data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title[lang]}</h1>
      </div>

      {/* Disclaimer Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
        ⚠️ {labels.disclaimer[lang]}
      </div>

      {/* KPI Strip */}
      {kpis && <AdKpiStrip kpis={kpis} lang={lang} />}

      {/* Actions Bar */}
      <AdActionsBar
        onSaveBranding={() => window.location.href = '/m/admin/list?tab=branding'}
        onAddPolicyBanner={() => window.location.href = '/m/admin/list?tab=policies'}
        onCreateFlag={() => window.location.href = '/m/admin/list?tab=flags'}
        onAddDomain={() => window.location.href = '/m/admin/list?tab=tenant'}
        onResetDefaults={() => {}}
        lang={lang}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview Frame */}
        <div>
          <h2 className="text-lg font-medium mb-4">{labels.preview[lang]}</h2>
          <AdPreviewFrame
            branding={branding}
            portalConfig={portalConfig}
            lang={lang}
          />
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-medium mb-4">{labels.quickLinks[lang]}</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map(link => (
              <Link
                key={link.key}
                href={link.href}
                className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="font-medium">
                  {labels[link.key as keyof typeof labels]?.[lang] || link.key}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
