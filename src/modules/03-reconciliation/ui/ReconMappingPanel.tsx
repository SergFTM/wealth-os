"use client";

import { cn } from '@/lib/utils';

interface ReconMapping {
  id: string;
  feedId: string;
  feedName?: string;
  mappingType: 'symbol' | 'account' | 'entity';
  externalKey: string;
  internalKey?: string | null;
  externalName?: string;
  internalName?: string | null;
  status: 'mapped' | 'unmapped' | 'pending';
  confidence?: number | null;
  approvedBy?: string | null;
  updatedAt: string;
}

interface ReconMappingPanelProps {
  mappings: ReconMapping[];
  loading?: boolean;
  onCreateMapping?: () => void;
  onApproveMapping?: (mappingId: string) => void;
  onEditMapping?: (mapping: ReconMapping) => void;
  clientSafe?: boolean;
}

const statusConfig = {
  mapped: { color: 'bg-emerald-100 text-emerald-700', label: 'Связано' },
  unmapped: { color: 'bg-rose-100 text-rose-700', label: 'Не связано' },
  pending: { color: 'bg-amber-100 text-amber-700', label: 'Ожидает' }
};

const typeLabels: Record<string, string> = {
  symbol: 'Символ',
  account: 'Счёт',
  entity: 'Entity'
};

export function ReconMappingPanel({ 
  mappings, 
  loading, 
  onCreateMapping, 
  onApproveMapping,
  onEditMapping,
  clientSafe 
}: ReconMappingPanelProps) {
  // Client-safe mode hides this panel
  if (clientSafe) return null;

  const unmappedCount = mappings.filter(m => m.status === 'unmapped').length;
  const pendingCount = mappings.filter(m => m.status === 'pending').length;

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-800">Маппинг идентификаторов</h3>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-stone-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const priorityMappings = [
    ...mappings.filter(m => m.status === 'unmapped'),
    ...mappings.filter(m => m.status === 'pending'),
    ...mappings.filter(m => m.status === 'mapped').slice(0, 3)
  ].slice(0, 8);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-stone-800">Маппинг идентификаторов</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {unmappedCount > 0 && (
              <span className="text-rose-600 font-medium">{unmappedCount} не связано</span>
            )}
            {unmappedCount > 0 && pendingCount > 0 && ' • '}
            {pendingCount > 0 && (
              <span className="text-amber-600 font-medium">{pendingCount} ожидает</span>
            )}
          </p>
        </div>
        {onCreateMapping && (
          <button
            onClick={onCreateMapping}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            + Добавить маппинг
          </button>
        )}
      </div>

      {priorityMappings.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="text-stone-500 text-sm">Все идентификаторы связаны</p>
        </div>
      ) : (
        <div className="space-y-2">
          {priorityMappings.map((mapping) => (
            <div 
              key={mapping.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-colors",
                mapping.status === 'unmapped' && "bg-rose-50/50 border-rose-200",
                mapping.status === 'pending' && "bg-amber-50/50 border-amber-200",
                mapping.status === 'mapped' && "bg-stone-50/50 border-stone-200"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600">
                  {typeLabels[mapping.mappingType]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-stone-800 truncate">
                      {mapping.externalName || mapping.externalKey}
                    </span>
                    <svg className="w-4 h-4 text-stone-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span className={cn(
                      "truncate",
                      mapping.internalName ? "text-stone-600" : "text-stone-400 italic"
                    )}>
                      {mapping.internalName || mapping.internalKey || 'Не связано'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 truncate">
                    {mapping.feedName || mapping.feedId}
                    {mapping.confidence && ` • ${mapping.confidence}% уверенность`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <span className={cn("px-2 py-0.5 rounded text-xs font-medium", statusConfig[mapping.status].color)}>
                  {statusConfig[mapping.status].label}
                </span>
                {mapping.status === 'pending' && onApproveMapping && (
                  <button
                    onClick={() => onApproveMapping(mapping.id)}
                    className="px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                  >
                    Одобрить
                  </button>
                )}
                {mapping.status === 'unmapped' && onEditMapping && (
                  <button
                    onClick={() => onEditMapping(mapping)}
                    className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    Связать
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
