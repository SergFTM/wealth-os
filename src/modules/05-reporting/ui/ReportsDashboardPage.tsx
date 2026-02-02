"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReportsKpiStrip } from './ReportsKpiStrip';
import { ReportsTemplatesGallery } from './ReportsTemplatesGallery';
import { ReportsPacksTable } from './ReportsPacksTable';
import { ReportsActionsBar } from './ReportsActionsBar';
import { ReportsSourcesPanel } from './ReportsSourcesPanel';
import { ReportsPackBuilder } from './ReportsPackBuilder';
import { HelpPanel } from '@/components/ui/HelpPanel';

import seedData from '../seed.json';

export function ReportsDashboardPage() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Mock KPI data
  const kpis = [
    { id: 'active', label: 'Активные', value: seedData.reportPacks.filter(p => !['archived'].includes(p.status)).length, status: 'ok' as const, linkTo: '/m/reporting/list?status=active' },
    { id: 'draft', label: 'Черновики', value: seedData.reportPacks.filter(p => p.status === 'draft').length, status: 'info' as const, linkTo: '/m/reporting/list?status=draft' },
    { id: 'in_review', label: 'На согласовании', value: seedData.reportPacks.filter(p => p.status === 'in_review').length, status: 'warning' as const, linkTo: '/m/reporting/list?status=in_review' },
    { id: 'sla_risk', label: 'Просрочено SLA', value: 2, status: 'critical' as const, linkTo: '/m/reporting/list?status=sla_risk' },
    { id: 'published', label: 'Опубликовано', value: seedData.reportPacks.filter(p => p.status === 'published').length, status: 'ok' as const, linkTo: '/m/reporting/list?status=published' },
    { id: 'missing', label: 'Missing данные', value: seedData.reportSections.filter(s => s.status === 'missing').length, status: 'warning' as const, sources: 3, linkTo: '/m/reporting/list?filter=missing_sources' },
    { id: 'errors', label: 'Ошибки данных', value: 1, status: 'critical' as const, linkTo: '/m/reporting/list?filter=data_issues' },
    { id: 'templates', label: 'Шаблоны', value: seedData.reportTemplates.length, status: 'info' as const, linkTo: '/m/reporting/list?tab=templates' },
  ];

  const templates = seedData.reportTemplates.map(t => ({
    id: t.id,
    name: t.name,
    description: t.description,
    audience: t.audience,
    sectionsCount: t.defaultSections.length,
    isActive: t.isActive
  }));

  const recentPacks = seedData.reportPacks.slice(0, 8).map(p => {
    const template = seedData.reportTemplates.find(t => t.id === p.templateId);
    const sections = seedData.reportSections.filter(s => s.packId === p.id);
    return {
      id: p.id,
      name: p.name,
      clientId: p.clientId,
      templateId: p.templateId,
      templateName: template?.name,
      status: p.status as 'draft' | 'in_review' | 'approved' | 'published' | 'archived',
      asOf: p.asOf,
      owner: p.owner,
      missingSources: sections.filter(s => s.status !== 'ok').length,
      currentVersion: p.currentVersion,
      updatedAt: p.updatedAt
    };
  });

  const sourcesHealth = seedData.reportSections.filter(s => s.status !== 'ok').slice(0, 5).map(s => ({
    sectionId: s.id,
    sectionTitle: s.title,
    sourceRefs: s.sourceRefs || [],
    status: s.status as 'ok' | 'stale' | 'missing',
    asOf: s.asOf
  }));

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setShowBuilder(true);
  };

  const handleCreatePack = (config: { name: string; templateId: string }) => {
    console.log('Creating pack:', config);
    router.push(`/m/reporting/item/new`);
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1 space-y-6">
        {/* KPI Strip */}
        <ReportsKpiStrip kpis={kpis} />

        {/* Actions Bar */}
        <ReportsActionsBar
          onCreatePack={() => setShowBuilder(true)}
          onCreateTemplate={() => router.push('/m/reporting/list?tab=templates')}
        />

        {/* Templates Gallery */}
        <ReportsTemplatesGallery
          templates={templates}
          onSelect={handleSelectTemplate}
        />

        {/* Recent Packs Table */}
        <ReportsPacksTable
          packs={recentPacks}
          onAction={(action, id) => {
            console.log('Action:', action, id);
            if (action === 'view') router.push(`/m/reporting/item/${id}`);
          }}
        />

        {/* Sources Health Widget */}
        <ReportsSourcesPanel
          sources={sourcesHealth}
          compact
          onCreateAllTasks={() => console.log('Creating tasks for all missing')}
        />
      </div>

      {showHelp && (
        <div className="w-80 flex-shrink-0">
          <HelpPanel
            title="Отчётные пакеты"
            description="Модуль для сборки и публикации структурированных отчётов клиентам и комитетам."
            features={[
              'Report Pack — структурированный пакет для комитета или клиента',
              'Версионирование: Draft → Review → Approved → Published',
              'Client-Safe режим скрывает internal секции',
              'Согласования и audit trail'
            ]}
            scenarios={[
              'Ежемесячный обзор для инвестиционного комитета',
              'Квартальный отчёт клиенту',
              'Публикация client-safe версии'
            ]}
            dataSources={[
              'Net Worth модуль',
              'Performance модуль',
              'Risk модуль',
              'Внешние документы'
            ]}
          />
        </div>
      )}

      {/* Help toggle */}
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 flex items-center justify-center"
      >
        ?
      </button>

      {/* Pack Builder */}
      <ReportsPackBuilder
        open={showBuilder}
        onClose={() => setShowBuilder(false)}
        onSave={handleCreatePack}
        templates={seedData.reportTemplates}
        initialConfig={selectedTemplateId ? { templateId: selectedTemplateId } : undefined}
      />
    </div>
  );
}
