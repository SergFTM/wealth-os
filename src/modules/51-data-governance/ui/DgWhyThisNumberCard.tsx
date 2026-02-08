'use client';

import React, { useState } from 'react';
import { WhyThisNumber } from '../engine/types';
import { DgTrustBadge } from './DgTrustBadge';
import { DgSeverityPill } from './DgSeverityPill';

interface DgWhyThisNumberCardProps {
  data: WhyThisNumber;
  locale?: 'ru' | 'en' | 'uk';
}

export function DgWhyThisNumberCard({ data, locale = 'ru' }: DgWhyThisNumberCardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('formula');

  const formatValue = (value: number, currency?: string) => {
    if (currency) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return new Intl.NumberFormat('ru-RU').format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const sections = [
    { key: 'formula', label: locale === 'ru' ? 'Формула' : 'Formula' },
    { key: 'inputs', label: locale === 'ru' ? 'Источники' : 'Inputs' },
    { key: 'transforms', label: locale === 'ru' ? 'Этапы расчета' : 'Transforms' },
    { key: 'assumptions', label: locale === 'ru' ? 'Допущения' : 'Assumptions' },
  ];

  return (
    <div className="rounded-xl border border-stone-200/50 bg-gradient-to-br from-white to-stone-50/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">{data.kpiName}</h3>
            <p className="text-sm text-stone-600 mt-1">{data.definition}</p>
          </div>
          <DgTrustBadge badge={data.trustBadge} size="md" locale={locale} />
        </div>

        {/* Current Value */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-stone-900">
            {formatValue(data.currentValue.value, data.currentValue.currency)}
          </span>
          {data.currentValue.unit && (
            <span className="text-sm text-stone-500">{data.currentValue.unit}</span>
          )}
        </div>
        <p className="text-xs text-stone-500 mt-1">
          {locale === 'ru' ? 'По состоянию на' : 'As of'} {formatDate(data.asOf)}
        </p>
      </div>

      {/* Quality & Confidence */}
      <div className="px-6 py-3 flex items-center gap-4 border-b border-stone-200/50 bg-stone-50/30">
        {data.qualityScore !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">
              {locale === 'ru' ? 'Качество:' : 'Quality:'}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    data.qualityScore >= 80
                      ? 'bg-emerald-500'
                      : data.qualityScore >= 60
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${data.qualityScore}%` }}
                />
              </div>
              <span className="text-sm font-medium">{data.qualityScore}%</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">
            {locale === 'ru' ? 'Уверенность:' : 'Confidence:'}
          </span>
          <DgSeverityPill severity={data.confidence} locale={locale} />
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="divide-y divide-stone-200/50">
        {sections.map((section) => (
          <div key={section.key}>
            <button
              onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
              className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-stone-50/50 transition-colors"
            >
              <span className="text-sm font-medium text-stone-700">{section.label}</span>
              <svg
                className={`w-5 h-5 text-stone-400 transition-transform ${
                  expandedSection === section.key ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedSection === section.key && (
              <div className="px-6 pb-4 text-sm text-stone-600">
                {section.key === 'formula' && (
                  <div className="p-3 bg-stone-100/50 rounded-lg font-mono text-sm">
                    {data.formula || (locale === 'ru' ? 'Формула не указана' : 'No formula specified')}
                  </div>
                )}

                {section.key === 'inputs' && (
                  <div className="space-y-2">
                    {data.inputs.map((input, idx) => (
                      <div key={idx} className="p-3 bg-stone-100/50 rounded-lg">
                        <div className="font-medium text-stone-800">{input.name}</div>
                        <div className="text-xs text-stone-500 mt-1">
                          {locale === 'ru' ? 'Коллекция:' : 'Collection:'} {input.collection}
                        </div>
                        <div className="text-xs text-stone-500">
                          {locale === 'ru' ? 'Поля:' : 'Fields:'} {input.fields.join(', ')}
                        </div>
                      </div>
                    ))}
                    {data.inputs.length === 0 && (
                      <p className="text-stone-400">{locale === 'ru' ? 'Нет источников' : 'No inputs'}</p>
                    )}
                  </div>
                )}

                {section.key === 'transforms' && (
                  <div className="space-y-2">
                    {data.transforms.map((transform, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-medium">
                          {transform.step}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-stone-800">{transform.title}</div>
                          <div className="text-xs text-stone-500 mt-0.5">{transform.description}</div>
                          {transform.formula && (
                            <div className="text-xs font-mono bg-stone-100/50 px-2 py-1 rounded mt-1 inline-block">
                              {transform.formula}
                            </div>
                          )}
                          {transform.risk && transform.risk !== 'low' && (
                            <div className="mt-1">
                              <DgSeverityPill severity={transform.risk} locale={locale} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {data.transforms.length === 0 && (
                      <p className="text-stone-400">{locale === 'ru' ? 'Прямое использование данных' : 'Direct data usage'}</p>
                    )}
                  </div>
                )}

                {section.key === 'assumptions' && (
                  <div className="space-y-1">
                    {data.assumptions.map((assumption, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>{assumption}</span>
                      </div>
                    ))}
                    {data.assumptions.length === 0 && (
                      <p className="text-stone-400">{locale === 'ru' ? 'Нет допущений' : 'No assumptions'}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sources Footer */}
      <div className="px-6 py-3 bg-stone-50/50 border-t border-stone-200/50">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500">
            {locale === 'ru' ? 'Источники:' : 'Sources:'}
          </span>
          {data.sources.map((source, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-stone-200/50 text-stone-600"
            >
              {source.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
