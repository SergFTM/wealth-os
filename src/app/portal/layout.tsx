'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useApp } from '@/lib/store';
import { PtShell } from '@/modules/30-portal/ui';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <PtShell>{children}</PtShell>;
}
