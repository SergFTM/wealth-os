'use client';

import { use } from 'react';
import { PtReportViewer } from '@/modules/30-portal/ui';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PortalReportViewPage({ params }: PageProps) {
  const { id } = use(params);
  return <PtReportViewer reportId={id} />;
}
