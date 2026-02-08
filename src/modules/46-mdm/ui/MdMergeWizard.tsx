"use client";

import { useState } from 'react';
import { MdConfidencePill } from './MdConfidencePill';
import { MdmRecordTypeKey } from '../config';

interface SurvivorshipChoice {
  field: string;
  chosenValue: unknown;
  chosenSource: 'A' | 'B' | 'manual';
  valueA: unknown;
  valueB: unknown;
}

interface MdMergeWizardProps {
  recordType: MdmRecordTypeKey;
  recordA: Record<string, unknown>;
  recordB: Record<string, unknown>;
  onCancel: () => void;
  onConfirm: (primaryId: string, choices: SurvivorshipChoice[]) => void;
}

const recordTypeLabels: Record<MdmRecordTypeKey, string> = {
  people: 'Люди',
  entities: 'Сущности',
  accounts: 'Счета',
  assets: 'Активы',
};

export function MdMergeWizard({
  recordType,
  recordA,
  recordB,
  onCancel,
  onConfirm,
}: MdMergeWizardProps) {
  const [step, setStep] = useState<'select' | 'review' | 'confirm'>('select');
  const [primaryId, setPrimaryId] = useState<string>(recordA.id as string);
  const [choices, setChoices] = useState<SurvivorshipChoice[]>([]);

  const chosenA = (recordA.chosenJson || {}) as Record<string, unknown>;
  const chosenB = (recordB.chosenJson || {}) as Record<string, unknown>;
  const allFields = Array.from(new Set([...Object.keys(chosenA), ...Object.keys(chosenB)]));

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Initialize choices when entering review step
  const initializeChoices = () => {
    const newChoices: SurvivorshipChoice[] = allFields.map((field) => {
      const valueA = chosenA[field];
      const valueB = chosenB[field];

      // Default to primary record's value
      const isPrimaryA = primaryId === recordA.id;
      return {
        field,
        chosenValue: isPrimaryA ? valueA : valueB,
        chosenSource: isPrimaryA ? 'A' : 'B',
        valueA,
        valueB,
      };
    });
    setChoices(newChoices);
  };

  const handleChoiceChange = (field: string, source: 'A' | 'B') => {
    setChoices((prev) =>
      prev.map((c) => {
        if (c.field !== field) return c;
        return {
          ...c,
          chosenSource: source,
          chosenValue: source === 'A' ? c.valueA : c.valueB,
        };
      })
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <h2 className="text-xl font-bold text-stone-800">
            Мастер слияния записей
          </h2>
          <p className="text-stone-500 mt-1">
            {recordTypeLabels[recordType]} - Шаг {step === 'select' ? 1 : step === 'review' ? 2 : 3} из 3
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {step === 'select' && (
            <div className="space-y-6">
              <h3 className="font-semibold text-stone-800">Выберите основную запись</h3>
              <p className="text-sm text-stone-500">
                Основная запись сохранит свой ID. Данные из второй записи будут объединены.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPrimaryId(recordA.id as string)}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${primaryId === recordA.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-stone-200 hover:border-stone-300'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-stone-800">Запись A</span>
                    {primaryId === recordA.id && (
                      <span className="text-xs px-2 py-1 bg-emerald-500 text-white rounded">
                        Основная
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-stone-600 font-mono">
                    {(recordA.id as string).substring(0, 16)}...
                  </div>
                  <div className="mt-2 text-sm text-stone-500">
                    Источников: {((recordA.sourcesJson as unknown[]) || []).length}
                  </div>
                </button>

                <button
                  onClick={() => setPrimaryId(recordB.id as string)}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${primaryId === recordB.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-stone-200 hover:border-stone-300'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-stone-800">Запись B</span>
                    {primaryId === recordB.id && (
                      <span className="text-xs px-2 py-1 bg-emerald-500 text-white rounded">
                        Основная
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-stone-600 font-mono">
                    {(recordB.id as string).substring(0, 16)}...
                  </div>
                  <div className="mt-2 text-sm text-stone-500">
                    Источников: {((recordB.sourcesJson as unknown[]) || []).length}
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-stone-800">Выберите значения для каждого поля</h3>

              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700 w-1/4">
                        Поле
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700 w-5/12">
                        Запись A
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700 w-5/12">
                        Запись B
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {choices.map((choice) => (
                      <tr key={choice.field} className="border-b border-stone-100">
                        <td className="px-4 py-3 text-sm font-medium text-stone-600">
                          {choice.field}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleChoiceChange(choice.field, 'A')}
                            className={`
                              w-full p-2 text-left text-sm rounded-lg transition-all
                              ${choice.chosenSource === 'A'
                                ? 'bg-emerald-100 border-2 border-emerald-500'
                                : 'bg-stone-50 border-2 border-transparent hover:border-stone-200'
                              }
                            `}
                          >
                            {formatValue(choice.valueA)}
                          </button>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleChoiceChange(choice.field, 'B')}
                            className={`
                              w-full p-2 text-left text-sm rounded-lg transition-all
                              ${choice.chosenSource === 'B'
                                ? 'bg-emerald-100 border-2 border-emerald-500'
                                : 'bg-stone-50 border-2 border-transparent hover:border-stone-200'
                              }
                            `}
                          >
                            {formatValue(choice.valueB)}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-amber-800">Подтверждение слияния</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Слияние записей требует подтверждения ответственным лицом.
                      Это действие нельзя отменить автоматически.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 rounded-xl p-4">
                <h4 className="font-semibold text-stone-800 mb-3">Результат слияния:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span>Основная запись: {primaryId.substring(0, 16)}...</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span>Выбрано полей: {choices.length}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span>
                      Из записи A: {choices.filter((c) => c.chosenSource === 'A').length},
                      из записи B: {choices.filter((c) => c.chosenSource === 'B').length}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 flex justify-between">
          <button
            onClick={() => {
              if (step === 'select') onCancel();
              else if (step === 'review') setStep('select');
              else setStep('review');
            }}
            className="px-4 py-2 text-stone-600 hover:text-stone-800 transition-colors"
          >
            {step === 'select' ? 'Отмена' : 'Назад'}
          </button>

          <button
            onClick={() => {
              if (step === 'select') {
                initializeChoices();
                setStep('review');
              } else if (step === 'review') {
                setStep('confirm');
              } else {
                onConfirm(primaryId, choices);
              }
            }}
            className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all"
          >
            {step === 'confirm' ? 'Подтвердить слияние' : 'Далее'}
          </button>
        </div>
      </div>
    </div>
  );
}
