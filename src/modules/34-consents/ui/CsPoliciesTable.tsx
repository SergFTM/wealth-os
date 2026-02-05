"use client";

import React from 'react';
import { CsStatusPill } from './CsStatusPill';
import { MoreHorizontal, Eye, Play, Pause, Copy } from 'lucide-react';

interface SharingPolicy {
  id: string;
  name: string;
  description?: string;
  appliesTo: string;
  status: string;
  rules: unknown[];
}

interface CsPoliciesTableProps {
  policies: SharingPolicy[];
  onOpen?: (id: string) => void;
  onActivate?: (id: string) => void;
  onPause?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  compact?: boolean;
}

const appliesToLabels: Record<string, string> = {
  documents: 'Документы',
  reports: 'Отчеты',
  both: 'Документы и отчеты',
};

export function CsPoliciesTable({
  policies,
  onOpen,
  onActivate,
  onPause,
  onDuplicate,
  compact = false,
}: CsPoliciesTableProps) {
  if (policies.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        Нет политик
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200/50 bg-stone-50/50">
            <th className="text-left py-3 px-4 font-medium text-stone-600">Политика</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Применяется к</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Статус</th>
            {!compact && <th className="text-left py-3 px-4 font-medium text-stone-600">Правил</th>}
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr
              key={policy.id}
              className="border-b border-stone-100 hover:bg-stone-50/50 cursor-pointer"
              onClick={() => onOpen?.(policy.id)}
            >
              <td className="py-3 px-4">
                <div className="font-medium text-stone-800">{policy.name}</div>
                {!compact && policy.description && (
                  <div className="text-xs text-stone-500 truncate max-w-[250px]">{policy.description}</div>
                )}
              </td>
              <td className="py-3 px-4">
                <span className="text-stone-600">
                  {appliesToLabels[policy.appliesTo] || policy.appliesTo}
                </span>
              </td>
              <td className="py-3 px-4">
                <CsStatusPill status={policy.status} />
              </td>
              {!compact && (
                <td className="py-3 px-4 text-stone-600">
                  {Array.isArray(policy.rules) ? policy.rules.length : 0}
                </td>
              )}
              <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                <div className="relative group">
                  <button className="p-1 hover:bg-stone-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-stone-400" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-stone-200 py-1 hidden group-hover:block z-10 min-w-[140px]">
                    <button
                      onClick={() => onOpen?.(policy.id)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> Открыть
                    </button>
                    {policy.status === 'paused' && (
                      <button
                        onClick={() => onActivate?.(policy.id)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-emerald-50 text-emerald-600 flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" /> Активировать
                      </button>
                    )}
                    {policy.status === 'active' && (
                      <button
                        onClick={() => onPause?.(policy.id)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-amber-50 text-amber-600 flex items-center gap-2"
                      >
                        <Pause className="w-4 h-4" /> Приостановить
                      </button>
                    )}
                    <button
                      onClick={() => onDuplicate?.(policy.id)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" /> Дублировать
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
