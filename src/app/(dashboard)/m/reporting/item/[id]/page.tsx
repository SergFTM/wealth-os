"use client";

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ReportsSectionsPanel } from '@/modules/05-reporting/ui/ReportsSectionsPanel';
import { ReportsSourcesPanel } from '@/modules/05-reporting/ui/ReportsSourcesPanel';
import { ReportsApprovalsPanel } from '@/modules/05-reporting/ui/ReportsApprovalsPanel';
import { ReportsSharePanel } from '@/modules/05-reporting/ui/ReportsSharePanel';
import { ReportsVersionHistory } from '@/modules/05-reporting/ui/ReportsVersionHistory';
import { ReportsClientPreview } from '@/modules/05-reporting/ui/ReportsClientPreview';
import seedData from '@/modules/05-reporting/seed.json';

const tabs = [
  { id: 'overview', label: 'Обзор' },
  { id: 'sections', label: 'Конструктор' },
  { id: 'sources', label: 'Источники' },
  { id: 'approvals', label: 'Согласования' },
  { id: 'publish', label: 'Публикация' },
  { id: 'versions', label: 'Версии' },
  { id: 'documents', label: 'Приложения' },
  { id: 'audit', label: 'Аудит' },
];

const statusLabels: Record<string, string> = {
  draft: 'Черновик',
  in_review: 'На согласовании',
  approved: 'Одобрен',
  published: 'Опубликован',
};

const statusMap: Record<string, 'ok' | 'warning' | 'pending'> = {
  draft: 'pending',
  in_review: 'warning',
  approved: 'ok',
  published: 'ok',
};

export default function ReportingItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPreview, setShowPreview] = useState(false);

  const pack = seedData.reportPacks.find(p => p.id === id);
  const template = pack ? seedData.reportTemplates.find(t => t.id === pack.templateId) : null;
  const sections = seedData.reportSections.filter(s => s.packId === id);
  const versions = seedData.reportPackVersions.filter(v => v.packId === id);
  const approvals = seedData.approvals.filter(a => a.packId === id).map(a => ({
    ...a,
    status: a.status as 'pending' | 'approved' | 'rejected'
  }));
  const distributions = seedData.distributionLists;

  if (!pack) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-500 mb-4">Пакет не найден</p>
        <Button variant="secondary" onClick={() => router.push('/m/reporting')}>
          Назад
        </Button>
      </div>
    );
  }

  const sourcesData = sections.map(s => ({
    sectionId: s.id,
    sectionTitle: s.title,
    sourceRefs: s.sourceRefs || [],
    status: s.status as 'ok' | 'stale' | 'missing',
    asOf: s.asOf
  }));

  const sectionsData = sections.map(s => ({
    id: s.id,
    type: s.type,
    title: s.title,
    description: s.description || '',
    order: s.order,
    visibility: s.visibility as 'internal' | 'client',
    status: s.status as 'ok' | 'stale' | 'missing',
    disclaimers: s.disclaimers || []
  }));

  const distData = distributions.map(d => ({
    id: d.id,
    name: d.name,
    audience: d.audience,
    contactsCount: d.contacts.length
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push('/m/reporting')}
            className="text-sm text-stone-500 hover:text-stone-700 mb-2"
          >
            ← Назад к списку
          </button>
          <h1 className="text-2xl font-bold text-stone-800">{pack.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge
              status={statusMap[pack.status]}
              label={statusLabels[pack.status]}
            />
            <span className="text-sm text-stone-500">v{pack.currentVersion}</span>
            <span className="text-sm text-stone-500">
              As-of: {new Date(pack.asOf).toLocaleDateString('ru-RU')}
            </span>
            {template && (
              <span className="text-xs px-2 py-0.5 bg-stone-100 rounded text-stone-600">
                {template.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setShowPreview(true)}>
            Preview
          </Button>
          <Button variant="secondary">Экспорт PDF</Button>
          {pack.status === 'draft' && (
            <Button variant="primary">Отправить на согласование</Button>
          )}
          {pack.status === 'approved' && (
            <Button variant="primary">Опубликовать</Button>
          )}
        </div>
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {/* Pack Meta */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <h3 className="font-semibold text-stone-800 mb-4">Информация о пакете</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-stone-500">Клиент</p>
                  <p className="font-medium text-stone-800">{pack.clientId}</p>
                </div>
                <div>
                  <p className="text-stone-500">Область</p>
                  <p className="font-medium text-stone-800">{pack.scopeType}</p>
                </div>
                <div>
                  <p className="text-stone-500">Владелец</p>
                  <p className="font-medium text-stone-800">{pack.owner}</p>
                </div>
                <div>
                  <p className="text-stone-500">Секций</p>
                  <p className="font-medium text-stone-800">{sections.length}</p>
                </div>
                <div>
                  <p className="text-stone-500">Missing источники</p>
                  <p className={cn(
                    "font-medium",
                    sections.filter(s => s.status !== 'ok').length > 0 ? "text-amber-600" : "text-emerald-600"
                  )}>
                    {sections.filter(s => s.status !== 'ok').length}
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Опубликован клиенту</p>
                  <p className={cn(
                    "font-medium",
                    pack.isClientSafePublished ? "text-emerald-600" : "text-stone-600"
                  )}>
                    {pack.isClientSafePublished ? 'Да' : 'Нет'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Sections */}
            <ReportsSectionsPanel
              sections={sectionsData.slice(0, 3)}
              readOnly
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <ReportsSourcesPanel sources={sourcesData.filter(s => s.status !== 'ok')} compact />
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <h3 className="font-semibold text-stone-800 mb-3 text-sm">Быстрые действия</h3>
              <div className="space-y-2">
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  Сгенерировать пакет
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Просмотреть аудит
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sections Tab */}
      {activeTab === 'sections' && (
        <ReportsSectionsPanel
          sections={sectionsData}
          onEdit={id => console.log('Edit', id)}
          onDelete={id => console.log('Delete', id)}
          onMoveUp={id => console.log('MoveUp', id)}
          onMoveDown={id => console.log('MoveDown', id)}
          onAddSource={id => console.log('AddSource', id)}
          onCreateTask={id => console.log('CreateTask', id)}
          onAddSection={() => console.log('AddSection')}
          readOnly={pack.status !== 'draft'}
        />
      )}

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <ReportsSourcesPanel
          sources={sourcesData}
          onOpenSource={id => console.log('OpenSource', id)}
          onCreateTask={id => console.log('CreateTask', id)}
          onCreateAllTasks={() => console.log('CreateAllTasks')}
        />
      )}

      {/* Approvals Tab */}
      {activeTab === 'approvals' && (
        <ReportsApprovalsPanel
          approvals={approvals}
          packStatus={pack.status}
          onSubmitForApproval={() => console.log('Submit')}
          onApprove={id => console.log('Approve', id)}
          onReject={(id, comment) => console.log('Reject', id, comment)}
        />
      )}

      {/* Publish Tab */}
      {activeTab === 'publish' && (
        <ReportsSharePanel
          isClientSafePublished={pack.isClientSafePublished}
          distributionLists={distData}
          selectedListId={pack.distributionListId}
          onSelectList={id => console.log('Select', id)}
          onCreateList={() => console.log('CreateList')}
          onPublish={() => console.log('Publish')}
          onUnpublish={() => console.log('Unpublish')}
          onPreview={() => setShowPreview(true)}
          packStatus={pack.status}
        />
      )}

      {/* Versions Tab */}
      {activeTab === 'versions' && (
        <ReportsVersionHistory
          versions={versions}
          currentVersion={pack.currentVersion}
          onOpen={id => console.log('Open', id)}
          onCompare={(v1, v2) => console.log('Compare', v1, v2)}
        />
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
          <p className="text-stone-500 mb-4">Нет прикреплённых документов</p>
          <Button variant="secondary">Прикрепить документ</Button>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
          <p className="text-stone-500">Аудит в разработке</p>
        </div>
      )}

      {/* Client Preview Modal */}
      {showPreview && (
        <ReportsClientPreview
          packName={pack.name}
          asOf={pack.asOf}
          sections={sectionsData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
