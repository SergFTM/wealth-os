'use client';

import { useState, useMemo } from 'react';
import { useCollection } from '@/lib/hooks';
import { useI18n, useTranslation } from '@/lib/i18n';
import { notificationsConfig } from '../config';
import { NtKpiStrip } from './NtKpiStrip';
import { NtInboxList } from './NtInboxList';
import { NtActionsBar } from './NtActionsBar';
import { NtCreateRuleModal } from './NtCreateRuleModal';
import { NtDisclaimerBanner } from './NtDisclaimerBanner';

interface Notification {
  id: string;
  clientId: string;
  userId: string;
  userName: string;
  title: string;
  body?: string;
  category: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channel: string;
  status: string;
  readAt?: string | null;
  deliveredAt?: string | null;
  sourceType?: string;
  sourceId?: string;
  sourceName?: string;
  sourceUrl?: string;
  aiScore?: number | null;
  aiTags?: string[];
  escalationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Escalation {
  id: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'expired';
  level: number;
  createdAt: string;
  updatedAt: string;
}

interface NotificationRule {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'disabled';
  firedCount: number;
  lastFiredAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NotificationChannel {
  id: string;
  type: string;
  name: string;
  status: 'active' | 'paused' | 'error' | 'disabled';
  createdAt: string;
  updatedAt: string;
}

export function NtDashboardPage() {
  const { lang: locale } = useI18n();
  const t = useTranslation();
  const config = notificationsConfig;

  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Load data
  const { items: notifications = [], loading: loadingNotifications, refetch: refetchNotifications } =
    useCollection<Notification>('notifications');
  const { items: escalations = [], loading: loadingEscalations } =
    useCollection<Escalation>('escalations');
  const { items: rules = [] } =
    useCollection<NotificationRule>('notificationRules');
  const { items: channels = [] } =
    useCollection<NotificationChannel>('notificationChannels');

  // Calculate KPIs
  const kpis = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const unreadCount = notifications.filter(n => !n.readAt && n.status !== 'archived').length;
    const todayCount = notifications.filter(n => new Date(n.createdAt) >= today).length;
    const escalationsActive = escalations.filter(e => e.status === 'active').length;
    const rulesFiring = rules.filter(r => r.lastFiredAt && new Date(r.lastFiredAt) >= today).length;

    const delivered = notifications.filter(n => n.status === 'delivered' || n.status === 'read').length;
    const total = notifications.length;
    const deliveryRate = total > 0 ? delivered / total : 1;

    const readNotifications = notifications.filter(n => n.readAt && n.deliveredAt);
    let avgResponseTime = 0;
    if (readNotifications.length > 0) {
      const totalTime = readNotifications.reduce((sum, n) => {
        const delivered = new Date(n.deliveredAt!).getTime();
        const read = new Date(n.readAt!).getTime();
        return sum + (read - delivered);
      }, 0);
      avgResponseTime = totalTime / readNotifications.length / (1000 * 60); // minutes
    }

    const channelsActive = channels.filter(c => c.status === 'active').length;

    const withAiScore = notifications.filter(n => n.aiScore !== null && n.aiScore !== undefined).length;
    const aiTriageRate = total > 0 ? withAiScore / total : 0;

    return {
      unreadCount,
      todayCount,
      escalationsActive,
      rulesFiring,
      deliveryRate,
      avgResponseTime,
      channelsActive,
      aiTriageRate,
    };
  }, [notifications, escalations, rules, channels]);

  // Filter only unread/recent notifications for inbox
  const inboxNotifications = useMemo(() => {
    return notifications
      .filter(n => n.status !== 'archived')
      .sort((a, b) => {
        // Sort by AI score first, then by date
        if (a.aiScore !== null && b.aiScore !== null) {
          if (b.aiScore !== a.aiScore) return (b.aiScore || 0) - (a.aiScore || 0);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 50);
  }, [notifications]);

  const handleMarkRead = async (ids: string[]) => {
    for (const id of ids) {
      await fetch(`/api/collections/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read', readAt: new Date().toISOString() }),
      });
    }
    refetchNotifications();
    setSelectedNotifications([]);
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.readAt).map(n => n.id);
    await handleMarkRead(unreadIds);
  };

  const handleArchive = async (ids: string[]) => {
    for (const id of ids) {
      await fetch(`/api/collections/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      });
    }
    refetchNotifications();
    setSelectedNotifications([]);
  };

  const loading = loadingNotifications || loadingEscalations;

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <NtDisclaimerBanner />

      {/* KPI Strip */}
      <NtKpiStrip kpis={kpis} config={config} locale={locale} />

      {/* Actions Bar */}
      <NtActionsBar
        selectedCount={selectedNotifications.length}
        onMarkRead={() => handleMarkRead(selectedNotifications)}
        onMarkAllRead={handleMarkAllRead}
        onArchive={() => handleArchive(selectedNotifications)}
        onCreateRule={() => setShowCreateRuleModal(true)}
      />

      {/* Inbox List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('inbox', { ru: 'Входящие', en: 'Inbox', uk: 'Вхідні' })}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t('inboxDescription', {
              ru: `${kpis.unreadCount} непрочитанных уведомлений`,
              en: `${kpis.unreadCount} unread notifications`,
              uk: `${kpis.unreadCount} непрочитаних сповіщень`
            })}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            {t('loading', { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' })}
          </div>
        ) : (
          <NtInboxList
            notifications={inboxNotifications}
            selectedIds={selectedNotifications}
            onSelectionChange={setSelectedNotifications}
            onMarkRead={handleMarkRead}
          />
        )}
      </div>

      {/* Create Rule Modal */}
      {showCreateRuleModal && (
        <NtCreateRuleModal
          onClose={() => setShowCreateRuleModal(false)}
          onCreated={() => {
            setShowCreateRuleModal(false);
            refetchNotifications();
          }}
        />
      )}
    </div>
  );
}
