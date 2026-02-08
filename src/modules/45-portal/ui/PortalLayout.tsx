'use client';

import React from 'react';
import { PortalTopbar } from './PortalTopbar';
import { PortalNav } from './PortalNav';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-amber-50/20">
      <PortalTopbar />
      <div className="flex">
        <PortalNav />
        <main className="flex-1 min-h-[calc(100vh-64px)] ml-64">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Page header component for portal pages
interface PortalPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumb?: Array<{ label: string; href?: string }>;
}

export function PortalPageHeader({ title, subtitle, action, breadcrumb }: PortalPageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {item.href ? (
                <a href={item.href} className="hover:text-emerald-600 transition-colors">
                  {item.label}
                </a>
              ) : (
                <span className="text-slate-700">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

// Section component
interface PortalSectionProps {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PortalSection({ children, title, action, className = '' }: PortalSectionProps) {
  return (
    <section className={`mb-8 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-semibold text-slate-800">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// Grid layouts
interface PortalGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

const gridColsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

const gridGapMap = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
};

export function PortalGrid({ children, cols = 3, gap = 'md' }: PortalGridProps) {
  return (
    <div className={`grid ${gridColsMap[cols]} ${gridGapMap[gap]}`}>
      {children}
    </div>
  );
}
