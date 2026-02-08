"use client";

import React from 'react';
import { VdStatusPill } from './VdStatusPill';

interface Contract {
  id: string;
  name: string;
  vendorId: string;
  vendorName?: string;
  startAt?: string;
  endAt?: string;
  renewalAt?: string;
  status: 'draft' | 'active' | 'expiring' | 'expired' | 'terminated';
  feeModelKey?: string;
}

interface VdContractsTableProps {
  contracts: Contract[];
  onRowClick?: (contract: Contract) => void;
  emptyMessage?: string;
  showVendor?: boolean;
}

const feeModelLabels: Record<string, string> = {
  fixed: 'Фиксированная',
  aum: 'От AUM',
  hourly: 'Почасовая',
  transaction: 'За транзакцию',
  retainer: 'Ретейнер',
  hybrid: 'Гибридная',
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getDaysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function VdContractsTable({ contracts, onRowClick, emptyMessage = 'Нет контрактов', showVendor = true }: VdContractsTableProps) {
  if (contracts.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200/50 text-left">
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Контракт</th>
            {showVendor && (
              <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Провайдер</th>
            )}
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Начало</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Окончание</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Продление</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Fee модель</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Статус</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {contracts.map((contract) => {
            const daysUntilRenewal = getDaysUntil(contract.renewalAt);
            const isUrgent = daysUntilRenewal !== null && daysUntilRenewal <= 30 && daysUntilRenewal >= 0;
            const isOverdue = daysUntilRenewal !== null && daysUntilRenewal < 0;

            return (
              <tr
                key={contract.id}
                onClick={() => onRowClick?.(contract)}
                className="hover:bg-stone-50/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-800">{contract.name}</div>
                </td>
                {showVendor && (
                  <td className="px-4 py-3">
                    <span className="text-sm text-stone-600">
                      {contract.vendorName || contract.vendorId}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3">
                  <span className="text-sm text-stone-600">{formatDate(contract.startAt)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-stone-600">{formatDate(contract.endAt)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-stone-600">{formatDate(contract.renewalAt)}</span>
                    {isUrgent && (
                      <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-700">
                        {daysUntilRenewal}д
                      </span>
                    )}
                    {isOverdue && (
                      <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700">
                        Просрочено
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-stone-600">
                    {feeModelLabels[contract.feeModelKey || ''] || contract.feeModelKey || '—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <VdStatusPill status={contract.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
