"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; positive: boolean };
  status?: 'ok' | 'warning' | 'critical' | 'info';
  onClick?: () => void;
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  status,
  onClick,
  className,
}: KpiCardProps) {
  const statusColors = {
    ok: 'border-l-primary',
    warning: 'border-l-amber-500',
    critical: 'border-l-destructive',
    info: 'border-l-secondary',
  };

  return (
    <div
      className={cn(
        "glass-card p-5 border-l-4 border-transparent",
        onClick && "cursor-pointer hover:scale-[1.02]",
        status && statusColors[status],
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/80 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs font-medium",
              trend.positive ? "text-primary" : "text-destructive"
            )}>
              <svg
                className={cn("w-3 h-3", !trend.positive && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
