'use client';

import React, { useState } from 'react';
import { PortalRequest, RequestCategoryKey, RequestCategoryLabels, RequestStatusKey, Locale, portalI18n } from '../types';
import { PCard, PCardHeader, PCardBody, PCardFooter } from './PCard';
import { PStatusPill, PBadge } from './PStatusPill';

interface PRequestsProps {
  requests: PortalRequest[];
  locale?: Locale;
  onCreateRequest?: (data: { category: RequestCategoryKey; subject: string; description: string }) => void;
}

export function PRequests({ requests, locale = 'ru', onCreateRequest }: PRequestsProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PortalRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<RequestStatusKey | 'all'>('all');

  // Form state
  const [formCategory, setFormCategory] = useState<RequestCategoryKey>('general');
  const [formSubject, setFormSubject] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const labels: Record<string, Record<string, string>> = {
    title: { ru: 'Запросы', en: 'Requests', uk: 'Запити' },
    createRequest: { ru: 'Создать запрос', en: 'Create Request', uk: 'Створити запит' },
    newRequest: { ru: 'Новый запрос', en: 'New Request', uk: 'Новий запит' },
    category: { ru: 'Категория', en: 'Category', uk: 'Категорія' },
    subject: { ru: 'Тема', en: 'Subject', uk: 'Тема' },
    description: { ru: 'Описание', en: 'Description', uk: 'Опис' },
    send: { ru: 'Отправить', en: 'Send', uk: 'Надіслати' },
    cancel: { ru: 'Отмена', en: 'Cancel', uk: 'Скасувати' },
    close: { ru: 'Закрыть', en: 'Close', uk: 'Закрити' },
    noRequests: { ru: 'Нет запросов', en: 'No requests', uk: 'Немає запитів' },
    allStatuses: { ru: 'Все статусы', en: 'All statuses', uk: 'Усі статуси' },
    updates: { ru: 'Обновления', en: 'Updates', uk: 'Оновлення' },
    noUpdates: { ru: 'Нет обновлений', en: 'No updates', uk: 'Немає оновлень' },
    created: { ru: 'Создан', en: 'Created', uk: 'Створено' },
    updated: { ru: 'Обновлён', en: 'Updated', uk: 'Оновлено' },
    subjectPlaceholder: { ru: 'Кратко опишите запрос...', en: 'Briefly describe your request...', uk: 'Коротко опишіть запит...' },
    descriptionPlaceholder: { ru: 'Подробное описание запроса...', en: 'Detailed description of your request...', uk: 'Детальний опис запиту...' },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredRequests = requests.filter(req =>
    filterStatus === 'all' || req.status === filterStatus
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formSubject.trim() && formDescription.trim()) {
      onCreateRequest?.({
        category: formCategory,
        subject: formSubject.trim(),
        description: formDescription.trim(),
      });
      setFormSubject('');
      setFormDescription('');
      setFormCategory('general');
      setShowCreateForm(false);
    }
  };

  const categories: RequestCategoryKey[] = ['general', 'documents', 'transactions', 'reporting', 'governance', 'compliance', 'tax', 'legal', 'other'];

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as RequestStatusKey | 'all')}
            className="px-4 py-2 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all bg-white text-sm"
          >
            <option value="all">{labels.allStatuses[locale]}</option>
            <option value="open">{locale === 'ru' ? 'Открыт' : locale === 'en' ? 'Open' : 'Відкрито'}</option>
            <option value="in_progress">{locale === 'ru' ? 'В работе' : locale === 'en' ? 'In Progress' : 'В роботі'}</option>
            <option value="awaiting_client">{locale === 'ru' ? 'Ожидает вас' : locale === 'en' ? 'Awaiting You' : 'Очікує вас'}</option>
            <option value="closed">{locale === 'ru' ? 'Закрыт' : locale === 'en' ? 'Closed' : 'Закрито'}</option>
          </select>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {labels.createRequest[locale]}
        </button>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <PCard>
          <PCardBody>
            <div className="py-12 text-center">
              <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-slate-400">{labels.noRequests[locale]}</p>
            </div>
          </PCardBody>
        </PCard>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map(req => (
            <PCard key={req.id} hover onClick={() => setSelectedRequest(req)}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-400">#{req.number}</span>
                      <PBadge variant="default" size="sm">
                        {RequestCategoryLabels[req.category][locale]}
                      </PBadge>
                    </div>
                    <h3 className="font-medium text-slate-800 truncate">{req.subject}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{req.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>{labels.created[locale]}: {formatDate(req.createdAt)}</span>
                    </div>
                  </div>
                  <PStatusPill status={req.status} locale={locale} />
                </div>
              </div>
            </PCard>
          ))}
        </div>
      )}

      {/* Create Request Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowCreateForm(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">{labels.newRequest[locale]}</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {labels.category[locale]}
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as RequestCategoryKey)}
                  className="w-full px-4 py-2.5 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {RequestCategoryLabels[cat][locale]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {labels.subject[locale]}
                </label>
                <input
                  type="text"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder={labels.subjectPlaceholder[locale]}
                  className="w-full px-4 py-2.5 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {labels.description[locale]}
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder={labels.descriptionPlaceholder[locale]}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all resize-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  {labels.cancel[locale]}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  {labels.send[locale]}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Detail Drawer */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
          <div className="relative w-full max-w-lg h-full bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-slate-400">#{selectedRequest.number}</span>
                  <PStatusPill status={selectedRequest.status} locale={locale} size="sm" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800 mt-1">{selectedRequest.subject}</h2>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Category & Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">{labels.category[locale]}</p>
                  <p className="font-medium text-slate-700">{RequestCategoryLabels[selectedRequest.category][locale]}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">{labels.created[locale]}</p>
                  <p className="font-medium text-slate-700">{formatDate(selectedRequest.createdAt)}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">{labels.description[locale]}</p>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-xl">{selectedRequest.description}</p>
              </div>

              {/* Updates */}
              <div>
                <p className="text-sm font-medium text-slate-500 mb-3">{labels.updates[locale]}</p>
                {selectedRequest.clientSafeUpdates.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">{labels.noUpdates[locale]}</p>
                ) : (
                  <div className="space-y-2">
                    {selectedRequest.clientSafeUpdates.map((update, idx) => (
                      <div key={idx} className="p-3 bg-emerald-50/50 rounded-xl text-sm text-slate-700 border-l-2 border-emerald-500">
                        {update}
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
