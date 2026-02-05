"use client";

import { Gauge, MoreVertical, Eye, Edit, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface Constraint {
  id: string;
  policyId: string;
  type: 'asset_limit' | 'concentration' | 'geo' | 'sector' | 'liquidity' | 'leverage' | 'esg';
  metric: 'weight' | 'value' | 'exposure';
  dimension?: string;
  segment?: string;
  limitMin?: number;
  limitMax?: number;
  unit: 'percent' | 'usd' | 'ratio';
  status: 'active' | 'suspended';
  currentValue?: number;
  isBreached?: boolean;
}

interface IpsConstraintsTableProps {
  constraints: Constraint[];
  onOpen: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const typeLabels: Record<string, string> = {
  asset_limit: 'Класс активов',
  concentration: 'Концентрация',
  geo: 'География',
  sector: 'Сектор',
  liquidity: 'Ликвидность',
  leverage: 'Плечо',
  esg: 'ESG',
};

const typeColors: Record<string, string> = {
  asset_limit: 'bg-blue-100 text-blue-700',
  concentration: 'bg-purple-100 text-purple-700',
  geo: 'bg-teal-100 text-teal-700',
  sector: 'bg-orange-100 text-orange-700',
  liquidity: 'bg-cyan-100 text-cyan-700',
  leverage: 'bg-rose-100 text-rose-700',
  esg: 'bg-green-100 text-green-700',
};

const unitSymbols: Record<string, string> = {
  percent: '%',
  usd: '$',
  ratio: 'x',
};

const formatLimit = (min?: number, max?: number, unit: string = 'percent') => {
  const symbol = unitSymbols[unit] || '';
  if (min !== undefined && max !== undefined) {
    return `${min}${symbol} – ${max}${symbol}`;
  }
  if (min !== undefined) {
    return `≥ ${min}${symbol}`;
  }
  if (max !== undefined) {
    return `≤ ${max}${symbol}`;
  }
  return '—';
};

export function IpsConstraintsTable({
  constraints,
  onOpen,
  onEdit,
  onDelete,
}: IpsConstraintsTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (constraints.length === 0) {
    return (
      <div className="p-8 text-center">
        <Gauge className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-500">Нет ограничений</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200/50">
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Тип
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Сегмент
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Лимит
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Текущее
            </th>
            <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Статус
            </th>
            <th className="text-right text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">

            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {constraints.map((constraint) => (
            <tr
              key={constraint.id}
              onClick={() => onOpen(constraint.id)}
              className={`hover:bg-emerald-50/30 cursor-pointer transition-colors ${
                constraint.isBreached ? 'bg-red-50/30' : ''
              }`}
            >
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${typeColors[constraint.type]}`}>
                  {typeLabels[constraint.type]}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-stone-800">
                  {constraint.segment || constraint.dimension || '—'}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-stone-600 font-mono">
                {formatLimit(constraint.limitMin, constraint.limitMax, constraint.unit)}
              </td>
              <td className="px-4 py-3">
                {constraint.currentValue !== undefined ? (
                  <span className={`text-sm font-mono ${constraint.isBreached ? 'text-red-600 font-medium' : 'text-stone-600'}`}>
                    {constraint.currentValue}{unitSymbols[constraint.unit] || ''}
                  </span>
                ) : (
                  <span className="text-sm text-stone-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {constraint.isBreached ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                    <AlertTriangle className="w-3 h-3" />
                    Нарушение
                  </span>
                ) : constraint.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle className="w-3 h-3" />
                    OK
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-stone-100 text-stone-500">
                    Приостановлен
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === constraint.id ? null : constraint.id);
                    }}
                    className="p-1 hover:bg-stone-100 rounded"
                  >
                    <MoreVertical className="w-4 h-4 text-stone-400" />
                  </button>

                  {openMenuId === constraint.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                        }}
                      />
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-stone-200 py-1 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(constraint.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                        >
                          <Eye className="w-4 h-4" />
                          Открыть
                        </button>
                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(constraint.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          >
                            <Edit className="w-4 h-4" />
                            Редактировать
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(constraint.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Удалить
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
