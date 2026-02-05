'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RpPackList } from '@/modules/23-reports/ui';
import { ReportPack, PackStatus, PackType } from '@/modules/23-reports/schema';

export default function ReportsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [packs, setPacks] = useState<ReportPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const statusFilter = searchParams.get('status') as PackStatus | null;
  const typeFilter = searchParams.get('packType') as PackType | null;
  const searchQuery = searchParams.get('search') || '';
  const tab = searchParams.get('tab') || 'packs';

  useEffect(() => {
    fetchPacks();
  }, [statusFilter, typeFilter, searchQuery]);

  const fetchPacks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (typeFilter) params.set('packType', typeFilter);
      if (searchQuery) params.set('search', searchQuery);
      params.set('sort', 'updatedAt');
      params.set('order', 'desc');

      const res = await fetch(`/api/reports/packs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPacks(data.items || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching packs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPack = (packId: string) => {
    router.push(`/m/reports/pack/${packId}`);
  };

  const handleCreatePack = () => {
    router.push('/m/reports/pack/new');
  };

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/m/reports/list?${params.toString()}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Report Packs</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} {total === 1 ? 'pack' : 'packs'} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/m/reports/templates')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Templates
          </button>
          <button
            onClick={handleCreatePack}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Pack
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {[
            { key: 'packs', label: 'Packs' },
            { key: 'shares', label: 'Shares' },
            { key: 'exports', label: 'Exports' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter('tab', t.key === 'packs' ? null : t.key)}
              className={`
                py-3 px-1 border-b-2 text-sm font-medium transition-colors
                ${tab === t.key
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      {tab === 'packs' && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Status:</label>
            <select
              value={statusFilter || ''}
              onChange={(e) => setFilter('status', e.target.value || null)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="locked">Locked</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Type:</label>
            <select
              value={typeFilter || ''}
              onChange={(e) => setFilter('packType', e.target.value || null)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All</option>
              <option value="executive">Executive</option>
              <option value="committee">Committee</option>
              <option value="client">Client</option>
              <option value="compliance">Compliance</option>
              <option value="regulatory">Regulatory</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className="flex-1">
            <div className="relative max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setFilter('search', e.target.value || null)}
                placeholder="Search packs..."
                className="w-full pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : tab === 'packs' ? (
          <div className="p-4">
            <RpPackList packs={packs} onViewPack={handleViewPack} />
          </div>
        ) : tab === 'shares' ? (
          <div className="p-8 text-center text-gray-500">Shares list coming soon...</div>
        ) : (
          <div className="p-8 text-center text-gray-500">Exports list coming soon...</div>
        )}
      </div>
    </div>
  );
}
