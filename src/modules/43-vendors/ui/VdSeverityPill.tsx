"use client";

import React from 'react';

type Severity = 'low' | 'medium' | 'high' | 'critical';
type RiskRating = 'low' | 'medium' | 'high';

interface VdSeverityPillProps {
  severity: Severity | RiskRating;
  size?: 'sm' | 'md';
  variant?: 'severity' | 'risk';
}

const severityConfig: Record<Severity, { label: string; color: string; bgColor: string; icon: string }> = {
  low: {
    label: 'Низкий',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-200',
    icon: '●'
  },
  medium: {
    label: 'Средний',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    icon: '●●'
  },
  high: {
    label: 'Высокий',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
    icon: '●●●'
  },
  critical: {
    label: 'Критический',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
    icon: '●●●●'
  },
};

const riskLabels: Record<RiskRating, string> = {
  low: 'Низкий риск',
  medium: 'Средний риск',
  high: 'Высокий риск',
};

export function VdSeverityPill({ severity, size = 'sm', variant = 'severity' }: VdSeverityPillProps) {
  const config = severityConfig[severity as Severity] || severityConfig.low;

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  const label = variant === 'risk'
    ? riskLabels[severity as RiskRating]
    : config.label;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${config.bgColor} ${config.color} ${sizeClasses}
      `}
    >
      <span className="text-[0.6em] tracking-tight opacity-70">{config.icon}</span>
      {label}
    </span>
  );
}

export function VdAnomalyPill({ score, flagged }: { score: number; flagged: boolean }) {
  if (!flagged) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        OK
      </span>
    );
  }

  const severity = score >= 80 ? 'critical' : score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low';
  const config = severityConfig[severity];

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border
        ${config.bgColor} ${config.color}
      `}
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      Аномалия {score}%
    </span>
  );
}
