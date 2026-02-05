'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { ExPackDetail } from '@/modules/37-exports/ui/ExPackDetail';
import { executeExportRun } from '@/modules/37-exports/engine/exportRenderer';

interface PackSection {
  sectionId: string;
  enabled: boolean;
  label: string;
  filters?: Record<string, unknown>;
  columns?: string[];
  format?: 'csv' | 'pdf';
}

interface Pack {
  id: string;
  name: string;
  packType: 'audit' | 'tax' | 'bank' | 'ops';
  scopeType: string;
  scopeId?: string;
  asOf?: string;
  clientSafe: boolean;
  status: 'draft' | 'published' | 'archived';
  description?: string;
  sectionsJson: PackSection[];
  createdAt: string;
  updatedAt?: string;
  clientId?: string;
}

interface ExportRun {
  id: string;
  status: 'queued' | 'running' | 'success' | 'failed';
  startedAt: string;
  finishedAt?: string;
  filesCount: number;
}

interface ExportFile {
  id: string;
  fileName: string;
  format: 'csv' | 'pdf';
  sizeBytes: number;
  rowCount?: number;
  createdAt: string;
}

export default function PackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [pack, setPack] = useState<Pack | null>(null);
  const [runs, setRuns] = useState<ExportRun[]>([]);
  const [files, setFiles] = useState<ExportFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Load pack
      const packRes = await fetch(`/api/collections/exportPacks/${resolvedParams.id}`);
      if (packRes.ok) {
        const packData = await packRes.json();
        setPack(packData);
      }

      // Load runs for this pack
      const runsRes = await fetch('/api/collections/exportRuns');
      if (runsRes.ok) {
        const allRuns = await runsRes.json();
        setRuns(allRuns.filter((r: { packId: string }) => r.packId === resolvedParams.id));
      }

      // Load files for this pack
      const filesRes = await fetch('/api/collections/exportFiles');
      if (filesRes.ok) {
        const allFiles = await filesRes.json();
        setFiles(allFiles.filter((f: { packId: string }) => f.packId === resolvedParams.id));
      }
    } catch (err) {
      console.error('Failed to load pack:', err);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRunExport = async () => {
    if (!pack) return;

    setExporting(true);
    try {
      // Execute export run
      const result = await executeExportRun({
        packId: pack.id,
        packName: pack.name,
        packType: pack.packType,
        clientId: pack.clientId || 'default',
        scopeType: pack.scopeType,
        scopeId: pack.scopeId,
        asOf: pack.asOf || new Date().toISOString(),
        clientSafe: pack.clientSafe,
        sections: pack.sectionsJson,
        generatePdf: true,
        triggeredBy: 'user',
      });

      // Save run record
      const runRecord = {
        id: result.runId,
        clientId: pack.clientId || 'default',
        packId: pack.id,
        status: result.status,
        startedAt: result.startedAt,
        finishedAt: result.finishedAt,
        filesCount: result.files.length,
        totalSizeBytes: result.summary.totalSizeBytes,
        errorsJson: result.errors,
        lineageSnapshotJson: result.lineage,
        createdAt: new Date().toISOString(),
      };

      await fetch('/api/collections/exportRuns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(runRecord),
      });

      // Save file records
      for (const file of result.files) {
        const fileRecord = {
          id: file.id,
          clientId: pack.clientId || 'default',
          runId: result.runId,
          packId: pack.id,
          sectionId: file.sectionId,
          fileName: file.fileName,
          format: file.format,
          sizeBytes: file.sizeBytes,
          rowCount: file.rowCount,
          contentPreview: file.content.slice(0, 500),
          isClientSafe: pack.clientSafe,
          createdAt: new Date().toISOString(),
        };

        await fetch('/api/collections/exportFiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fileRecord),
        });
      }

      // Update pack with last run
      await fetch(`/api/collections/exportPacks/${pack.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastRunId: result.runId,
          lastRunAt: result.finishedAt,
          updatedAt: new Date().toISOString(),
        }),
      });

      // Create audit event
      await fetch('/api/collections/auditEvents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `audit-${Date.now()}`,
          module: 'exports',
          action: 'export_run_completed',
          entityType: 'exportRun',
          entityId: result.runId,
          details: { packId: pack.id, filesCount: result.files.length },
          createdAt: new Date().toISOString(),
        }),
      });

      await loadData();
      alert('Экспорт выполнен успешно!');
    } catch (err) {
      console.error('Export failed:', err);
      alert('Ошибка при выполнении экспорта');
    } finally {
      setExporting(false);
    }
  };

  const handlePublish = async () => {
    if (!pack) return;

    try {
      await fetch(`/api/collections/exportPacks/${pack.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'published',
          approvalStatus: 'approved',
          approvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      await fetch('/api/collections/auditEvents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `audit-${Date.now()}`,
          module: 'exports',
          action: 'pack_published',
          entityType: 'exportPack',
          entityId: pack.id,
          createdAt: new Date().toISOString(),
        }),
      });

      await loadData();
    } catch (err) {
      console.error('Failed to publish:', err);
    }
  };

  const handleShare = () => {
    router.push(`/m/exports/list?tab=shares&action=create&pack=${resolvedParams.id}`);
  };

  const handleEdit = () => {
    router.push(`/m/exports/pack/${resolvedParams.id}/edit`);
  };

  const handleDownloadFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      // In a real app, this would download the actual file
      alert(`Скачивание файла: ${file.fileName}`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Пакет не найден</div>
      </div>
    );
  }

  // Build lineage data from runs
  const latestRun = runs.find(r => r.status === 'success');
  const lineage = latestRun ? {
    sources: [
      { id: '1', collection: 'glTransactions', label: 'GL Journal', recordCount: 150, lastUpdated: new Date().toISOString(), dqScore: 98 },
      { id: '2', collection: 'positions', label: 'Positions', recordCount: 45, lastUpdated: new Date().toISOString(), dqScore: 96 },
      { id: '3', collection: 'documents', label: 'Documents', recordCount: 78, lastUpdated: new Date().toISOString(), dqScore: 100 },
    ],
    connectors: [
      { id: 'filedb', name: 'FileDB', type: 'database', status: 'connected' as const },
    ],
    asOf: pack.asOf || new Date().toISOString(),
    overallDqScore: 97,
    warnings: [],
  } : undefined;

  return (
    <div className="p-6">
      {exporting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span>Выполняется экспорт...</span>
            </div>
          </div>
        </div>
      )}

      <ExPackDetail
        pack={pack}
        runs={runs}
        files={files}
        lineage={lineage}
        onRunExport={handleRunExport}
        onPublish={handlePublish}
        onShare={handleShare}
        onEdit={handleEdit}
        onDownloadFile={handleDownloadFile}
      />
    </div>
  );
}
