"use client";

import { CheckCircle, Clock, XCircle, Calendar, Play } from 'lucide-react';

interface FeeContract {
  id: string;
  clientId: string;
  householdId: string;
  name: string;
  scheduleId: string;
  billingFrequency: 'monthly' | 'quarterly';
  startDate: string;
  endDate: string | null;
  status: 'active' | 'inactive';
  nextBillingDate: string;
  docIds: string[];
}

interface FeContractsTableProps {
  contracts: FeeContract[];
  onRowClick?: (contract: FeeContract) => void;
  onRunFees?: (contract: FeeContract) => void;
  clientNames?: Record<string, string>;
  scheduleNames?: Record<string, string>;
  compact?: boolean;
}

const statusConfig = {
  active: { label: 'Активен', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
  inactive: { label: 'Неактивен', color: 'text-stone-500', bg: 'bg-stone-100', Icon: XCircle },
};

const frequencyLabels = {
  monthly: 'Ежемесячно',
  quarterly: 'Ежеквартально',
};

export function FeContractsTable({
  contracts,
  onRowClick,
  onRunFees,
  clientNames = {},
  scheduleNames = {},
  compact = false,
}: FeContractsTableProps) {
  const displayContracts = compact ? contracts.slice(0, 8) : contracts;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Договор</th>
              {!compact && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Клиент</th>
              )}
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Частота</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Schedule</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">След. счёт</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              {!compact && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Действия</th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayContracts.map((contract) => {
              const status = statusConfig[contract.status];
              const StatusIcon = status.Icon;

              return (
                <tr
                  key={contract.id}
                  onClick={() => onRowClick?.(contract)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-stone-800">{contract.name}</div>
                    {compact && (
                      <div className="text-xs text-stone-500">{clientNames[contract.clientId] || contract.clientId}</div>
                    )}
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-stone-700">
                      {clientNames[contract.clientId] || contract.clientId}
                    </td>
                  )}
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">
                      {frequencyLabels[contract.billingFrequency]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-600 text-sm">
                    {scheduleNames[contract.scheduleId] || contract.scheduleId}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-stone-700">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      {new Date(contract.nextBillingDate).toLocaleDateString('ru-RU')}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRunFees?.(contract);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Расчёт
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {contracts.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет договоров для отображения
        </div>
      )}
    </div>
  );
}
