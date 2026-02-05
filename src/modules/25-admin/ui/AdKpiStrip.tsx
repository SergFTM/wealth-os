'use client';

/**
 * Admin KPI Strip Component
 * Displays 8 KPI cards for admin dashboard
 */

import Link from 'next/link';
import { AdminKpis } from '../engine/adminKpis';

interface AdKpiStripProps {
  kpis: AdminKpis;
  lang?: 'ru' | 'en' | 'uk';
}

const kpiConfig = {
  brandingConfigured: {
    title: { ru: 'Брендинг настроен', en: 'Branding Configured', uk: 'Брендинг налаштовано' },
    href: '/m/admin/list?tab=branding',
    format: 'boolean' as const,
  },
  portalModulesEnabled: {
    title: { ru: 'Модулей портала', en: 'Portal Modules', uk: 'Модулів порталу' },
    href: '/m/admin/list?tab=portal',
    format: 'number' as const,
  },
  languageOverrides: {
    title: { ru: 'Переопределений языка', en: 'Language Overrides', uk: 'Перевизначень мови' },
    href: '/m/admin/list?tab=languages',
    format: 'number' as const,
  },
  notificationTemplates: {
    title: { ru: 'Шаблонов уведомлений', en: 'Notification Templates', uk: 'Шаблонів сповіщень' },
    href: '/m/admin/list?tab=notifications',
    format: 'number' as const,
  },
  activePolicyBanners: {
    title: { ru: 'Активных баннеров', en: 'Active Banners', uk: 'Активних банерів' },
    href: '/m/admin/list?tab=policies&status=active',
    format: 'number' as const,
  },
  featureFlagsEnabled: {
    title: { ru: 'Флагов включено', en: 'Flags Enabled', uk: 'Флагів увімкнено' },
    href: '/m/admin/list?tab=flags&filter=enabled',
    format: 'number' as const,
  },
  domainsConfigured: {
    title: { ru: 'Доменов настроено', en: 'Domains Configured', uk: 'Доменів налаштовано' },
    href: '/m/admin/list?tab=tenant',
    format: 'number' as const,
  },
  retentionDays: {
    title: { ru: 'Хранение данных (дни)', en: 'Retention Days', uk: 'Зберігання (дні)' },
    href: '/m/admin/list?tab=data',
    format: 'number' as const,
  },
};

function formatValue(value: number | boolean, format: 'number' | 'boolean', lang: string): string {
  if (format === 'boolean') {
    if (lang === 'ru') return value ? 'Да' : 'Нет';
    if (lang === 'uk') return value ? 'Так' : 'Ні';
    return value ? 'Yes' : 'No';
  }
  return value.toString();
}

function getStatus(key: keyof AdminKpis, value: number | boolean): 'ok' | 'warning' | 'critical' {
  if (key === 'brandingConfigured') return value ? 'ok' : 'warning';
  if (key === 'portalModulesEnabled') return (value as number) > 0 ? 'ok' : 'warning';
  if (key === 'retentionDays') return (value as number) >= 365 ? 'ok' : 'warning';
  return 'ok';
}

const statusColors = {
  ok: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  critical: 'bg-red-50 border-red-200 text-red-700',
};

export function AdKpiStrip({ kpis, lang = 'ru' }: AdKpiStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {(Object.keys(kpiConfig) as Array<keyof AdminKpis>).map(key => {
        const config = kpiConfig[key];
        const value = kpis[key];
        const status = getStatus(key, value);
        const displayValue = formatValue(value, config.format, lang);

        return (
          <Link
            key={key}
            href={config.href}
            className={`p-3 rounded-lg border transition-all hover:shadow-md ${statusColors[status]}`}
          >
            <div className="text-2xl font-semibold">{displayValue}</div>
            <div className="text-xs mt-1 opacity-80">{config.title[lang]}</div>
          </Link>
        );
      })}
    </div>
  );
}
