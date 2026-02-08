"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Redirect meeting routes to event routes (meetings are a type of event)
export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id as string;

  useEffect(() => {
    // Redirect to the event detail page
    router.replace(`/m/calendar/event/${meetingId}`);
  }, [meetingId, router]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
    </div>
  );
}
