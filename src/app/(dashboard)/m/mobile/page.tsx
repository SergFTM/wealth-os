"use client";

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { MbKpiStrip, MbActionsBar, ActionIcons } from '@/modules/31-mobile/ui';
import seedData from '@/modules/31-mobile/seed.json';

const i18n = {
  ru: {
    title: 'Мобильный режим',
    subtitle: 'PWA, Offline режим и Push уведомления',
    disclaimer: 'Offline и push в MVP демонстрационные. Для production требуются service workers, VAPID ключи и инфраструктура.',
    viewList: 'Подробнее',
    helpTitle: 'О модуле',
  },
  en: {
    title: 'Mobile Mode',
    subtitle: 'PWA, Offline mode and Push notifications',
    disclaimer: 'Offline and push are demo in MVP. For production, service workers, VAPID keys and infrastructure are required.',
    viewList: 'View details',
    helpTitle: 'About module',
  },
  uk: {
    title: 'Мобільний режим',
    subtitle: 'PWA, Offline режим та Push сповіщення',
    disclaimer: 'Offline та push в MVP демонстраційні. Для production потрібні service workers, VAPID ключі та інфраструктура.',
    viewList: 'Детальніше',
    helpTitle: 'Про модуль',
  },
};

const kpiLabels = {
  devices: { ru: 'Устройства', en: 'Devices', uk: 'Пристрої' },
  push: { ru: 'Push подписки', en: 'Push subscriptions', uk: 'Push підписки' },
  unread: { ru: 'Непрочитанные', en: 'Unread', uk: 'Непрочитані' },
  offline: { ru: 'Offline планы', en: 'Offline plans', uk: 'Offline плани' },
  actions: { ru: 'Quick actions', en: 'Quick actions', uk: 'Quick actions' },
  portal: { ru: 'Portal cached', en: 'Portal cached', uk: 'Portal cached' },
  staff: { ru: 'Staff cached', en: 'Staff cached', uk: 'Staff cached' },
  sync: { ru: 'Посл. синхр.', en: 'Last sync', uk: 'Ост. синхр.' },
};

const actionLabels = {
  createOfflinePlan: { ru: 'Создать offline план', en: 'Create offline plan', uk: 'Створити offline план' },
  subscribeDevice: { ru: 'Подписать устройство', en: 'Subscribe device', uk: 'Підписати пристрій' },
  sendPush: { ru: 'Отправить push', en: 'Send push', uk: 'Надіслати push' },
  generateQuickActions: { ru: 'Сгенерировать quick actions', en: 'Generate quick actions', uk: 'Згенерувати quick actions' },
  generateDemoDevices: { ru: 'Сгенерировать demo устройства', en: 'Generate demo devices', uk: 'Згенерувати demo пристрої' },
};

export default function MobileDashboardPage() {
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];

  // Calculate KPIs from seed data
  const devicesRegistered = seedData.mobileDevices.filter(d => d.status === 'active').length;
  const pushActive = seedData.pushSubscriptions.filter(s => s.status === 'active').length;
  const unreadMessages = seedData.pushMessages.filter(m => m.status === 'unread').length;
  const offlinePlans = seedData.offlineCachePlans.length;
  const quickActionsActive = seedData.quickActions.filter(a => a.status === 'active').length;
  const portalCached = seedData.offlineCachePlans.filter(p => p.audience === 'portal').length;
  const staffCached = seedData.offlineCachePlans.filter(p => p.audience === 'staff').length;
  const lastSyncPlan = seedData.offlineCachePlans
    .filter(p => p.lastSyncedAt)
    .sort((a, b) => new Date(b.lastSyncedAt!).getTime() - new Date(a.lastSyncedAt!).getTime())[0];
  const lastSyncTime = lastSyncPlan?.lastSyncedAt
    ? new Date(lastSyncPlan.lastSyncedAt).toLocaleTimeString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    : '—';

  const kpis = [
    { id: 'devices', value: devicesRegistered, label: kpiLabels.devices, link: '/m/mobile/list?tab=devices' },
    { id: 'push', value: pushActive, label: kpiLabels.push, link: '/m/mobile/list?tab=push&filter=active' },
    { id: 'unread', value: unreadMessages, label: kpiLabels.unread, link: '/m/mobile/list?tab=push&filter=unread', trend: unreadMessages > 10 ? 'up' as const : undefined },
    { id: 'offline', value: offlinePlans, label: kpiLabels.offline, link: '/m/mobile/list?tab=offline' },
    { id: 'actions', value: quickActionsActive, label: kpiLabels.actions, link: '/m/mobile/list?tab=actions' },
    { id: 'portal', value: portalCached, label: kpiLabels.portal, link: '/m/mobile/list?tab=offline&filter=portal' },
    { id: 'staff', value: staffCached, label: kpiLabels.staff, link: '/m/mobile/list?tab=offline&filter=staff' },
    { id: 'sync', value: lastSyncTime, label: kpiLabels.sync, link: '/m/mobile/list?tab=offline&filter=last_sync' },
  ];

  const actions = [
    { id: 'createOfflinePlan', label: actionLabels.createOfflinePlan, icon: ActionIcons.Plus, variant: 'primary' as const, onClick: () => router.push('/m/mobile/list?tab=offline&action=create') },
    { id: 'subscribeDevice', label: actionLabels.subscribeDevice, icon: ActionIcons.Smartphone, variant: 'secondary' as const, onClick: () => router.push('/m/mobile/list?tab=devices&action=subscribe') },
    { id: 'sendPush', label: actionLabels.sendPush, icon: ActionIcons.Send, variant: 'secondary' as const, onClick: () => router.push('/m/mobile/list?tab=push&action=send') },
    { id: 'generateQuickActions', label: actionLabels.generateQuickActions, icon: ActionIcons.Zap, variant: 'ghost' as const, onClick: () => router.push('/m/mobile/list?tab=actions&action=generate') },
    { id: 'generateDemoDevices', label: actionLabels.generateDemoDevices, icon: ActionIcons.Database, variant: 'ghost' as const, onClick: () => router.push('/m/mobile/list?tab=devices&action=demo') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">{t.title}</h1>
          <p className="text-sm text-stone-500">{t.subtitle}</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/m/mobile/list')}>
          {t.viewList} →
        </Button>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg">
          <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-amber-800">{t.disclaimer}</p>
      </div>

      {/* KPI Strip */}
      <MbKpiStrip kpis={kpis} />

      {/* Actions Bar */}
      <MbActionsBar actions={actions} />

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* PWA Status */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="font-semibold text-stone-800">PWA</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Manifest</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs">OK</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Offline page</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs">OK</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Service Worker</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">MVP</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={() => router.push('/m/mobile/list?tab=pwa')}>
            Настроить PWA
          </Button>
        </div>

        {/* Push Stats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="font-semibold text-stone-800">Push уведомления</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Подписки активны</span>
              <span className="font-medium text-stone-800">{pushActive}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Непрочитанных</span>
              <span className="font-medium text-red-600">{unreadMessages}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">За сегодня</span>
              <span className="font-medium text-stone-800">{seedData.pushMessages.filter(m => new Date(m.createdAt).toDateString() === new Date().toDateString()).length}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={() => router.push('/m/mobile/list?tab=push')}>
            Открыть inbox
          </Button>
        </div>

        {/* Quick Actions Preview */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-stone-800">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            {seedData.quickActions
              .filter(a => a.status === 'active')
              .sort((a, b) => b.priority - a.priority)
              .slice(0, 3)
              .map((action) => (
                <div key={action.id} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-stone-50 hover:bg-stone-100 cursor-pointer transition-colors">
                  <span className={`w-2 h-2 rounded-full ${
                    action.severity === 'critical' ? 'bg-red-500' :
                    action.severity === 'high' ? 'bg-orange-500' :
                    action.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="text-stone-700 truncate flex-1">{action.title}</span>
                </div>
              ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={() => router.push('/m/mobile/list?tab=actions')}>
            Все quick actions ({quickActionsActive})
          </Button>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-800">Последние уведомления</h3>
          <Button variant="ghost" size="sm" onClick={() => router.push('/m/mobile/list?tab=push')}>
            Все →
          </Button>
        </div>
        <div className="space-y-3">
          {seedData.pushMessages
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
                  msg.status === 'unread' ? 'bg-blue-50 hover:bg-blue-100' : 'bg-stone-50 hover:bg-stone-100'
                }`}
                onClick={() => router.push(msg.deepLink || '/m/mobile/list?tab=push')}
              >
                <div className={`p-2 rounded-lg ${
                  msg.topic === 'risk' ? 'bg-red-100' :
                  msg.topic === 'approvals' ? 'bg-emerald-100' :
                  msg.topic === 'messages' ? 'bg-purple-100' :
                  msg.topic === 'reports' ? 'bg-blue-100' : 'bg-stone-100'
                }`}>
                  <svg className={`w-4 h-4 ${
                    msg.topic === 'risk' ? 'text-red-600' :
                    msg.topic === 'approvals' ? 'text-emerald-600' :
                    msg.topic === 'messages' ? 'text-purple-600' :
                    msg.topic === 'reports' ? 'text-blue-600' : 'text-stone-600'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-stone-800 truncate">{msg.title}</span>
                    {msg.status === 'unread' && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-stone-500 truncate">{msg.body}</p>
                  <p className="text-xs text-stone-400 mt-1">
                    {new Date(msg.createdAt).toLocaleString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  msg.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                  msg.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  msg.priority === 'normal' ? 'bg-stone-100 text-stone-600' : 'bg-stone-100 text-stone-500'
                }`}>
                  {msg.topic}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
