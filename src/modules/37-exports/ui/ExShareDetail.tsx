'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  XCircle,
  Copy,
  Link2,
  Shield,
  Clock,
  Download,
  Eye,
  Mail,
  Globe,
  Lock,
} from 'lucide-react';
import { ExStatusPill } from './ExStatusPill';
import { ExFilesPanel } from './ExFilesPanel';

interface ExportFile {
  id: string;
  fileName: string;
  format: 'csv' | 'pdf';
  sizeBytes: number;
  rowCount?: number;
  createdAt: string;
}

interface ExShareDetailProps {
  share: {
    id: string;
    name: string;
    packId: string;
    packName?: string;
    audienceType: 'advisor' | 'auditor' | 'client' | 'bank' | 'regulator';
    audienceName?: string;
    audienceEmail?: string;
    status: 'active' | 'expired' | 'revoked';
    clientSafe: boolean;
    accessToken: string;
    expiresAt: string;
    maxDownloads?: number;
    downloadCount: number;
    lastAccessAt?: string;
    password?: boolean;
    ipWhitelist?: string[];
    createdByUserId?: string;
    createdAt: string;
    revokedAt?: string;
    revokeReason?: string;
  };
  files: ExportFile[];
  onRevoke: () => void;
  onCopyLink: () => void;
  onDownloadFile: (fileId: string) => void;
  isPublicView?: boolean;
}

const AUDIENCE_LABELS: Record<string, string> = {
  advisor: 'Налоговый консультант',
  auditor: 'Аудитор',
  client: 'Клиент',
  bank: 'Банк',
  regulator: 'Регулятор',
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isExpired(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export function ExShareDetail({
  share,
  files,
  onRevoke,
  onCopyLink,
  onDownloadFile,
  isPublicView = false,
}: ExShareDetailProps) {
  const expired = isExpired(share.expiresAt);
  const canDownload = share.status === 'active' && !expired;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          {!isPublicView && (
            <Link
              href="/m/exports/list?tab=shares"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к списку
            </Link>
          )}
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <Link2 className="w-6 h-6 text-gray-400" />
            {share.name}
          </h1>
          <p className="text-gray-500 mt-1">
            Share для {AUDIENCE_LABELS[share.audienceType]}
            {share.audienceName && ` • ${share.audienceName}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExStatusPill status={share.status} />
          {!isPublicView && (
            <>
              <button
                onClick={onCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Копировать ссылку
              </button>
              {share.status === 'active' && (
                <button
                  onClick={onRevoke}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Отозвать
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Warning for revoked/expired */}
      {(share.status === 'revoked' || expired) && (
        <div
          className={`p-4 rounded-xl border ${
            share.status === 'revoked'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}
        >
          {share.status === 'revoked' ? (
            <p>
              <strong>Share отозван</strong>
              {share.revokeReason && `: ${share.revokeReason}`}
              {share.revokedAt && ` (${formatDate(share.revokedAt)})`}
            </p>
          ) : (
            <p>
              <strong>Share истёк</strong> ({formatDate(share.expiresAt)})
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Pack Info */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
            <h2 className="font-medium text-gray-900 mb-4">Пакет экспорта</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{share.packName || share.packId}</p>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  {share.clientSafe && (
                    <>
                      <Shield className="w-4 h-4 text-emerald-500" />
                      Client-safe версия
                    </>
                  )}
                </p>
              </div>
              {!isPublicView && (
                <Link
                  href={`/m/exports/pack/${share.packId}`}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  Открыть пакет →
                </Link>
              )}
            </div>
          </div>

          {/* Files */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
            <h2 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Download className="w-4 h-4 text-gray-400" />
              Файлы для скачивания
            </h2>
            {canDownload ? (
              <ExFilesPanel files={files} onDownload={onDownloadFile} showDownloadCount />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Lock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>Скачивание недоступно</p>
                <p className="text-sm mt-1">Share {share.status === 'revoked' ? 'отозван' : 'истёк'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Share Details */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
            <h2 className="font-medium text-gray-900 mb-4">Детали share</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Получатель
                </label>
                <p className="font-medium text-gray-900">
                  {AUDIENCE_LABELS[share.audienceType]}
                </p>
                {share.audienceName && (
                  <p className="text-sm text-gray-600">{share.audienceName}</p>
                )}
              </div>

              {share.audienceEmail && (
                <div>
                  <label className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <p className="font-medium text-gray-900">{share.audienceEmail}</p>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Истекает
                </label>
                <p className={`font-medium ${expired ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatDate(share.expiresAt)}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500 flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  Скачиваний
                </label>
                <p className="font-medium text-gray-900">
                  {share.downloadCount}
                  {share.maxDownloads && ` / ${share.maxDownloads}`}
                </p>
              </div>

              {share.lastAccessAt && (
                <div>
                  <label className="text-sm text-gray-500 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Последний доступ
                  </label>
                  <p className="font-medium text-gray-900">{formatDate(share.lastAccessAt)}</p>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-500">Защита</label>
                <div className="flex items-center gap-2 mt-1">
                  {share.password && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs">
                      <Lock className="w-3 h-3" />
                      Пароль
                    </span>
                  )}
                  {share.ipWhitelist && share.ipWhitelist.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">
                      <Globe className="w-3 h-3" />
                      IP-фильтр
                    </span>
                  )}
                  {!share.password && (!share.ipWhitelist || share.ipWhitelist.length === 0) && (
                    <span className="text-gray-400 text-sm">Нет</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
            <h2 className="font-medium text-gray-900 mb-4">Метаданные</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Создан</span>
                <span className="text-gray-900">{formatDate(share.createdAt)}</span>
              </div>
              {share.createdByUserId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Автор</span>
                  <span className="text-gray-900">{share.createdByUserId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExShareDetail;
