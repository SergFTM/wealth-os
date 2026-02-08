"use client";

import { ENTITY_TYPE_KEYS } from '../config';

interface PhilEntity {
  id: string;
  name: string;
  entityTypeKey: keyof typeof ENTITY_TYPE_KEYS;
  jurisdiction?: string;
  status: 'active' | 'inactive';
  annualBudget?: number;
  currency?: string;
}

interface PhEntitiesTableProps {
  entities: PhilEntity[];
  onRowClick?: (entity: PhilEntity) => void;
  emptyMessage?: string;
}

export function PhEntitiesTable({ entities, onRowClick, emptyMessage = 'Нет структур' }: PhEntitiesTableProps) {
  if (entities.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        {emptyMessage}
      </div>
    );
  }

  const formatCurrency = (amount?: number, currency: string = 'USD') => {
    if (amount === undefined) return '—';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Название</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Тип</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Юрисдикция</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Статус</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Годовой бюджет</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {entities.map((entity) => {
            const typeConfig = ENTITY_TYPE_KEYS[entity.entityTypeKey];
            return (
              <tr
                key={entity.id}
                onClick={() => onRowClick?.(entity)}
                className="hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-stone-900">{entity.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${typeConfig?.color || 'stone'}-100 text-${typeConfig?.color || 'stone'}-700`}>
                    {typeConfig?.ru || entity.entityTypeKey}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-600">{entity.jurisdiction || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    entity.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {entity.status === 'active' ? 'Активна' : 'Неактивна'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-stone-700">
                  {formatCurrency(entity.annualBudget, entity.currency)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
