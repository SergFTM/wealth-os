'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Send,
  Share2,
  Calendar,
  Shield,
  Settings,
  FileText,
  GitBranch,
  History,
  Edit,
} from 'lucide-react';
import { ExStatusPill } from './ExStatusPill';
import { ExLineagePanel } from './ExLineagePanel';
import { ExFilesPanel } from './ExFilesPanel';

interface PackSection {
  sectionId: string;
  enabled: boolean;
  label: string;
  filters?: Record<string, unknown>;
  columns?: string[];
  format?: 'csv' | 'pdf';
}

interface ExportRun {
  id: string;
  status: 'queued' | 'running' | 'success' | 'failed';
  startedAt: string;
  finishedAt?: string;
  filesCount: number;
}

interface ExportFile {
  id: string;
  fileName: string;
  format: 'csv' | 'pdf';
  sizeBytes: number;
  rowCount?: number;
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

interface ExPackDetailProps {
  pack: {
    id: string;
    name: string;
    packType: 'audit' | 'tax' | 'bank' | 'ops';
    scopeType: string;
    scopeId?: string;
    asOf?: string;
    clientSafe: boolean;
    status: 'draft' | 'published' | 'archived';
    description?: string;
    sectionsJson: PackSection[];
    createdAt: string;
    updatedAt?: string;
  };
  runs: ExportRun[];
  files: ExportFile[];
  lineage?: LineageData;
  onRunExport: () => void;
  onPublish: () => void;
  onShare: () => void;
  onEdit: () => void;
  onDownloadFile: (fileId: string) => void;
}

const PACK_TYPE_LABELS: Record<string, string> = {
  audit: 'Audit Pack',
  tax: 'Tax Advisor Pack',
  bank: 'Bank KYC Pack',
  ops: 'Operations Pack',
};

const TABS = [
  { id: 'overview', label: 'Обзор', icon: FileText },
  { id: 'sections', label: 'Секции', icon: Settings },
  { id: 'exports', label: 'Выгрузки', icon: History },
  { id: 'files', label: 'Файлы', icon: FileText },
  { id: 'lineage', label: 'Lineage', icon: GitBranch },
];

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function ExPackDetail({
  pack,
  runs,
  files,
  lineage,
  onRunExport,
  onPublish,
  onShare,
  onEdit,
  onDownloadFile,
}: ExPackDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const enabledSections = pack.sectionsJson?.filter((s) => s.enabled) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/m/exports/list?tab=packs"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к списку
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            {pack.name}
            <ExStatusPill status={pack.status} />
          </h1>
          <p className="text-gray-500 mt-1">
            {PACK_TYPE_LABELS[pack.packType]} • {pack.scopeType}
            {pack.clientSafe && (
              <span className="inline-flex items-center gap-1 ml-2 text-emerald-600">
                <Shield className="w-4 h-4" />
                Client-safe
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pack.status === 'draft' && (
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Редактировать
            </button>
          )}
          {pack.status === 'draft' && (
            <button
              onClick={onPublish}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Send className="w-4 h-4" />
              Опубликовать
            </button>
          )}
          <button
            onClick={onShare}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Поделиться
          </button>
          <button
            onClick={onRunExport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm"
          >
            <Play className="w-4 h-4" />
            Запустить экспорт
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100">
        {TABS.map((tab) => {
          const Icon = tab.icon;
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
                <label className="text-sm text-gray-500">Название</label>
                <p className="font-medium text-gray-900">{pack.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Описание</label>
                <p className="text-gray-900">{pack.description || '—'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Тип пакета</label>
                <p className="font-medium text-gray-900">{PACK_TYPE_LABELS[pack.packType]}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Scope</label>
                <p className="font-medium text-gray-900 capitalize">{pack.scopeType}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">As-of Date</label>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {formatDate(pack.asOf)}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Client-safe</label>
                <p className="font-medium text-gray-900">
                  {pack.clientSafe ? 'Да (данные маскированы)' : 'Нет (полные данные)'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Секций включено</label>
                <p className="font-medium text-gray-900">{enabledSections.length}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Выгрузок выполнено</label>
                <p className="font-medium text-gray-900">{runs.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Секции определяют, какие данные включены в пакет экспорта.
            </p>
            <div className="space-y-2">
              {pack.sectionsJson?.map((section) => (
                <div
                  key={section.sectionId}
                  className={`p-4 rounded-lg border ${
                    section.enabled
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{section.label}</span>
                      <p className="text-sm text-gray-500">
                        Формат: {section.format?.toUpperCase() || 'CSV'}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        section.enabled
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {section.enabled ? 'Включено' : 'Отключено'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'exports' && (
          <div className="space-y-4">
            {runs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Нет выгрузок. Нажмите «Запустить экспорт» для создания.
              </p>
            ) : (
              <div className="space-y-2">
                {runs.map((run) => (
                  <Link
                    key={run.id}
                    href={`/m/exports/export/${run.id}`}
                    className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-sm text-gray-700">{run.id.slice(0, 16)}...</span>
                        <p className="text-sm text-gray-500">{formatDate(run.startedAt)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{run.filesCount} файлов</span>
                        <ExStatusPill status={run.status} size="sm" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
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
          <p className="text-center text-gray-500 py-8">
            Lineage будет доступен после первого запуска экспорта.
          </p>
        )}
      </div>
    </div>
  );
}

export default ExPackDetail;
