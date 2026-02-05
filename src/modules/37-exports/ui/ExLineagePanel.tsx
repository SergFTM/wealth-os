'use client';

import React from 'react';
import { Database, GitBranch, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface DataSource {
  id: string;
  collection: string;
  label: string;
  recordCount: number;
  lastUpdated: string;
  connector?: string;
  dqScore?: number;
}

interface ConnectorInfo {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
}

interface ExLineagePanelProps {
  sources: DataSource[];
  connectors: ConnectorInfo[];
  asOf: string;
  overallDqScore: number;
  warnings: string[];
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DqBadge({ score }: { score: number }) {
  const color =
    score >= 95
      ? 'bg-emerald-100 text-emerald-700'
      : score >= 85
      ? 'bg-amber-100 text-amber-700'
      : 'bg-red-100 text-red-700';

  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {score}%
    </span>
  );
}

function ConnectorStatus({ status }: { status: string }) {
  switch (status) {
    case 'connected':
      return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case 'disconnected':
      return <RefreshCw className="w-4 h-4 text-gray-400" />;
    case 'error':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
}

export function ExLineagePanel({
  sources,
  connectors,
  asOf,
  overallDqScore,
  warnings,
}: ExLineagePanelProps) {
  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Data Lineage Overview</h3>
          <DqBadge score={overallDqScore} />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">As-of Date:</span>
            <p className="font-medium text-gray-900">{formatDate(asOf)}</p>
          </div>
          <div>
            <span className="text-gray-500">Sources:</span>
            <p className="font-medium text-gray-900">{sources.length}</p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <h4 className="flex items-center gap-2 font-medium text-amber-800 mb-2">
            <AlertTriangle className="w-4 h-4" />
            Предупреждения
          </h4>
          <ul className="space-y-1 text-sm text-amber-700">
            {warnings.map((warning, idx) => (
              <li key={idx}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources */}
      <div>
        <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
          <Database className="w-4 h-4 text-gray-400" />
          Источники данных
        </h4>
        <div className="space-y-2">
          {sources.map((source) => (
            <div
              key={source.id}
              className="p-3 rounded-lg bg-white/60 border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">{source.label}</span>
                {source.dqScore !== undefined && <DqBadge score={source.dqScore} />}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  <code className="px-1 py-0.5 rounded bg-gray-100">
                    {source.collection}
                  </code>
                </span>
                <span>{source.recordCount.toLocaleString()} записей</span>
                <span>Обновлено: {formatDate(source.lastUpdated)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connectors */}
      <div>
        <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-3">
          <GitBranch className="w-4 h-4 text-gray-400" />
          Коннекторы
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {connectors.map((connector) => (
            <div
              key={connector.id}
              className="p-3 rounded-lg bg-white/60 border border-gray-100 flex items-center justify-between"
            >
              <div>
                <span className="font-medium text-gray-900">{connector.name}</span>
                <p className="text-xs text-gray-500">{connector.type}</p>
              </div>
              <ConnectorStatus status={connector.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
        <p className="text-xs text-gray-500">
          <strong>Lineage</strong> отслеживает происхождение данных: источники, дату актуальности,
          коннекторы и оценку качества (DQ Score). Это обеспечивает прозрачность и аудируемость
          экспортируемых пакетов.
        </p>
      </div>
    </div>
  );
}

export default ExLineagePanel;
