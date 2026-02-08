"use client";

interface CrActionsBarProps {
  onCreateBank?: () => void;
  onCreateFacility?: () => void;
  onCreateLoan?: () => void;
  onAddCollateral?: () => void;
  onAddCovenant?: () => void;
  onSchedulePayment?: () => void;
  onGenerateDemo?: () => void;
  onOpenAudit?: () => void;
}

export function CrActionsBar({
  onCreateBank,
  onCreateFacility,
  onCreateLoan,
  onAddCollateral,
  onAddCovenant,
  onSchedulePayment,
  onGenerateDemo,
  onOpenAudit,
}: CrActionsBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onCreateBank}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
      >
        <PlusIcon />
        Создать банк
      </button>

      <button
        onClick={onCreateFacility}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
      >
        <PlusIcon />
        Создать facility
      </button>

      <button
        onClick={onCreateLoan}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
      >
        <PlusIcon />
        Создать loan
      </button>

      <button
        onClick={onAddCollateral}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
      >
        <ShieldIcon />
        Добавить залог
      </button>

      <button
        onClick={onAddCovenant}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
      >
        <CheckIcon />
        Добавить ковенант
      </button>

      <button
        onClick={onSchedulePayment}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
      >
        <CalendarIcon />
        Платеж
      </button>

      <div className="flex-1" />

      <button
        onClick={onGenerateDemo}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
      >
        <DatabaseIcon />
        Demo
      </button>

      <button
        onClick={onOpenAudit}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
      >
        <ClockIcon />
        Audit
      </button>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
