"use client";

import { cn } from "@/lib/utils";

interface GvQuorumBadgeProps {
  participationPct: number;
  requiredPct: number;
  quorumReached: boolean;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  className?: string;
}

export function GvQuorumBadge({
  participationPct,
  requiredPct,
  quorumReached,
  size = 'md',
  showProgress = false,
  className
}: GvQuorumBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const progressWidth = Math.min(100, (participationPct / requiredPct) * 100);

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full font-medium border",
          sizeClasses[size],
          quorumReached
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : participationPct >= requiredPct - 10
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-rose-50 text-rose-700 border-rose-200"
        )}
      >
        <svg
          className={cn(
            "flex-shrink-0",
            size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {quorumReached ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          )}
        </svg>
        <span>
          {participationPct.toFixed(0)}% / {requiredPct}%
        </span>
      </span>

      {showProgress && (
        <div className="h-1 bg-stone-100 rounded-full overflow-hidden w-full min-w-[60px]">
          <div
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              quorumReached
                ? "bg-emerald-500"
                : participationPct >= requiredPct - 10
                ? "bg-amber-500"
                : "bg-rose-500"
            )}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      )}
    </div>
  );
}

interface GvQuorumDetailProps {
  totalWeight: number;
  participatingWeight: number;
  requiredWeight: number;
  requiredPct: number;
  quorumReached: boolean;
  deficit?: number;
  className?: string;
}

export function GvQuorumDetail({
  totalWeight,
  participatingWeight,
  requiredWeight,
  requiredPct,
  quorumReached,
  deficit = 0,
  className
}: GvQuorumDetailProps) {
  const participationPct = totalWeight > 0 ? (participatingWeight / totalWeight) * 100 : 0;
  const progressWidth = Math.min(100, (participatingWeight / requiredWeight) * 100);

  return (
    <div className={cn("bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-stone-700">Кворум</h4>
        <GvQuorumBadge
          participationPct={participationPct}
          requiredPct={requiredPct}
          quorumReached={quorumReached}
          size="sm"
        />
      </div>

      <div className="space-y-3">
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500 rounded-full",
              quorumReached ? "bg-emerald-500" : "bg-amber-500"
            )}
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-semibold text-stone-800">{participatingWeight}</p>
            <p className="text-xs text-stone-500">Проголосовало</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-stone-800">{requiredWeight}</p>
            <p className="text-xs text-stone-500">Требуется</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-stone-800">{totalWeight}</p>
            <p className="text-xs text-stone-500">Всего</p>
          </div>
        </div>

        {!quorumReached && deficit > 0 && (
          <p className="text-xs text-amber-600 text-center">
            Не хватает {deficit.toFixed(0)} голосов для кворума
          </p>
        )}

        {quorumReached && (
          <p className="text-xs text-emerald-600 text-center">
            Кворум достигнут
          </p>
        )}
      </div>
    </div>
  );
}
