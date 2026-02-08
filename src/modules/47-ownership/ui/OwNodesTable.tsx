"use client";

import { OwStatusPill } from './OwStatusPill';

interface OwNode {
  id: string;
  name: string;
  nodeTypeKey: string;
  jurisdiction?: string;
  status: string;
  linksCount?: number;
  updatedAt: string;
}

interface OwNodesTableProps {
  data: OwNode[];
  onRowClick: (node: OwNode) => void;
}

const typeLabels: Record<string, string> = {
  household: 'Домохозяйство',
  trust: 'Траст',
  entity: 'Юр. лицо',
  partnership: 'Партнерство',
  spv: 'SPV',
  account: 'Счет',
  asset: 'Актив',
};

const typeColors: Record<string, string> = {
  household: 'bg-purple-100 text-purple-700',
  trust: 'bg-blue-100 text-blue-700',
  entity: 'bg-emerald-100 text-emerald-700',
  partnership: 'bg-amber-100 text-amber-700',
  spv: 'bg-cyan-100 text-cyan-700',
  account: 'bg-stone-100 text-stone-700',
  asset: 'bg-lime-100 text-lime-700',
};

export function OwNodesTable({ data, onRowClick }: OwNodesTableProps) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        Нет узлов для отображения
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Название</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Тип</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Юрисдикция</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Статус</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Связи</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Обновлено</th>
          </tr>
        </thead>
        <tbody>
          {data.map((node) => (
            <tr
              key={node.id}
              onClick={() => onRowClick(node)}
              className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-stone-800">{node.name}</div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${typeColors[node.nodeTypeKey] || 'bg-stone-100 text-stone-600'}`}>
                  {typeLabels[node.nodeTypeKey] || node.nodeTypeKey}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {node.jurisdiction || '-'}
              </td>
              <td className="px-4 py-3">
                <OwStatusPill status={node.status as 'active' | 'inactive'} />
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {node.linksCount ?? '-'}
              </td>
              <td className="px-4 py-3 text-sm text-stone-500">
                {new Date(node.updatedAt).toLocaleDateString('ru-RU')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OwNodesTable;
