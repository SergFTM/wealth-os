"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle, Download, Edit2, Save, MessageSquare, FileText, Shield } from 'lucide-react';
import { AiDisclaimerBanner } from './AiGuardrailsNotice';
import { AiSourcesCard } from './AiSourcesCard';

interface Draft {
  id: string;
  clientId: string;
  draftType: string;
  title: string;
  contentText: string;
  status: 'draft' | 'reviewed' | 'sent' | 'archived';
  targetModule: string | null;
  linkedRefsJson: string;
  createdBy: string;
  createdAt: string;
}

interface AiDraftDetailProps {
  draft: Draft;
  onBack?: () => void;
  onSave?: (content: string) => void;
  onMarkReviewed?: () => void;
  onSendToComms?: () => void;
  onExport?: () => void;
  onUpdate?: (updates: { status?: string; contentText?: string; title?: string }) => void;
}

const typeLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  message: { label: 'Сообщение', icon: MessageSquare },
  committee_pack: { label: 'Committee Pack', icon: FileText },
  policy_summary: { label: 'Policy Summary', icon: Shield },
  report_section: { label: 'Report Section', icon: FileText },
  client_update: { label: 'Client Update', icon: MessageSquare },
  email: { label: 'Email', icon: MessageSquare },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'text-amber-600 bg-amber-50' },
  reviewed: { label: 'Reviewed', color: 'text-blue-600 bg-blue-50' },
  sent: { label: 'Sent', color: 'text-emerald-600 bg-emerald-50' },
  archived: { label: 'Archived', color: 'text-stone-500 bg-stone-100' },
};

export function AiDraftDetail({
  draft,
  onBack,
  onSave,
  onMarkReviewed,
  onSendToComms,
  onExport,
  onUpdate,
}: AiDraftDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(draft.contentText);
  const [hasChanges, setHasChanges] = useState(false);

  const type = typeLabels[draft.draftType] || { label: draft.draftType, icon: FileText };
  const TypeIcon = type.icon;
  const status = statusLabels[draft.status] || statusLabels.draft;

  const linkedRefs = (() => {
    try {
      return JSON.parse(draft.linkedRefsJson || '[]');
    } catch {
      return [];
    }
  })();

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(newContent !== draft.contentText);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({ contentText: content });
    } else {
      onSave?.(content);
    }
    setHasChanges(false);
    setIsEditing(false);
  };

  const handleMarkReviewed = () => {
    if (onUpdate) {
      onUpdate({ status: 'reviewed' });
    } else {
      onMarkReviewed?.();
    }
  };

  const handleSendToComms = () => {
    if (onUpdate) {
      onUpdate({ status: 'sent' });
    } else {
      onSendToComms?.();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/m/ai/list?tab=drafts"
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-800">{draft.title}</h1>
              <span className={`px-2 py-0.5 text-xs font-medium rounded ${status.color}`}>
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-stone-500">
              <TypeIcon className="w-4 h-4" />
              <span>{type.label}</span>
              {draft.targetModule && (
                <>
                  <span>→</span>
                  <span className="capitalize">{draft.targetModule}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setContent(draft.contentText);
                  setHasChanges(false);
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  hasChanges
                    ? 'text-white bg-violet-600 hover:bg-violet-700'
                    : 'text-stone-400 bg-stone-100 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onExport}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Экспорт
              </button>

              {draft.status === 'draft' && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Редактировать
                  </button>
                  <button
                    onClick={handleMarkReviewed}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Reviewed
                  </button>
                </>
              )}

              {(draft.status === 'draft' || draft.status === 'reviewed') && (
                <button
                  onClick={handleSendToComms}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Отправить в Comms
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <AiDisclaimerBanner />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 bg-stone-50">
              <h2 className="font-semibold text-stone-800">Содержимое</h2>
            </div>
            <div className="p-6">
              {isEditing ? (
                <textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-96 p-4 text-sm text-stone-700 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              ) : (
                <div className="prose prose-stone max-w-none">
                  <div className="whitespace-pre-wrap text-stone-700 leading-relaxed">
                    {draft.contentText}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Linked refs */}
          {linkedRefs.length > 0 && (
            <AiSourcesCard
              sources={linkedRefs.map((ref: { type: string; id: string }) => ({
                module: ref.type,
                recordType: ref.type,
                recordId: ref.id,
                label: `${ref.type}/${ref.id}`,
              }))}
              title="Связанные объекты"
            />
          )}

          {/* Meta */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
            <div>
              <div className="text-xs text-stone-500 mb-1">Тип</div>
              <div className="text-sm text-stone-700">{type.label}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500 mb-1">Target Module</div>
              <div className="text-sm text-stone-700 capitalize">
                {draft.targetModule || '—'}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500 mb-1">Создан</div>
              <div className="text-sm text-stone-700">{formatDate(draft.createdAt)}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500 mb-1">Автор</div>
              <div className="text-sm text-stone-700">{draft.createdBy}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
