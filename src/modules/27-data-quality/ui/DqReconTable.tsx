'use client';

/**
 * Data Quality Reconciliation Table Component
 */

import { useI18n } from '@/lib/i18n';
import { DqReconCheck, DQ_RECON_STATUS_CONFIG, formatReconDelta } from '../schema/dqReconCheck';
import { DQ_RECON_TYPES, DqReconType } from '../config';

interface DqReconTableProps {
  checks: DqReconCheck[];
  lang?: 'ru' | 'en' | 'uk';
  onCreateException?: (checkId: string) => void;
  onExport?: (checkId: string) => void;
}

export function DqReconTable({
  checks,
  lang: propLang,
  onCreateException,
  onExport,
}: DqReconTableProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const headers = {
    reconType: { ru: 'Тип сверки', en: 'Recon Type', uk: 'Тип звірки' },
    scope: { ru: 'Scope', en: 'Scope', uk: 'Scope' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
    delta: { ru: 'Расхождение', en: 'Delta', uk: 'Розбіжність' },
    lastRun: { ru: 'Последний запуск', en: 'Last Run', uk: 'Останній запуск' },
    actions: { ru: 'Действия', en: 'Actions', uk: 'Дії' },
  };

  const actions = {
    details: { ru: 'Детали', en: 'Details', uk: 'Деталі' },
    createException: { ru: 'Создать исключение', en: 'Create Exception', uk: 'Створити виняток' },
    export: { ru: 'Экспорт', en: 'Export', uk: 'Експорт' },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (checks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {lang === 'ru' ? 'Нет сверок' : lang === 'uk' ? 'Немає звірок' : 'No reconciliations'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.reconType[lang]}</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.scope[lang]}</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">{headers.status[lang]}</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">{headers.delta[lang]}</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.lastRun[lang]}</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">{headers.actions[lang]}</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => {
            const typeConfig = DQ_RECON_TYPES[check.reconType as DqReconType];
            const statusConfig = DQ_RECON_STATUS_CONFIG[check.status];

            return (
              <tr key={check.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">
                    {typeConfig?.label[lang] || check.reconType}
                  </div>
                  <div className="text-xs text-gray-500">
                    {typeConfig?.description[lang]}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600 text-xs">
                  {check.scopeType || 'global'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    check.status === 'ok' ? 'bg-emerald-100 text-emerald-700' :
                    check.status === 'break' ? 'bg-red-100 text-red-700' :
                    check.status === 'error' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <span>{statusConfig?.icon}</span>
                    {statusConfig?.label[lang] || check.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-mono text-sm ${
                    check.status === 'break' ? 'text-red-600' :
                    check.deltaAmount !== 0 ? 'text-amber-600' : 'text-gray-500'
                  }`}>
                    {formatReconDelta(check.deltaAmount, check.currency)}
                  </span>
                  {check.deltaPct !== undefined && check.deltaPct !== 0 && (
                    <span className="text-xs text-gray-400 ml-1">
                      ({check.deltaPct > 0 ? '+' : ''}{check.deltaPct}%)
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">
                  {formatDate(check.lastRunAt)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                      onClick={() => {/* open details drawer */}}
                    >
                      {actions.details[lang]}
                    </button>
                    {check.status === 'break' && onCreateException && (
                      <button
                        onClick={() => onCreateException(check.id)}
                        className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        {actions.createException[lang]}
                      </button>
                    )}
                    {onExport && (
                      <button
                        onClick={() => onExport(check.id)}
                        className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        {actions.export[lang]}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
