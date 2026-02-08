"use client";

interface ConcentrationMetric {
  id: string;
  type: string;
  targetName: string;
  value: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface OwConcentrationsPanelProps {
  metrics: ConcentrationMetric[];
  summary?: {
    totalNodes: number;
    totalLinks: number;
    avgOwnershipDepth: number;
    maxOwnershipDepth: number;
    riskScore: number;
  };
  onMetricClick?: (metric: ConcentrationMetric) => void;
}

const riskColors: Record<string, { bg: string; text: string; border: string }> = {
  low: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const riskLabels: Record<string, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критичный',
};

export function OwConcentrationsPanel({ metrics, summary, onMetricClick }: OwConcentrationsPanelProps) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3 bg-white/80 rounded-lg border border-stone-200/50">
            <div className="text-xs text-stone-500">Узлы</div>
            <div className="text-lg font-semibold text-stone-800">{summary.totalNodes}</div>
          </div>
          <div className="p-3 bg-white/80 rounded-lg border border-stone-200/50">
            <div className="text-xs text-stone-500">Связи</div>
            <div className="text-lg font-semibold text-stone-800">{summary.totalLinks}</div>
          </div>
          <div className="p-3 bg-white/80 rounded-lg border border-stone-200/50">
            <div className="text-xs text-stone-500">Средняя глубина</div>
            <div className="text-lg font-semibold text-stone-800">{summary.avgOwnershipDepth}</div>
          </div>
          <div className="p-3 bg-white/80 rounded-lg border border-stone-200/50">
            <div className="text-xs text-stone-500">Макс. глубина</div>
            <div className="text-lg font-semibold text-stone-800">{summary.maxOwnershipDepth}</div>
          </div>
          <div className={`p-3 rounded-lg border ${summary.riskScore > 50 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="text-xs text-stone-500">Риск-скор</div>
            <div className={`text-lg font-semibold ${summary.riskScore > 50 ? 'text-red-700' : 'text-emerald-700'}`}>
              {summary.riskScore}/100
            </div>
          </div>
        </div>
      )}

      {/* Metrics */}
      {metrics.length === 0 ? (
        <div className="p-6 text-center text-stone-500 bg-white/80 rounded-xl border border-stone-200/50">
          <svg className="w-12 h-12 mx-auto text-emerald-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">Концентрации в норме</p>
          <p className="text-sm mt-1">Не обнаружено высоких концентраций риска</p>
        </div>
      ) : (
        <div className="space-y-2">
          {metrics.map((metric) => {
            const colors = riskColors[metric.riskLevel] || riskColors.low;

            return (
              <div
                key={metric.id}
                onClick={() => onMetricClick?.(metric)}
                className={`p-4 rounded-lg border ${colors.bg} ${colors.border} ${onMetricClick ? 'cursor-pointer hover:shadow-md' : ''} transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center font-bold`}>
                      {metric.value.toFixed(0)}%
                    </div>
                    <div>
                      <div className={`font-medium ${colors.text}`}>{metric.targetName}</div>
                      <div className="text-sm text-stone-500">{metric.description}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {riskLabels[metric.riskLevel]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OwConcentrationsPanel;
