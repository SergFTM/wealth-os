"use client";

interface ScopeData {
  scopeType: string;
  scopeId?: string;
  scopeName?: string;
  periodStart: string;
  periodEnd: string;
  periodLabel?: string;
  clientSafe: boolean;
}

interface PaWizardStepScopeProps {
  data: ScopeData;
  errors: Record<string, string>;
  onChange: (data: Partial<ScopeData>) => void;
}

const SCOPE_TYPES = [
  { key: 'household', label: 'Household', icon: '🏠', description: 'Вся семья/клиент целиком' },
  { key: 'entity', label: 'Юридическое лицо', icon: '🏢', description: 'Конкретная структура' },
  { key: 'portfolio', label: 'Портфель', icon: '📈', description: 'Инвестиционный портфель' },
  { key: 'global', label: 'Глобальный', icon: '🌍', description: 'Все клиенты (admin)' },
];

const PERIOD_PRESETS = [
  { label: 'FY 2024', start: '2024-01-01', end: '2024-12-31' },
  { label: 'FY 2025', start: '2025-01-01', end: '2025-12-31' },
  { label: 'Q4 2024', start: '2024-10-01', end: '2024-12-31' },
  { label: 'Q1 2025', start: '2025-01-01', end: '2025-03-31' },
  { label: 'Последние 12 мес.', start: getDateMonthsAgo(12), end: getTodayDate() },
  { label: 'YTD', start: `${new Date().getFullYear()}-01-01`, end: getTodayDate() },
];

function getDateMonthsAgo(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().split('T')[0];
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function PaWizardStepScope({ data, errors, onChange }: PaWizardStepScopeProps) {
  const handlePresetClick = (preset: { label: string; start: string; end: string }) => {
    onChange({
      periodStart: preset.start,
      periodEnd: preset.end,
      periodLabel: preset.label,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-800 mb-2">Охват и период</h2>
        <p className="text-stone-500">Определите границы данных для пакета</p>
      </div>

      {/* Scope Type Selection */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">
          Scope <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SCOPE_TYPES.map((type) => (
            <button
              key={type.key}
              type="button"
              onClick={() => onChange({ scopeType: type.key })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                data.scopeType === type.key
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="font-medium text-stone-800 text-sm">{type.label}</div>
              <div className="text-xs text-stone-500 mt-1">{type.description}</div>
            </button>
          ))}
        </div>
        {errors.scopeType && (
          <p className="text-sm text-red-600 mt-2">{errors.scopeType}</p>
        )}
      </div>

      {/* Entity/Portfolio Selector (when applicable) */}
      {(data.scopeType === 'entity' || data.scopeType === 'portfolio') && (
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Выберите {data.scopeType === 'entity' ? 'юрлицо' : 'портфель'}
          </label>
          <input
            type="text"
            value={data.scopeName || ''}
            onChange={(e) => onChange({ scopeName: e.target.value })}
            placeholder={`Название ${data.scopeType === 'entity' ? 'структуры' : 'портфеля'}`}
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      )}

      {/* Period */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">
          Период <span className="text-red-500">*</span>
        </label>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PERIOD_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                data.periodLabel === preset.label
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Date Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-stone-500 mb-1">Начало</label>
            <input
              type="date"
              value={data.periodStart}
              onChange={(e) => onChange({ periodStart: e.target.value, periodLabel: undefined })}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.periodStart ? 'border-red-300' : 'border-stone-300'
              } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
            />
            {errors.periodStart && (
              <p className="text-sm text-red-600 mt-1">{errors.periodStart}</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">Конец</label>
            <input
              type="date"
              value={data.periodEnd}
              onChange={(e) => onChange({ periodEnd: e.target.value, periodLabel: undefined })}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.periodEnd ? 'border-red-300' : 'border-stone-300'
              } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
            />
            {errors.periodEnd && (
              <p className="text-sm text-red-600 mt-1">{errors.periodEnd}</p>
            )}
          </div>
        </div>
      </div>

      {/* Client-Safe Toggle */}
      <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5">
            <button
              type="button"
              onClick={() => onChange({ clientSafe: !data.clientSafe })}
              className={`w-11 h-6 rounded-full transition-colors ${
                data.clientSafe ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                  data.clientSafe ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          <div>
            <div className="font-medium text-stone-800">Client-safe режим</div>
            <p className="text-sm text-stone-600 mt-1">
              {data.clientSafe
                ? 'Внутренние заметки и конфиденциальные комментарии будут исключены из пакета'
                : 'Пакет будет включать все данные, включая внутренние заметки'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
