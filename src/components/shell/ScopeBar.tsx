"use client";

import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Scope = 'household' | 'entity' | 'portfolio' | 'account';

export function ScopeBar() {
  const { t, scope, setScope, asOfDate, setAsOfDate } = useApp();
  
  const scopes: Scope[] = ['household', 'entity', 'portfolio', 'account'];

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Scope Switcher */}
      <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
        {scopes.map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              scope === s 
                ? "bg-white shadow-sm text-emerald-700" 
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            {t.scope[s]}
          </button>
        ))}
      </div>

      {/* As-of Date */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-500">As of:</span>
        <input
          type="date"
          value={asOfDate}
          onChange={(e) => setAsOfDate(e.target.value)}
          className="px-2 py-1 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
      </div>
    </div>
  );
}
