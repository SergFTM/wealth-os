/**
 * PWA Manifest utilities for Mobile module
 */

export interface ManifestData {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  background_color: string;
  theme_color: string;
  icons: { src: string; sizes: string; type: string; purpose?: string }[];
}

export function getManifestPreview(): ManifestData {
  return {
    name: 'Wealth OS',
    short_name: 'WealthOS',
    description: 'Family Office Management Platform',
    start_url: '/portal',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#10B981',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  };
}

export interface CompatibilityCheck {
  id: string;
  label: { ru: string; en: string; uk: string };
  status: 'ok' | 'warning' | 'info';
  message: { ru: string; en: string; uk: string };
}

export function getCompatibilityChecklist(): CompatibilityCheck[] {
  return [
    {
      id: 'https',
      label: { ru: 'HTTPS', en: 'HTTPS', uk: 'HTTPS' },
      status: 'info',
      message: {
        ru: 'PWA требует HTTPS в production',
        en: 'PWA requires HTTPS in production',
        uk: 'PWA потребує HTTPS в production',
      },
    },
    {
      id: 'manifest',
      label: { ru: 'Manifest', en: 'Manifest', uk: 'Manifest' },
      status: 'ok',
      message: {
        ru: 'manifest.webmanifest настроен',
        en: 'manifest.webmanifest configured',
        uk: 'manifest.webmanifest налаштовано',
      },
    },
    {
      id: 'offline',
      label: { ru: 'Offline страница', en: 'Offline page', uk: 'Offline сторінка' },
      status: 'ok',
      message: {
        ru: '/offline доступна',
        en: '/offline available',
        uk: '/offline доступна',
      },
    },
    {
      id: 'icons',
      label: { ru: 'Иконки', en: 'Icons', uk: 'Іконки' },
      status: 'ok',
      message: {
        ru: '192x192, 512x512 настроены',
        en: '192x192, 512x512 configured',
        uk: '192x192, 512x512 налаштовано',
      },
    },
    {
      id: 'serviceWorker',
      label: { ru: 'Service Worker', en: 'Service Worker', uk: 'Service Worker' },
      status: 'warning',
      message: {
        ru: 'MVP: не реализован, требуется для production',
        en: 'MVP: not implemented, required for production',
        uk: 'MVP: не реалізовано, потрібно для production',
      },
    },
  ];
}

export function getInstallInstructions(locale: 'ru' | 'en' | 'uk' = 'ru') {
  const instructions = {
    ru: {
      ios: [
        'Откройте Wealth OS в Safari',
        'Нажмите кнопку "Поделиться"',
        'Выберите "На экран Домой"',
        'Нажмите "Добавить"',
      ],
      android: [
        'Откройте Wealth OS в Chrome',
        'Нажмите меню (три точки)',
        'Выберите "Установить приложение"',
        'Подтвердите установку',
      ],
      desktop: [
        'Откройте Wealth OS в Chrome/Edge',
        'Нажмите иконку установки в адресной строке',
        'Или: Меню → "Установить Wealth OS"',
      ],
    },
    en: {
      ios: [
        'Open Wealth OS in Safari',
        'Tap the Share button',
        'Select "Add to Home Screen"',
        'Tap "Add"',
      ],
      android: [
        'Open Wealth OS in Chrome',
        'Tap menu (three dots)',
        'Select "Install app"',
        'Confirm installation',
      ],
      desktop: [
        'Open Wealth OS in Chrome/Edge',
        'Click install icon in address bar',
        'Or: Menu → "Install Wealth OS"',
      ],
    },
    uk: {
      ios: [
        'Відкрийте Wealth OS у Safari',
        'Натисніть кнопку "Поділитися"',
        'Виберіть "На екран Домому"',
        'Натисніть "Додати"',
      ],
      android: [
        'Відкрийте Wealth OS у Chrome',
        'Натисніть меню (три крапки)',
        'Виберіть "Встановити додаток"',
        'Підтвердіть встановлення',
      ],
      desktop: [
        'Відкрийте Wealth OS у Chrome/Edge',
        'Натисніть іконку встановлення в адресному рядку',
        'Або: Меню → "Встановити Wealth OS"',
      ],
    },
  };
  return instructions[locale];
}
