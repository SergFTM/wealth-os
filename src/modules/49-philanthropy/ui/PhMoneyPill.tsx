"use client";

interface PhMoneyPillProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning';
}

export function PhMoneyPill({
  amount,
  currency = 'USD',
  size = 'sm',
  variant = 'default'
}: PhMoneyPillProps) {
  const formatted = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base font-semibold',
  };

  const variantClasses = {
    default: 'bg-stone-100 text-stone-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
  };

  return (
    <span className={`inline-flex items-center rounded-md font-mono ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {formatted}
    </span>
  );
}
