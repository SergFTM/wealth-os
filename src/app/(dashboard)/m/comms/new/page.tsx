"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { CmNewThreadWizard } from '@/modules/19-comms/ui/CmNewThreadWizard';

interface ThreadFormData {
  title: string;
  threadType: string;
  scopeType: string;
  scopeId: string;
  clientSafe: boolean;
  initialMessage: string;
  participants: string[];
}

export default function NewThreadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get('type') || undefined;

  const handleClose = () => {
    router.push('/m/comms/list');
  };

  const handleSubmit = async (data: ThreadFormData) => {
    const threadId = `thread-${Date.now()}`;

    // Create the thread
    const thread = {
      id: threadId,
      clientId: data.scopeId,
      title: data.title,
      threadType: data.threadType,
      status: 'open',
      scopeType: data.scopeType,
      scopeId: data.scopeId,
      clientSafe: data.clientSafe,
      slaDueAt: calculateSlaDue(data.threadType),
      lastMessageAt: new Date().toISOString(),
      unreadCountByUserJson: '{}',
      linkedRefsJson: '[]',
      createdAt: new Date().toISOString(),
    };

    try {
      // Create thread
      await fetch('/api/collections/commThreads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(thread),
      });

      // Add participants
      const currentUserId = 'user-rm-001';
      const participantPromises = [
        // Add creator as owner
        fetch('/api/collections/commParticipants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `part-${threadId}-${currentUserId}`,
            threadId,
            userId: currentUserId,
            role: 'owner',
            addedBy: currentUserId,
            isClientVisible: true,
            joinedAt: new Date().toISOString(),
          }),
        }),
        // Add other participants
        ...data.participants.map((userId) =>
          fetch('/api/collections/commParticipants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: `part-${threadId}-${userId}`,
              threadId,
              userId,
              role: 'member',
              addedBy: currentUserId,
              isClientVisible: true,
              joinedAt: new Date().toISOString(),
            }),
          })
        ),
      ];

      await Promise.all(participantPromises);

      // Create initial message if provided
      if (data.initialMessage.trim()) {
        await fetch('/api/collections/commMessages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `msg-${threadId}-001`,
            threadId,
            senderId: currentUserId,
            messageType: 'normal',
            content: data.initialMessage,
            mentionedUsersJson: '[]',
            readByUsersJson: JSON.stringify([currentUserId]),
            createdAt: new Date().toISOString(),
            editedAt: null,
          }),
        });
      }

      // Navigate to the new thread
      router.push(`/m/comms/thread/${threadId}`);
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <CmNewThreadWizard
        onClose={handleClose}
        onSubmit={handleSubmit}
        preselectedType={preselectedType}
      />
    </div>
  );
}

function calculateSlaDue(threadType: string): string {
  const slaHours: Record<string, number> = {
    request: 48,
    approval: 24,
    incident: 4,
    advisor: 72,
    client_service: 48,
  };

  const hours = slaHours[threadType] || 48;
  const dueDate = new Date();
  dueDate.setHours(dueDate.getHours() + hours);
  return dueDate.toISOString();
}
