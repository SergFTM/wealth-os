'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, RefreshCw, FileText, AlertCircle } from 'lucide-react';
import { ExStatusPill } from './ExStatusPill';

export interface ExportRun {
  id: string;
  packId: string;
  packName?: string;
  status: 'queued' | 'running' | 'success' | 'failed';
  startedAt?: string;
  finishedAt?: string;
  filesCount: number;
  totalSizeBytes: number;
  errorsCount: number;
  createdAt: string;
}

interface ExExportsTableProps {
  exports: ExportRun[];
  onOpen: (id: string) => void;
  onRerun: (id: string) => void;
  loading?: boolean;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDuration(startedAt?: string, finishedAt?: string): string {
  if (!startedAt || !finishedAt) return '—';
  const ms = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

export function ExExportsTable({
  exports,
  onOpen,
  onRerun,
  loading = false,
}: ExExportsTableProps) {
  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8 text-center text-gray-500">
        Загрузка...
      </div>
    );
  }

  if (exports.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8 text-center text-gray-500">
        Нет выгрузок. Запустите экспорт из пакета.
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Run ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Пакет
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Начало
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Длительность
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Файлов
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Размер
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {exports.map((run) => (
            <tr key={run.id} className="hover:bg-white/50 transition-colors">
              <td className="px-4 py-3">
                <Link
                  href={`/m/exports/export/${run.id}`}
                  className="font-mono text-sm text-gray-900 hover:text-emerald-600"
                >
                  {run.id.slice(0, 12)}...
                </Link>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/m/exports/pack/${run.packId}`}
                  className="text-sm text-gray-600 hover:text-emerald-600"
                >
                  {run.packName || run.packId.slice(0, 8)}
                </Link>
              </td>
              <td className="px-4 py-3">
                <ExStatusPill status={run.status} size="sm" showIcon />
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatDate(run.startedAt)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatDuration(run.startedAt, run.finishedAt)}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                  <FileText className="w-3.5 h-3.5" />
                  {run.filesCount}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatSize(run.totalSizeBytes)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  {run.errorsCount > 0 && (
                    <span className="p-1.5 text-red-500" title={`${run.errorsCount} ошибок`}>
                      <AlertCircle className="w-4 h-4" />
                    </span>
                  )}
                  <button
                    onClick={() => onOpen(run.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Открыть"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRerun(run.id)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Перезапустить"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExExportsTable;
