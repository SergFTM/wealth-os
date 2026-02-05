'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { useTranslation, useI18n } from '@/lib/i18n';
import { notificationsConfig } from '../config';
import { NtRulesTable } from './NtRulesTable';
import { NtEscalationsTable } from './NtEscalationsTable';
import { NtDigestsTable } from './NtDigestsTable';
import { NtTemplatesTable } from './NtTemplatesTable';
import { NtChannelsTable } from './NtChannelsTable';
import { NtPreferencesPanel } from './NtPreferencesPanel';
import { NtInboxList } from './NtInboxList';

interface TabConfig {
  key: string;
  label: Record<string, string>;
}

export function NtListPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'inbox';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const t = useTranslation();
  const { lang: locale } = useI18n();
  const config = notificationsConfig;

  // Load data for all tabs
  const { items: notifications = [], refetch: refetchNotifications } =
    useCollection<{ id: string; readAt?: string | null; createdAt: string; updatedAt: string }>('notifications');
  const { items: rules = [] } =
    useCollection<{ id: string; createdAt: string; updatedAt: string }>('notificationRules');
  const { items: escalations = [] } =
    useCollection<{ id: string; createdAt: string; updatedAt: string }>('escalations');
  const { items: digests = [] } =
    useCollection<{ id: string; createdAt: string; updatedAt: string }>('digests');
  const { items: templates = [] } =
    useCollection<{ id: string; createdAt: string; updatedAt: string }>('notificationTemplates');
  const { items: channels = [] } =
    useCollection<{ id: string; createdAt: string; updatedAt: string }>('notificationChannels');
  const { items: preferences = [] } =
    useCollection<{ id: string; createdAt: string; updatedAt: string }>('userNotificationPrefs');

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inbox':
        return (
          <NtInboxList
            notifications={notifications as never[]}
            selectedIds={selectedNotifications}
            onSelectionChange={setSelectedNotifications}
            onMarkRead={handleMarkRead}
          />
        );
      case 'rules':
        return <NtRulesTable rules={rules as never[]} />;
      case 'escalations':
        return <NtEscalationsTable escalations={escalations as never[]} />;
      case 'digests':
        return <NtDigestsTable digests={digests as never[]} />;
      case 'templates':
        return <NtTemplatesTable templates={templates as never[]} />;
      case 'channels':
        return <NtChannelsTable channels={channels as never[]} />;
      case 'preferences':
        return <NtPreferencesPanel preferences={preferences[0] as never} />;
      default:
        return null;
    }
  };

  const getTabCount = (tabKey: string): number | null => {
    switch (tabKey) {
      case 'inbox':
        return notifications.filter(n => !n.readAt).length;
      case 'rules':
        return rules.length;
      case 'escalations':
        return escalations.length;
      case 'digests':
        return digests.length;
      case 'templates':
        return templates.length;
      case 'channels':
        return channels.length;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {(config.tabs || []).map((tab: TabConfig) => {
            const count = getTabCount(tab.key);
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative
                  ${isActive
                    ? 'text-emerald-600 border-b-2 border-emerald-500 -mb-px'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {tab.label[locale as keyof typeof tab.label] || tab.label.en}
                {count !== null && count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
