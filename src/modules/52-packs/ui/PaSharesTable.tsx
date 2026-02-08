"use client";

import Link from 'next/link';
import { PaStatusPill } from './PaStatusPill';
import { PaSecurityBadge } from './PaSecurityBadge';

interface PackShare {
  id: string;
  packId: string;
  packName?: string;
  tokenPreview?: string;
  statusKey: string;
  expiresAt: string;
  allowDownload: boolean;
  maxDownloads?: number;
  downloadCount: number;
  viewCount?: number;
  watermarkEnabled?: boolean;
  passwordHash?: string;
  createdAt: string;
  revokedAt?: string;
}

interface PaSharesTableProps {
  shares: PackShare[];
  onOpen: (id: string) => void;
  onRevoke?: (id: string) => void;
}

export function PaSharesTable({ shares, onOpen, onRevoke }: PaSharesTableProps) {
  if (shares.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <p className="font-medium">Ссылки не найдены</p>
        <p className="text-sm mt-1">Опубликуйте пакет, чтобы создать ссылку</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="text-left py-3 px-4 font-medium text-stone-600">Пакет</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Токен</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Безопасность</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Статистика</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Срок</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Статус</th>
            <th className="text-right py-3 px-4 font-medium text-stone-600"></th>
          </tr>
        </thead>
        <tbody>
          {shares.map((share) => {
            const daysLeft = getDaysUntilExpiry(share.expiresAt);
            const isExpiring = share.statusKey === 'active' && daysLeft <= 7 && daysLeft > 0;

            return (
              <tr
                key={share.id}
                className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                onClick={() => onOpen(share.id)}
              >
                <td className="py-3 px-4">
                  <Link
                    href={`/m/packs/pack/${share.packId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {share.packName || share.packId.slice(0, 8)}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono text-stone-600">{share.tokenPreview || share.id.slice(0, 8)}...</span>
                </td>
                <td className="py-3 px-4">
                  <PaSecurityBadge
                    watermark={share.watermarkEnabled}
                    password={!!share.passwordHash}
                    downloadLimit={share.maxDownloads}
                  />
                </td>
                <td className="py-3 px-4 text-stone-600">
                  <div className="flex items-center gap-3 text-xs">
                    <span title="Просмотры">👁️ {share.viewCount || 0}</span>
                    <span title="Скачивания">📥 {share.downloadCount}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={isExpiring ? 'text-amber-600 font-medium' : 'text-stone-600'}>
                    {daysLeft > 0 ? `${daysLeft} дн.` : 'Истёк'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <PaStatusPill status={share.statusKey} type="share" />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {share.statusKey === 'active' && onRevoke && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRevoke(share.id);
                        }}
                        className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                      >
                        Отозвать
                      </button>
                    )}
                    <Link
                      href={`/m/packs/share/${share.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Открыть
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function getDaysUntilExpiry(expiresAt: string): number {
  const now = new Date();
  const expires = new Date(expiresAt);
  return Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function PaSharesPreview({ shares, onViewAll }: { shares: PackShare[]; onViewAll: () => void }) {
  const activeShares = shares.filter(s => s.statusKey === 'active').slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <h3 className="font-medium text-stone-800">Активные ссылки</h3>
        <button onClick={onViewAll} className="text-sm text-emerald-600 hover:text-emerald-700">
          Все ссылки →
        </button>
      </div>
      <div className="divide-y divide-stone-100">
        {activeShares.map((share) => {
          const daysLeft = getDaysUntilExpiry(share.expiresAt);

          return (
            <Link
              key={share.id}
              href={`/m/packs/share/${share.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm text-stone-600">{share.tokenPreview}...</div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {share.packName || 'Pack'} • {share.downloadCount} скач.
                </div>
              </div>
              <div className="text-sm text-stone-500">
                {daysLeft} дн.
              </div>
            </Link>
          );
        })}
        {activeShares.length === 0 && (
          <div className="px-4 py-6 text-center text-stone-500 text-sm">
            Нет активных ссылок
          </div>
        )}
      </div>
    </div>
  );
}
