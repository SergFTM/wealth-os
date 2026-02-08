'use client';

import React, { useState } from 'react';
import { PortalPageHeader, PSettings } from '@/modules/45-portal';
import { PortalPreferences, Locale } from '@/modules/45-portal/types';

export default function SettingsPage() {
  const [locale, setLocale] = useState<Locale>('ru');

  // Demo preferences
  const preferences: PortalPreferences = {
    userId: 'pt-user-001',
    language: locale,
    emailNotifications: true,
    pushNotifications: false,
    digestFrequency: 'weekly',
  };

  const handleSave = (prefs: Partial<PortalPreferences>) => {
    console.log('Saving preferences:', prefs);
    // In production: POST to API
  };

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    // In production: also update cookie/session
  };

  return (
    <div>
      <PortalPageHeader
        title={locale === 'ru' ? 'Настройки' : locale === 'en' ? 'Settings' : 'Налаштування'}
        subtitle={locale === 'ru' ? 'Персональные настройки портала' : locale === 'en' ? 'Personal portal settings' : 'Персональні налаштування порталу'}
        breadcrumb={[
          { label: locale === 'ru' ? 'Портал' : 'Portal', href: '/p' },
          { label: locale === 'ru' ? 'Настройки' : locale === 'en' ? 'Settings' : 'Налаштування' },
        ]}
      />
      <PSettings
        preferences={preferences}
        locale={locale}
        onSave={handleSave}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}
