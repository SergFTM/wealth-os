'use client';

import { use } from 'react';
import { PoDocumentDetail } from '@/modules/55-portal/ui/PoDocumentDetail';

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PoDocumentDetail documentId={id} />;
}
