"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRecord } from '@/lib/hooks';
import { CsRequestDetail } from '@/modules/34-consents/ui/CsRequestDetail';

interface AccessRequest {
  id: string;
  clientId: string;
  requestedBySubjectType: string;
  requestedById: string;
  requestedByName?: string;
  scopeType: string;
  scopeId?: string;
  scopeName?: string;
  permissions: string[];
  clientSafeRequested: boolean;
  reason: string;
  status: string;
  slaDueAt?: string;
  decidedByUserId?: string;
  decidedByName?: string;
  decidedAt?: string;
  decisionNotes?: string;
  consentId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { record: request, loading } = useRecord<AccessRequest>('accessRequests', id);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-stone-500">Загрузка...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-stone-500">Запрос не найден</div>
      </div>
    );
  }

  const handleApprove = async (validUntil: string, notes: string) => {
    // Create consent
    const consentRes = await fetch('/api/collections/consents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: request.clientId,
        subjectType: request.requestedBySubjectType,
        subjectId: request.requestedById,
        subjectName: request.requestedByName,
        scopeType: request.scopeType,
        scopeId: request.scopeId,
        scopeName: request.scopeName,
        permissions: request.permissions,
        clientSafe: request.clientSafeRequested,
        validFrom: new Date().toISOString(),
        validUntil: validUntil || undefined,
        status: 'active',
        grantedByUserId: 'user-001',
        grantedByName: 'Current User',
        reason: `Approved request: ${request.reason}`,
        requestId: request.id,
        watermarkRequired: false,
      }),
    });

    const consent = await consentRes.json();

    // Update request
    await fetch(`/api/collections/accessRequests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'approved',
        decidedByUserId: 'user-001',
        decidedByName: 'Current User',
        decidedAt: new Date().toISOString(),
        decisionNotes: notes,
        consentId: consent.id,
      }),
    });

    router.push('/m/consents/list?tab=requests');
  };

  const handleReject = async (notes: string) => {
    await fetch(`/api/collections/accessRequests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'rejected',
        decidedByUserId: 'user-001',
        decidedByName: 'Current User',
        decidedAt: new Date().toISOString(),
        decisionNotes: notes,
      }),
    });

    router.push('/m/consents/list?tab=requests');
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <CsRequestDetail
        request={request}
        onBack={() => router.push('/m/consents/list?tab=requests')}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
