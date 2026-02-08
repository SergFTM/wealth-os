"use client";

import { PhStatusPill } from './PhStatusPill';
import { PhMoneyPill } from './PhMoneyPill';

interface PhilGrant {
  id: string;
  granteeJson?: {
    name?: string;
    country?: string;
  };
  programName?: string;
  requestedAmount?: number;
  approvedAmount?: number;
  currency?: string;
  stageKey: string;
  complianceStatusKey?: string;
  docsStatusKey?: string;
}

interface PhGrantsTableProps {
  grants: PhilGrant[];
  onRowClick?: (grant: PhilGrant) => void;
  emptyMessage?: string;
}

export function PhGrantsTable({ grants, onRowClick, emptyMessage = 'Нет грантов' }: PhGrantsTableProps) {
  if (grants.length === 0) {
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
          <tr className="border-b border-stone-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Получатель</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Программа</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Запрошено</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Одобрено</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider">Этап</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider">Комплаенс</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider">Документы</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {grants.map((grant) => (
            <tr
              key={grant.id}
              onClick={() => onRowClick?.(grant)}
              className="hover:bg-stone-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div>
                  <span className="font-medium text-stone-900">{grant.granteeJson?.name || '—'}</span>
                  {grant.granteeJson?.country && (
                    <span className="ml-2 text-xs text-stone-500">{grant.granteeJson.country}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-stone-600">{grant.programName || '—'}</td>
              <td className="px-4 py-3 text-right">
                {grant.requestedAmount ? (
                  <PhMoneyPill amount={grant.requestedAmount} currency={grant.currency} />
                ) : '—'}
              </td>
              <td className="px-4 py-3 text-right">
                {grant.approvedAmount ? (
                  <PhMoneyPill amount={grant.approvedAmount} currency={grant.currency} variant="success" />
                ) : '—'}
              </td>
              <td className="px-4 py-3 text-center">
                <PhStatusPill status={grant.stageKey} type="grant" />
              </td>
              <td className="px-4 py-3 text-center">
                {grant.complianceStatusKey && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    grant.complianceStatusKey === 'cleared' ? 'bg-green-100 text-green-700' :
                    grant.complianceStatusKey === 'flagged' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {grant.complianceStatusKey === 'cleared' ? '✓' :
                     grant.complianceStatusKey === 'flagged' ? '⚠' : '...'}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {grant.docsStatusKey && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    grant.docsStatusKey === 'complete' ? 'bg-green-100 text-green-700' :
                    grant.docsStatusKey === 'incomplete' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {grant.docsStatusKey === 'complete' ? '✓' :
                     grant.docsStatusKey === 'incomplete' ? '!' : '...'}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
