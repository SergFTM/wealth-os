"use client";

import { useState, useEffect, use } from 'react';
import { FileText, Download, Shield, Clock, AlertTriangle } from 'lucide-react';

interface ShareRecord {
  id: string;
  name: string;
  audience: string;
  status: string;
  expiresAt: string | null;
  documentIds: string[];
  accessToken: string;
  createdAt: string;
}

interface DocumentRecord {
  id: string;
  name: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  category: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [share, setShare] = useState<ShareRecord | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);

  useEffect(() => {
    async function loadShare() {
      setLoading(true);
      try {
        const res = await fetch(`/api/collections/docShares/${id}`);
        if (!res.ok) {
          setError('Ссылка не найдена');
          return;
        }
        const shareData: ShareRecord = await res.json();
        setShare(shareData);

        if (shareData.status === 'revoked') {
          setError('Доступ был отозван');
          return;
        }
        if (shareData.status === 'expired' || (shareData.expiresAt && new Date(shareData.expiresAt) < new Date())) {
          setError('Срок действия ссылки истёк');
          return;
        }

        const docs: DocumentRecord[] = [];
        for (const docId of shareData.documentIds) {
          const docRes = await fetch(`/api/collections/documents/${docId}`);
          if (docRes.ok) docs.push(await docRes.json());
        }
        setDocuments(docs);
      } catch {
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    }
    loadShare();
  }, [id]);

  const handleDownload = async (doc: DocumentRecord) => {
    await fetch('/api/collections/auditEvents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actorRole: 'external',
        actorName: 'share-viewer',
        action: 'view',
        collection: 'documents',
        recordId: doc.id,
        summary: `Downloaded via share link: ${doc.name}`,
        severity: 'info',
      }),
    });
    window.open(doc.filePath, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/10 to-amber-50/10 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/10 to-amber-50/10 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-stone-800 mb-2">Доступ закрыт</h1>
          <p className="text-stone-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/10 to-amber-50/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-stone-800">{share?.name || 'Shared Documents'}</h1>
            <div className="flex items-center gap-3 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Безопасный доступ
              </span>
              {share?.expiresAt && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  до {new Date(share.expiresAt).toLocaleDateString('ru-RU')}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 bg-gradient-to-r from-emerald-50/50 to-amber-50/30">
            <h2 className="font-semibold text-stone-800">
              Документы ({documents.length})
            </h2>
          </div>

          {documents.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">Нет документов в этом шаринге</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center gap-4 px-6 py-4 hover:bg-emerald-50/30 transition-colors">
                  <FileText className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800">{doc.name}</p>
                    <p className="text-xs text-stone-500">
                      {doc.fileType.toUpperCase()} • {formatFileSize(doc.fileSize)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {['pdf', 'png', 'jpg', 'jpeg'].includes(doc.fileType.toLowerCase()) && (
                      <button
                        onClick={() => setPreviewDoc(previewDoc?.id === doc.id ? null : doc)}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-all"
                      >
                        Просмотр
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Скачать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Area */}
        {previewDoc && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-semibold text-stone-800">{previewDoc.name}</h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-sm text-stone-500 hover:text-stone-700"
              >
                Закрыть
              </button>
            </div>
            <div className="bg-stone-100 min-h-[400px]">
              {['png', 'jpg', 'jpeg'].includes(previewDoc.fileType.toLowerCase()) ? (
                <div className="p-4 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewDoc.filePath} alt={previewDoc.name} className="max-w-full max-h-[500px] object-contain rounded-lg" />
                </div>
              ) : previewDoc.fileType.toLowerCase() === 'pdf' ? (
                <iframe src={previewDoc.filePath} className="w-full h-[500px] border-0" title={previewDoc.name} />
              ) : null}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-stone-400">
          <p>Wealth OS — Безопасное хранилище документов</p>
        </div>
      </main>
    </div>
  );
}
