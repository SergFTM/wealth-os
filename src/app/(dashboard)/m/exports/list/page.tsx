'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Package,
  FileText,
  Play,
  Calendar,
  Share2,
  History,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { ExPacksTable, ExportPack } from '@/modules/37-exports/ui/ExPacksTable';
import { ExTemplatesTable, ExportTemplate } from '@/modules/37-exports/ui/ExTemplatesTable';
import { ExExportsTable, ExportRun } from '@/modules/37-exports/ui/ExExportsTable';
import { ExSharesTable, ExportShare } from '@/modules/37-exports/ui/ExSharesTable';
import { ExSchedulesTable, ExportSchedule } from '@/modules/37-exports/ui/ExSchedulesTable';

const TABS = [
  { id: 'packs', label: 'Пакеты', icon: Package },
  { id: 'templates', label: 'Шаблоны', icon: FileText },
  { id: 'exports', label: 'Выгрузки', icon: Play },
  { id: 'schedules', label: 'Расписания', icon: Calendar },
  { id: 'shares', label: 'Шаринг', icon: Share2 },
  { id: 'audit', label: 'Аудит', icon: History },
];

function ExportsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'packs');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [packs, setPacks] = useState<ExportPack[]>([]);
  const [templates, setTemplates] = useState<ExportTemplate[]>([]);
  const [exports, setExports] = useState<ExportRun[]>([]);
  const [shares, setShares] = useState<ExportShare[]>([]);
  const [schedules, setSchedules] = useState<ExportSchedule[]>([]);
  const [auditEvents, setAuditEvents] = useState<unknown[]>([]);

  const loadData = useCallback(async (tab: string) => {
    setLoading(true);
    try {
      switch (tab) {
        case 'packs': {
          const res = await fetch('/api/collections/exportPacks');
          if (res.ok) setPacks(await res.json());
          break;
        }
        case 'templates': {
          const res = await fetch('/api/collections/exportTemplates');
          if (res.ok) setTemplates(await res.json());
          break;
        }
        case 'exports': {
          const res = await fetch('/api/collections/exportRuns');
          if (res.ok) setExports(await res.json());
          break;
        }
        case 'shares': {
          const res = await fetch('/api/collections/exportShares');
          if (res.ok) setShares(await res.json());
          break;
        }
        case 'schedules': {
          const res = await fetch('/api/collections/exportSchedules');
          if (res.ok) setSchedules(await res.json());
          break;
        }
        case 'audit': {
          const res = await fetch('/api/collections/auditEvents');
          if (res.ok) {
            const data = await res.json();
            setAuditEvents(data.filter((e: { module?: string }) => e.module === 'exports').slice(0, 50));
          }
          break;
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, loadData]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/m/exports/list?tab=${tab}`);
  };

  // Pack handlers
  const handleOpenPack = (id: string) => router.push(`/m/exports/pack/${id}`);
  const handlePublishPack = async (id: string) => {
    await fetch(`/api/collections/exportPacks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'published' }),
    });
    loadData('packs');
  };
  const handleRunPackExport = (id: string) => router.push(`/m/exports/pack/${id}?action=run`);

  // Template handlers
  const handleOpenTemplate = (id: string) => router.push(`/m/exports/template/${id}`);
  const handleApplyTemplate = (id: string) => router.push(`/m/exports/list?tab=packs&action=create&template=${id}`);
  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Удалить шаблон?')) {
      await fetch(`/api/collections/exportTemplates/${id}`, { method: 'DELETE' });
      loadData('templates');
    }
  };

  // Export handlers
  const handleOpenExport = (id: string) => router.push(`/m/exports/export/${id}`);
  const handleRerunExport = async (id: string) => {
    const run = exports.find(e => e.id === id);
    if (run) {
      router.push(`/m/exports/pack/${run.packId}?action=run`);
    }
  };

  // Share handlers
  const handleOpenShare = (id: string) => router.push(`/m/exports/share/${id}`);
  const handleRevokeShare = async (id: string) => {
    if (confirm('Отозвать share?')) {
      await fetch(`/api/collections/exportShares/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'revoked', revokedAt: new Date().toISOString() }),
      });
      loadData('shares');
    }
  };
  const handleCopyShareLink = (id: string) => {
    const share = shares.find(s => s.id === id);
    if (share) {
      navigator.clipboard.writeText(`${window.location.origin}/m/exports/share/${id}`);
      alert('Ссылка скопирована');
    }
  };

  // Schedule handlers
  const handleOpenSchedule = (id: string) => console.log('Open schedule:', id);
  const handleRunScheduleNow = async (id: string) => {
    const schedule = schedules.find(s => s.id === id);
    if (schedule) {
      router.push(`/m/exports/list?tab=packs&action=create&template=${schedule.templateId}`);
    }
  };
  const handleToggleSchedulePause = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'paused' ? 'active' : 'paused';
    await fetch(`/api/collections/exportSchedules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    loadData('schedules');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Экспорты</h1>
          <p className="text-gray-500">Управление пакетами, шаблонами и выгрузками</p>
        </div>
        <button
          onClick={() => router.push(`/m/exports/list?tab=${activeTab}&action=create`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Создать
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Фильтры
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'packs' && (
        <ExPacksTable
          packs={packs.filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))}
          onOpen={handleOpenPack}
          onPublish={handlePublishPack}
          onRunExport={handleRunPackExport}
          loading={loading}
        />
      )}

      {activeTab === 'templates' && (
        <ExTemplatesTable
          templates={templates.filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()))}
          onOpen={handleOpenTemplate}
          onApply={handleApplyTemplate}
          onDelete={handleDeleteTemplate}
          loading={loading}
        />
      )}

      {activeTab === 'exports' && (
        <ExExportsTable
          exports={exports}
          onOpen={handleOpenExport}
          onRerun={handleRerunExport}
          loading={loading}
        />
      )}

      {activeTab === 'shares' && (
        <ExSharesTable
          shares={shares.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()))}
          onOpen={handleOpenShare}
          onRevoke={handleRevokeShare}
          onCopyLink={handleCopyShareLink}
          loading={loading}
        />
      )}

      {activeTab === 'schedules' && (
        <ExSchedulesTable
          schedules={schedules}
          onOpen={handleOpenSchedule}
          onRunNow={handleRunScheduleNow}
          onTogglePause={handleToggleSchedulePause}
          loading={loading}
        />
      )}

      {activeTab === 'audit' && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Загрузка...</div>
          ) : auditEvents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Нет событий аудита</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Время</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действие</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Объект</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Пользователь</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {auditEvents.map((event: unknown, idx: number) => {
                  const e = event as { createdAt?: string; action?: string; entityId?: string; userId?: string };
                  return (
                    <tr key={idx} className="hover:bg-white/50">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {e.createdAt ? new Date(e.createdAt).toLocaleString('ru-RU') : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{e.action || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{e.entityId?.slice(0, 12) || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{e.userId || 'System'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExportsListPage() {
  return (
    <Suspense fallback={<div className="p-6">Загрузка...</div>}>
      <ExportsListContent />
    </Suspense>
  );
}
