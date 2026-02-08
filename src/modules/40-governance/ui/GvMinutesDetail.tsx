"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GvStatusPill } from './GvStatusPill';
import { cn } from '@/lib/utils';

interface AttendeeRecord {
  userId: string;
  name: string;
  role: string;
  present: boolean;
}

interface AgendaRecap {
  agendaItemId: string;
  title: string;
  summary: string;
  status: string;
}

interface DecisionRecap {
  decisionId: string;
  title: string;
  outcome: string;
}

interface VoteRecap {
  voteId: string;
  decisionTitle: string;
  passed: boolean;
  tallyStr: string;
}

interface ActionItemRecap {
  actionItemId: string;
  title: string;
  ownerName: string;
  dueAt?: string;
}

interface AiMeta {
  generatedAt: string;
  confidence: number;
  assumptions: string[];
  sources: string[];
}

interface Minutes {
  id: string;
  meetingId: string;
  meetingName?: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  bodyMdRu?: string;
  bodyMdEn?: string;
  bodyMdUk?: string;
  attendeesJson?: AttendeeRecord[];
  agendaRecapJson?: AgendaRecap[];
  decisionsRecapJson?: DecisionRecap[];
  votesRecapJson?: VoteRecap[];
  actionItemsRecapJson?: ActionItemRecap[];
  clientSafePublished: boolean;
  signedByJson?: Array<{ userId: string; name: string; signedAt: string }>;
  aiMetaJson?: AiMeta;
  createdAt?: string;
  updatedAt?: string;
}

interface GvMinutesDetailProps {
  minutes: Minutes;
  locale?: 'ru' | 'en' | 'uk';
  onEdit?: () => void;
  onApprove?: () => void;
  onPublish?: () => void;
  onSign?: () => void;
  onRegenerate?: () => void;
  onOpenAudit?: () => void;
}

const roleLabels: Record<string, string> = {
  chair: 'Председатель',
  secretary: 'Секретарь',
  member: 'Член совета',
  observer: 'Наблюдатель',
  advisor: 'Советник',
};

export function GvMinutesDetail({
  minutes,
  locale = 'ru',
  onEdit,
  onApprove,
  onPublish,
  onSign,
  onRegenerate,
  onOpenAudit,
}: GvMinutesDetailProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'structure' | 'ai'>('content');

  const getBody = () => {
    switch (locale) {
      case 'en':
        return minutes.bodyMdEn || minutes.bodyMdRu || '';
      case 'uk':
        return minutes.bodyMdUk || minutes.bodyMdRu || '';
      default:
        return minutes.bodyMdRu || '';
    }
  };

  const hasAiMeta = !!minutes.aiMetaJson;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/m/governance/list?tab=minutes">
              <Button variant="ghost" size="sm" className="gap-1 px-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-stone-800">
              Протокол: {minutes.meetingName || minutes.meetingId.slice(-8)}
            </h1>
            <GvStatusPill status={minutes.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-stone-500">
            {minutes.attendeesJson && (
              <span>
                {minutes.attendeesJson.filter(a => a.present).length} присутствовало
              </span>
            )}
            {minutes.decisionsRecapJson && (
              <>
                <span>|</span>
                <span>{minutes.decisionsRecapJson.length} решений</span>
              </>
            )}
            {minutes.actionItemsRecapJson && (
              <>
                <span>|</span>
                <span>{minutes.actionItemsRecapJson.length} action items</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {minutes.status === 'draft' && onApprove && (
            <Button variant="primary" onClick={onApprove}>
              На утверждение
            </Button>
          )}
          {minutes.status === 'review' && onApprove && (
            <Button variant="primary" onClick={onApprove}>
              Утвердить
            </Button>
          )}
          {minutes.status === 'approved' && onPublish && (
            <Button variant="primary" onClick={onPublish}>
              Опубликовать
            </Button>
          )}
          {minutes.status === 'draft' && onEdit && (
            <Button variant="secondary" onClick={onEdit}>
              Редактировать
            </Button>
          )}
          {hasAiMeta && onRegenerate && minutes.status === 'draft' && (
            <Button variant="ghost" onClick={onRegenerate}>
              Перегенерировать
            </Button>
          )}
          {onOpenAudit && (
            <Button variant="ghost" onClick={onOpenAudit}>
              Audit
            </Button>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-3">
        {minutes.clientSafePublished && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Client-safe
          </div>
        )}
        {hasAiMeta && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI-generated
          </div>
        )}
        {minutes.signedByJson && minutes.signedByJson.length > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Подписано ({minutes.signedByJson.length})
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-4">
          {(['content', 'structure', 'ai'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              disabled={tab === 'ai' && !hasAiMeta}
              className={cn(
                "pb-3 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab
                  ? "border-emerald-500 text-emerald-700"
                  : "border-transparent text-stone-500 hover:text-stone-700",
                tab === 'ai' && !hasAiMeta && "opacity-50 cursor-not-allowed"
              )}
            >
              {tab === 'content' && 'Содержание'}
              {tab === 'structure' && 'Структура'}
              {tab === 'ai' && 'AI-метаданные'}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'content' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <div className="prose prose-stone max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: getBody()
                      .replace(/\n/g, '<br/>')
                      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/^- (.+)$/gm, '<li>$1</li>')
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <>
              {/* Attendees */}
              {minutes.attendeesJson && minutes.attendeesJson.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
                  <div className="px-4 py-3 border-b border-stone-200/50">
                    <h3 className="font-semibold text-stone-800">Присутствие</h3>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {minutes.attendeesJson.map((att, idx) => (
                      <div key={att.userId || idx} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            att.present ? "bg-emerald-500" : "bg-stone-300"
                          )} />
                          <div>
                            <p className="font-medium text-stone-800">{att.name}</p>
                            <p className="text-xs text-stone-500">{roleLabels[att.role] || att.role}</p>
                          </div>
                        </div>
                        <span className={cn(
                          "text-sm",
                          att.present ? "text-emerald-600" : "text-stone-400"
                        )}>
                          {att.present ? 'Присутствовал' : 'Отсутствовал'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agenda Recap */}
              {minutes.agendaRecapJson && minutes.agendaRecapJson.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
                  <div className="px-4 py-3 border-b border-stone-200/50">
                    <h3 className="font-semibold text-stone-800">Повестка</h3>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {minutes.agendaRecapJson.map((item, idx) => (
                      <div key={item.agendaItemId || idx} className="px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-stone-800">{item.title}</p>
                          <GvStatusPill status={item.status as 'planned' | 'discussed'} size="sm" />
                        </div>
                        <p className="text-sm text-stone-600">{item.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decisions Recap */}
              {minutes.decisionsRecapJson && minutes.decisionsRecapJson.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
                  <div className="px-4 py-3 border-b border-stone-200/50">
                    <h3 className="font-semibold text-stone-800">Решения</h3>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {minutes.decisionsRecapJson.map((dec, idx) => (
                      <div key={dec.decisionId || idx} className="px-4 py-3">
                        <p className="font-medium text-stone-800">{dec.title}</p>
                        <p className="text-sm text-stone-600 mt-1">{dec.outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Votes Recap */}
              {minutes.votesRecapJson && minutes.votesRecapJson.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
                  <div className="px-4 py-3 border-b border-stone-200/50">
                    <h3 className="font-semibold text-stone-800">Голосования</h3>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {minutes.votesRecapJson.map((vote, idx) => (
                      <div key={vote.voteId || idx} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-stone-800">{vote.decisionTitle}</p>
                          <p className="text-sm text-stone-500">{vote.tallyStr}</p>
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          vote.passed
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        )}>
                          {vote.passed ? 'Принято' : 'Отклонено'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Items Recap */}
              {minutes.actionItemsRecapJson && minutes.actionItemsRecapJson.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
                  <div className="px-4 py-3 border-b border-stone-200/50">
                    <h3 className="font-semibold text-stone-800">Action Items</h3>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {minutes.actionItemsRecapJson.map((ai, idx) => (
                      <div key={ai.actionItemId || idx} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-stone-800">{ai.title}</p>
                          <p className="text-sm text-stone-500">Ответственный: {ai.ownerName}</p>
                        </div>
                        {ai.dueAt && (
                          <span className="text-sm text-stone-500">
                            До {new Date(ai.dueAt).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'ai' && hasAiMeta && minutes.aiMetaJson && (
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="font-semibold text-purple-800">AI-метаданные</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-purple-600 uppercase tracking-wide">Сгенерировано</p>
                  <p className="text-sm text-purple-800 font-medium">
                    {new Date(minutes.aiMetaJson.generatedAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-purple-600 uppercase tracking-wide">Уверенность</p>
                  <p className="text-sm text-purple-800 font-medium">
                    {(minutes.aiMetaJson.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              {minutes.aiMetaJson.assumptions.length > 0 && (
                <div>
                  <p className="text-xs text-purple-600 uppercase tracking-wide mb-2">Допущения</p>
                  <ul className="text-sm text-purple-800 list-disc pl-4 space-y-1">
                    {minutes.aiMetaJson.assumptions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}

              {minutes.aiMetaJson.sources.length > 0 && (
                <div>
                  <p className="text-xs text-purple-600 uppercase tracking-wide mb-2">Источники</p>
                  <ul className="text-sm text-purple-800 list-disc pl-4 space-y-1">
                    {minutes.aiMetaJson.sources.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-purple-200">
                <p className="text-xs text-purple-600">
                  ⚠️ AI-генерированный контент требует проверки перед утверждением
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
              Метаданные
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">ID</span>
                <span className="text-stone-800 font-mono">{minutes.id.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Заседание</span>
                <span className="text-stone-800 font-mono">{minutes.meetingId.slice(-8)}</span>
              </div>
              {minutes.createdAt && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Создано</span>
                  <span className="text-stone-800">
                    {new Date(minutes.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
              {minutes.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Обновлено</span>
                  <span className="text-stone-800">
                    {new Date(minutes.updatedAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Signatures */}
          {minutes.signedByJson && minutes.signedByJson.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
                Подписи
              </h3>
              <div className="space-y-2">
                {minutes.signedByJson.map((sig, idx) => (
                  <div key={sig.userId || idx} className="flex items-center justify-between text-sm">
                    <span className="text-stone-800">{sig.name}</span>
                    <span className="text-stone-500 text-xs">
                      {new Date(sig.signedAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {onSign && minutes.status === 'approved' && (
            <Button variant="secondary" onClick={onSign} className="w-full">
              Подписать протокол
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
