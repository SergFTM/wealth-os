'use client';

/**
 * Admin Preview Frame Component
 * Live preview of branding and portal configuration
 */

import { useState } from 'react';
import { Branding, getGradientCSS } from '../schema/branding';
import { PortalConfig, portalModuleLabels } from '../schema/portalConfig';

interface AdPreviewFrameProps {
  branding: Branding | null;
  portalConfig: PortalConfig | null;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  preview: { ru: 'Предпросмотр', en: 'Preview', uk: 'Попередній перегляд' },
  asAdmin: { ru: 'Как администратор', en: 'As Admin', uk: 'Як адміністратор' },
  asClient: { ru: 'Как клиент', en: 'As Client', uk: 'Як клієнт' },
  header: { ru: 'Заголовок', en: 'Header', uk: 'Заголовок' },
  sidebar: { ru: 'Сайдбар', en: 'Sidebar', uk: 'Сайдбар' },
  content: { ru: 'Область контента', en: 'Content Area', uk: 'Область контенту' },
  noPortal: { ru: 'Портал клиента отключен', en: 'Client Portal Disabled', uk: 'Портал клієнта вимкнено' },
};

export function AdPreviewFrame({ branding, portalConfig, lang = 'ru' }: AdPreviewFrameProps) {
  const [mode, setMode] = useState<'admin' | 'client'>('admin');

  const palette = branding?.palette || {
    sage: '#9CAF88',
    gold: '#D4AF37',
    ivory: '#FFFFF0',
    gray: '#6B7280',
  };

  const gradient = getGradientCSS(branding?.gradientPreset || 'sage-to-gold', palette);
  const tenantName = branding?.tenantDisplayName || 'Wealth OS';

  const adminMenu = [
    { icon: '🏠', label: { ru: 'Домой', en: 'Home', uk: 'Домів' } },
    { icon: '💰', label: { ru: 'Капитал', en: 'Net Worth', uk: 'Капітал' } },
    { icon: '📄', label: { ru: 'Документы', en: 'Documents', uk: 'Документи' } },
    { icon: '📊', label: { ru: 'Отчеты', en: 'Reports', uk: 'Звіти' } },
    { icon: '⚙️', label: { ru: 'Настройки', en: 'Settings', uk: 'Налаштування' } },
  ];

  const clientMenu = portalConfig?.allowedModules?.map(m => ({
    icon: m === 'net-worth-summary' ? '💰' :
          m === 'documents' ? '📄' :
          m === 'communications' ? '💬' :
          m === 'reports-share' ? '📊' :
          m === 'invoices-view' ? '🧾' : '✅',
    label: portalModuleLabels[m],
  })) || [];

  const currentMenu = mode === 'admin' ? adminMenu : clientMenu;

  return (
    <div className="border rounded-xl overflow-hidden shadow-lg">
      {/* Preview Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
        <span className="text-sm font-medium">{labels.preview[lang]}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('admin')}
            className={`px-3 py-1 text-xs rounded ${
              mode === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-white'
            }`}
          >
            {labels.asAdmin[lang]}
          </button>
          <button
            onClick={() => setMode('client')}
            className={`px-3 py-1 text-xs rounded ${
              mode === 'client' ? 'bg-emerald-100 text-emerald-800' : 'bg-white'
            }`}
          >
            {labels.asClient[lang]}
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="h-64" style={{ background: gradient }}>
        <div className="flex h-full">
          {/* Mini Sidebar */}
          <div
            className="w-40 border-r"
            style={{ backgroundColor: `${palette.ivory}CC` }}
          >
            {/* Logo Area */}
            <div className="p-3 border-b">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: palette.sage }}
                />
                <span className="text-xs font-medium truncate">{tenantName}</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-1">
              {mode === 'client' && !portalConfig?.portalEnabled ? (
                <div className="text-xs text-gray-500 p-2 text-center">
                  {labels.noPortal[lang]}
                </div>
              ) : (
                currentMenu.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs ${
                      i === 0 ? 'bg-white/50' : 'hover:bg-white/30'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">
                      {'label' in item && typeof item.label === 'object' && lang in item.label
                        ? (item.label as Record<string, string>)[lang]
                        : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Main Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div
              className="h-10 border-b flex items-center px-4"
              style={{ backgroundColor: `${palette.ivory}AA` }}
            >
              {branding?.showBreadcrumbs && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Home</span>
                  <span>/</span>
                  <span style={{ color: palette.sage }}>Dashboard</span>
                </div>
              )}
            </div>

            {/* Content Placeholder */}
            <div className="flex-1 p-4">
              <div className="h-full rounded-lg border-2 border-dashed border-white/50 flex items-center justify-center">
                <span className="text-sm" style={{ color: palette.gray }}>
                  {labels.content[lang]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color Swatches */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 border-t">
        <span className="text-xs text-gray-500 mr-2">Colors:</span>
        <div className="flex gap-1">
          {Object.entries(palette).map(([name, color]) => (
            <div
              key={name}
              className="w-6 h-6 rounded border border-gray-200"
              style={{ backgroundColor: color }}
              title={`${name}: ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
