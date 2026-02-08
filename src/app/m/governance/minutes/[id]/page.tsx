"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useRecord, useCollection, useMutateRecord } from '@/lib/hooks';
import { GvMinutesDetail } from '@/modules/40-governance/ui/GvMinutesDetail';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';

export default function MinutesDetailPage() {
  const params = useParams();
  const { user, locale } = useApp();
  const minutesId = params.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: minutes, isLoading, error } = useRecord('gvMinutes', minutesId) as { data: any; isLoading: boolean; error: unknown };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: meetings = [] } = useCollection('gvMeetings') as { data: any[] };
  const { mutate: updateMinutes } = useMutateRecord('gvMinutes', minutesId);

  // Enrich minutes with meeting name
  const meeting = meetings.find((m) => m.id === minutes?.meetingId);
  const enrichedMinutes = minutes ? {
    ...minutes,
    meetingName: meeting?.name,
  } : null;

  const handleEdit = () => {
    // Open edit modal
  };

  const handleApprove = async () => {
    if (!minutes) return;

    if (minutes.status === 'draft') {
      await updateMinutes({ status: 'review' });
    } else if (minutes.status === 'review') {
      await updateMinutes({ status: 'approved' });
    }
  };

  const handlePublish = async () => {
    await updateMinutes({
      status: 'published',
      clientSafePublished: true
    });
  };

  const handleSign = async () => {
    if (!user || !minutes) return;

    const currentSignatures = minutes.signedByJson || [];
    const newSignature = {
      name: user.name,
      signedAt: new Date().toISOString(),
    };

    await updateMinutes({
      signedByJson: [...currentSignatures, newSignature]
    });
  };

  const handleRegenerate = async () => {
    // In real app, would call AI service to regenerate
    console.log('Regenerating minutes with AI...');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !enrichedMinutes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 mb-4">Протокол не найден</p>
          <Link href="/m/governance/list?tab=minutes">
            <Button variant="secondary">К списку</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/m/governance/list?tab=minutes">
              <Button variant="ghost" className="gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-stone-800">
              Протокол: {enrichedMinutes.meetingName || enrichedMinutes.meetingId?.slice(-8)}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <GvMinutesDetail
          minutes={enrichedMinutes}
          locale={locale as 'ru' | 'en' | 'uk'}
          onEdit={enrichedMinutes.status === 'draft' ? handleEdit : undefined}
          onApprove={
            enrichedMinutes.status === 'draft' || enrichedMinutes.status === 'review'
              ? handleApprove
              : undefined
          }
          onPublish={enrichedMinutes.status === 'approved' ? handlePublish : undefined}
          onSign={enrichedMinutes.status === 'approved' ? handleSign : undefined}
          onRegenerate={
            enrichedMinutes.aiMetaJson && enrichedMinutes.status === 'draft'
              ? handleRegenerate
              : undefined
          }
        />
      </div>
    </div>
  );
}
