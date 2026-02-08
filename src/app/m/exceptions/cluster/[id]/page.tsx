'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecord, useCollection, useMutateRecord } from '@/lib/hooks';
import { ExClusterDetail } from '@/modules/48-exceptions/ui/ExClusterDetail';

export default function ClusterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: cluster, isLoading: loadingCluster, error } = useRecord<any>('exceptionClusters', id);
  const { data: exceptions = [], isLoading: loadingExceptions, refetch } = useCollection<any>('exceptions');

  const memberExceptions = useMemo(() => {
    if (!cluster || !cluster.memberIdsJson) return [];
    return exceptions.filter(e => cluster.memberIdsJson.includes(e.id));
  }, [cluster, exceptions]);

  const handleExceptionClick = (item: any) => {
    router.push(`/m/exceptions/exception/${item.id}`);
  };

  const handleAssignAll = async (role: string) => {
    if (!role || memberExceptions.length === 0) return;

    // Update all exceptions with the role
    const openExceptions = memberExceptions.filter(e => e.status !== 'closed');
    for (const exception of openExceptions) {
      try {
        await fetch(`/api/collections/exceptions/${exception.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assignedToRole: role })
        });
      } catch (err) {
        console.error('Failed to assign exception:', exception.id, err);
      }
    }
    refetch();
  };

  const handleCloseAll = async () => {
    if (memberExceptions.length === 0) return;

    const openExceptions = memberExceptions.filter(e => e.status !== 'closed');
    for (const exception of openExceptions) {
      try {
        await fetch(`/api/collections/exceptions/${exception.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'closed',
            closedAt: new Date().toISOString()
          })
        });
      } catch (err) {
        console.error('Failed to close exception:', exception.id, err);
      }
    }
    refetch();
  };

  const isLoading = loadingCluster || loadingExceptions;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !cluster) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800">Кластер не найден</h2>
            <p className="text-sm text-red-600 mt-2">ID: {id}</p>
            <Link
              href="/m/exceptions/list?tab=clusters"
              className="inline-block mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
            >
              Вернуться к списку
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/m/exceptions/list?tab=clusters"
              className="p-2 rounded-lg hover:bg-stone-100 text-stone-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-stone-900">Кластер</h1>
              <p className="text-xs text-stone-500 font-mono">{id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <ExClusterDetail
          cluster={cluster}
          memberExceptions={memberExceptions}
          onExceptionClick={handleExceptionClick}
          onAssignAll={handleAssignAll}
          onCloseAll={handleCloseAll}
        />
      </div>
    </div>
  );
}
