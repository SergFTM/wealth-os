"use client";

import { DlStatusPill } from './DlStatusPill';
import { Button } from '@/components/ui/Button';

interface DealDoc {
  id: string;
  docName: string;
  docType?: string;
  linkedName?: string;
  status: 'missing' | 'requested' | 'received' | 'under_review' | 'approved' | 'rejected';
  required?: boolean;
  dueDate?: string;
  receivedDate?: string;
}

interface DlDocumentsPanelProps {
  documents: DealDoc[];
  onAttach?: (doc: DealDoc) => void;
  onView?: (doc: DealDoc) => void;
  onRequest?: (doc: DealDoc) => void;
  compact?: boolean;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  term_sheet: 'Term Sheet',
  subscription_agreement: 'Sub Agreement',
  side_letter: 'Side Letter',
  ppm: 'PPM',
  lpa: 'LPA',
  financial_statements: 'Financial Stmt',
  due_diligence: 'Due Diligence',
  legal_opinion: 'Legal Opinion',
  tax_opinion: 'Tax Opinion',
  k1: 'K-1',
  capital_call_notice: 'Call Notice',
  distribution_notice: 'Dist Notice',
  nav_statement: 'NAV Statement',
  audit_report: 'Audit Report',
  other: 'Другое',
};

export function DlDocumentsPanel({
  documents,
  onAttach,
  onView,
  onRequest,
  compact = false,
}: DlDocumentsPanelProps) {
  const groupedByStatus = {
    missing: documents.filter(d => d.status === 'missing'),
    requested: documents.filter(d => d.status === 'requested'),
    received: documents.filter(d => ['received', 'under_review', 'approved'].includes(d.status)),
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6 text-center">
        <div className="text-stone-400 mb-2">
          <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-stone-500">Нет документов</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Missing documents - highlighted */}
      {groupedByStatus.missing.length > 0 && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <h4 className="text-sm font-medium text-red-700 mb-3">
            Отсутствуют ({groupedByStatus.missing.length})
          </h4>
          <div className="space-y-2">
            {groupedByStatus.missing.map(doc => (
              <div key={doc.id} className="flex items-center justify-between bg-white rounded-lg p-2">
                <div>
                  <span className="font-medium text-stone-800">{doc.docName}</span>
                  {doc.required && <span className="ml-2 text-xs text-red-600">*обязательно</span>}
                </div>
                <div className="flex items-center gap-2">
                  {onRequest && (
                    <Button variant="ghost" size="sm" onClick={() => onRequest(doc)}>
                      Запросить
                    </Button>
                  )}
                  {onAttach && (
                    <Button variant="secondary" size="sm" onClick={() => onAttach(doc)}>
                      Прикрепить
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requested documents */}
      {groupedByStatus.requested.length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <h4 className="text-sm font-medium text-amber-700 mb-3">
            Запрошены ({groupedByStatus.requested.length})
          </h4>
          <div className="space-y-2">
            {groupedByStatus.requested.map(doc => (
              <div key={doc.id} className="flex items-center justify-between bg-white rounded-lg p-2">
                <div>
                  <span className="font-medium text-stone-800">{doc.docName}</span>
                  {doc.dueDate && (
                    <span className="ml-2 text-xs text-stone-500">
                      до {new Date(doc.dueDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
                {onAttach && (
                  <Button variant="secondary" size="sm" onClick={() => onAttach(doc)}>
                    Прикрепить
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Received documents */}
      {groupedByStatus.received.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h4 className="text-sm font-medium text-stone-700 mb-3">
            Получены ({groupedByStatus.received.length})
          </h4>
          <div className="space-y-2">
            {groupedByStatus.received.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-2 hover:bg-stone-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-medium text-stone-800">{doc.docName}</span>
                    <span className="ml-2 text-xs text-stone-500">
                      {DOC_TYPE_LABELS[doc.docType || 'other'] || doc.docType}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DlStatusPill status={doc.status} size="sm" />
                  {onView && (
                    <Button variant="ghost" size="sm" onClick={() => onView(doc)}>
                      Открыть
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DlDocumentsPanel;
