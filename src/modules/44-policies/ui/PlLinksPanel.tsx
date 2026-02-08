"use client";

import { getLinkedTypeLabel } from '../engine/policyLinker';

interface PolicyLink {
  id: string;
  policyId?: string;
  policyTitle?: string;
  sopId?: string;
  sopTitle?: string;
  linkedType: 'case' | 'incident' | 'breach' | 'ips';
  linkedId: string;
  linkedTitle: string;
  notes?: string;
  createdAt: string;
}

interface PlLinksPanelProps {
  links: PolicyLink[];
  onSelect?: (link: PolicyLink) => void;
  onAdd?: () => void;
  onRemove?: (link: PolicyLink) => void;
}

const typeColors: Record<string, string> = {
  case: 'bg-blue-50 text-blue-700 border-blue-200',
  incident: 'bg-amber-50 text-amber-700 border-amber-200',
  breach: 'bg-red-50 text-red-700 border-red-200',
  ips: 'bg-purple-50 text-purple-700 border-purple-200',
};

const typeIcons: Record<string, React.ReactNode> = {
  case: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  ),
  incident: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  breach: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  ips: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

export function PlLinksPanel({ links, onSelect, onAdd, onRemove }: PlLinksPanelProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (links.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="text-center">
          <div className="text-stone-400 mb-2">
            <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="text-stone-600 font-medium mb-1">Нет связей</p>
          <p className="text-stone-500 text-sm mb-3">Свяжите документ с кейсами, инцидентами или нарушениями</p>
          {onAdd && (
            <button
              onClick={onAdd}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              + Добавить связь
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="px-4 py-3 bg-stone-50/50 border-b border-stone-200/50 flex items-center justify-between">
        <span className="font-medium text-stone-700">Связи ({links.length})</span>
        {onAdd && (
          <button
            onClick={onAdd}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            + Добавить
          </button>
        )}
      </div>
      <div className="divide-y divide-stone-100">
        {links.map((link) => (
          <div
            key={link.id}
            onClick={() => onSelect?.(link)}
            className="px-4 py-3 hover:bg-stone-50/50 cursor-pointer transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${typeColors[link.linkedType]}`}>
                {typeIcons[link.linkedType]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${typeColors[link.linkedType]}`}>
                    {getLinkedTypeLabel(link.linkedType, 'ru')}
                  </span>
                </div>
                <div className="font-medium text-stone-800 truncate">{link.linkedTitle}</div>
                <div className="text-xs text-stone-500 mt-1">
                  {link.policyTitle || link.sopTitle} • {formatDate(link.createdAt)}
                </div>
                {link.notes && (
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{link.notes}</p>
                )}
              </div>
              {onRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(link);
                  }}
                  className="text-stone-400 hover:text-red-500 p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
