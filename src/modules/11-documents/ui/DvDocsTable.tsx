"use client";

import { FileText, Link as LinkIcon, Share2, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Document {
  id: string;
  name: string;
  category: string;
  tags: string[];
  fileType: string;
  fileSize: number;
  linkedCount: number;
  createdBy: string;
  createdAt: string;
  status: string;
  confidentiality: string;
}

interface DvDocsTableProps {
  documents: Document[];
  onOpen: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onLink?: (id: string) => void;
  onShare?: (id: string) => void;
  compact?: boolean;
}

const categoryLabels: Record<string, string> = {
  invoice: 'Инвойс',
  statement: 'Выписка',
  agreement: 'Соглашение',
  quarterly_report: 'Квартальный отчет',
  kyc: 'KYC',
  tax: 'Налоги',
  misc: 'Прочее',
  contract: 'Контракт',
  bank_statement: 'Банк. выписка',
  payment_confirmation: 'Подтверждение',
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

export function DvDocsTable({
  documents,
  onOpen,
  onEdit,
  onDelete,
  onLink,
  onShare,
  compact = false,
}: DvDocsTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center">
        <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-500">Нет документов</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200/50">
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Имя
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Категория
            </th>
            {!compact && (
              <>
                <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
                  Теги
                </th>
                <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
                  Размер
                </th>
              </>
            )}
            <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Связи
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Создан
            </th>
            <th className="text-right text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {documents.map((doc) => (
            <tr
              key={doc.id}
              onClick={() => onOpen(doc.id)}
              className="hover:bg-emerald-50/30 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate max-w-[200px]">
                      {doc.name}
                    </p>
                    <p className="text-xs text-stone-500">{doc.fileType.toUpperCase()}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-stone-100 text-stone-700">
                  {categoryLabels[doc.category] || doc.category}
                </span>
              </td>
              {!compact && (
                <>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {doc.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex px-1.5 py-0.5 text-xs rounded bg-emerald-100 text-emerald-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {doc.tags.length > 2 && (
                        <span className="text-xs text-stone-400">+{doc.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-600">
                    {formatFileSize(doc.fileSize)}
                  </td>
                </>
              )}
              <td className="px-4 py-3 text-center">
                {doc.linkedCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                    <LinkIcon className="w-3 h-3" />
                    {doc.linkedCount}
                  </span>
                ) : (
                  <span className="text-sm text-stone-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {formatDate(doc.createdAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === doc.id ? null : doc.id);
                    }}
                    className="p-1 hover:bg-stone-100 rounded"
                  >
                    <MoreVertical className="w-4 h-4 text-stone-400" />
                  </button>

                  {openMenuId === doc.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                        }}
                      />
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-stone-200 py-1 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(doc.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                        >
                          <Eye className="w-4 h-4" />
                          Открыть
                        </button>
                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(doc.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          >
                            <Edit className="w-4 h-4" />
                            Редактировать
                          </button>
                        )}
                        {onLink && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onLink(doc.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          >
                            <LinkIcon className="w-4 h-4" />
                            Связать
                          </button>
                        )}
                        {onShare && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onShare(doc.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          >
                            <Share2 className="w-4 h-4" />
                            Поделиться
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(doc.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Удалить
                          </button>
                        )}
                      </div>
                    </>
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
