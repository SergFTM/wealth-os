'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

interface UserNotificationPrefs {
  id: string;
  userId: string;
  userName: string;
  globalEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
  channelPrefs: {
    inbox?: { enabled: boolean };
    email?: { enabled: boolean; address?: string };
    sms?: { enabled: boolean; phone?: string; urgentOnly?: boolean };
    push?: { enabled: boolean };
    slack?: { enabled: boolean };
    teams?: { enabled: boolean };
  };
  digestPrefs: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly';
    sendTime?: string;
  };
}

interface NtPreferencesPanelProps {
  preferences?: UserNotificationPrefs;
}

export function NtPreferencesPanel({ preferences }: NtPreferencesPanelProps) {
  const t = useTranslation();
  const [prefs, setPrefs] = useState<Partial<UserNotificationPrefs>>(preferences || {
    globalEnabled: true,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    channelPrefs: {
      inbox: { enabled: true },
      email: { enabled: true },
      push: { enabled: true },
      sms: { enabled: false, urgentOnly: true },
      slack: { enabled: false },
      teams: { enabled: false },
    },
    digestPrefs: {
      enabled: true,
      frequency: 'daily',
      sendTime: '08:00',
    },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (preferences) {
      setPrefs(preferences);
    }
  }, [preferences]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (preferences?.id) {
        await fetch(`/api/collections/userNotificationPrefs/${preferences.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prefs),
        });
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateChannelPref = (channel: string, key: string, value: unknown) => {
    setPrefs(prev => ({
      ...prev,
      channelPrefs: {
        ...prev.channelPrefs,
        [channel]: {
          ...(prev.channelPrefs as Record<string, Record<string, unknown>>)?.[channel],
          [key]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-4">
          {t('globalSettings', { ru: 'Общие настройки', en: 'Global Settings', uk: 'Загальні налаштування' })}
        </h3>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={prefs.globalEnabled}
              onChange={(e) => setPrefs(prev => ({ ...prev, globalEnabled: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-gray-700">
              {t('enableNotifications', { ru: 'Включить уведомления', en: 'Enable notifications', uk: 'Увімкнути сповіщення' })}
            </span>
          </label>

          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={prefs.quietHoursEnabled}
                onChange={(e) => setPrefs(prev => ({ ...prev, quietHoursEnabled: e.target.checked }))}
                className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-gray-700">
                {t('quietHours', { ru: 'Тихие часы', en: 'Quiet Hours', uk: 'Тихі години' })}
              </span>
            </label>

            {prefs.quietHoursEnabled && (
              <div className="mt-3 flex items-center gap-2 ml-8">
                <input
                  type="time"
                  value={prefs.quietHoursStart || '22:00'}
                  onChange={(e) => setPrefs(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-gray-500">—</span>
                <input
                  type="time"
                  value={prefs.quietHoursEnd || '07:00'}
                  onChange={(e) => setPrefs(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Channel Preferences */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-4">
          {t('channelPreferences', { ru: 'Настройки каналов', en: 'Channel Preferences', uk: 'Налаштування каналів' })}
        </h3>

        <div className="space-y-3">
          {[
            { key: 'inbox', label: { ru: 'Входящие', en: 'Inbox', uk: 'Вхідні' }, icon: '📥' },
            { key: 'email', label: { ru: 'Email', en: 'Email', uk: 'Email' }, icon: '✉️' },
            { key: 'push', label: { ru: 'Push-уведомления', en: 'Push notifications', uk: 'Push-сповіщення' }, icon: '🔔' },
            { key: 'sms', label: { ru: 'SMS', en: 'SMS', uk: 'SMS' }, icon: '📱' },
            { key: 'slack', label: { ru: 'Slack', en: 'Slack', uk: 'Slack' }, icon: '💬' },
            { key: 'teams', label: { ru: 'Teams', en: 'Teams', uk: 'Teams' }, icon: '👥' },
          ].map((channel) => (
            <div key={channel.key} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={(prefs.channelPrefs as Record<string, { enabled?: boolean }>)?.[channel.key]?.enabled || false}
                  onChange={(e) => updateChannelPref(channel.key, 'enabled', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xl">{channel.icon}</span>
                <span className="text-gray-700">{channel.label.ru}</span>
              </label>

              {channel.key === 'sms' && (prefs.channelPrefs as Record<string, { enabled?: boolean }>)?.[channel.key]?.enabled && (
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={(prefs.channelPrefs as Record<string, { urgentOnly?: boolean }>)?.[channel.key]?.urgentOnly || false}
                    onChange={(e) => updateChannelPref(channel.key, 'urgentOnly', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  {t('urgentOnly', { ru: 'Только срочные', en: 'Urgent only', uk: 'Тільки термінові' })}
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Digest Preferences */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-4">
          {t('digestPreferences', { ru: 'Настройки дайджеста', en: 'Digest Preferences', uk: 'Налаштування дайджесту' })}
        </h3>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={prefs.digestPrefs?.enabled}
              onChange={(e) => setPrefs(prev => ({
                ...prev,
                digestPrefs: { ...prev.digestPrefs, enabled: e.target.checked } as UserNotificationPrefs['digestPrefs'],
              }))}
              className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-gray-700">
              {t('enableDigest', { ru: 'Получать дайджест', en: 'Receive digest', uk: 'Отримувати дайджест' })}
            </span>
          </label>

          {prefs.digestPrefs?.enabled && (
            <div className="ml-8 space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t('frequency', { ru: 'Частота', en: 'Frequency', uk: 'Частота' })}
                </label>
                <select
                  value={prefs.digestPrefs.frequency}
                  onChange={(e) => setPrefs(prev => ({
                    ...prev,
                    digestPrefs: { ...prev.digestPrefs, frequency: e.target.value as 'hourly' | 'daily' | 'weekly' } as UserNotificationPrefs['digestPrefs'],
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="hourly">{t('hourly', { ru: 'Ежечасно', en: 'Hourly', uk: 'Щогодини' })}</option>
                  <option value="daily">{t('daily', { ru: 'Ежедневно', en: 'Daily', uk: 'Щодня' })}</option>
                  <option value="weekly">{t('weekly', { ru: 'Еженедельно', en: 'Weekly', uk: 'Щотижня' })}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t('sendTime', { ru: 'Время отправки', en: 'Send time', uk: 'Час відправлення' })}
                </label>
                <input
                  type="time"
                  value={prefs.digestPrefs.sendTime || '08:00'}
                  onChange={(e) => setPrefs(prev => ({
                    ...prev,
                    digestPrefs: { ...prev.digestPrefs, sendTime: e.target.value } as UserNotificationPrefs['digestPrefs'],
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg shadow-sm transition-all disabled:opacity-50"
        >
          {saving
            ? t('saving', { ru: 'Сохранение...', en: 'Saving...', uk: 'Збереження...' })
            : t('savePreferences', { ru: 'Сохранить настройки', en: 'Save Preferences', uk: 'Зберегти налаштування' })
          }
        </button>
      </div>
    </div>
  );
}
