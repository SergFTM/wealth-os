"use client";

import { useState, useMemo } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Loader2,
} from 'lucide-react';
import {
  explainCurrentConsents,
  detectConflictsInsight,
} from '../engine/aiConsentAssistant';
import type { AiInsight } from '../engine/aiConsentAssistant';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
export interface CoAiPanelProps {
  consents: any[];
  policies: any[];
  loading?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function CoAiPanel({ consents, policies, loading }: CoAiPanelProps) {
  /* Compute insights from engine */
  const consentInsight = useMemo(
    () => (consents.length > 0 ? explainCurrentConsents(consents) : null),
    [consents],
  );

  const conflictInsight = useMemo(
    () => (consents.length > 0 ? detectConflictsInsight(consents, policies) : null),
    [consents, policies],
  );

  /* Collapsible state per card */
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    overview: true,
    conflicts: false,
    minimal: false,
  });

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        <span className="text-sm text-stone-500">AI анализирует данные...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ---- Gradient header card ---- */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-semibold text-lg">AI Consent Assistant</h3>
        </div>
        <p className="text-emerald-100 text-sm">
          Автоматический анализ согласий, конфликтов и уровня доступа
        </p>
      </div>

      {/* ---- Insight 1: Overview ---- */}
      {consentInsight && (
        <InsightCard
          insight={consentInsight}
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
          expanded={expanded.overview}
          onToggle={() => toggle('overview')}
        />
      )}

      {/* ---- Insight 2: Conflicts ---- */}
      {conflictInsight && (
        <InsightCard
          insight={conflictInsight}
          icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
          expanded={expanded.conflicts}
          onToggle={() => toggle('conflicts')}
        />
      )}

      {/* ---- Insight 3: Minimal access placeholder ---- */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
        <button
          onClick={() => toggle('minimal')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-50/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-stone-800 text-sm">
              Минимальный доступ
            </span>
          </div>
          {expanded.minimal ? (
            <ChevronDown className="w-4 h-4 text-stone-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-stone-400" />
          )}
        </button>
        {expanded.minimal && (
          <div className="px-4 pb-4 border-t border-stone-100">
            <p className="text-sm text-stone-400 mt-3">
              Выберите получателя для анализа минимального набора доступа.
            </p>
          </div>
        )}
      </div>

      {/* ---- Disclaimer ---- */}
      <div className="text-xs text-stone-400 italic px-1">
        AI-анализ носит информационный характер и не является юридической рекомендацией.
        Все решения должны приниматься уполномоченными лицами.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  InsightCard — collapsible insight display                          */
/* ------------------------------------------------------------------ */
function InsightCard({
  insight,
  icon,
  expanded,
  onToggle,
}: {
  insight: AiInsight;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      {/* Header (clickable) */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-stone-800 text-sm">{insight.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceBadge value={insight.confidence} />
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-stone-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-stone-400" />
          )}
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-stone-100 space-y-3">
          {/* Rendered body with simple bold support */}
          <div className="text-sm text-stone-700 whitespace-pre-wrap mt-3">
            {renderBody(insight.body)}
          </div>

          {/* Sources */}
          {insight.sources.length > 0 && (
            <div>
              <div className="text-xs text-stone-400 mb-1">Источники:</div>
              <div className="flex flex-wrap gap-1">
                {insight.sources.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Assumptions */}
          {insight.assumptions.length > 0 && (
            <div>
              <div className="text-xs text-stone-400 mb-1">Допущения:</div>
              <ul className="text-xs text-stone-500 list-disc list-inside space-y-0.5">
                {insight.assumptions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ConfidenceBadge                                                    */
/* ------------------------------------------------------------------ */
function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color =
    pct >= 90
      ? 'bg-emerald-100 text-emerald-700'
      : pct >= 70
        ? 'bg-amber-100 text-amber-700'
        : 'bg-red-100 text-red-700';

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      {pct}%
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Simple body renderer (handles **bold**)                            */
/* ------------------------------------------------------------------ */
function renderBody(body: string): React.ReactNode {
  const parts = body.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="font-semibold text-stone-800">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
