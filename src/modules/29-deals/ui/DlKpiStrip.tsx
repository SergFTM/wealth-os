'use client';

import Link from 'next/link';
import { TrendingUp, Clock, FileText, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCard {
  key: string;
  title: string;
  value: number | string;
  icon: React.ReactNode;
  href: string;
  status?: 'ok' | 'warn' | 'error';
}

interface DlKpiStripProps {
  deals: unknown[];
  transactions: unknown[];
  approvals: unknown[];
  corporateActions: unknown[];
  capitalEvents: unknown[];
  documents: unknown[];
}

export function DlKpiStrip({ deals, transactions, approvals, corporateActions, capitalEvents, documents }: DlKpiStripProps) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Calculate KPIs
  const activeDeals = deals.filter((d: any) => d.status === 'active').length;
  const pendingApprovals = approvals.filter((a: any) => a.status === 'pending').length;
  const transactions30d = transactions.filter((t: any) => new Date(t.txDate) >= thirtyDaysAgo).length;
  const upcomingActions = corporateActions.filter((ca: any) => ca.status === 'planned' || ca.status === 'announced').length;
  const openEvents = capitalEvents.filter((ce: any) => ce.status === 'open' || ce.status === 'announced').length;
  const missingDocs = documents.filter((doc: any) => doc.status === 'missing').length;
  const unpostedTx = transactions.filter((t: any) => t.status === 'draft' || t.status === 'pending').length;
  const closedDeals90d = deals.filter((d: any) => {
    if (d.status !== 'closed') return false;
    const closeDate = new Date(d.updatedAt);
    return closeDate >= ninetyDaysAgo;
  }).length;

  const kpis: KpiCard[] = [
    {
      key: 'activeDeals',
      title: 'Активные сделки',
      value: activeDeals,
      icon: <TrendingUp className="h-5 w-5" />,
      href: '/m/deals/list?tab=pipeline&status=active',
      status: 'ok'
    },
    {
      key: 'pendingApprovals',
      title: 'Ожидают согласования',
      value: pendingApprovals,
      icon: <Clock className="h-5 w-5" />,
      href: '/m/deals/list?tab=approvals&status=pending',
      status: pendingApprovals > 5 ? 'warn' : 'ok'
    },
    {
      key: 'transactions30d',
      title: 'Транзакции 30д',
      value: transactions30d,
      icon: <FileText className="h-5 w-5" />,
      href: '/m/deals/list?tab=transactions&period=30d',
      status: 'ok'
    },
    {
      key: 'upcomingActions',
      title: 'Предстоящие действия',
      value: upcomingActions,
      icon: <AlertCircle className="h-5 w-5" />,
      href: '/m/deals/list?tab=actions&filter=upcoming',
      status: upcomingActions > 0 ? 'warn' : 'ok'
    },
    {
      key: 'openEvents',
      title: 'Открытые события',
      value: openEvents,
      icon: <TrendingUp className="h-5 w-5" />,
      href: '/m/deals/list?tab=events&status=open',
      status: 'ok'
    },
    {
      key: 'missingDocs',
      title: 'Документы отсутствуют',
      value: missingDocs,
      icon: <AlertCircle className="h-5 w-5" />,
      href: '/m/deals/list?tab=documents&filter=missing',
      status: missingDocs > 0 ? 'error' : 'ok'
    },
    {
      key: 'unpostedTx',
      title: 'Не проведено',
      value: unpostedTx,
      icon: <Clock className="h-5 w-5" />,
      href: '/m/deals/list?tab=transactions&filter=unposted',
      status: unpostedTx > 0 ? 'warn' : 'ok'
    },
    {
      key: 'closedDeals90d',
      title: 'Закрыто за 90д',
      value: closedDeals90d,
      icon: <CheckCircle className="h-5 w-5" />,
      href: '/m/deals/list?tab=pipeline&status=closed&period=90d',
      status: 'ok'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map(kpi => (
        <Link
          key={kpi.key}
          href={kpi.href}
          className={cn(
            'group relative rounded-xl border p-4 transition-all hover:shadow-md',
            'bg-white/60 backdrop-blur-sm border-white/20',
            kpi.status === 'error' && 'border-red-200 bg-red-50/50',
            kpi.status === 'warn' && 'border-amber-200 bg-amber-50/50'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={cn(
              'p-1.5 rounded-lg',
              kpi.status === 'ok' && 'bg-emerald-100 text-emerald-600',
              kpi.status === 'warn' && 'bg-amber-100 text-amber-600',
              kpi.status === 'error' && 'bg-red-100 text-red-600'
            )}>
              {kpi.icon}
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-semibold text-slate-900">{kpi.value}</div>
          <div className="text-xs text-slate-500 mt-1 leading-tight">{kpi.title}</div>
        </Link>
      ))}
    </div>
  );
}
