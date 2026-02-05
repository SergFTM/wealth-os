'use client';

import { Suspense } from 'react';
import { PtRequestNew } from '@/modules/30-portal/ui';

function LoadingFallback() {
  return (
    <div className="p-8 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
    </div>
  );
}

export default function PortalNewRequestPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PtRequestNew />
    </Suspense>
  );
}
