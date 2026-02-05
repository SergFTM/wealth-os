'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { previewMapping, generateSampleInput, type MappingRule, type TransformRule } from '../engine/mappingPreview';

interface Mapping {
  id: string;
  connectorId: string;
  entityType: string;
  name: string;
  rulesJson?: MappingRule[];
  transformsJson?: TransformRule[];
  status: 'active' | 'draft' | 'archived';
  version?: number;
  updatedAt: string;
}

interface SbMappingPanelProps {
  mappings: Mapping[];
  onSave?: (mappingId: string, rules: MappingRule[], transforms: TransformRule[]) => void;
}

const i18n = {
  ru: {
    title: 'Mapping Preview',
    selectMapping: 'Выберите маппинг',
    rules: 'Правила',
    transforms: 'Трансформации',
    preview: 'Preview',
    input: 'Input Sample',
    output: 'Output',
    errors: 'Ошибки',
    runPreview: 'Запустить preview',
    save: 'Сохранить',
    noMappings: 'Нет маппингов',
  },
  en: {
    title: 'Mapping Preview',
    selectMapping: 'Select Mapping',
    rules: 'Rules',
    transforms: 'Transforms',
    preview: 'Preview',
    input: 'Input Sample',
    output: 'Output',
    errors: 'Errors',
    runPreview: 'Run Preview',
    save: 'Save',
    noMappings: 'No mappings',
  },
  uk: {
    title: 'Mapping Preview',
    selectMapping: 'Оберіть маппінг',
    rules: 'Правила',
    transforms: 'Трансформації',
    preview: 'Preview',
    input: 'Input Sample',
    output: 'Output',
    errors: 'Помилки',
    runPreview: 'Запустити preview',
    save: 'Зберегти',
    noMappings: 'Немає маппінгів',
  },
};

export function SbMappingPanel({ mappings, onSave }: SbMappingPanelProps) {
  const { locale } = useApp();
  const t = i18n[locale];

  const [selectedId, setSelectedId] = useState<string>('');
  const [previewResult, setPreviewResult] = useState<{
    input: Record<string, unknown>;
    output: Record<string, unknown>;
    errors: Array<{ field: string; message: string }>;
  } | null>(null);

  const selectedMapping = mappings.find(m => m.id === selectedId);

  const handleRunPreview = () => {
    if (!selectedMapping) return;

    const sampleInput = generateSampleInput(selectedMapping.entityType);
    const result = previewMapping(
      sampleInput,
      selectedMapping.rulesJson || [],
      selectedMapping.transformsJson || []
    );

    setPreviewResult(result);
  };

  if (mappings.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-8 text-center">
        <p className="text-stone-500">{t.noMappings}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mapping Selector */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
        <h3 className="font-semibold text-stone-800 mb-4">{t.title}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-stone-500 block mb-2">{t.selectMapping}</label>
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setPreviewResult(null);
              }}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">-- Select --</option>
              {mappings.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.connectorId} / {m.entityType})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="primary"
              onClick={handleRunPreview}
              disabled={!selectedMapping}
              className="bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              {t.runPreview}
            </Button>
          </div>
        </div>
      </div>

      {/* Rules & Transforms */}
      {selectedMapping && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
            <h4 className="font-semibold text-stone-800 mb-3">{t.rules}</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedMapping.rulesJson?.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg text-sm">
                  <code className="text-indigo-600">{rule.sourceField}</code>
                  <span className="text-stone-400">→</span>
                  <code className="text-emerald-600">{rule.targetField}</code>
                  {rule.required && <span className="text-rose-500 text-xs">*</span>}
                </div>
              )) || <p className="text-sm text-stone-400">No rules defined</p>}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
            <h4 className="font-semibold text-stone-800 mb-3">{t.transforms}</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedMapping.transformsJson?.map((tr, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg text-sm">
                  <code className="text-indigo-600">{tr.field}</code>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">{tr.transform}</span>
                </div>
              )) || <p className="text-sm text-stone-400">No transforms defined</p>}
            </div>
          </div>
        </div>
      )}

      {/* Preview Results */}
      {previewResult && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
            <h4 className="font-semibold text-stone-800 mb-3">{t.input}</h4>
            <pre className="bg-stone-900 text-stone-100 p-3 rounded-xl text-xs overflow-auto max-h-48 font-mono">
              {JSON.stringify(previewResult.input, null, 2)}
            </pre>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-5">
            <h4 className="font-semibold text-stone-800 mb-3">{t.output}</h4>
            <pre className="bg-stone-900 text-emerald-300 p-3 rounded-xl text-xs overflow-auto max-h-48 font-mono">
              {JSON.stringify(previewResult.output, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Errors */}
      {previewResult && previewResult.errors.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-rose-100/50 p-5">
          <h4 className="font-semibold text-rose-700 mb-3">{t.errors}</h4>
          <div className="space-y-2">
            {previewResult.errors.map((err, idx) => (
              <div key={idx} className="p-2 bg-rose-50 rounded-lg text-sm text-rose-600">
                <code className="font-semibold mr-2">{err.field}:</code>
                {err.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
