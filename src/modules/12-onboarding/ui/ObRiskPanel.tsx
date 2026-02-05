"use client";

interface RiskScore {
  id: string;
  caseId: string;
  score: number;
  tier: string;
  drivers: string[];
  lastCalculatedAt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ObRiskPanelProps {
  scores: RiskScore[];
  onRecalc?: (caseId: string) => void;
  compact?: boolean;
}

const tierColors: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};

const tierLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function ObRiskPanel({ scores, onRecalc, compact }: ObRiskPanelProps) {
  const distribution = {
    low: scores.filter(s => s.tier === 'low').length,
    medium: scores.filter(s => s.tier === 'medium').length,
    high: scores.filter(s => s.tier === 'high').length,
  };

  const highRisk = scores
    .filter(s => s.tier === 'high' || s.score >= 60)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Distribution */}
      <div className="grid grid-cols-3 gap-2">
        {(['low', 'medium', 'high'] as const).map((tier) => (
          <div key={tier} className={`p-3 rounded-lg border ${tierColors[tier]}`}>
            <div className="text-xs font-medium opacity-80">{tierLabels[tier]}</div>
            <div className="text-lg font-bold">{distribution[tier]}</div>
          </div>
        ))}
      </div>

      {/* High risk cases */}
      {highRisk.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-stone-600 mb-2">Высокий риск</h4>
          <div className="space-y-2">
            {highRisk.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-red-50/50 border border-red-100">
                <div>
                  <div className="text-sm font-medium text-stone-800">Case: {r.caseId}</div>
                  <div className="text-xs text-stone-500">{r.drivers.slice(0, 2).join(', ')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-red-700">{r.score}</span>
                  {!compact && onRecalc && (
                    <button
                      onClick={() => onRecalc(r.caseId)}
                      className="px-2 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded"
                    >
                      Пересчитать
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-stone-400 italic">
        Риск оценка информационная, требует проверки человеком.
      </p>
    </div>
  );
}
