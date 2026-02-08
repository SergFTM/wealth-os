"use client";

import React from 'react';

interface RhTierBadgeProps {
  tier: 'A' | 'B' | 'C' | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const TIER_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  A: {
    label: 'VIP',
    color: 'text-emerald-700',
    bgColor: 'bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-300'
  },
  B: {
    label: 'Premium',
    color: 'text-blue-700',
    bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300'
  },
  C: {
    label: 'Standard',
    color: 'text-gray-600',
    bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300'
  },
};

export function RhTierBadge({ tier, size = 'md', showLabel = true }: RhTierBadgeProps) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.C;

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className={`
        ${sizeClasses[size]}
        rounded-full border flex items-center justify-center font-bold
        ${config.bgColor} ${config.color}
      `}>
        {tier}
      </div>
      {showLabel && (
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
      )}
    </div>
  );
}

export default RhTierBadge;
