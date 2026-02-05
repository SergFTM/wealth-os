'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, HelpCircle, X } from 'lucide-react';
import { ExKpiStrip } from '@/modules/37-exports/ui/ExKpiStrip';
import { ExActionsBar } from '@/modules/37-exports/ui/ExActionsBar';
import { ExPacksTable, ExportPack } from '@/modules/37-exports/ui/ExPacksTable';

export default function ExportsDashboardPage() {
  const router = useRouter();
  const [packs, setPacks] = useState<ExportPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [stats, setStats] = useState({
    packsCreated30d: 0,
    exportsRun7d: 0,
    filesGenerated: 0,
    sharesActive: 0,
    clientSafePacks: 0,
    pendingApprovals: 0,
    schedulesActive: 0,
    lineageMissing: 0,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/collections/exportPacks');
      if (res.ok) {
        const data = await res.json();
        setPacks(data.slice(0, 10));

        // Calculate stats
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        setStats({
          packsCreated30d: data.filter((p: ExportPack) => new Date(p.createdAt) >= thirtyDaysAgo).length,
          exportsRun7d: Math.floor(Math.random() * 20) + 5,
          filesGenerated: Math.floor(Math.random() * 100) + 50,
          sharesActive: data.filter((p: ExportPack) => p.status === 'published').length,
          clientSafePacks: data.filter((p: ExportPack) => p.clientSafe).length,
          pendingApprovals: data.filter((p: ExportPack) => p.status === 'draft').length,
          schedulesActive: Math.floor(Math.random() * 10) + 3,
          lineageMissing: Math.floor(Math.random() * 5),
        });
      }
    } catch (err) {
      console.error('Failed to load packs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreatePack = () => {
    router.push('/m/exports/list?tab=packs&action=create');
  };

  const handleRunExport = () => {
    router.push('/m/exports/list?tab=exports&action=run');
  };

  const handleCreateTemplate = () => {
    router.push('/m/exports/list?tab=templates&action=create');
  };

  const handleCreateShare = () => {
    router.push('/m/exports/list?tab=shares&action=create');
  };

  const handleGenerateDemo = async () => {
    setGenerating(true);
    try {
      // Generate demo packs
      const packTypes = ['audit', 'tax', 'bank', 'ops'];
      const statuses = ['draft', 'published', 'published', 'archived'];

      for (let i = 0; i < 5; i++) {
        const pack = {
          id: `pack-demo-${Date.now()}-${i}`,
          clientId: 'demo-client',
          name: `Demo Export Pack ${i + 1}`,
          packType: packTypes[i % packTypes.length],
          scopeType: 'client',
          asOf: new Date().toISOString().split('T')[0],
          clientSafe: Math.random() > 0.5,
          status: statuses[i % statuses.length],
          sectionsJson: [
            { sectionId: 'gl_journal', enabled: true, label: 'GL Journal', format: 'csv' },
            { sectionId: 'net_worth', enabled: true, label: 'Net Worth Snapshot', format: 'csv' },
            { sectionId: 'positions', enabled: i % 2 === 0, label: 'Positions', format: 'csv' },
            { sectionId: 'private_capital', enabled: i % 3 === 0, label: 'Private Capital', format: 'csv' },
            { sectionId: 'payments', enabled: true, label: 'Payments Summary', format: 'csv' },
            { sectionId: 'documents', enabled: true, label: 'Documents Index', format: 'csv' },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await fetch('/api/collections/exportPacks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pack),
        });
      }

      await loadData();
    } catch (err) {
      console.error('Failed to generate demo data:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenPack = (id: string) => {
    router.push(`/m/exports/pack/${id}`);
  };

  const handlePublishPack = async (id: string) => {
    try {
      await fetch(`/api/collections/exportPacks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published', updatedAt: new Date().toISOString() }),
      });
      await loadData();
    } catch (err) {
      console.error('Failed to publish pack:', err);
    }
  };

  const handleRunPackExport = (id: string) => {
    router.push(`/m/exports/pack/${id}?action=run`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Экспорты</h1>
          <p className="text-gray-500">Отчетность, экспорты и Audit Packs</p>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Важные дисклеймеры</p>
            <ul className="space-y-1">
              <li>
                <strong>Audit:</strong> Audit pack демонстрационный. Для production требуется контроль форматов и цифровых подписей.
              </li>
              <li>
                <strong>Tax:</strong> Данный отчет не является налоговой консультацией. Обратитесь к лицензированному налоговому консультанту.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <ExKpiStrip stats={stats} />

      {/* Actions Bar */}
      <ExActionsBar
        onCreatePack={handleCreatePack}
        onRunExport={handleRunExport}
        onCreateTemplate={handleCreateTemplate}
        onCreateShare={handleCreateShare}
        onGenerateDemo={handleGenerateDemo}
        loading={generating}
      />

      {/* Recent Packs Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Последние пакеты</h2>
          <button
            onClick={() => router.push('/m/exports/list?tab=packs')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Смотреть все →
          </button>
        </div>
        <ExPacksTable
          packs={packs}
          onOpen={handleOpenPack}
          onPublish={handlePublishPack}
          onRunExport={handleRunPackExport}
          loading={loading}
        />
      </div>

      {/* Help Panel */}
      {showHelp && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Справка</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="prose prose-sm">
              <h3>Что такое Export Pack?</h3>
              <p>
                Export Pack — это структурированный пакет данных для внешних получателей:
                аудиторов, банков, налоговых консультантов или членов семьи.
              </p>

              <h4>Типы пакетов</h4>
              <ul>
                <li><strong>Audit Pack</strong> — для внешнего аудита</li>
                <li><strong>Tax Advisor Pack</strong> — для налогового консультанта</li>
                <li><strong>Bank KYC Pack</strong> — для банка (KYC/AML)</li>
                <li><strong>Operations Pack</strong> — для операционного учета</li>
              </ul>

              <h4>Data Lineage</h4>
              <p>
                Lineage отслеживает происхождение данных: источники, дату актуальности,
                коннекторы и оценку качества (DQ Score).
              </p>

              <h4>Client-Safe режим</h4>
              <p>
                Для внешних получателей данные маскируются: номера счетов скрыты,
                внутренние заметки исключены.
              </p>

              <h4>Форматы файлов</h4>
              <ul>
                <li><strong>CSV</strong> — табличные данные</li>
                <li><strong>PDF</strong> — титульная страница и дисклеймеры</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
