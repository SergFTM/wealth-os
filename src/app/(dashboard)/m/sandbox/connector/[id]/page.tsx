"use client";

import { use } from 'react';
import { SbConnectorDetail } from '@/modules/33-sandbox/ui';
import seedData from '@/modules/33-sandbox/seed.json';

export default function SandboxConnectorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const connector = seedData.sbConnectors.find(c => c.id === id);

  if (!connector) {
    return (
      <div className="p-8 text-center text-stone-500">
        Connector not found: {id}
      </div>
    );
  }

  return (
    <SbConnectorDetail
      connector={connector as never}
      onRunTest={() => alert(`Running test for connector ${id} (demo)`)}
      onToggleErrorInjection={(enabled, rate) => alert(`Error injection: ${enabled ? 'ON' : 'OFF'} at ${rate}% (demo)`)}
    />
  );
}
