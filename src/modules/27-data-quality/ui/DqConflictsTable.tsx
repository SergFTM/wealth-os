'use client';

/**
 * Data Quality Conflicts Table Component
 */

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { DqConflict, DQ_CONFLICT_STATUS_CONFIG } from '../schema/dqConflict';
import { DQ_CONFLICT_TYPES, DqConflictType } from '../config';
import { DqSeverityPill } from './DqSeverityPill';

interface DqConflictsTableProps {
  conflicts: DqConflict[];
  lang?: 'ru' | 'en' | 'uk';
  onMerge?: (conflictId: string) => void;
  onResolve?: (conflictId: string) => void;
}

export function DqConflictsTable({
  conflicts,
  lang: propLang,
  onMerge,
  onResolve,
}: DqConflictsTableProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const headers = {
    type: { ru: 'Тип конфликта', en: 'Conflict Type', uk: 'Тип конфлікту' },
    entities: { ru: 'Записи', en: 'Entities', uk: 'Записи' },
    severity: { ru: 'Severity', en: 'Severity', uk: 'Severity' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
    created: { ru: 'Создан', en: 'Created', uk: 'Створено' },
    actions: { ru: 'Действия', en: 'Actions', uk: 'Дії' },
  };

  const actions = {
    open: { ru: 'Открыть', en: 'Open', uk: 'Відкрити' },
    merge: { ru: 'Объединить', en: 'Merge', uk: 'Об\'єднати' },
    resolve: { ru: 'Решить', en: 'Resolve', uk: 'Вирішити' },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  if (conflicts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {lang === 'ru' ? 'Нет конфликтов' : lang === 'uk' ? 'Немає конфліктів' : 'No conflicts'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.type[lang]}</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.entities[lang]}</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">{headers.severity[lang]}</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">{headers.status[lang]}</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.created[lang]}</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">{headers.actions[lang]}</th>
          </tr>
        </thead>
        <tbody>
          {conflicts.map((conflict) => {
            const typeConfig = DQ_CONFLICT_TYPES[conflict.conflictType as DqConflictType];
            const statusConfig = DQ_CONFLICT_STATUS_CONFIG[conflict.status];

            return (
              <tr key={conflict.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <Link href={`/m/data-quality/conflict/${conflict.id}`} className="hover:text-blue-600">
                    <div className="font-medium text-gray-900">
                      {typeConfig?.label[lang] || conflict.conflictType}
                    </div>
                    {conflict.title && (
                      <div className="text-xs text-gray-500">{conflict.title}</div>
                    )}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    <div className="text-xs px-2 py-1 bg-gray-100 rounded inline-block">
                      {conflict.leftRef.displayLabel}
                    </div>
                    <div className="text-xs text-gray-400">vs</div>
                    <div className="text-xs px-2 py-1 bg-gray-100 rounded inline-block">
                      {conflict.rightRef.displayLabel}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <DqSeverityPill severity={conflict.severity} lang={lang} size="sm" />
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    conflict.status === 'open' ? 'bg-red-100 text-red-700' :
                    conflict.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {statusConfig?.label[lang] || conflict.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">
                  {formatDate(conflict.createdAt)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/m/data-quality/conflict/${conflict.id}`}
                      className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      {actions.open[lang]}
                    </Link>
                    {conflict.status === 'open' && (
                      <>
                        {onMerge && (
                          <button
                            onClick={() => onMerge(conflict.id)}
                            className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            {actions.merge[lang]}
                          </button>
                        )}
                        {onResolve && (
                          <button
                            onClick={() => onResolve(conflict.id)}
                            className="text-xs px-2 py-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            {actions.resolve[lang]}
                          </button>
                        )}
                      </>
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
