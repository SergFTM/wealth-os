'use client';

import React from 'react';
import { PoSourceFooter } from './PoSourceFooter';

interface PhilanthropyItem {
  id: string;
  title: string;
  period: string;
  totalDonated: string;
  summary: string;
  tags: string[];
  category: string;
}

const DEMO_ITEMS: PhilanthropyItem[] = [
  {
    id: 'ph-1',
    title: 'Грантовая программа образовательных инициатив',
    period: 'Q3-Q4 2025',
    totalDonated: '$1,250,000',
    summary:
      'Предоставлено 12 грантов образовательным учреждениям в рамках программы поддержки STEM-образования. Основные получатели -- университеты Москвы и Санкт-Петербурга.',
    tags: ['Образование', 'STEM', 'Гранты'],
    category: 'Образование',
  },
  {
    id: 'ph-2',
    title: 'Годовой отчёт фонда Aurora Foundation',
    period: '2025 год',
    totalDonated: '$4,800,000',
    summary:
      'Совокупные пожертвования фонда за отчётный год. Включает программы экологии, здравоохранения и культурного наследия. Достигнут 115% от плановых показателей.',
    tags: ['Фонд', 'Годовой отчёт', 'ESG'],
    category: 'Фонд',
  },
  {
    id: 'ph-3',
    title: 'Экологический проект «Чистая вода»',
    period: 'H2 2025',
    totalDonated: '$780,000',
    summary:
      'Финансирование строительства очистных сооружений в трёх регионах. Проект охватил более 50 000 жителей. Партнёрство с WWF и местными НКО.',
    tags: ['Экология', 'Инфраструктура', 'ESG'],
    category: 'Экология',
  },
  {
    id: 'ph-4',
    title: 'Поддержка программы детского здравоохранения',
    period: 'Q4 2025',
    totalDonated: '$420,000',
    summary:
      'Целевое финансирование детских больниц и программ раннего диагностирования. Закуплено медицинское оборудование для 8 клиник.',
    tags: ['Здравоохранение', 'Дети', 'Медицина'],
    category: 'Здравоохранение',
  },
];

const categoryColors: Record<string, string> = {
  'Образование': 'bg-blue-50 text-blue-600',
  'Фонд': 'bg-emerald-50 text-emerald-600',
  'Экология': 'bg-green-50 text-green-700',
  'Здравоохранение': 'bg-amber-50 text-amber-600',
};

export function PoPhilanthropyPage() {
  return (
    <div className="space-y-6 font-[Inter]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Филантропия и импакт</h1>
        <p className="text-stone-500 mt-1">
          Опубликованные отчёты о благотворительной деятельности и социальном воздействии
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Всего направлено', value: '$7,250,000', color: 'text-emerald-600' },
          { label: 'Проектов', value: '4', color: 'text-blue-600' },
          { label: 'Получателей', value: '23', color: 'text-stone-700' },
          { label: 'Выполнение плана', value: '115%', color: 'text-amber-600' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-5"
          >
            <p className="text-sm text-stone-500">{kpi.label}</p>
            <p className={`text-2xl font-semibold mt-1 ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {DEMO_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6 hover:shadow-md transition-shadow"
          >
            {/* Category + period */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  categoryColors[item.category] || 'bg-stone-100 text-stone-600'
                }`}
              >
                {item.category}
              </span>
              <span className="text-xs text-stone-400">{item.period}</span>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-stone-800 mb-2">{item.title}</h3>

            {/* Amount */}
            <p className="text-xl font-bold text-emerald-600 mb-3">{item.totalDonated}</p>

            {/* Summary */}
            <p className="text-sm text-stone-500 leading-relaxed mb-4">{item.summary}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <PoSourceFooter
          asOfDate="2025-12-31"
          sources={['Aurora Foundation', 'WealthOS Philanthropy Module']}
        />
      </div>
    </div>
  );
}
