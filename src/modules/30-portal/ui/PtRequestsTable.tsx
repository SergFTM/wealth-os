'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { PtStatusPill } from './PtStatusPill';

const labels = {
  title: { ru: 'Мои запросы', en: 'My Requests', uk: 'Мої запити' },
  subtitle: { ru: 'Отслеживайте статус ваших запросов', en: 'Track your request status', uk: 'Відстежуйте статус ваших запитів' },
  createRequest: { ru: 'Создать запрос', en: 'Create Request', uk: 'Створити запит' },
  type: { ru: 'Тип', en: 'Type', uk: 'Тип' },
  title_col: { ru: 'Название', en: 'Title', uk: 'Назва' },
  status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
  created: { ru: 'Создан', en: 'Created', uk: 'Створено' },
  slaDue: { ru: 'Срок SLA', en: 'SLA Due', uk: 'Термін SLA' },
  noRequests: { ru: 'Нет запросов', en: 'No requests', uk: 'Немає запитів' },
  allTypes: { ru: 'Все типы', en: 'All types', uk: 'Всі типи' },
  allStatuses: { ru: 'Все статусы', en: 'All statuses', uk: 'Всі статуси' },
  view: { ru: 'Открыть', en: 'View', uk: 'Відкрити' },
};

const typeLabels: Record<string, Record<string, string>> = {
  document_request: { ru: 'Запрос документа', en: 'Document Request', uk: 'Запит документа' },
  payment_request: { ru: 'Запрос платежа', en: 'Payment Request', uk: 'Запит платежу' },
  change_request: { ru: 'Запрос изменения', en: 'Change Request', uk: 'Запит зміни' },
  question: { ru: 'Вопрос', en: 'Question', uk: 'Питання' },
};

interface ClientRequest {
  id: string;
  title: string;
  requestType: string;
  status: string;
  priority: string;
  createdAt: string;
  slaDueAt?: string;
}

export function PtRequestsTable() {
  const { locale } = useApp();
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch('/api/collections/clientRequests')
      .then(res => res.json())
      .then(data => {
        setRequests(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredRequests = requests.filter(req => {
    if (typeFilter !== 'all' && req.requestType !== typeFilter) return false;
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">{labels.title[locale]}</h1>
          <p className="text-sm text-stone-500 mt-1">{labels.subtitle[locale]}</p>
        </div>
        <Link
          href="/portal/request/new"
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
        >
          {labels.createRequest[locale]}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-emerald-100 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">{labels.allTypes[locale]}</option>
          {Object.entries(typeLabels).map(([key, labels]) => (
            <option key={key} value={key}>{labels[locale]}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-emerald-100 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">{labels.allStatuses[locale]}</option>
          <option value="submitted">{locale === 'ru' ? 'Подан' : locale === 'uk' ? 'Подано' : 'Submitted'}</option>
          <option value="triaged">{locale === 'ru' ? 'Рассмотрен' : locale === 'uk' ? 'Розглянуто' : 'Triaged'}</option>
          <option value="in_progress">{locale === 'ru' ? 'В работе' : locale === 'uk' ? 'В роботі' : 'In Progress'}</option>
          <option value="awaiting_client">{locale === 'ru' ? 'Ожидает клиента' : locale === 'uk' ? 'Очікує клієнта' : 'Awaiting Client'}</option>
          <option value="completed">{locale === 'ru' ? 'Выполнен' : locale === 'uk' ? 'Виконано' : 'Completed'}</option>
        </select>
      </div>

      {/* Requests list */}
      {filteredRequests.length > 0 ? (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-emerald-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">{labels.title_col[locale]}</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">{labels.type[locale]}</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">{labels.status[locale]}</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">{labels.created[locale]}</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-600 uppercase tracking-wide">{labels.slaDue[locale]}</th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-stone-800">{req.title}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">
                    {typeLabels[req.requestType]?.[locale] || req.requestType}
                  </td>
                  <td className="px-6 py-4">
                    <PtStatusPill status={req.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">
                    {new Date(req.createdAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">
                    {req.slaDueAt ? new Date(req.slaDueAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US') : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/portal/requests/${req.id}`}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      {labels.view[locale]}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-12 text-center">
          <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-stone-500">{labels.noRequests[locale]}</p>
          <Link
            href="/portal/request/new"
            className="text-emerald-600 hover:text-emerald-700 mt-2 inline-block text-sm font-medium"
          >
            {labels.createRequest[locale]}
          </Link>
        </div>
      )}
    </div>
  );
}
