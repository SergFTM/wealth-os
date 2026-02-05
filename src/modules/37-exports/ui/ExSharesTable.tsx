'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, XCircle, Link2, Shield, Copy } from 'lucide-react';
import { ExStatusPill } from './ExStatusPill';

export interface ExportShare {
  id: string;
  name: string;
  packId: string;
  packName?: string;
  audienceType: 'advisor' | 'auditor' | 'client' | 'bank' | 'regulator';
  audienceName?: string;
  status: 'active' | 'expired' | 'revoked';
  clientSafe: boolean;
  expiresAt: string;
  downloadCount: number;
  maxDownloads?: number;
  createdAt: string;
}

interface ExSharesTableProps {
  shares: ExportShare[];
  onOpen: (id: string) => void;
  onRevoke: (id: string) => void;
  onCopyLink: (id: string) => void;
  loading?: boolean;
}

const AUDIENCE_LABELS: Record<string, string> = {
  advisor: 'Консультант',
  auditor: 'Аудитор',
  client: 'Клиент',
  bank: 'Банк',
  regulator: 'Регулятор',
};

const AUDIENCE_COLORS: Record<string, string> = {
  advisor: 'bg-blue-100 text-blue-700',
  auditor: 'bg-purple-100 text-purple-700',
  client: 'bg-emerald-100 text-emerald-700',
  bank: 'bg-amber-100 text-amber-700',
  regulator: 'bg-red-100 text-red-700',
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function ExSharesTable({
  shares,
  onOpen,
  onRevoke,
  onCopyLink,
  loading = false,
}: ExSharesTableProps) {
  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8 text-center text-gray-500">
        Загрузка...
      </div>
    );
  }

  if (shares.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8 text-center text-gray-500">
        Нет shares. Поделитесь пакетом с внешним получателем.
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Название
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Пакет
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Получатель
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client-safe
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Истекает
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Скачиваний
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {shares.map((share) => (
            <tr key={share.id} className="hover:bg-white/50 transition-colors">
              <td className="px-4 py-3">
                <Link
                  href={`/m/exports/share/${share.id}`}
                  className="font-medium text-gray-900 hover:text-emerald-600 flex items-center gap-2"
                >
                  <Link2 className="w-3.5 h-3.5 text-gray-400" />
                  {share.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {share.packName || share.packId.slice(0, 8)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    AUDIENCE_COLORS[share.audienceType]
                  }`}
                >
                  {AUDIENCE_LABELS[share.audienceType]}
                </span>
                {share.audienceName && (
                  <span className="ml-2 text-sm text-gray-500">{share.audienceName}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <ExStatusPill status={share.status} size="sm" />
              </td>
              <td className="px-4 py-3 text-center">
                {share.clientSafe ? (
                  <Shield className="w-4 h-4 text-emerald-500 mx-auto" />
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatDate(share.expiresAt)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {share.downloadCount}
                {share.maxDownloads && ` / ${share.maxDownloads}`}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onCopyLink(share.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Копировать ссылку"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpen(share.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Открыть"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {share.status === 'active' && (
                    <button
                      onClick={() => onRevoke(share.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Отозвать"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExSharesTable;
