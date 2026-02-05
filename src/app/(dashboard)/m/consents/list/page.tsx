"use client";

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { CsConsentsTable } from '@/modules/34-consents/ui/CsConsentsTable';
import { CsRequestsTable } from '@/modules/34-consents/ui/CsRequestsTable';
import { CsPoliciesTable } from '@/modules/34-consents/ui/CsPoliciesTable';
import { CsDataRoomsTable } from '@/modules/34-consents/ui/CsDataRoomsTable';
import { CsRevocationsTable } from '@/modules/34-consents/ui/CsRevocationsTable';
import { ArrowLeft, Search, Filter } from 'lucide-react';

interface Consent {
  id: string;
  subjectName?: string;
  subjectType: string;
  scopeType: string;
  scopeName?: string;
  permissions: string[];
  status: string;
  validUntil?: string;
  clientSafe?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AccessRequest {
  id: string;
  requestedByName?: string;
  requestedBySubjectType: string;
  scopeType: string;
  scopeName?: string;
  permissions: string[];
  reason: string;
  status: string;
  slaDueAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface SharingPolicy {
  id: string;
  name: string;
  description?: string;
  appliesTo: string;
  status: string;
  rules: unknown[];
  createdAt: string;
  updatedAt: string;
}

interface DataRoom {
  id: string;
  name: string;
  description?: string;
  purpose: string;
  status: string;
  expiresAt?: string;
  itemsCount: number;
  audience: { subjectName?: string }[];
  createdAt: string;
  updatedAt: string;
}

interface Revocation {
  id: string;
  consentId: string;
  subjectName?: string;
  subjectType?: string;
  scopeType?: string;
  scopeName?: string;
  revokedByName?: string;
  reason: string;
  revokedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface AuditEvent {
  id: string;
  ts: string;
  actorName: string;
  action: string;
  collection: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

const tabs = [
  { key: 'consents', label: 'Согласия' },
  { key: 'requests', label: 'Запросы доступа' },
  { key: 'policies', label: 'Политики' },
  { key: 'rooms', label: 'Data Rooms' },
  { key: 'revocations', label: 'Отзыв' },
  { key: 'audit', label: 'Аудит' },
];

export default function ConsentsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'consents';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { items: consents } = useCollection<Consent>('consents');
  const { items: requests } = useCollection<AccessRequest>('accessRequests');
  const { items: policies } = useCollection<SharingPolicy>('sharingPolicies');
  const { items: rooms } = useCollection<DataRoom>('dataRooms');
  const { items: revocations } = useCollection<Revocation>('revocations');
  const { items: auditEvents } = useCollection<AuditEvent>('auditEvents');

  const filteredConsents = useMemo(() => {
    return consents.filter(c => {
      if (statusFilter && c.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (c.subjectName?.toLowerCase().includes(q) || c.scopeName?.toLowerCase().includes(q));
      }
      return true;
    });
  }, [consents, statusFilter, searchQuery]);

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (r.requestedByName?.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q));
      }
      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  const filteredAudit = useMemo(() => {
    return auditEvents.filter(e => {
      if (!['consents', 'accessRequests', 'sharingPolicies', 'dataRooms', 'revocations'].includes(e.collection)) {
        return false;
      }
      if (searchQuery) {
        return e.summary.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    }).slice(0, 100);
  }, [auditEvents, searchQuery]);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/m/consents')}
          className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-stone-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Согласия и доступы</h1>
          <p className="text-stone-500 mt-1">Полный список согласий, запросов и политик</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200/50">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm"
          />
        </div>
        {(activeTab === 'consents' || activeTab === 'requests' || activeTab === 'rooms' || activeTab === 'policies') && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
            >
              <option value="">Все статусы</option>
              <option value="active">Активно</option>
              <option value="pending">Ожидает</option>
              <option value="approved">Одобрено</option>
              <option value="rejected">Отклонено</option>
              <option value="expired">Истекло</option>
              <option value="revoked">Отозвано</option>
              <option value="closed">Закрыто</option>
              <option value="paused">Приостановлено</option>
            </select>
          </div>
        )}
        {(searchQuery || statusFilter) && (
          <button
            onClick={() => { setSearchQuery(''); setStatusFilter(''); }}
            className="px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg"
          >
            Сбросить
          </button>
        )}
      </div>

      {/* Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
        {activeTab === 'consents' && (
          <CsConsentsTable
            consents={filteredConsents}
            onOpen={(id) => router.push(`/m/consents/consent/${id}`)}
            onExtend={(id) => router.push(`/m/consents/consent/${id}?action=extend`)}
            onRevoke={(id) => router.push(`/m/consents/consent/${id}?action=revoke`)}
          />
        )}

        {activeTab === 'requests' && (
          <CsRequestsTable
            requests={filteredRequests}
            onOpen={(id) => router.push(`/m/consents/request/${id}`)}
            onApprove={(id) => router.push(`/m/consents/request/${id}?action=approve`)}
            onReject={(id) => router.push(`/m/consents/request/${id}?action=reject`)}
          />
        )}

        {activeTab === 'policies' && (
          <CsPoliciesTable
            policies={policies}
            onOpen={(id) => router.push(`/m/consents/policy/${id}`)}
          />
        )}

        {activeTab === 'rooms' && (
          <CsDataRoomsTable
            rooms={rooms}
            onOpen={(id) => router.push(`/m/consents/room/${id}`)}
          />
        )}

        {activeTab === 'revocations' && (
          <CsRevocationsTable
            revocations={revocations}
            onOpen={(id) => router.push(`/m/consents/consent/${id}`)}
          />
        )}

        {activeTab === 'audit' && (
          <div className="p-4">
            {filteredAudit.length === 0 ? (
              <div className="text-center text-stone-500 py-8">Нет событий аудита</div>
            ) : (
              <div className="space-y-2">
                {filteredAudit.map(event => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-stone-800">{event.summary}</div>
                      <div className="text-xs text-stone-500">{event.actorName} • {event.action} • {event.collection}</div>
                    </div>
                    <div className="text-xs text-stone-500">
                      {new Date(event.ts).toLocaleString('ru-RU')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
