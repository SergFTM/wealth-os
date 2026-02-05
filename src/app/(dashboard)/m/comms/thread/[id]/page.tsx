"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CmThreadHeader } from '@/modules/19-comms/ui/CmThreadHeader';
import { CmThreadView } from '@/modules/19-comms/ui/CmThreadView';
import { CmMessageComposer } from '@/modules/19-comms/ui/CmMessageComposer';
import { CmParticipantsPanel } from '@/modules/19-comms/ui/CmParticipantsPanel';
import { CmAttachmentsPanel } from '@/modules/19-comms/ui/CmAttachmentsPanel';
import { ExternalLink, Activity } from 'lucide-react';
import Link from 'next/link';

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
  linkedRefsJson: string;
  createdAt: string;
}

interface Message {
  id: string;
  threadId: string;
  senderId: string;
  messageType: 'normal' | 'system' | 'internal_note';
  content: string;
  mentionedUsersJson: string;
  readByUsersJson: string;
  createdAt: string;
  editedAt: string | null;
}

interface Participant {
  id: string;
  threadId: string;
  userId: string;
  role: 'owner' | 'member' | 'observer';
  addedBy: string;
  isClientVisible: boolean;
  joinedAt: string;
}

interface Attachment {
  id: string;
  threadId: string;
  messageId: string | null;
  documentId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  clientVisible: boolean;
  linkType: 'attached' | 'referenced';
  createdAt: string;
}

export default function ThreadDetailPage() {
  const params = useParams();
  const threadId = params.id as string;
  const currentUserId = 'user-rm-001';

  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [threadsRes, messagesRes, participantsRes, attachmentsRes, pinsRes] = await Promise.all([
          fetch('/api/collections/commThreads'),
          fetch('/api/collections/commMessages'),
          fetch('/api/collections/commParticipants'),
          fetch('/api/collections/commAttachments'),
          fetch('/api/collections/commThreadPins'),
        ]);

        const threadsData = await threadsRes.json();
        const messagesData = await messagesRes.json();
        const participantsData = await participantsRes.json();
        const attachmentsData = await attachmentsRes.json();
        const pinsData = await pinsRes.json();

        const currentThread = threadsData.find((t: Thread) => t.id === threadId);
        setThread(currentThread || null);

        setMessages(
          messagesData
            .filter((m: Message) => m.threadId === threadId)
            .sort((a: Message, b: Message) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
        );

        setParticipants(participantsData.filter((p: Participant) => p.threadId === threadId));
        setAttachments(attachmentsData.filter((a: Attachment) => a.threadId === threadId));

        const userPins = pinsData.filter(
          (p: { userId: string; threadId: string }) =>
            p.userId === currentUserId && p.threadId === threadId
        );
        setIsPinned(userPins.length > 0);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [threadId]);

  const handleSendMessage = async (message: {
    content: string;
    messageType: 'normal' | 'internal_note';
  }) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      threadId,
      senderId: currentUserId,
      messageType: message.messageType,
      content: message.content,
      mentionedUsersJson: '[]',
      readByUsersJson: JSON.stringify([currentUserId]),
      createdAt: new Date().toISOString(),
      editedAt: null,
    };

    setMessages(prev => [...prev, newMessage]);

    // In real app, would POST to API
  };

  const handlePin = () => {
    setIsPinned(prev => !prev);
  };

  const handleClose = async () => {
    if (!thread) return;
    setThread({ ...thread, status: 'closed' });
  };

  const handleReopen = async () => {
    if (!thread) return;
    setThread({ ...thread, status: 'open' });
  };

  const handleArchive = async () => {
    if (!thread) return;
    setThread({ ...thread, status: 'archived' });
  };

  // Parse linked refs
  const linkedRefs = thread ? (() => {
    try {
      return JSON.parse(thread.linkedRefsJson || '[]');
    } catch {
      return [];
    }
  })() : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone-500">Тред не найден</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <CmThreadHeader
        thread={thread}
        isPinned={isPinned}
        onPin={handlePin}
        onArchive={handleArchive}
        onClose={handleClose}
        onReopen={handleReopen}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 flex flex-col min-w-0">
          <CmThreadView
            messages={messages}
            currentUserId={currentUserId}
            isClientSafe={thread.clientSafe}
            showInternalNotes={true}
          />

          {/* Composer */}
          {thread.status !== 'archived' && (
            <div className="p-4 border-t border-stone-200 bg-white">
              <CmMessageComposer
                threadId={threadId}
                isClientSafe={thread.clientSafe}
                onSend={handleSendMessage}
                disabled={thread.status === 'closed'}
              />
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-80 border-l border-stone-200 bg-stone-50 p-4 space-y-4 overflow-y-auto">
          {/* Participants */}
          <CmParticipantsPanel
            participants={participants}
            currentUserId={currentUserId}
            isClientSafe={thread.clientSafe}
          />

          {/* Attachments */}
          <CmAttachmentsPanel
            attachments={attachments}
            isClientSafe={thread.clientSafe}
          />

          {/* Linked Objects */}
          {linkedRefs.length > 0 && (
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="p-4 border-b border-stone-100">
                <h3 className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-stone-500" />
                  Связанные объекты
                </h3>
              </div>
              <div className="divide-y divide-stone-100">
                {linkedRefs.map((ref: { type: string; id: string }, index: number) => (
                  <Link
                    key={index}
                    href={`/m/${ref.type}/item/${ref.id}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-stone-50 transition-colors"
                  >
                    <span className="text-sm text-stone-600 capitalize">{ref.type}</span>
                    <span className="text-xs text-stone-400 truncate">{ref.id}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Audit Trail indicator */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Activity className="w-4 h-4 text-stone-500" />
              <span>Аудит активен</span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Все действия записываются в журнал аудита
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
