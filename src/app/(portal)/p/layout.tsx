'use client';

import React, { useState, useEffect } from 'react';
import { PortalLayout, PCopilotPanel, PCopilotButton } from '@/modules/45-portal';

export default function PortalLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotContext, setCopilotContext] = useState<any>(null);

  // Set portal cookie on mount (MVP auth mock)
  useEffect(() => {
    document.cookie = 'portal=1; path=/; SameSite=Strict';
    document.cookie = 'portal_user_id=pt-user-001; path=/; SameSite=Strict';
    document.cookie = 'portal_role=client_owner; path=/; SameSite=Strict';
    document.cookie = 'portal_household=hh-001; path=/; SameSite=Strict';
  }, []);

  return (
    <PortalLayout>
      {children}
      <PCopilotButton onClick={() => setCopilotOpen(true)} locale="ru" />
      <PCopilotPanel
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        locale="ru"
        context={copilotContext}
      />
    </PortalLayout>
  );
}
