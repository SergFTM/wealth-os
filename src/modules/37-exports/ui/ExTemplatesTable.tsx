'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Copy, Trash2, Star } from 'lucide-react';

export interface ExportTemplate {
  id: string;
  name: string;
  description?: string;
  defaultPackType: 'audit' | 'tax' | 'bank' | 'ops';
  defaultClientSafe: boolean;
  sectionsJson: { sectionId: string; enabled: boolean }[];
  isSystem: boolean;
  category?: string;
  createdAt: string;
}

interface ExTemplatesTableProps {
  templates: ExportTemplate[];
  onOpen: (id: string) => void;
  onApply: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const PACK_TYPE_LABELS: Record<string, string> = {
  audit: 'Audit',
  tax: 'Tax',
  bank: 'Bank KYC',
  ops: 'Operations',
};

export function ExTemplatesTable({
  templates,
  onOpen,
  onApply,
  onDelete,
  loading = false,
}: ExTemplatesTableProps) {
  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8 text-center text-gray-500">
        Загрузка...
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-8 text-center text-gray-500">
        Нет шаблонов. Создайте первый шаблон.
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
              Описание
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Тип по умолчанию
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Секций
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Системный
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {templates.map((template) => (
            <tr key={template.id} className="hover:bg-white/50 transition-colors">
              <td className="px-4 py-3">
                <Link
                  href={`/m/exports/template/${template.id}`}
                  className="font-medium text-gray-900 hover:text-emerald-600 flex items-center gap-2"
                >
                  {template.isSystem && (
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  )}
                  {template.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                {template.description || '—'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {PACK_TYPE_LABELS[template.defaultPackType]}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {template.sectionsJson?.filter((s) => s.enabled).length || 0}
              </td>
              <td className="px-4 py-3 text-center">
                {template.isSystem ? (
                  <span className="text-emerald-500">✓</span>
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onOpen(template.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Открыть"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onApply(template.id)}
                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Создать пакет из шаблона"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {!template.isSystem && (
                    <button
                      onClick={() => onDelete(template.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
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

export default ExTemplatesTable;
