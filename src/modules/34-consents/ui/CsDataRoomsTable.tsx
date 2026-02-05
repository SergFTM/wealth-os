"use client";

import React from 'react';
import { CsStatusPill } from './CsStatusPill';
import { MoreHorizontal, Eye, Plus, Link2, FolderLock } from 'lucide-react';

interface DataRoom {
  id: string;
  name: string;
  description?: string;
  purpose: string;
  status: string;
  expiresAt?: string;
  itemsCount: number;
  audience: { subjectName?: string }[];
}

interface CsDataRoomsTableProps {
  rooms: DataRoom[];
  onOpen?: (id: string) => void;
  onAddItems?: (id: string) => void;
  onShareLink?: (id: string) => void;
  compact?: boolean;
}

const purposeLabels: Record<string, string> = {
  audit: 'Аудит',
  legal: 'Legal',
  trustee_review: 'Trustee',
  advisor_pack: 'Advisor Pack',
  other: 'Другое',
};

export function CsDataRoomsTable({
  rooms,
  onOpen,
  onAddItems,
  onShareLink,
  compact = false,
}: CsDataRoomsTableProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  if (rooms.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        Нет Data Rooms
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200/50 bg-stone-50/50">
            <th className="text-left py-3 px-4 font-medium text-stone-600">Комната</th>
            {!compact && <th className="text-left py-3 px-4 font-medium text-stone-600">Цель</th>}
            <th className="text-left py-3 px-4 font-medium text-stone-600">Статус</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Истекает</th>
            {!compact && <th className="text-left py-3 px-4 font-medium text-stone-600">Элементов</th>}
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr
              key={room.id}
              className="border-b border-stone-100 hover:bg-stone-50/50 cursor-pointer"
              onClick={() => onOpen?.(room.id)}
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <FolderLock className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-medium text-stone-800">{room.name}</div>
                    {!compact && room.audience.length > 0 && (
                      <div className="text-xs text-stone-500">
                        {room.audience.slice(0, 2).map(a => a.subjectName).join(', ')}
                        {room.audience.length > 2 && ` +${room.audience.length - 2}`}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              {!compact && (
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-xs">
                    {purposeLabels[room.purpose] || room.purpose}
                  </span>
                </td>
              )}
              <td className="py-3 px-4">
                <CsStatusPill status={room.status} />
              </td>
              <td className="py-3 px-4 text-stone-600">
                {formatDate(room.expiresAt)}
              </td>
              {!compact && (
                <td className="py-3 px-4 text-stone-600">
                  {room.itemsCount}
                </td>
              )}
              <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                <div className="relative group">
                  <button className="p-1 hover:bg-stone-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-stone-400" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-stone-200 py-1 hidden group-hover:block z-10 min-w-[140px]">
                    <button
                      onClick={() => onOpen?.(room.id)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> Открыть
                    </button>
                    {room.status === 'active' && (
                      <>
                        <button
                          onClick={() => onAddItems?.(room.id)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Добавить элемент
                        </button>
                        <button
                          onClick={() => onShareLink?.(room.id)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                        >
                          <Link2 className="w-4 h-4" /> Поделиться
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
