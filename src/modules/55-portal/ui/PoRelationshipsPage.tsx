'use client';

import React from 'react';

interface RelationshipManager {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  nextMeeting: string;
  initials: string;
  color: string;
}

const DEMO_MANAGERS: RelationshipManager[] = [
  {
    id: 'rm-1',
    name: 'Елена Смирнова',
    role: 'Старший Relationship Manager',
    email: 'e.smirnova@aurora-wealth.com',
    phone: '+7 (495) 123-45-67',
    nextMeeting: '2026-02-14',
    initials: 'ЕС',
    color: 'from-emerald-400 to-emerald-500',
  },
  {
    id: 'rm-2',
    name: 'Дмитрий Козлов',
    role: 'Инвестиционный консультант',
    email: 'd.kozlov@aurora-wealth.com',
    phone: '+7 (495) 234-56-78',
    nextMeeting: '2026-02-18',
    initials: 'ДК',
    color: 'from-amber-400 to-amber-500',
  },
  {
    id: 'rm-3',
    name: 'Анна Петрова',
    role: 'Налоговый консультант',
    email: 'a.petrova@aurora-wealth.com',
    phone: '+7 (495) 345-67-89',
    nextMeeting: '2026-03-01',
    initials: 'АП',
    color: 'from-blue-400 to-blue-500',
  },
];

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function PoRelationshipsPage() {
  return (
    <div className="space-y-6 font-[Inter]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Ваши контактные лица</h1>
        <p className="text-stone-500 mt-1">
          Команда специалистов, закреплённых за вашей семьёй
        </p>
      </div>

      {/* Manager cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEMO_MANAGERS.map((mgr) => (
          <div
            key={mgr.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6 hover:shadow-md transition-shadow"
          >
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-5">
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${mgr.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}
              >
                {mgr.initials}
              </div>
              <div>
                <h3 className="text-base font-semibold text-stone-800">{mgr.name}</h3>
                <p className="text-sm text-stone-500">{mgr.role}</p>
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center gap-3">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <a
                  href={`mailto:${mgr.email}`}
                  className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors truncate"
                >
                  {mgr.email}
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <a
                  href={`tel:${mgr.phone}`}
                  className="text-sm text-stone-600 hover:text-stone-800 transition-colors"
                >
                  {mgr.phone}
                </a>
              </div>

              {/* Next meeting */}
              <div className="flex items-center gap-3">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-stone-400">Следующая встреча</p>
                  <p className="text-sm font-medium text-stone-700">{formatDate(mgr.nextMeeting)}</p>
                </div>
              </div>
            </div>

            {/* Quick action */}
            <div className="mt-5 pt-4 border-t border-stone-100">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl text-sm font-medium text-stone-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Написать сообщение
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
