"use client";

import Link from 'next/link';

interface PackDownload {
  id: string;
  packId: string;
  packName?: string;
  shareId: string;
  shareToken?: string;
  itemId?: string;
  itemTitle?: string;
  actionKey: string;
  actorLabelMasked: string;
  actorEmail?: string;
  ipMasked?: string;
  userAgent?: string;
  geoLocation?: string;
  at: string;
}

interface PaDownloadsTableProps {
  downloads: PackDownload[];
  onOpenPack?: (packId: string) => void;
  onOpenShare?: (shareId: string) => void;
}

const actionLabels: Record<string, { label: string; icon: string; color: string }> = {
  view: { label: 'Просмотр', icon: '👁️', color: 'bg-stone-100 text-stone-600' },
  download: { label: 'Скачивание', icon: '📥', color: 'bg-blue-50 text-blue-700' },
  download_all: { label: 'Скачать всё', icon: '📦', color: 'bg-blue-50 text-blue-700' },
};

export function PaDownloadsTable({ downloads, onOpenPack, onOpenShare }: PaDownloadsTableProps) {
  if (downloads.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <p className="font-medium">Нет скачиваний</p>
        <p className="text-sm mt-1">История скачиваний пуста</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="text-left py-3 px-4 font-medium text-stone-600">Время</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Пакет</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Документ</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Действие</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Посетитель</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">IP</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Локация</th>
          </tr>
        </thead>
        <tbody>
          {downloads.map((download) => {
            const action = actionLabels[download.actionKey] || actionLabels.view;

            return (
              <tr key={download.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                  {formatDateTime(download.at)}
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/m/packs/pack/${download.packId}`}
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {download.packName || download.packId.slice(0, 8)}
                  </Link>
                </td>
                <td className="py-3 px-4 text-stone-600">
                  {download.itemTitle || (download.actionKey === 'download_all' ? 'Весь пакет' : '—')}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${action.color}`}>
                    {action.icon} {action.label}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="text-stone-800">{download.actorLabelMasked}</div>
                    {download.actorEmail && (
                      <div className="text-xs text-stone-500">{download.actorEmail}</div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-stone-500 font-mono text-xs">
                  {download.ipMasked || '—'}
                </td>
                <td className="py-3 px-4 text-stone-500 text-xs">
                  {download.geoLocation || '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function PaDownloadsSummary({ downloads }: { downloads: PackDownload[] }) {
  const now = new Date();
  const today = downloads.filter(d => {
    const downloadDate = new Date(d.at);
    return downloadDate.toDateString() === now.toDateString();
  });

  const byAction = downloads.reduce((acc, d) => {
    acc[d.actionKey] = (acc[d.actionKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueVisitors = new Set(downloads.map(d => d.actorLabelMasked)).size;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <div className="text-2xl font-semibold text-stone-800">{downloads.length}</div>
        <div className="text-sm text-stone-500">Всего событий</div>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <div className="text-2xl font-semibold text-stone-800">{today.length}</div>
        <div className="text-sm text-stone-500">Сегодня</div>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <div className="text-2xl font-semibold text-stone-800">{byAction.download || 0}</div>
        <div className="text-sm text-stone-500">Скачиваний</div>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <div className="text-2xl font-semibold text-stone-800">{uniqueVisitors}</div>
        <div className="text-sm text-stone-500">Уник. посетителей</div>
      </div>
    </div>
  );
}
