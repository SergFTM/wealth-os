"use client";

import { FileText, Download, Eye, Calendar, Link2, ExternalLink } from 'lucide-react';

interface TrustDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  size: string;
  linkedEntities?: { type: string; name: string }[];
}

interface TrDocumentsPanelProps {
  documents: TrustDocument[];
  onDocumentClick?: (doc: TrustDocument) => void;
  onDownload?: (doc: TrustDocument) => void;
  onLinkToVault?: () => void;
  trustId?: string;
}

const docTypeIcons: Record<string, { color: string; bg: string }> = {
  pdf: { color: 'text-red-600', bg: 'bg-red-50' },
  doc: { color: 'text-blue-600', bg: 'bg-blue-50' },
  docx: { color: 'text-blue-600', bg: 'bg-blue-50' },
  xls: { color: 'text-emerald-600', bg: 'bg-emerald-50' },
  xlsx: { color: 'text-emerald-600', bg: 'bg-emerald-50' },
  default: { color: 'text-stone-600', bg: 'bg-stone-100' },
};

const defaultDocs: TrustDocument[] = [
  {
    id: 'doc-trust-001',
    name: 'Trust Agreement - Original.pdf',
    type: 'pdf',
    uploadedAt: '2018-03-15T10:00:00Z',
    uploadedBy: 'First Delaware Trust Company',
    size: '2.4 MB',
    linkedEntities: [{ type: 'trust', name: 'Petrov Family Trust' }],
  },
  {
    id: 'doc-trust-002',
    name: 'First Amendment.pdf',
    type: 'pdf',
    uploadedAt: '2024-03-15T10:00:00Z',
    uploadedBy: 'First Delaware Trust Company',
    size: '856 KB',
  },
  {
    id: 'doc-trust-003',
    name: 'Beneficiary Designation Form.docx',
    type: 'docx',
    uploadedAt: '2025-01-10T10:00:00Z',
    uploadedBy: 'Maria Petrova',
    size: '124 KB',
  },
];

export function TrDocumentsPanel({
  documents = defaultDocs,
  onDocumentClick,
  onDownload,
  onLinkToVault,
}: TrDocumentsPanelProps) {
  const getDocTypeStyle = (type: string) => {
    return docTypeIcons[type.toLowerCase()] || docTypeIcons.default;
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200">
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <h3 className="font-semibold text-stone-800">Документы траста</h3>
        {onLinkToVault && (
          <button
            onClick={onLinkToVault}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Link2 className="w-4 h-4" />
            Связать с хранилищем
          </button>
        )}
      </div>

      <div className="divide-y divide-stone-100">
        {documents.map((doc) => {
          const typeStyle = getDocTypeStyle(doc.type);

          return (
            <div
              key={doc.id}
              className="p-4 hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${typeStyle.bg} flex items-center justify-center flex-shrink-0`}>
                  <FileText className={`w-5 h-5 ${typeStyle.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium text-stone-800 truncate cursor-pointer hover:text-blue-600"
                    onClick={() => onDocumentClick?.(doc)}
                  >
                    {doc.name}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(doc.uploadedAt).toLocaleDateString('ru-RU')}
                    </span>
                    <span>{doc.uploadedBy}</span>
                    <span>{doc.size}</span>
                  </div>
                  {doc.linkedEntities && doc.linkedEntities.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <Link2 className="w-3 h-3 text-stone-400" />
                      {doc.linkedEntities.map((entity, idx) => (
                        <span key={idx} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                          {entity.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDocumentClick?.(doc)}
                    className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                    title="Просмотр"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDownload?.(doc)}
                    className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                    title="Скачать"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {documents.length === 0 && (
        <div className="p-8 text-center">
          <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500">Нет документов</p>
          <button
            onClick={onLinkToVault}
            className="mt-3 flex items-center gap-1.5 px-4 py-2 mx-auto text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Открыть хранилище документов
          </button>
        </div>
      )}
    </div>
  );
}
