"use client";

import React from 'react';
import { Plus, FileKey, FolderLock, XCircle, Sparkles } from 'lucide-react';

interface CsActionsBarProps {
  onCreateConsent: () => void;
  onCreateRequest: () => void;
  onCreateRoom: () => void;
  onRevokeAccess: () => void;
  onGenerateDemo?: () => void;
}

export function CsActionsBar({
  onCreateConsent,
  onCreateRequest,
  onCreateRoom,
  onRevokeAccess,
  onGenerateDemo,
}: CsActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200/50">
      <button
        onClick={onCreateConsent}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Создать согласие
      </button>

      <button
        onClick={onCreateRequest}
        className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium"
      >
        <FileKey className="w-4 h-4" />
        Запросить доступ
      </button>

      <button
        onClick={onCreateRoom}
        className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium"
      >
        <FolderLock className="w-4 h-4" />
        Data Room
      </button>

      <button
        onClick={onRevokeAccess}
        className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-sm font-medium"
      >
        <XCircle className="w-4 h-4" />
        Отозвать доступ
      </button>

      {onGenerateDemo && (
        <button
          onClick={onGenerateDemo}
          className="flex items-center gap-2 px-4 py-2 text-stone-500 hover:bg-stone-50 rounded-lg transition-colors text-sm ml-auto"
        >
          <Sparkles className="w-4 h-4" />
          Demo
        </button>
      )}
    </div>
  );
}
