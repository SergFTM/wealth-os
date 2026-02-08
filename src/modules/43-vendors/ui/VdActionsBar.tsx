"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';

interface VdActionsBarProps {
  onCreateVendor: () => void;
  onCreateContract?: () => void;
  onAddSla?: () => void;
  onCreateIncident?: () => void;
  onCreateScorecard?: () => void;
  onGenerateDemo?: () => void;
  onViewAll: () => void;
}

export function VdActionsBar({
  onCreateVendor,
  onCreateContract,
  onAddSla,
  onCreateIncident,
  onCreateScorecard,
  onGenerateDemo,
  onViewAll,
}: VdActionsBarProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={onCreateVendor}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Создать провайдера
        </Button>

        {onCreateContract && (
          <Button variant="secondary" onClick={onCreateContract}>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Создать контракт
          </Button>
        )}

        {onAddSla && (
          <Button variant="secondary" onClick={onAddSla}>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Добавить SLA
          </Button>
        )}

        {onCreateIncident && (
          <Button variant="secondary" onClick={onCreateIncident}>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Создать инцидент
          </Button>
        )}

        {onCreateScorecard && (
          <Button variant="ghost" onClick={onCreateScorecard}>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Scorecard
          </Button>
        )}

        <div className="flex-1" />

        {onGenerateDemo && (
          <Button variant="ghost" onClick={onGenerateDemo}>
            Demo
          </Button>
        )}

        <Button variant="ghost" onClick={onViewAll}>
          Все записи →
        </Button>
      </div>
    </div>
  );
}
