"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import seedData from '@/modules/05-reporting/seed.json';

const tabs = [
  { id: 'packs', label: 'Пакеты' },
  { id: 'templates', label: 'Шаблоны' },
  { id: 'distribution', label: 'Рассылки' },
  { id: 'approvals', label: 'Согласования' },
  { id: 'archive', label: 'Архив' },
];

const statusLabels: Record<string, string> = {
  draft: 'Черновик',
  in_review: 'На согласовании',
  approved: 'Одобрен',
  published: 'Опубликован',
  archived: 'Архив',
  pending: 'Ожидает',
  rejected: 'Отклонено',
};

const statusMap: Record<string, 'ok' | 'warning' | 'critical' | 'pending'> = {
  draft: 'pending',
  in_review: 'warning',
  approved: 'ok',
  published: 'ok',
  archived: 'pending',
  pending: 'warning',
  rejected: 'critical',
};

export default function ReportingListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'packs';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  const packs = seedData.reportPacks.filter(p => 
    statusFilter === 'all' || p.status === statusFilter
  );
  
  const templates = seedData.reportTemplates;
  const distributions = seedData.distributionLists;
  const approvals = seedData.approvals;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Отчётные пакеты</h1>
        <Button variant="primary" onClick={() => router.push('/m/reporting')}>
          На дашборд
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === tab.id
                ? "border-emerald-500 text-emerald-700"
                : "border-transparent text-stone-500 hover:text-stone-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      {activeTab === 'packs' && (
        <div className="flex gap-2 flex-wrap">
          {['all', 'draft', 'in_review', 'approved', 'published'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                statusFilter === status
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              {status === 'all' ? 'Все' : statusLabels[status]}
            </button>
          ))}
        </div>
      )}

      {/* Packs Tab */}
      {activeTab === 'packs' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Название</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Клиент</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Шаблон</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Версия</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">As-of</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Владелец</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {packs.map(pack => {
                const template = templates.find(t => t.id === pack.templateId);
                return (
                  <tr
                    key={pack.id}
                    onClick={() => router.push(`/m/reporting/item/${pack.id}`)}
                    className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer"
                  >
                    <td className="py-3 px-4 font-medium text-stone-800">{pack.name}</td>
                    <td className="py-3 px-4 text-stone-600">{pack.clientId}</td>
                    <td className="py-3 px-4 text-stone-500">{template?.name}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={statusMap[pack.status]} size="sm" label={statusLabels[pack.status]} />
                    </td>
                    <td className="py-3 px-4 text-center text-stone-600">v{pack.currentVersion}</td>
                    <td className="py-3 px-4 text-center text-stone-600">
                      {new Date(pack.asOf).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-xs">{pack.owner.split('@')[0]}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">Открыть</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Шаблон</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Секций</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Аудитория</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Обновлён</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {templates.map(template => (
                <tr key={template.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-stone-800">{template.name}</p>
                    <p className="text-xs text-stone-500">{template.description}</p>
                  </td>
                  <td className="py-3 px-4 text-center text-stone-600">{template.defaultSections.length}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600">
                      {template.audience}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-stone-400 text-xs">
                    {new Date(template.updatedAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="secondary" size="sm">Использовать</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Distribution Tab */}
      {activeTab === 'distribution' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Название</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Аудитория</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Контакты</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Последнее использование</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {distributions.map(dist => (
                <tr key={dist.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="py-3 px-4 font-medium text-stone-800">{dist.name}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600">
                      {dist.audience}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-stone-600">{dist.contacts.length}</td>
                  <td className="py-3 px-4 text-right text-stone-400 text-xs">
                    {dist.lastUsedAt ? new Date(dist.lastUsedAt).toLocaleDateString('ru-RU') : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm">Редактировать</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approvals Tab */}
      {activeTab === 'approvals' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Пакет</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">От</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Согласующий</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Срок</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {approvals.map(approval => {
                const pack = packs.find(p => p.id === approval.packId);
                return (
                  <tr key={approval.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4 font-medium text-stone-800">{pack?.name || approval.packId}</td>
                    <td className="py-3 px-4 text-stone-600 text-xs">{approval.requesterId.split('@')[0]}</td>
                    <td className="py-3 px-4 text-stone-600 text-xs">{approval.approverId.split('@')[0]}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge
                        status={statusMap[approval.status] || 'pending'}
                        size="sm"
                        label={statusLabels[approval.status]}
                      />
                    </td>
                    <td className="py-3 px-4 text-center text-stone-600 text-xs">
                      {new Date(approval.dueAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {approval.status === 'pending' && (
                        <Button variant="primary" size="sm">Одобрить</Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Archive Tab */}
      {activeTab === 'archive' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
          <p className="text-stone-500">Архив версий находится в разработке</p>
        </div>
      )}
    </div>
  );
}
