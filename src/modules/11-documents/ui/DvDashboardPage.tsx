"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DvKpiStrip } from './DvKpiStrip';
import { DvUploadDropzone } from './DvUploadDropzone';
import { DvDocsTable } from './DvDocsTable';
import { DvEvidencePacksTable } from './DvEvidencePacksTable';
import { DvActionsBar } from './DvActionsBar';
import { DvDocMetaForm } from './DvDocMetaForm';
import { DvEvidencePackBuilder } from './DvEvidencePackBuilder';
import { HelpPanel } from '@/components/ui/HelpPanel';
import { X } from 'lucide-react';

// Import seed data
import documentsData from '@/db/data/documents.json';
import evidencePacksData from '@/db/data/evidencePacks.json';
import docSharesData from '@/db/data/docShares.json';

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
}

export function DvDashboardPage() {
  const router = useRouter();
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [showPackBuilder, setShowPackBuilder] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Parse data
  const documents = useMemo(() => documentsData as Document[], []);
  const packs = useMemo(() => evidencePacksData as EvidencePack[], []);
  const shares = useMemo(() => docSharesData as DocShare[], []);

  // Compute KPIs
  const kpis = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalDocs = documents.filter(d => d.status === 'active').length;
    const newDocs30d = documents.filter(d => 
      d.status === 'active' && new Date(d.createdAt) >= thirtyDaysAgo
    ).length;
    const unlinkedDocs = documents.filter(d => d.status === 'active' && d.linkedCount === 0).length;
    const linkedDocs = documents.filter(d => d.status === 'active' && d.linkedCount > 0).length;
    const missingRequired = 0; // Placeholder for policy-based check
    const evidencePacksCount = packs.length;
    const activeShares = shares.filter(s => s.status === 'active').length;
    const auditAlerts = 5; // Placeholder

    return [
      { id: 'totalDocs', label: 'Всего документов', value: totalDocs, status: 'ok' as const, linkTo: '/m/documents/list?tab=all' },
      { id: 'newDocs30d', label: 'Новые за 30д', value: newDocs30d, status: 'ok' as const, linkTo: '/m/documents/list?filter=created_30d' },
      { id: 'unlinkedDocs', label: 'Без связей', value: unlinkedDocs, status: unlinkedDocs > 5 ? 'warning' as const : 'ok' as const, linkTo: '/m/documents/list?tab=unlinked' },
      { id: 'linkedDocs', label: 'Связанные', value: linkedDocs, status: 'ok' as const, linkTo: '/m/documents/list?tab=linked' },
      { id: 'missingRequired', label: 'Нет обязательных', value: missingRequired, status: missingRequired > 0 ? 'critical' as const : 'ok' as const, linkTo: '/m/documents/list?filter=missing_required' },
      { id: 'evidencePacks', label: 'Пакеты', value: evidencePacksCount, status: 'ok' as const, linkTo: '/m/documents/list?tab=evidence' },
      { id: 'activeShares', label: 'Активные шары', value: activeShares, status: 'ok' as const, linkTo: '/m/documents/list?tab=shares' },
      { id: 'auditAlerts', label: 'Audit алерты', value: auditAlerts, status: auditAlerts > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/documents/list?filter=audit_recent' },
    ];
  }, [documents, packs, shares]);

  // Recent documents
  const recentDocs = useMemo(() => {
    return [...documents]
      .filter(d => d.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [documents]);

  // Recent packs
  const recentPacks = useMemo(() => {
    return [...packs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [packs]);

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(files);
    setShowUploadDrawer(true);
  };

  const handleSaveDocument = (data: { name: string; category: string; tags: string[]; description: string; confidentiality: string }) => {
    console.log('Save document:', data, uploadedFiles);
    // API call would go here
    setShowUploadDrawer(false);
    setUploadedFiles([]);
  };

  const handleCreatePack = (pack: { name: string; scopeType: string; documentIds: string[] }) => {
    console.log('Create pack:', pack);
    // API call would go here
    setShowPackBuilder(false);
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
    ],
    scenarios: [
      'Загрузить инвойс и привязать к bill',
      'Создать evidence pack для аудита',
      'Поделиться документом с advisor',
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
        onBulkTags={() => console.log('Bulk tags')}
        onExport={() => console.log('Export')}
        onCreateTask={() => console.log('Create task')}
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
              onOpen={(id) => console.log('Open pack:', id)}
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
                documents={documents.map(d => ({ id: d.id, name: d.name, category: d.category }))}
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
