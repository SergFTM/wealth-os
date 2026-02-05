"use client";

import { Paperclip, FileText, Download, ExternalLink, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Attachment {
  id: string;
  threadId: string;
  messageId: string | null;
  documentId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  clientVisible: boolean;
  linkType: 'attached' | 'referenced';
  createdAt: string;
}

interface CmAttachmentsPanelProps {
  attachments: Attachment[];
  isClientSafe?: boolean;
  currentUserId?: string;
  onAddAttachment?: () => void;
  onRemoveAttachment?: (attachment: Attachment) => void;
  onToggleVisibility?: (attachment: Attachment) => void;
  compact?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📑';
  return '📎';
};

export function CmAttachmentsPanel({
  attachments,
  isClientSafe = false,
  currentUserId,
  onAddAttachment,
  onRemoveAttachment,
  onToggleVisibility,
  compact = false,
}: CmAttachmentsPanelProps) {
  const visibleAttachments = attachments.filter(a => a.clientVisible);
  const internalAttachments = attachments.filter(a => !a.clientVisible);
  const attachedFiles = attachments.filter(a => a.linkType === 'attached');
  const referencedFiles = attachments.filter(a => a.linkType === 'referenced');

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-stone-100">
        <h3 className="text-sm font-semibold text-stone-800 flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-stone-500" />
          Вложения ({attachments.length})
        </h3>
        {onAddAttachment && (
          <button
            onClick={onAddAttachment}
            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Добавить вложение"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {attachments.length === 0 ? (
        <div className="p-4 text-center text-sm text-stone-500">
          Нет вложений
        </div>
      ) : (
        <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
          {/* Client-visible attachments */}
          {isClientSafe && visibleAttachments.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100">
                <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  Видны клиенту ({visibleAttachments.length})
                </span>
              </div>
              {visibleAttachments.map((attachment) => (
                <AttachmentRow
                  key={attachment.id}
                  attachment={attachment}
                  showVisibilityToggle={isClientSafe}
                  onRemove={onRemoveAttachment}
                  onToggleVisibility={onToggleVisibility}
                  compact={compact}
                />
              ))}
            </div>
          )}

          {/* Internal attachments */}
          {isClientSafe && internalAttachments.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-stone-50 border-b border-stone-100">
                <span className="text-xs font-medium text-stone-600 flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  Только для команды ({internalAttachments.length})
                </span>
              </div>
              {internalAttachments.map((attachment) => (
                <AttachmentRow
                  key={attachment.id}
                  attachment={attachment}
                  showVisibilityToggle={isClientSafe}
                  onRemove={onRemoveAttachment}
                  onToggleVisibility={onToggleVisibility}
                  compact={compact}
                />
              ))}
            </div>
          )}

          {/* All attachments (when not clientSafe) */}
          {!isClientSafe && (
            <>
              {attachedFiles.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-stone-50 border-b border-stone-100">
                    <span className="text-xs font-medium text-stone-600">
                      Прикрепленные ({attachedFiles.length})
                    </span>
                  </div>
                  {attachedFiles.map((attachment) => (
                    <AttachmentRow
                      key={attachment.id}
                      attachment={attachment}
                      showVisibilityToggle={false}
                      onRemove={onRemoveAttachment}
                      onToggleVisibility={onToggleVisibility}
                      compact={compact}
                    />
                  ))}
                </div>
              )}
              {referencedFiles.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-stone-50 border-b border-stone-100">
                    <span className="text-xs font-medium text-stone-600">
                      Связанные документы ({referencedFiles.length})
                    </span>
                  </div>
                  {referencedFiles.map((attachment) => (
                    <AttachmentRow
                      key={attachment.id}
                      attachment={attachment}
                      showVisibilityToggle={false}
                      onRemove={onRemoveAttachment}
                      onToggleVisibility={onToggleVisibility}
                      compact={compact}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function AttachmentRow({
  attachment,
  showVisibilityToggle,
  onRemove,
  onToggleVisibility,
  compact,
}: {
  attachment: Attachment;
  showVisibilityToggle: boolean;
  onRemove?: (a: Attachment) => void;
  onToggleVisibility?: (a: Attachment) => void;
  compact: boolean;
}) {
  const icon = getFileIcon(attachment.mimeType);

  return (
    <div className="flex items-center gap-3 px-4 py-2 hover:bg-stone-50 transition-colors group">
      {/* Icon */}
      <span className="text-lg flex-shrink-0">{icon}</span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-stone-800 truncate font-medium">
          {attachment.fileName}
        </div>
        {!compact && (
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>{formatFileSize(attachment.fileSize)}</span>
            {attachment.linkType === 'referenced' && (
              <span className="text-blue-500">Связанный</span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {showVisibilityToggle && (
          <button
            onClick={() => onToggleVisibility?.(attachment)}
            className="p-1 text-stone-400 hover:text-stone-600 rounded transition-colors"
            title={attachment.clientVisible ? 'Скрыть от клиента' : 'Показать клиенту'}
          >
            {attachment.clientVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        )}

        <Link
          href={`/m/documents/item/${attachment.documentId}`}
          className="p-1 text-stone-400 hover:text-blue-600 rounded transition-colors"
          title="Открыть в Document Vault"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          className="p-1 text-stone-400 hover:text-stone-600 rounded transition-colors"
          title="Скачать"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {onRemove && (
          <button
            onClick={() => onRemove(attachment)}
            className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
            title="Удалить"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
