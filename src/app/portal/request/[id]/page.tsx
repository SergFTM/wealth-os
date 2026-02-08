'use client';

import { use } from 'react';
import { PoRequestDetail } from '@/modules/55-portal/ui/PoRequestDetail';

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PoRequestDetail requestId={id} />;
}
