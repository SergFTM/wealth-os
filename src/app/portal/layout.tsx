'use client';

import React, { useEffect } from 'react';
import { PoShell } from '@/modules/55-portal/ui/PoShell';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // MVP auth mock: set portal cookie
    document.cookie = 'portal_session_55=demo_session; path=/; SameSite=Strict';
    document.cookie = 'portal_user_id=pu-001; path=/; SameSite=Strict';
  }, []);

  return <PoShell>{children}</PoShell>;
}
