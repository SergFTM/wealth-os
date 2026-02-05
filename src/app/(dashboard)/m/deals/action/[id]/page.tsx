'use client';

import { useState, useEffect, use } from 'react';
import { DlCorporateActionDetail } from '@/modules/29-deals/ui/DlCorporateActionDetail';

export default function CorporateActionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [action, setAction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/collections/corporateActions/${id}`);
      if (res.ok) {
        setAction(await res.json());
      }
    } catch (error) {
      console.error('Error loading corporate action:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      const res = await fetch(`/api/collections/corporateActions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'applied',
          updatedAt: new Date().toISOString()
        })
      });
      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error applying action:', error);
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

  if (!action) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-slate-900">Корпоративное действие не найдено</h2>
          <p className="text-slate-500 mt-2">Действие с ID {id} не существует</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <DlCorporateActionDetail
        action={action}
        onApply={handleApply}
      />
    </div>
  );
}
