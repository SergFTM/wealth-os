'use client';

import React, { useState } from 'react';
import { PortalPack, PortalDocument, Locale } from '../types';
import { PCard, PCardHeader, PCardBody, PCardFooter } from './PCard';
import { PBadge } from './PStatusPill';

interface PPacksProps {
  packs: PortalPack[];
  documents: PortalDocument[];
  locale?: Locale;
  onDownloadPack?: (pack: PortalPack) => void;
  onOpenPack?: (pack: PortalPack) => void;
}

export function PPacks({ packs, documents, locale = 'ru', onDownloadPack, onOpenPack }: PPacksProps) {
  const [selectedPack, setSelectedPack] = useState<PortalPack | null>(null);

  const labels: Record<string, Record<string, string>> = {
    title: { ru: 'Пакеты отчётов', en: 'Report Packs', uk: 'Пакети звітів' },
    documents: { ru: 'документов', en: 'documents', uk: 'документів' },
    document: { ru: 'документ', en: 'document', uk: 'документ' },
    created: { ru: 'Создан', en: 'Created', uk: 'Створено' },
    expires: { ru: 'Истекает', en: 'Expires', uk: 'Спливає' },
    download: { ru: 'Скачать всё', en: 'Download All', uk: 'Завантажити все' },
    open: { ru: 'Открыть', en: 'Open', uk: 'Відкрити' },
    close: { ru: 'Закрыть', en: 'Close', uk: 'Закрити' },
    contents: { ru: 'Содержимое', en: 'Contents', uk: 'Вміст' },
    noPacks: { ru: 'Нет доступных пакетов', en: 'No packs available', uk: 'Немає доступних пакетів' },
    expired: { ru: 'Истёк', en: 'Expired', uk: 'Спливсь' },
    active: { ru: 'Активен', en: 'Active', uk: 'Активний' },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getPackDocuments = (pack: PortalPack): PortalDocument[] => {
    return documents.filter(d => pack.documentIds.includes(d.id));
  };

  const getDocCount = (count: number) => {
    if (locale === 'ru') {
      if (count === 1) return `${count} документ`;
      if (count >= 2 && count <= 4) return `${count} документа`;
      return `${count} документов`;
    }
    if (locale === 'en') {
      return count === 1 ? `${count} document` : `${count} documents`;
    }
    // uk
    if (count === 1) return `${count} документ`;
    if (count >= 2 && count <= 4) return `${count} документи`;
    return `${count} документів`;
  };

  if (packs.length === 0) {
    return (
      <PCard>
        <PCardBody>
          <div className="py-12 text-center">
            <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-slate-400">{labels.noPacks[locale]}</p>
          </div>
        </PCardBody>
      </PCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packs.map((pack, idx) => {
          const expired = isExpired(pack.expiresAt);
          const colors = [
            'from-emerald-400 to-emerald-500',
            'from-amber-400 to-amber-500',
            'from-blue-400 to-blue-500',
            'from-purple-400 to-purple-500',
          ];

          return (
            <PCard key={pack.id} hover onClick={() => setSelectedPack(pack)}>
              <PCardBody>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center text-white shadow-sm`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <PBadge variant={expired ? 'error' : 'success'} size="sm">
                    {expired ? labels.expired[locale] : labels.active[locale]}
                  </PBadge>
                </div>

                <h3 className="font-semibold text-slate-800 mb-1">{pack.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{pack.description}</p>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{getDocCount(pack.documentCount)}</span>
                  <span>{formatDate(pack.createdAt)}</span>
                </div>
              </PCardBody>
            </PCard>
          );
        })}
      </div>

      {/* Pack Detail Drawer */}
      {selectedPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedPack(null)} />
          <div className="relative w-full max-w-lg h-full bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{selectedPack.title}</h2>
                <p className="text-sm text-slate-500">{getDocCount(selectedPack.documentCount)}</p>
              </div>
              <button
                onClick={() => setSelectedPack(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <p className="text-slate-600">{selectedPack.description}</p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">{labels.created[locale]}</p>
                  <p className="font-medium text-slate-700">{formatDate(selectedPack.createdAt)}</p>
                </div>
                {selectedPack.expiresAt && (
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">{labels.expires[locale]}</p>
                    <p className={`font-medium ${isExpired(selectedPack.expiresAt) ? 'text-red-500' : 'text-slate-700'}`}>
                      {formatDate(selectedPack.expiresAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Contents */}
              <div>
                <h3 className="font-medium text-slate-800 mb-3">{labels.contents[locale]}</h3>
                <div className="space-y-2">
                  {getPackDocuments(selectedPack).map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{doc.title}</p>
                        <p className="text-xs text-slate-400">{formatDate(doc.publishedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={() => onDownloadPack?.(selectedPack)}
                disabled={isExpired(selectedPack.expiresAt)}
                className={`w-full py-3 rounded-xl font-medium transition-all ${
                  isExpired(selectedPack.expiresAt)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {labels.download[locale]}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
