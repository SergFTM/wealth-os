"use client";

import Link from 'next/link';

export interface PaKpiItem {
  id: string;
  label: string;
  value: string | number;
  status: 'ok' | 'warning' | 'critical' | 'info';
  linkTo: string;
}

const statusColors: Record<string, string> = {
  ok: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
  warning: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100',
  critical: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
  info: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
};

export function PaKpiStrip({ kpis }: { kpis: PaKpiItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => (
        <Link
          key={kpi.id}
          href={kpi.linkTo}
          className={`
            flex flex-col p-3 rounded-xl border backdrop-blur-sm
            transition-all duration-200 hover:shadow-md
            ${statusColors[kpi.status]}
          `}
        >
          <span className="text-2xl font-semibold">{kpi.value}</span>
          <span className="text-xs opacity-80 mt-1 line-clamp-2">{kpi.label}</span>
        </Link>
      ))}
    </div>
  );
}

export function calculatePacksKpis(data: {
  packs: { statusKey: string; clientSafe: boolean; createdAt: string; itemsCount?: number }[];
  approvals: { statusKey: string }[];
  shares: { statusKey: string; expiresAt: string; revokedAt?: string }[];
  downloads: { at: string }[];
}): PaKpiItem[] {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const packsCreated30d = data.packs.filter(p => new Date(p.createdAt) >= thirtyDaysAgo).length;
  const pendingApprovals = data.approvals.filter(a => a.statusKey === 'pending').length;
  const activeShares = data.shares.filter(s => s.statusKey === 'active').length;
  const downloads7d = data.downloads.filter(d => new Date(d.at) >= sevenDaysAgo).length;

  const expiringShares = data.shares.filter(s =>
    s.statusKey === 'active' &&
    new Date(s.expiresAt) <= fourteenDaysFromNow &&
    new Date(s.expiresAt) > now
  ).length;

  const missingDocs = data.packs.filter(p =>
    p.statusKey === 'draft' &&
    (!p.itemsCount || p.itemsCount === 0)
  ).length;

  const clientSafePacks = data.packs.filter(p => p.clientSafe && p.statusKey === 'shared').length;

  const revokedShares30d = data.shares.filter(s =>
    s.revokedAt && new Date(s.revokedAt) >= thirtyDaysAgo
  ).length;

  return [
    { id: 'packsCreated30d', label: 'Пакетов за 30д', value: packsCreated30d, status: 'info', linkTo: '/m/packs/list?tab=packs&period=30d' },
    { id: 'pendingApprovals', label: 'Ожидают одобрения', value: pendingApprovals, status: pendingApprovals > 0 ? 'warning' : 'ok', linkTo: '/m/packs/list?tab=approvals&status=pending' },
    { id: 'activeShares', label: 'Активные ссылки', value: activeShares, status: 'ok', linkTo: '/m/packs/list?tab=shares&status=active' },
    { id: 'downloads7d', label: 'Скачиваний 7д', value: downloads7d, status: 'info', linkTo: '/m/packs/list?tab=downloads&period=7d' },
    { id: 'expiringShares', label: 'Истекает 14д', value: expiringShares, status: expiringShares > 0 ? 'warning' : 'ok', linkTo: '/m/packs/list?tab=shares&filter=expiring_14d' },
    { id: 'missingDocs', label: 'Без документов', value: missingDocs, status: missingDocs > 0 ? 'critical' : 'ok', linkTo: '/m/packs/list?tab=packs&filter=missing_docs' },
    { id: 'clientSafePacks', label: 'Client-safe', value: clientSafePacks, status: 'ok', linkTo: '/m/packs/list?tab=packs&filter=client_safe' },
    { id: 'revokedShares30d', label: 'Отозвано 30д', value: revokedShares30d, status: 'info', linkTo: '/m/packs/list?tab=shares&filter=revoked_30d' },
  ];
}
