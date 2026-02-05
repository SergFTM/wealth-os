"use client";

import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface SecuritySettings {
  id: string;
  awsRegion: string;
  dedicatedUrl: string;
  tenantIsolationMode: string;
  dataRetentionDays: number;
  mfaRequired: boolean;
  sessionTimeoutMinutes: number;
  ipWhitelistEnabled: boolean;
  ipWhitelist: string[];
}

interface ScSettingsPanelProps {
  settings: SecuritySettings;
  onSave?: (settings: Partial<SecuritySettings>) => void;
}

export function ScSettingsPanel({ settings, onSave }: ScSettingsPanelProps) {
  const { locale } = useApp();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tenant Meta */}
      <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
        <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-4">
          {locale === "ru" ? "Настройки тенанта" : "Tenant Settings"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              {locale === "ru" ? "Регион AWS" : "AWS Region"}
            </label>
            <select
              value={formData.awsRegion}
              onChange={(e) => setFormData({ ...formData, awsRegion: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="eu-central-1">EU Central (Frankfurt)</option>
              <option value="eu-west-1">EU West (Ireland)</option>
              <option value="us-east-1">US East (Virginia)</option>
              <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              {locale === "ru" ? "Выделенный URL" : "Dedicated URL"}
            </label>
            <input
              type="text"
              value={formData.dedicatedUrl}
              onChange={(e) => setFormData({ ...formData, dedicatedUrl: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="client.wealthos.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              {locale === "ru" ? "Изоляция тенанта" : "Tenant Isolation"}
            </label>
            <select
              value={formData.tenantIsolationMode}
              onChange={(e) => setFormData({ ...formData, tenantIsolationMode: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="shared">{locale === "ru" ? "Общая инфраструктура" : "Shared Infrastructure"}</option>
              <option value="dedicated">{locale === "ru" ? "Выделенная инфраструктура" : "Dedicated Infrastructure"}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              {locale === "ru" ? "Срок хранения данных (дни)" : "Data Retention (days)"}
            </label>
            <input
              type="number"
              value={formData.dataRetentionDays}
              onChange={(e) => setFormData({ ...formData, dataRetentionDays: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>
      </div>

      {/* Security Policies */}
      <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
        <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-4">
          {locale === "ru" ? "Политики безопасности" : "Security Policies"}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-stone-800 dark:text-stone-200">
                {locale === "ru" ? "Обязательный MFA" : "Require MFA"}
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                {locale === "ru" ? "Все пользователи должны настроить MFA" : "All users must configure MFA"}
              </div>
            </div>
            <button
              onClick={() => setFormData({ ...formData, mfaRequired: !formData.mfaRequired })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.mfaRequired ? "bg-emerald-500" : "bg-stone-300 dark:bg-stone-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.mfaRequired ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              {locale === "ru" ? "Таймаут сессии (минуты)" : "Session Timeout (minutes)"}
            </label>
            <input
              type="number"
              value={formData.sessionTimeoutMinutes}
              onChange={(e) => setFormData({ ...formData, sessionTimeoutMinutes: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 max-w-xs"
            />
          </div>
        </div>
      </div>

      {/* SSO Placeholder */}
      <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
        <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-4">
          {locale === "ru" ? "Single Sign-On (SSO)" : "Single Sign-On (SSO)"}
        </h3>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            {locale === "ru"
              ? "SSO интеграция (SAML, OIDC, Active Directory) доступна в production версии. Свяжитесь с поддержкой для настройки."
              : "SSO integration (SAML, OIDC, Active Directory) available in production. Contact support for setup."}
          </p>
        </div>
      </div>

      {/* Password Policy Placeholder */}
      <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
        <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-4">
          {locale === "ru" ? "Политика паролей" : "Password Policy"}
        </h3>
        <div className="bg-stone-50 dark:bg-stone-900/50 rounded-lg p-4 text-sm text-stone-600 dark:text-stone-400">
          <ul className="space-y-1">
            <li>• {locale === "ru" ? "Минимум 12 символов" : "Minimum 12 characters"}</li>
            <li>• {locale === "ru" ? "Заглавные и строчные буквы" : "Uppercase and lowercase letters"}</li>
            <li>• {locale === "ru" ? "Цифры и специальные символы" : "Numbers and special characters"}</li>
            <li>• {locale === "ru" ? "Смена пароля каждые 90 дней" : "Password change every 90 days"}</li>
            <li>• {locale === "ru" ? "История: последние 12 паролей" : "History: last 12 passwords"}</li>
          </ul>
        </div>
      </div>

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving
              ? locale === "ru" ? "Сохранение..." : "Saving..."
              : locale === "ru" ? "Сохранить настройки" : "Save Settings"}
          </Button>
        </div>
      )}
    </div>
  );
}
