"use client";

import { Home, Building2, Briefcase, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ScopeOption {
  id: string;
  type: 'household' | 'entity' | 'portfolio';
  name: string;
}

interface IpsScopeSwitcherProps {
  scopes: ScopeOption[];
  currentScope?: ScopeOption;
  onScopeChange: (scope: ScopeOption) => void;
}

const scopeIcons: Record<string, React.ReactNode> = {
  household: <Home className="w-4 h-4" />,
  entity: <Building2 className="w-4 h-4" />,
  portfolio: <Briefcase className="w-4 h-4" />,
};

const scopeLabels: Record<string, string> = {
  household: 'Хозяйство',
  entity: 'Юр. лицо',
  portfolio: 'Портфель',
};

export function IpsScopeSwitcher({
  scopes,
  currentScope,
  onScopeChange,
}: IpsScopeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const groupedScopes = scopes.reduce((acc, scope) => {
    if (!acc[scope.type]) acc[scope.type] = [];
    acc[scope.type].push(scope);
    return acc;
  }, {} as Record<string, ScopeOption[]>);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-white border border-stone-200 text-stone-700
          hover:bg-stone-50 hover:border-stone-300
          transition-all min-w-[200px]
        "
      >
        {currentScope ? (
          <>
            <span className="text-emerald-600">{scopeIcons[currentScope.type]}</span>
            <span className="flex-1 text-left text-sm font-medium truncate">
              {currentScope.name}
            </span>
          </>
        ) : (
          <span className="flex-1 text-left text-sm text-stone-500">
            Выберите scope
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-20 max-h-80 overflow-y-auto">
            {Object.entries(groupedScopes).map(([type, items]) => (
              <div key={type}>
                <div className="px-3 py-1.5 text-xs font-medium text-stone-500 uppercase tracking-wider">
                  {scopeLabels[type]}
                </div>
                {items.map((scope) => (
                  <button
                    key={scope.id}
                    onClick={() => {
                      onScopeChange(scope);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 text-left
                      hover:bg-stone-50 transition-colors
                      ${currentScope?.id === scope.id ? 'bg-emerald-50 text-emerald-700' : 'text-stone-700'}
                    `}
                  >
                    <span className={currentScope?.id === scope.id ? 'text-emerald-600' : 'text-stone-400'}>
                      {scopeIcons[scope.type]}
                    </span>
                    <span className="text-sm truncate">{scope.name}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
