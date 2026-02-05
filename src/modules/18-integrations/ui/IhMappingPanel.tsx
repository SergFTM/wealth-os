"use client";

import { Link2, Link2Off, Edit, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { IhStatusPill } from './IhStatusPill';

interface Mapping {
  id: string;
  connectorId: string;
  mappingType: 'coa' | 'instrument' | 'entity';
  sourceCode: string;
  sourceName: string;
  targetCode: string | null;
  targetName: string | null;
  status: 'mapped' | 'gap';
  confidence: number;
  lastUsedAt: string | null;
  notes: string | null;
}

interface IhMappingPanelProps {
  mappings: Mapping[];
  connectorNames?: Record<string, string>;
  onRowClick?: (mapping: Mapping) => void;
  onMap?: (mapping: Mapping) => void;
  onEdit?: (mapping: Mapping) => void;
  filterType?: 'coa' | 'instrument' | 'entity' | 'all';
  filterStatus?: 'mapped' | 'gap' | 'all';
  compact?: boolean;
}

const typeLabels: Record<string, string> = {
  coa: 'COA',
  instrument: 'Инструмент',
  entity: 'Контрагент',
};

export function IhMappingPanel({
  mappings,
  connectorNames = {},
  onRowClick,
  onMap,
  onEdit,
  filterType = 'all',
  filterStatus = 'all',
  compact = false,
}: IhMappingPanelProps) {
  let filteredMappings = mappings;

  if (filterType !== 'all') {
    filteredMappings = filteredMappings.filter(m => m.mappingType === filterType);
  }

  if (filterStatus !== 'all') {
    filteredMappings = filteredMappings.filter(m => m.status === filterStatus);
  }

  const displayMappings = compact ? filteredMappings.slice(0, 10) : filteredMappings;

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 90) return 'text-emerald-600 bg-emerald-50';
    if (confidence >= 70) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Тип</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Источник</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase"></th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Цель</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              {!compact && (
                <>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Confidence</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Коннектор</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Действия</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {displayMappings.map((mapping) => (
              <tr
                key={mapping.id}
                onClick={() => onRowClick?.(mapping)}
                className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-stone-600 bg-stone-100 rounded">
                    {mapping.status === 'mapped' ? (
                      <Link2 className="w-3 h-3" />
                    ) : (
                      <Link2Off className="w-3 h-3" />
                    )}
                    {typeLabels[mapping.mappingType]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-stone-800">{mapping.sourceCode}</div>
                  <div className="text-xs text-stone-500">{mapping.sourceName}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <ArrowRight className={`w-4 h-4 ${mapping.status === 'mapped' ? 'text-emerald-500' : 'text-stone-300'}`} />
                </td>
                <td className="px-4 py-3">
                  {mapping.targetCode ? (
                    <>
                      <div className="font-semibold text-stone-800">{mapping.targetCode}</div>
                      <div className="text-xs text-stone-500">{mapping.targetName}</div>
                    </>
                  ) : (
                    <span className="text-stone-400 italic">Не сопоставлено</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <IhStatusPill status={mapping.status} size="sm" />
                </td>
                {!compact && (
                  <>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${getConfidenceColor(mapping.confidence)}`}>
                        {mapping.confidence}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {connectorNames[mapping.connectorId] || mapping.connectorId}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {mapping.status === 'gap' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMap?.(mapping);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Link2 className="w-3 h-3" />
                            Map
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit?.(mapping);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredMappings.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет маппингов для отображения
        </div>
      )}

      {/* Summary stats */}
      <div className="px-4 py-3 bg-stone-50 border-t border-stone-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle className="w-3.5 h-3.5" />
              {filteredMappings.filter(m => m.status === 'mapped').length} mapped
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" />
              {filteredMappings.filter(m => m.status === 'gap').length} gaps
            </span>
          </div>
          <span className="text-stone-500">
            Всего: {filteredMappings.length}
          </span>
        </div>
      </div>
    </div>
  );
}
