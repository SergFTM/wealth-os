"use client";

import Link from 'next/link';
import { PaStatusPill, PaClientSafeBadge } from './PaStatusPill';

interface Pack {
  id: string;
  name: string;
  recipientJson: { type: string; org: string };
  purpose: string;
  periodJson: { start: string; end: string; label?: string };
  scopeJson: { scopeType: string; scopeName?: string };
  statusKey: string;
  clientSafe: boolean;
  itemsCount?: number;
  createdAt: string;
}

interface PaPacksTableProps {
  packs: Pack[];
  onOpen: (id: string) => void;
}

const recipientLabels: Record<string, string> = {
  auditor: 'Аудитор',
  bank: 'Банк',
  tax: 'Налоговый',
  legal: 'Юридический',
  committee: 'Комитет',
  investor: 'Инвестор',
  regulator: 'Регулятор',
  other: 'Другое',
};

const scopeLabels: Record<string, string> = {
  household: 'Household',
  entity: 'Юрлицо',
  portfolio: 'Портфель',
  global: 'Глобальный',
};

export function PaPacksTable({ packs, onOpen }: PaPacksTableProps) {
  if (packs.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="font-medium">Пакеты не найдены</p>
        <p className="text-sm mt-1">Создайте первый пакет для отправки документов</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="text-left py-3 px-4 font-medium text-stone-600">Название</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Получатель</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Цель</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Период</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Scope</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Статус</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Docs</th>
            <th className="text-right py-3 px-4 font-medium text-stone-600"></th>
          </tr>
        </thead>
        <tbody>
          {packs.map((pack) => (
            <tr
              key={pack.id}
              className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
              onClick={() => onOpen(pack.id)}
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-stone-800">{pack.name}</span>
                  <PaClientSafeBadge isClientSafe={pack.clientSafe} />
                </div>
              </td>
              <td className="py-3 px-4">
                <div>
                  <span className="text-xs text-stone-500">{recipientLabels[pack.recipientJson.type]}</span>
                  <div className="text-stone-700">{pack.recipientJson.org}</div>
                </div>
              </td>
              <td className="py-3 px-4 text-stone-600 max-w-xs truncate">{pack.purpose}</td>
              <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                {pack.periodJson.label || `${formatDate(pack.periodJson.start)} — ${formatDate(pack.periodJson.end)}`}
              </td>
              <td className="py-3 px-4 text-stone-600">
                {pack.scopeJson.scopeName || scopeLabels[pack.scopeJson.scopeType]}
              </td>
              <td className="py-3 px-4">
                <PaStatusPill status={pack.statusKey} type="pack" />
              </td>
              <td className="py-3 px-4 text-stone-600">
                {pack.itemsCount || 0}
              </td>
              <td className="py-3 px-4 text-right">
                <Link
                  href={`/m/packs/pack/${pack.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Открыть
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

export function PaPacksPreview({ packs, onViewAll }: { packs: Pack[]; onViewAll: () => void }) {
  const recentPacks = packs.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <h3 className="font-medium text-stone-800">Недавние пакеты</h3>
        <button onClick={onViewAll} className="text-sm text-emerald-600 hover:text-emerald-700">
          Все пакеты →
        </button>
      </div>
      <div className="divide-y divide-stone-100">
        {recentPacks.map((pack) => (
          <Link
            key={pack.id}
            href={`/m/packs/pack/${pack.id}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-stone-800 truncate">{pack.name}</span>
                <PaClientSafeBadge isClientSafe={pack.clientSafe} />
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                {recipientLabels[pack.recipientJson.type]} • {pack.recipientJson.org}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PaStatusPill status={pack.statusKey} type="pack" />
            </div>
          </Link>
        ))}
        {recentPacks.length === 0 && (
          <div className="px-4 py-6 text-center text-stone-500 text-sm">
            Нет пакетов
          </div>
        )}
      </div>
    </div>
  );
}
