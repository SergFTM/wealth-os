"use client";

import {
  Building2,
  Calendar,
  FileText,
  Download,
  CreditCard,
  CheckCircle,
  Clock
} from 'lucide-react';

interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  periodStart: string;
  periodEnd: string;
  issueDate: string;
  dueDate: string;
  grossAmount: number;
  adjustments: number;
  netAmount: number;
  currency: string;
  status: 'sent' | 'paid' | 'overdue';
  paidAmount: number;
  paidDate: string | null;
  lineItemsJson: string;
}

interface FeClientInvoiceViewProps {
  invoice: FeeInvoice;
  companyName: string;
  companyAddress?: string;
  companyLogo?: string;
  clientName: string;
  clientAddress?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    routingNumber?: string;
    swiftCode?: string;
    iban?: string;
  };
  onDownloadPdf?: () => void;
  onPayNow?: () => void;
}

export function FeClientInvoiceView({
  invoice,
  companyName,
  companyAddress,
  companyLogo,
  clientName,
  clientAddress,
  bankDetails,
  onDownloadPdf,
  onPayNow,
}: FeClientInvoiceViewProps) {
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  let lineItems: Array<{ description: string; quantity: number; unitPrice: number; amount: number }> = [];
  try {
    lineItems = JSON.parse(invoice.lineItemsJson || '[]');
  } catch {
    lineItems = [];
  }

  const outstandingAmount = invoice.netAmount - invoice.paidAmount;
  const isPaid = invoice.status === 'paid';
  const isOverdue = invoice.status === 'overdue';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Status Banner */}
      {isPaid && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
          <div>
            <div className="font-semibold text-emerald-800">Payment Received</div>
            <div className="text-sm text-emerald-600">
              Thank you for your payment on {invoice.paidDate ? formatDate(invoice.paidDate) : 'N/A'}
            </div>
          </div>
        </div>
      )}

      {isOverdue && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <Clock className="w-6 h-6 text-red-600" />
          <div>
            <div className="font-semibold text-red-800">Payment Overdue</div>
            <div className="text-sm text-red-600">
              This invoice was due on {formatDate(invoice.dueDate)}. Please arrange payment promptly.
            </div>
          </div>
        </div>
      )}

      {/* Invoice Document */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-stone-200">
          <div className="flex items-start justify-between">
            <div>
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} className="h-12 mb-4" />
              ) : (
                <div className="text-2xl font-bold text-stone-800 mb-4">{companyName}</div>
              )}
              {companyAddress && (
                <div className="text-sm text-stone-500 whitespace-pre-line">{companyAddress}</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-stone-800 mb-2">INVOICE</div>
              <div className="text-lg font-semibold text-blue-600">{invoice.invoiceNumber}</div>
            </div>
          </div>
        </div>

        {/* Bill To & Dates */}
        <div className="p-8 grid grid-cols-2 gap-8 border-b border-stone-200">
          <div>
            <div className="text-xs uppercase font-semibold text-stone-500 mb-2">Bill To</div>
            <div className="font-semibold text-stone-800 mb-1">{clientName}</div>
            {clientAddress && (
              <div className="text-sm text-stone-600 whitespace-pre-line">{clientAddress}</div>
            )}
          </div>
          <div className="text-right space-y-2">
            <div>
              <span className="text-stone-500">Invoice Date:</span>{' '}
              <span className="font-medium text-stone-800">{formatDate(invoice.issueDate)}</span>
            </div>
            <div>
              <span className="text-stone-500">Period:</span>{' '}
              <span className="font-medium text-stone-800">
                {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
              </span>
            </div>
            <div className={isOverdue ? 'text-red-600' : ''}>
              <span className={isOverdue ? 'text-red-500' : 'text-stone-500'}>Due Date:</span>{' '}
              <span className={`font-medium ${isOverdue ? 'text-red-700' : 'text-stone-800'}`}>
                {formatDate(invoice.dueDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="p-8 border-b border-stone-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-stone-200">
                <th className="py-3 text-left font-semibold text-stone-600">Description</th>
                <th className="py-3 text-center font-semibold text-stone-600 w-20">Qty</th>
                <th className="py-3 text-right font-semibold text-stone-600 w-28">Unit Price</th>
                <th className="py-3 text-right font-semibold text-stone-600 w-28">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={index} className="border-b border-stone-100">
                  <td className="py-4 text-stone-800">{item.description}</td>
                  <td className="py-4 text-center text-stone-600">{item.quantity}</td>
                  <td className="py-4 text-right text-stone-600">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="py-4 text-right font-medium text-stone-800">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-8 bg-stone-50">
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoice.grossAmount, invoice.currency)}</span>
              </div>
              {invoice.adjustments !== 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Adjustments:</span>
                  <span className={invoice.adjustments < 0 ? 'text-red-600' : 'text-emerald-600'}>
                    {formatCurrency(invoice.adjustments, invoice.currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-stone-800 pt-3 border-t-2 border-stone-300">
                <span>Total Due:</span>
                <span>{formatCurrency(invoice.netAmount, invoice.currency)}</span>
              </div>
              {invoice.paidAmount > 0 && (
                <>
                  <div className="flex justify-between text-emerald-600">
                    <span>Amount Paid:</span>
                    <span>{formatCurrency(invoice.paidAmount, invoice.currency)}</span>
                  </div>
                  {outstandingAmount > 0 && (
                    <div className="flex justify-between text-lg font-bold text-amber-700 pt-2">
                      <span>Balance Due:</span>
                      <span>{formatCurrency(outstandingAmount, invoice.currency)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bank Details */}
        {bankDetails && !isPaid && (
          <div className="p-8 border-t border-stone-200">
            <div className="text-xs uppercase font-semibold text-stone-500 mb-3">Payment Instructions</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-stone-500">Bank:</span>{' '}
                <span className="text-stone-800">{bankDetails.bankName}</span>
              </div>
              <div>
                <span className="text-stone-500">Account:</span>{' '}
                <span className="font-mono text-stone-800">{bankDetails.accountNumber}</span>
              </div>
              {bankDetails.routingNumber && (
                <div>
                  <span className="text-stone-500">Routing:</span>{' '}
                  <span className="font-mono text-stone-800">{bankDetails.routingNumber}</span>
                </div>
              )}
              {bankDetails.swiftCode && (
                <div>
                  <span className="text-stone-500">SWIFT:</span>{' '}
                  <span className="font-mono text-stone-800">{bankDetails.swiftCode}</span>
                </div>
              )}
              {bankDetails.iban && (
                <div className="col-span-2">
                  <span className="text-stone-500">IBAN:</span>{' '}
                  <span className="font-mono text-stone-800">{bankDetails.iban}</span>
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-stone-500">
              Please reference invoice number <strong>{invoice.invoiceNumber}</strong> with your payment.
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 bg-stone-100 border-t border-stone-200 text-center text-xs text-stone-500">
          Thank you for your business. For questions regarding this invoice, please contact your account manager.
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={onDownloadPdf}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        {!isPaid && (
          <button
            onClick={onPayNow}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
          >
            <CreditCard className="w-4 h-4" />
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
}
