"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCollection } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { MdDuplicateDetail } from '@/modules/46-mdm/ui/MdDuplicateDetail';
import { MdMergeWizard } from '@/modules/46-mdm/ui/MdMergeWizard';

export default function MdmDuplicatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [showMergeWizard, setShowMergeWizard] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: duplicates = [], update } = useCollection('mdmDuplicates') as { data: any[]; update: (id: string, data: any) => Promise<any> };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: people = [] } = useCollection('mdmPeople') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entities = [] } = useCollection('mdmEntities') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: accounts = [] } = useCollection('mdmAccounts') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: assets = [] } = useCollection('mdmAssets') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { create: createMergeJob } = useCollection('mdmMergeJobs') as { create: (data: any) => Promise<any> };

  const duplicate = duplicates.find((d) => d.id === id);

  if (!duplicate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Get the records based on record type
  const getRecords = () => {
    switch (duplicate.recordTypeKey) {
      case 'people':
        return people;
      case 'entities':
        return entities;
      case 'accounts':
        return accounts;
      case 'assets':
        return assets;
      default:
        return [];
    }
  };

  const records = getRecords();
  const recordA = records.find((r) => r.id === duplicate.candidateAId);
  const recordB = records.find((r) => r.id === duplicate.candidateBId);

  const handleIgnore = async (reason: string) => {
    await update(id, {
      status: 'ignored',
      ignoredAt: new Date().toISOString(),
      ignoredBy: 'current_user',
      ignoredReason: reason,
    });
  };

  const handleStartMerge = () => {
    setShowMergeWizard(true);
  };

  const handleConfirmMerge = async (primaryId: string, choices: { field: string; chosenValue: unknown; chosenSource: string }[]) => {
    // Create survivorship plan from choices
    const survivorshipPlanJson: Record<string, unknown> = {};
    for (const choice of choices) {
      survivorshipPlanJson[choice.field] = {
        chosenValue: choice.chosenValue,
        chosenSource: choice.chosenSource,
        rule: 'manual',
        manual: true,
      };
    }

    // Create merge job
    await createMergeJob({
      clientId: duplicate.clientId,
      recordTypeKey: duplicate.recordTypeKey,
      primaryId,
      mergeIdsJson: [primaryId === duplicate.candidateAId ? duplicate.candidateBId : duplicate.candidateAId],
      survivorshipPlanJson,
      status: 'pending_approval',
      requestedByUserId: 'current_user',
    });

    // Update duplicate status
    await update(id, {
      status: 'merge_in_progress',
    });

    setShowMergeWizard(false);
    router.push('/m/mdm/list?tab=duplicates');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/m/mdm/list?tab=duplicates">
              <Button variant="ghost" className="gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-stone-800">Карточка дубликата</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <MdDuplicateDetail
          duplicate={duplicate}
          recordA={recordA}
          recordB={recordB}
          onIgnore={handleIgnore}
          onStartMerge={handleStartMerge}
        />
      </div>

      {showMergeWizard && recordA && recordB && (
        <MdMergeWizard
          recordType={duplicate.recordTypeKey}
          recordA={recordA}
          recordB={recordB}
          onCancel={() => setShowMergeWizard(false)}
          onConfirm={handleConfirmMerge}
        />
      )}
    </div>
  );
}
