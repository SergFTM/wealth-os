"use client";

import { AlertTriangle, CheckCircle, TrendingDown, ArrowLeft, Download } from 'lucide-react';

interface StressRunResult {
  equityImpact: number;
  fixedIncomeImpact: number;
  alternativesImpact: number;
  cashImpact: number;
  totalPnL: number;
  worstPosition: string;
  worstPositionLoss: number;
}

interface StressRun {
  id: string;
  scenarioId: string;
  scenarioName: string;
  portfolioId: string;
  runDate: string;
  status: 'completed' | 'running' | 'failed';
  portfolioImpact: number | null;
  portfolioImpactValue: number | null;
  varBreached: boolean | null;
  results: StressRunResult | null;
  runBy: string;
  notes: string | null;
}

interface RkStressRunDetailProps {
  run: StressRun;
  onBack?: () => void;
  onExport?: () => void;
}

export function RkStressRunDetail({ run, onBack, onExport }: RkStressRunDetailProps) {
  if (!run.results) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="text-center text-stone-500">
          Результаты стресс-теста недоступны
        </div>
      </div>
    );
  }

  const impactItems = [
    { label: 'Акции', value: run.results.equityImpact, color: 'bg-blue-500' },
    { label: 'Облигации', value: run.results.fixedIncomeImpact, color: 'bg-emerald-500' },
    { label: 'Альтернативы', value: run.results.alternativesImpact, color: 'bg-purple-500' },
    { label: 'Денежные средства', value: run.results.cashImpact, color: 'bg-stone-400' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-stone-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-stone-500" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-semibold text-stone-800">{run.scenarioName}</h2>
              <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                <span>Запуск: {new Date(run.runDate).toLocaleDateString('ru-RU')}</span>
                <span>•</span>
                <span>{run.runBy}</span>
              </div>
            </div>
          </div>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Экспорт
            </button>
          )}
        </div>
      </div>

      {/* Main impact */}
      <div className={`p-6 ${run.varBreached ? 'bg-red-50' : 'bg-emerald-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {run.varBreached ? (
                <AlertTriangle className="w-6 h-6 text-red-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              )}
              <span className={`text-sm font-medium ${run.varBreached ? 'text-red-600' : 'text-emerald-600'}`}>
                {run.varBreached ? 'VaR лимит превышен' : 'В пределах VaR лимита'}
              </span>
            </div>
            <div className={`text-4xl font-bold ${run.portfolioImpact && run.portfolioImpact < -20 ? 'text-red-600' : 'text-stone-800'}`}>
              {run.portfolioImpact?.toFixed(1)}%
            </div>
            <div className="text-sm text-stone-600 mt-1">Общее влияние на портфель</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-stone-800">
              ${((run.portfolioImpactValue || 0) / 1000000).toFixed(2)}M
            </div>
            <div className="text-sm text-stone-600">Абсолютное изменение</div>
          </div>
        </div>
      </div>

      {/* Impact breakdown */}
      <div className="p-6 border-b border-stone-200">
        <h3 className="text-sm font-semibold text-stone-800 mb-4">Влияние по классам активов</h3>
        <div className="space-y-3">
          {impactItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm text-stone-700 flex-1">{item.label}</span>
              <div className="w-32 h-2 bg-stone-100 rounded-full overflow-hidden">
                {item.value < 0 && (
                  <div
                    className="h-full bg-red-400 rounded-full float-right"
                    style={{ width: `${Math.min(Math.abs(item.value), 50)}%` }}
                  />
                )}
                {item.value > 0 && (
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${Math.min(item.value, 50)}%` }}
                  />
                )}
              </div>
              <span className={`text-sm font-medium w-16 text-right ${item.value < 0 ? 'text-red-600' : item.value > 0 ? 'text-emerald-600' : 'text-stone-600'}`}>
                {item.value > 0 ? '+' : ''}{item.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Worst position */}
      <div className="p-6 border-b border-stone-200">
        <h3 className="text-sm font-semibold text-stone-800 mb-3">Наихудшая позиция</h3>
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-stone-800">{run.results.worstPosition}</span>
          </div>
          <span className="text-lg font-bold text-red-600">
            -${(Math.abs(run.results.worstPositionLoss) / 1000000).toFixed(2)}M
          </span>
        </div>
      </div>

      {/* Notes */}
      {run.notes && (
        <div className="p-6">
          <h3 className="text-sm font-semibold text-stone-800 mb-2">Примечания</h3>
          <p className="text-sm text-stone-600">{run.notes}</p>
        </div>
      )}
    </div>
  );
}
