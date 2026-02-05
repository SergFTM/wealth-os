"use client";

import Link from 'next/link';
import { ExternalLink, Database, FileText, AlertTriangle, BarChart3 } from 'lucide-react';

interface Source {
  module: string;
  recordType: string;
  recordId: string;
  label: string;
  value?: string | number;
}

interface AiSourcesCardProps {
  sources: Source[];
  title?: string;
  maxVisible?: number;
  compact?: boolean;
}

const moduleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'net-worth': BarChart3,
  'performance': BarChart3,
  'risk': AlertTriangle,
  'ips': FileText,
  'integrations': Database,
  'workflow': FileText,
  'fees': FileText,
  'general-ledger': Database,
};

const moduleColors: Record<string, string> = {
  'net-worth': 'text-emerald-600 bg-emerald-50',
  'performance': 'text-blue-600 bg-blue-50',
  'risk': 'text-red-600 bg-red-50',
  'ips': 'text-purple-600 bg-purple-50',
  'integrations': 'text-amber-600 bg-amber-50',
  'workflow': 'text-stone-600 bg-stone-100',
  'fees': 'text-green-600 bg-green-50',
  'general-ledger': 'text-indigo-600 bg-indigo-50',
};

export function AiSourcesCard({
  sources,
  title = 'Источники',
  maxVisible = 5,
  compact = false,
}: AiSourcesCardProps) {
  const visibleSources = sources.slice(0, maxVisible);
  const hiddenCount = sources.length - maxVisible;

  if (sources.length === 0) {
    return (
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
        <h4 className="text-sm font-medium text-stone-600 mb-2">{title}</h4>
        <p className="text-sm text-stone-500 italic">Источники не найдены</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-100 bg-stone-50">
        <h4 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
          <Database className="w-4 h-4 text-stone-500" />
          {title} ({sources.length})
        </h4>
      </div>

      <div className={compact ? 'divide-y divide-stone-100' : 'p-2 space-y-1'}>
        {visibleSources.map((source, index) => {
          const Icon = moduleIcons[source.module] || FileText;
          const colorClass = moduleColors[source.module] || 'text-stone-600 bg-stone-100';

          return (
            <Link
              key={`${source.module}-${source.recordId}-${index}`}
              href={`/m/${source.module}/item/${source.recordId}`}
              className={`flex items-center gap-3 ${
                compact
                  ? 'px-4 py-2 hover:bg-stone-50'
                  : 'p-2 rounded-lg hover:bg-stone-50'
              } transition-colors group`}
            >
              <span className={`p-1.5 rounded-lg ${colorClass}`}>
                <Icon className="w-3.5 h-3.5" />
              </span>

              <div className="flex-1 min-w-0">
                <div className="text-sm text-stone-800 truncate group-hover:text-emerald-700">
                  {source.label}
                </div>
                {source.value && (
                  <div className="text-xs text-stone-500">{source.value}</div>
                )}
              </div>

              <ExternalLink className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          );
        })}

        {hiddenCount > 0 && (
          <div className={`text-xs text-stone-500 ${compact ? 'px-4 py-2' : 'px-2 py-1'}`}>
            и еще {hiddenCount} источников...
          </div>
        )}
      </div>
    </div>
  );
}
