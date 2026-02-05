'use client';

/**
 * Planning Cashflow Table Component
 * List of cashflow items (inflows/outflows)
 */

import { useI18n } from '@/lib/i18n';
import { CashflowItem, FLOW_TYPES, CASHFLOW_CATEGORIES, FREQUENCIES, getAnnualAmount } from '../schema/cashflowItem';

interface PlCashflowTableProps {
  items: CashflowItem[];
  lang?: 'ru' | 'en' | 'uk';
  showType?: 'all' | 'inflow' | 'outflow';
  onEdit?: (id: string) => void;
}

export function PlCashflowTable({ items, lang: propLang, showType = 'all', onEdit }: PlCashflowTableProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const headers = {
    title: { ru: 'Название', en: 'Title', uk: 'Назва' },
    category: { ru: 'Категория', en: 'Category', uk: 'Категорія' },
    amount: { ru: 'Сумма', en: 'Amount', uk: 'Сума' },
    frequency: { ru: 'Частота', en: 'Frequency', uk: 'Частота' },
    annualAmount: { ru: 'В год', en: 'Annual', uk: 'За рік' },
    period: { ru: 'Период', en: 'Period', uk: 'Період' },
  };

  const filteredItems = showType === 'all'
    ? items
    : items.filter(i => i.flowType === showType);

  const formatCurrency = (amount: number, type: 'inflow' | 'outflow'): string => {
    const sign = type === 'inflow' ? '+' : '-';
    return `${sign}$${Math.abs(amount).toLocaleString()}`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  // Group by flow type
  const inflows = filteredItems.filter(i => i.flowType === 'inflow');
  const outflows = filteredItems.filter(i => i.flowType === 'outflow');

  const totalInflowAnnual = inflows.reduce((sum, i) => sum + getAnnualAmount(i), 0);
  const totalOutflowAnnual = outflows.reduce((sum, i) => sum + getAnnualAmount(i), 0);
  const netCashflow = totalInflowAnnual - totalOutflowAnnual;

  const renderTable = (tableItems: CashflowItem[], flowType: 'inflow' | 'outflow') => {
    const colorClass = flowType === 'inflow' ? 'text-green-600' : 'text-red-600';
    const bgClass = flowType === 'inflow' ? 'bg-green-50' : 'bg-red-50';

    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-2 font-medium text-gray-600">{headers.title[lang]}</th>
            <th className="text-left py-2 px-2 font-medium text-gray-600">{headers.category[lang]}</th>
            <th className="text-right py-2 px-2 font-medium text-gray-600">{headers.amount[lang]}</th>
            <th className="text-left py-2 px-2 font-medium text-gray-600">{headers.frequency[lang]}</th>
            <th className="text-right py-2 px-2 font-medium text-gray-600">{headers.annualAmount[lang]}</th>
            <th className="text-left py-2 px-2 font-medium text-gray-600">{headers.period[lang]}</th>
          </tr>
        </thead>
        <tbody>
          {tableItems.map((item) => {
            const category = CASHFLOW_CATEGORIES[item.category];
            const frequency = FREQUENCIES[item.frequency];

            return (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => onEdit?.(item.id)}
              >
                <td className="py-2 px-2">
                  <span className="font-medium text-gray-900">{item.title}</span>
                  {item.notes && (
                    <div className="text-xs text-gray-500 mt-0.5">{item.notes}</div>
                  )}
                </td>
                <td className="py-2 px-2">
                  <span className="flex items-center gap-1 text-gray-600">
                    <span>{category.icon}</span>
                    <span>{category.label[lang]}</span>
                  </span>
                </td>
                <td className={`py-2 px-2 text-right font-mono ${colorClass}`}>
                  {formatCurrency(item.amount, flowType)}
                </td>
                <td className="py-2 px-2 text-gray-600">
                  {frequency.label[lang]}
                </td>
                <td className={`py-2 px-2 text-right font-mono ${colorClass}`}>
                  {formatCurrency(getAnnualAmount(item), flowType)}
                </td>
                <td className="py-2 px-2 text-gray-500 text-xs">
                  {formatDate(item.startDate)}
                  {item.endDate && ` — ${formatDate(item.endDate)}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {lang === 'ru' ? 'Нет денежных потоков' : lang === 'uk' ? 'Немає грошових потоків' : 'No cashflows'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inflows */}
      {(showType === 'all' || showType === 'inflow') && inflows.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-700 flex items-center gap-1">
              <span>📈</span>
              {FLOW_TYPES.inflow.label[lang]}
            </h3>
            <span className="text-sm font-medium text-green-600">
              +${totalInflowAnnual.toLocaleString()}/год
            </span>
          </div>
          <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
            {renderTable(inflows, 'inflow')}
          </div>
        </div>
      )}

      {/* Outflows */}
      {(showType === 'all' || showType === 'outflow') && outflows.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-red-700 flex items-center gap-1">
              <span>📉</span>
              {FLOW_TYPES.outflow.label[lang]}
            </h3>
            <span className="text-sm font-medium text-red-600">
              -${totalOutflowAnnual.toLocaleString()}/год
            </span>
          </div>
          <div className="bg-white rounded-lg border border-red-200 overflow-hidden">
            {renderTable(outflows, 'outflow')}
          </div>
        </div>
      )}

      {/* Net Summary */}
      {showType === 'all' && (
        <div className={`p-4 rounded-lg ${netCashflow >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">
              {lang === 'ru' ? 'Чистый денежный поток' : lang === 'uk' ? 'Чистий грошовий потік' : 'Net Cashflow'}
            </span>
            <span className={`text-lg font-semibold ${netCashflow >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {netCashflow >= 0 ? '+' : ''}${netCashflow.toLocaleString()}/год
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
