"use client";

import { useState } from 'react';

interface StressScenario {
  id: string;
  name: string;
  description: string;
  impact: {
    bucket: string;
    originalNet: number;
    stressedNet: number;
    change: number;
  }[];
}

interface LqStressTestPanelProps {
  scenarios?: StressScenario[];
  onCreateTask?: () => void;
}

const defaultScenarios: StressScenario[] = [
  {
    id: 'stress-001',
    name: '20% Outflow Shock',
    description: 'Увеличение всех оттоков на 20%',
    impact: [
      { bucket: '7d', originalNet: -40000, stressedNet: -81000, change: -102 },
      { bucket: '30d', originalNet: -600000, stressedNet: -777000, change: -29 },
      { bucket: '90d', originalNet: -900000, stressedNet: -1237000, change: -37 }
    ]
  },
  {
    id: 'stress-002',
    name: 'Capital Call Acceleration',
    description: 'Все capital calls на 2 недели раньше',
    impact: [
      { bucket: '7d', originalNet: -40000, stressedNet: -440000, change: -1000 },
      { bucket: '30d', originalNet: -600000, stressedNet: -600000, change: 0 },
      { bucket: '90d', originalNet: -900000, stressedNet: -900000, change: 0 }
    ]
  }
];

export function LqStressTestPanel({ scenarios = defaultScenarios, onCreateTask }: LqStressTestPanelProps) {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(val);
  };

  const active = scenarios.find(s => s.id === activeScenario);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-800">Stress Test (MVP)</h3>
        {onCreateTask && (
          <button
            onClick={onCreateTask}
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
          >
            Создать задачу
          </button>
        )}
      </div>
      
      <div className="flex gap-2 mb-4">
        {scenarios.map(scenario => (
          <button
            key={scenario.id}
            onClick={() => setActiveScenario(activeScenario === scenario.id ? null : scenario.id)}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              activeScenario === scenario.id 
                ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {scenario.name}
          </button>
        ))}
      </div>

      {active ? (
        <div className="space-y-3">
          <p className="text-sm text-stone-600">{active.description}</p>
          <div className="grid grid-cols-3 gap-3">
            {active.impact.map(impact => (
              <div key={impact.bucket} className="p-3 rounded-lg bg-rose-50 border border-rose-100">
                <div className="text-xs text-stone-500 mb-1">{impact.bucket}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm line-through text-stone-400">{formatCurrency(impact.originalNet)}</span>
                  <span className="text-sm font-semibold text-rose-600">{formatCurrency(impact.stressedNet)}</span>
                </div>
                <div className="text-xs text-rose-500 mt-1">
                  {impact.change > 0 ? '+' : ''}{impact.change}%
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-stone-500">Выберите сценарий для анализа влияния на ликвидность</p>
      )}
    </div>
  );
}
