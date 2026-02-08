"use client";

import React from 'react';
import { VdStatusPill } from './VdStatusPill';
import { VdAnomalyPill } from './VdSeverityPill';

interface Invoice {
  id: string;
  vendorId: string;
  vendorName?: string;
  invoiceRef: string;
  amount: number;
  currency?: string;
  invoiceDate: string;
  categoryKey?: string;
  linkedContractId?: string;
  contractName?: string;
  anomalyScore?: number;
  anomalyFlag?: boolean;
  status?: 'pending' | 'approved' | 'paid' | 'disputed' | 'cancelled';
}

interface VdInvoicesTableProps {
  invoices: Invoice[];
  onRowClick?: (invoice: Invoice) => void;
  emptyMessage?: string;
  showVendor?: boolean;
}

const categoryLabels: Record<string, string> = {
  management_fee: 'Management Fee',
  transaction_fee: 'Transaction Fee',
  custody_fee: 'Custody Fee',
  audit_fee: 'Audit Fee',
  legal_fee: 'Legal Fee',
  tax_fee: 'Tax Fee',
  it_services: 'IT Services',
  consulting: 'Consulting',
  subscription: 'Subscription',
  other: 'Other',
};

function formatDate(dateStr: string): string {
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

export function VdInvoicesTable({
  invoices,
  onRowClick,
  emptyMessage = 'Нет счетов',
  showVendor = true,
}: VdInvoicesTableProps) {
  if (invoices.length === 0) {
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
            {showVendor && (
              <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Провайдер</th>
            )}
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Счет</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider text-right">Сумма</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Дата</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Категория</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Контракт</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Аномалия</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Статус</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              onClick={() => onRowClick?.(invoice)}
              className={`hover:bg-stone-50/50 cursor-pointer transition-colors ${
                invoice.anomalyFlag ? 'bg-amber-50/30' : ''
              }`}
            >
              {showVendor && (
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-800">
                    {invoice.vendorName || invoice.vendorId}
                  </div>
                </td>
              )}
              <td className="px-4 py-3">
                <span className="text-sm font-mono text-stone-700">
                  {invoice.invoiceRef}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-sm font-medium text-stone-800">
                  {invoice.currency || 'USD'} {invoice.amount.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-stone-600">
                  {formatDate(invoice.invoiceDate)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-stone-600">
                  {categoryLabels[invoice.categoryKey || ''] || invoice.categoryKey || '—'}
                </span>
              </td>
              <td className="px-4 py-3">
                {invoice.linkedContractId ? (
                  <span className="text-sm text-blue-600">
                    {invoice.contractName || 'Linked'}
                  </span>
                ) : (
                  <span className="text-stone-400 text-sm">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <VdAnomalyPill
                  score={invoice.anomalyScore || 0}
                  flagged={invoice.anomalyFlag || false}
                />
              </td>
              <td className="px-4 py-3">
                {invoice.status ? (
                  <VdStatusPill status={invoice.status} />
                ) : (
                  <span className="text-stone-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
