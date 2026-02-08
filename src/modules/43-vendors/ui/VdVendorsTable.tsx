"use client";

import React from 'react';
import { VdStatusPill } from './VdStatusPill';
import { VdSeverityPill } from './VdSeverityPill';

interface Vendor {
  id: string;
  name: string;
  vendorType: string;
  status: 'active' | 'paused' | 'onboarding' | 'terminated';
  primaryContactJson?: {
    name?: string;
    email?: string;
  };
  riskRatingKey?: 'low' | 'medium' | 'high';
  contractsCount?: number;
  spendYtd?: number;
}

interface VdVendorsTableProps {
  vendors: Vendor[];
  onRowClick?: (vendor: Vendor) => void;
  emptyMessage?: string;
  showSpend?: boolean;
}

const vendorTypeLabels: Record<string, string> = {
  bank: 'Банк',
  broker: 'Брокер',
  auditor: 'Аудитор',
  legal: 'Юрист',
  tax_advisor: 'Налоги',
  custodian: 'Кастодиан',
  it: 'IT',
  insurance: 'Страхование',
  consultant: 'Консультант',
  other: 'Другое',
};

export function VdVendorsTable({ vendors, onRowClick, emptyMessage = 'Нет провайдеров', showSpend = true }: VdVendorsTableProps) {
  if (vendors.length === 0) {
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
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Провайдер</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Тип</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Статус</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Контакт</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Риск</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider text-right">Контракты</th>
            {showSpend && (
              <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider text-right">Расход YTD</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {vendors.map((vendor) => (
            <tr
              key={vendor.id}
              onClick={() => onRowClick?.(vendor)}
              className="hover:bg-stone-50/50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-stone-800">{vendor.name}</div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-stone-600">
                  {vendorTypeLabels[vendor.vendorType] || vendor.vendorType}
                </span>
              </td>
              <td className="px-4 py-3">
                <VdStatusPill status={vendor.status} />
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-stone-600">
                  {vendor.primaryContactJson?.name || '—'}
                </div>
                {vendor.primaryContactJson?.email && (
                  <div className="text-xs text-stone-400">{vendor.primaryContactJson.email}</div>
                )}
              </td>
              <td className="px-4 py-3">
                {vendor.riskRatingKey ? (
                  <VdSeverityPill severity={vendor.riskRatingKey} variant="risk" />
                ) : (
                  <span className="text-stone-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-sm font-medium text-stone-700">
                  {vendor.contractsCount ?? 0}
                </span>
              </td>
              {showSpend && (
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-medium text-stone-700">
                    ${(vendor.spendYtd ?? 0).toLocaleString()}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
