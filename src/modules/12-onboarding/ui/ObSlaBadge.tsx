"use client";

interface ObSlaBadgeProps {
  dueAt: string | null;
  status: string;
}

export function ObSlaBadge({ dueAt, status }: ObSlaBadgeProps) {
  if (status === 'approved' || status === 'rejected') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-stone-100 text-stone-500">
        Done
      </span>
    );
  }

  if (!dueAt) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-stone-100 text-stone-500">
        No SLA
      </span>
    );
  }

  const now = new Date();
  const due = new Date(dueAt);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
        Просрочено {Math.abs(diffDays)}д
      </span>
    );
  }

  if (diffDays <= 3) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
        {diffDays}д осталось
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
      {diffDays}д осталось
    </span>
  );
}
