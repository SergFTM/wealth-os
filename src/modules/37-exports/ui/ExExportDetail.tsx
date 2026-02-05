'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  GitBranch,
} from 'lucide-react';
import { ExStatusPill } from './ExStatusPill';
import { ExFilesPanel } from './ExFilesPanel';
import { ExLineagePanel } from './ExLineagePanel';

interface ExportError {
  sectionId?: string;
  message: string;
  timestamp: string;
}

interface ExportFile {
  id: string;
  fileName: string;
  format: 'csv' | 'pdf';
  sizeBytes: number;
  rowCount?: number;
  sectionId?: string;
  createdAt: string;
}

interface LineageData {
  sources: {
    id: string;
    collection: string;
    label: string;
    recordCount: number;
    lastUpdated: string;
    dqScore?: number;
  }[];
  connectors: {
    id: string;
    name: string;
    type: string;
    status: 'connected' | 'disconnected' | 'error';
  }[];
  asOf: string;
  overallDqScore: number;
  warnings: string[];
}

interface ExExportDetailProps {
  exportRun: {
    id: string;
    packId: string;
    packName?: string;
    status: 'queued' | 'running' | 'success' | 'failed';
    startedAt?: string;
    finishedAt?: string;
    progress?: number;
    sectionsProcessed?: number;
    sectionsTotal?: number;
    errorsJson: ExportError[];
    triggeredBy?: string;
    createdAt: string;
  };
  files: ExportFile[];
  lineage?: LineageData;
  onRerun: () => void;
  onDownloadFile: (fileId: string) => void;
}

const TABS = [
  { id: 'overview', label: 'Обзор', icon: FileText },
  { id: 'files', label: 'Файлы', icon: FileText },
  { id: 'lineage', label: 'Lineage', icon: GitBranch },
  { id: 'errors', label: 'Ошибки', icon: AlertTriangle },
];

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatDuration(startedAt?: string, finishedAt?: string): string {
  if (!startedAt) return '—';
  const end = finishedAt ? new Date(finishedAt) : new Date();
  const ms = end.getTime() - new Date(startedAt).getTime();
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    case 'failed':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'running':
      return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
    default:
      return <Clock className="w-5 h-5 text-amber-500" />;
  }
}

export function ExExportDetail({
  exportRun,
  files,
  lineage,
  onRerun,
  onDownloadFile,
}: ExExportDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const errorsCount = exportRun.errorsJson?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/m/exports/list?tab=exports"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к списку
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <StatusIcon status={exportRun.status} />
            Export Run
          </h1>
          <p className="text-gray-500 mt-1 font-mono text-sm">{exportRun.id}</p>
        </div>

        <div className="flex items-center gap-2">
          <ExStatusPill status={exportRun.status} showIcon />
          <button
            onClick={onRerun}
            disabled={exportRun.status === 'running'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Перезапустить
          </button>
        </div>
      </div>

      {/* Progress Bar (if running) */}
      {exportRun.status === 'running' && exportRun.progress !== undefined && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Прогресс</span>
            <span className="text-sm text-gray-500">{exportRun.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${exportRun.progress}%` }}
            />
          </div>
          {exportRun.sectionsProcessed !== undefined && (
            <p className="text-xs text-gray-500 mt-2">
              Секций: {exportRun.sectionsProcessed} / {exportRun.sectionsTotal}
            </p>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const showBadge = tab.id === 'errors' && errorsCount > 0;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {showBadge && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
                  {errorsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Пакет</label>
                <p className="font-medium text-gray-900">
                  <Link
                    href={`/m/exports/pack/${exportRun.packId}`}
                    className="hover:text-emerald-600"
                  >
                    {exportRun.packName || exportRun.packId}
                  </Link>
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Статус</label>
                <p className="font-medium text-gray-900 capitalize">{exportRun.status}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Запущено</label>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {formatDate(exportRun.startedAt)}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Завершено</label>
                <p className="font-medium text-gray-900">{formatDate(exportRun.finishedAt)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Длительность</label>
                <p className="font-medium text-gray-900">
                  {formatDuration(exportRun.startedAt, exportRun.finishedAt)}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Файлов создано</label>
                <p className="font-medium text-gray-900">{files.length}</p>
              </div>
              {exportRun.triggeredBy && (
                <div>
                  <label className="text-sm text-gray-500">Запустил</label>
                  <p className="font-medium text-gray-900">{exportRun.triggeredBy}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <ExFilesPanel files={files} onDownload={onDownloadFile} showDownloadCount />
        )}

        {activeTab === 'lineage' && lineage && (
          <ExLineagePanel
            sources={lineage.sources}
            connectors={lineage.connectors}
            asOf={lineage.asOf}
            overallDqScore={lineage.overallDqScore}
            warnings={lineage.warnings}
          />
        )}

        {activeTab === 'lineage' && !lineage && (
          <p className="text-center text-gray-500 py-8">Lineage data not available.</p>
        )}

        {activeTab === 'errors' && (
          <div>
            {errorsCount === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-gray-500">Ошибок нет</p>
              </div>
            ) : (
              <div className="space-y-2">
                {exportRun.errorsJson.map((error, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-red-50 border border-red-200"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        {error.sectionId && (
                          <p className="text-sm text-red-600 font-medium mb-1">
                            Section: {error.sectionId}
                          </p>
                        )}
                        <p className="text-red-700">{error.message}</p>
                        <p className="text-xs text-red-500 mt-1">{formatDate(error.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExExportDetail;
