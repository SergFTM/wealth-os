'use client';

import React, { useState } from 'react';
import { PortalDocument, PortalDocTypeKey, PortalDocTypeLabels, Locale } from '../types';
import { PCard, PCardHeader, PCardBody } from './PCard';
import { PBadge, PTag } from './PStatusPill';

interface PDocumentsProps {
  documents: PortalDocument[];
  locale?: Locale;
  onDownload?: (doc: PortalDocument) => void;
  onOpen?: (doc: PortalDocument) => void;
}

export function PDocuments({ documents, locale = 'ru', onDownload, onOpen }: PDocumentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PortalDocTypeKey | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const labels: Record<string, Record<string, string>> = {
    title: { ru: 'Документы', en: 'Documents', uk: 'Документи' },
    search: { ru: 'Поиск документов...', en: 'Search documents...', uk: 'Пошук документів...' },
    allTypes: { ru: 'Все типы', en: 'All types', uk: 'Усі типи' },
    noDocuments: { ru: 'Документы не найдены', en: 'No documents found', uk: 'Документи не знайдено' },
    download: { ru: 'Скачать', en: 'Download', uk: 'Завантажити' },
    published: { ru: 'Опубликовано', en: 'Published', uk: 'Опубліковано' },
    by: { ru: 'Автор', en: 'By', uk: 'Автор' },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get unique tags
  const allTags = Array.from(new Set(documents.flatMap(d => d.tags)));

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || doc.type === selectedType;

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => doc.tags.includes(tag));

    return matchesSearch && matchesType && matchesTags;
  });

  const documentTypes: Array<PortalDocTypeKey | 'all'> = ['all', 'report', 'statement', 'contract', 'policy', 'tax', 'legal', 'minutes', 'other'];

  const getTypeIcon = (type: PortalDocTypeKey) => {
    const icons: Record<PortalDocTypeKey, React.ReactNode> = {
      report: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      statement: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      contract: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      policy: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      tax: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      ),
      legal: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      minutes: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      other: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    };
    return icons[type] || icons.other;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <PCard>
        <PCardBody>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={labels.search[locale]}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as PortalDocTypeKey | 'all')}
              className="px-4 py-2.5 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all bg-white"
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? labels.allTypes[locale] : PortalDocTypeLabels[type][locale]}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {allTags.slice(0, 10).map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTags(prev =>
                    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                  )}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </PCardBody>
      </PCard>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <PCard>
          <PCardBody>
            <div className="py-12 text-center">
              <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-slate-400">{labels.noDocuments[locale]}</p>
            </div>
          </PCardBody>
        </PCard>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map(doc => (
            <PCard key={doc.id} hover onClick={() => onOpen?.(doc)}>
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  {getTypeIcon(doc.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-slate-800 truncate">{doc.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <PBadge variant="default" size="sm">
                          {PortalDocTypeLabels[doc.type][locale]}
                        </PBadge>
                        <span>•</span>
                        <span>{formatDate(doc.publishedAt)}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.fileSize)}</span>
                      </div>
                    </div>
                  </div>
                  {doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.slice(0, 3).map(tag => (
                        <PTag key={tag}>{tag}</PTag>
                      ))}
                      {doc.tags.length > 3 && (
                        <span className="text-xs text-slate-400">+{doc.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); onDownload?.(doc); }}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title={labels.download[locale]}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
            </PCard>
          ))}
        </div>
      )}
    </div>
  );
}
