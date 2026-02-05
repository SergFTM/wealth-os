'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Play, Send, MoreHorizontal, Shield, CheckCircle } from 'lucide-react';
import { ExStatusPill } from './ExStatusPill';

export interface ExportPack {
  id: string;
  name: string;
  packType: 'audit' | 'tax' | 'bank' | 'ops';
  scopeType: string;
  asOf?: string;
  status: 'draft' | 'published' | 'archived';
  clientSafe: boolean;
  lastRunId?: string;
  lastRunAt?: string;
  createdAt: string;
}

interface ExPacksTableProps {
  packs: ExportPack[];
  onOpen: (id: string) => void;
  onPublish: (id: string) => void;
  onRunExport: (id: string) => void;
  loading?: boolean;
}

const PACK_TYPE_LABELS: Record<string, string> = {
  audit: 'Audit',
  tax: 'Tax',
  bank: 'Bank KYC',
  ops: 'Operations',
};

const PACK_TYPE_COLORS: Record<string, string> = {
  audit: 'bg-purple-100 text-purple-700',
  tax: 'bg-blue-100 text-blue-700',
  bank: 'bg-amber-100 text-amber-700',
  ops: 'bg-gray-100 text-gray-700',
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function ExPacksTable({
  packs,
  onOpen,
  onPublish,
  onRunExport,
  loading = false,
}: ExPacksTableProps) {
  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8 text-center text-gray-500">
        Загрузка...
      </div>
    );
  }

  if (packs.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8 text-center text-gray-500">
        Нет пакетов. Создайте первый пакет экспорта.
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
              Тип
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Scope
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              As-of
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client-safe
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Последний запуск
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {packs.map((pack) => (
            <tr key={pack.id} className="hover:bg-white/50 transition-colors">
              <td className="px-4 py-3">
                <Link
                  href={`/m/exports/pack/${pack.id}`}
                  className="font-medium text-gray-900 hover:text-emerald-600"
                >
                  {pack.name}
                </Link>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    PACK_TYPE_COLORS[pack.packType]
                  }`}
                >
                  {PACK_TYPE_LABELS[pack.packType]}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                {pack.scopeType}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatDate(pack.asOf)}
              </td>
              <td className="px-4 py-3">
                <ExStatusPill status={pack.status} size="sm" />
              </td>
              <td className="px-4 py-3 text-center">
                {pack.clientSafe ? (
                  <Shield className="w-4 h-4 text-emerald-500 mx-auto" />
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatDate(pack.lastRunAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onOpen(pack.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Открыть"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {pack.status === 'draft' && (
                    <button
                      onClick={() => onPublish(pack.id)}
                      className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Опубликовать"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onRunExport(pack.id)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Запустить экспорт"
                  >
                    <Play className="w-4 h-4" />
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

export default ExPacksTable;
