"use client";

import { useEffect, useState } from 'react';
import { CmDashboardPage } from '@/modules/19-comms/ui';

interface Thread {
  id: string;
  clientId: string;
  title: string;
  threadType: 'request' | 'approval' | 'incident' | 'advisor' | 'client_service';
  status: 'open' | 'escalated' | 'closed' | 'archived';
  scopeType: string;
  scopeId: string;
  clientSafe: boolean;
  slaDueAt: string | null;
  lastMessageAt: string | null;
  unreadCountByUserJson: string;
  linkedRefsJson: string;
  createdAt: string;
}

interface SlaPolicy {
  id: string;
  name: string;
  threadType: string;
  slaHours: number;
  escalationHours: number;
}

interface ThreadPin {
  userId: string;
  threadId: string;
}

export default function CommsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [slaPolicies, setSlaPolicies] = useState<SlaPolicy[]>([]);
  const [pinnedThreadIds, setPinnedThreadIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = 'user-rm-001';

  useEffect(() => {
    async function fetchData() {
      try {
        const [threadsRes, policiesRes, pinsRes] = await Promise.all([
          fetch('/api/collections/commThreads'),
          fetch('/api/collections/commSlaPolicies'),
          fetch('/api/collections/commThreadPins'),
        ]);

        const [threadsData, policiesData, pinsData] = await Promise.all([
          threadsRes.json(),
          policiesRes.json(),
          pinsRes.json(),
        ]);

        setThreads(threadsData);
        setSlaPolicies(policiesData);

        // Get pinned thread IDs for current user
        const userPins = pinsData
          .filter((p: ThreadPin) => p.userId === currentUserId)
          .map((p: ThreadPin) => p.threadId);
        setPinnedThreadIds(userPins);
      } catch (error) {
        console.error('Failed to fetch comms data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <CmDashboardPage
      threads={threads}
      slaPolicies={slaPolicies}
      pinnedThreadIds={pinnedThreadIds}
      currentUserId={currentUserId}
    />
  );
}
