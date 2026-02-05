"use client";

import { use } from 'react';
import { SbPayloadDetail } from '@/modules/33-sandbox/ui';

// Mock payload data
const mockPayload = {
  id: '',
  jobId: 'sbjob-001',
  connectorId: 'sbcon-001',
  entityType: 'transactions',
  direction: 'inbound' as const,
  payloadJson: {
    records: [
      { txn_id: 'TXN-001', txn_date: '2024-01-15', amount_cents: 150000, currency: 'USD', description: 'Stock purchase' },
      { txn_id: 'TXN-002', txn_date: '2024-01-16', amount_cents: 25000, currency: 'USD', description: 'Dividend' },
      { txn_id: 'TXN-003', txn_date: '2024-01-17', amount_cents: 500000, currency: 'USD', description: 'Wire transfer' },
    ],
    meta: { source: 'bank_mock', timestamp: new Date().toISOString() },
  },
  payloadSize: 2048,
  recordCount: 3,
  validationJson: {
    valid: true,
    errors: [],
    warnings: [],
  },
  mappingOutputJson: {
    records: [
      { id: 'TXN-001', date: '2024-01-15', amount: 1500.00, currency: 'USD', memo: 'Stock purchase' },
      { id: 'TXN-002', date: '2024-01-16', amount: 250.00, currency: 'USD', memo: 'Dividend' },
      { id: 'TXN-003', date: '2024-01-17', amount: 5000.00, currency: 'USD', memo: 'Wire transfer' },
    ],
  },
  createdAt: new Date().toISOString(),
};

export default function SandboxPayloadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const payload = { ...mockPayload, id };

  return <SbPayloadDetail payload={payload} />;
}
