'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { REQUEST_CATEGORIES, REQUEST_URGENCY, REQUEST_STATUSES } from '../config';

interface Props {
  requestId: string;
}

const MOCK_REQUEST = {
  id: 'req-002',
  title: 'Платёж поставщику недвижимости',
  category: 'payments',
  urgency: 'high',
  status: 'in_progress',
  description:
    'Согласование платежа в размере $125,000 за ремонт объекта на Park Avenue. Необходима верификация счёта и подтверждение от Relationship Manager. Срок оплаты по контракту -- 30 января 2026.',
  createdAt: '2026-01-18T14:00:00Z',
  updatedAt: '2026-01-22T09:15:00Z',
  linkedCaseId: 'CASE-2026-0042',
};

const TIMELINE_STEPS = [
  { key: 'open', label: 'Открыт', labelFull: 'Запрос создан' },
  { key: 'in_progress', label: 'В работе', labelFull: 'Взят в обработку' },
  { key: 'resolved', label: 'Решён', labelFull: 'Запрос закрыт' },
];

function formatDateTime(d: string): string {
  return new Date(d).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Badge({
  label,
  colorKey,
  configMap,
}: {
  label: string;
  colorKey: string;
  configMap: Record<string, string>;
}) {
  const cls = configMap[colorKey] || 'bg-stone-100 text-stone-600';
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

const statusColorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-emerald-50 text-emerald-600',
};

const urgencyColorMap: Record<string, string> = {
  stone: 'bg-stone-100 text-stone-500',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
};

const categoryColorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber-50 text-amber-600',
  teal: 'bg-teal-50 text-teal-600',
  stone: 'bg-stone-100 text-stone-600',
};

function getStepStatus(stepKey: string, currentStatus: string): 'done' | 'current' | 'pending' {
  const order = ['open', 'in_progress', 'resolved'];
  const currentIdx = order.indexOf(currentStatus);
  const stepIdx = order.indexOf(stepKey);
  if (stepIdx < currentIdx) return 'done';
  if (stepIdx === currentIdx) return 'current';
  return 'pending';
}

export function PoRequestDetail({ requestId }: Props) {
  const req = { ...MOCK_REQUEST, id: requestId };
  const categoryCfg = (REQUEST_CATEGORIES as any)[req.category];
  const urgencyCfg = (REQUEST_URGENCY as any)[req.urgency];
  const statusCfg = (REQUEST_STATUSES as any)[req.status];

  return (
    <div className="space-y-6 font-[Inter]">
      {/* Back + Title */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-stone-800">{req.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge
                label={categoryCfg?.ru || req.category}
                colorKey={categoryCfg?.color}
                configMap={categoryColorMap}
              />
              <Badge
                label={urgencyCfg?.ru || req.urgency}
                colorKey={urgencyCfg?.color}
                configMap={urgencyColorMap}
              />
              <Badge
                label={statusCfg?.ru || req.status}
                colorKey={statusCfg?.color}
                configMap={statusColorMap}
              />
            </div>
          </div>
          <span className="shrink-0 text-xs text-stone-400 font-mono">#{req.id}</span>
        </div>
      </div>

      {/* Status timeline */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-5">
          Прогресс
        </h2>
        <div className="flex items-center">
          {TIMELINE_STEPS.map((step, idx) => {
            const s = getStepStatus(step.key, req.status);
            const isLast = idx === TIMELINE_STEPS.length - 1;

            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center min-w-[100px]">
                  {/* Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      s === 'done'
                        ? 'bg-emerald-500 text-white'
                        : s === 'current'
                        ? 'bg-amber-400 text-white ring-4 ring-amber-100'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {s === 'done' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 font-medium ${
                      s === 'current' ? 'text-amber-600' : s === 'done' ? 'text-emerald-600' : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">{step.labelFull}</p>
                </div>
                {/* Connector line */}
                {!isLast && (
                  <div
                    className={`flex-1 h-0.5 -mt-6 ${
                      s === 'done' ? 'bg-emerald-400' : 'bg-stone-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Description + Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Description */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
            Описание
          </h2>
          <p className="text-stone-700 leading-relaxed">{req.description}</p>
        </div>

        {/* Metadata sidebar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6 space-y-5">
          <div>
            <p className="text-xs text-stone-400 mb-1">Создан</p>
            <p className="text-sm font-medium text-stone-700">{formatDateTime(req.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">Обновлён</p>
            <p className="text-sm font-medium text-stone-700">{formatDateTime(req.updatedAt)}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">Связанный кейс</p>
            <p className="text-sm font-medium text-emerald-600">{req.linkedCaseId}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">Категория</p>
            <Badge
              label={categoryCfg?.ru || req.category}
              colorKey={categoryCfg?.color}
              configMap={categoryColorMap}
            />
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-1">Срочность</p>
            <Badge
              label={urgencyCfg?.ru || req.urgency}
              colorKey={urgencyCfg?.color}
              configMap={urgencyColorMap}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
