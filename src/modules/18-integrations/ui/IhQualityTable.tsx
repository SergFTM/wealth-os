"use client";

import { AlertTriangle, AlertOctagon, CheckCircle, Clock, Eye, Play, X } from 'lucide-react';
import { IhStatusPill } from './IhStatusPill';

interface DataQualityIssue {
  id: string;
  connectorId: string;
  runId: string;
  issueType: 'duplicate' | 'missing' | 'stale' | 'conflict';
  severity: 'critical' | 'warning' | 'info';
  status: 'open' | 'in_progress' | 'resolved';
  affectedTable: string;
  affectedRecordIds: string[];
  description: string;
  detectedAt: string;
  resolvedAt: string | null;
  resolutionType: string | null;
  resolutionNotes: string | null;
}

interface IhQualityTableProps {
  issues: DataQualityIssue[];
  connectorNames?: Record<string, string>;
  onRowClick?: (issue: DataQualityIssue) => void;
  onResolve?: (issue: DataQualityIssue) => void;
  onStartWork?: (issue: DataQualityIssue) => void;
  onDismiss?: (issue: DataQualityIssue) => void;
  filterSeverity?: 'critical' | 'warning' | 'info' | 'all';
  filterStatus?: 'open' | 'in_progress' | 'resolved' | 'all';
  compact?: boolean;
}

const issueTypeLabels: Record<string, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  duplicate: { label: 'Дубликат', Icon: AlertTriangle },
  missing: { label: 'Отсутствует', Icon: AlertOctagon },
  stale: { label: 'Устарело', Icon: Clock },
  conflict: { label: 'Конфликт', Icon: AlertTriangle },
};

const severityConfig: Record<string, { color: string; bg: string }> = {
  critical: { color: 'text-red-600', bg: 'bg-red-50' },
  warning: { color: 'text-amber-600', bg: 'bg-amber-50' },
  info: { color: 'text-blue-600', bg: 'bg-blue-50' },
};

export function IhQualityTable({
  issues,
  connectorNames = {},
  onRowClick,
  onResolve,
  onStartWork,
  onDismiss,
  filterSeverity = 'all',
  filterStatus = 'all',
  compact = false,
}: IhQualityTableProps) {
  let filteredIssues = issues;

  if (filterSeverity !== 'all') {
    filteredIssues = filteredIssues.filter(i => i.severity === filterSeverity);
  }

  if (filterStatus !== 'all') {
    filteredIssues = filteredIssues.filter(i => i.status === filterStatus);
  }

  const displayIssues = compact ? filteredIssues.slice(0, 10) : filteredIssues;

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Тип</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Severity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Описание</th>
              {!compact && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Таблица</th>
              )}
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Записи</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              {!compact && (
                <>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Обнаружено</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Действия</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {displayIssues.map((issue) => {
              const typeInfo = issueTypeLabels[issue.issueType] || issueTypeLabels.duplicate;
              const TypeIcon = typeInfo.Icon;
              const severity = severityConfig[issue.severity] || severityConfig.warning;

              return (
                <tr
                  key={issue.id}
                  onClick={() => onRowClick?.(issue)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-stone-600 bg-stone-100 rounded">
                      <TypeIcon className="w-3 h-3" />
                      {typeInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${severity.bg} ${severity.color}`}>
                      {issue.severity === 'critical' ? 'Критический' : issue.severity === 'warning' ? 'Важный' : 'Инфо'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-stone-800 line-clamp-1 max-w-xs">
                      {issue.description}
                    </div>
                    {compact && (
                      <div className="text-xs text-stone-500">
                        {connectorNames[issue.connectorId] || issue.connectorId}
                      </div>
                    )}
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-stone-600 font-mono text-xs">
                      {issue.affectedTable}
                    </td>
                  )}
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-stone-600 bg-stone-100 rounded-full">
                      {issue.affectedRecordIds.length}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <IhStatusPill status={issue.status} size="sm" />
                  </td>
                  {!compact && (
                    <>
                      <td className="px-4 py-3 text-stone-600">
                        {formatDate(issue.detectedAt)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRowClick?.(issue);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          {issue.status === 'open' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onStartWork?.(issue);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Play className="w-3 h-3" />
                            </button>
                          )}
                          {(issue.status === 'open' || issue.status === 'in_progress') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onResolve?.(issue);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredIssues.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет проблем для отображения
        </div>
      )}

      {/* Summary stats */}
      <div className="px-4 py-3 bg-stone-50 border-t border-stone-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-red-600">
              <AlertOctagon className="w-3.5 h-3.5" />
              {filteredIssues.filter(i => i.severity === 'critical').length} critical
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" />
              {filteredIssues.filter(i => i.status === 'open').length} open
            </span>
          </div>
          <span className="text-stone-500">
            Всего: {filteredIssues.length}
          </span>
        </div>
      </div>
    </div>
  );
}
