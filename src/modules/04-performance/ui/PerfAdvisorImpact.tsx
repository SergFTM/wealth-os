"use client";

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Advisor {
  id: string;
  name: string;
  mandate: string;
  aum: number;
  currency: string;
  periodReturn?: number;
  excess?: number;
}

interface PerfAdvisorImpactProps {
  advisors: Advisor[];
  clientSafe?: boolean;
  onAdvisorClick?: (advisorId: string) => void;
}

function formatCurrency(value: number, currency: string): string {
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CHF: 'CHF ' };
  const symbol = symbols[currency] || currency + ' ';
  if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
  return `${symbol}${value.toLocaleString()}`;
}

export function PerfAdvisorImpact({ advisors, clientSafe, onAdvisorClick }: PerfAdvisorImpactProps) {
  const router = useRouter();

  if (clientSafe) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-800">Влияние консультантов</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push('/m/performance/list?tab=advisors')}
        >
          Сравнить →
        </Button>
      </div>
      
      <div className="space-y-3">
        {advisors.map(advisor => (
          <div
            key={advisor.id}
            onClick={() => onAdvisorClick?.(advisor.id)}
            className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-stone-100 cursor-pointer transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-stone-800 truncate">{advisor.name}</p>
              <p className="text-xs text-stone-500 truncate">{advisor.mandate}</p>
            </div>
            <div className="text-right ml-3">
              <p className="text-sm font-medium text-stone-700">
                {formatCurrency(advisor.aum, advisor.currency)}
              </p>
              <div className="flex items-center justify-end gap-2 text-xs">
                {advisor.periodReturn !== undefined && (
                  <span className={cn(
                    "font-medium",
                    advisor.periodReturn >= 0 ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {advisor.periodReturn >= 0 ? '+' : ''}{advisor.periodReturn.toFixed(1)}%
                  </span>
                )}
                {advisor.excess !== undefined && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded",
                    advisor.excess >= 0 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-rose-100 text-rose-700"
                  )}>
                    α {advisor.excess >= 0 ? '+' : ''}{advisor.excess.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
