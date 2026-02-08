"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRecord, useCollection, useMutateRecord } from '@/lib/hooks';
import { ModuleList } from '@/components/templates/ModuleList';
import { VdIncidentDetail } from '@/modules/43-vendors/ui/VdIncidentDetail';
import type { Incident, Vendor } from '@/modules/43-vendors/types';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const incidentId = params.id as string;

  const { data: incidentData, isLoading, error } = useRecord('vdIncidents', incidentId);
  const { data: vendorsData = [] } = useCollection('vdVendors');
  const { mutate: updateIncident } = useMutateRecord('vdIncidents', incidentId);

  // Cast to proper types
  const incident = incidentData as unknown as Incident | null;
  const vendors = vendorsData as unknown as Vendor[];

  // Get vendor name
  const vendor = incident ? vendors.find(v => v.id === incident.vendorId) : null;

  const handleEdit = () => {
    router.push(`/m/vendors/incident/${incidentId}?action=edit`);
  };

  const handleResolve = async () => {
    await updateIncident({
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
    });
  };

  const handleLinkCase = () => {
    router.push(`/m/vendors/incident/${incidentId}?action=link-case`);
  };

  if (isLoading) {
    return (
      <ModuleList moduleSlug="vendors" title="Загрузка..." backHref="/m/vendors/list?tab=incidents">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      </ModuleList>
    );
  }

  if (error || !incident) {
    return (
      <ModuleList moduleSlug="vendors" title="Ошибка" backHref="/m/vendors/list?tab=incidents">
        <div className="text-center py-12 text-stone-500">
          Инцидент не найден
        </div>
      </ModuleList>
    );
  }

  const enrichedIncident = {
    ...incident,
    vendorName: vendor?.name,
  };

  return (
    <ModuleList
      moduleSlug="vendors"
      title={incident.title}
      backHref="/m/vendors/list?tab=incidents"
    >
      <VdIncidentDetail
        incident={enrichedIncident}
        onEdit={handleEdit}
        onResolve={handleResolve}
        onLinkCase={handleLinkCase}
        onBack={() => router.push('/m/vendors/list?tab=incidents')}
      />
    </ModuleList>
  );
}
