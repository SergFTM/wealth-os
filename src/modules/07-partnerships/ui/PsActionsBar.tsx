"use client";

import { Button } from '@/components/ui/Button';

interface PsActionsBarProps {
  onCreatePartnership?: () => void;
  onAddOwner?: () => void;
  onAddInterest?: () => void;
  onCreateTransaction?: () => void;
  onCreateDistribution?: () => void;
  onAttachDoc?: () => void;
  onExport?: () => void;
}

export function PsActionsBar({
  onCreatePartnership, onAddOwner, onAddInterest,
  onCreateTransaction, onCreateDistribution, onAttachDoc, onExport
}: PsActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200/50">
      <Button variant="primary" onClick={onCreatePartnership}>
        <span className="mr-1">+</span> Партнерство
      </Button>
      <Button variant="secondary" onClick={onAddOwner}>
        <span className="mr-1">+</span> Owner
      </Button>
      <Button variant="secondary" onClick={onAddInterest}>
        <span className="mr-1">+</span> Доля
      </Button>
      <Button variant="secondary" onClick={onCreateTransaction}>
        <span className="mr-1">+</span> Транзакция
      </Button>
      <Button variant="secondary" onClick={onCreateDistribution}>
        <span className="mr-1">+</span> Распределение
      </Button>
      <div className="flex-1" />
      <Button variant="ghost" onClick={onAttachDoc}>
        <span className="mr-1">📎</span> Документ
      </Button>
      {onExport && (
        <Button variant="ghost" onClick={onExport}>
          <span className="mr-1">⬇</span> Экспорт
        </Button>
      )}
    </div>
  );
}
