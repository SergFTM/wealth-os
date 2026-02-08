"use client";

import { cn } from "@/lib/utils";

type VoteChoice = 'yes' | 'no' | 'abstain' | 'not_voted';

interface GvVotePillProps {
  vote: VoteChoice;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const voteConfig: Record<VoteChoice, { label: string; color: string; icon: string }> = {
  yes: {
    label: 'За',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: '+'
  },
  no: {
    label: 'Против',
    color: 'bg-rose-100 text-rose-700 border-rose-200',
    icon: '-'
  },
  abstain: {
    label: 'Воздержался',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: '~'
  },
  not_voted: {
    label: 'Не голосовал',
    color: 'bg-stone-100 text-stone-500 border-stone-200',
    icon: '?'
  },
};

export function GvVotePill({ vote, size = 'md', showIcon = true, className }: GvVotePillProps) {
  const config = voteConfig[vote] || voteConfig.not_voted;

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs gap-0.5',
    md: 'px-2 py-1 text-xs gap-1',
    lg: 'px-3 py-1.5 text-sm gap-1.5',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border",
        sizeClasses[size],
        config.color,
        className
      )}
    >
      {showIcon && (
        <span className="font-bold">{config.icon}</span>
      )}
      {config.label}
    </span>
  );
}

interface GvVoteTallyBarProps {
  yes: number;
  no: number;
  abstain: number;
  notVoted?: number;
  showLabels?: boolean;
  className?: string;
}

export function GvVoteTallyBar({ yes, no, abstain, notVoted = 0, showLabels = true, className }: GvVoteTallyBarProps) {
  const total = yes + no + abstain + notVoted;
  if (total === 0) return null;

  const yesPct = (yes / total) * 100;
  const noPct = (no / total) * 100;
  const abstainPct = (abstain / total) * 100;
  const notVotedPct = (notVoted / total) * 100;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="h-3 rounded-full overflow-hidden flex bg-stone-100">
        {yesPct > 0 && (
          <div
            className="bg-emerald-500 transition-all duration-300"
            style={{ width: `${yesPct}%` }}
            title={`За: ${yes} (${yesPct.toFixed(0)}%)`}
          />
        )}
        {noPct > 0 && (
          <div
            className="bg-rose-500 transition-all duration-300"
            style={{ width: `${noPct}%` }}
            title={`Против: ${no} (${noPct.toFixed(0)}%)`}
          />
        )}
        {abstainPct > 0 && (
          <div
            className="bg-amber-400 transition-all duration-300"
            style={{ width: `${abstainPct}%` }}
            title={`Воздержались: ${abstain} (${abstainPct.toFixed(0)}%)`}
          />
        )}
        {notVotedPct > 0 && (
          <div
            className="bg-stone-300 transition-all duration-300"
            style={{ width: `${notVotedPct}%` }}
            title={`Не голосовали: ${notVoted} (${notVotedPct.toFixed(0)}%)`}
          />
        )}
      </div>
      {showLabels && (
        <div className="flex justify-between text-xs text-stone-500">
          <span className="text-emerald-600">За: {yesPct.toFixed(0)}%</span>
          <span className="text-rose-600">Против: {noPct.toFixed(0)}%</span>
          {abstainPct > 0 && <span className="text-amber-600">Возд.: {abstainPct.toFixed(0)}%</span>}
        </div>
      )}
    </div>
  );
}
