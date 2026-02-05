"use client";

import React, { useState } from 'react';
import { CsStatusPill } from './CsStatusPill';
import { ArrowLeft, Play, Pause, Plus, Trash2 } from 'lucide-react';

interface PolicyRule {
  id: string;
  matchRole?: string[];
  matchDocTags?: string[];
  matchScopeType?: string[];
  allowActions?: string[];
  denyActions?: string[];
  enforceWatermark?: boolean;
  enforceClientSafe?: boolean;
}

interface SharingPolicy {
  id: string;
  name: string;
  description?: string;
  appliesTo: string;
  status: string;
  priority: number;
  rules: PolicyRule[];
  createdAt: string;
  updatedAt: string;
}

interface CsPolicyDetailProps {
  policy: SharingPolicy;
  onBack: () => void;
  onActivate?: () => void;
  onPause?: () => void;
  onUpdateRules?: (rules: PolicyRule[]) => void;
}

export function CsPolicyDetail({ policy, onBack, onActivate, onPause }: CsPolicyDetailProps) {
  const [activeTab, setActiveTab] = useState<'rules' | 'preview' | 'audit'>('rules');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  const tabs = [
    { key: 'rules', label: 'Правила' },
    { key: 'preview', label: 'Превью' },
    { key: 'audit', label: 'Аудит' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-800">{policy.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <CsStatusPill status={policy.status} size="md" />
              <span className="text-sm text-stone-500">
                Применяется к: {policy.appliesTo}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {policy.status === 'paused' && (
            <button
              onClick={onActivate}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
            >
              <Play className="w-4 h-4" />
              Активировать
            </button>
          )}
          {policy.status === 'active' && (
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
            >
              <Pause className="w-4 h-4" />
              Приостановить
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-800">Правила политики</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg">
              <Plus className="w-4 h-4" />
              Добавить правило
            </button>
          </div>

          {policy.rules.length === 0 ? (
            <div className="p-8 text-center text-stone-500 bg-stone-50 rounded-xl">
              Нет правил
            </div>
          ) : (
            <div className="space-y-3">
              {policy.rules.map((rule, idx) => (
                <div key={rule.id || idx} className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {rule.matchRole?.map(r => (
                          <span key={r} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                            role: {r}
                          </span>
                        ))}
                        {rule.matchDocTags?.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                            tag: {t}
                          </span>
                        ))}
                        {rule.matchScopeType?.map(s => (
                          <span key={s} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            scope: {s}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {rule.allowActions?.map(a => (
                          <span key={a} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs">
                            ✓ {a}
                          </span>
                        ))}
                        {rule.denyActions?.map(a => (
                          <span key={a} className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-xs">
                            ✗ {a}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3 text-xs text-stone-500">
                        {rule.enforceWatermark && <span>🔒 Watermark</span>}
                        {rule.enforceClientSafe && <span>👤 Client-safe</span>}
                      </div>
                    </div>
                    <button className="p-1 hover:bg-rose-50 rounded text-rose-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Превью применения политики</h3>
          <p className="text-sm text-stone-500 mb-4">
            Выберите параметры для тестирования политики
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Роль</label>
              <select className="w-full px-3 py-2 border border-stone-300 rounded-lg">
                <option>advisor</option>
                <option>client</option>
                <option>user</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Действие</label>
              <select className="w-full px-3 py-2 border border-stone-300 rounded-lg">
                <option>view</option>
                <option>download</option>
                <option>export</option>
                <option>api</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Теги документа</label>
              <input
                type="text"
                placeholder="sensitive, audit..."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Тип объекта</label>
              <select className="w-full px-3 py-2 border border-stone-300 rounded-lg">
                <option>document</option>
                <option>report</option>
              </select>
            </div>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium">
            Проверить
          </button>
          <div className="mt-4 p-4 bg-stone-50 rounded-lg">
            <p className="text-sm text-stone-600">Результат: выберите параметры и нажмите "Проверить"</p>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Audit Trail</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="text-sm">Политика создана</div>
              <div className="text-xs text-stone-500 ml-auto">{formatDate(policy.createdAt)}</div>
            </div>
            {policy.updatedAt !== policy.createdAt && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="text-sm">Политика обновлена</div>
                <div className="text-xs text-stone-500 ml-auto">{formatDate(policy.updatedAt)}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
