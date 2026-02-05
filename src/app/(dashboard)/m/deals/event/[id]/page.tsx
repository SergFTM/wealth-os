'use client';

import { useState, useEffect, use } from 'react';
import { DlCapitalEventDetail } from '@/modules/29-deals/ui/DlCapitalEventDetail';

export default function CapitalEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/collections/capitalEvents/${id}`);
      if (res.ok) {
        setEvent(await res.json());
      }
    } catch (error) {
      console.error('Error loading capital event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    try {
      const res = await fetch(`/api/collections/capitalEvents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'closed',
          updatedAt: new Date().toISOString()
        })
      });
      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error closing event:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-24 bg-slate-200 rounded-xl"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-slate-900">Капитальное событие не найдено</h2>
          <p className="text-slate-500 mt-2">Событие с ID {id} не существует</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <DlCapitalEventDetail
        event={event}
        onClose={handleClose}
      />
    </div>
  );
}
