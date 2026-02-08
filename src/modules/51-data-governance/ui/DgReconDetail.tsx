'use client';

import React, { useState } from 'react';
import { DataReconciliation, AiReconCause } from '../engine/types';
import { DgStatusPill } from './DgStatusPill';
import { DgAiPanel } from './DgAiPanel';
import { RECON_TYPES } from '../config';

interface DgReconDetailProps {
  recon: DataReconciliation;
  aiCauses?: AiReconCause[];
  onCreateException?: () => void;
  onCreateOverride?: () => void;
  locale?: 'ru' | 'en' | 'uk';
}

type TabKey = 'summary' | 'breakdown' | 'causes' | 'actions' | 'audit';

export function DgReconDetail({
  recon,
  aiCauses,
  onCreateException,
  onCreateOverride,
  locale = 'ru',
}: DgReconDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('summary');

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'summary', label: locale === 'ru' ? 'Сводка' : 'Summary' },
    { key: 'breakdown', label: locale === 'ru' ? 'Детали' : 'Breakdown' },
    { key: 'causes', label: locale === 'ru' ? 'Причины' : 'Causes' },
    { key: 'actions', label: locale === 'ru' ? 'Действия' : 'Actions' },
    { key: 'audit', label: 'Audit' },
  ];

  const formatCurrency = (value: number, currency?: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: currency ? 'currency' : 'decimal',
      currency: currency || undefined,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-stone-900">
              {recon.name || RECON_TYPES[recon.reconTypeKey]?.[locale]}
            </h1>
            <DgStatusPill status={recon.statusKey} locale={locale} />
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-700">
              {RECON_TYPES[recon.reconTypeKey]?.[locale]}
            </span>
            <span>As-of: {formatDate(recon.asOf)}</span>
          </div>
        </div>
      </div>

      {/* Delta Card */}
      <div className={`p-6 rounded-xl border ${
        recon.statusKey === 'break'
          ? 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200'
          : 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200'
      }`}>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-stone-500 mb-1">{recon.leftSourceJson.name}</div>
            <div className="text-2xl font-bold text-stone-900">
              {formatCurrency(recon.leftSourceJson.value, recon.leftSourceJson.currency)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-stone-500 mb-1">{locale === 'ru' ? 'Дельта' : 'Delta'}</div>
            <div className={`text-2xl font-bold ${
              recon.statusKey === 'break' ? 'text-red-600' : 'text-stone-900'
            }`}>
              {formatCurrency(recon.deltaValueJson.amount, recon.deltaValueJson.currency)}
            </div>
            <div className="text-sm text-stone-500">
              ({recon.deltaValueJson.percent.toFixed(2)}%)
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-stone-500 mb-1">{recon.rightSourceJson.name}</div>
            <div className="text-2xl font-bold text-stone-900">
              {formatCurrency(recon.rightSourceJson.value, recon.rightSourceJson.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-4 py-2 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'summary' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50">
              <h3 className="font-medium text-stone-800 mb-3">
                {recon.leftSourceJson.name}
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-stone-500">{locale === 'ru' ? 'Система' : 'System'}</dt>
                  <dd className="font-medium text-stone-800">{recon.leftSourceJson.system}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">{locale === 'ru' ? 'Значение' : 'Value'}</dt>
                  <dd className="font-medium text-stone-800">
                    {formatCurrency(recon.leftSourceJson.value, recon.leftSourceJson.currency)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">As-of</dt>
                  <dd className="font-medium text-stone-800">{formatDate(recon.leftSourceJson.asOf)}</dd>
                </div>
                {recon.leftSourceJson.recordCount !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-stone-500">{locale === 'ru' ? 'Записей' : 'Records'}</dt>
                    <dd className="font-medium text-stone-800">{recon.leftSourceJson.recordCount}</dd>
                  </div>
                )}
              </dl>
            </div>
            <div className="p-4 rounded-lg bg-stone-50/50 border border-stone-200/50">
              <h3 className="font-medium text-stone-800 mb-3">
                {recon.rightSourceJson.name}
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-stone-500">{locale === 'ru' ? 'Система' : 'System'}</dt>
                  <dd className="font-medium text-stone-800">{recon.rightSourceJson.system}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">{locale === 'ru' ? 'Значение' : 'Value'}</dt>
                  <dd className="font-medium text-stone-800">
                    {formatCurrency(recon.rightSourceJson.value, recon.rightSourceJson.currency)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">As-of</dt>
                  <dd className="font-medium text-stone-800">{formatDate(recon.rightSourceJson.asOf)}</dd>
                </div>
                {recon.rightSourceJson.recordCount !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-stone-500">{locale === 'ru' ? 'Записей' : 'Records'}</dt>
                    <dd className="font-medium text-stone-800">{recon.rightSourceJson.recordCount}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'breakdown' && recon.breakdownJson && (
          <div className="overflow-hidden rounded-xl border border-stone-200/50">
            <table className="min-w-full divide-y divide-stone-200/50">
              <thead className="bg-stone-50/80">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                    {locale === 'ru' ? 'Категория' : 'Category'}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">
                    {recon.leftSourceJson.name}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">
                    {recon.rightSourceJson.name}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">
                    {locale === 'ru' ? 'Дельта' : 'Delta'}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                    {locale === 'ru' ? 'Статус' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {recon.breakdownJson.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-stone-900">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-right text-stone-600">
                      {formatCurrency(item.leftValue)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-stone-600">
                      {formatCurrency(item.rightValue)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-medium ${
                      item.status === 'break' ? 'text-red-600' : 'text-stone-600'
                    }`}>
                      {formatCurrency(item.delta)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <DgStatusPill status={item.status} locale={locale} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'causes' && (
          <DgAiPanel
            mode="recon"
            reconCauses={aiCauses}
            locale={locale}
          />
        )}

        {activeTab === 'actions' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              {onCreateException && recon.statusKey === 'break' && (
                <button
                  onClick={onCreateException}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {locale === 'ru' ? 'Создать Exception' : 'Create Exception'}
                </button>
              )}
              {onCreateOverride && (
                <button
                  onClick={onCreateOverride}
                  className="px-4 py-2 text-sm font-medium bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
                >
                  {locale === 'ru' ? 'Создать Override' : 'Create Override'}
                </button>
              )}
            </div>
            <p className="text-sm text-stone-500">
              {locale === 'ru'
                ? 'Выберите действие для обработки расхождения'
                : 'Select an action to handle the break'}
            </p>
          </div>
        )}

        {activeTab === 'audit' && (
          <p className="text-center py-8 text-stone-500">
            {locale === 'ru' ? 'Audit trail будет показан здесь' : 'Audit trail will be shown here'}
          </p>
        )}
      </div>
    </div>
  );
}
