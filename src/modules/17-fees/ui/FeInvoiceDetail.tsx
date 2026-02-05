"use client";

import {
  FileText,
  Calendar,
  Building2,
  DollarSign,
  Clock,
  Send,
  CheckCircle,
  AlertTriangle,
  XCircle,
  CreditCard,
  Printer,
  Mail,
  BookOpen
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
  lineItemsJson: string;
  glPostingRef: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  notes: string;
}

interface FeInvoiceDetailProps {
  invoice: FeeInvoice;
  clientName?: string;
  onApprove?: () => void;
  onSend?: () => void;
  onRecordPayment?: () => void;
  onVoid?: () => void;
  onPostToGL?: () => void;
  onPrint?: () => void;
}

const statusConfig = {
  draft: { label: 'Черновик', color: 'text-stone-600', bg: 'bg-stone-100', Icon: FileText },
  pending_approval: { label: 'На одобрении', color: 'text-amber-600', bg: 'bg-amber-50', Icon: Clock },
  sent: { label: 'Отправлен', color: 'text-blue-600', bg: 'bg-blue-50', Icon: Send },
  paid: { label: 'Оплачен', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
  overdue: { label: 'Просрочен', color: 'text-red-600', bg: 'bg-red-50', Icon: AlertTriangle },
  void: { label: 'Аннулирован', color: 'text-stone-500', bg: 'bg-stone-100', Icon: XCircle },
};

export function FeInvoiceDetail({
  invoice,
  clientName,
  onApprove,
  onSend,
  onRecordPayment,
  onVoid,
  onPostToGL,
  onPrint,
}: FeInvoiceDetailProps) {
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const status = statusConfig[invoice.status];
  const StatusIcon = status.Icon;

  let lineItems: Array<{ description: string; quantity: number; unitPrice: number; amount: number }> = [];
  try {
    lineItems = JSON.parse(invoice.lineItemsJson || '[]');
  } catch {
    lineItems = [];
  }

  const outstandingAmount = invoice.netAmount - invoice.paidAmount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-1">
              Счёт {invoice.invoiceNumber}
            </h2>
            <div className="flex items-center gap-2 text-stone-600">
              <Building2 className="w-4 h-4" />
              <span>{clientName || invoice.clientId}</span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl ${status.bg} ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
        </div>

        {/* Key dates */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500 mb-1">Период</div>
            <div className="font-medium text-stone-800">
              {formatDate(invoice.periodStart)} — {formatDate(invoice.periodEnd)}
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500 mb-1">Дата выставления</div>
            <div className="font-medium text-stone-800">{formatDate(invoice.issueDate)}</div>
          </div>
          <div className={`p-3 rounded-xl ${invoice.status === 'overdue' ? 'bg-red-50' : 'bg-stone-50'}`}>
            <div className={`text-xs mb-1 ${invoice.status === 'overdue' ? 'text-red-500' : 'text-stone-500'}`}>
              Срок оплаты
            </div>
            <div className={`font-medium ${invoice.status === 'overdue' ? 'text-red-700' : 'text-stone-800'}`}>
              {formatDate(invoice.dueDate)}
            </div>
          </div>
          {invoice.paidDate && (
            <div className="p-3 bg-emerald-50 rounded-xl">
              <div className="text-xs text-emerald-600 mb-1">Дата оплаты</div>
              <div className="font-medium text-emerald-700">{formatDate(invoice.paidDate)}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {invoice.status === 'draft' && (
            <button
              onClick={onApprove}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              На одобрение
            </button>
          )}
          {invoice.status === 'pending_approval' && (
            <button
              onClick={onSend}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              <Mail className="w-4 h-4" />
              Отправить клиенту
            </button>
          )}
          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
            <button
              onClick={onRecordPayment}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Записать платёж
            </button>
          )}
          {!invoice.glPostingRef && invoice.status !== 'void' && invoice.status !== 'draft' && (
            <button
              onClick={onPostToGL}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Провести в GL
            </button>
          )}
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
            Печать
          </button>
          {invoice.status !== 'void' && invoice.status !== 'paid' && (
            <button
              onClick={onVoid}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Аннулировать
            </button>
          )}
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200">
          <h3 className="font-semibold text-stone-800">Позиции счёта</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Описание</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Кол-во</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Цена</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={index} className="border-b border-stone-100">
                  <td className="px-6 py-3 text-stone-800">{item.description}</td>
                  <td className="px-4 py-3 text-right text-stone-600">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-stone-600">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="px-6 py-3 text-right font-medium text-stone-800">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Итого:</span>
                <span>{formatCurrency(invoice.grossAmount, invoice.currency)}</span>
              </div>
              {invoice.adjustments !== 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Корректировки:</span>
                  <span className={invoice.adjustments < 0 ? 'text-red-600' : 'text-emerald-600'}>
                    {formatCurrency(invoice.adjustments, invoice.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-stone-800 pt-2 border-t border-stone-300">
                <span>К оплате:</span>
                <span>{formatCurrency(invoice.netAmount, invoice.currency)}</span>
              </div>
              {invoice.paidAmount > 0 && (
                <>
                  <div className="flex justify-between text-emerald-600">
                    <span>Оплачено:</span>
                    <span>{formatCurrency(invoice.paidAmount, invoice.currency)}</span>
                  </div>
                  {outstandingAmount > 0 && (
                    <div className="flex justify-between text-amber-600 font-medium">
                      <span>Остаток:</span>
                      <span>{formatCurrency(outstandingAmount, invoice.currency)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approval & GL Info */}
      {(invoice.approvedBy || invoice.glPostingRef) && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h3 className="font-semibold text-stone-800 mb-4">Служебная информация</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {invoice.approvedBy && (
              <div>
                <span className="text-stone-500">Одобрил:</span>{' '}
                <span className="text-stone-800">{invoice.approvedBy}</span>
                {invoice.approvedAt && (
                  <span className="text-stone-500 ml-2">
                    ({formatDate(invoice.approvedAt)})
                  </span>
                )}
              </div>
            )}
            {invoice.glPostingRef && (
              <div>
                <span className="text-stone-500">GL Reference:</span>{' '}
                <span className="font-mono text-stone-800">{invoice.glPostingRef}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h3 className="font-semibold text-stone-800 mb-2">Примечания</h3>
          <p className="text-stone-600">{invoice.notes}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          ⚠️ Расчёты комиссий являются расчетными и требуют проверки бухгалтерией
        </p>
      </div>
    </div>
  );
}
