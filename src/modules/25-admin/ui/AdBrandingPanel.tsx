'use client';

/**
 * Admin Branding Panel Component
 * Configure tenant branding settings
 */

import { useState } from 'react';
import { Branding, BrandingPalette, GradientPreset, DensityMode, DEFAULT_PALETTE, gradientPresetLabels, densityLabels } from '../schema/branding';

interface AdBrandingPanelProps {
  branding: Branding | null;
  onSave: (branding: Partial<Branding>) => Promise<void>;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  tenantName: { ru: 'Название тенанта', en: 'Tenant Name', uk: 'Назва тенанта' },
  logo: { ru: 'Логотип', en: 'Logo', uk: 'Логотип' },
  uploadLogo: { ru: 'Загрузить логотип', en: 'Upload Logo', uk: 'Завантажити логотип' },
  palette: { ru: 'Цветовая палитра', en: 'Color Palette', uk: 'Кольорова палітра' },
  sage: { ru: 'Шалфей (Sage)', en: 'Sage', uk: 'Шавлія (Sage)' },
  gold: { ru: 'Золото (Gold)', en: 'Gold', uk: 'Золото (Gold)' },
  ivory: { ru: 'Слоновая кость', en: 'Ivory', uk: 'Слонова кістка' },
  gray: { ru: 'Серый', en: 'Gray', uk: 'Сірий' },
  gradient: { ru: 'Градиент', en: 'Gradient Preset', uk: 'Градієнт' },
  density: { ru: 'Плотность', en: 'Density', uk: 'Щільність' },
  stickyHeader: { ru: 'Фиксированный заголовок', en: 'Sticky Header', uk: 'Фіксований заголовок' },
  stickyColumn: { ru: 'Фиксированный первый столбец', en: 'Sticky First Column', uk: 'Фіксована перша колонка' },
  breadcrumbs: { ru: 'Показывать хлебные крошки', en: 'Show Breadcrumbs', uk: 'Показувати хлібні крихти' },
  save: { ru: 'Сохранить брендинг', en: 'Save Branding', uk: 'Зберегти брендинг' },
  reset: { ru: 'Сбросить', en: 'Reset', uk: 'Скинути' },
};

export function AdBrandingPanel({ branding, onSave, lang = 'ru' }: AdBrandingPanelProps) {
  const [tenantDisplayName, setTenantDisplayName] = useState(branding?.tenantDisplayName || '');
  const [palette, setPalette] = useState<BrandingPalette>(branding?.palette || DEFAULT_PALETTE);
  const [gradientPreset, setGradientPreset] = useState<GradientPreset>(branding?.gradientPreset || 'sage-to-gold');
  const [density, setDensity] = useState<DensityMode>(branding?.density || 'comfortable');
  const [stickyHeader, setStickyHeader] = useState(branding?.stickyHeader ?? true);
  const [stickyFirstColumn, setStickyFirstColumn] = useState(branding?.stickyFirstColumn ?? true);
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(branding?.showBreadcrumbs ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        tenantDisplayName,
        palette,
        gradientPreset,
        density,
        stickyHeader,
        stickyFirstColumn,
        showBreadcrumbs,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setTenantDisplayName('');
    setPalette(DEFAULT_PALETTE);
    setGradientPreset('sage-to-gold');
    setDensity('comfortable');
    setStickyHeader(true);
    setStickyFirstColumn(true);
    setShowBreadcrumbs(true);
  };

  return (
    <div className="space-y-6">
      {/* Tenant Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {labels.tenantName[lang]}
        </label>
        <input
          type="text"
          value={tenantDisplayName}
          onChange={e => setTenantDisplayName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Wealth OS"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {labels.logo[lang]}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer">
          <div className="text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">{labels.uploadLogo[lang]}</span>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {labels.palette[lang]}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['sage', 'gold', 'ivory', 'gray'] as const).map(colorKey => (
            <div key={colorKey}>
              <label className="block text-xs text-gray-600 mb-1">
                {labels[colorKey][lang]}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={palette[colorKey]}
                  onChange={e => setPalette({ ...palette, [colorKey]: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-200"
                />
                <input
                  type="text"
                  value={palette[colorKey]}
                  onChange={e => setPalette({ ...palette, [colorKey]: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Preset */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {labels.gradient[lang]}
        </label>
        <select
          value={gradientPreset}
          onChange={e => setGradientPreset(e.target.value as GradientPreset)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
        >
          {(Object.keys(gradientPresetLabels) as GradientPreset[]).map(preset => (
            <option key={preset} value={preset}>
              {gradientPresetLabels[preset][lang]}
            </option>
          ))}
        </select>
      </div>

      {/* Density */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {labels.density[lang]}
        </label>
        <div className="flex gap-4">
          {(Object.keys(densityLabels) as DensityMode[]).map(mode => (
            <label key={mode} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="density"
                value={mode}
                checked={density === mode}
                onChange={() => setDensity(mode)}
                className="text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm">{densityLabels[mode][lang]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Toggle Options */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={stickyHeader}
            onChange={e => setStickyHeader(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <span className="text-sm">{labels.stickyHeader[lang]}</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={stickyFirstColumn}
            onChange={e => setStickyFirstColumn(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <span className="text-sm">{labels.stickyColumn[lang]}</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showBreadcrumbs}
            onChange={e => setShowBreadcrumbs(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <span className="text-sm">{labels.breadcrumbs[lang]}</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {saving ? '...' : labels.save[lang]}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {labels.reset[lang]}
        </button>
      </div>
    </div>
  );
}
