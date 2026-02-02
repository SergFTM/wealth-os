"use client";

import { cn } from '@/lib/utils';

interface Section {
  id: string;
  type: string;
  title: string;
  description: string;
  visibility: 'internal' | 'client';
  disclaimers: string[];
}

interface ReportsClientPreviewProps {
  packName: string;
  asOf: string;
  sections: Section[];
  onClose?: () => void;
}

const typeIcons: Record<string, string> = {
  kpi_summary: '📊',
  net_worth: '💰',
  performance: '📈',
  benchmark: '🎯',
  risk: '⚠️',
  private_capital: '🏦',
  liquidity: '💧',
  fees: '💳',
  tax: '🧾',
  trust: '🏛️',
  custom: '📄',
};

export function ReportsClientPreview({
  packName,
  asOf,
  sections,
  onClose
}: ReportsClientPreviewProps) {
  // Filter to only client-visible sections
  const clientSections = sections.filter(s => s.visibility === 'client');

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-gradient-to-r from-emerald-50 to-amber-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-600 font-medium mb-1">CLIENT PREVIEW</p>
              <h2 className="text-xl font-bold text-stone-800">{packName}</h2>
              <p className="text-sm text-stone-500">As-of: {new Date(asOf).toLocaleDateString('ru-RU')}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {clientSections.length > 0 ? (
            <div className="space-y-6">
              {clientSections.map(section => (
                <div key={section.id} className="border border-stone-200 rounded-xl overflow-hidden">
                  <div className="p-4 bg-stone-50 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{typeIcons[section.type] || '📄'}</span>
                      <h3 className="font-semibold text-stone-800">{section.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-stone-600">{section.description}</p>
                    
                    {/* Placeholder content */}
                    <div className="mt-4 h-32 bg-gradient-to-br from-stone-100 to-stone-50 rounded-lg flex items-center justify-center text-stone-400">
                      Содержимое секции "{section.title}"
                    </div>
                    
                    {/* Disclaimers */}
                    {section.disclaimers.length > 0 && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        {section.disclaimers.map((d, i) => (
                          <p key={i} className="text-xs text-amber-700">⚠️ {d}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-500">
              <p className="text-lg mb-2">Нет секций для клиента</p>
              <p className="text-sm">Все секции помечены как internal</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50">
          <p className="text-xs text-stone-500 text-center">
            Это preview. Клиент увидит только секции с visibility=client.
          </p>
        </div>
      </div>
    </div>
  );
}
