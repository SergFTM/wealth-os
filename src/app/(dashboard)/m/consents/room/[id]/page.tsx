"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { CsDataRoomDetail } from '@/modules/34-consents/ui/CsDataRoomDetail';

interface DataRoom {
  id: string;
  name: string;
  description?: string;
  purpose: string;
  status: string;
  expiresAt?: string;
  createdByName?: string;
  audience: { subjectType: string; subjectId: string; subjectName?: string }[];
  watermarkText?: string;
  itemsCount: number;
  viewsCount: number;
  downloadsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DataRoomItem {
  id: string;
  roomId: string;
  itemType: string;
  itemId: string;
  itemName?: string;
  tags?: string[];
  addedByName?: string;
  addedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { record: room, loading } = useRecord<DataRoom>('dataRooms', id);
  const { items: allItems } = useCollection<DataRoomItem>('dataRoomItems');

  const roomItems = allItems.filter(item => item.roomId === id);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-stone-500">Загрузка...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-stone-500">Data Room не найден</div>
      </div>
    );
  }

  const handleClose = async () => {
    await fetch(`/api/collections/dataRooms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'closed' }),
    });
    router.push('/m/consents/list?tab=rooms');
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <CsDataRoomDetail
        room={room}
        items={roomItems}
        onBack={() => router.push('/m/consents/list?tab=rooms')}
        onAddItem={() => {}}
        onAddAudience={() => {}}
        onClose={handleClose}
      />
    </div>
  );
}
