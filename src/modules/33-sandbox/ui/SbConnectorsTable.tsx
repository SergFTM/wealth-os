'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { SbStatusPill } from './SbStatusPill';

interface Connector {
  id: string;
  connectorKey: string;
  name: string;
  status: 'active' | 'paused' | 'error';
  errorInjectionJson?: { enabled?: boolean; failureRate?: number };
  lastJobAt?: string;
  updatedAt: string;
}

interface SbConnectorsTableProps {
  connectors: Connector[];
  onRunTest?: (id: string) => void;
}

const i18n = {
  ru: { name: 'Название', key: 'Ключ', status: 'Статус', errorInj: 'Error Injection', lastJob: 'Последний job', actions: 'Действия', runTest: 'Тест', noData: 'Нет коннекторов' },
  en: { name: 'Name', key: 'Key', status: 'Status', errorInj: 'Error Injection', lastJob: 'Last Job', actions: 'Actions', runTest: 'Test', noData: 'No connectors' },
  uk: { name: 'Назва', key: 'Ключ', status: 'Статус', errorInj: 'Error Injection', lastJob: 'Останній job', actions: 'Дії', runTest: 'Тест', noData: 'Немає конекторів' },
};

export function SbConnectorsTable({ connectors, onRunTest }: SbConnectorsTableProps) {
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];

  if (connectors.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-8 text-center">
        <p className="text-stone-500">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.name}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.key}</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase">{t.status}</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase">{t.errorInj}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.lastJob}</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {connectors.map((conn) => (
              <tr
                key={conn.id}
                className="border-b border-stone-50 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                onClick={() => router.push(`/m/sandbox/connector/${conn.id}`)}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-800 text-sm">{conn.name}</div>
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-700">{conn.connectorKey}</code>
                </td>
                <td className="px-4 py-3 text-center">
                  <SbStatusPill status={conn.status} />
                </td>
                <td className="px-4 py-3 text-center">
                  {conn.errorInjectionJson?.enabled ? (
                    <span className="text-xs text-amber-600 font-medium">{conn.errorInjectionJson.failureRate}%</span>
                  ) : (
                    <span className="text-xs text-stone-400">Off</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {conn.lastJobAt ? new Date(conn.lastJobAt).toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onRunTest?.(conn.id)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {t.runTest}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
