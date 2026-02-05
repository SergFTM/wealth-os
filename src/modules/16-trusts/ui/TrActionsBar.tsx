"use client";

import { Plus, UserPlus, Calendar, Wallet, FileText, MoreHorizontal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TrActionsBarProps {
  onCreateTrust?: () => void;
  onAddBeneficiary?: () => void;
  onCreateEvent?: () => void;
  onCreateDistribution?: () => void;
  onAttachDocuments?: () => void;
}

export function TrActionsBar({
  onCreateTrust,
  onAddBeneficiary,
  onCreateEvent,
  onCreateDistribution,
  onAttachDocuments,
}: TrActionsBarProps) {
  const [showMore, setShowMore] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMore(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={onCreateTrust}
        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4" />
        Создать траст
      </button>

      <button
        onClick={onAddBeneficiary}
        className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-stone-50 text-stone-700 font-medium rounded-xl border border-stone-200 transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        Добавить бенефициара
      </button>

      <button
        onClick={onCreateEvent}
        className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-stone-50 text-stone-700 font-medium rounded-xl border border-stone-200 transition-colors"
      >
        <Calendar className="w-4 h-4" />
        Создать событие
      </button>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex items-center gap-2 px-3 py-2.5 bg-white hover:bg-stone-50 text-stone-600 font-medium rounded-xl border border-stone-200 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {showMore && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-stone-200 shadow-lg z-10 py-2">
            <button
              onClick={() => {
                onCreateDistribution?.();
                setShowMore(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <Wallet className="w-4 h-4 text-stone-500" />
              Создать распределение
            </button>
            <button
              onClick={() => {
                onAttachDocuments?.();
                setShowMore(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <FileText className="w-4 h-4 text-stone-500" />
              Прикрепить документы
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
