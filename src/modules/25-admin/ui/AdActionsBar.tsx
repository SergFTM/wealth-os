'use client';

/**
 * Admin Actions Bar Component
 * Dashboard action buttons
 */

interface AdActionsBarProps {
  onSaveBranding: () => void;
  onAddPolicyBanner: () => void;
  onCreateFlag: () => void;
  onAddDomain: () => void;
  onResetDefaults: () => void;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  saveBranding: { ru: 'Сохранить брендинг', en: 'Save Branding', uk: 'Зберегти брендинг' },
  addBanner: { ru: 'Добавить баннер', en: 'Add Banner', uk: 'Додати банер' },
  createFlag: { ru: 'Создать флаг', en: 'Create Flag', uk: 'Створити флаг' },
  addDomain: { ru: 'Добавить домен', en: 'Add Domain', uk: 'Додати домен' },
  reset: { ru: 'Сбросить к дефолту', en: 'Reset to Defaults', uk: 'Скинути до дефолту' },
};

export function AdActionsBar({
  onSaveBranding,
  onAddPolicyBanner,
  onCreateFlag,
  onAddDomain,
  onResetDefaults,
  lang = 'ru',
}: AdActionsBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={onSaveBranding}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
      >
        {labels.saveBranding[lang]}
      </button>
      <button
        onClick={onAddPolicyBanner}
        className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-sm"
      >
        {labels.addBanner[lang]}
      </button>
      <button
        onClick={onCreateFlag}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
      >
        {labels.createFlag[lang]}
      </button>
      <button
        onClick={onAddDomain}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
      >
        {labels.addDomain[lang]}
      </button>
      <button
        onClick={onResetDefaults}
        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
      >
        {labels.reset[lang]}
      </button>
    </div>
  );
}
