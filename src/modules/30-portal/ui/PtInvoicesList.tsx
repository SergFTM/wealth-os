'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { PtStatusPill } from './PtStatusPill';

const labels = {
  title: { ru: 'Счета', en: 'Invoices', uk: 'Рахунки' },
  subtitle: { ru: 'Выставленные счета и платежи', en: 'Issued invoices and payments', uk: 'Виставлені рахунки та платежі' },
  invoiceNo: { ru: '№ счета', en: 'Invoice #', uk: '№ рахунку' },
  amount: { ru: 'Сумма', en: 'Amount', uk: 'Сума' },
  issued: { ru: 'Выставлен', en: 'Issued', uk: 'Виставлено' },
  dueDate: { ru: 'Срок оплаты', en: 'Due Date', uk: 'Термін оплати' },
  status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
  askQuestion: { ru: 'Задать вопрос', en: 'Ask Question', uk: 'Задати питання' },
  noInvoices: { ru: 'Нет счетов', en: 'No invoices', uk: 'Немає рахунків' },
  allStatuses: { ru: 'Все статусы', en: 'All statuses', uk: 'Всі статуси' },
  total: { ru: 'Итого к оплате', en: 'Total Due', uk: 'Всього до оплати' },
  paymentInfo: { ru: 'Информация о платежах', en: 'Payment Information', uk: 'Інформація про платежі' },
  paymentDesc: { ru: 'Для оплаты счета свяжитесь с вашим менеджером или создайте запрос', en: 'To pay an invoice, contact your manager or create a request', uk: 'Для оплати рахунку зв\'яжіться з вашим менеджером або створіть запит' },
};

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  issuedAt: string;
  dueAt: string;
  description?: string;
}

export function PtInvoicesList() {
  const { locale } = useApp();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch('/api/collections/feeInvoices')
      .then(res => res.json())
      .then(data => {
        setInvoices(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    return true;
  });

  const totalDue = filteredInvoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">{labels.title[locale]}</h1>
        <p className="text-sm text-stone-500 mt-1">{labels.subtitle[locale]}</p>
      </div>

      {/* Summary card */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-amber-100 text-sm">{labels.total[locale]}</div>
            <div className="text-3xl font-semibold mt-1">${totalDue.toLocaleString()}</div>
          </div>
          <Link
            href="/portal/request/new?type=payment_request"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
          >
            {labels.askQuestion[locale]}
          </Link>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-emerald-100 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">{labels.allStatuses[locale]}</option>
          <option value="issued">{locale === 'ru' ? 'Выставлен' : locale === 'uk' ? 'Виставлено' : 'Issued'}</option>
          <option value="overdue">{locale === 'ru' ? 'Просрочен' : locale === 'uk' ? 'Прострочено' : 'Overdue'}</option>
          <option value="paid">{locale === 'ru' ? 'Оплачен' : locale === 'uk' ? 'Оплачено' : 'Paid'}</option>
        </select>
      </div>

      {/* Invoices list */}
      {filteredInvoices.length > 0 ? (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-emerald-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">{labels.invoiceNo[locale]}</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">{labels.amount[locale]}</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">{labels.issued[locale]}</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">{labels.dueDate[locale]}</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">{labels.status[locale]}</th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-stone-800">{inv.invoiceNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-stone-800">${inv.amount.toLocaleString()}</span>
                    <span className="text-xs text-stone-400 ml-1">{inv.currency}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">
                    {new Date(inv.issuedAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">
                    {new Date(inv.dueAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
                  </td>
                  <td className="px-6 py-4">
                    <PtStatusPill status={inv.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/portal/request/new?type=question&subject=Invoice ${inv.invoiceNumber}`}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      {labels.askQuestion[locale]}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-12 text-center">
          <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
          <p className="text-stone-500">{labels.noInvoices[locale]}</p>
        </div>
      )}

      {/* Payment info */}
      <div className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-medium text-emerald-800 text-sm">{labels.paymentInfo[locale]}</div>
            <div className="text-sm text-emerald-700 mt-1">{labels.paymentDesc[locale]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
