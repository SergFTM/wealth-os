'use client';

/**
 * Data Quality Exceptions Table Component
 */

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { DqException, DQ_EXCEPTION_STATUS_CONFIG, getSlaBadgeColor } from '../schema/dqException';
import { DQ_DOMAINS, DqDomain } from '../config';
import { DqSeverityPill } from './DqSeverityPill';

interface DqExceptionsTableProps {
  exceptions: DqException[];
  lang?: 'ru' | 'en' | 'uk';
  onCreateTask?: (exceptionId: string) => void;
  onResolve?: (exceptionId: string) => void;
}

export function DqExceptionsTable({
  exceptions,
  lang: propLang,
  onCreateTask,
  onResolve,
}: DqExceptionsTableProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const headers = {
    severity: { ru: 'Severity', en: 'Severity', uk: 'Severity' },
    domain: { ru: 'Домен', en: 'Domain', uk: 'Домен' },
    rule: { ru: 'Правило', en: 'Rule', uk: 'Правило' },
    title: { ru: 'Описание', en: 'Title', uk: 'Опис' },
    scope: { ru: 'Scope', en: 'Scope', uk: 'Scope' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
    sla: { ru: 'SLA', en: 'SLA', uk: 'SLA' },
    actions: { ru: 'Действия', en: 'Actions', uk: 'Дії' },
  };

  const actions = {
    open: { ru: 'Открыть', en: 'Open', uk: 'Відкрити' },
    createTask: { ru: 'Создать задачу', en: 'Create Task', uk: 'Створити завдання' },
    resolve: { ru: 'Решить', en: 'Resolve', uk: 'Вирішити' },
  };

  const formatSla = (slaDueAt: string) => {
    const now = new Date();
    const due = new Date(slaDueAt);
    const diff = due.getTime() - now.getTime();
    const hours = Math.round(diff / (1000 * 60 * 60));

    if (hours < 0) {
      return { text: lang === 'ru' ? 'Просрочено' : lang === 'uk' ? 'Прострочено' : 'Overdue', color: 'text-red-600' };
    }
    if (hours < 24) {
      return { text: `${hours}h`, color: 'text-amber-600' };
    }
    const days = Math.round(hours / 24);
    return { text: `${days}d`, color: 'text-gray-600' };
  };

  if (exceptions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {lang === 'ru' ? 'Нет исключений' : lang === 'uk' ? 'Немає винятків' : 'No exceptions'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-center py-3 px-3 font-medium text-gray-600">{headers.severity[lang]}</th>
            <th className="text-left py-3 px-3 font-medium text-gray-600">{headers.domain[lang]}</th>
            <th className="text-left py-3 px-3 font-medium text-gray-600">{headers.title[lang]}</th>
            <th className="text-center py-3 px-3 font-medium text-gray-600">{headers.status[lang]}</th>
            <th className="text-center py-3 px-3 font-medium text-gray-600">{headers.sla[lang]}</th>
            <th className="text-right py-3 px-3 font-medium text-gray-600">{headers.actions[lang]}</th>
          </tr>
        </thead>
        <tbody>
          {exceptions.map((exc) => {
            const domainConfig = DQ_DOMAINS[exc.domain as DqDomain];
            const statusConfig = DQ_EXCEPTION_STATUS_CONFIG[exc.status];
            const sla = formatSla(exc.slaDueAt);

            return (
              <tr key={exc.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 text-center">
                  <DqSeverityPill severity={exc.severity} lang={lang} size="sm" />
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1 text-gray-600">
                    <span>{domainConfig?.icon}</span>
                    <span className="text-xs">{domainConfig?.label[lang] || exc.domain}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <Link href={`/m/data-quality/exception/${exc.id}`} className="hover:text-blue-600">
                    <div className="font-medium text-gray-900">{exc.title}</div>
                    {exc.ruleName && (
                      <div className="text-xs text-gray-500">{exc.ruleName}</div>
                    )}
                  </Link>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exc.status === 'open' ? 'bg-red-100 text-red-700' :
                    exc.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                    exc.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {statusConfig?.label[lang] || exc.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`text-xs font-medium ${sla.color}`}>
                    {sla.text}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/m/data-quality/exception/${exc.id}`}
                      className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      {actions.open[lang]}
                    </Link>
                    {exc.status === 'open' && onCreateTask && (
                      <button
                        onClick={() => onCreateTask(exc.id)}
                        className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        {actions.createTask[lang]}
                      </button>
                    )}
                    {exc.status !== 'resolved' && onResolve && (
                      <button
                        onClick={() => onResolve(exc.id)}
                        className="text-xs px-2 py-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        {actions.resolve[lang]}
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
