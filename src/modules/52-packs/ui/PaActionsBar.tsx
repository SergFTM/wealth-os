"use client";

interface PaActionsBarProps {
  onCreatePack?: () => void;
  onCreateTemplate?: () => void;
  onQuickPack?: () => void;
  onPublishShare?: () => void;
  onGenerateDemo?: () => void;
  showAudit?: () => void;
}

export function PaActionsBar({
  onCreatePack,
  onCreateTemplate,
  onQuickPack,
  onPublishShare,
  onGenerateDemo,
  showAudit,
}: PaActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onCreatePack && (
        <button
          onClick={onCreatePack}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium text-sm hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Создать пакет
        </button>
      )}

      {onCreateTemplate && (
        <button
          onClick={onCreateTemplate}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-50 transition-all"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Создать шаблон
        </button>
      )}

      {onQuickPack && (
        <button
          onClick={onQuickPack}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-50 transition-all"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Быстрый пакет
        </button>
      )}

      {onPublishShare && (
        <button
          onClick={onPublishShare}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-50 transition-all"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Опубликовать
        </button>
      )}

      <div className="flex-1" />

      {onGenerateDemo && (
        <button
          onClick={onGenerateDemo}
          className="inline-flex items-center px-3 py-2 rounded-lg text-stone-500 text-sm hover:bg-stone-100 transition-all"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          Демо
        </button>
      )}

      {showAudit && (
        <button
          onClick={showAudit}
          className="inline-flex items-center px-3 py-2 rounded-lg text-stone-500 text-sm hover:bg-stone-100 transition-all"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Аудит
        </button>
      )}
    </div>
  );
}

export function PaPackActionsBar({
  packStatus,
  onEdit,
  onRequestApproval,
  onPublishShare,
  onClose,
  onDelete,
}: {
  packStatus: string;
  onEdit?: () => void;
  onRequestApproval?: () => void;
  onPublishShare?: () => void;
  onClose?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {packStatus === 'draft' && onEdit && (
        <button onClick={onEdit} className="px-3 py-1.5 text-sm rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700">
          Редактировать
        </button>
      )}

      {packStatus === 'draft' && onRequestApproval && (
        <button onClick={onRequestApproval} className="px-3 py-1.5 text-sm rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800">
          Запросить одобрение
        </button>
      )}

      {(packStatus === 'approved' || packStatus === 'shared') && onPublishShare && (
        <button onClick={onPublishShare} className="px-3 py-1.5 text-sm rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800">
          Опубликовать ссылку
        </button>
      )}

      {packStatus === 'shared' && onClose && (
        <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700">
          Закрыть пакет
        </button>
      )}

      {packStatus === 'draft' && onDelete && (
        <button onClick={onDelete} className="px-3 py-1.5 text-sm rounded-lg text-red-600 hover:bg-red-50">
          Удалить
        </button>
      )}
    </div>
  );
}
