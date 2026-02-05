'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  envId: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  source: string;
  message: string;
  refsJson?: { jobId?: string; connectorId?: string; payloadId?: string };
  createdAt: string;
}

interface SbLogsTableProps {
  logs: LogEntry[];
  onExport?: () => void;
}

const i18n = {
  ru: { time: 'Время', env: 'Среда', level: 'Уровень', source: 'Источник', message: 'Сообщение', refs: 'Ссылки', noLogs: 'Нет логов', export: 'Экспорт', all: 'Все', filterLevel: 'Уровень' },
  en: { time: 'Time', env: 'Env', level: 'Level', source: 'Source', message: 'Message', refs: 'Refs', noLogs: 'No logs', export: 'Export', all: 'All', filterLevel: 'Level' },
  uk: { time: 'Час', env: 'Середовище', level: 'Рівень', source: 'Джерело', message: 'Повідомлення', refs: 'Посилання', noLogs: 'Немає логів', export: 'Експорт', all: 'Всі', filterLevel: 'Рівень' },
};

const levelColors: Record<string, string> = {
  debug: 'text-stone-400 bg-stone-100',
  info: 'text-blue-600 bg-blue-100',
  warn: 'text-amber-600 bg-amber-100',
  error: 'text-rose-600 bg-rose-100',
  critical: 'text-purple-600 bg-purple-100',
};

export function SbLogsTable({ logs, onExport }: SbLogsTableProps) {
  const { locale } = useApp();
  const t = i18n[locale];

  const [levelFilter, setLevelFilter] = useState<string>('');

  const filteredLogs = levelFilter ? logs.filter(l => l.level === levelFilter) : logs;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="">{t.all}</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <button
          onClick={onExport}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {t.export}
        </button>
      </div>

      {/* Logs */}
      {filteredLogs.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-stone-500">{t.noLogs}</p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-stone-100">
                <th className="px-3 py-2 text-left text-xs font-semibold text-stone-500 uppercase w-40">{t.time}</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-stone-500 uppercase w-20">{t.level}</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-stone-500 uppercase w-24">{t.source}</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-stone-500 uppercase">{t.message}</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-stone-500 uppercase w-32">{t.refs}</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-stone-50 hover:bg-indigo-50/50">
                  <td className="px-3 py-2 text-stone-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={cn('px-2 py-0.5 rounded text-xs font-semibold uppercase', levelColors[log.level])}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-stone-600">{log.source}</td>
                  <td className="px-3 py-2 text-stone-800 max-w-md truncate">{log.message}</td>
                  <td className="px-3 py-2 text-stone-500">
                    {log.refsJson?.jobId && (
                      <span className="text-indigo-600 hover:underline cursor-pointer mr-2">Job</span>
                    )}
                    {log.refsJson?.payloadId && (
                      <span className="text-indigo-600 hover:underline cursor-pointer">Payload</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
