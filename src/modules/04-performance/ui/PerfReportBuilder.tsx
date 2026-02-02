"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PerfReportBuilderProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: ReportConfig) => void;
  initialConfig?: Partial<ReportConfig>;
}

interface ReportConfig {
  name: string;
  portfolioId: string;
  method: 'TWR' | 'MWR';
  timeframe: string;
  benchmarkId?: string;
  filters: {
    assetClass?: string[];
    geography?: string[];
    strategy?: string[];
    liquidity?: string[];
  };
  isShared: boolean;
}

const timeframes = ['1M', '3M', '6M', 'YTD', '1Y', '3Y', 'ALL'];
const methods = [
  { value: 'TWR', label: 'TWR (Time-Weighted)' },
  { value: 'MWR', label: 'MWR (Money-Weighted)' }
];

export function PerfReportBuilder({ open, onClose, onSave, initialConfig }: PerfReportBuilderProps) {
  const [config, setConfig] = useState<ReportConfig>({
    name: initialConfig?.name || '',
    portfolioId: initialConfig?.portfolioId || 'portfolio-001',
    method: initialConfig?.method || 'TWR',
    timeframe: initialConfig?.timeframe || 'YTD',
    benchmarkId: initialConfig?.benchmarkId,
    filters: initialConfig?.filters || {},
    isShared: initialConfig?.isShared || false
  });

  if (!open) return null;

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800">Настройки отчёта</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Название отчёта</label>
            <input
              type="text"
              value={config.name}
              onChange={e => setConfig(c => ({ ...c, name: e.target.value }))}
              placeholder="Основной портфель — YTD"
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Method */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Метод расчёта</label>
            <div className="grid grid-cols-2 gap-2">
              {methods.map(m => (
                <button
                  key={m.value}
                  onClick={() => setConfig(c => ({ ...c, method: m.value as 'TWR' | 'MWR' }))}
                  className={cn(
                    "p-3 rounded-lg border text-sm font-medium transition-colors text-left",
                    config.method === m.value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-stone-200 hover:bg-stone-50"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Период</label>
            <div className="flex flex-wrap gap-2">
              {timeframes.map(tf => (
                <button
                  key={tf}
                  onClick={() => setConfig(c => ({ ...c, timeframe: tf }))}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    config.timeframe === tf
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-stone-200 hover:bg-stone-50"
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Benchmark */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Бенчмарк</label>
            <select
              value={config.benchmarkId || ''}
              onChange={e => setConfig(c => ({ ...c, benchmarkId: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Без бенчмарка</option>
              <option value="bm-001">MSCI ACWI</option>
              <option value="bm-002">S&P 500</option>
              <option value="bm-003">60/40 Portfolio</option>
              <option value="bm-004">Bloomberg US Agg</option>
              <option value="bm-005">MSCI EM</option>
            </select>
          </div>

          {/* Shared toggle */}
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
            <div>
              <p className="font-medium text-stone-800">Показывать клиенту</p>
              <p className="text-xs text-stone-500">Отчёт будет виден в client-safe режиме</p>
            </div>
            <button
              onClick={() => setConfig(c => ({ ...c, isShared: !c.isShared }))}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                config.isShared ? "bg-emerald-500" : "bg-stone-300"
              )}
            >
              <div className={cn(
                "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow",
                config.isShared ? "translate-x-6" : "translate-x-0.5"
              )} />
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 flex gap-2">
          <Button variant="primary" className="flex-1" onClick={handleSave}>
            Сохранить
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Отмена
          </Button>
        </div>
      </div>
    </>
  );
}
