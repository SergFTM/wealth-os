"use client";

import { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Calculator,
  Save,
  Send,
  AlertCircle
} from 'lucide-react';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface FeInvoiceComposerProps {
  contractId: string;
  clientId: string;
  clientName?: string;
  periodStart: string;
  periodEnd: string;
  currency: string;
  suggestedAmount?: number;
  suggestedDescription?: string;
  onSave?: (data: { lineItems: LineItem[]; notes: string; grossAmount: number; netAmount: number }) => void;
  onSaveAndSubmit?: (data: { lineItems: LineItem[]; notes: string; grossAmount: number; netAmount: number }) => void;
  onCancel?: () => void;
}

export function FeInvoiceComposer({
  contractId,
  clientId,
  clientName,
  periodStart,
  periodEnd,
  currency,
  suggestedAmount = 0,
  suggestedDescription = 'Management Fee',
  onSave,
  onSaveAndSubmit,
  onCancel,
}: FeInvoiceComposerProps) {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: '1',
      description: suggestedDescription,
      quantity: 1,
      unitPrice: suggestedAmount,
      amount: suggestedAmount,
    },
  ]);
  const [notes, setNotes] = useState('');
  const [adjustment, setAdjustment] = useState(0);

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.amount = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      })
    );
  };

  const grossAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const netAmount = grossAmount + adjustment;

  const handleSave = () => {
    onSave?.({ lineItems, notes, grossAmount, netAmount });
  };

  const handleSaveAndSubmit = () => {
    onSaveAndSubmit?.({ lineItems, notes, grossAmount, netAmount });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">Новый счёт</h2>
            <p className="text-stone-500 text-sm">{clientName || clientId}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-stone-500 mb-1">Период</div>
            <div className="font-medium text-stone-800">
              {formatDate(periodStart)} — {formatDate(periodEnd)}
            </div>
          </div>
          <div>
            <div className="text-xs text-stone-500 mb-1">Договор</div>
            <div className="font-medium text-stone-800">{contractId}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500 mb-1">Валюта</div>
            <div className="font-medium text-stone-800">{currency}</div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-semibold text-stone-800">Позиции счёта</h3>
          <button
            onClick={addLineItem}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase w-1/2">Описание</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase w-20">Кол-во</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase w-32">Цена</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase w-32">Сумма</th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item.id} className="border-b border-stone-100">
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      placeholder="Описание позиции..."
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="1"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-stone-800">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200">
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-stone-600">
                <span>Итого:</span>
                <span className="font-medium">{formatCurrency(grossAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-600">Корректировка:</span>
                <input
                  type="number"
                  value={adjustment}
                  onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
                  className="w-32 px-3 py-1.5 border border-stone-200 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-between text-lg font-bold text-stone-800 pt-3 border-t border-stone-300">
                <span>К оплате:</span>
                <span className={netAmount < 0 ? 'text-red-600' : ''}>{formatCurrency(netAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h3 className="font-semibold text-stone-800 mb-3">Примечания</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Дополнительные примечания к счёту..."
          rows={3}
          className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Расчёты комиссий являются расчетными и требуют проверки бухгалтерией.
          Перед отправкой клиенту убедитесь в корректности всех сумм.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors"
        >
          Отмена
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" />
            Сохранить черновик
          </button>
          <button
            onClick={handleSaveAndSubmit}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
            На одобрение
          </button>
        </div>
      </div>
    </div>
  );
}
