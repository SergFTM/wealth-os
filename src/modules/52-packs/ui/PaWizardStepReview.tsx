"use client";

interface WizardItem {
  id: string;
  itemTypeKey: string;
  title: string;
  include: boolean;
  clientSafe: boolean;
  sensitivityKey: string;
}

interface ReviewData {
  recipientType: string;
  recipientOrg: string;
  purpose: string;
  scopeType: string;
  scopeName?: string;
  periodStart: string;
  periodEnd: string;
  periodLabel?: string;
  clientSafe: boolean;
  items: WizardItem[];
  sensitivityKey: string;
  watermarkKey: string;
}

interface PaWizardStepReviewProps {
  data: ReviewData;
  errors: Record<string, string>;
  onChange: (data: Partial<ReviewData>) => void;
}

const recipientLabels: Record<string, string> = {
  auditor: 'Аудитор',
  bank: 'Банк',
  tax: 'Налоговый консультант',
  legal: 'Юридический советник',
  committee: 'Инвестиционный комитет',
  investor: 'Со-инвестор',
  regulator: 'Регулятор',
  other: 'Другое',
};

const scopeLabels: Record<string, string> = {
  household: 'Household',
  entity: 'Юридическое лицо',
  portfolio: 'Портфель',
  global: 'Глобальный',
};

export function PaWizardStepReview({ data, errors, onChange }: PaWizardStepReviewProps) {
  const includedItems = data.items.filter(i => i.include);
  const highSensitivityCount = includedItems.filter(i => i.sensitivityKey === 'high').length;

  const formatPeriod = () => {
    if (data.periodLabel) return data.periodLabel;
    return `${formatDate(data.periodStart)} — ${formatDate(data.periodEnd)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-800 mb-2">Обзор пакета</h2>
        <p className="text-stone-500">Проверьте настройки перед созданием</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recipient Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="text-sm font-medium text-stone-500 mb-3">Получатель</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-600">Тип</span>
              <span className="font-medium text-stone-800">
                {recipientLabels[data.recipientType]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Организация</span>
              <span className="font-medium text-stone-800">{data.recipientOrg}</span>
            </div>
          </div>
        </div>

        {/* Scope Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="text-sm font-medium text-stone-500 mb-3">Охват</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-600">Scope</span>
              <span className="font-medium text-stone-800">
                {data.scopeName || scopeLabels[data.scopeType]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Период</span>
              <span className="font-medium text-stone-800">{formatPeriod()}</span>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="text-sm font-medium text-stone-500 mb-3">Содержимое</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-600">Документов</span>
              <span className="font-medium text-stone-800">{includedItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Client-safe</span>
              <span className={`font-medium ${data.clientSafe ? 'text-emerald-600' : 'text-stone-800'}`}>
                {data.clientSafe ? 'Да' : 'Нет'}
              </span>
            </div>
            {highSensitivityCount > 0 && (
              <div className="flex justify-between">
                <span className="text-stone-600">Высокая чувств.</span>
                <span className="font-medium text-red-600">{highSensitivityCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Purpose Card */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="text-sm font-medium text-stone-500 mb-3">Цель</h3>
          <p className="text-stone-800 text-sm">{data.purpose}</p>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
        <h3 className="text-sm font-medium text-stone-700 mb-4">Настройки безопасности</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sensitivity */}
          <div>
            <label className="block text-xs text-stone-500 mb-2">Уровень чувствительности</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => onChange({ sensitivityKey: level })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    data.sensitivityKey === level
                      ? level === 'low' ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : level === 'medium' ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  {level === 'low' ? 'Низкий' : level === 'medium' ? 'Средний' : 'Высокий'}
                </button>
              ))}
            </div>
          </div>

          {/* Watermark */}
          <div>
            <label className="block text-xs text-stone-500 mb-2">Водяной знак</label>
            <div className="flex gap-2">
              {['on', 'off'].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ watermarkKey: value })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    data.watermarkKey === value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  {value === 'on' ? 'Включён' : 'Выключен'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
        <div className="flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <div className="font-medium text-amber-800">Дисклеймер</div>
            <p className="text-sm text-amber-700 mt-1">
              Пакеты содержат конфиденциальные материалы. Перед передачей третьим лицам требуется проверка и утверждение.
            </p>
          </div>
        </div>
      </div>

      {/* Items Preview */}
      <div>
        <h3 className="text-sm font-medium text-stone-700 mb-3">
          Документы ({includedItems.length})
        </h3>
        <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100 max-h-48 overflow-y-auto">
          {includedItems.map((item, idx) => (
            <div key={item.id} className="px-3 py-2 flex items-center justify-between text-sm">
              <span className="text-stone-800">{idx + 1}. {item.title}</span>
              <span className={`px-2 py-0.5 text-xs rounded ${
                item.sensitivityKey === 'low' ? 'bg-emerald-100 text-emerald-700' :
                item.sensitivityKey === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {item.sensitivityKey === 'low' ? 'L' : item.sensitivityKey === 'medium' ? 'M' : 'H'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}
