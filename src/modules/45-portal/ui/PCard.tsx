'use client';

import React from 'react';

interface PCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function PCard({ children, className = '', onClick, hover = false }: PCardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-emerald-100/50
        shadow-sm backdrop-blur-sm
        ${hover ? 'hover:shadow-md hover:border-emerald-200/50 transition-all duration-200 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface PCardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PCardHeader({ title, subtitle, action }: PCardHeaderProps) {
  return (
    <div className="flex items-start justify-between px-6 py-4 border-b border-emerald-50">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface PCardBodyProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PCardBody({ children, className = '', noPadding = false }: PCardBodyProps) {
  return (
    <div className={`${noPadding ? '' : 'px-6 py-4'} ${className}`}>
      {children}
    </div>
  );
}

interface PCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function PCardFooter({ children, className = '' }: PCardFooterProps) {
  return (
    <div className={`px-6 py-3 bg-slate-50/50 rounded-b-2xl border-t border-emerald-50 ${className}`}>
      {children}
    </div>
  );
}

// KPI Card variant
interface PKpiCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function PKpiCard({ label, value, change, changeLabel, icon, onClick }: PKpiCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <PCard className="p-6" onClick={onClick} hover={!!onClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{typeof change === 'number' && change.toFixed ? change.toFixed(1) : change}%
              </span>
              {changeLabel && <span className="text-xs text-slate-400">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center text-emerald-600">
            {icon}
          </div>
        )}
      </div>
    </PCard>
  );
}

// Document Card variant
interface PDocCardProps {
  title: string;
  type: string;
  date: string;
  size?: string;
  onDownload?: () => void;
  onOpen?: () => void;
}

export function PDocCard({ title, type, date, size, onDownload, onOpen }: PDocCardProps) {
  return (
    <PCard className="p-4" hover>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 truncate">{title}</p>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span>{type}</span>
            <span>•</span>
            <span>{date}</span>
            {size && (
              <>
                <span>•</span>
                <span>{size}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onOpen && (
            <button
              onClick={(e) => { e.stopPropagation(); onOpen(); }}
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}
          {onDownload && (
            <button
              onClick={(e) => { e.stopPropagation(); onDownload(); }}
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </PCard>
  );
}
