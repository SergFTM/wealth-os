'use client';

/**
 * Admin Data Panel Component
 * Configure data retention and privacy settings
 */

import { useState } from 'react';
import { DataPolicy, PrivacyMode, ResidencyRegion, privacyModeLabels, residencyRegionLabels, DEFAULT_DATA_POLICY } from '../schema/dataPolicy';

interface AdDataPanelProps {
  policy: DataPolicy | null;
  onSave: (policy: Partial<DataPolicy>) => Promise<void>;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  retention: { ru: 'Хранение данных', en: 'Data Retention', uk: 'Зберігання даних' },
  retentionDays: { ru: 'Срок хранения (дни)', en: 'Retention Period (days)', uk: 'Термін зберігання (дні)' },
  auditLogDays: { ru: 'Срок хранения аудит логов (дни)', en: 'Audit Log Retention (days)', uk: 'Термін зберігання аудит логів (дні)' },
  privacy: { ru: 'Приватность', en: 'Privacy', uk: 'Приватність' },
  privacyMode: { ru: 'Режим приватности', en: 'Privacy Mode', uk: 'Режим приватності' },
  residency: { ru: 'Регион хранения данных', en: 'Data Residency Region', uk: 'Регіон зберігання даних' },
  security: { ru: 'Безопасность', en: 'Security', uk: 'Безпека' },
  encryption: { ru: 'Шифрование at rest', en: 'Encryption at Rest', uk: 'Шифрування at rest' },
  piiMasking: { ru: 'Маскирование PII', en: 'PII Masking', uk: 'Маскування PII' },
  export: { ru: 'Экспорт и бэкапы', en: 'Export & Backups', uk: 'Експорт і бекапи' },
  exportAllowed: { ru: 'Разрешен экспорт данных', en: 'Data Export Allowed', uk: 'Дозволено експорт даних' },
  backupsEnabled: { ru: 'Автоматические бэкапы', en: 'Automatic Backups', uk: 'Автоматичні бекапи' },
  save: { ru: 'Сохранить политики данных', en: 'Save Data Policies', uk: 'Зберегти політики даних' },
  years: { ru: 'лет', en: 'years', uk: 'років' },
  complianceNote: { ru: 'Рекомендуется минимум 7 лет для соответствия требованиям регуляторов', en: 'Minimum 7 years recommended for regulatory compliance', uk: 'Рекомендовано мінімум 7 років для відповідності вимогам регуляторів' },
};

export function AdDataPanel({ policy, onSave, lang = 'ru' }: AdDataPanelProps) {
  const [retentionDays, setRetentionDays] = useState(policy?.retentionDays ?? DEFAULT_DATA_POLICY.retentionDays!);
  const [auditLogRetentionDays, setAuditLogRetentionDays] = useState(policy?.auditLogRetentionDays ?? DEFAULT_DATA_POLICY.auditLogRetentionDays!);
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>(policy?.privacyMode ?? 'standard');
  const [residencyRegion, setResidencyRegion] = useState<ResidencyRegion>(policy?.residencyRegion ?? 'us');
  const [encryptionAtRest, setEncryptionAtRest] = useState(policy?.encryptionAtRest ?? true);
  const [piiMaskingEnabled, setPiiMaskingEnabled] = useState(policy?.piiMaskingEnabled ?? false);
  const [exportAllowed, setExportAllowed] = useState(policy?.exportAllowed ?? true);
  const [backupsEnabled, setBackupsEnabled] = useState(policy?.backupsEnabled ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        retentionDays,
        auditLogRetentionDays,
        privacyMode,
        residencyRegion,
        encryptionAtRest,
        piiMaskingEnabled,
        exportAllowed,
        backupsEnabled,
      });
    } finally {
      setSaving(false);
    }
  };

  const retentionYears = (retentionDays / 365).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Retention Settings */}
      <div>
        <h3 className="font-medium mb-4">{labels.retention[lang]}</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">{labels.retentionDays[lang]}</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={retentionDays}
                onChange={e => setRetentionDays(parseInt(e.target.value) || 0)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                min={30}
                max={10000}
              />
              <span className="text-sm text-gray-500">
                ({retentionYears} {labels.years[lang]})
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{labels.complianceNote[lang]}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">{labels.auditLogDays[lang]}</label>
            <input
              type="number"
              value={auditLogRetentionDays}
              onChange={e => setAuditLogRetentionDays(parseInt(e.target.value) || 0)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
              min={30}
              max={3650}
            />
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">{labels.privacy[lang]}</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">{labels.privacyMode[lang]}</label>
            <select
              value={privacyMode}
              onChange={e => setPrivacyMode(e.target.value as PrivacyMode)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {(['standard', 'strict', 'minimal'] as PrivacyMode[]).map(mode => (
                <option key={mode} value={mode}>{privacyModeLabels[mode][lang]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">{labels.residency[lang]}</label>
            <select
              value={residencyRegion}
              onChange={e => setResidencyRegion(e.target.value as ResidencyRegion)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {(['us', 'eu', 'apac', 'global'] as ResidencyRegion[]).map(region => (
                <option key={region} value={region}>{residencyRegionLabels[region][lang]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">{labels.security[lang]}</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={encryptionAtRest}
              onChange={e => setEncryptionAtRest(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span className="text-sm">{labels.encryption[lang]}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={piiMaskingEnabled}
              onChange={e => setPiiMaskingEnabled(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span className="text-sm">{labels.piiMasking[lang]}</span>
          </label>
        </div>
      </div>

      {/* Export & Backups */}
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">{labels.export[lang]}</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={exportAllowed}
              onChange={e => setExportAllowed(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span className="text-sm">{labels.exportAllowed[lang]}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={backupsEnabled}
              onChange={e => setBackupsEnabled(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span className="text-sm">{labels.backupsEnabled[lang]}</span>
          </label>
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
