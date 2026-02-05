"use client";

import { use } from 'react';
import { SbEnvDetail } from '@/modules/33-sandbox/ui';
import seedData from '@/modules/33-sandbox/seed.json';

export default function SandboxEnvDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const environment = seedData.sbEnvironments.find(e => e.id === id);

  if (!environment) {
    return (
      <div className="p-8 text-center text-stone-500">
        Environment not found: {id}
      </div>
    );
  }

  return (
    <SbEnvDetail
      environment={environment as never}
      onActivate={() => alert(`Activating environment ${id} (demo)`)}
      onArchive={() => alert(`Archiving environment ${id} (demo)`)}
      onUseEnv={() => alert(`Switched to environment ${id} (demo)`)}
    />
  );
}
