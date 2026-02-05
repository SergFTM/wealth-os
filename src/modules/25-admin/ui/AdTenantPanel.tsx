'use client';

/**
 * Admin Tenant Panel Component
 * Configure domains and infrastructure settings
 */

import { useState } from 'react';
import { TenantDomain, CustomDomain, IsolationMode, isolationModeLabels, domainStatusLabels, AWS_REGIONS } from '../schema/tenantDomain';
import { TenantProfile } from '../schema/tenantProfile';

interface AdTenantPanelProps {
  profile: TenantProfile | null;
  domains: TenantDomain | null;
  onSave: (profile: Partial<TenantProfile>, domains: Partial<TenantDomain>) => Promise<void>;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  tenantInfo: { ru: 'Информация о тенанте', en: 'Tenant Information', uk: 'Інформація про тенант' },
  tenantName: { ru: 'Название тенанта', en: 'Tenant Name', uk: 'Назва тенанта' },
  primaryContact: { ru: 'Контактное лицо', en: 'Primary Contact', uk: 'Контактна особа' },
  contactEmail: { ru: 'Email контакта', en: 'Contact Email', uk: 'Email контакту' },
  domains: { ru: 'Домены', en: 'Domains', uk: 'Домени' },
  dedicatedUrl: { ru: 'Выделенный URL', en: 'Dedicated URL', uk: 'Виділений URL' },
  customDomains: { ru: 'Кастомные домены', en: 'Custom Domains', uk: 'Кастомні домени' },
  addDomain: { ru: 'Добавить домен', en: 'Add Domain', uk: 'Додати домен' },
  verify: { ru: 'Проверить', en: 'Verify', uk: 'Перевірити' },
  remove: { ru: 'Удалить', en: 'Remove', uk: 'Видалити' },
  infrastructure: { ru: 'Инфраструктура', en: 'Infrastructure', uk: 'Інфраструктура' },
  region: { ru: 'Регион AWS', en: 'AWS Region', uk: 'Регіон AWS' },
  isolation: { ru: 'Режим изоляции', en: 'Isolation Mode', uk: 'Режим ізоляції' },
  save: { ru: 'Сохранить', en: 'Save', uk: 'Зберегти' },
  mvpNote: { ru: 'MVP: реальная инфраструктура не настраивается', en: 'MVP: actual infrastructure not configured', uk: 'MVP: реальна інфраструктура не налаштовується' },
};

const statusBadgeColors = {
  pending: 'bg-amber-100 text-amber-800',
  verified: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
};

export function AdTenantPanel({ profile, domains, onSave, lang = 'ru' }: AdTenantPanelProps) {
  const [tenantName, setTenantName] = useState(profile?.tenantName || '');
  const [primaryContactName, setPrimaryContactName] = useState(profile?.primaryContactName || '');
  const [primaryContactEmail, setPrimaryContactEmail] = useState(profile?.primaryContactEmail || '');
  const [dedicatedUrl, setDedicatedUrl] = useState(domains?.dedicatedUrl || '');
  const [customDomains, setCustomDomains] = useState<CustomDomain[]>(domains?.customDomains || []);
  const [awsRegion, setAwsRegion] = useState(domains?.awsRegion || 'us-east-1');
  const [isolationMode, setIsolationMode] = useState<IsolationMode>(domains?.isolationMode || 'shared');
  const [newDomain, setNewDomain] = useState('');
  const [saving, setSaving] = useState(false);

  const addDomain = () => {
    if (!newDomain.trim()) return;
    if (customDomains.some(d => d.domain === newDomain.trim())) return;
    setCustomDomains([...customDomains, {
      domain: newDomain.trim(),
      status: 'pending',
      sslEnabled: false,
    }]);
    setNewDomain('');
  };

  const removeDomain = (domain: string) => {
    setCustomDomains(prev => prev.filter(d => d.domain !== domain));
  };

  const verifyDomain = (domain: string) => {
    // Demo: simulate verification
    setCustomDomains(prev => prev.map(d =>
      d.domain === domain
        ? { ...d, status: Math.random() > 0.3 ? 'verified' : 'failed', verifiedAt: new Date().toISOString() }
        : d
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(
        { tenantName, primaryContactName, primaryContactEmail },
        { dedicatedUrl, customDomains, awsRegion, isolationMode }
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* MVP Note */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        {labels.mvpNote[lang]}
      </div>

      {/* Tenant Info */}
      <div>
        <h3 className="font-medium mb-4">{labels.tenantInfo[lang]}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">{labels.tenantName[lang]}</label>
            <input
              type="text"
              value={tenantName}
              onChange={e => setTenantName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">{labels.primaryContact[lang]}</label>
            <input
              type="text"
              value={primaryContactName}
              onChange={e => setPrimaryContactName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1">{labels.contactEmail[lang]}</label>
            <input
              type="email"
              value={primaryContactEmail}
              onChange={e => setPrimaryContactEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Domains */}
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">{labels.domains[lang]}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">{labels.dedicatedUrl[lang]}</label>
            <input
              type="text"
              value={dedicatedUrl}
              onChange={e => setDedicatedUrl(e.target.value)}
              placeholder="https://mycompany.wealthos.io"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{labels.customDomains[lang]}</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
                placeholder="portal.mycompany.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                onKeyDown={e => e.key === 'Enter' && addDomain()}
              />
              <button
                onClick={addDomain}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
              >
                {labels.addDomain[lang]}
              </button>
            </div>

            {customDomains.length > 0 && (
              <div className="space-y-2">
                {customDomains.map(d => (
                  <div key={d.domain} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm">{d.domain}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${statusBadgeColors[d.status]}`}>
                        {domainStatusLabels[d.status][lang]}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {d.status === 'pending' && (
                        <button
                          onClick={() => verifyDomain(d.domain)}
                          className="px-3 py-1 text-xs border border-emerald-500 text-emerald-600 rounded hover:bg-emerald-50"
                        >
                          {labels.verify[lang]}
                        </button>
                      )}
                      <button
                        onClick={() => removeDomain(d.domain)}
                        className="px-3 py-1 text-xs text-red-600 hover:text-red-800"
                      >
                        {labels.remove[lang]}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Infrastructure */}
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">{labels.infrastructure[lang]}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">{labels.region[lang]}</label>
            <select
              value={awsRegion}
              onChange={e => setAwsRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {AWS_REGIONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">{labels.isolation[lang]}</label>
            <select
              value={isolationMode}
              onChange={e => setIsolationMode(e.target.value as IsolationMode)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {(['shared', 'dedicated'] as IsolationMode[]).map(mode => (
                <option key={mode} value={mode}>{isolationModeLabels[mode][lang]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? '...' : labels.save[lang]}
        </button>
      </div>
    </div>
  );
}
