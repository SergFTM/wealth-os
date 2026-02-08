"use client";

interface CrMoneyPillProps {
  amount: number;
  currency?: string;
  compact?: boolean;
  size?: 'sm' | 'md';
}

export function CrMoneyPill({ amount, currency = 'USD', compact = true, size = 'sm' }: CrMoneyPillProps) {
  let formatted: string;

  if (compact) {
    if (Math.abs(amount) >= 1e9) {
      formatted = `${(amount / 1e9).toFixed(1)}B`;
    } else if (Math.abs(amount) >= 1e6) {
      formatted = `${(amount / 1e6).toFixed(1)}M`;
    } else if (Math.abs(amount) >= 1e3) {
      formatted = `${(amount / 1e3).toFixed(0)}K`;
    } else {
      formatted = amount.toFixed(0);
    }
  } else {
    formatted = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CHF: 'CHF ',
    RUB: '₽',
    UAH: '₴',
  };

  const symbol = currencySymbols[currency] || `${currency} `;

  return (
    <span
      className={`inline-flex items-center font-medium text-stone-700 ${
        size === 'sm' ? 'text-sm' : 'text-base'
      }`}
    >
      {symbol}{formatted}
    </span>
  );
}
