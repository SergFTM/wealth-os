"use client";

import { useState } from 'react';
import { MdStatusPill } from './MdStatusPill';
import { MdmRuleTypeLabels, MdmRuleTypeKey, MdmRecordTypeKey } from '../config';

interface MdmRule {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  ruleTypeKey: MdmRuleTypeKey;
  appliesToKey: MdmRecordTypeKey;
  status: string;
  priority?: number;
  configJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface MdRuleDetailProps {
  rule: MdmRule;
  onSave?: (config: Record<string, unknown>) => void;
  onToggleStatus?: () => void;
  onTestRun?: () => void;
}

const recordTypeLabels: Record<MdmRecordTypeKey, string> = {
  people: 'Люди',
  entities: 'Сущности',
  accounts: 'Счета',
  assets: 'Активы',
};

export function MdRuleDetail({
  rule,
  onSave,
  onToggleStatus,
  onTestRun,
}: MdRuleDetailProps) {
  const [configText, setConfigText] = useState(
    JSON.stringify(rule.configJson, null, 2)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(configText);
      onSave?.(parsed);
      setIsEditing(false);
      setError(null);
    } catch {
      setError('Неверный JSON формат');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">{rule.name}</h1>
            {rule.description && (
              <p className="text-stone-500 mt-1">{rule.description}</p>
            )}
            <div className="flex items-center gap-3 mt-3">
              <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700">
                {MdmRuleTypeLabels[rule.ruleTypeKey]?.ru || rule.ruleTypeKey}
              </span>
              <span className="text-stone-500 text-sm">
                Применяется к: {recordTypeLabels[rule.appliesToKey]}
              </span>
              <MdStatusPill status={rule.status} size="md" />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onTestRun}
              className="px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg font-medium text-sm hover:bg-stone-50 transition-all"
            >
              Тест
            </button>
            <button
              onClick={onToggleStatus}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all
                ${rule.status === 'enabled'
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }
              `}
            >
              {rule.status === 'enabled' ? 'Отключить' : 'Включить'}
            </button>
          </div>
        </div>
      </div>

      {/* Config editor */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-stone-800">Конфигурация правила</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              Редактировать
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setConfigText(JSON.stringify(rule.configJson, null, 2));
                  setIsEditing(false);
                  setError(null);
                }}
                className="text-sm text-stone-500 hover:text-stone-700"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Сохранить
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <textarea
          value={configText}
          onChange={(e) => setConfigText(e.target.value)}
          readOnly={!isEditing}
          className={`
            w-full h-96 p-4 font-mono text-sm rounded-lg border
            ${isEditing
              ? 'bg-white border-emerald-300 focus:ring-2 focus:ring-emerald-500'
              : 'bg-stone-50 border-stone-200'
            }
            focus:outline-none
          `}
        />
      </div>

      {/* Rule type explanation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">Справка по типу правила</h2>
        {rule.ruleTypeKey === 'matching' && (
          <div className="text-sm text-stone-600 space-y-2">
            <p><strong>Правила сопоставления</strong> определяют, как находить дубликаты:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><code>matchingWeights</code> - веса полей для расчета score</li>
              <li><code>matchThreshold</code> - минимальный score для кандидата</li>
              <li><code>fuzzyFields</code> - поля для нечеткого сравнения</li>
              <li><code>exactFields</code> - поля для точного сравнения</li>
            </ul>
          </div>
        )}
        {rule.ruleTypeKey === 'normalization' && (
          <div className="text-sm text-stone-600 space-y-2">
            <p><strong>Правила нормализации</strong> определяют преобразования данных:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><code>normalizationRules</code> - список преобразований по полям</li>
              <li><code>field</code> - имя поля для нормализации</li>
              <li><code>transform</code> - тип преобразования (uppercase, trim, phone, email)</li>
            </ul>
          </div>
        )}
        {rule.ruleTypeKey === 'survivorship' && (
          <div className="text-sm text-stone-600 space-y-2">
            <p><strong>Правила выживаемости</strong> определяют выбор значений при слиянии:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><code>sourcePriority</code> - приоритет источников данных</li>
              <li><code>preferFreshest</code> - предпочитать свежие данные</li>
              <li><code>preferNonNull</code> - предпочитать непустые значения</li>
            </ul>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">Метаданные</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-stone-500">ID:</span>
            <span className="ml-2 font-mono text-stone-700">{rule.id}</span>
          </div>
          <div>
            <span className="text-stone-500">Приоритет:</span>
            <span className="ml-2 text-stone-700">{rule.priority ?? '-'}</span>
          </div>
          <div>
            <span className="text-stone-500">Создано:</span>
            <span className="ml-2 text-stone-700">
              {new Date(rule.createdAt).toLocaleString('ru-RU')}
            </span>
          </div>
          <div>
            <span className="text-stone-500">Обновлено:</span>
            <span className="ml-2 text-stone-700">
              {new Date(rule.updatedAt).toLocaleString('ru-RU')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
