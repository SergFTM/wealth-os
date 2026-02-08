'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalHomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/p/overview');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
    </div>
  );
}
