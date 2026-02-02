"use client";

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface BreakdownItem {
  segment: string;
  weight: number;
  return?: number;
  contribution?: number;
}

interface BreakdownSection {
  dimension: string;
  label: string;
  items: BreakdownItem[];
}

interface PerfAllocationBreakdownProps {
  sections: BreakdownSection[];
  onSegmentClick?: (dimension: string, segment: string) => void;
}

const dimensionColors: Record<string, string[]> = {
  assetClass: ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-stone-400'],
  strategy: ['bg-indigo-500', 'bg-cyan-500', 'bg-orange-500', 'bg-pink-500', 'bg-lime-500', 'bg-stone-400'],
  geography: ['bg-blue-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-purple-600', 'bg-stone-400'],
  liquidity: ['bg-teal-500', 'bg-orange-500', 'bg-stone-400']
};

export function PerfAllocationBreakdown({ sections, onSegmentClick }: PerfAllocationBreakdownProps) {
  const router = useRouter();

  const handleClick = (dimension: string, segment: string) => {
    if (onSegmentClick) {
      onSegmentClick(dimension, segment);
    } else {
      router.push(`/m/performance/list?tab=attribution&dimension=${dimension}&segment=${segment}`);
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {sections.map(section => {
        const colors = dimensionColors[section.dimension] || dimensionColors.assetClass;
        const total = section.items.reduce((sum, item) => sum + item.weight, 0);
        
        return (
          <div 
            key={section.dimension}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4"
          >
            <h4 className="text-sm font-semibold text-stone-700 mb-3">{section.label}</h4>
            
            {/* Progress bar */}
            <div className="h-3 rounded-full bg-stone-100 overflow-hidden flex mb-3">
              {section.items.map((item, i) => (
                <div
                  key={item.segment}
                  className={cn("h-full transition-all", colors[i % colors.length])}
                  style={{ width: `${(item.weight / total) * 100}%` }}
                />
              ))}
            </div>
            
            {/* Items list */}
            <div className="space-y-1.5">
              {section.items.slice(0, 5).map((item, i) => (
                <button
                  key={item.segment}
                  onClick={() => handleClick(section.dimension, item.segment)}
                  className="w-full flex items-center justify-between text-xs hover:bg-stone-50 rounded px-1 py-0.5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", colors[i % colors.length])} />
                    <span className="text-stone-600 truncate max-w-20">{item.segment}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">{item.weight.toFixed(1)}%</span>
                    {item.contribution !== undefined && (
                      <span className={cn(
                        "font-medium",
                        item.contribution >= 0 ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {item.contribution >= 0 ? '+' : ''}{item.contribution.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
