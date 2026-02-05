'use client';

import { use } from 'react';
import { PtRequestDetail } from '@/modules/30-portal/ui';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PortalRequestDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <PtRequestDetail requestId={id} />;
}
