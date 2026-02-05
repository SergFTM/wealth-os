"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRecord } from '@/lib/hooks';
import { CsConsentDetail } from '@/modules/34-consents/ui/CsConsentDetail';

interface Consent {
  id: string;
  clientId: string;
  subjectType: string;
  subjectId: string;
  subjectName?: string;
  scopeType: string;
  scopeId?: string;
  scopeName?: string;
  permissions: string[];
  clientSafe: boolean;
  validFrom: string;
  validUntil?: string;
  status: string;
  grantedByUserId?: string;
  grantedByName?: string;
  reason?: string;
  requestId?: string;
  watermarkRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ConsentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { record: consent, loading } = useRecord<Consent>('consents', id);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-stone-500">Загрузка...</div>
      </div>
    );
  }

  if (!consent) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-stone-500">Согласие не найдено</div>
      </div>
    );
  }

  const handleExtend = async (newDate: string) => {
    await fetch(`/api/collections/consents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ validUntil: newDate }),
    });
    router.refresh();
  };

  const handleRevoke = async (reason: string) => {
    // Create revocation record
    await fetch('/api/collections/revocations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: consent.clientId,
        consentId: consent.id,
        subjectType: consent.subjectType,
        subjectId: consent.subjectId,
        subjectName: consent.subjectName,
        scopeType: consent.scopeType,
        scopeId: consent.scopeId,
        scopeName: consent.scopeName,
        revokedByUserId: 'user-001',
        revokedByName: 'Current User',
        reason,
        revokedAt: new Date().toISOString(),
      }),
    });

    // Update consent status
    await fetch(`/api/collections/consents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'revoked' }),
    });

    router.push('/m/consents/list?tab=consents');
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <CsConsentDetail
        consent={consent}
        onBack={() => router.push('/m/consents/list?tab=consents')}
        onExtend={handleExtend}
        onRevoke={handleRevoke}
      />
    </div>
  );
}
