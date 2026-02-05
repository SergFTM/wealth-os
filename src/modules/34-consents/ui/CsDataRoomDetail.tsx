"use client";

import React, { useState } from 'react';
import { CsStatusPill } from './CsStatusPill';
import { ArrowLeft, Plus, UserPlus, Download, Eye, FileText, BarChart2, Stamp } from 'lucide-react';

interface DataRoomItem {
  id: string;
  itemType: string;
  itemId: string;
  itemName?: string;
  tags?: string[];
  addedByName?: string;
  addedAt: string;
}

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
}

interface CsDataRoomDetailProps {
  room: DataRoom;
  items: DataRoomItem[];
  onBack: () => void;
  onAddItem?: () => void;
  onAddAudience?: () => void;
  onClose?: () => void;
}

export function CsDataRoomDetail({ room, items, onBack, onAddItem, onAddAudience, onClose }: CsDataRoomDetailProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'access' | 'activity' | 'audit'>('items');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  const purposeLabels: Record<string, string> = {
    audit: 'Аудит',
    legal: 'Legal Due Diligence',
    trustee_review: 'Trustee Review',
    advisor_pack: 'Advisor Pack',
    other: 'Другое',
  };

  const tabs = [
    { key: 'items', label: 'Элементы' },
    { key: 'access', label: 'Доступ' },
    { key: 'activity', label: 'Активность' },
    { key: 'audit', label: 'Аудит' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-800">{room.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <CsStatusPill status={room.status} size="md" />
              <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-xs">
                {purposeLabels[room.purpose] || room.purpose}
              </span>
            </div>
          </div>
        </div>
        {room.status === 'active' && (
          <div className="flex gap-2">
            <button
              onClick={onAddItem}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Добавить
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg text-sm font-medium"
            >
              Закрыть комнату
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <FileText className="w-4 h-4" />
            Элементов
          </div>
          <div className="text-2xl font-bold text-stone-800 mt-1">{room.itemsCount}</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <Eye className="w-4 h-4" />
            Просмотров
          </div>
          <div className="text-2xl font-bold text-stone-800 mt-1">{room.viewsCount}</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <Download className="w-4 h-4" />
            Скачиваний
          </div>
          <div className="text-2xl font-bold text-stone-800 mt-1">{room.downloadsCount}</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <BarChart2 className="w-4 h-4" />
            Истекает
          </div>
          <div className="text-lg font-bold text-stone-800 mt-1">{formatDate(room.expiresAt)}</div>
        </div>
      </div>

      {/* Watermark */}
      {room.watermarkText && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <Stamp className="w-5 h-5 text-amber-600" />
          <div>
            <div className="text-sm font-medium text-amber-800">Watermark активен</div>
            <div className="text-xs text-amber-600">{room.watermarkText}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'items' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          {items.length === 0 ? (
            <div className="p-8 text-center text-stone-500">Нет элементов</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200/50 bg-stone-50/50">
                  <th className="text-left py-3 px-4 font-medium text-stone-600">Элемент</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-600">Тип</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-600">Теги</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-600">Добавил</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-600">Дата</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b border-stone-100 hover:bg-stone-50/50">
                    <td className="py-3 px-4 font-medium text-stone-800">{item.itemName || item.itemId}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        item.itemType === 'document' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.itemType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.tags?.map(t => (
                          <span key={t} className="px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded text-xs">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-600">{item.addedByName || '—'}</td>
                    <td className="py-3 px-4 text-stone-600">{formatDate(item.addedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'access' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-800">Участники</h3>
            <button
              onClick={onAddAudience}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg"
            >
              <UserPlus className="w-4 h-4" />
              Добавить участника
            </button>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
            {room.audience.length === 0 ? (
              <div className="p-8 text-center text-stone-500">Нет участников</div>
            ) : (
              <div className="divide-y divide-stone-100">
                {room.audience.map((a, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-stone-800">{a.subjectName || a.subjectId}</div>
                      <div className="text-xs text-stone-500">{a.subjectType}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Активность (MVP)</h3>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <Eye className="w-4 h-4 text-stone-400" />
                <div className="text-sm">Просмотр документа #{i}</div>
                <div className="text-xs text-stone-500 ml-auto">{formatDate(room.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Audit Trail</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="text-sm">Data Room создан</div>
              <div className="text-xs text-stone-500 ml-auto">{formatDate(room.createdAt)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
