"use client";

interface CrStatusPillProps {
  status: 'active' | 'closed' | 'pending' | 'paid_off' | 'default' | 'ok' | 'at_risk' | 'breach' | 'scheduled' | 'paid' | 'late' | 'partial';
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Активный', className: 'bg-emerald-100 text-emerald-700' },
  closed: { label: 'Закрыт', className: 'bg-stone-100 text-stone-600' },
  pending: { label: 'Ожидает', className: 'bg-amber-100 text-amber-700' },
  paid_off: { label: 'Погашен', className: 'bg-blue-100 text-blue-700' },
  default: { label: 'Дефолт', className: 'bg-red-100 text-red-700' },
  ok: { label: 'OK', className: 'bg-emerald-100 text-emerald-700' },
  at_risk: { label: 'At Risk', className: 'bg-amber-100 text-amber-700' },
  breach: { label: 'Breach', className: 'bg-red-100 text-red-700' },
  scheduled: { label: 'Запланирован', className: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Оплачен', className: 'bg-emerald-100 text-emerald-700' },
  late: { label: 'Просрочен', className: 'bg-red-100 text-red-700' },
  partial: { label: 'Частично', className: 'bg-amber-100 text-amber-700' },
};

export function CrStatusPill({ status, size = 'sm' }: CrStatusPillProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-stone-100 text-stone-600' };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.className} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {config.label}
    </span>
  );
}
