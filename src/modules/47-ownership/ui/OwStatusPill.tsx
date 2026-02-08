"use client";

interface OwStatusPillProps {
  status: 'active' | 'inactive' | 'pending' | 'error';
  label?: string;
}

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Активный' },
  inactive: { bg: 'bg-stone-100', text: 'text-stone-600', label: 'Неактивный' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Ожидание' },
  error: { bg: 'bg-red-100', text: 'text-red-700', label: 'Ошибка' },
};

export function OwStatusPill({ status, label }: OwStatusPillProps) {
  const style = statusStyles[status] || statusStyles.pending;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {label || style.label}
    </span>
  );
}

export default OwStatusPill;
