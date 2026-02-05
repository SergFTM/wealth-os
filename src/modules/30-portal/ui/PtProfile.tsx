'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { PtPreferencesPanel } from './PtPreferencesPanel';

const labels = {
  title: { ru: 'Профиль', en: 'Profile', uk: 'Профіль' },
  subtitle: { ru: 'Настройки и безопасность', en: 'Settings and security', uk: 'Налаштування та безпека' },
  personalInfo: { ru: 'Личная информация', en: 'Personal Information', uk: 'Особиста інформація' },
  name: { ru: 'Имя', en: 'Name', uk: 'Ім\'я' },
  email: { ru: 'Email', en: 'Email', uk: 'Email' },
  role: { ru: 'Роль', en: 'Role', uk: 'Роль' },
  household: { ru: 'Household', en: 'Household', uk: 'Household' },
  security: { ru: 'Безопасность', en: 'Security', uk: 'Безпека' },
  mfaStatus: { ru: 'Статус MFA', en: 'MFA Status', uk: 'Статус MFA' },
  mfaEnabled: { ru: 'Включен', en: 'Enabled', uk: 'Увімкнено' },
  mfaDisabled: { ru: 'Отключен', en: 'Disabled', uk: 'Вимкнено' },
  sessions: { ru: 'Активные сессии', en: 'Active Sessions', uk: 'Активні сесії' },
  currentSession: { ru: 'Текущая сессия', en: 'Current Session', uk: 'Поточна сесія' },
  revokeSession: { ru: 'Отозвать', en: 'Revoke', uk: 'Відкликати' },
  revokeAll: { ru: 'Отозвать все другие сессии', en: 'Revoke All Other Sessions', uk: 'Відкликати всі інші сесії' },
  permissions: { ru: 'Права доступа', en: 'Permissions', uk: 'Права доступу' },
  permissionsDesc: { ru: 'Вы имеете доступ к следующим модулям:', en: 'You have access to the following modules:', uk: 'Ви маєте доступ до наступних модулів:' },
  preferences: { ru: 'Предпочтения', en: 'Preferences', uk: 'Налаштування' },
  lastLogin: { ru: 'Последний вход', en: 'Last Login', uk: 'Останній вхід' },
  ipAddress: { ru: 'IP-адрес', en: 'IP Address', uk: 'IP-адреса' },
  device: { ru: 'Устройство', en: 'Device', uk: 'Пристрій' },
};

interface Session {
  id: string;
  device: string;
  ipAddress: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export function PtProfile() {
  const { locale, user } = useApp();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/collections/sessions').then(r => r.json()),
      fetch('/api/collections/mfaEnrollments').then(r => r.json()),
    ]).then(([sessionsData, mfaData]) => {
      setSessions(sessionsData?.slice(0, 5).map((s: Session, i: number) => ({
        ...s,
        isCurrent: i === 0,
        device: s.device || (i === 0 ? 'Chrome / Windows' : 'Safari / macOS'),
        ipAddress: s.ipAddress || '192.168.1.' + (i + 100),
        lastActiveAt: s.lastActiveAt || new Date(Date.now() - i * 3600000).toISOString(),
      })) || []);
      setMfaEnabled((mfaData || []).some((m: { status: string }) => m.status === 'active'));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleRevokeSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleRevokeAll = () => {
    setSessions(prev => prev.filter(s => s.isCurrent));
  };

  const accessibleModules = [
    { ru: 'Капитал (обзор)', en: 'Net Worth (overview)', uk: 'Капітал (огляд)' },
    { ru: 'Отчеты (опубликованные)', en: 'Reports (published)', uk: 'Звіти (опубліковані)' },
    { ru: 'Документы (разрешенные)', en: 'Documents (permitted)', uk: 'Документи (дозволені)' },
    { ru: 'Счета (read-only)', en: 'Invoices (read-only)', uk: 'Рахунки (read-only)' },
    { ru: 'Запросы', en: 'Requests', uk: 'Запити' },
    { ru: 'Сообщения', en: 'Messages', uk: 'Повідомлення' },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">{labels.title[locale]}</h1>
        <p className="text-sm text-stone-500 mt-1">{labels.subtitle[locale]}</p>
      </div>

      {/* Personal Info */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">{labels.personalInfo[locale]}</h2>
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-400 flex items-center justify-center text-white text-2xl font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-stone-500">{labels.name[locale]}</div>
              <div className="font-medium text-stone-800 mt-1">{user?.name || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-stone-500">{labels.email[locale]}</div>
              <div className="font-medium text-stone-800 mt-1">client@example.com</div>
            </div>
            <div>
              <div className="text-sm text-stone-500">{labels.role[locale]}</div>
              <div className="font-medium text-stone-800 mt-1 capitalize">{user?.role || 'client'}</div>
            </div>
            <div>
              <div className="text-sm text-stone-500">{labels.household[locale]}</div>
              <div className="font-medium text-stone-800 mt-1">Семья Иванова</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">{labels.security[locale]}</h2>

        {/* MFA Status */}
        <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mfaEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-stone-800">{labels.mfaStatus[locale]}</div>
              <div className={`text-sm ${mfaEnabled ? 'text-emerald-600' : 'text-stone-500'}`}>
                {mfaEnabled ? labels.mfaEnabled[locale] : labels.mfaDisabled[locale]}
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-colors">
            {locale === 'ru' ? 'Настроить' : 'Configure'}
          </button>
        </div>

        {/* Sessions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-stone-800">{labels.sessions[locale]}</h3>
            {sessions.length > 1 && (
              <button
                onClick={handleRevokeAll}
                className="text-sm text-rose-600 hover:text-rose-700"
              >
                {labels.revokeAll[locale]}
              </button>
            )}
          </div>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${session.isCurrent ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <div>
                    <div className="text-sm font-medium text-stone-800">
                      {session.device}
                      {session.isCurrent && (
                        <span className="ml-2 text-xs text-emerald-600">({labels.currentSession[locale]})</span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500">
                      {session.ipAddress} • {new Date(session.lastActiveAt).toLocaleString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
                    </div>
                  </div>
                </div>
                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="text-sm text-rose-600 hover:text-rose-700"
                  >
                    {labels.revokeSession[locale]}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-2">{labels.permissions[locale]}</h2>
        <p className="text-sm text-stone-500 mb-4">{labels.permissionsDesc[locale]}</p>
        <div className="flex flex-wrap gap-2">
          {accessibleModules.map((mod, i) => (
            <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
              {mod[locale]}
            </span>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">{labels.preferences[locale]}</h2>
        <PtPreferencesPanel />
      </div>
    </div>
  );
}
