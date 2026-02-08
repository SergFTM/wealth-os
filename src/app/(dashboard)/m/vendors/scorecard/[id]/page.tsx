"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { ModuleList } from '@/components/templates/ModuleList';
import { VdScorecardDetail } from '@/modules/43-vendors/ui/VdScorecardDetail';
import type { Scorecard, Vendor } from '@/modules/43-vendors/types';

export default function ScorecardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scorecardId = params.id as string;

  const { data: scorecardData, isLoading, error } = useRecord('vdScorecards', scorecardId);
  const { data: vendorsData = [] } = useCollection('vdVendors');

  // Cast to proper types
  const scorecard = scorecardData as unknown as Scorecard | null;
  const vendors = vendorsData as unknown as Vendor[];

  // Get vendor name
  const vendor = scorecard ? vendors.find(v => v.id === scorecard.vendorId) : null;

  const handleEdit = () => {
    router.push(`/m/vendors/scorecard/${scorecardId}?action=edit`);
  };

  const handleCreateIncident = () => {
    if (scorecard) {
      router.push(`/m/vendors/list?tab=incidents&action=create&vendorId=${scorecard.vendorId}`);
    }
  };

  const handleDraftMemo = () => {
    router.push(`/m/vendors/scorecard/${scorecardId}?action=draft-memo`);
  };

  if (isLoading) {
    return (
      <ModuleList moduleSlug="vendors" title="Загрузка..." backHref="/m/vendors/list?tab=scorecards">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      </ModuleList>
    );
  }

  if (error || !scorecard) {
    return (
      <ModuleList moduleSlug="vendors" title="Ошибка" backHref="/m/vendors/list?tab=scorecards">
        <div className="text-center py-12 text-stone-500">
          Scorecard не найден
        </div>
      </ModuleList>
    );
  }

  const enrichedScorecard = {
    ...scorecard,
    vendorName: vendor?.name,
  };

  return (
    <ModuleList
      moduleSlug="vendors"
      title={`Scorecard: ${vendor?.name || scorecard.vendorId}`}
      backHref="/m/vendors/list?tab=scorecards"
    >
      <VdScorecardDetail
        scorecard={enrichedScorecard}
        onEdit={handleEdit}
        onCreateIncident={handleCreateIncident}
        onDraftMemo={handleDraftMemo}
        onBack={() => router.push('/m/vendors/list?tab=scorecards')}
      />
    </ModuleList>
  );
}
