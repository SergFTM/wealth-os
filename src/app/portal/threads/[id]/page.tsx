'use client';

import { use } from 'react';
import { PtThreadView } from '@/modules/30-portal/ui';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PortalThreadViewPage({ params }: PageProps) {
  const { id } = use(params);
  return <PtThreadView threadId={id} />;
}
