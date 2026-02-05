"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { SbJobDetail } from '@/modules/33-sandbox/ui';
import seedData from '@/modules/33-sandbox/seed.json';

export default function SandboxJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const job = seedData.sbSyncJobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="p-8 text-center text-stone-500">
        Job not found: {id}
      </div>
    );
  }

  return (
    <SbJobDetail
      job={job as never}
      onRetry={() => alert(`Retrying job ${id} (demo)`)}
      onViewPayloads={() => router.push(`/m/sandbox/list?tab=payloads&jobId=${id}`)}
    />
  );
}
