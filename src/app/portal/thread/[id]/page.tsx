'use client';

import { use } from 'react';
import { PoThreadDetail } from '@/modules/55-portal/ui/PoThreadDetail';

export default function ThreadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PoThreadDetail threadId={id} />;
}
