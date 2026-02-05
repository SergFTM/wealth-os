'use client';

import React, { useState, useEffect, use } from 'react';
import { ApiEventDetail } from '@/modules/24-api/ui/ApiEventDetail';

export default function ApiEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [delivery, setDelivery] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [webhook, setWebhook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      // Load delivery
      const deliveriesRes = await fetch('/api/collections/webhookDeliveries');
      const deliveries = await deliveriesRes.json();
      const foundDelivery = deliveries.find((d: any) => d.id === id);

      if (foundDelivery) {
        setDelivery(foundDelivery);

        // Load event
        const eventsRes = await fetch('/api/collections/webhookEvents');
        const events = await eventsRes.json();
        const foundEvent = events.find((e: any) => e.id === foundDelivery.eventId);
        setEvent(foundEvent);

        // Load webhook
        const webhooksRes = await fetch('/api/api/webhooks');
        const webhooks = await webhooksRes.json();
        const foundWebhook = webhooks.find((w: any) => w.id === foundDelivery.webhookId);
        setWebhook(foundWebhook);
      }
    } catch (error) {
      console.error('Error loading delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    try {
      const res = await fetch(`/api/api/deliveries/${id}/retry`, { method: 'POST' });
      const data = await res.json();
      alert(`Повтор: ${data.result.success ? 'Успешно' : 'Ошибка'}`);
      loadData();
    } catch (error) {
      console.error('Error retrying delivery:', error);
    }
  };

  const handleMarkDead = async () => {
    if (!confirm('Пометить доставку как Dead Letter?')) return;

    try {
      await fetch(`/api/collections/webhookDeliveries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'dead',
          completedAt: new Date().toISOString(),
          errorMessage: 'Manually marked as dead letter',
        }),
      });
      loadData();
    } catch (error) {
      console.error('Error marking dead:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!delivery || !event || !webhook) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Доставка не найдена</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <a href="/m/api" className="hover:text-emerald-600">API и Webhooks</a>
        <span>/</span>
        <a href="/m/api/list?tab=events" className="hover:text-emerald-600">Доставки</a>
        <span>/</span>
        <span className="text-gray-900">{delivery.id.substring(0, 16)}...</span>
      </nav>

      {/* Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
        <ApiEventDetail
          delivery={delivery}
          event={event}
          webhook={webhook}
          onRetry={handleRetry}
          onMarkDead={handleMarkDead}
        />
      </div>
    </div>
  );
}
