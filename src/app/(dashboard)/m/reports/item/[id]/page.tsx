'use client';

import { use } from 'react';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Redirect from /m/reports/item/[id] to /m/reports/pack/[id]
export default function ReportItemPage({ params }: PageProps) {
  const { id } = use(params);
  redirect(`/m/reports/pack/${id}`);
}
