'use client';

import { Plus, FileText, Building2, Coins, CheckSquare, Sparkles } from 'lucide-react';

interface DlActionsBarProps {
  onCreateDeal: () => void;
  onAddTransaction: () => void;
  onAddCorporateAction: () => void;
  onAddCapitalEvent: () => void;
  onRequestApproval: () => void;
  onGenerateDemo?: () => void;
}

export function DlActionsBar({
  onCreateDeal,
  onAddTransaction,
  onAddCorporateAction,
  onAddCapitalEvent,
  onRequestApproval,
  onGenerateDemo
}: DlActionsBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onCreateDeal}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 transition-all shadow-sm"
      >
        <Plus className="h-4 w-4" />
        Создать сделку
      </button>

      <button
        onClick={onAddTransaction}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all"
      >
        <Coins className="h-4 w-4" />
        Добавить транзакцию
      </button>

      <button
        onClick={onAddCorporateAction}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all"
      >
        <Building2 className="h-4 w-4" />
        Корп. действие
      </button>

      <button
        onClick={onAddCapitalEvent}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all"
      >
        <FileText className="h-4 w-4" />
        Капитальное событие
      </button>

      <button
        onClick={onRequestApproval}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all"
      >
        <CheckSquare className="h-4 w-4" />
        Запросить согласование
      </button>

      {onGenerateDemo && (
        <button
          onClick={onGenerateDemo}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-amber-200 text-amber-700 rounded-lg font-medium hover:bg-amber-50 transition-all ml-auto"
        >
          <Sparkles className="h-4 w-4" />
          Demo данные
        </button>
      )}
    </div>
  );
}
