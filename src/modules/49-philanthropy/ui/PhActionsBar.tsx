"use client";

interface PhActionsBarProps {
  onCreateEntity?: () => void;
  onCreateProgram?: () => void;
  onCreateGrant?: () => void;
  onCreatePayout?: () => void;
  onCreateImpact?: () => void;
  onGenerateDemo?: () => void;
}

export function PhActionsBar({
  onCreateEntity,
  onCreateProgram,
  onCreateGrant,
  onCreatePayout,
  onCreateImpact,
  onGenerateDemo,
}: PhActionsBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onCreateEntity}
        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Создать структуру
      </button>

      <button
        onClick={onCreateProgram}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Создать программу
      </button>

      <button
        onClick={onCreateGrant}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Создать грант
      </button>

      <button
        onClick={onCreatePayout}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Запланировать выплату
      </button>

      <button
        onClick={onCreateImpact}
        className="inline-flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Impact report
      </button>

      <button
        onClick={onGenerateDemo}
        className="inline-flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        Demo
      </button>
    </div>
  );
}
