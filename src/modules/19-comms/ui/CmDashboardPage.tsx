"use client";

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight, AlertTriangle, Clock, Users, Shield } from 'lucide-react';
import { CmKpiStrip } from './CmKpiStrip';
import { CmInboxTable } from './CmInboxTable';
import { CmActionsBar } from './CmActionsBar';

interface Thread {
  id: string;
  clientId: string;
  title: string;
  threadType: 'request' | 'approval' | 'incident' | 'advisor' | 'client_service';
  status: 'open' | 'escalated' | 'closed' | 'archived';
  scopeType: string;
  scopeId: string;
  clientSafe: boolean;
  slaDueAt: string | null;
  lastMessageAt: string | null;
  unreadCountByUserJson: string;
  linkedRefsJson: string;
  createdAt: string;
}

interface SlaPolicy {
  id: string;
  name: string;
  threadType: string;
  slaHours: number;
  escalationHours: number;
}

interface CmDashboardPageProps {
  threads: Thread[];
  slaPolicies: SlaPolicy[];
  pinnedThreadIds?: string[];
  currentUserId?: string;
}

export function CmDashboardPage({
  threads,
  slaPolicies,
  pinnedThreadIds = [],
  currentUserId = 'user-rm-001',
}: CmDashboardPageProps) {
  const [selectedThreads, setSelectedThreads] = useState<string[]>([]);

  // Calculate KPIs
  const openThreads = threads.filter(t => t.status === 'open' || t.status === 'escalated');
  const now = new Date();

  const getUnreadCount = (thread: Thread): number => {
    try {
      const unreadMap = JSON.parse(thread.unreadCountByUserJson || '{}');
      return unreadMap[currentUserId] || 0;
    } catch {
      return 0;
    }
  };

  const unreadThreadsCount = threads.filter(t => getUnreadCount(t) > 0).length;
  const requestsPending = openThreads.filter(t => t.threadType === 'request').length;
  const approvalDiscussions = openThreads.filter(t => t.threadType === 'approval').length;

  const getSlaStatus = (thread: Thread): 'ok' | 'warning' | 'critical' | null => {
    if (thread.status === 'closed' || thread.status === 'archived' || !thread.slaDueAt) return null;
    const due = new Date(thread.slaDueAt);
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < 0) return 'critical';
    if (diffHours < 4) return 'critical';
    if (diffHours < 24) return 'warning';
    return 'ok';
  };

  const slaAtRisk = openThreads.filter(t => getSlaStatus(t) === 'warning').length;
  const slaOverdue = openThreads.filter(t => getSlaStatus(t) === 'critical').length;
  const clientVisibleCount = threads.filter(t => t.clientSafe && (t.status === 'open' || t.status === 'escalated')).length;

  type KpiColor = 'default' | 'emerald' | 'amber' | 'red';
  const kpiItems: { id: string; label: string; value: number; color: KpiColor; href?: string }[] = [
    { id: 'unreadThreads', label: 'Непрочитанные', value: unreadThreadsCount, color: unreadThreadsCount > 0 ? 'amber' : 'default', href: '/m/comms/list?filter=unread' },
    { id: 'requestsPending', label: 'Запросы', value: requestsPending, color: 'default', href: '/m/comms/list?tab=requests' },
    { id: 'approvalDiscussions', label: 'Согласования', value: approvalDiscussions, color: 'default', href: '/m/comms/list?tab=approvals' },
    { id: 'slaAtRisk', label: 'SLA под угрозой', value: slaAtRisk, color: slaAtRisk > 0 ? 'amber' : 'default', href: '/m/comms/list?filter=sla_warning' },
    { id: 'slaOverdue', label: 'SLA просрочен', value: slaOverdue, color: slaOverdue > 0 ? 'red' : 'default', href: '/m/comms/list?filter=sla_overdue' },
    { id: 'pinnedThreads', label: 'Закрепленные', value: pinnedThreadIds.length, color: 'default' },
    { id: 'clientVisibleThreads', label: 'Видны клиенту', value: clientVisibleCount, color: 'emerald', href: '/m/comms/list?tab=client_visible' },
    { id: 'archivedThreads', label: 'Архив', value: threads.filter(t => t.status === 'archived').length, color: 'default', href: '/m/comms/list?tab=archived' },
  ];

  // Recent activity (latest threads)
  const recentThreads = [...threads]
    .filter(t => t.status !== 'archived')
    .sort((a, b) => new Date(b.lastMessageAt || b.createdAt).getTime() - new Date(a.lastMessageAt || a.createdAt).getTime())
    .slice(0, 10);

  // Urgent threads (escalated or SLA critical)
  const urgentThreads = openThreads.filter(t =>
    t.status === 'escalated' || getSlaStatus(t) === 'critical'
  ).slice(0, 5);

  const handleRowClick = (thread: Thread) => {
    window.location.href = `/m/comms/thread/${thread.id}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Защищенные коммуникации</h1>
          <p className="text-sm text-stone-500 mt-1">
            Коммуникации внутри платформы являются защищенными, но требуют соблюдения политик доступа
          </p>
        </div>
        <CmActionsBar selectedCount={selectedThreads.length} />
      </div>

      {/* KPIs */}
      <CmKpiStrip items={kpiItems} />

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column - Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-stone-500" />
              Последняя активность
            </h2>
            <Link
              href="/m/comms/list"
              className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Все треды
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <CmInboxTable
            threads={recentThreads}
            pinnedThreadIds={pinnedThreadIds}
            currentUserId={currentUserId}
            onRowClick={handleRowClick}
            compact
          />
        </div>

        {/* Side column - Urgent & Stats */}
        <div className="space-y-6">
          {/* Urgent Threads */}
          {urgentThreads.length > 0 && (
            <div className="bg-red-50 rounded-2xl border border-red-200 p-4">
              <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" />
                Требуют внимания ({urgentThreads.length})
              </h3>
              <div className="space-y-2">
                {urgentThreads.map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/m/comms/thread/${thread.id}`}
                    className="block p-3 bg-white rounded-lg border border-red-100 hover:border-red-300 transition-colors"
                  >
                    <div className="text-sm font-medium text-stone-800 truncate">
                      {thread.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                      {thread.status === 'escalated' && (
                        <span className="text-red-600 font-medium">Эскалирован</span>
                      )}
                      {getSlaStatus(thread) === 'critical' && thread.slaDueAt && (
                        <span className="text-red-600">SLA просрочен</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* SLA Policies */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4">
            <h3 className="text-sm font-semibold text-stone-800 flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-stone-500" />
              SLA политики
            </h3>
            <div className="space-y-2">
              {slaPolicies.slice(0, 5).map((policy) => (
                <div
                  key={policy.id}
                  className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
                >
                  <div>
                    <div className="text-sm text-stone-700">{policy.name}</div>
                    <div className="text-xs text-stone-400">{policy.threadType}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-stone-800">{policy.slaHours}ч</div>
                    <div className="text-xs text-amber-600">эск. {policy.escalationHours}ч</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4">
            <h3 className="text-sm font-semibold text-stone-800 flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-stone-500" />
              Статистика команды
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Активных тредов</span>
                <span className="text-sm font-medium text-stone-800">{openThreads.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Закрыто сегодня</span>
                <span className="text-sm font-medium text-emerald-600">
                  {threads.filter(t => {
                    if (t.status !== 'closed') return false;
                    const today = new Date();
                    const created = new Date(t.createdAt);
                    return created.toDateString() === today.toDateString();
                  }).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Среднее время ответа</span>
                <span className="text-sm font-medium text-stone-800">2.4ч</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-emerald-800">Защищенные коммуникации</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Все сообщения шифруются и хранятся в соответствии с политиками безопасности.
                  Доступ контролируется на уровне scope.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
