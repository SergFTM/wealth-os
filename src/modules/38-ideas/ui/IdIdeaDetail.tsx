'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IdStatusPill } from './IdStatusPill';
import { IdRiskTag } from './IdRiskTag';
import { IdSourcesCard } from './IdSourcesCard';
import { IdOutcomesPanel } from './IdOutcomesPanel';
import { ASSET_CLASSES, TIME_HORIZONS } from '../config';
import { type IdeaOutcome } from '../engine/outcomesEngine';

type Locale = 'ru' | 'en' | 'uk';

interface Idea {
  id: string;
  ideaNumber: string;
  title: string;
  assetKey?: string;
  assetClass: string;
  horizonKey: string;
  thesisText: string;
  catalystsJson?: Array<{ description: string; timing?: string }>;
  risksJson?: Array<{ description: string; severity?: string }>;
  ipsRefsJson?: Array<{ constraintId: string; constraintName?: string; status?: string }>;
  entryPlanJson?: { zones?: string[]; triggers?: string[]; conditions?: string };
  sizingJson?: { recommendation?: string; maxAllocation?: number };
  exitPlanJson?: { targets?: string[]; stops?: string[]; timeExit?: string };
  status: string;
  riskLevel: string;
  ownerUserId: string;
  sourceRefsJson?: Array<{ type: string; id?: string; url?: string; title?: string }>;
  tagsJson?: string[];
  discussionThreadId?: string;
  committeeAgendaItemId?: string;
  committeeDecisionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface IdIdeaDetailProps {
  idea: Idea;
  outcomes?: IdeaOutcome[];
  locale?: Locale;
  onEdit?: () => void;
  onGenerateMemo?: () => void;
  onLinkCommittee?: () => void;
}

export function IdIdeaDetail({
  idea,
  outcomes = [],
  locale = 'ru',
  onEdit,
  onGenerateMemo,
  onLinkCommittee,
}: IdIdeaDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { key: 'overview', label: { ru: 'Обзор', en: 'Overview', uk: 'Огляд' } },
    { key: 'thesis', label: { ru: 'Тезис', en: 'Thesis', uk: 'Тезис' } },
    { key: 'entry', label: { ru: 'Вход и размер', en: 'Entry & Sizing', uk: 'Вхід і розмір' } },
    { key: 'risks', label: { ru: 'Риски и IPS', en: 'Risks & IPS', uk: 'Ризики і IPS' } },
    { key: 'research', label: { ru: 'Ресерч', en: 'Research', uk: 'Ресерч' } },
    { key: 'outcomes', label: { ru: 'Результаты', en: 'Outcomes', uk: 'Результати' } },
  ];

  const getLabel = (obj: Record<string, Record<Locale, string>>, key: string) => {
    const config = obj[key as keyof typeof obj];
    return config?.[locale] || config?.ru || key;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US',
      { day: '2-digit', month: 'short', year: 'numeric' }
    );
  };

  const sources = (idea.sourceRefsJson || []).map(s => ({
    type: s.type as 'note' | 'document' | 'url',
    id: s.id,
    url: s.url,
    title: s.title,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-lg text-emerald-600 font-bold">
                {idea.ideaNumber}
              </span>
              <IdStatusPill status={idea.status} locale={locale} />
              <IdRiskTag level={idea.riskLevel} locale={locale} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{idea.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {locale === 'ru' ? 'Редактировать' : 'Edit'}
              </button>
            )}
            {onGenerateMemo && (
              <button
                onClick={onGenerateMemo}
                className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-colors"
              >
                {locale === 'ru' ? 'Создать мемо' : 'Generate Memo'}
              </button>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">
              {locale === 'ru' ? 'Класс актива' : 'Asset Class'}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {getLabel(ASSET_CLASSES, idea.assetClass)}
            </div>
          </div>
          {idea.assetKey && (
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {locale === 'ru' ? 'Тикер' : 'Ticker'}
              </div>
              <div className="text-sm font-mono font-medium text-gray-900">
                {idea.assetKey}
              </div>
            </div>
          )}
          <div>
            <div className="text-xs text-gray-500 mb-1">
              {locale === 'ru' ? 'Горизонт' : 'Horizon'}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {getLabel(TIME_HORIZONS, idea.horizonKey)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">
              {locale === 'ru' ? 'Обновлено' : 'Updated'}
            </div>
            <div className="text-sm text-gray-900">
              {formatDate(idea.updatedAt)}
            </div>
          </div>
        </div>

        {/* Tags */}
        {idea.tagsJson && idea.tagsJson.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {idea.tagsJson.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${activeTab === tab.key
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {tab.label[locale] || tab.label.ru}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'ru' ? 'Краткое описание' : 'Summary'}
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {idea.thesisText.slice(0, 500)}{idea.thesisText.length > 500 ? '...' : ''}
              </p>
            </div>
          )}

          {/* Thesis */}
          {activeTab === 'thesis' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {locale === 'ru' ? 'Инвестиционный тезис' : 'Investment Thesis'}
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">{idea.thesisText}</p>
              </div>

              {idea.catalystsJson && idea.catalystsJson.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">
                    {locale === 'ru' ? 'Катализаторы' : 'Catalysts'}
                  </h3>
                  <div className="space-y-2">
                    {idea.catalystsJson.map((c, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-sm flex items-center justify-center font-medium">
                          {i + 1}
                        </span>
                        <div>
                          <div className="text-gray-900">{c.description}</div>
                          {c.timing && (
                            <div className="text-xs text-gray-500 mt-1">{c.timing}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Entry & Sizing */}
          {activeTab === 'entry' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              {idea.entryPlanJson && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">
                    {locale === 'ru' ? 'План входа' : 'Entry Plan'}
                  </h3>
                  {idea.entryPlanJson.zones && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">{locale === 'ru' ? 'Зоны:' : 'Zones:'}</span>
                      <span className="ml-2 text-gray-900">{idea.entryPlanJson.zones.join(', ')}</span>
                    </div>
                  )}
                  {idea.entryPlanJson.triggers && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">{locale === 'ru' ? 'Триггеры:' : 'Triggers:'}</span>
                      <span className="ml-2 text-gray-900">{idea.entryPlanJson.triggers.join(', ')}</span>
                    </div>
                  )}
                  {idea.entryPlanJson.conditions && (
                    <div>
                      <span className="text-sm text-gray-500">{locale === 'ru' ? 'Условия:' : 'Conditions:'}</span>
                      <span className="ml-2 text-gray-900">{idea.entryPlanJson.conditions}</span>
                    </div>
                  )}
                </div>
              )}

              {idea.sizingJson && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">
                    {locale === 'ru' ? 'Размер позиции' : 'Position Sizing'}
                  </h3>
                  {idea.sizingJson.recommendation && (
                    <p className="text-gray-900 mb-2">{idea.sizingJson.recommendation}</p>
                  )}
                  {idea.sizingJson.maxAllocation && (
                    <div className="text-sm">
                      <span className="text-gray-500">{locale === 'ru' ? 'Макс. аллокация:' : 'Max Allocation:'}</span>
                      <span className="ml-2 font-medium text-gray-900">{idea.sizingJson.maxAllocation}%</span>
                    </div>
                  )}
                </div>
              )}

              {idea.exitPlanJson && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">
                    {locale === 'ru' ? 'План выхода' : 'Exit Plan'}
                  </h3>
                  {idea.exitPlanJson.targets && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">{locale === 'ru' ? 'Цели:' : 'Targets:'}</span>
                      <span className="ml-2 text-gray-900">{idea.exitPlanJson.targets.join(', ')}</span>
                    </div>
                  )}
                  {idea.exitPlanJson.stops && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">{locale === 'ru' ? 'Стопы:' : 'Stops:'}</span>
                      <span className="ml-2 text-gray-900">{idea.exitPlanJson.stops.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Risks & IPS */}
          {activeTab === 'risks' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              {idea.risksJson && idea.risksJson.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">
                    {locale === 'ru' ? 'Риски' : 'Risks'}
                  </h3>
                  <div className="space-y-2">
                    {idea.risksJson.map((r, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                        <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <div className="text-gray-900">{r.description}</div>
                          {r.severity && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-red-100 text-red-700">
                              {r.severity}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {idea.ipsRefsJson && idea.ipsRefsJson.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">
                    {locale === 'ru' ? 'Ограничения IPS' : 'IPS Constraints'}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-500">{locale === 'ru' ? 'Ограничение' : 'Constraint'}</th>
                          <th className="text-left py-2 text-gray-500">{locale === 'ru' ? 'Статус' : 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {idea.ipsRefsJson.map((ref, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="py-2 text-gray-900">{ref.constraintName || ref.constraintId}</td>
                            <td className="py-2">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                ref.status === 'compliant' ? 'bg-green-100 text-green-700' :
                                ref.status === 'breach' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {ref.status || 'N/A'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Research */}
          {activeTab === 'research' && (
            <IdSourcesCard sources={sources} locale={locale} />
          )}

          {/* Outcomes */}
          {activeTab === 'outcomes' && (
            <IdOutcomesPanel outcomes={outcomes} locale={locale} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {locale === 'ru' ? 'Быстрые действия' : 'Quick Actions'}
            </h3>
            <div className="space-y-2">
              {onGenerateMemo && (
                <button
                  onClick={onGenerateMemo}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {locale === 'ru' ? 'Создать мемо' : 'Generate Memo'}
                </button>
              )}
              {onLinkCommittee && (
                <button
                  onClick={onLinkCommittee}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {locale === 'ru' ? 'В комитет' : 'To Committee'}
                </button>
              )}
            </div>
          </div>

          {/* Committee Status */}
          {(idea.committeeAgendaItemId || idea.committeeDecisionId) && (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                {locale === 'ru' ? 'Комитет' : 'Committee'}
              </h3>
              <div className="text-sm text-blue-700">
                {idea.committeeDecisionId ? (
                  <span>{locale === 'ru' ? 'Решение принято' : 'Decision made'}</span>
                ) : (
                  <span>{locale === 'ru' ? 'На рассмотрении' : 'Under review'}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IdIdeaDetail;
