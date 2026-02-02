"use client";

import { cn } from '@/lib/utils';

interface PcVintageMetric {
  id: string;
  vintageYear: number;
  dpi: number;
  rvpi: number;
  tvpi: number;
  irr: number;
  flag: string;
  fundsCount?: number;
}

interface PcVintagePanelProps {
  vintages: PcVintageMetric[];
  onVintageClick?: (year: number) => void;
}

export function PcVintagePanel({ vintages, onVintageClick }: PcVintagePanelProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200/50">
        <h3 className="font-semibold text-stone-800">Vintage Analysis</h3>
        <p className="text-xs text-stone-500 mt-1">Метрики по году vintage</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50/50 sticky top-0">
            <tr>
              <th className="text-left p-3 font-medium text-stone-600">Year</th>
              <th className="text-right p-3 font-medium text-stone-600">DPI</th>
              <th className="text-right p-3 font-medium text-stone-600">RVPI</th>
              <th className="text-right p-3 font-medium text-stone-600">TVPI</th>
              <th className="text-right p-3 font-medium text-stone-600">IRR</th>
              <th className="text-left p-3 font-medium text-stone-600">Flag</th>
            </tr>
          </thead>
          <tbody>
            {vintages.map(v => (
              <tr
                key={v.id}
                onClick={() => onVintageClick?.(v.vintageYear)}
                className="border-t border-stone-100 hover:bg-emerald-50/50 cursor-pointer transition-colors"
              >
                <td className="p-3 font-medium text-stone-800">{v.vintageYear}</td>
                <td className="p-3 text-right text-stone-600">{v.dpi.toFixed(2)}x</td>
                <td className="p-3 text-right text-stone-600">{v.rvpi.toFixed(2)}x</td>
                <td className="p-3 text-right font-medium text-stone-800">{v.tvpi.toFixed(2)}x</td>
                <td className={cn(
                  "p-3 text-right font-medium",
                  v.irr >= 10 ? "text-emerald-600" : v.irr >= 5 ? "text-stone-700" : "text-amber-600"
                )}>
                  {v.irr.toFixed(1)}%
                </td>
                <td className="p-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    v.flag === 'ok' && "bg-emerald-100 text-emerald-700",
                    v.flag === 'underperform' && "bg-rose-100 text-rose-700",
                    v.flag === 'outperform' && "bg-blue-100 text-blue-700"
                  )}>
                    {v.flag === 'ok' ? 'OK' : v.flag === 'underperform' ? '↓' : '↑'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
