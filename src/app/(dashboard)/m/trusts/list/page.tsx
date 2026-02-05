"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Landmark, Users, UserCheck, Wallet, Calendar, Bell, FileText, ArrowLeft } from 'lucide-react';
import { TrTrustsTable } from '@/modules/16-trusts/ui/TrTrustsTable';
import { TrBeneficiariesTable } from '@/modules/16-trusts/ui/TrBeneficiariesTable';
import { TrDistributionsTable } from '@/modules/16-trusts/ui/TrDistributionsTable';
import { TrEventsTable } from '@/modules/16-trusts/ui/TrEventsTable';
import { TrCalendarPanel } from '@/modules/16-trusts/ui/TrCalendarPanel';
import { TrDocumentsPanel } from '@/modules/16-trusts/ui/TrDocumentsPanel';
import { TrActionsBar } from '@/modules/16-trusts/ui/TrActionsBar';

interface Trust {
  id: string;
  clientId: string;
  name: string;
  jurisdiction: string;
  trustType: 'revocable' | 'irrevocable';
  settlor: string;
  status: 'active' | 'inactive' | 'terminated';
  primaryTrusteeId: string;
  protectorId: string | null;
  fundingDate: string;
  purpose: string;
  governingLaw: string;
  totalAssets: number;
  currency: string;
  notes: string | null;
}

interface Beneficiary {
  id: string;
  trustId: string;
  name: string;
  beneficiaryType: 'primary' | 'contingent';
  sharePct: number | null;
  relationship: string;
  rightsSummary: string;
  status: 'active' | 'inactive';
  dateOfBirth: string | null;
  notes: string | null;
}

interface Trustee {
  id: string;
  trustId: string;
  name: string;
  role: 'trustee' | 'co_trustee' | 'protector';
  type: 'individual' | 'corporate';
  status: 'active' | 'inactive';
  contactEmail: string | null;
  contactPhone: string | null;
}

interface Distribution {
  id: string;
  trustId: string;
  beneficiaryId: string;
  date: string;
  amount: number;
  currency: string;
  purpose: string;
  status: 'draft' | 'pending' | 'approved' | 'paid';
  approvalStatus: 'not_submitted' | 'pending_approval' | 'approved' | 'rejected';
  requestedBy: string;
  approvedBy: string | null;
  paidAt: string | null;
  notes: string | null;
}

interface TrustEvent {
  id: string;
  trustId: string;
  eventType: 'beneficiary_change' | 'trustee_change' | 'amendment' | 'distribution_decision' | 'other';
  date: string;
  status: 'draft' | 'pending' | 'approved' | 'closed';
  proposedChangesJson: string;
  owner: string;
  notes: string | null;
}

interface CalendarTrigger {
  id: string;
  trustId: string;
  name: string;
  triggerDate: string;
  triggerType: 'review' | 'expiration' | 'reminder';
  status: 'upcoming' | 'done' | 'overdue';
  reminderDays: number[];
  notes: string | null;
}

const tabs = [
  { id: 'trusts', label: 'Трасты', icon: Landmark },
  { id: 'beneficiaries', label: 'Бенефициары', icon: Users },
  { id: 'trustees', label: 'Trustees', icon: UserCheck },
  { id: 'distributions', label: 'Распределения', icon: Wallet },
  { id: 'events', label: 'События', icon: Calendar },
  { id: 'calendar', label: 'Календарь', icon: Bell },
  { id: 'documents', label: 'Документы', icon: FileText },
];

export default function TrustsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'trusts';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(true);

  const [trusts, setTrusts] = useState<Trust[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [trustees, setTrustees] = useState<Trustee[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [events, setEvents] = useState<TrustEvent[]>([]);
  const [calendar, setCalendar] = useState<CalendarTrigger[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trustsRes,
          beneficiariesRes,
          trusteesRes,
          distributionsRes,
          eventsRes,
          calendarRes,
        ] = await Promise.all([
          fetch('/api/collections/trusts'),
          fetch('/api/collections/beneficiaries'),
          fetch('/api/collections/trustees'),
          fetch('/api/collections/trustDistributions'),
          fetch('/api/collections/trustEvents'),
          fetch('/api/collections/trustCalendars'),
        ]);

        const [
          trustsData,
          beneficiariesData,
          trusteesData,
          distributionsData,
          eventsData,
          calendarData,
        ] = await Promise.all([
          trustsRes.json(),
          beneficiariesRes.json(),
          trusteesRes.json(),
          distributionsRes.json(),
          eventsRes.json(),
          calendarRes.json(),
        ]);

        setTrusts(trustsData.items || []);
        setBeneficiaries(beneficiariesData.items || []);
        setTrustees(trusteesData.items || []);
        setDistributions(distributionsData.items || []);
        setEvents(eventsData.items || []);
        setCalendar(calendarData.items || []);
      } catch (error) {
        console.error('Failed to fetch trust data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/m/trusts/list?tab=${tabId}`, { scroll: false });
  };

  const trustNames = trusts.reduce((acc, t) => {
    acc[t.id] = t.name;
    return acc;
  }, {} as Record<string, string>);

  const beneficiaryNames = beneficiaries.reduce((acc, b) => {
    acc[b.id] = b.name;
    return acc;
  }, {} as Record<string, string>);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-1/4" />
          <div className="flex gap-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-10 w-28 bg-stone-200 rounded-lg" />
            ))}
          </div>
          <div className="h-96 bg-stone-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/m/trusts')}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Данные трастов</h1>
            <p className="text-sm text-stone-500 mt-1">Детальный просмотр информации о трастах</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Actions Bar */}
      <TrActionsBar
        onCreateTrust={() => console.log('Create trust')}
        onAddBeneficiary={() => console.log('Add beneficiary')}
        onCreateEvent={() => console.log('Create event')}
        onCreateDistribution={() => console.log('Create distribution')}
        onAttachDocuments={() => console.log('Attach documents')}
      />

      {/* Content */}
      {activeTab === 'trusts' && (
        <TrTrustsTable
          trusts={trusts}
          onRowClick={(trust) => router.push(`/m/trusts/item/${trust.id}`)}
        />
      )}

      {activeTab === 'beneficiaries' && (
        <TrBeneficiariesTable
          beneficiaries={beneficiaries}
          showTrustColumn
          trustNames={trustNames}
          onRowClick={(ben) => router.push(`/m/trusts/item/${ben.id}?type=beneficiary`)}
        />
      )}

      {activeTab === 'trustees' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Trustee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Траст</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Роль</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Тип</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Контакт</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
                </tr>
              </thead>
              <tbody>
                {trustees.map((trustee) => {
                  const roleLabels: Record<string, { label: string; color: string; bg: string }> = {
                    trustee: { label: 'Trustee', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    co_trustee: { label: 'Co-Trustee', color: 'text-blue-600', bg: 'bg-blue-50' },
                    protector: { label: 'Protector', color: 'text-purple-600', bg: 'bg-purple-50' },
                  };
                  const role = roleLabels[trustee.role] || roleLabels.trustee;

                  return (
                    <tr
                      key={trustee.id}
                      onClick={() => router.push(`/m/trusts/item/${trustee.id}?type=trustee`)}
                      className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-stone-800">{trustee.name}</div>
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {trustNames[trustee.trustId] || trustee.trustId}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg ${role.bg} ${role.color}`}>
                          {role.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-stone-600">
                        {trustee.type === 'corporate' ? 'Корпоративный' : 'Физическое лицо'}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {trustee.contactEmail || '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg ${
                          trustee.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-500'
                        }`}>
                          {trustee.status === 'active' ? 'Активен' : 'Неактивен'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {trustees.length === 0 && (
            <div className="p-8 text-center text-stone-500">
              Нет trustees для отображения
            </div>
          )}
        </div>
      )}

      {activeTab === 'distributions' && (
        <TrDistributionsTable
          distributions={distributions}
          showTrustColumn
          trustNames={trustNames}
          beneficiaryNames={beneficiaryNames}
          onRowClick={(dist) => router.push(`/m/trusts/item/${dist.id}?type=distribution`)}
        />
      )}

      {activeTab === 'events' && (
        <TrEventsTable
          events={events}
          showTrustColumn
          trustNames={trustNames}
          onRowClick={(event) => router.push(`/m/trusts/item/${event.id}?type=event`)}
        />
      )}

      {activeTab === 'calendar' && (
        <TrCalendarPanel
          triggers={calendar}
          trustNames={trustNames}
          onTriggerClick={(trigger) => console.log('Trigger clicked:', trigger.id)}
        />
      )}

      {activeTab === 'documents' && (
        <TrDocumentsPanel
          documents={[]}
          onLinkToVault={() => router.push('/m/documents/list?category=trust')}
        />
      )}
    </div>
  );
}
