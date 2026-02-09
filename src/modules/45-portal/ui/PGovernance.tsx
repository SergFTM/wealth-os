'use client';

import React, { useState } from 'react';
import { PortalMinutes, Locale } from '../types';
import { PCard, PCardHeader, PCardBody } from './PCard';
import { PBadge } from './PStatusPill';

interface PGovernanceProps {
  minutes: PortalMinutes[];
  locale?: Locale;
  onExportPdf?: (minutes: PortalMinutes) => void;
}

export function PGovernance({ minutes, locale = 'ru', onExportPdf }: PGovernanceProps) {
  const [selectedMinutes, setSelectedMinutes] = useState<PortalMinutes | null>(null);

  const labels: Record<string, Record<string, string>> = {
    title: { ru: 'Governance', en: 'Governance', uk: 'Governance' },
    minutes: { ru: 'Протоколы заседаний', en: 'Meeting Minutes', uk: 'Протоколи засідань' },
    noMinutes: { ru: 'Нет опубликованных протоколов', en: 'No published minutes', uk: 'Немає опублікованих протоколів' },
    meetingDate: { ru: 'Дата заседания', en: 'Meeting Date', uk: 'Дата засідання' },
    published: { ru: 'Опубликовано', en: 'Published', uk: 'Опубліковано' },
    summary: { ru: 'Краткое содержание', en: 'Summary', uk: 'Короткий зміст' },
    decisions: { ru: 'Решения', en: 'Decisions', uk: 'Рішення' },
    noDecisions: { ru: 'Нет решений', en: 'No decisions', uk: 'Немає рішень' },
    exportPdf: { ru: 'Экспорт PDF', en: 'Export PDF', uk: 'Експорт PDF' },
    close: { ru: 'Закрыть', en: 'Close', uk: 'Закрити' },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const sortedMinutes = [...minutes].sort(
    (a, b) => new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime()
  );

  if (minutes.length === 0) {
    return (
      <PCard>
        <PCardBody>
          <div className="py-12 text-center">
            <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="text-slate-400">{labels.noMinutes[locale]}</p>
          </div>
        </PCardBody>
      </PCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Minutes List */}
      {sortedMinutes.map((item) => (
        <PCard key={item.id} hover onClick={() => setSelectedMinutes(item)}>
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800">{item.meetingTitle}</h3>
                <p className="text-sm text-slate-500 mt-1">{formatDate(item.meetingDate)}</p>
                <p className="text-sm text-slate-600 mt-3 line-clamp-2">{item.summary}</p>
                {item.decisions.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <PBadge variant="info" size="sm">
                      {item.decisions.length} {locale === 'ru' ? 'решений' : locale === 'en' ? 'decisions' : 'рішень'}
                    </PBadge>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center text-emerald-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </PCard>
      ))}

      {/* Minutes Detail Modal */}
      {selectedMinutes && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedMinutes(null)} />
          <div className="relative w-full max-w-2xl h-full bg-white shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{selectedMinutes.meetingTitle}</h2>
                <p className="text-sm text-slate-500">{formatDate(selectedMinutes.meetingDate)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onExportPdf?.(selectedMinutes)}
                  className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {labels.exportPdf[locale]}
                </button>
                <button
                  onClick={() => setSelectedMinutes(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">{labels.meetingDate[locale]}</p>
                  <p className="font-medium text-slate-700">{formatDate(selectedMinutes.meetingDate)}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">{labels.published[locale]}</p>
                  <p className="font-medium text-slate-700">{formatDate(selectedMinutes.publishedAt)}</p>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">{labels.summary[locale]}</h3>
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl">
                  <p className="text-slate-700 leading-relaxed">{selectedMinutes.summary}</p>
                </div>
              </div>

              {/* Decisions */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">{labels.decisions[locale]}</h3>
                {selectedMinutes.decisions.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">{labels.noDecisions[locale]}</p>
                ) : (
                  <div className="space-y-3">
                    {selectedMinutes.decisions.map((decision, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-white border border-emerald-100 rounded-xl">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-emerald-600">{idx + 1}</span>
                        </div>
                        <p className="text-slate-700">{decision}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
