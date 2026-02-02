"use client";

interface PcPmeData {
  fundName: string;
  fundIrr: number;
  benchmarkIrr: number;
  pme: number;
}

interface PcPmeCompareProps {
  data: PcPmeData[];
}

export function PcPmeCompare({ data }: PcPmeCompareProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200/50">
        <h3 className="font-semibold text-stone-800">PME Comparison</h3>
        <p className="text-xs text-stone-500 mt-1">Public Market Equivalent (MVP)</p>
      </div>
      <div className="p-4">
        {data.length > 0 ? (
          <div className="space-y-3">
            {data.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <div>
                  <div className="font-medium text-stone-800">{d.fundName}</div>
                  <div className="text-xs text-stone-500">IRR: {d.fundIrr.toFixed(1)}% vs Benchmark: {d.benchmarkIrr.toFixed(1)}%</div>
                </div>
                <div className={`text-lg font-bold ${d.pme >= 1 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {d.pme.toFixed(2)}x
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-stone-500">
            <div className="text-2xl mb-2">📊</div>
            <p>PME данные будут доступны</p>
            <p className="text-xs mt-1">Сравнение с S&P 500, MSCI</p>
          </div>
        )}
      </div>
    </div>
  );
}
