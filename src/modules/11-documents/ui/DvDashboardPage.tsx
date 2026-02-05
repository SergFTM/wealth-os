"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { DvKpiStrip } from './DvKpiStrip';
import { DvUploadDropzone } from './DvUploadDropzone';
import { DvDocsTable } from './DvDocsTable';
import { DvEvidencePacksTable } from './DvEvidencePacksTable';
import { DvActionsBar } from './DvActionsBar';
import { DvDocMetaForm } from './DvDocMetaForm';
import { DvEvidencePackBuilder } from './DvEvidencePackBuilder';
import { HelpPanel } from '@/components/ui/HelpPanel';
import { X } from 'lucide-react';

interface Document {
  id: string;
  clientId: string;
  name: string;
  category: string;
  tags: string[];
  fileType: string;
  fileSize: number;
  filePath: string;
  currentVersionId: string | null;
  confidentiality: string;
  linkedCount: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  status: string;
}

interface EvidencePack {
  id: string;
  clientId: string;
  name: string;
  scopeType: string;
  scopeId?: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  purpose?: string | null;
  status: 'draft' | 'locked' | 'shared';
  documentIds: string[];
  createdAt: string;
  createdBy: string;
  lockedAt?: string | null;
  lockedBy?: string | null;
  updatedAt: string;
}

interface DocShare {
  id: string;
  status: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function DvDashboardPage() {
  const router = useRouter();
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [showPackBuilder, setShowPackBuilder] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { items: documents, refetch: refetchDocs } = useCollection<Document>('documents');
  const { items: packs, refetch: refetchPacks } = useCollection<EvidencePack>('evidencePacks');
  const { items: shares } = useCollection<DocShare>('docShares');

  const kpis = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const activeDocs = documents.filter(d => d.status === 'active');
    const totalDocs = activeDocs.length;
    const newDocs30d = activeDocs.filter(d => new Date(d.createdAt) >= thirtyDaysAgo).length;
    const unlinkedDocs = activeDocs.filter(d => d.linkedCount === 0).length;
    const linkedDocs = activeDocs.filter(d => d.linkedCount > 0).length;
    const evidencePacksCount = packs.length;
    const activeShares = shares.filter(s => s.status === 'active').length;

    return [
      { id: 'totalDocs', label: 'Всего документов', value: totalDocs, status: 'ok' as const, linkTo: '/m/documents/list?tab=all' },
      { id: 'newDocs30d', label: 'Новые за 30д', value: newDocs30d, status: 'ok' as const, linkTo: '/m/documents/list?filter=created_30d' },
      { id: 'unlinkedDocs', label: 'Без связей', value: unlinkedDocs, status: unlinkedDocs > 5 ? 'warning' as const : 'ok' as const, linkTo: '/m/documents/list?tab=unlinked' },
      { id: 'linkedDocs', label: 'Связанные', value: linkedDocs, status: 'ok' as const, linkTo: '/m/documents/list?tab=linked' },
      { id: 'missingRequired', label: 'Нет обязательных', value: 0, status: 'ok' as const, linkTo: '/m/documents/list?filter=missing_required' },
      { id: 'evidencePacks', label: 'Пакеты', value: evidencePacksCount, status: 'ok' as const, linkTo: '/m/documents/list?tab=evidence' },
      { id: 'activeShares', label: 'Активные шары', value: activeShares, status: 'ok' as const, linkTo: '/m/documents/list?tab=shares' },
      { id: 'auditAlerts', label: 'Audit алерты', value: 5, status: 'warning' as const, linkTo: '/m/documents/list?filter=audit_recent' },
    ];
  }, [documents, packs, shares]);

  const recentDocs = useMemo(() => {
    return [...documents]
      .filter(d => d.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [documents]);

  const recentPacks = useMemo(() => {
    return [...packs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [packs]);

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(files);
    setShowUploadDrawer(true);
  };

  const handleSaveDocument = async (data: { name: string; category: string; tags: string[]; description: string; confidentiality: string }) => {
    if (uploadedFiles.length === 0) return;
    const formData = new FormData();
    formData.append('file', uploadedFiles[0]);
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('tags', JSON.stringify(data.tags));
    formData.append('description', data.description);
    formData.append('confidentiality', data.confidentiality);

    await fetch('/api/upload', { method: 'POST', body: formData });
    setShowUploadDrawer(false);
    setUploadedFiles([]);
    refetchDocs();
  };

  const handleCreatePack = async (pack: { name: string; scopeType: string; periodStart: string; periodEnd: string; purpose: string; documentIds: string[] }) => {
    await fetch('/api/collections/evidencePacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: 'client-001',
        name: pack.name,
        scopeType: pack.scopeType,
        periodStart: pack.periodStart || null,
        periodEnd: pack.periodEnd || null,
        purpose: pack.purpose,
        status: 'draft',
        documentIds: pack.documentIds,
        createdBy: 'ops@wealth.os',
      }),
    });
    setShowPackBuilder(false);
    refetchPacks();
  };

  const handleExport = () => {
    const activeDocs = documents.filter(d => d.status === 'active');
    const rows = [['Name', 'Category', 'Tags', 'Links', 'Owner', 'Created', 'Status']];
    activeDocs.forEach(d => {
      rows.push([d.name, d.category, d.tags.join(';'), String(d.linkedCount), d.createdBy, d.createdAt, d.status]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documents.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const helpContent = {
    title: 'Document Vault',
    description: 'Централизованное хранилище документов с контролем версий, аудитом и безопасным шарингом.',
    features: [
      'Drag & drop загрузка PDF, изображений, Word',
      'Теги и категории для быстрого поиска',
      'Привязка к объектам: транзакции, фонды, KYC',
      'Версионирование без потери истории',
      'RBAC и client-safe доступ',
      'Evidence packs для аудита',
      'Безопасный шаринг для advisors и клиентов',
    ],
    scenarios: [
      'Загрузить инвойс и привязать к bill',
      'Создать evidence pack для аудита',
      'Поделиться документом с advisor',
      'Привязать quarterly report к valuation',
    ],
    dataSources: ['Ручная загрузка', 'Интеграции'],
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Документы</h1>
          <p className="text-stone-500 mt-1">Document Vault — хранилище и аудит документов</p>
        </div>
        <button
          onClick={() => router.push('/m/documents/list')}
          className="px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700"
        >
          Показать все →
        </button>
      </div>

      {/* KPI Strip */}
      <DvKpiStrip kpis={kpis} />

      {/* Actions Bar */}
      <DvActionsBar
        onUpload={() => setShowUploadDrawer(true)}
        onCreatePack={() => setShowPackBuilder(true)}
        onBulkTags={() => {}}
        onExport={handleExport}
        onCreateTask={() => {}}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Block + Recent Docs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Dropzone */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="font-semibold text-stone-800 mb-3">Загрузить документ</h3>
            <DvUploadDropzone onFilesSelected={handleFilesSelected} />
          </div>

          {/* Recent Documents */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30 flex justify-between items-center">
              <h3 className="font-semibold text-stone-800">Последние документы</h3>
              <button
                onClick={() => router.push('/m/documents/list?tab=all')}
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Все →
              </button>
            </div>
            <DvDocsTable
              documents={recentDocs}
              onOpen={(id) => router.push(`/m/documents/item/${id}`)}
              compact
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Evidence Packs Widget */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30 flex justify-between items-center">
              <h3 className="font-semibold text-stone-800">Evidence Packs</h3>
              <button
                onClick={() => router.push('/m/documents/list?tab=evidence')}
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Все →
              </button>
            </div>
            <DvEvidencePacksTable
              packs={recentPacks}
              onOpen={(id) => {}}
              compact
            />
          </div>

          {/* Help Panel */}
          <HelpPanel {...helpContent} />
        </div>
      </div>

      {/* Upload Metadata Drawer */}
      {showUploadDrawer && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowUploadDrawer(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-stone-800">Метаданные документа</h2>
                <button
                  onClick={() => setShowUploadDrawer(false)}
                  className="p-1 hover:bg-stone-100 rounded"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-700">
                    Файл: <strong>{uploadedFiles[0].name}</strong>
                  </p>
                </div>
              )}
              <DvDocMetaForm
                document={{
                  name: uploadedFiles[0]?.name.replace(/\.[^/.]+$/, '') || '',
                  category: 'misc',
                  tags: [],
                  confidentiality: 'internal',
                }}
                onSave={handleSaveDocument}
                onCancel={() => setShowUploadDrawer(false)}
                isNew
              />
            </div>
          </div>
        </>
      )}

      {/* Pack Builder Drawer */}
      {showPackBuilder && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowPackBuilder(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <DvEvidencePackBuilder
                documents={documents.filter(d => d.status === 'active').map(d => ({ id: d.id, name: d.name, category: d.category }))}
                onSave={handleCreatePack}
                onCancel={() => setShowPackBuilder(false)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
