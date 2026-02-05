'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';

interface Payload {
  id: string;
  jobId: string;
  connectorId: string;
  entityType: string;
  direction?: 'inbound' | 'outbound';
  payloadSize?: number;
  recordCount?: number;
  validationJson?: { valid?: boolean; errors?: unknown[] };
  createdAt: string;
}

interface SbPayloadsTableProps {
  payloads: Payload[];
}

const i18n = {
  ru: { id: 'ID', job: 'Job', connector: 'Коннектор', entity: 'Entity', direction: 'Направление', size: 'Размер', records: 'Записей', valid: 'Валидация', created: 'Создано', noData: 'Нет payloads' },
  en: { id: 'ID', job: 'Job', connector: 'Connector', entity: 'Entity', direction: 'Direction', size: 'Size', records: 'Records', valid: 'Validation', created: 'Created', noData: 'No payloads' },
  uk: { id: 'ID', job: 'Job', connector: 'Конектор', entity: 'Entity', direction: 'Напрямок', size: 'Розмір', records: 'Записів', valid: 'Валідація', created: 'Створено', noData: 'Немає payloads' },
};

export function SbPayloadsTable({ payloads }: SbPayloadsTableProps) {
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];

  if (payloads.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-8 text-center">
        <p className="text-stone-500">{t.noData}</p>
      </div>
    );
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.id}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.job}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.connector}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.entity}</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase">{t.direction}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase">{t.records}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase">{t.size}</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase">{t.valid}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.created}</th>
            </tr>
          </thead>
          <tbody>
            {payloads.map((pl) => (
              <tr
                key={pl.id}
                className="border-b border-stone-50 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                onClick={() => router.push(`/m/sandbox/payload/${pl.id}`)}
              >
                <td className="px-4 py-3">
                  <code className="text-xs text-stone-700">{pl.id}</code>
                </td>
                <td className="px-4 py-3 text-sm text-indigo-600 hover:underline">{pl.jobId}</td>
                <td className="px-4 py-3 text-sm text-stone-600">{pl.connectorId}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">{pl.entityType}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs ${pl.direction === 'inbound' ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {pl.direction || 'inbound'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-stone-800 text-right font-mono">
                  {pl.recordCount?.toLocaleString() || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-stone-600 text-right">
                  {formatSize(pl.payloadSize)}
                </td>
                <td className="px-4 py-3 text-center">
                  {pl.validationJson?.valid === true ? (
                    <span className="text-xs text-emerald-600">✓</span>
                  ) : pl.validationJson?.valid === false ? (
                    <span className="text-xs text-rose-600">✗ {pl.validationJson.errors?.length || 0}</span>
                  ) : (
                    <span className="text-xs text-stone-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {new Date(pl.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
