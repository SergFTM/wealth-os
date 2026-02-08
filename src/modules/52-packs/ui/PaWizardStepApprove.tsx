"use client";

interface ApproveData {
  approverRoleKey?: string;
  urgencyKey?: string;
  approvalNotes?: string;
  sensitivityKey: string;
  recipientType: string;
}

interface PaWizardStepApproveProps {
  data: ApproveData;
  errors: Record<string, string>;
  onChange: (data: Partial<ApproveData>) => void;
}

const APPROVER_ROLES = [
  { key: 'admin', label: 'Администратор', description: 'Полные права на все пакеты' },
  { key: 'cfo', label: 'CFO', description: 'Финансовые пакеты, банки, инвесторы' },
  { key: 'controller', label: 'Контроллер', description: 'Аудиторские и налоговые пакеты' },
  { key: 'compliance', label: 'Комплаенс', description: 'Регуляторные и юридические пакеты' },
  { key: 'legal', label: 'Юрист', description: 'Юридические пакеты' },
  { key: 'family_office_head', label: 'Глава FO', description: 'Все типы пакетов' },
];

const URGENCY_LEVELS = [
  { key: 'low', label: 'Низкий', description: '5+ рабочих дней', icon: '🟢' },
  { key: 'normal', label: 'Обычный', description: '3 рабочих дня', icon: '🟡' },
  { key: 'high', label: 'Высокий', description: '1 рабочий день', icon: '🟠' },
  { key: 'urgent', label: 'Срочно', description: 'Как можно скорее', icon: '🔴' },
];

export function PaWizardStepApprove({ data, errors, onChange }: PaWizardStepApproveProps) {
  // Determine recommended approver based on recipient type and sensitivity
  const getRecommendedApprover = (): string => {
    if (data.sensitivityKey === 'high') {
      if (['regulator', 'legal'].includes(data.recipientType)) return 'compliance';
      return 'cfo';
    }

    switch (data.recipientType) {
      case 'auditor': return 'controller';
      case 'bank': return 'cfo';
      case 'tax': return 'controller';
      case 'legal': return 'legal';
      case 'committee': return 'cfo';
      case 'investor': return 'cfo';
      case 'regulator': return 'compliance';
      default: return 'admin';
    }
  };

  const recommendedApprover = getRecommendedApprover();

  // Auto-select recommended if not set
  if (!data.approverRoleKey) {
    onChange({ approverRoleKey: recommendedApprover });
  }

  if (!data.urgencyKey) {
    onChange({ urgencyKey: 'normal' });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-800 mb-2">Согласование</h2>
        <p className="text-stone-500">Настройте запрос на одобрение пакета</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <div className="font-medium text-blue-800">Требуется согласование</div>
            <p className="text-sm text-blue-700 mt-1">
              Пакет с уровнем чувствительности "{data.sensitivityKey === 'low' ? 'Низкий' : data.sensitivityKey === 'medium' ? 'Средний' : 'Высокий'}"
              для получателя типа "{data.recipientType}" требует одобрения.
            </p>
          </div>
        </div>
      </div>

      {/* Approver Role Selection */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">
          Роль согласующего <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {APPROVER_ROLES.map((role) => (
            <button
              key={role.key}
              type="button"
              onClick={() => onChange({ approverRoleKey: role.key })}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 text-left transition-all ${
                data.approverRoleKey === role.key
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-stone-800">{role.label}</span>
                  {role.key === recommendedApprover && (
                    <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded">
                      Рекомендуется
                    </span>
                  )}
                </div>
                <div className="text-sm text-stone-500 mt-0.5">{role.description}</div>
              </div>
              {data.approverRoleKey === role.key && (
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Urgency Level */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">
          Приоритет
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {URGENCY_LEVELS.map((level) => (
            <button
              key={level.key}
              type="button"
              onClick={() => onChange({ urgencyKey: level.key })}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                data.urgencyKey === level.key
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="text-xl mb-1">{level.icon}</div>
              <div className="font-medium text-stone-800 text-sm">{level.label}</div>
              <div className="text-xs text-stone-500">{level.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Комментарий к запросу
        </label>
        <textarea
          value={data.approvalNotes || ''}
          onChange={(e) => onChange({ approvalNotes: e.target.value })}
          placeholder="Дополнительная информация для согласующего..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
        />
      </div>

      {/* Workflow Summary */}
      <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
        <h3 className="text-sm font-medium text-stone-700 mb-3">Процесс</h3>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium">1</div>
            <span className="text-stone-600">Создание</span>
          </div>
          <div className="w-8 h-0.5 bg-stone-300" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium">2</div>
            <span className="text-stone-600">Согласование</span>
          </div>
          <div className="w-8 h-0.5 bg-stone-300" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">3</div>
            <span className="text-stone-600">Публикация</span>
          </div>
        </div>
        <p className="text-xs text-stone-500 mt-3">
          После создания пакет будет отправлен на согласование. После одобрения вы сможете опубликовать ссылку для получателя.
        </p>
      </div>
    </div>
  );
}
