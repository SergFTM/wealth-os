'use client';

import { FileText, Upload, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { DlStatusPill } from './DlStatusPill';

interface DealDocument {
  id: string;
  dealId: string;
  docType: string;
  docName?: string;
  status: string;
  docId?: string;
  uploadedAt?: string;
}

interface DlDocumentsPanelProps {
  documents: DealDocument[];
  onUpload?: (docId: string) => void;
  onMarkReceived?: (docId: string) => void;
  onView?: (docId: string) => void;
}

const docTypeLabels: Record<string, string> = {
  'term-sheet': 'Term Sheet',
  spa: 'SPA',
  memo: 'Меморандум',
  diligence: 'Due Diligence',
  'legal-opinion': 'Юр. заключение',
  valuation: 'Оценка',
  'closing-docs': 'Документы закрытия'
};

const docTypeIcons: Record<string, string> = {
  'term-sheet': '📄',
  spa: '📋',
  memo: '📝',
  diligence: '🔍',
  'legal-opinion': '⚖️',
  valuation: '💰',
  'closing-docs': '📁'
};

export function DlDocumentsPanel({ documents, onUpload, onMarkReceived, onView }: DlDocumentsPanelProps) {
  const sortedDocs = [...documents].sort((a, b) => {
    // Missing first, then by type
    if (a.status === 'missing' && b.status !== 'missing') return -1;
    if (a.status !== 'missing' && b.status === 'missing') return 1;
    return (docTypeLabels[a.docType] || a.docType).localeCompare(docTypeLabels[b.docType] || b.docType);
  });

  const missingCount = documents.filter(d => d.status === 'missing').length;
  const receivedCount = documents.filter(d => d.status === 'received' || d.status === 'reviewed' || d.status === 'approved').length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-500" />
          <span className="text-sm text-slate-600">{receivedCount} получено</span>
        </div>
        {missingCount > 0 && (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-600">{missingCount} отсутствует</span>
          </div>
        )}
      </div>

      {/* Document List */}
      <div className="space-y-2">
        {sortedDocs.map(doc => (
          <div
            key={doc.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              doc.status === 'missing'
                ? 'bg-red-50/50 border-red-100'
                : 'bg-white/60 border-slate-100 hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{docTypeIcons[doc.docType] || '📄'}</span>
              <div>
                <div className="text-sm font-medium text-slate-900">
                  {doc.docName || docTypeLabels[doc.docType] || doc.docType}
                </div>
                <div className="text-xs text-slate-500">
                  {docTypeLabels[doc.docType] || doc.docType}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DlStatusPill status={doc.status} size="sm" />
              {doc.status === 'missing' && onUpload && (
                <button
                  onClick={() => onUpload(doc.id)}
                  className="p-1.5 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                  title="Загрузить"
                >
                  <Upload className="h-4 w-4" />
                </button>
              )}
              {doc.status === 'draft' && onMarkReceived && (
                <button
                  onClick={() => onMarkReceived(doc.id)}
                  className="p-1.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  title="Отметить как полученный"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
              {doc.docId && onView && (
                <button
                  onClick={() => onView(doc.docId!)}
                  className="p-1.5 rounded hover:bg-slate-100 transition-colors"
                  title="Открыть"
                >
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="py-8 text-center text-sm text-slate-400">
          Нет документов
        </div>
      )}
    </div>
  );
}

// Compact version for lists
export function DlDocumentsList({ documents }: { documents: DealDocument[] }) {
  const missingCount = documents.filter(d => d.status === 'missing').length;
  const totalCount = documents.length;

  return (
    <div className="flex items-center gap-2">
      <FileText className="h-4 w-4 text-slate-400" />
      <span className="text-sm text-slate-600">{totalCount - missingCount}/{totalCount}</span>
      {missingCount > 0 && (
        <span className="text-xs text-red-500">({missingCount} нет)</span>
      )}
    </div>
  );
}
