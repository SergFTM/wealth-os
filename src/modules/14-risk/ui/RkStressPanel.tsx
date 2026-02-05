"use client";

import { PlayCircle, Clock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface StressScenario {
  id: string;
  name: string;
  type: 'historical' | 'hypothetical';
  severity: 'moderate' | 'severe';
  status: 'active' | 'draft';
  lastRunDate: string | null;
  frequency: string;
}

interface StressRun {
  id: string;
  scenarioId: string;
  scenarioName: string;
  portfolioId: string;
  runDate: string;
  status: 'completed' | 'running' | 'failed';
  portfolioImpact: number | null;
  varBreached: boolean | null;
}

interface RkStressPanelProps {
  scenarios: StressScenario[];
  recentRuns: StressRun[];
  onRunScenario?: (scenarioId: string) => void;
  onViewRun?: (runId: string) => void;
}

const severityConfig = {
  moderate: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Умеренный' },
  severe: { color: 'text-red-600', bg: 'bg-red-50', label: 'Серьёзный' },
};

const typeLabels = {
  historical: 'Исторический',
  hypothetical: 'Гипотетический',
};

export function RkStressPanel({ scenarios, recentRuns, onRunScenario, onViewRun }: RkStressPanelProps) {
  const activeScenarios = scenarios.filter(s => s.status === 'active');

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-stone-200">
        <h3 className="text-sm font-semibold text-stone-800">Стресс-тестирование</h3>
        <p className="text-xs text-stone-500 mt-1">Сценарный анализ портфельных рисков</p>
      </div>

      {/* Recent Runs */}
      <div className="p-4 border-b border-stone-200">
        <div className="text-xs font-semibold text-stone-600 uppercase mb-3">Последние запуски</div>
        <div className="space-y-2">
          {recentRuns.slice(0, 5).map((run) => (
            <div
              key={run.id}
              onClick={() => onViewRun?.(run.id)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                {run.status === 'completed' ? (
                  run.varBreached ? (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )
                ) : run.status === 'running' ? (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-stone-400" />
                )}
                <div>
                  <div className="text-sm font-medium text-stone-800">{run.scenarioName}</div>
                  <div className="text-xs text-stone-500">
                    {new Date(run.runDate).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
              {run.status === 'completed' && run.portfolioImpact !== null && (
                <div className={`text-sm font-bold ${run.portfolioImpact < -20 ? 'text-red-600' : run.portfolioImpact < -10 ? 'text-amber-600' : 'text-stone-600'}`}>
                  {run.portfolioImpact.toFixed(1)}%
                </div>
              )}
              {run.status === 'running' && (
                <span className="text-xs text-blue-500">В процессе...</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scenarios */}
      <div className="p-4">
        <div className="text-xs font-semibold text-stone-600 uppercase mb-3">Доступные сценарии</div>
        <div className="space-y-2">
          {activeScenarios.map((scenario) => {
            const severity = severityConfig[scenario.severity];
            return (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-stone-800">{scenario.name}</span>
                    <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${severity.bg} ${severity.color}`}>
                      {severity.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                    <span>{typeLabels[scenario.type]}</span>
                    {scenario.lastRunDate && (
                      <>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{new Date(scenario.lastRunDate).toLocaleDateString('ru-RU')}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRunScenario?.(scenario.id);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  Запустить
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
