"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CmInboxTable } from '@/modules/19-comms/ui/CmInboxTable';
import { CmFiltersBar } from '@/modules/19-comms/ui/CmFiltersBar';
import { CmActionsBar } from '@/modules/19-comms/ui/CmActionsBar';

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

export default function CommsListPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [pinnedThreadIds, setPinnedThreadIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const currentUserId = 'user-rm-001';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [threadsRes, pinsRes] = await Promise.all([
          fetch('/api/collections/commThreads'),
          fetch('/api/collections/commThreadPins'),
        ]);

        const threadsData = await threadsRes.json();
        const pinsData = await pinsRes.json();

        setThreads(threadsData);
        setPinnedThreadIds(
          pinsData
            .filter((p: { userId: string }) => p.userId === currentUserId)
            .map((p: { threadId: string }) => p.threadId)
        );
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter threads based on active tab
  const filteredThreads = threads.filter((thread) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!thread.title.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Tab filter
    switch (activeTab) {
      case 'requests':
        return thread.threadType === 'request' && thread.status !== 'archived';
      case 'approvals':
        return thread.threadType === 'approval' && thread.status !== 'archived';
      case 'incidents':
        return thread.threadType === 'incident' && thread.status !== 'archived';
      case 'client_visible':
        return thread.clientSafe && thread.status !== 'archived';
      case 'archived':
        return thread.status === 'archived';
      default:
        return thread.status !== 'archived';
    }
  });

  const handleRowClick = (thread: Thread) => {
    router.push(`/m/comms/thread/${thread.id}`);
  };

  const handlePin = async (thread: Thread) => {
    const isPinned = pinnedThreadIds.includes(thread.id);

    if (isPinned) {
      setPinnedThreadIds(prev => prev.filter(id => id !== thread.id));
    } else {
      setPinnedThreadIds(prev => [...prev, thread.id]);
    }
  };

  const handleArchive = async (thread: Thread) => {
    // Update thread status to archived
    try {
      await fetch(`/api/collections/commThreads/${thread.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...thread, status: 'archived' }),
      });

      setThreads(prev =>
        prev.map(t => t.id === thread.id ? { ...t, status: 'archived' as const } : t)
      );
    } catch (error) {
      console.error('Failed to archive thread:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Все треды</h1>
          <p className="text-sm text-stone-500 mt-1">
            {filteredThreads.length} {filteredThreads.length === 1 ? 'тред' : 'тредов'}
          </p>
        </div>
        <CmActionsBar />
      </div>

      {/* Filters */}
      <CmFiltersBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSearch={setSearchQuery}
      />

      {/* Table */}
      <CmInboxTable
        threads={filteredThreads}
        pinnedThreadIds={pinnedThreadIds}
        currentUserId={currentUserId}
        onRowClick={handleRowClick}
        onPin={handlePin}
        onArchive={handleArchive}
      />

      {/* Empty state */}
      {filteredThreads.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-stone-500">Нет тредов для отображения</p>
        </div>
      )}
    </div>
  );
}
