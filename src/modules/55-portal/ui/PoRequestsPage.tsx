'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { REQUEST_CATEGORIES, REQUEST_URGENCY, REQUEST_STATUSES } from '../config';

interface PortalRequest {
  id: string;
  category: string;
  title: string;
  description: string;
  urgency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const DEMO_REQUESTS: PortalRequest[] = [
  {
    id: 'req-001',
    category: 'documents',
    title: 'Запрос выписки по трастовому счёту',
    description: 'Необходима актуальная выписка по счёту Aurora Family Trust за Q4 2025.',
    urgency: 'medium',
    status: 'open',
    createdAt: '2026-01-20T10:30:00Z',
    updatedAt: '2026-01-20T10:30:00Z',
  },
  {
    id: 'req-002',
    category: 'payments',
    title: 'Платёж поставщику недвижимости',
    description: 'Согласование платежа в размере $125,000 за ремонт объекта на Park Avenue.',
    urgency: 'high',
    status: 'in_progress',
    createdAt: '2026-01-18T14:00:00Z',
    updatedAt: '2026-01-22T09:15:00Z',
  },
  {
    id: 'req-003',
    category: 'reporting',
    title: 'Консолидированный отчёт за 2025 год',
    description: 'Подготовка полного годового отчёта для семейного совещания в марте.',
    urgency: 'medium',
    status: 'in_progress',
    createdAt: '2026-01-15T11:00:00Z',
    updatedAt: '2026-01-25T16:40:00Z',
  },
  {
    id: 'req-004',
    category: 'tax',
    title: 'Налоговое планирование 2026',
    description: 'Предварительный расчёт налоговых обязательств и стратегии оптимизации на 2026 год.',
    urgency: 'low',
    status: 'open',
    createdAt: '2026-01-25T08:00:00Z',
    updatedAt: '2026-01-25T08:00:00Z',
  },
  {
    id: 'req-005',
    category: 'trust',
    title: 'Обновление состава бенефициаров',
    description: 'Добавление нового бенефициара в Aurora Family Trust. Подготовка документов.',
    urgency: 'high',
    status: 'resolved',
    createdAt: '2026-01-05T09:30:00Z',
    updatedAt: '2026-01-19T14:00:00Z',
  },
  {
    id: 'req-006',
    category: 'other',
    title: 'Обновление контактных данных',
    description: 'Смена основного адреса электронной почты и номера телефона для уведомлений.',
    urgency: 'low',
    status: 'resolved',
    createdAt: '2026-01-02T12:00:00Z',
    updatedAt: '2026-01-03T10:00:00Z',
  },
];

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StatusBadge({ status }: { status: string }) {
  const cfg = (REQUEST_STATUSES as any)[status];
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-emerald-50 text-emerald-600',
  };
  const cls = colorMap[cfg?.color] || 'bg-stone-100 text-stone-600';
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cls}`}>
      {cfg?.ru || status}
    </span>
  );
}

function UrgencyBadge({ urgency }: { urgency: string }) {
  const cfg = (REQUEST_URGENCY as any)[urgency];
  const colorMap: Record<string, string> = {
    stone: 'bg-stone-100 text-stone-500',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };
  const cls = colorMap[cfg?.color] || 'bg-stone-100 text-stone-500';
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      {cfg?.ru || urgency}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const cfg = (REQUEST_CATEGORIES as any)[category];
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    teal: 'bg-teal-50 text-teal-600',
    stone: 'bg-stone-100 text-stone-600',
  };
  const cls = colorMap[cfg?.color] || 'bg-stone-100 text-stone-600';
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      {cfg?.ru || category}
    </span>
  );
}

export function PoRequestsPage() {
  const router = useRouter();
  const collection = useCollection<any>('portalRequests');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formCategory, setFormCategory] = useState('documents');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formUrgency, setFormUrgency] = useState('medium');

  // Use API data or fall back to demo
  const requests: PortalRequest[] =
    collection.items.length > 0 ? (collection.items as any[]) : DEMO_REQUESTS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    await collection.create({
      category: formCategory,
      title: formTitle.trim(),
      description: formDescription.trim(),
      urgency: formUrgency,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any);

    setFormCategory('documents');
    setFormTitle('');
    setFormDescription('');
    setFormUrgency('medium');
    setShowForm(false);
  };

  const categories = Object.keys(REQUEST_CATEGORIES);
  const urgencies = Object.keys(REQUEST_URGENCY);

  return (
    <div className="space-y-6 font-[Inter]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Запросы</h1>
          <p className="text-stone-500 mt-1">Отслеживайте ваши обращения и их статус</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Создать запрос
        </button>
      </div>

      {/* Inline create form */}
      {showForm && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-5">Новый запрос</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1.5">
                  Категория
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {(REQUEST_CATEGORIES as any)[cat].ru}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1.5">
                  Срочность
                </label>
                <select
                  value={formUrgency}
                  onChange={(e) => setFormUrgency(e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all text-sm"
                >
                  {urgencies.map((urg) => (
                    <option key={urg} value={urg}>
                      {(REQUEST_URGENCY as any)[urg].ru}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">
                Тема запроса
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Кратко опишите запрос..."
                required
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">
                Описание
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Подробное описание запроса..."
                rows={4}
                required
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all text-sm resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors font-medium text-sm"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm"
              >
                Отправить запрос
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests list */}
      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            onClick={() => router.push(`/portal/request/${req.id}`)}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-5 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <CategoryBadge category={req.category} />
                  <UrgencyBadge urgency={req.urgency} />
                </div>
                <h3 className="text-sm font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors">
                  {req.title}
                </h3>
                <p className="text-sm text-stone-500 mt-1 line-clamp-1">{req.description}</p>
                <p className="text-xs text-stone-400 mt-2">
                  Создан: {formatDate(req.createdAt)}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <StatusBadge status={req.status} />
                <svg
                  className="w-5 h-5 text-stone-300 group-hover:text-emerald-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-stone-400">Нет запросов</p>
        </div>
      )}
    </div>
  );
}
