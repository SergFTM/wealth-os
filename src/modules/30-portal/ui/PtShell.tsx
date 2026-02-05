'use client';

import { ReactNode } from 'react';
import { PtHeader } from './PtHeader';
import { PtSidebar } from './PtSidebar';

interface PtShellProps {
  children: ReactNode;
}

export function PtShell({ children }: PtShellProps) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/50">
      <PtSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PtHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
