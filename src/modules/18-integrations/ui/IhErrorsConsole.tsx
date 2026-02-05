"use client";

import { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, Copy, Check, ChevronDown, ChevronRight, Filter } from 'lucide-react';

interface ErrorLog {
  id: string;
  runId: string;
  connectorId: string;
  level: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  stackTrace: string | null;
  context: string;
  occurredAt: string;
}

interface IhErrorsConsoleProps {
  errors: ErrorLog[];
  runNames?: Record<string, string>;
  connectorNames?: Record<string, string>;
  filterLevel?: 'error' | 'warning' | 'info' | 'all';
  maxHeight?: string;
}

const levelConfig: Record<string, { Icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  error: { Icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-950' },
  warning: { Icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-950' },
  info: { Icon: Info, color: 'text-blue-500', bg: 'bg-blue-950' },
};

export function IhErrorsConsole({
  errors,
  runNames = {},
  connectorNames = {},
  filterLevel = 'all',
  maxHeight = '500px',
}: IhErrorsConsoleProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredErrors = filterLevel === 'all'
    ? errors
    : errors.filter(e => e.level === filterLevel);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const copyToClipboard = async (error: ErrorLog) => {
    const text = `[${error.level.toUpperCase()}] ${error.code}: ${error.message}\n${error.stackTrace || ''}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(error.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (date: string): string => {
    return new Date(date).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-700 overflow-hidden font-mono text-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-800 border-b border-stone-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <span className="text-stone-400 text-xs ml-2">Error Console</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-red-400">
            <AlertCircle className="w-3 h-3" />
            {errors.filter(e => e.level === 'error').length}
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            {errors.filter(e => e.level === 'warning').length}
          </span>
          <span className="flex items-center gap-1 text-blue-400">
            <Info className="w-3 h-3" />
            {errors.filter(e => e.level === 'info').length}
          </span>
        </div>
      </div>

      {/* Console output */}
      <div className="overflow-y-auto" style={{ maxHeight }}>
        {filteredErrors.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            Нет ошибок для отображения
          </div>
        ) : (
          filteredErrors.map((error) => {
            const config = levelConfig[error.level] || levelConfig.error;
            const LevelIcon = config.Icon;
            const isExpanded = expandedIds.has(error.id);

            return (
              <div
                key={error.id}
                className={`border-b border-stone-800 ${config.bg} bg-opacity-30 hover:bg-opacity-50 transition-colors`}
              >
                {/* Error header */}
                <div
                  className="flex items-start gap-2 px-4 py-2 cursor-pointer"
                  onClick={() => toggleExpand(error.id)}
                >
                  <button className="mt-0.5 text-stone-500 hover:text-stone-300">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  <LevelIcon className={`w-4 h-4 mt-0.5 ${config.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${config.color}`}>[{error.code}]</span>
                      <span className="text-stone-300 truncate">{error.message}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                      <span>{formatDate(error.occurredAt)} {formatTime(error.occurredAt)}</span>
                      <span>{connectorNames[error.connectorId] || error.connectorId}</span>
                      <span className="text-stone-600">{error.context}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(error);
                    }}
                    className="p-1.5 text-stone-500 hover:text-stone-300 rounded transition-colors"
                  >
                    {copiedId === error.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Stack trace (expanded) */}
                {isExpanded && error.stackTrace && (
                  <div className="px-4 pb-3 pl-12">
                    <pre className="text-xs text-stone-400 whitespace-pre-wrap bg-stone-950 rounded p-3 overflow-x-auto">
                      {error.stackTrace}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-stone-800 border-t border-stone-700 flex items-center justify-between text-xs">
        <span className="text-stone-500">
          {filteredErrors.length} entries
        </span>
        <span className="text-stone-600">
          Last updated: {new Date().toLocaleTimeString('ru-RU')}
        </span>
      </div>
    </div>
  );
}
