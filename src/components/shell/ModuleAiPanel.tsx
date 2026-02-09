"use client";

import { useApp } from "@/lib/store";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useCollection } from "@/lib/hooks";
import { getModuleBySlug } from "@/modules/index";
import { getSchemaBySlug } from "@/db/schemas";
import { getModuleKnowledge } from "@/modules/20-ai/engine/moduleKnowledge";
import { buildModuleInsights, type ModuleInsight, type DecisionSuggestion } from "@/modules/20-ai/engine/moduleInsights";
import {
  Brain,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  Lightbulb,
  Send,
  Shield,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  X,
  Sparkles,
} from "lucide-react";

/* ─────────── types ─────────── */

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  confidence?: number;
  sources?: Array<{ label: string; href: string }>;
  eventId?: string;
}

/* ─────────── small helper: load multiple collections ─────────── */

function useModuleCollections(collectionNames: string[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c0 = useCollection<any>(collectionNames[0] || "__none__");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c1 = useCollection<any>(collectionNames[1] || "__none__");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c2 = useCollection<any>(collectionNames[2] || "__none__");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c3 = useCollection<any>(collectionNames[3] || "__none__");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c4 = useCollection<any>(collectionNames[4] || "__none__");

  const allLoading = [c0, c1, c2, c3, c4].some(
    (c, i) => collectionNames[i] && c.loading
  );

  const data = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map: Record<string, any[]> = {};
    [c0, c1, c2, c3, c4].forEach((c, i) => {
      if (collectionNames[i]) map[collectionNames[i]] = c.items;
    });
    return map;
  }, [c0.items, c1.items, c2.items, c3.items, c4.items, collectionNames]);

  return { data, loading: allLoading };
}

/* ─────────── severity icon ─────────── */

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === "critical")
    return <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />;
  if (severity === "warning")
    return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
  return <Info className="w-4 h-4 text-sky-500 flex-shrink-0" />;
}

/* ═══════════════════════════════════════════════════════════════════
   ModuleAiPanel
   ═══════════════════════════════════════════════════════════════════ */

export function ModuleAiPanel() {
  const { aiPanelOpen, toggleAiPanel, locale } = useApp();
  const params = useParams();
  const slug = (params?.slug as string) || "";

  // Module metadata
  const moduleConfig = useMemo(() => getModuleBySlug(slug), [slug]);
  const schema = useMemo(() => getSchemaBySlug(slug), [slug]);
  const knowledge = useMemo(() => getModuleKnowledge(slug), [slug]);

  // Collections from config
  const collectionNames = useMemo(
    () => (moduleConfig?.collections || schema?.collections || []).slice(0, 5),
    [moduleConfig, schema]
  );

  const { data: collectionsData, loading: collectionsLoading } =
    useModuleCollections(collectionNames);

  // Insights
  const insightsResult = useMemo(() => {
    if (collectionsLoading) return null;
    return buildModuleInsights(slug, collectionsData, locale);
  }, [slug, collectionsData, collectionsLoading, locale]);

  // Expand/collapse sections
  const [insightsExpanded, setInsightsExpanded] = useState(true);
  const [decisionsExpanded, setDecisionsExpanded] = useState(true);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [knowledgeExpanded, setKnowledgeExpanded] = useState(false);

  // Decision actions
  const [acceptedDecisions, setAcceptedDecisions] = useState<Set<string>>(
    new Set()
  );
  const [rejectedDecisions, setRejectedDecisions] = useState<Set<string>>(
    new Set()
  );

  // Chat
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clientSafeMode, setClientSafeMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<
    Record<string, "up" | "down">
  >({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset state on slug change
  useEffect(() => {
    setMessages([]);
    setAcceptedDecisions(new Set());
    setRejectedDecisions(new Set());
    setChatExpanded(false);
  }, [slug]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- chat handlers ---

  const handleSubmit = async () => {
    if (!query.trim() || isLoading) return;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    try {
      const resp = await fetch("/api/ai/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          promptType: "general_query",
          clientSafe: clientSafeMode,
          context: {
            moduleKey: slug,
            moduleName: moduleConfig?.title?.[locale] || slug,
          },
        }),
      });
      const data = await resp.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          content:
            data.response ||
            data.error ||
            (locale === "ru"
              ? "Не удалось получить ответ"
              : "Failed to get response"),
          timestamp: new Date().toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
          }),
          confidence: data.confidence,
          sources: data.sources,
          eventId: data.eventId,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "ai",
          content:
            locale === "ru"
              ? "Ошибка обработки запроса. Попробуйте ещё раз."
              : "Error processing request. Please try again.",
          timestamp: new Date().toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (
    messageId: string,
    rating: "up" | "down"
  ) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg?.eventId) return;
    setFeedbackGiven((prev) => ({ ...prev, [messageId]: rating }));
    try {
      await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: msg.eventId, rating }),
      });
    } catch {
      /* silent */
    }
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* ─────────── don't render if panel closed or no module ─────────── */
  if (!aiPanelOpen || !slug) return null;

  const moduleName = moduleConfig?.title?.[locale] || schema?.title?.[locale as keyof typeof schema.title] || slug;

  const labels = {
    analyzing: locale === "ru" ? "AI анализирует" : locale === "uk" ? "AI аналізує" : "AI analyzing",
    insights: locale === "ru" ? "Выводы" : locale === "uk" ? "Висновки" : "Insights",
    decisions: locale === "ru" ? "Рекомендуемые решения" : locale === "uk" ? "Рекомендовані рішення" : "Suggested Decisions",
    accept: locale === "ru" ? "Принять" : locale === "uk" ? "Прийняти" : "Accept",
    reject: locale === "ru" ? "Отклонить" : locale === "uk" ? "Відхилити" : "Reject",
    accepted: locale === "ru" ? "Принято" : locale === "uk" ? "Прийнято" : "Accepted",
    rejected: locale === "ru" ? "Отклонено" : locale === "uk" ? "Відхилено" : "Rejected",
    chat: locale === "ru" ? "Задать вопрос" : locale === "uk" ? "Задати питання" : "Ask a question",
    chatPlaceholder: locale === "ru" ? "Вопрос по модулю..." : locale === "uk" ? "Питання по модулю..." : "Question about this module...",
    knowledgeBase: locale === "ru" ? "База знаний" : locale === "uk" ? "База знань" : "Knowledge Base",
    disclaimer: locale === "ru" ? "AI выводы информационные и требуют проверки" : locale === "uk" ? "AI висновки інформаційні та потребують перевірки" : "AI outputs are informational and require verification",
    confidence: locale === "ru" ? "Уверенность" : locale === "uk" ? "Впевненість" : "Confidence",
    sources: locale === "ru" ? "Источники" : locale === "uk" ? "Джерела" : "Sources",
    impact: locale === "ru" ? "Эффект" : locale === "uk" ? "Ефект" : "Impact",
    loading: locale === "ru" ? "Анализ данных..." : locale === "uk" ? "Аналіз даних..." : "Analyzing data...",
    context: locale === "ru" ? "Контекст" : locale === "uk" ? "Контекст" : "Context",
  };

  return (
    <div className="w-80 lg:w-96 flex-shrink-0 space-y-3 max-h-[calc(100vh-8rem)] overflow-y-auto pb-6 scrollbar-thin">
      {/* ── Header ── */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                {labels.analyzing}
              </div>
              <div className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                {moduleName}
              </div>
            </div>
          </div>
          <button
            onClick={toggleAiPanel}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40 rounded-lg px-3 py-2">
          <p className="text-[11px] text-amber-700 dark:text-amber-400 flex items-start gap-1.5">
            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span>{labels.disclaimer}</span>
          </p>
        </div>
      </div>

      {/* ── Loading state ── */}
      {collectionsLoading && (
        <div className="glass-card p-6 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-xs text-stone-500">{labels.loading}</p>
        </div>
      )}

      {/* ── Context Summary ── */}
      {insightsResult && (
        <div className="glass-card px-4 py-3">
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            {insightsResult.contextSummary}
          </p>
        </div>
      )}

      {/* ── Insights ── */}
      {insightsResult && insightsResult.insights.length > 0 && (
        <div className="glass-card overflow-hidden">
          <button
            onClick={() => setInsightsExpanded(!insightsExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                {labels.insights}
              </span>
              <span className="text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded-full">
                {insightsResult.insights.length}
              </span>
            </div>
            {insightsExpanded ? (
              <ChevronUp className="w-4 h-4 text-stone-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {insightsExpanded && (
            <div className="px-4 pb-3 space-y-2">
              {insightsResult.insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} labels={labels} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Decisions ── */}
      {insightsResult && insightsResult.decisions.length > 0 && (
        <div className="glass-card overflow-hidden">
          <button
            onClick={() => setDecisionsExpanded(!decisionsExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                {labels.decisions}
              </span>
            </div>
            {decisionsExpanded ? (
              <ChevronUp className="w-4 h-4 text-stone-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {decisionsExpanded && (
            <div className="px-4 pb-3 space-y-2">
              {insightsResult.decisions.map((dec) => (
                <DecisionCard
                  key={dec.id}
                  decision={dec}
                  accepted={acceptedDecisions.has(dec.id)}
                  rejected={rejectedDecisions.has(dec.id)}
                  onAccept={() =>
                    setAcceptedDecisions((prev) => new Set(prev).add(dec.id))
                  }
                  onReject={() =>
                    setRejectedDecisions((prev) => new Set(prev).add(dec.id))
                  }
                  labels={labels}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Knowledge Base ── */}
      {knowledge.helpTopics.length > 0 && (
        <div className="glass-card overflow-hidden">
          <button
            onClick={() => setKnowledgeExpanded(!knowledgeExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                {labels.knowledgeBase}
              </span>
            </div>
            {knowledgeExpanded ? (
              <ChevronUp className="w-4 h-4 text-stone-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {knowledgeExpanded && (
            <div className="px-4 pb-3 space-y-2">
              {knowledge.helpTopics.map((topic, i) => (
                <div
                  key={i}
                  className="bg-amber-50/50 dark:bg-amber-900/10 rounded-lg px-3 py-2"
                >
                  <div className="text-xs font-medium text-stone-700 dark:text-stone-300">
                    {topic.title}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {topic.summary}
                  </div>
                </div>
              ))}
              {knowledge.industryRules.length > 0 && (
                <div className="pt-1">
                  <div className="text-[11px] text-stone-400 uppercase tracking-wide mb-1">
                    {locale === "ru" ? "Отраслевые стандарты" : "Industry Standards"}
                  </div>
                  {knowledge.industryRules.slice(0, 3).map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-start gap-1.5 text-[11px] text-stone-600 dark:text-stone-400 py-0.5"
                    >
                      <SeverityIcon severity={rule.severity} />
                      <span>
                        {rule.title}
                        {rule.threshold && (
                          <span className="text-stone-400"> ({rule.threshold})</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Chat Section ── */}
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => setChatExpanded(!chatExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              {labels.chat}
            </span>
            {messages.length > 0 && (
              <span className="text-xs text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded-full">
                {messages.length}
              </span>
            )}
          </div>
          {chatExpanded ? (
            <ChevronUp className="w-4 h-4 text-stone-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-400" />
          )}
        </button>

        {chatExpanded && (
          <div className="px-4 pb-3">
            {/* Client-safe toggle */}
            <div className="flex items-center justify-end mb-2">
              <button
                onClick={() => setClientSafeMode(!clientSafeMode)}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  clientSafeMode
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-600"
                )}
                title={
                  clientSafeMode
                    ? "Client-safe ON"
                    : "Client-safe OFF"
                }
              >
                <Shield className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages */}
            {messages.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-2 mb-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "p-2.5 rounded-lg text-xs",
                      msg.role === "user"
                        ? "bg-stone-100 dark:bg-stone-800 ml-4"
                        : "bg-violet-50 dark:bg-violet-900/20 mr-4"
                    )}
                  >
                    <div className="whitespace-pre-wrap text-stone-700 dark:text-stone-300">
                      {msg.content}
                    </div>
                    {msg.confidence !== undefined && (
                      <div className="mt-1 pt-1 border-t border-stone-200/50 dark:border-stone-700/50">
                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            msg.confidence >= 80
                              ? "text-emerald-600"
                              : msg.confidence >= 50
                              ? "text-amber-600"
                              : "text-red-600"
                          )}
                        >
                          {labels.confidence}: {msg.confidence}%
                        </span>
                      </div>
                    )}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {msg.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.href}
                            className="text-[10px] text-violet-600 dark:text-violet-400 hover:underline"
                          >
                            {src.label}
                          </a>
                        ))}
                      </div>
                    )}
                    {/* Feedback for AI messages */}
                    {msg.role === "ai" && msg.eventId && (
                      <div className="flex items-center gap-1.5 mt-1.5 pt-1 border-t border-violet-100 dark:border-violet-800/50">
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="p-0.5 text-stone-400 hover:text-stone-600 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, "up")}
                          className={cn(
                            "p-0.5 transition-colors",
                            feedbackGiven[msg.id] === "up"
                              ? "text-emerald-600"
                              : "text-stone-400 hover:text-emerald-600"
                          )}
                          disabled={!!feedbackGiven[msg.id]}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, "down")}
                          className={cn(
                            "p-0.5 transition-colors",
                            feedbackGiven[msg.id] === "down"
                              ? "text-red-600"
                              : "text-stone-400 hover:text-red-600"
                          )}
                          disabled={!!feedbackGiven[msg.id]}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="bg-violet-50 dark:bg-violet-900/20 p-2.5 rounded-lg mr-4">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input */}
            <div className="flex gap-1.5">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSubmit()
                }
                placeholder={labels.chatPlaceholder}
                disabled={isLoading}
                className="flex-1 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 disabled:opacity-50"
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || !query.trim()}
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-xs font-medium disabled:opacity-50 hover:from-violet-600 hover:to-indigo-700 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────── InsightCard ─────────── */

function InsightCard({
  insight,
  labels,
}: {
  insight: ModuleInsight;
  labels: Record<string, string>;
}) {
  const severityColors = {
    critical: "border-l-red-500 bg-red-50/50 dark:bg-red-900/10",
    warning: "border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10",
    info: "border-l-sky-500 bg-sky-50/50 dark:bg-sky-900/10",
  };

  return (
    <div
      className={cn(
        "border-l-2 rounded-r-lg px-3 py-2",
        severityColors[insight.severity]
      )}
    >
      <div className="flex items-start gap-1.5">
        <SeverityIcon severity={insight.severity} />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-stone-800 dark:text-stone-200 leading-tight">
            {insight.title}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
            {insight.description}
          </div>
          {/* Confidence + Sources */}
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={cn(
                "text-[10px] font-medium",
                insight.confidence >= 80
                  ? "text-emerald-600"
                  : insight.confidence >= 50
                  ? "text-amber-600"
                  : "text-stone-400"
              )}
            >
              {labels.confidence}: {insight.confidence}%
            </span>
            {insight.sources.length > 0 && (
              <div className="flex gap-1">
                {insight.sources.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className="text-[10px] text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── DecisionCard ─────────── */

function DecisionCard({
  decision,
  accepted,
  rejected,
  onAccept,
  onReject,
  labels,
}: {
  decision: DecisionSuggestion;
  accepted: boolean;
  rejected: boolean;
  onAccept: () => void;
  onReject: () => void;
  labels: Record<string, string>;
}) {
  const acted = accepted || rejected;

  return (
    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200/40 dark:border-emerald-800/30 rounded-lg px-3 py-2.5">
      <div className="text-xs font-medium text-stone-800 dark:text-stone-200">
        {decision.title}
      </div>
      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
        {decision.description}
      </div>
      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
        {labels.impact}: {decision.impact}
      </div>
      {/* Confidence */}
      <div className="text-[10px] text-stone-400 mt-0.5">
        {labels.confidence}: {decision.confidence}%
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-2">
        {!acted ? (
          <>
            <button
              onClick={onAccept}
              className="px-3 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-medium hover:bg-emerald-700 transition-colors"
            >
              {labels.accept}
            </button>
            <button
              onClick={onReject}
              className="px-3 py-1 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-[11px] font-medium hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
            >
              {labels.reject}
            </button>
          </>
        ) : (
          <span
            className={cn(
              "text-[11px] font-medium flex items-center gap-1",
              accepted
                ? "text-emerald-600"
                : "text-stone-400"
            )}
          >
            <CheckCircle2 className="w-3 h-3" />
            {accepted ? labels.accepted : labels.rejected}
          </span>
        )}
      </div>
    </div>
  );
}
