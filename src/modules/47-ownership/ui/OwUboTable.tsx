"use client";

import { OwPctPill } from './OwPctPill';

interface OwUbo {
  id: string;
  personName: string;
  personMdmId: string;
  targetNodeName: string;
  targetNodeId: string;
  computedPct: number;
  pathsCount: number;
  computedAt: string;
}

interface OwUboTableProps {
  data: OwUbo[];
  onRowClick: (ubo: OwUbo) => void;
}

export function OwUboTable({ data, onRowClick }: OwUboTableProps) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        <div className="mb-4">
          <svg className="w-12 h-12 mx-auto text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="font-medium text-stone-600">Нет записей UBO</p>
        <p className="text-sm mt-1">Запустите расчет UBO для выявления конечных бенефициаров</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Бенефициар</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Сущность</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Доля</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Путей</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Рассчитано</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ubo) => (
            <tr
              key={ubo.id}
              onClick={() => onRowClick(ubo)}
              className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-emerald-700">
                      {ubo.personName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-stone-800">{ubo.personName}</div>
                    <div className="text-xs text-stone-400">{ubo.personMdmId}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-stone-700">{ubo.targetNodeName}</div>
              </td>
              <td className="px-4 py-3">
                <OwPctPill value={ubo.computedPct} type="ownership" size="md" />
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {ubo.pathsCount}
              </td>
              <td className="px-4 py-3 text-sm text-stone-500">
                {new Date(ubo.computedAt).toLocaleString('ru-RU')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OwUboTable;
