"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Template {
  id: string;
  name: string;
  audience: string;
  defaultSections: Array<{ type: string; title: string; visibility: string }>;
}

interface ReportsPackBuilderProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: PackConfig) => void;
  templates: Template[];
  initialConfig?: Partial<PackConfig>;
}

interface PackConfig {
  name: string;
  templateId: string;
  clientId: string;
  scopeType: 'household' | 'entity' | 'portfolio' | 'all';
  scopeId?: string;
  asOf: string;
}

export function ReportsPackBuilder({
  open,
  onClose,
  onSave,
  templates,
  initialConfig
}: ReportsPackBuilderProps) {
  const [config, setConfig] = useState<PackConfig>({
    name: initialConfig?.name || '',
    templateId: initialConfig?.templateId || '',
    clientId: initialConfig?.clientId || 'client-001',
    scopeType: initialConfig?.scopeType || 'household',
    scopeId: initialConfig?.scopeId,
    asOf: initialConfig?.asOf || new Date().toISOString().split('T')[0]
  });

  const selectedTemplate = templates.find(t => t.id === config.templateId);

  if (!open) return null;

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-[520px] bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800">Создать пакет отчётности</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Template selection */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Шаблон</label>
            <div className="grid grid-cols-2 gap-2">
              {templates.slice(0, 6).map(t => (
                <button
                  key={t.id}
                  onClick={() => setConfig(c => ({ 
                    ...c, 
                    templateId: t.id,
                    name: c.name || t.name
                  }))}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-colors",
                    config.templateId === t.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-stone-200 hover:bg-stone-50"
                  )}
                >
                  <p className="font-medium text-sm text-stone-800 truncate">{t.name}</p>
                  <p className="text-xs text-stone-500">{t.defaultSections.length} секций</p>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Название пакета</label>
            <input
              type="text"
              value={config.name}
              onChange={e => setConfig(c => ({ ...c, name: e.target.value }))}
              placeholder="Январь 2026 — Обзор состояния"
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Клиент</label>
            <select
              value={config.clientId}
              onChange={e => setConfig(c => ({ ...c, clientId: e.target.value }))}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
            >
              <option value="client-001">Клиент 1 — Семья Петровых</option>
              <option value="client-002">Клиент 2 — Семья Сидоровых</option>
              <option value="client-003">Клиент 3 — Фонд ABC</option>
            </select>
          </div>

          {/* Scope */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Область охвата</label>
            <div className="flex gap-2">
              {[
                { value: 'household', label: 'Семья' },
                { value: 'entity', label: 'Структура' },
                { value: 'portfolio', label: 'Портфель' },
                { value: 'all', label: 'Всё' }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setConfig(c => ({ ...c, scopeType: opt.value as PackConfig['scopeType'] }))}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    config.scopeType === opt.value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-stone-200 hover:bg-stone-50"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* As-of date */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">As-of дата</label>
            <input
              type="date"
              value={config.asOf}
              onChange={e => setConfig(c => ({ ...c, asOf: e.target.value }))}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
            />
          </div>

          {/* Template preview */}
          {selectedTemplate && (
            <div className="p-4 bg-stone-50 rounded-lg">
              <p className="text-xs font-medium text-stone-600 mb-2">Секции из шаблона:</p>
              <div className="space-y-1">
                {selectedTemplate.defaultSections.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      s.visibility === 'client' ? "bg-emerald-400" : "bg-stone-400"
                    )} />
                    <span className="text-stone-700">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-stone-200 flex gap-2">
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleSave}
            disabled={!config.templateId || !config.name}
          >
            Создать пакет
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </div>
    </>
  );
}
