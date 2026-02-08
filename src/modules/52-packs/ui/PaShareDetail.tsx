"use client";

import { useState } from 'react';
import { PaStatusPill } from './PaStatusPill';
import { PaShareSecurityPanel } from './PaSecurityBadge';

interface PackShare {
  id: string;
  packId: string;
  tokenHash: string;
  tokenPreview?: string;
  statusKey: string;
  expiresAt: string;
  allowDownload: boolean;
  maxDownloads?: number;
  downloadCount: number;
  viewCount?: number;
  passwordHash?: string;
  watermarkEnabled?: boolean;
  watermarkText?: string;
  recipientEmail?: string;
  notifyOnAccess?: boolean;
  createdByUserId?: string;
  createdAt: string;
  revokedAt?: string;
  revokedByUserId?: string;
  revokeReason?: string;
}

interface DownloadEvent {
  id: string;
  actionKey: string;
  actorLabelMasked: string;
  ipMasked?: string;
  at: string;
}

interface PaShareDetailProps {
  share: PackShare;
  packName?: string;
  downloads: DownloadEvent[];
  shareUrl?: string;
  onRevoke?: () => void;
  onCopyLink?: () => void;
  onBack?: () => void;
}

export function PaShareDetail({
  share,
  packName,
  downloads,
  shareUrl,
  onRevoke,
  onCopyLink,
  onBack,
}: PaShareDetailProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    onCopyLink?.();
  };

  const daysLeft = getDaysUntilExpiry(share.expiresAt);
  const isExpired = daysLeft <= 0 || share.statusKey === 'expired';
  const isRevoked = share.statusKey === 'revoked';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          {onBack && (
            <button onClick={onBack} className="text-sm text-stone-500 hover:text-stone-700 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад к списку
            </button>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-stone-800">
              Ссылка: <span className="font-mono">{share.tokenPreview}...</span>
            </h1>
            <PaStatusPill status={share.statusKey} type="share" />
          </div>
          <p className="text-stone-500 mt-1">
            Пакет: {packName || share.packId}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {share.statusKey === 'active' && (
            <>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200"
              >
                {copied ? '✓ Скопировано' : 'Копировать ссылку'}
              </button>
              {onRevoke && (
                <button
                  onClick={onRevoke}
                  className="px-4 py-2 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                >
                  Отозвать
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Status Banner */}
      {isRevoked && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">Ссылка отозвана</span>
          </div>
          {share.revokeReason && (
            <p className="text-sm text-red-700 mt-2">{share.revokeReason}</p>
          )}
          {share.revokedAt && (
            <p className="text-xs text-red-600 mt-1">Отозвана: {formatDateTime(share.revokedAt)}</p>
          )}
        </div>
      )}

      {isExpired && !isRevoked && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Срок действия ссылки истёк</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Детали
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'activity'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Активность ({downloads.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PaShareSecurityPanel
            allowDownload={share.allowDownload}
            maxDownloads={share.maxDownloads}
            downloadCount={share.downloadCount}
            watermarkEnabled={share.watermarkEnabled}
            passwordProtected={!!share.passwordHash}
            expiresAt={share.expiresAt}
          />

          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
            <h4 className="text-sm font-medium text-stone-700 mb-3">Статистика</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Просмотры</span>
                <span className="text-stone-800 font-medium">{share.viewCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Скачивания</span>
                <span className="text-stone-800 font-medium">{share.downloadCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Создана</span>
                <span className="text-stone-800">{formatDateTime(share.createdAt)}</span>
              </div>
            </div>
          </div>

          {share.watermarkText && (
            <div className="md:col-span-2 bg-stone-50 rounded-xl p-4 border border-stone-200">
              <h4 className="text-sm font-medium text-stone-700 mb-2">Текст водяного знака</h4>
              <p className="text-sm text-stone-600">{share.watermarkText}</p>
            </div>
          )}

          {share.recipientEmail && (
            <div className="md:col-span-2 bg-stone-50 rounded-xl p-4 border border-stone-200">
              <h4 className="text-sm font-medium text-stone-700 mb-2">Email получателя</h4>
              <p className="text-sm text-stone-600">{share.recipientEmail}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-4">
          {downloads.length === 0 ? (
            <div className="text-center py-8 text-stone-500">
              <p>Нет активности по этой ссылке</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <th className="text-left py-3 px-4 font-medium text-stone-600">Действие</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-600">Посетитель</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-600">IP</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-600">Время</th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.map((event) => (
                    <tr key={event.id} className="border-b border-stone-100">
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          event.actionKey === 'download' || event.actionKey === 'download_all'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {event.actionKey === 'view' ? '👁️ Просмотр' :
                           event.actionKey === 'download' ? '📥 Скачивание' : '📥 Скачать всё'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-600">{event.actorLabelMasked}</td>
                      <td className="py-3 px-4 text-stone-500 font-mono text-xs">{event.ipMasked || '—'}</td>
                      <td className="py-3 px-4 text-stone-600">{formatDateTime(event.at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getDaysUntilExpiry(expiresAt: string): number {
  const now = new Date();
  const expires = new Date(expiresAt);
  return Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ru-RU');
}
