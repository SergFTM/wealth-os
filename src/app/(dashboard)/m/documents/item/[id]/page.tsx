"use client";

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Settings, Link as LinkIcon, History, Shield, Share2, ClipboardList, X, Plus, Download } from 'lucide-react';
import { DvDocPreview } from '@/modules/11-documents/ui/DvDocPreview';
import { DvDocMetaForm } from '@/modules/11-documents/ui/DvDocMetaForm';
import { DvLinksPanel } from '@/modules/11-documents/ui/DvLinksPanel';
import { DvVersionsPanel } from '@/modules/11-documents/ui/DvVersionsPanel';
import { DvAccessPanel } from '@/modules/11-documents/ui/DvAccessPanel';
import { DvSharesPanel } from '@/modules/11-documents/ui/DvSharesPanel';
import { DvUploadDropzone } from '@/modules/11-documents/ui/DvUploadDropzone';

interface DocumentRecord {
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
  description?: string;
}

interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  filePath: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface DocumentLink {
  id: string;
  documentId: string;
  linkedType: string;
  linkedId: string;
  label: string | null;
  createdAt: string;
}

interface DocShare {
  id: string;
  name: string;
  audience: 'client' | 'advisor';
  status: 'active' | 'revoked' | 'expired';
  expiresAt: string | null;
  accessToken: string;
  createdAt: string;
  createdBy: string;
}

interface AuditEvent {
  id: string;
  ts: string;
  actorName: string;
  action: string;
  summary: string;
  severity?: string;
}

const TABS = [
  { key: 'preview', label: 'Просмотр', icon: FileText },
  { key: 'meta', label: 'Метаданные', icon: Settings },
  { key: 'links', label: 'Связи', icon: LinkIcon },
  { key: 'versions', label: 'Версии', icon: History },
  { key: 'access', label: 'Доступы', icon: Shield },
  { key: 'shares', label: 'Шаринг', icon: Share2 },
  { key: 'audit', label: 'Аудит', icon: ClipboardList },
];

const actionColors: Record<string, string> = {
  create: 'bg-emerald-100 text-emerald-700',
  update: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-700',
  view: 'bg-stone-100 text-stone-700',
  share: 'bg-purple-100 text-purple-700',
  revoke: 'bg-orange-100 text-orange-700',
};

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('preview');
  const [doc, setDoc] = useState<DocumentRecord | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [links, setLinks] = useState<DocumentLink[]>([]);
  const [shares, setShares] = useState<DocShare[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadVersion, setShowUploadVersion] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const [showCreateShare, setShowCreateShare] = useState(false);

  const fetchDoc = useCallback(async () => {
    const res = await fetch(`/api/collections/documents/${id}`);
    if (res.ok) setDoc(await res.json());
  }, [id]);

  const fetchVersions = useCallback(async () => {
    const res = await fetch(`/api/collections/documentVersions?search=${id}`);
    if (res.ok) {
      const data = await res.json();
      setVersions((data.items || []).filter((v: DocumentVersion) => v.documentId === id));
    }
  }, [id]);

  const fetchLinks = useCallback(async () => {
    const res = await fetch(`/api/collections/documentLinks?search=${id}`);
    if (res.ok) {
      const data = await res.json();
      setLinks((data.items || []).filter((l: DocumentLink) => l.documentId === id));
    }
  }, [id]);

  const fetchShares = useCallback(async () => {
    const res = await fetch('/api/collections/docShares');
    if (res.ok) {
      const data = await res.json();
      setShares((data.items || []).filter((s: DocShare & { documentIds?: string[] }) =>
        s.documentIds?.includes(id)
      ));
    }
  }, [id]);

  const fetchAudit = useCallback(async () => {
    const res = await fetch(`/api/audit/${id}`);
    if (res.ok) {
      const data = await res.json();
      setAuditEvents(data.events || []);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDoc(), fetchVersions(), fetchLinks(), fetchShares(), fetchAudit()])
      .finally(() => setLoading(false));
  }, [fetchDoc, fetchVersions, fetchLinks, fetchShares, fetchAudit]);

  const handleDownload = async () => {
    if (!doc) return;
    await fetch('/api/collections/auditEvents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actorRole: 'admin',
        actorName: 'admin@wealth.os',
        action: 'view',
        collection: 'documents',
        recordId: doc.id,
        summary: `Downloaded document: ${doc.name}`,
        severity: 'info',
      }),
    });
    window.open(doc.filePath, '_blank');
    fetchAudit();
  };

  const handleMetaSave = async (data: { name: string; category: string; tags: string[]; description: string; confidentiality: string }) => {
    await fetch(`/api/collections/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    fetchDoc();
    fetchAudit();
  };

  const handleRemoveLink = async (linkId: string) => {
    await fetch(`/api/collections/documentLinks/${linkId}`, { method: 'DELETE' });
    fetchLinks();
    const newCount = Math.max(0, (doc?.linkedCount || 1) - 1);
    await fetch(`/api/collections/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkedCount: newCount }),
    });
    fetchDoc();
  };

  const handleAddLink = async (linkedType: string, linkedId: string, label: string) => {
    await fetch('/api/collections/documentLinks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId: id, linkedType, linkedId, label }),
    });
    await fetch(`/api/collections/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkedCount: (doc?.linkedCount || 0) + 1 }),
    });
    setShowAddLink(false);
    fetchLinks();
    fetchDoc();
  };

  const handleSetCurrentVersion = async (versionId: string) => {
    await fetch(`/api/collections/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentVersionId: versionId }),
    });
    fetchDoc();
  };

  const handleUploadNewVersion = async (files: File[]) => {
    if (files.length === 0 || !doc) return;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('name', doc.name);
    formData.append('category', doc.category);

    const maxVer = versions.reduce((m, v) => Math.max(m, v.versionNumber), 0);
    const newVer = await fetch('/api/collections/documentVersions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentId: id,
        versionNumber: maxVer + 1,
        filePath: doc.filePath,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'ops@wealth.os',
        checksum: '',
      }),
    }).then(r => r.json());

    await fetch(`/api/collections/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentVersionId: newVer.id }),
    });

    setShowUploadVersion(false);
    fetchDoc();
    fetchVersions();
    fetchAudit();
  };

  const handleRevokeShare = async (shareId: string) => {
    await fetch(`/api/collections/docShares/${shareId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'revoked', revokedAt: new Date().toISOString() }),
    });
    fetchShares();
  };

  const handleCreateShare = async (data: { name: string; audience: string; expiresAt: string }) => {
    await fetch('/api/collections/docShares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: doc?.clientId || 'client-001',
        name: data.name,
        audience: data.audience,
        status: 'active',
        expiresAt: data.expiresAt || null,
        documentIds: [id],
        evidencePackId: null,
        accessToken: `tok_${Math.random().toString(36).substring(2, 14)}`,
        watermark: false,
        createdBy: 'admin@wealth.os',
      }),
    });
    setShowCreateShare(false);
    fetchShares();
  };

  const handleUpdateAccess = async (settings: { allowAdvisor: boolean; clientSafe: boolean }) => {
    await fetch(`/api/collections/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confidentiality: settings.clientSafe ? 'client_safe' : 'internal' }),
    });
    fetchDoc();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="max-w-[1600px] mx-auto space-y-6">
        <button onClick={() => router.push('/m/documents/list')} className="flex items-center gap-2 text-stone-600 hover:text-stone-800">
          <ArrowLeft className="w-5 h-5" /> Назад к списку
        </button>
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 text-lg">Документ не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/m/documents/list')} className="p-2 hover:bg-stone-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-stone-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-stone-800 truncate">{doc.name}</h1>
          <p className="text-stone-500 text-sm">
            {doc.fileType.toUpperCase()} • {doc.category} • {doc.createdBy}
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
        >
          <Download className="w-4 h-4" /> Скачать
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-1 overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        {activeTab === 'preview' && (
          <DvDocPreview document={doc} onDownload={handleDownload} />
        )}

        {activeTab === 'meta' && (
          <DvDocMetaForm
            document={{
              id: doc.id,
              name: doc.name,
              category: doc.category,
              tags: doc.tags,
              description: doc.description,
              confidentiality: doc.confidentiality,
              clientId: doc.clientId,
            }}
            onSave={handleMetaSave}
          />
        )}

        {activeTab === 'links' && (
          <>
            <DvLinksPanel
              links={links}
              onAddLink={() => setShowAddLink(true)}
              onRemoveLink={handleRemoveLink}
              onNavigate={(type, lid) => {}}
            />
            {showAddLink && (
              <AddLinkForm
                onSave={handleAddLink}
                onCancel={() => setShowAddLink(false)}
              />
            )}
          </>
        )}

        {activeTab === 'versions' && (
          <>
            <DvVersionsPanel
              versions={versions}
              currentVersionId={doc.currentVersionId}
              onUploadNewVersion={() => setShowUploadVersion(true)}
              onSetCurrent={handleSetCurrentVersion}
              onDownload={(v) => window.open(v.filePath, '_blank')}
            />
            {showUploadVersion && (
              <div className="mt-4 p-4 border border-stone-200 rounded-lg bg-stone-50">
                <h4 className="text-sm font-semibold text-stone-700 mb-3">Загрузить новую версию</h4>
                <DvUploadDropzone onFilesSelected={handleUploadNewVersion} />
                <button
                  onClick={() => setShowUploadVersion(false)}
                  className="mt-2 text-sm text-stone-500 hover:text-stone-700"
                >
                  Отмена
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'access' && (
          <DvAccessPanel
            confidentiality={doc.confidentiality as 'internal' | 'client_safe'}
            linkedCount={doc.linkedCount}
            onUpdateAccess={handleUpdateAccess}
          />
        )}

        {activeTab === 'shares' && (
          <>
            <DvSharesPanel
              shares={shares.map(s => ({
                ...s,
                accessToken: s.accessToken || '',
              }))}
              onCreateShare={() => setShowCreateShare(true)}
              onRevokeShare={handleRevokeShare}
              onCopyLink={(share) => {
                navigator.clipboard.writeText(`${window.location.origin}/share/${share.id}`);
              }}
            />
            {showCreateShare && (
              <CreateShareForm
                onSave={handleCreateShare}
                onCancel={() => setShowCreateShare(false)}
              />
            )}
          </>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-stone-700">
              Журнал аудита ({auditEvents.length})
            </h3>
            {auditEvents.length === 0 ? (
              <p className="text-sm text-stone-500 text-center py-8">Нет событий аудита</p>
            ) : (
              <div className="space-y-2">
                {auditEvents.map(event => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-stone-200">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${actionColors[event.action] || 'bg-stone-100 text-stone-700'}`}>
                      {event.action}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-stone-800">{event.summary}</p>
                      <p className="text-xs text-stone-500">
                        {event.actorName} • {new Date(event.ts).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ----- Inline mini-forms ----- */

function AddLinkForm({ onSave, onCancel }: {
  onSave: (type: string, id: string, label: string) => void;
  onCancel: () => void;
}) {
  const [linkedType, setLinkedType] = useState('bill');
  const [linkedId, setLinkedId] = useState('');
  const [label, setLabel] = useState('');

  const types = [
    'bill', 'payment', 'checkRun', 'journalEntry', 'transaction',
    'fund', 'capitalCall', 'distribution', 'valuation',
    'partnership', 'agreement', 'kycCase', 'reportPack',
  ];

  return (
    <div className="mt-4 p-4 border border-emerald-200 rounded-lg bg-emerald-50/50">
      <h4 className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
        <Plus className="w-4 h-4" /> Добавить связь
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <select
          value={linkedType}
          onChange={(e) => setLinkedType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm"
        >
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          type="text"
          value={linkedId}
          onChange={(e) => setLinkedId(e.target.value)}
          placeholder="ID объекта"
          className="px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm"
        />
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Описание связи"
          className="px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => linkedId && onSave(linkedType, linkedId, label)}
          disabled={!linkedId}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-50"
        >
          Сохранить
        </button>
        <button onClick={onCancel} className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50">
          Отмена
        </button>
      </div>
    </div>
  );
}

function CreateShareForm({ onSave, onCancel }: {
  onSave: (data: { name: string; audience: string; expiresAt: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [audience, setAudience] = useState('advisor');
  const [expiresAt, setExpiresAt] = useState('');

  return (
    <div className="mt-4 p-4 border border-emerald-200 rounded-lg bg-emerald-50/50">
      <h4 className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
        <Share2 className="w-4 h-4" /> Создать ссылку для шаринга
      </h4>
      <div className="space-y-3 mb-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название ссылки"
          className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm"
        />
        <select
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm"
        >
          <option value="advisor">Advisor</option>
          <option value="client">Клиент</option>
        </select>
        <input
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => name && onSave({ name, audience, expiresAt })}
          disabled={!name}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-50"
        >
          Создать
        </button>
        <button onClick={onCancel} className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50">
          Отмена
        </button>
      </div>
    </div>
  );
}
