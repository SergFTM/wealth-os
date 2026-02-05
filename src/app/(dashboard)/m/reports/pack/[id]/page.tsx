'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { RpPackDetail } from '@/modules/23-reports/ui';
import { ReportPack } from '@/modules/23-reports/schema/reportPack';
import { ReportSection } from '@/modules/23-reports/schema/reportSection';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PackDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [pack, setPack] = useState<ReportPack | null>(null);
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if this is the "new" pack page
  const isNew = id === 'new';

  useEffect(() => {
    if (!isNew) {
      fetchPackData();
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  const fetchPackData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch pack
      const packRes = await fetch(`/api/reports/packs/${id}`);
      if (!packRes.ok) {
        if (packRes.status === 404) {
          setError('Pack not found');
          return;
        }
        throw new Error('Failed to fetch pack');
      }
      const packData = await packRes.json();
      setPack(packData);

      // Fetch sections
      const sectionsRes = await fetch(`/api/reports/sections?packId=${id}`);
      if (sectionsRes.ok) {
        const sectionsData = await sectionsRes.json();
        setSections(sectionsData.items || []);
      }
    } catch (err) {
      console.error('Error fetching pack:', err);
      setError('Failed to load pack');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    fetchPackData();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900 mb-2">{error}</h2>
          <button
            onClick={() => router.push('/m/reports/list')}
            className="text-emerald-600 hover:text-emerald-700"
          >
            Back to list
          </button>
        </div>
      </div>
    );
  }

  if (isNew) {
    return <NewPackForm />;
  }

  if (!pack) {
    return null;
  }

  return (
    <RpPackDetail
      pack={pack}
      sections={sections}
      onUpdate={handleUpdate}
    />
  );
}

// New Pack Form Component
function NewPackForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    packType: 'custom',
    periodType: 'quarterly',
    periodStart: '',
    periodEnd: '',
    periodLabel: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.periodStart || !formData.periodEnd || !formData.periodLabel) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/reports/packs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newPack = await res.json();
        router.push(`/m/reports/pack/${newPack.id}`);
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to create pack');
      }
    } catch (error) {
      console.error('Error creating pack:', error);
      alert('Failed to create pack');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push('/m/reports/list')}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to list
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Create Report Pack</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pack Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Q4 2024 Executive Report"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pack Type
            </label>
            <select
              value={formData.packType}
              onChange={(e) => setFormData({ ...formData, packType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="executive">Executive</option>
              <option value="committee">Committee</option>
              <option value="client">Client</option>
              <option value="compliance">Compliance</option>
              <option value="regulatory">Regulatory</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period Type
            </label>
            <select
              value={formData.periodType}
              onChange={(e) => setFormData({ ...formData, periodType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period Start <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.periodStart}
              onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period End <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.periodEnd}
              onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Period Label <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.periodLabel}
            onChange={(e) => setFormData({ ...formData, periodLabel: e.target.value })}
            placeholder="e.g., Q4 2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Optional description..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push('/m/reports/list')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Pack'}
          </button>
        </div>
      </form>
    </div>
  );
}
