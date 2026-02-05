"use client";

import { X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface CheckResult {
  constraintId: string;
  segment: string;
  limit: number;
  measured: number;
  breached: boolean;
  severity: 'ok' | 'warning' | 'critical';
}

interface IpsCheckResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: CheckResult[];
  onCreateBreach: (result: CheckResult) => void;
}

const severityConfig = {
  ok: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'OK' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Warning' },
  critical: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Critical' },
};

export function IpsCheckResultsModal({ isOpen, onClose, results, onCreateBreach }: IpsCheckResultsModalProps) {
  if (!isOpen) return null;

  const breachedResults = results.filter(r => r.breached);
  const okResults = results.filter(r => !r.breached);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] bg-white rounded-2xl shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800">
            Результаты проверки ограничений
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 bg-stone-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-stone-800">{results.length}</div>
              <div className="text-xs text-stone-500">Всего проверено</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-emerald-600">{okResults.length}</div>
              <div className="text-xs text-emerald-600">В пределах лимита</div>
            </div>
            <div className="p-3 bg-red-50 rounded-xl text-center">
              <div className="text-2xl font-bold text-red-600">{breachedResults.length}</div>
              <div className="text-xs text-red-600">Нарушений</div>
            </div>
          </div>

          {/* Breaches */}
          {breachedResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Обнаружены нарушения
              </h3>
              <div className="space-y-2">
                {breachedResults.map((result, index) => {
                  const config = severityConfig[result.severity];
                  const Icon = config.icon;
                  const deviation = ((result.measured - result.limit) / result.limit * 100).toFixed(1);

                  return (
                    <div key={index} className={`p-3 rounded-xl border ${config.bg} border-stone-200`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-5 h-5 ${config.color}`} />
                          <div>
                            <div className="font-medium text-stone-800">{result.segment}</div>
                            <div className="text-xs text-stone-500">
                              Измерено: {result.measured}% | Лимит: {result.limit}% | Отклонение: {deviation}%
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            result.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {config.label}
                          </span>
                          <button
                            onClick={() => onCreateBreach(result)}
                            className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            Зафиксировать
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OK results */}
          {okResults.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                В пределах лимита
              </h3>
              <div className="space-y-1">
                {okResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-stone-700">{result.segment}</span>
                    </div>
                    <span className="text-xs text-stone-500">
                      {result.measured}% / {result.limit}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source info */}
          <div className="mt-6 p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500">
              <strong>Источник данных:</strong> Simulated portfolio positions<br />
              <strong>As-of дата:</strong> {new Date().toLocaleDateString('ru-RU')}<br />
              <strong>Время проверки:</strong> {new Date().toLocaleTimeString('ru-RU')}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </>
  );
}
