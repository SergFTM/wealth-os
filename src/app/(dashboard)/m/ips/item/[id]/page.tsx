"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { IpsPolicyDetail } from '@/modules/13-ips/ui/IpsPolicyDetail';
import { IpsBreachDetail } from '@/modules/13-ips/ui/IpsBreachDetail';
import { IpsWaiverDetail } from '@/modules/13-ips/ui/IpsWaiverDetail';
import { ArrowLeft, Info } from 'lucide-react';

interface Policy {
  id: string;
  clientId: string;
  name: string;
  scopeType: 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  status: 'draft' | 'active' | 'archived';
  currentVersionId?: string;
  objectivesJson?: string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  liquidityNeeds?: string;
  timeHorizon?: string;
  createdAt: string;
  updatedAt: string;
}

interface Version {
  id: string;
  policyId: string;
  versionNumber: number;
  status: 'draft' | 'submitted' | 'approved';
  approvedAt?: string;
  approvedBy?: string;
  summaryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Constraint {
  id: string;
  policyId: string;
  type: string;
  segment?: string;
  limitMin?: number;
  limitMax?: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

interface Breach {
  id: string;
  policyId: string;
  constraintId: string;
  detectedAt: string;
  measuredValue: number;
  limitValue: number;
  severity: 'ok' | 'warning' | 'critical';
  status: 'open' | 'in_review' | 'resolved';
  sourceType: 'auto' | 'manual';
  explanation?: string;
  owner?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface Waiver {
  id: string;
  policyId: string;
  constraintId?: string;
  breachId?: string;
  reason: string;
  startDate: string;
  endDate: string;
  allowedDeviation?: string;
  status: 'pending' | 'active' | 'expired' | 'revoked';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function IpsItemPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const type = searchParams.get('type') || 'policy';

  const { items: policies } = useCollection<Policy>('ipsPolicies');
  const { items: versions } = useCollection<Version>('ipsVersions');
  const { items: constraints, refetch: refetchConstraints } = useCollection<Constraint>('ipsConstraints');
  const { items: breaches, refetch: refetchBreaches } = useCollection<Breach>('ipsBreaches');
  const { items: waivers, refetch: refetchWaivers } = useCollection<Waiver>('ipsWaivers');

  const policy = policies.find(p => p.id === id);
  const breach = breaches.find(b => b.id === id);
  const waiver = waivers.find(w => w.id === id);

  // Get related data
  const policyVersions = versions.filter(v => v.policyId === (policy?.id || breach?.policyId || waiver?.policyId));
  const policyConstraints = constraints.filter(c => c.policyId === (policy?.id || breach?.policyId || waiver?.policyId));
  const policyBreaches = breaches.filter(b => b.policyId === (policy?.id || breach?.policyId || waiver?.policyId) && b.status !== 'resolved');

  const relatedConstraint = breach ? constraints.find(c => c.id === breach.constraintId) :
                           waiver?.constraintId ? constraints.find(c => c.id === waiver.constraintId) : undefined;
  const relatedPolicy = breach ? policies.find(p => p.id === breach.policyId) :
                        waiver ? policies.find(p => p.id === waiver.policyId) : undefined;

  // Handlers
  const handleAssignBreach = () => {
    // TODO: implement assign drawer
  };

  const handleResolveBreach = async () => {
    if (!breach) return;
    await fetch(`/api/collections/ipsBreaches/${breach.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'resolved',
        resolvedAt: new Date().toISOString(),
        resolvedBy: 'admin@wealth.os',
      }),
    });
    refetchBreaches();
    router.push('/m/ips/list?tab=breaches');
  };

  const handleCreateWaiver = () => {
    router.push(`/m/ips/list?tab=waivers&action=create&breachId=${id}`);
  };

  const handleApproveWaiver = async () => {
    if (!waiver) return;
    await fetch(`/api/collections/ipsWaivers/${waiver.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approvalStatus: 'approved',
        status: 'active',
        approvedAt: new Date().toISOString(),
        approvedBy: 'admin@wealth.os',
      }),
    });
    refetchWaivers();
  };

  const handleRejectWaiver = async () => {
    if (!waiver) return;
    await fetch(`/api/collections/ipsWaivers/${waiver.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalStatus: 'rejected' }),
    });
    refetchWaivers();
  };

  const handleRevokeWaiver = async () => {
    if (!waiver) return;
    await fetch(`/api/collections/ipsWaivers/${waiver.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'revoked' }),
    });
    refetchWaivers();
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Информация об IPS носит справочный характер и требует подтверждения инвестиционным комитетом.
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-stone-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-stone-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-stone-800">
            {type === 'policy' && (policy?.name || 'Политика')}
            {type === 'breach' && 'Детали нарушения'}
            {type === 'waiver' && 'Детали waiver'}
            {type === 'meeting' && 'Заседание комитета'}
          </h1>
        </div>
      </div>

      {/* Content */}
      {type === 'policy' && policy && (
        <IpsPolicyDetail
          policy={policy}
          versions={policyVersions.sort((a, b) => b.versionNumber - a.versionNumber)}
          constraintsCount={policyConstraints.length}
          breachesCount={policyBreaches.length}
          onEditPolicy={() => {}}
          onCreateVersion={() => {}}
          onViewConstraints={() => router.push(`/m/ips/list?tab=constraints&policyId=${policy.id}`)}
          onViewBreaches={() => router.push(`/m/ips/list?tab=breaches&policyId=${policy.id}`)}
          onOpenVersion={(vId) => {}}
        />
      )}

      {type === 'breach' && breach && (
        <IpsBreachDetail
          breach={breach}
          constraint={relatedConstraint}
          policyName={relatedPolicy?.name}
          onAssign={handleAssignBreach}
          onResolve={handleResolveBreach}
          onCreateWaiver={handleCreateWaiver}
          onCreateTask={() => {}}
        />
      )}

      {type === 'waiver' && waiver && (
        <IpsWaiverDetail
          waiver={waiver}
          constraint={relatedConstraint}
          policyName={relatedPolicy?.name}
          onApprove={handleApproveWaiver}
          onReject={handleRejectWaiver}
          onRevoke={handleRevokeWaiver}
          onEdit={() => {}}
        />
      )}

      {/* Not Found */}
      {type === 'policy' && !policy && (
        <div className="p-8 text-center bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
          <p className="text-stone-500">Политика не найдена</p>
        </div>
      )}

      {type === 'breach' && !breach && (
        <div className="p-8 text-center bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
          <p className="text-stone-500">Нарушение не найдено</p>
        </div>
      )}

      {type === 'waiver' && !waiver && (
        <div className="p-8 text-center bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
          <p className="text-stone-500">Waiver не найден</p>
        </div>
      )}
    </div>
  );
}
