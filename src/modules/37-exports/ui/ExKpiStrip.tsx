'use client';

import React from 'react';
import Link from 'next/link';
import {
  Package,
  FileOutput,
  FileText,
  Share2,
  Shield,
  Clock,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  href: string;
  trend?: { value: number; isPositive: boolean };
}

function KpiCard({ icon, label, value, href, trend }: KpiCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-2 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:border-emerald-200 hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-amber-50 text-emerald-600 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </Link>
  );
}

interface ExKpiStripProps {
  stats: {
    packsCreated30d: number;
    exportsRun7d: number;
    filesGenerated: number;
    sharesActive: number;
    clientSafePacks: number;
    pendingApprovals: number;
    schedulesActive: number;
    lineageMissing: number;
  };
}

export function ExKpiStrip({ stats }: ExKpiStripProps) {
  const kpis: KpiCardProps[] = [
    {
      icon: <Package className="w-5 h-5" />,
      label: 'Пакетов за 30д',
      value: stats.packsCreated30d,
      href: '/m/exports/list?tab=packs&period=30d',
    },
    {
      icon: <FileOutput className="w-5 h-5" />,
      label: 'Выгрузок за 7д',
      value: stats.exportsRun7d,
      href: '/m/exports/list?tab=exports&period=7d',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Файлов создано',
      value: stats.filesGenerated,
      href: '/m/exports/list?tab=exports&filter=files',
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      label: 'Активных shares',
      value: stats.sharesActive,
      href: '/m/exports/list?tab=shares&status=active',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: 'Client-safe пакетов',
      value: stats.clientSafePacks,
      href: '/m/exports/list?tab=packs&filter=client_safe',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Ожидают одобрения',
      value: stats.pendingApprovals,
      href: '/m/exports/list?tab=packs&filter=pending_approval',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Активных расписаний',
      value: stats.schedulesActive,
      href: '/m/exports/list?tab=schedules&status=active',
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: 'Без lineage',
      value: stats.lineageMissing,
      href: '/m/exports/list?tab=packs&filter=missing_lineage',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {kpis.map((kpi, idx) => (
        <KpiCard key={idx} {...kpi} />
      ))}
    </div>
  );
}

export default ExKpiStrip;
