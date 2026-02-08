"use client";

export interface ActionItem {
  key: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

interface ActionsBarProps {
  actions: ActionItem[];
  onAction: (key: string) => void;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
  secondary: 'bg-white/80 text-stone-700 border border-stone-200 hover:bg-stone-50',
  ghost: 'text-stone-500 hover:text-stone-700 hover:bg-stone-100',
};

export function ActionsBar({ actions, onAction }: ActionsBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.key}
          onClick={() => onAction(action.key)}
          disabled={action.disabled}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            ${variantClasses[action.variant || 'secondary']}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
