'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { MbStatusPill } from './MbStatusPill';
import { getAvailableTopics, type PushSubscription, type PushTopic } from '../engine';

const labels = {
  title: { ru: 'Push подписки', en: 'Push Subscriptions', uk: 'Push підписки' },
  subscriptions: { ru: 'Подписки', en: 'Subscriptions', uk: 'Підписки' },
  device: { ru: 'Устройство', en: 'Device', uk: 'Пристрій' },
  topics: { ru: 'Топики', en: 'Topics', uk: 'Топіки' },
  status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
  pause: { ru: 'Пауза', en: 'Pause', uk: 'Пауза' },
  resume: { ru: 'Возобновить', en: 'Resume', uk: 'Відновити' },
  sendDemo: { ru: 'Отправить demo push', en: 'Send Demo Push', uk: 'Надіслати demo push' },
  noSubscriptions: { ru: 'Нет подписок', en: 'No subscriptions', uk: 'Немає підписок' },
  availableTopics: { ru: 'Доступные топики', en: 'Available Topics', uk: 'Доступні топіки' },
  staff: { ru: 'Staff', en: 'Staff', uk: 'Staff' },
  client: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' },
  both: { ru: 'Все', en: 'All', uk: 'Всі' },
  sending: { ru: 'Отправка...', en: 'Sending...', uk: 'Надсилання...' },
  sent: { ru: 'Отправлено!', en: 'Sent!', uk: 'Надіслано!' },
};

interface DeviceInfo {
  id: string;
  deviceName: string;
}

export function MbPushPanel() {
  const { locale } = useApp();
  const [subscriptions, setSubscriptions] = useState<PushSubscription[]>([]);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sentMessage, setSentMessage] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/collections/pushSubscriptions').then(r => r.json()),
      fetch('/api/collections/mobileDevices').then(r => r.json()),
    ]).then(([subs, devs]) => {
      setSubscriptions(subs || []);
      setDevices(devs || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSendDemo = async () => {
    setSending(true);
    setSentMessage(false);

    const now = new Date().toISOString();
    const demoMessage = {
      id: `msg-demo-${Date.now()}`,
      clientId: 'client-1',
      userId: 'user-1',
      topic: 'approvals',
      title: 'Demo Push Notification',
      body: 'Это демонстрационное push уведомление',
      deepLink: '/m/mobile',
      status: 'unread',
      priority: 'normal',
      createdAt: now,
    };

    await fetch('/api/collections/pushMessages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(demoMessage),
    }).catch(() => {});

    // Audit
    await fetch('/api/collections/auditEvents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'push_sent',
        module: 'mobile',
        entityType: 'pushMessage',
        entityId: demoMessage.id,
        action: 'send_demo_push',
        timestamp: now,
        userId: 'current-user',
        details: { title: demoMessage.title },
      }),
    }).catch(() => {});

    await new Promise(resolve => setTimeout(resolve, 1000));
    setSending(false);
    setSentMessage(true);
    setTimeout(() => setSentMessage(false), 3000);
  };

  const getDeviceName = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    return device?.deviceName || deviceId;
  };

  const topics = getAvailableTopics();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Send Demo Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSendDemo}
          disabled={sending}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-60"
        >
          {sending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {labels.sending[locale]}
            </>
          ) : sentMessage ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {labels.sent[locale]}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {labels.sendDemo[locale]}
            </>
          )}
        </button>
      </div>

      {/* Subscriptions List */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-semibold text-stone-800">{labels.subscriptions[locale]}</h3>
          <span className="text-sm text-stone-500">{subscriptions.filter(s => s.status === 'active').length} active</span>
        </div>
        
        {subscriptions.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-sm">
            {labels.noSubscriptions[locale]}
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {subscriptions.slice(0, 10).map((sub) => (
              <div key={sub.id} className="p-4 hover:bg-emerald-50/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-stone-800">{getDeviceName(sub.deviceId)}</span>
                      <MbStatusPill status={sub.status} />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sub.topicsJson.map((topic) => (
                        <span key={topic} className="px-2 py-0.5 bg-blue-50 rounded text-xs text-blue-700">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Topics Reference */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h3 className="font-semibold text-stone-800 mb-4">{labels.availableTopics[locale]}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {topics.map((topic) => (
            <div key={topic.value} className="p-3 rounded-xl bg-stone-50">
              <div className="font-medium text-sm text-stone-800">{topic.label[locale]}</div>
              <div className="text-xs text-stone-500 mt-1">
                {topic.audience === 'staff' ? labels.staff[locale] :
                 topic.audience === 'client' ? labels.client[locale] :
                 labels.both[locale]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
