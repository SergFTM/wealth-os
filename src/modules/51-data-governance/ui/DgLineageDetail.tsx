'use client';

import React from 'react';
import Link from 'next/link';
import { DataLineage, DataKpi } from '../engine/types';
import { DgSeverityPill } from './DgSeverityPill';

interface DgLineageDetailProps {
  lineage: DataLineage;
  kpi?: DataKpi;
  onEdit?: () => void;
  locale?: 'ru' | 'en' | 'uk';
}

export function DgLineageDetail({ lineage, kpi, onEdit, locale = 'ru' }: DgLineageDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            {locale === 'ru' ? 'Lineage:' : 'Lineage:'} {lineage.kpiName || lineage.kpiId}
          </h1>
          {kpi && (
            <Link
              href={`/m/governance-data/kpi/${kpi.id}`}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              {locale === 'ru' ? 'Открыть KPI →' : 'Open KPI →'}
            </Link>
          )}
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            {locale === 'ru' ? 'Редактировать' : 'Edit'}
          </button>
        )}
      </div>

      {/* Pipeline Visualization */}
      <div className="space-y-6">
        {/* Inputs Section */}
        <div className="relative">
          <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-blue-200" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center z-10">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-stone-800">
              {locale === 'ru' ? 'Источники данных' : 'Data Sources'}
            </h2>
          </div>
          <div className="ml-16 grid gap-3">
            {lineage.inputsJson.map((input, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-stone-800">{input.collection}</div>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-200 text-blue-800">
                    {locale === 'ru' ? 'коллекция' : 'collection'}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {input.fields.map((field, fIdx) => (
                    <span key={fIdx} className="text-xs px-2 py-0.5 rounded bg-white text-stone-600">
                      {field}
                    </span>
                  ))}
                </div>
                {input.sourceNotes && (
                  <p className="mt-2 text-xs text-stone-500 italic">{input.sourceNotes}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Transforms Section */}
        <div className="relative">
          <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-purple-200" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center z-10">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-stone-800">
              {locale === 'ru' ? 'Этапы обработки' : 'Processing Steps'}
            </h2>
          </div>
          <div className="ml-16 space-y-3">
            {lineage.transformsJson.map((transform) => (
              <div
                key={transform.stepNo}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center text-sm font-bold">
                      {transform.stepNo}
                    </div>
                    <div>
                      <div className="font-medium text-stone-800">{transform.title}</div>
                      <p className="text-sm text-stone-600 mt-1">{transform.description}</p>
                    </div>
                  </div>
                  {transform.riskKey && transform.riskKey !== 'low' && (
                    <DgSeverityPill severity={transform.riskKey} locale={locale} />
                  )}
                </div>
                {transform.formula && (
                  <div className="mt-3 p-2 bg-white/80 rounded-lg">
                    <code className="text-xs text-stone-600">{transform.formula}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Outputs Section */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center z-10">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-stone-800">
              {locale === 'ru' ? 'Результаты' : 'Outputs'}
            </h2>
          </div>
          <div className="ml-16 grid gap-3">
            {lineage.outputsJson.map((output, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/50"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-stone-800">{output.field}</div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                    {output.type}
                  </span>
                </div>
                {output.description && (
                  <p className="mt-1 text-sm text-stone-600">{output.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
