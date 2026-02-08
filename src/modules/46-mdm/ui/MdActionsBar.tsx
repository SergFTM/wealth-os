"use client";

interface Action {
  key: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
  onClick: () => void;
}

interface MdActionsBarProps {
  actions: Action[];
}

export function MdActionsBar({ actions }: MdActionsBarProps) {
  const getButtonClasses = (variant: Action['variant'] = 'secondary') => {
    const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all';

    switch (variant) {
      case 'primary':
        return `${base} bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm`;
      case 'ghost':
        return `${base} text-stone-600 hover:bg-stone-100`;
      default:
        return `${base} bg-white border border-stone-200 text-stone-700 hover:bg-stone-50`;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action) => (
        <button
          key={action.key}
          onClick={action.onClick}
          className={getButtonClasses(action.variant)}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
}
