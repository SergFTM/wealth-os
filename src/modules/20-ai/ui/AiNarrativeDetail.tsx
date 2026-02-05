"use client";

import Link from 'next/link';
import { ArrowLeft, Download, Edit3, Calendar, Target, BarChart3, Sparkles } from 'lucide-react';
import { AiConfidenceBadge } from './AiConfidenceBadge';
import { AiSourcesCard } from './AiSourcesCard';
import { AiDisclaimerBanner } from './AiGuardrailsNotice';

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
  sourcesJson: string;
  confidencePct: number;
  createdAt: string;
}

interface AiNarrativeDetailProps {
  narrative: Narrative;
  onBack?: () => void;
  onExport?: () => void;
  onConvertToDraft?: () => void;
  onAskFollowUp?: () => void;
}

const categoryLabels: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  net_worth: { label: 'Net Worth', color: 'text-emerald-600 bg-emerald-50', icon: BarChart3 },
  performance: { label: 'Performance', color: 'text-blue-600 bg-blue-50', icon: BarChart3 },
  risk: { label: 'Risk', color: 'text-red-600 bg-red-50', icon: Target },
  liquidity: { label: 'Liquidity', color: 'text-amber-600 bg-amber-50', icon: BarChart3 },
  compliance: { label: 'Compliance', color: 'text-purple-600 bg-purple-50', icon: Target },
  tax: { label: 'Tax', color: 'text-indigo-600 bg-indigo-50', icon: BarChart3 },
  fees: { label: 'Fees', color: 'text-green-600 bg-green-50', icon: BarChart3 },
};

const scopeLabels: Record<string, string> = {
  household: 'Домохозяйство',
  entity: 'Юр. лицо',
  portfolio: 'Портфель',
  account: 'Счет',
  global: 'Глобально',
};

export function AiNarrativeDetail({
  narrative,
  onBack,
  onExport,
  onConvertToDraft,
  onAskFollowUp,
}: AiNarrativeDetailProps) {
  const category = categoryLabels[narrative.category] || {
    label: narrative.category,
    color: 'text-stone-600 bg-stone-100',
    icon: BarChart3,
  };
  const CategoryIcon = category.icon;

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const sources = (() => {
    try {
      return JSON.parse(narrative.sourcesJson || '[]');
    } catch {
      return [];
    }
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/m/ai/list?tab=narratives"
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-stone-800">{narrative.title}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${category.color}`}>
                <CategoryIcon className="w-3 h-3" />
                {category.label}
              </span>
              <span>{scopeLabels[narrative.scopeType] || narrative.scopeType}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onAskFollowUp && (
            <button
              onClick={onAskFollowUp}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Уточнить у Copilot
            </button>
          )}
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Экспорт
          </button>
          <button
            onClick={onConvertToDraft}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Конвертировать в draft
          </button>
        </div>
      </div>

      <AiDisclaimerBanner />

      {/* Meta info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-1">
            <Calendar className="w-4 h-4" />
            Период
          </div>
          <div className="text-stone-800 font-medium">
            {formatDate(narrative.periodStart)} — {formatDate(narrative.periodEnd)}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-1">
            <Target className="w-4 h-4" />
            Scope
          </div>
          <div className="text-stone-800 font-medium">
            {scopeLabels[narrative.scopeType] || narrative.scopeType}: {narrative.scopeId}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="text-sm text-stone-500 mb-1">Уверенность</div>
          <AiConfidenceBadge confidence={narrative.confidencePct} size="md" />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Narrative</h2>
            <div className="prose prose-stone max-w-none">
              <div className="whitespace-pre-wrap text-stone-700 leading-relaxed">
                {narrative.narrativeText}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <AiSourcesCard sources={sources} />

          <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
            <div className="text-xs text-stone-500 mb-1">Создано</div>
            <div className="text-sm text-stone-700">{formatDate(narrative.createdAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
