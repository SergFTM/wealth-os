"use client";

import {
  FileText,
  Clock,
  Send,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Mail,
  CreditCard,
  Calendar
} from 'lucide-react';

interface FeeInvoice {
  id: string;
  runId: string;
  contractId: string;
  clientId: string;
  invoiceNumber: string;
  periodStart: string;
  periodEnd: string;
  issueDate: string;
  dueDate: string;
  grossAmount: number;
  adjustments: number;
  netAmount: number;
  currency: string;
  status: 'draft' | 'pending_approval' | 'sent' | 'paid' | 'overdue' | 'void';
  paidAmount: number;
  paidDate: string | null;
  sentAt: string | null;
}

interface FeInvoicesTableProps {
  invoices: FeeInvoice[];
  onRowClick?: (invoice: FeeInvoice) => void;
  onSend?: (invoice: FeeInvoice) => void;
  onRecordPayment?: (invoice: FeeInvoice) => void;
  clientNames?: Record<string, string>;
  compact?: boolean;
}

const statusConfig = {
  draft: { label: 'Черновик', color: 'text-stone-600', bg: 'bg-stone-100', Icon: FileText },
  pending_approval: { label: 'На одобрении', color: 'text-amber-600', bg: 'bg-amber-50', Icon: Clock },
  sent: { label: 'Отправлен', color: 'text-blue-600', bg: 'bg-blue-50', Icon: Send },
  paid: { label: 'Оплачен', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
  overdue: { label: 'Просрочен', color: 'text-red-600', bg: 'bg-red-50', Icon: AlertTriangle },
  void: { label: 'Аннулирован', color: 'text-stone-500', bg: 'bg-stone-100', Icon: XCircle },
};

export function FeInvoicesTable({
  invoices,
  onRowClick,
  onSend,
  onRecordPayment,
  clientNames = {},
  compact = false,
}: FeInvoicesTableProps) {
  const displayInvoices = compact ? invoices.slice(0, 8) : invoices;

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

  const isOverdue = (invoice: FeeInvoice): boolean => {
    if (invoice.status === 'paid' || invoice.status === 'void') return false;
    return new Date(invoice.dueDate) < new Date();
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">№ счёта</th>
              {!compact && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Клиент</th>
              )}
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Период</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Сумма</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Срок оплаты</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              {!compact && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Действия</th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayInvoices.map((invoice) => {
              const status = statusConfig[invoice.status];
              const StatusIcon = status.Icon;
              const overdue = isOverdue(invoice);

              return (
                <tr
                  key={invoice.id}
                  onClick={() => onRowClick?.(invoice)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-stone-800">{invoice.invoiceNumber}</div>
                    {compact && (
                      <div className="text-xs text-stone-500">{clientNames[invoice.clientId] || invoice.clientId}</div>
                    )}
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-stone-700">
                      {clientNames[invoice.clientId] || invoice.clientId}
                    </td>
                  )}
                  <td className="px-4 py-3 text-stone-600 text-sm">
                    {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-semibold text-stone-800">
                      {formatCurrency(invoice.netAmount, invoice.currency)}
                    </div>
                    {invoice.paidAmount > 0 && invoice.paidAmount < invoice.netAmount && (
                      <div className="text-xs text-emerald-600">
                        Оплачено: {formatCurrency(invoice.paidAmount, invoice.currency)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1.5 ${overdue ? 'text-red-600' : 'text-stone-700'}`}>
                      <Calendar className={`w-3.5 h-3.5 ${overdue ? 'text-red-500' : 'text-stone-400'}`} />
                      {formatDate(invoice.dueDate)}
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
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowClick?.(invoice);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        {(invoice.status === 'pending_approval') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSend?.(invoice);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            Отправить
                          </button>
                        )}
                        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRecordPayment?.(invoice);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                          >
                            <CreditCard className="w-3 h-3" />
                            Платёж
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {invoices.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет счетов для отображения
        </div>
      )}
    </div>
  );
}
