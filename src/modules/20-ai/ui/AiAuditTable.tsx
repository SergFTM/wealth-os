"use client";

import { Sparkles, Eye, Shield, ShieldAlert, Database, ExternalLink } from 'lucide-react';
import { AiConfidenceBadge } from './AiConfidenceBadge';

interface AiEvent {
  id: string;
  clientId: string;
  userId: string;
  userRole: string;
  promptType: string;
  promptText: string;
  responseText: string;
  sourcesJson: string;
  confidencePct: number;
  clientSafe: boolean;
  blocked: boolean;
  blockedReason?: string | null;
  createdAt: string;
}

interface AiAuditTableProps {
  events: AiEvent[];
  onRowClick?: (event: AiEvent) => void;
  onViewSources?: (event: AiEvent) => void;
  compact?: boolean;
}

const promptTypeLabels: Record<string, { label: string; color: string }> = {
  explain_change: { label: 'Explain', color: 'text-emerald-600 bg-emerald-50' },
  summarize_risk: { label: 'Risk', color: 'text-red-600 bg-red-50' },
  summarize_performance: { label: 'Performance', color: 'text-blue-600 bg-blue-50' },
  draft_message: { label: 'Draft Msg', color: 'text-purple-600 bg-purple-50' },
  draft_committee_pack: { label: 'Committee', color: 'text-indigo-600 bg-indigo-50' },
  draft_policy_summary: { label: 'Policy', color: 'text-violet-600 bg-violet-50' },
  triage_tasks: { label: 'Triage', color: 'text-amber-600 bg-amber-50' },
  check_data_quality: { label: 'Data Quality', color: 'text-orange-600 bg-orange-50' },
  general_query: { label: 'General', color: 'text-stone-600 bg-stone-100' },
};

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  cio: 'CIO',
  cfo: 'CFO',
  ops: 'Ops',
  compliance: 'Compliance',
  advisor: 'Advisor',
  client: 'Client',
  admin: 'Admin',
};

export function AiAuditTable({
  events,
  onRowClick,
  onViewSources,
  compact = false,
}: AiAuditTableProps) {
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSourcesCount = (sourcesJson: string): number => {
    try {
      return JSON.parse(sourcesJson || '[]').length;
    } catch {
      return 0;
    }
  };

  const displayEvents = compact ? events.slice(0, 10) : events;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                Event ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                Тип
              </th>
              {!compact && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">
                  Role
                </th>
              )}
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                Client-safe
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                Blocked
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                Confidence
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                Sources
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                Время
              </th>
              {!compact && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">
                  Действия
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayEvents.map((event) => {
              const promptType = promptTypeLabels[event.promptType] || {
                label: event.promptType,
                color: 'text-stone-600 bg-stone-100',
              };
              const sourcesCount = getSourcesCount(event.sourcesJson);

              return (
                <tr
                  key={event.id}
                  onClick={() => onRowClick?.(event)}
                  className={`border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors ${
                    event.blocked ? 'bg-red-50/30' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500 flex-shrink-0" />
                      <span className="text-stone-800 font-mono text-xs">
                        {event.id.slice(0, 12)}...
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${promptType.color}`}
                    >
                      {promptType.label}
                    </span>
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-stone-600 text-xs">
                      {roleLabels[event.userRole] || event.userRole}
                    </td>
                  )}
                  <td className="px-4 py-3 text-center">
                    {event.clientSafe ? (
                      <Shield className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {event.blocked ? (
                      <ShieldAlert className="w-4 h-4 text-red-500 mx-auto" />
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <AiConfidenceBadge confidence={event.confidencePct} showTooltip={false} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${
                        sourcesCount > 0
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-stone-500 bg-stone-100'
                      }`}
                    >
                      <Database className="w-3 h-3" />
                      {sourcesCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600 text-xs">
                    {formatDate(event.createdAt)}
                  </td>
                  {!compact && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewSources?.(event);
                          }}
                          className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View sources"
                        >
                          <Database className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowClick?.(event);
                          }}
                          className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                          title="View details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {events.length === 0 && (
        <div className="p-8 text-center text-stone-500">Нет AI events для отображения</div>
      )}
    </div>
  );
}
