"use client";

import {
  ArrowLeft,
  Shield,
  Layers,
  Settings2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Dictionaries                                                       */
/* ------------------------------------------------------------------ */
const POLICY_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  retention:        { label: 'Хранение',          color: 'bg-blue-100 text-blue-700' },
  legal_hold:       { label: 'Legal Hold',         color: 'bg-red-100 text-red-700' },
  export_controls:  { label: 'Экспорт-контроль',  color: 'bg-amber-100 text-amber-700' },
  client_safe:      { label: 'Client-safe',        color: 'bg-emerald-100 text-emerald-700' },
};

const STATUS_STYLES: Record<string, string> = {
  active:   'bg-emerald-100 text-emerald-700',
  inactive: 'bg-stone-200 text-stone-600',
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
export interface CoPolicyDetailProps {
  policy: any;
  onBack: () => void;
  onToggleStatus: () => void;
  onShowAudit: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function CoPolicyDetail({
  policy,
  onBack,
  onToggleStatus,
  onShowAudit,
}: CoPolicyDetailProps) {
  const typeInfo = POLICY_TYPE_LABELS[policy.policyTypeKey] ?? {
    label: policy.policyTypeKey,
    color: 'bg-stone-100 text-stone-600',
  };
  const statusStyle = STATUS_STYLES[policy.statusKey] ?? STATUS_STYLES.inactive;
  const appliesTo = policy.appliesToJson ?? {};
  const configJson: Record<string, unknown> = policy.configJson ?? {};

  return (
    <div className="space-y-6">
      {/* ---- Header ---- */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-xl font-bold text-stone-800">{policy.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle}`}>
                {policy.statusKey === 'active' ? 'Активна' : 'Неактивна'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onShowAudit}
            className="px-3 py-1.5 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Аудит
          </button>
        </div>
      </div>

      {/* ---- Applies to ---- */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-stone-400" />
          Область применения
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Modules */}
          <div>
            <div className="text-xs text-stone-400 mb-1.5">Модули</div>
            {appliesTo.modulesJson && appliesTo.modulesJson.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {appliesTo.modulesJson.map((m: string) => (
                  <span
                    key={m}
                    className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700"
                  >
                    {m}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400">Все модули</p>
            )}
          </div>

          {/* Object Types */}
          <div>
            <div className="text-xs text-stone-400 mb-1.5">Типы объектов</div>
            {appliesTo.objectTypesJson && appliesTo.objectTypesJson.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {appliesTo.objectTypesJson.map((t: string) => (
                  <span
                    key={t}
                    className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400">Все типы</p>
            )}
          </div>
        </div>
      </div>

      {/* ---- Config ---- */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-stone-400" />
          Конфигурация
        </h3>

        {Object.keys(configJson).length === 0 ? (
          <p className="text-sm text-stone-400">Нет параметров конфигурации</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {Object.entries(configJson).map(([key, value]) => (
              <div key={key} className="flex items-start justify-between py-2.5 first:pt-0 last:pb-0">
                <span className="text-sm font-medium text-stone-600">{key}</span>
                <span className="text-sm text-stone-800 text-right max-w-[60%] break-words">
                  {renderConfigValue(value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- Timestamps ---- */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-stone-400">Создано</div>
            <div className="font-medium text-stone-700">
              {new Date(policy.createdAt).toLocaleDateString('ru-RU')}
            </div>
          </div>
          <div>
            <div className="text-xs text-stone-400">Обновлено</div>
            <div className="font-medium text-stone-700">
              {new Date(policy.updatedAt).toLocaleDateString('ru-RU')}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Toggle button ---- */}
      <div className="flex items-center">
        <button
          onClick={onToggleStatus}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            policy.statusKey === 'active'
              ? 'text-stone-600 border border-stone-300 hover:bg-stone-50'
              : 'text-emerald-600 border border-emerald-300 hover:bg-emerald-50'
          }`}
        >
          {policy.statusKey === 'active' ? (
            <>
              <ToggleLeft className="w-4 h-4" />
              Деактивировать
            </>
          ) : (
            <>
              <ToggleRight className="w-4 h-4" />
              Активировать
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper to render arbitrary config values                           */
/* ------------------------------------------------------------------ */
function renderConfigValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Да' : 'Нет';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(', ');
  return JSON.stringify(value);
}
