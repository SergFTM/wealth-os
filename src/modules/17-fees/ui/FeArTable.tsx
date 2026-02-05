"use client";

import {
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Building2,
  Wallet,
  FileCheck,
  Calendar
} from 'lucide-react';

interface ArPayment {
  id: string;
  clientId: string;
  invoiceId: string;
  paymentDate: string;
  method: 'wire' | 'ach' | 'check' | 'card';
  paidAmount: number;
  currency: string;
  cashAccountId: string;
  cashMovementId: string | null;
  status: 'recorded' | 'reconciled' | 'disputed';
  notes: string;
  createdAt: string;
}

interface FeArTableProps {
  payments: ArPayment[];
  onRowClick?: (payment: ArPayment) => void;
  onReconcile?: (payment: ArPayment) => void;
  clientNames?: Record<string, string>;
  invoiceNumbers?: Record<string, string>;
  compact?: boolean;
}

const statusConfig = {
  recorded: { label: 'Записан', color: 'text-amber-600', bg: 'bg-amber-50', Icon: Clock },
  reconciled: { label: 'Сверен', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
  disputed: { label: 'Спорный', color: 'text-red-600', bg: 'bg-red-50', Icon: AlertCircle },
};

const methodConfig = {
  wire: { label: 'Wire', Icon: Building2 },
  ach: { label: 'ACH', Icon: Wallet },
  check: { label: 'Чек', Icon: FileCheck },
  card: { label: 'Карта', Icon: CreditCard },
};

export function FeArTable({
  payments,
  onRowClick,
  onReconcile,
  clientNames = {},
  invoiceNumbers = {},
  compact = false,
}: FeArTableProps) {
  const displayPayments = compact ? payments.slice(0, 10) : payments;

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Дата</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Клиент</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Счёт</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Метод</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Сумма</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              {!compact && (
                <>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Примечание</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Действия</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {displayPayments.map((payment) => {
              const status = statusConfig[payment.status];
              const method = methodConfig[payment.method];
              const StatusIcon = status.Icon;
              const MethodIcon = method.Icon;

              return (
                <tr
                  key={payment.id}
                  onClick={() => onRowClick?.(payment)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-stone-700">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      {formatDate(payment.paymentDate)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-700">
                    {clientNames[payment.clientId] || payment.clientId}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-blue-600">
                      {invoiceNumbers[payment.invoiceId] || payment.invoiceId}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-stone-600 bg-stone-100 rounded">
                      <MethodIcon className="w-3 h-3" />
                      {method.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-stone-800">
                    {formatCurrency(payment.paidAmount, payment.currency)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </td>
                  {!compact && (
                    <>
                      <td className="px-4 py-3 text-stone-500 text-sm max-w-[200px] truncate">
                        {payment.notes || '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {payment.status === 'recorded' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReconcile?.(payment);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Сверить
                          </button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет платежей для отображения
        </div>
      )}
    </div>
  );
}
