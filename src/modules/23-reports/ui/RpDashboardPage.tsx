'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RpKpiStrip } from './RpKpiStrip';
import { RpPackList } from './RpPackList';
import { RpQuickActions } from './RpQuickActions';
import { RpRecentExports } from './RpRecentExports';
import { ReportPack } from '../schema/reportPack';
import { ReportTemplate } from '../schema/reportTemplate';

interface DashboardKpis {
  draftPacks: number;
  lockedPacks: number;
  publishedPacks: number;
  exports7d: number;
  activeShares: number;
  missingSources: number;
  clientSafePacks: number;
  libraryItems: number;
}

export function RpDashboardPage() {
  const router = useRouter();
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [recentPacks, setRecentPacks] = useState<ReportPack[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [kpiRes, packsRes, templatesRes] = await Promise.all([
        fetch('/api/reports/kpis'),
        fetch('/api/collections/reportPacks?limit=8&sort=updatedAt&order=desc'),
        fetch('/api/collections/reportTemplates?limit=6&isActive=true'),
      ]);

      if (kpiRes.ok) {
        setKpis(await kpiRes.json());
      }
      if (packsRes.ok) {
        const data = await packsRes.json();
        setRecentPacks(data.items || []);
      }
      if (templatesRes.ok) {
        const data = await templatesRes.json();
        setTemplates(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePack = () => {
    router.push('/m/reports/pack/new');
  };

  const handleFromTemplate = () => {
    router.push('/m/reports/templates');
  };

  const handleViewPack = (packId: string) => {
    router.push(`/m/reports/pack/${packId}`);
  };

  const handleUseTemplate = (templateId: string) => {
    router.push(`/m/reports/pack/new?templateId=${templateId}`);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Отчеты и пакеты</h1>
          <p className="text-sm text-gray-500 mt-1">
            Создание и управление отчетными пакетами, шаблонами и публикацией
          </p>
        </div>
        <RpQuickActions
          onCreatePack={handleCreatePack}
          onFromTemplate={handleFromTemplate}
        />
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 text-emerald-600 mt-0.5">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-emerald-800 font-medium">
              Пакеты отчетов формируются на основе источников данных
            </p>
            <p className="text-sm text-emerald-700 mt-1">
              Проверяйте актуальность данных (as of) и источники перед публикацией и распространением.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      {kpis && <RpKpiStrip kpis={kpis} />}

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Recent Packs */}
        <div className="col-span-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Последние пакеты</h2>
              <button
                onClick={() => router.push('/m/reports/list')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Все пакеты →
              </button>
            </div>
            <div className="p-4">
              <RpPackList
                packs={recentPacks}
                onViewPack={handleViewPack}
                compact
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-6">
          {/* Templates */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Шаблоны</h3>
              <button
                onClick={() => router.push('/m/reports/templates')}
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Все →
              </button>
            </div>
            <div className="p-3 space-y-2">
              {templates.slice(0, 4).map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleUseTemplate(template.id)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center justify-between group"
                >
                  <span className="text-gray-700 group-hover:text-gray-900">{template.name}</span>
                  <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100">
                    Использовать
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Exports */}
          <RpRecentExports />

          {/* Quick Links */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Быстрые ссылки</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/m/reports/list?status=draft')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Черновики
              </button>
              <button
                onClick={() => router.push('/m/reports/list?tab=shares')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Активные ссылки
              </button>
              <button
                onClick={() => router.push('/m/reports/list?tab=exports')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                История экспортов
              </button>
              <button
                onClick={() => router.push('/m/reports/list?tab=library')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Библиотека секций
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
