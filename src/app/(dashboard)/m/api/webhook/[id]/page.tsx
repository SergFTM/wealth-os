'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ApiWebhookDetail } from '@/modules/24-api/ui/ApiWebhookDetail';

export default function ApiWebhookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [webhook, setWebhook] = useState<any>(null);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/api/webhooks/${id}`);
      const data = await res.json();
      setWebhook(data.webhook);
      setDeliveries(data.deliveries || []);
    } catch (error) {
      console.error('Error loading webhook:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    try {
      const res = await fetch(`/api/api/webhooks/${id}/test`, { method: 'POST' });
      const data = await res.json();
      alert(`Тест: ${data.result.success ? 'Успешно' : 'Ошибка'} (${data.result.statusCode})`);
      loadData();
    } catch (error) {
      console.error('Error testing webhook:', error);
    }
  };

  const handlePause = async () => {
    try {
      await fetch(`/api/api/webhooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paused' }),
      });
      loadData();
    } catch (error) {
      console.error('Error pausing webhook:', error);
    }
  };

  const handleResume = async () => {
    try {
      await fetch(`/api/api/webhooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      loadData();
    } catch (error) {
      console.error('Error resuming webhook:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!webhook) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Webhook не найден</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <a href="/m/api" className="hover:text-emerald-600">API и Webhooks</a>
        <span>/</span>
        <a href="/m/api/list?tab=webhooks" className="hover:text-emerald-600">Webhooks</a>
        <span>/</span>
        <span className="text-gray-900">{webhook.name}</span>
      </nav>

      {/* Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
        <ApiWebhookDetail
          webhook={webhook}
          recentDeliveries={deliveries}
          onTest={handleTest}
          onPause={handlePause}
          onResume={handleResume}
        />
      </div>
    </div>
  );
}
