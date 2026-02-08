"use client";

import { useParams, useRouter } from 'next/navigation';
import { ModuleList } from '@/components/templates/ModuleList';
import { useRecord, useMutateRecord } from '@/lib/hooks';
import { PlChecklistDetail } from '@/modules/44-policies/ui/PlChecklistDetail';

export default function ChecklistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: checklist, isLoading, error } = useRecord<{
    id: string;
    name: string;
    linkedSopId?: string;
    linkedSopTitle?: string;
    stepsJson: Array<{
      orderIndex: number;
      title: string;
      description?: string;
      responsibleRole?: string;
    }>;
    usageCount: number;
    lastUsedAt?: string;
    createdByUserId?: string;
    createdByName?: string;
    createdAt: string;
    updatedAt: string;
  }>('plChecklists', id);

  const { mutate } = useMutateRecord('plChecklists', id);

  const handleUse = async () => {
    if (!checklist) return;
    await mutate({
      usageCount: checklist.usageCount + 1,
      lastUsedAt: new Date().toISOString(),
    });
    router.refresh();
  };

  const handleCreateTaskPlan = () => {
    // Redirect to workflow module with pre-filled tasks
    router.push('/m/workflow?createFromChecklist=' + id);
  };

  if (isLoading) {
    return (
      <ModuleList moduleSlug="policies" title="Загрузка..." backHref="/m/policies">
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
      </ModuleList>
    );
  }

  if (error || !checklist) {
    return (
      <ModuleList moduleSlug="policies" title="Ошибка" backHref="/m/policies">
        <div className="text-center py-12 text-stone-600">
          Чеклист не найден
        </div>
      </ModuleList>
    );
  }

  return (
    <ModuleList
      moduleSlug="policies"
      title={checklist.name}
      backHref="/m/policies/list?tab=checklists"
    >
      <PlChecklistDetail
        checklist={checklist}
        onUse={handleUse}
        onCreateTaskPlan={handleCreateTaskPlan}
      />
    </ModuleList>
  );
}
