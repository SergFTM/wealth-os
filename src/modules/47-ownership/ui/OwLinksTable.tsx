"use client";

import { OwPctPill } from './OwPctPill';

interface OwLink {
  id: string;
  fromNodeId: string;
  fromNodeName?: string;
  toNodeId: string;
  toNodeName?: string;
  ownershipPct: number;
  profitSharePct?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  hasSource?: boolean;
}

interface OwLinksTableProps {
  data: OwLink[];
  onRowClick: (link: OwLink) => void;
}

export function OwLinksTable({ data, onRowClick }: OwLinksTableProps) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        Нет связей для отображения
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">От узла</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">К узлу</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Владение</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Прибыль</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Действует с</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Действует до</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Источник</th>
          </tr>
        </thead>
        <tbody>
          {data.map((link) => (
            <tr
              key={link.id}
              onClick={() => onRowClick(link)}
              className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-stone-800">{link.fromNodeName || link.fromNodeId}</div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="font-medium text-stone-800">{link.toNodeName || link.toNodeId}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <OwPctPill value={link.ownershipPct} type="ownership" />
              </td>
              <td className="px-4 py-3">
                {link.profitSharePct !== undefined ? (
                  <OwPctPill value={link.profitSharePct} type="profit" />
                ) : (
                  <span className="text-stone-400">-</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {new Date(link.effectiveFrom).toLocaleDateString('ru-RU')}
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {link.effectiveTo ? new Date(link.effectiveTo).toLocaleDateString('ru-RU') : '—'}
              </td>
              <td className="px-4 py-3">
                {link.hasSource !== false ? (
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OwLinksTable;
