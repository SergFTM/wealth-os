'use client';

import { useApp } from '@/lib/store';
import { getManifestPreview, getCompatibilityChecklist, getInstallInstructions } from '../engine';
import { MbStatusPill } from './MbStatusPill';

const labels = {
  title: { ru: 'PWA Конфигурация', en: 'PWA Configuration', uk: 'PWA Конфігурація' },
  manifest: { ru: 'Manifest Preview', en: 'Manifest Preview', uk: 'Manifest Preview' },
  icons: { ru: 'Иконки', en: 'Icons', uk: 'Іконки' },
  compatibility: { ru: 'Совместимость', en: 'Compatibility', uk: 'Сумісність' },
  installGuide: { ru: 'Инструкция по установке', en: 'Install Guide', uk: 'Інструкція з встановлення' },
  ios: { ru: 'iOS (Safari)', en: 'iOS (Safari)', uk: 'iOS (Safari)' },
  android: { ru: 'Android (Chrome)', en: 'Android (Chrome)', uk: 'Android (Chrome)' },
  desktop: { ru: 'Desktop', en: 'Desktop', uk: 'Desktop' },
  openOffline: { ru: 'Открыть offline страницу', en: 'Open offline page', uk: 'Відкрити offline сторінку' },
  regenerate: { ru: 'Regenerate manifest (demo)', en: 'Regenerate manifest (demo)', uk: 'Regenerate manifest (demo)' },
};

export function MbPwaPanel() {
  const { locale } = useApp();
  const manifest = getManifestPreview();
  const compatibility = getCompatibilityChecklist();
  const instructions = getInstallInstructions(locale);

  return (
    <div className="space-y-6">
      {/* Manifest Preview */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h3 className="font-semibold text-stone-800 mb-4">{labels.manifest[locale]}</h3>
        <div className="bg-stone-50 rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-stone-600">
            {JSON.stringify(manifest, null, 2)}
          </pre>
        </div>
      </div>

      {/* Icons Preview */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h3 className="font-semibold text-stone-800 mb-4">{labels.icons[locale]}</h3>
        <div className="flex gap-4">
          {manifest.icons.map((icon) => (
            <div key={icon.sizes} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-2">
                W
              </div>
              <span className="text-xs text-stone-500">{icon.sizes}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compatibility Checklist */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h3 className="font-semibold text-stone-800 mb-4">{labels.compatibility[locale]}</h3>
        <div className="space-y-3">
          {compatibility.map((check) => (
            <div key={check.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  check.status === 'ok' ? 'bg-emerald-100 text-emerald-600' :
                  check.status === 'warning' ? 'bg-amber-100 text-amber-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {check.status === 'ok' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : check.status === 'warning' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm text-stone-800">{check.label[locale]}</div>
                  <div className="text-xs text-stone-500">{check.message[locale]}</div>
                </div>
              </div>
              <MbStatusPill status={check.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Install Instructions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h3 className="font-semibold text-stone-800 mb-4">{labels.installGuide[locale]}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* iOS */}
          <div className="p-4 rounded-xl bg-stone-50">
            <h4 className="font-medium text-stone-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              {labels.ios[locale]}
            </h4>
            <ol className="space-y-2 text-sm text-stone-600">
              {instructions.ios.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-500 font-medium">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Android */}
          <div className="p-4 rounded-xl bg-stone-50">
            <h4 className="font-medium text-stone-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.463 11.463 0 00-8.92 0L5.66 5.67c-.18-.28-.53-.38-.83-.22-.31.16-.43.54-.27.85L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"/>
              </svg>
              {labels.android[locale]}
            </h4>
            <ol className="space-y-2 text-sm text-stone-600">
              {instructions.android.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-500 font-medium">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Desktop */}
          <div className="p-4 rounded-xl bg-stone-50">
            <h4 className="font-medium text-stone-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {labels.desktop[locale]}
            </h4>
            <ol className="space-y-2 text-sm text-stone-600">
              {instructions.desktop.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-500 font-medium">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <a
          href="/offline"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-emerald-200 text-emerald-700 rounded-xl font-medium text-sm hover:bg-emerald-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {labels.openOffline[locale]}
        </a>
      </div>
    </div>
  );
}
