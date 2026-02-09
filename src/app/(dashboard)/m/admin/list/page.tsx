'use client';

/**
 * Admin List Page with Tabs
 * /m/admin/list
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdBrandingPanel } from '@/modules/25-admin/ui/AdBrandingPanel';
import { AdPortalPanel } from '@/modules/25-admin/ui/AdPortalPanel';
import { AdLanguagesPanel } from '@/modules/25-admin/ui/AdLanguagesPanel';
import { AdNotificationsPanel } from '@/modules/25-admin/ui/AdNotificationsPanel';
import { AdPoliciesTable } from '@/modules/25-admin/ui/AdPoliciesTable';
import { AdFlagsTable } from '@/modules/25-admin/ui/AdFlagsTable';
import { AdTenantPanel } from '@/modules/25-admin/ui/AdTenantPanel';
import { AdDataPanel } from '@/modules/25-admin/ui/AdDataPanel';
import { Branding } from '@/modules/25-admin/schema/branding';
import { PortalConfig } from '@/modules/25-admin/schema/portalConfig';
import { LanguageConfig } from '@/modules/25-admin/schema/languageOverrides';
import { NotificationTemplate } from '@/modules/25-admin/schema/notificationTemplate';
import { PolicyBanner } from '@/modules/25-admin/schema/policyBanner';
import { FeatureFlag } from '@/modules/25-admin/schema/featureFlag';
import { TenantProfile } from '@/modules/25-admin/schema/tenantProfile';
import { TenantDomain } from '@/modules/25-admin/schema/tenantDomain';
import { DataPolicy } from '@/modules/25-admin/schema/dataPolicy';

type TabKey = 'branding' | 'portal' | 'languages' | 'notifications' | 'policies' | 'flags' | 'tenant' | 'data';

const tabs: { key: TabKey; label: { ru: string; en: string; uk: string } }[] = [
  { key: 'branding', label: { ru: 'Брендинг', en: 'Branding', uk: 'Брендинг' } },
  { key: 'portal', label: { ru: 'Портал', en: 'Portal', uk: 'Портал' } },
  { key: 'languages', label: { ru: 'Языки', en: 'Languages', uk: 'Мови' } },
  { key: 'notifications', label: { ru: 'Уведомления', en: 'Notifications', uk: 'Сповіщення' } },
  { key: 'policies', label: { ru: 'Политики', en: 'Policies', uk: 'Політики' } },
  { key: 'flags', label: { ru: 'Флаги', en: 'Flags', uk: 'Флаги' } },
  { key: 'tenant', label: { ru: 'Тенант', en: 'Tenant', uk: 'Тенант' } },
  { key: 'data', label: { ru: 'Данные', en: 'Data', uk: 'Дані' } },
];

export default function AdminListPage() {
  const lang = 'ru';
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') as TabKey | null;
  const activeTab = tabs.find(t => t.key === tabParam)?.key || 'branding';

  const [branding, setBranding] = useState<Branding | null>(null);
  const [portalConfig, setPortalConfig] = useState<PortalConfig | null>(null);
  const [languageConfig, setLanguageConfig] = useState<LanguageConfig | null>(null);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [banners, setBanners] = useState<PolicyBanner[]>([]);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [domains, setDomains] = useState<TenantDomain | null>(null);
  const [dataPolicy, setDataPolicy] = useState<DataPolicy | null>(null);

  useEffect(() => {
    // Load data based on active tab
    if (activeTab === 'branding') {
      fetch('/api/tenant/branding').then(r => r.json()).then(d => setBranding(d.data));
    }
    if (activeTab === 'portal') {
      fetch('/api/tenant/portal').then(r => r.json()).then(d => setPortalConfig(d.data));
    }
    if (activeTab === 'languages') {
      fetch('/api/tenant/language').then(r => r.json()).then(d => setLanguageConfig(d.data));
    }
    if (activeTab === 'notifications') {
      fetch('/api/collections/notificationTemplates').then(r => r.json()).then(d => setTemplates(d.items ?? []));
    }
    if (activeTab === 'policies') {
      fetch('/api/tenant/policies').then(r => r.json()).then(d => setBanners(d.data || []));
    }
    if (activeTab === 'flags') {
      fetch('/api/tenant/flags').then(r => r.json()).then(d => setFlags(d.data || []));
    }
    if (activeTab === 'tenant') {
      fetch('/api/tenant/profile').then(r => r.json()).then(d => setProfile(d.data));
      fetch('/api/collections/tenantDomains').then(r => r.json()).then(d => setDomains(d.items?.[0] || null));
    }
    if (activeTab === 'data') {
      fetch('/api/collections/dataPolicies').then(r => r.json()).then(d => setDataPolicy(d.items?.[0] || null));
    }
  }, [activeTab]);

  const setTab = (key: TabKey) => {
    router.push(`/m/admin/list?tab=${key}`);
  };

  // Save handlers
  const saveBranding = async (data: Partial<Branding>) => {
    await fetch('/api/tenant/branding', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const res = await fetch('/api/tenant/branding');
    setBranding((await res.json()).data);
  };

  const savePortal = async (data: Partial<PortalConfig>) => {
    await fetch('/api/tenant/portal', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const res = await fetch('/api/tenant/portal');
    setPortalConfig((await res.json()).data);
  };

  const saveLanguage = async (data: Partial<LanguageConfig>) => {
    await fetch('/api/tenant/language', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const res = await fetch('/api/tenant/language');
    setLanguageConfig((await res.json()).data);
  };

  const saveTemplate = async (data: Partial<NotificationTemplate>) => {
    if (data.id) {
      await fetch('/api/collections/notificationTemplates/' + data.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      await fetch('/api/collections/notificationTemplates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
    const res = await fetch('/api/collections/notificationTemplates');
    setTemplates((await res.json()).items ?? []);
  };

  const toggleBanner = async (id: string, status: 'active' | 'inactive') => {
    await fetch('/api/tenant/policies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    const res = await fetch('/api/tenant/policies');
    setBanners((await res.json()).data || []);
  };

  const toggleFlag = async (id: string, enabled: boolean) => {
    await fetch('/api/tenant/flags', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, enabled }),
    });
    const res = await fetch('/api/tenant/flags');
    setFlags((await res.json()).data || []);
  };

  const saveTenant = async (profileData: Partial<TenantProfile>, domainData: Partial<TenantDomain>) => {
    await fetch('/api/tenant/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    if (domains?.id) {
      await fetch('/api/collections/tenantDomains/' + domains.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(domainData),
      });
    }
    const [profRes, domRes] = await Promise.all([
      fetch('/api/tenant/profile'),
      fetch('/api/collections/tenantDomains'),
    ]);
    setProfile((await profRes.json()).data);
    setDomains((await domRes.json()).items?.[0] || null);
  };

  const saveDataPolicy = async (data: Partial<DataPolicy>) => {
    if (dataPolicy?.id) {
      await fetch('/api/collections/dataPolicies/' + dataPolicy.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      await fetch('/api/collections/dataPolicies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
    const res = await fetch('/api/collections/dataPolicies');
    setDataPolicy((await res.json()).items?.[0] || null);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label[lang]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border p-6">
        {activeTab === 'branding' && (
          <AdBrandingPanel branding={branding} onSave={saveBranding} lang={lang} />
        )}
        {activeTab === 'portal' && (
          <AdPortalPanel config={portalConfig} onSave={savePortal} lang={lang} />
        )}
        {activeTab === 'languages' && (
          <AdLanguagesPanel config={languageConfig} onSave={saveLanguage} lang={lang} />
        )}
        {activeTab === 'notifications' && (
          <AdNotificationsPanel templates={templates} onSave={saveTemplate} lang={lang} />
        )}
        {activeTab === 'policies' && (
          <AdPoliciesTable
            banners={banners}
            onToggle={toggleBanner}
            onCreate={() => router.push('/m/admin/list?tab=policies&action=create')}
            lang={lang}
          />
        )}
        {activeTab === 'flags' && (
          <AdFlagsTable
            flags={flags}
            onToggle={toggleFlag}
            onCreate={() => router.push('/m/admin/list?tab=flags&action=create')}
            lang={lang}
          />
        )}
        {activeTab === 'tenant' && (
          <AdTenantPanel profile={profile} domains={domains} onSave={saveTenant} lang={lang} />
        )}
        {activeTab === 'data' && (
          <AdDataPanel policy={dataPolicy} onSave={saveDataPolicy} lang={lang} />
        )}
      </div>
    </div>
  );
}
