"use client";

import { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { DvDocsTable } from '@/modules/11-documents/ui/DvDocsTable';
import { DvEvidencePacksTable } from '@/modules/11-documents/ui/DvEvidencePacksTable';
import { DvActionsBar } from '@/modules/11-documents/ui/DvActionsBar';
import { DvDocMetaForm } from '@/modules/11-documents/ui/DvDocMetaForm';
import { DvUploadDropzone } from '@/modules/11-documents/ui/DvUploadDropzone';
import { DvEvidencePackBuilder } from '@/modules/11-documents/ui/DvEvidencePackBuilder';
import {
  ArrowLeft, Search, X, Share2, CheckCircle, XCircle, Clock,
  Users, Filter
} from 'lucide-react';

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
  clientId: string;
  name: string;
  audience: 'client' | 'advisor';
  status: 'active' | 'revoked' | 'expired';
  expiresAt: string | null;
  documentIds: string[];
  evidencePackId?: string | null;
  accessToken: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

const TABS = [
  { key: 'all', label: 'Все документы' },
  { key: 'linked', label: 'Связанные' },
  { key: 'unlinked', label: 'Несвязанные' },
  { key: 'evidence', label: 'Пакеты доказательств' },
  { key: 'shares', label: 'Шаринг' },
];

const CATEGORIES = [
  { value: '', label: 'Все категории' },
  { value: 'invoice', label: 'Инвойс' },
  { value: 'statement', label: 'Выписка' },
  { value: 'bank_statement', label: 'Банк. выписка' },
  { value: 'agreement', label: 'Соглашение' },
  { value: 'quarterly_report', label: 'Квартальный отчет' },
  { value: 'kyc', label: 'KYC' },
  { value: 'tax', label: 'Налоги' },
  { value: 'contract', label: 'Контракт' },
  { value: 'misc', label: 'Прочее' },
];

const shareStatusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  active: { label: 'Активный', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  revoked: { label: 'Отозван', color: 'bg-red-100 text-red-700', icon: XCircle },
  expired: { label: 'Истёк', color: 'bg-stone-100 text-stone-600', icon: Clock },
};

export default function DocumentsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [showPackBuilder, setShowPackBuilder] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { items: documents, refetch: refetchDocs } = useCollection<Document>('documents', {
    search: searchTerm || undefined,
  });
  const { items: packs, refetch: refetchPacks } = useCollection<EvidencePack>('evidencePacks');
  const { items: shares, refetch: refetchShares } = useCollection<DocShare>('docShares');

  const activeDocs = useMemo(() => documents.filter(d => d.status === 'active'), [documents]);

  const filteredDocs = useMemo(() => {
    let docs = activeDocs;
    if (categoryFilter) docs = docs.filter(d => d.category === categoryFilter);
    if (activeTab === 'linked') docs = docs.filter(d => d.linkedCount > 0);
    if (activeTab === 'unlinked') docs = docs.filter(d => d.linkedCount === 0);
    return docs;
  }, [activeDocs, categoryFilter, activeTab]);

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(files);
    setShowUploadDrawer(true);
  };

  const handleUploadSave = async (data: { name: string; category: string; tags: string[]; description: string; confidentiality: string }) => {
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

  const handleRevokeShare = async (id: string) => {
    await fetch(`/api/collections/docShares/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'revoked', revokedAt: new Date().toISOString(), revokedBy: 'admin@wealth.os' }),
    });
    refetchShares();
  };

  const handleLockPack = async (id: string) => {
    await fetch(`/api/collections/evidencePacks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'locked', lockedAt: new Date().toISOString(), lockedBy: 'admin@wealth.os' }),
    });
    refetchPacks();
  };

  const handleExport = useCallback(() => {
    const rows = [['Name', 'Category', 'Tags', 'Links', 'Owner', 'Created', 'Status']];
    filteredDocs.forEach(d => {
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
  }, [filteredDocs]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/m/documents')} className="p-2 hover:bg-stone-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-stone-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-stone-800">Документы — Список</h1>
        </div>
      </div>

      {/* Actions Bar */}
      <DvActionsBar
        onUpload={() => { setUploadedFiles([]); setShowUploadDrawer(true); }}
        onCreatePack={() => setShowPackBuilder(true)}
        onBulkTags={() => {}}
        onExport={handleExport}
        onCreateTask={() => {}}
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      {(activeTab === 'all' || activeTab === 'linked' || activeTab === 'unlinked') && (
        <div className="flex flex-wrap gap-3 items-center bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-stone-800 text-sm"
              placeholder="Поиск по имени..."
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-stone-800 text-sm"
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {(searchTerm || categoryFilter) && (
            <button
              onClick={() => { setSearchTerm(''); setCategoryFilter(''); }}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-stone-500 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
              Сбросить
            </button>
          )}
          <span className="text-sm text-stone-500 ml-auto">
            {filteredDocs.length} документов
          </span>
        </div>
      )}

      {/* Content */}
      {(activeTab === 'all' || activeTab === 'linked' || activeTab === 'unlinked') && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <DvDocsTable
            documents={filteredDocs}
            onOpen={(id) => router.push(`/m/documents/item/${id}`)}
            onEdit={(id) => router.push(`/m/documents/item/${id}`)}
            onDelete={async (id) => {
              await fetch(`/api/collections/documents/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'deleted' }),
              });
              refetchDocs();
            }}
            onLink={(id) => router.push(`/m/documents/item/${id}`)}
            onShare={(id) => router.push(`/m/documents/item/${id}`)}
          />
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <DvEvidencePacksTable
            packs={packs}
            onOpen={(id) => {}}
            onLock={handleLockPack}
            onShare={(id) => {}}
          />
        </div>
      )}

      {activeTab === 'shares' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          {shares.length === 0 ? (
            <div className="p-8 text-center">
              <Share2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">Нет активных ссылок</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200/50">
                    <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Название</th>
                    <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Аудитория</th>
                    <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Срок</th>
                    <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Документы</th>
                    <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">Статус</th>
                    <th className="text-right text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {shares.map(share => {
                    const cfg = shareStatusConfig[share.status] || shareStatusConfig.expired;
                    const StatusIcon = cfg.icon;
                    return (
                      <tr key={share.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-stone-800">{share.name}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-sm text-stone-600">
                            <Users className="w-3 h-3" />
                            {share.audience === 'client' ? 'Клиент' : 'Advisor'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-stone-600">
                          {share.expiresAt
                            ? new Date(share.expiresAt).toLocaleDateString('ru-RU')
                            : 'Без срока'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-100 text-sm text-stone-600">
                            {share.documentIds.length}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${cfg.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {share.status === 'active' && (
                            <button
                              onClick={() => handleRevokeShare(share.id)}
                              className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
                            >
                              Отозвать
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Upload Drawer */}
      {showUploadDrawer && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowUploadDrawer(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-stone-800">Загрузить документ</h2>
                <button onClick={() => setShowUploadDrawer(false)} className="p-1 hover:bg-stone-100 rounded">
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              {uploadedFiles.length === 0 && (
                <div className="mb-6">
                  <DvUploadDropzone onFilesSelected={handleFilesSelected} />
                </div>
              )}
              {uploadedFiles.length > 0 && (
                <>
                  <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-sm text-emerald-700">Файл: <strong>{uploadedFiles[0].name}</strong></p>
                  </div>
                  <DvDocMetaForm
                    document={{
                      name: uploadedFiles[0].name.replace(/\.[^/.]+$/, ''),
                      category: 'misc',
                      tags: [],
                      confidentiality: 'internal',
                    }}
                    onSave={handleUploadSave}
                    onCancel={() => setShowUploadDrawer(false)}
                    isNew
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Pack Builder Drawer */}
      {showPackBuilder && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowPackBuilder(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <DvEvidencePackBuilder
                documents={activeDocs.map(d => ({ id: d.id, name: d.name, category: d.category }))}
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
