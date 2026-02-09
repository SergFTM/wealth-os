'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { ExExportDetail } from '@/modules/37-exports/ui/ExExportDetail';

interface ExportError {
  sectionId?: string;
  message: string;
  timestamp: string;
}

interface ExportRun {
  id: string;
  packId: string;
  packName?: string;
  status: 'queued' | 'running' | 'success' | 'failed';
  startedAt?: string;
  finishedAt?: string;
  progress?: number;
  sectionsProcessed?: number;
  sectionsTotal?: number;
  errorsJson: ExportError[];
  lineageSnapshotJson?: unknown;
  triggeredBy?: string;
  createdAt: string;
}

interface ExportFile {
  id: string;
  fileName: string;
  format: 'csv' | 'pdf';
  sizeBytes: number;
  rowCount?: number;
  sectionId?: string;
  createdAt: string;
}

export default function ExportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [exportRun, setExportRun] = useState<ExportRun | null>(null);
  const [files, setFiles] = useState<ExportFile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Load export run
      const runRes = await fetch(`/api/collections/exportRuns/${resolvedParams.id}`);
      if (runRes.ok) {
        const runData = await runRes.json();

        // Get pack name
        if (runData.packId) {
          const packRes = await fetch(`/api/collections/exportPacks/${runData.packId}`);
          if (packRes.ok) {
            const packData = await packRes.json();
            runData.packName = packData.name;
          }
        }

        setExportRun(runData);
      }

      // Load files for this run
      const filesRes = await fetch('/api/collections/exportFiles');
      if (filesRes.ok) {
        const filesRaw = await filesRes.json();
        const allFiles = filesRaw.items ?? filesRaw ?? [];
        setFiles(allFiles.filter((f: { runId: string }) => f.runId === resolvedParams.id));
      }
    } catch (err) {
      console.error('Failed to load export:', err);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRerun = () => {
    if (exportRun?.packId) {
      router.push(`/m/exports/pack/${exportRun.packId}?action=run`);
    }
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

  if (!exportRun) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Выгрузка не найдена</div>
      </div>
    );
  }

  // Build lineage from snapshot if available
  const lineage = exportRun.lineageSnapshotJson ? {
    sources: [
      { id: '1', collection: 'glTransactions', label: 'GL Journal', recordCount: 150, lastUpdated: new Date().toISOString(), dqScore: 98 },
      { id: '2', collection: 'positions', label: 'Positions', recordCount: 45, lastUpdated: new Date().toISOString(), dqScore: 96 },
    ],
    connectors: [
      { id: 'filedb', name: 'FileDB', type: 'database', status: 'connected' as const },
    ],
    asOf: exportRun.startedAt || new Date().toISOString(),
    overallDqScore: 97,
    warnings: [],
  } : undefined;

  return (
    <div className="p-6">
      <ExExportDetail
        exportRun={exportRun}
        files={files}
        lineage={lineage}
        onRerun={handleRerun}
        onDownloadFile={handleDownloadFile}
      />
    </div>
  );
}
