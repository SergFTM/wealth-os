"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  ListTodo,
  BarChart3,
  FileText,
} from 'lucide-react';
import { AiKpiStrip } from './AiKpiStrip';
import { AiActionsBar } from './AiActionsBar';
import { AiNarrativesTable } from './AiNarrativesTable';
import { AiDraftsTable } from './AiDraftsTable';
import { AiTriageTable } from './AiTriageTable';
import { AiDisclaimerBanner } from './AiGuardrailsNotice';

interface AiEvent {
  id: string;
  confidencePct: number;
  clientSafe: boolean;
  blocked: boolean;
  sourcesJson: string;
  createdAt: string;
}

interface Narrative {
  id: string;
  clientId: string;
  scopeType: string;
  scopeId: string;
  category: string;
  periodStart: string;
  periodEnd: string;
  title: string;
  narrativeText: string;
  confidencePct: number;
  createdAt: string;
}

interface Draft {
  id: string;
  clientId: string;
  draftType: string;
  title: string;
  contentText: string;
  status: 'draft' | 'reviewed' | 'sent' | 'archived';
  targetModule: string | null;
  createdAt: string;
}

interface TriageItem {
  id: string;
  clientId: string;
  category: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestedAction: string;
  status: 'open' | 'accepted' | 'dismissed' | 'completed';
  createdAt: string;
}

interface Feedback {
  rating: 'up' | 'down';
  createdAt: string;
}

interface AiDashboardPageProps {
  events: AiEvent[];
  narratives: Narrative[];
  drafts: Draft[];
  triageItems: TriageItem[];
  feedback: Feedback[];
  onOpenCopilot?: () => void;
}

export function AiDashboardPage({
  events,
  narratives,
  drafts,
  triageItems,
  feedback,
  onOpenCopilot,
}: AiDashboardPageProps) {
  const [copilotInput, setCopilotInput] = useState('');

  // Calculate KPIs
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const eventsToday = events.filter(e => new Date(e.createdAt) >= today).length;
  const narratives7d = narratives.filter(n => new Date(n.createdAt) >= sevenDaysAgo).length;
  const draftsPending = drafts.filter(d => d.status === 'draft').length;
  const triageOpen = triageItems.filter(t => t.status === 'open').length;
  const feedbackNegative30d = feedback.filter(
    f => f.rating === 'down' && new Date(f.createdAt) >= thirtyDaysAgo
  ).length;
  const clientSafeCount = events.filter(e => e.clientSafe).length;
  const missingSources = events.filter(e => {
    try {
      return JSON.parse(e.sourcesJson || '[]').length === 0;
    } catch {
      return true;
    }
  }).length;
  const guardrailBlocks = events.filter(e => e.blocked).length;

  type KpiColor = 'default' | 'emerald' | 'amber' | 'red';
  const kpiItems: { id: string; label: string; value: number; color: KpiColor; href?: string }[] = [
    { id: 'aiEventsToday', label: 'AI events сегодня', value: eventsToday, color: 'default', href: '/m/ai/list?tab=audit&period=1d' },
    { id: 'narratives7d', label: 'Narratives 7д', value: narratives7d, color: 'default', href: '/m/ai/list?tab=narratives&period=7d' },
    { id: 'draftsPending', label: 'Drafts на ревью', value: draftsPending, color: draftsPending > 0 ? 'amber' : 'default', href: '/m/ai/list?tab=drafts&status=draft' },
    { id: 'triageOpen', label: 'Triage открыто', value: triageOpen, color: triageOpen > 0 ? 'amber' : 'default', href: '/m/ai/list?tab=triage&status=open' },
    { id: 'feedbackNegative', label: 'Негативный feedback', value: feedbackNegative30d, color: feedbackNegative30d > 0 ? 'red' : 'default', href: '/m/ai/list?tab=feedback&filter=down' },
    { id: 'clientSafeCount', label: 'Client-safe', value: clientSafeCount, color: 'emerald', href: '/m/ai/list?tab=audit&filter=client_safe' },
    { id: 'missingSources', label: 'Без источников', value: missingSources, color: missingSources > 0 ? 'amber' : 'default', href: '/m/ai/list?tab=audit&filter=missing_sources' },
    { id: 'guardrailBlocks', label: 'Guardrail blocks', value: guardrailBlocks, color: guardrailBlocks > 0 ? 'red' : 'default', href: '/m/ai/list?tab=audit&filter=blocked' },
  ];

  const quickActions = [
    { id: 'explain', label: 'Объяснить изменение Net Worth', icon: TrendingUp },
    { id: 'risk', label: 'Сводка рисков', icon: AlertTriangle },
    { id: 'draft', label: 'Draft обновления клиенту', icon: MessageSquare },
    { id: 'triage', label: 'Triage задач', icon: ListTodo },
  ];

  const handleQuickAction = (actionId: string) => {
    // Would trigger AI action
    console.log('Quick action:', actionId);
    onOpenCopilot?.();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-600" />
            AI Copilot
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Единый AI контур платформы: анализ, narratives, drafts, triage
          </p>
        </div>
        <AiActionsBar onAskCopilot={onOpenCopilot} />
      </div>

      <AiDisclaimerBanner />

      {/* KPIs */}
      <AiKpiStrip items={kpiItems} />

      {/* Quick Copilot panel */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200 p-6">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-stone-800 flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-violet-600" />
              Спросить Copilot
            </h2>

            <div className="relative mb-4">
              <input
                type="text"
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                placeholder="Введите запрос..."
                className="w-full px-4 py-3 pr-24 text-sm border border-violet-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                onClick={onOpenCopilot}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
              >
                Спросить
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm text-violet-700 bg-white border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Three column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Narratives */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-stone-500" />
              Последние Narratives
            </h2>
            <Link
              href="/m/ai/list?tab=narratives"
              className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              Все
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            {narratives.slice(0, 4).map((narrative) => (
              <Link
                key={narrative.id}
                href={`/m/ai/item/${narrative.id}?type=narrative`}
                className="block p-4 bg-white rounded-xl border border-stone-200 hover:border-violet-300 hover:shadow-sm transition-all"
              >
                <div className="text-sm font-medium text-stone-800 truncate mb-1">
                  {narrative.title}
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="capitalize">{narrative.category.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{narrative.confidencePct}%</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Drafts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-stone-500" />
              Drafts на ревью
            </h2>
            <Link
              href="/m/ai/list?tab=drafts"
              className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              Все
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            {drafts
              .filter((d) => d.status === 'draft')
              .slice(0, 4)
              .map((draft) => (
                <Link
                  key={draft.id}
                  href={`/m/ai/item/${draft.id}?type=draft`}
                  className="block p-4 bg-white rounded-xl border border-stone-200 hover:border-violet-300 hover:shadow-sm transition-all"
                >
                  <div className="text-sm font-medium text-stone-800 truncate mb-1">
                    {draft.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="capitalize">{draft.draftType.replace('_', ' ')}</span>
                    {draft.targetModule && (
                      <>
                        <span>→</span>
                        <span className="capitalize">{draft.targetModule}</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Triage */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-stone-500" />
              Triage Items
            </h2>
            <Link
              href="/m/ai/list?tab=triage"
              className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              Все
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            {triageItems
              .filter((t) => t.status === 'open')
              .slice(0, 4)
              .map((item) => (
                <Link
                  key={item.id}
                  href={`/m/ai/item/${item.id}?type=triage`}
                  className={`block p-4 bg-white rounded-xl border hover:shadow-sm transition-all ${
                    item.severity === 'critical'
                      ? 'border-red-200 hover:border-red-300'
                      : item.severity === 'high'
                        ? 'border-orange-200 hover:border-orange-300'
                        : 'border-stone-200 hover:border-violet-300'
                  }`}
                >
                  <div className="text-sm font-medium text-stone-800 truncate mb-1">
                    {item.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        item.severity === 'critical'
                          ? 'text-red-700 bg-red-50'
                          : item.severity === 'high'
                            ? 'text-orange-700 bg-orange-50'
                            : 'text-stone-600 bg-stone-100'
                      }`}
                    >
                      {item.severity}
                    </span>
                    <span className="text-stone-500 capitalize">{item.category.replace('_', ' ')}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
