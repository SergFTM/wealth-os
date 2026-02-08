'use client';

import { use } from 'react';
import { PoPackDetail } from '@/modules/55-portal/ui/PoPackDetail';

export default function PackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PoPackDetail packId={id} />;
}
