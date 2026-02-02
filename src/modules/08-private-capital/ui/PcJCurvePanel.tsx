"use client";

interface PcJCurvePanelProps {
  data?: Array<{ year: number; cashFlow: number }>;
}

export function PcJCurvePanel({ data }: PcJCurvePanelProps) {
  const mockData = data || [
    { year: 1, cashFlow: -25 },
    { year: 2, cashFlow: -20 },
    { year: 3, cashFlow: -10 },
    { year: 4, cashFlow: 5 },
    { year: 5, cashFlow: 15 },
    { year: 6, cashFlow: 25 },
    { year: 7, cashFlow: 30 },
    { year: 8, cashFlow: 20 }
  ];

  const maxAbs = Math.max(...mockData.map(d => Math.abs(d.cashFlow)));

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200/50">
        <h3 className="font-semibold text-stone-800">J-Curve</h3>
        <p className="text-xs text-stone-500 mt-1">Типичный паттерн PE cash flows</p>
      </div>
      <div className="p-4">
        <div className="flex items-end justify-between h-32 gap-1">
          {mockData.map((d, i) => {
            const height = (Math.abs(d.cashFlow) / maxAbs) * 100;
            const isNegative = d.cashFlow < 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="relative h-24 w-full flex items-end justify-center">
                  <div
                    className={`w-full max-w-6 rounded-t transition-all ${isNegative ? 'bg-rose-400' : 'bg-emerald-400'}`}
                    style={{ 
                      height: `${height}%`,
                      transform: isNegative ? 'scaleY(-1)' : undefined,
                      transformOrigin: 'bottom'
                    }}
                  />
                </div>
                <div className="text-xs text-stone-500 mt-1">Y{d.year}</div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-4 text-xs text-stone-500">
          <span>← Capital deployed</span>
          <span>Returns →</span>
        </div>
      </div>
    </div>
  );
}
