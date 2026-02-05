"use client";

import { use } from 'react';
import { SbDatasetDetail } from '@/modules/33-sandbox/ui';
import seedData from '@/modules/33-sandbox/seed.json';

export default function SandboxDatasetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dataset = seedData.sbDatasets.find(d => d.id === id);

  if (!dataset) {
    return (
      <div className="p-8 text-center text-stone-500">
        Dataset not found: {id}
      </div>
    );
  }

  return (
    <SbDatasetDetail
      dataset={dataset as never}
      onClone={() => alert(`Cloning dataset ${id} (demo)`)}
      onReset={() => alert(`Resetting dataset ${id} (demo)`)}
    />
  );
}
