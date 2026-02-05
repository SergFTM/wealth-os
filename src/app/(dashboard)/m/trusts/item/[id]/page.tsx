"use client";

import { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Landmark, AlertTriangle } from 'lucide-react';
import { TrTrustDetail } from '@/modules/16-trusts/ui/TrTrustDetail';
import { TrDistributionDetail } from '@/modules/16-trusts/ui/TrDistributionDetail';
import { TrEventDetail } from '@/modules/16-trusts/ui/TrEventDetail';

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
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
  cashAccountId: string | null;
  liquidityRef: string | null;
  docIds: string[];
  notes: string | null;
  requestedBy: string;
  requestedAt: string;
  approvedBy: string | null;
  approvedAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TrustEvent {
  id: string;
  trustId: string;
  eventType: 'beneficiary_change' | 'trustee_change' | 'amendment' | 'distribution_decision' | 'other';
  date: string;
  status: 'draft' | 'pending' | 'approved' | 'closed';
  proposedChangesJson: string;
  owner: string;
  docIds: string[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TrustPowers {
  id: string;
  trustId: string;
  powersJson: string;
  approvalRulesJson: string;
  lastReviewedAt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const typeCollections: Record<string, string> = {
  trust: 'trusts',
  beneficiary: 'beneficiaries',
  trustee: 'trustees',
  distribution: 'trustDistributions',
  event: 'trustEvents',
};

const typeLabels: Record<string, string> = {
  trust: 'Траст',
  beneficiary: 'Бенефициар',
  trustee: 'Trustee',
  distribution: 'Распределение',
  event: 'Событие',
};

export default function TrustItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'trust';

  const [item, setItem] = useState<Trust | Beneficiary | Trustee | Distribution | TrustEvent | null>(null);
  const [relatedData, setRelatedData] = useState<{
    beneficiaries: Beneficiary[];
    trustees: Trustee[];
    distributions: Distribution[];
    events: TrustEvent[];
    powers: TrustPowers | null;
    trusts: Trust[];
  }>({
    beneficiaries: [],
    trustees: [],
    distributions: [],
    events: [],
    powers: null,
    trusts: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const collection = typeCollections[type];
        if (!collection) {
          throw new Error('Unknown type');
        }

        const res = await fetch(`/api/collections/${collection}/${id}`);
        if (!res.ok) throw new Error('Item not found');
        const data = await res.json();
        setItem(data);

        // Fetch related data for trust detail view
        if (type === 'trust') {
          const [beneficiariesRes, trusteesRes, distributionsRes, eventsRes, powersRes] = await Promise.all([
            fetch('/api/collections/beneficiaries'),
            fetch('/api/collections/trustees'),
            fetch('/api/collections/trustDistributions'),
            fetch('/api/collections/trustEvents'),
            fetch('/api/collections/trustPowers'),
          ]);

          const [beneficiariesData, trusteesData, distributionsData, eventsData, powersData] = await Promise.all([
            beneficiariesRes.json(),
            trusteesRes.json(),
            distributionsRes.json(),
            eventsRes.json(),
            powersRes.json(),
          ]);

          const trustBeneficiaries = (beneficiariesData.items || []).filter((b: Beneficiary) => b.trustId === id);
          const trustTrustees = (trusteesData.items || []).filter((t: Trustee) => t.trustId === id);
          const trustDistributions = (distributionsData.items || []).filter((d: Distribution) => d.trustId === id);
          const trustEvents = (eventsData.items || []).filter((e: TrustEvent) => e.trustId === id);
          const trustPowers = (powersData.items || []).find((p: TrustPowers) => p.trustId === id) || null;

          setRelatedData({
            beneficiaries: trustBeneficiaries,
            trustees: trustTrustees,
            distributions: trustDistributions,
            events: trustEvents,
            powers: trustPowers,
            trusts: [],
          });
        } else if (type === 'distribution' || type === 'event') {
          const [trustsRes, beneficiariesRes] = await Promise.all([
            fetch('/api/collections/trusts'),
            fetch('/api/collections/beneficiaries'),
          ]);
          const [trustsData, beneficiariesData] = await Promise.all([
            trustsRes.json(),
            beneficiariesRes.json(),
          ]);
          setRelatedData(prev => ({
            ...prev,
            trusts: trustsData.items || [],
            beneficiaries: beneficiariesData.items || [],
          }));
        }
      } catch (error) {
        console.error('Failed to fetch item:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, type]);

  const handleBack = () => {
    const tabMap: Record<string, string> = {
      trust: 'trusts',
      beneficiary: 'beneficiaries',
      trustee: 'trustees',
      distribution: 'distributions',
      event: 'events',
    };
    router.push(`/m/trusts/list?tab=${tabMap[type] || 'trusts'}`);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-1/4" />
          <div className="h-64 bg-stone-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
          <Landmark className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-stone-800 mb-2">Запись не найдена</h2>
          <p className="text-stone-500 mb-4">Запрашиваемая запись не существует или была удалена</p>
          <button
            onClick={() => router.push('/m/trusts')}
            className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            Вернуться к дашборду
          </button>
        </div>
      </div>
    );
  }

  // Trust detail view
  if (type === 'trust') {
    return (
      <div className="p-6">
        <TrTrustDetail
          trust={item as Trust}
          beneficiaries={relatedData.beneficiaries}
          trustees={relatedData.trustees}
          distributions={relatedData.distributions}
          events={relatedData.events}
          powers={relatedData.powers}
          onBack={handleBack}
          onEdit={() => console.log('Edit trust')}
        />
      </div>
    );
  }

  // Distribution detail view
  if (type === 'distribution') {
    const distribution = item as Distribution;
    const trust = relatedData.trusts.find(t => t.id === distribution.trustId);
    const beneficiary = relatedData.beneficiaries.find(b => b.id === distribution.beneficiaryId);

    return (
      <div className="p-6">
        <TrDistributionDetail
          distribution={distribution}
          trustName={trust?.name}
          beneficiaryName={beneficiary?.name}
          onBack={handleBack}
          onEdit={() => console.log('Edit distribution')}
          onApprove={() => console.log('Approve distribution')}
          onReject={() => console.log('Reject distribution')}
          onMarkPaid={() => console.log('Mark paid')}
        />
      </div>
    );
  }

  // Event detail view
  if (type === 'event') {
    const event = item as TrustEvent;
    const trust = relatedData.trusts.find(t => t.id === event.trustId);

    return (
      <div className="p-6">
        <TrEventDetail
          event={event}
          trustName={trust?.name}
          onBack={handleBack}
          onEdit={() => console.log('Edit event')}
          onApprove={() => console.log('Approve event')}
          onClose={() => console.log('Close event')}
        />
      </div>
    );
  }

  // Generic detail view for beneficiary, trustee
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-stone-500" />
        </button>
        <div>
          <div className="text-xs text-stone-500 uppercase">{typeLabels[type]}</div>
          <h1 className="text-2xl font-bold text-stone-800">
            {(item as Beneficiary | Trustee).name || id}
          </h1>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>Не является юридической консультацией</span>
      </div>

      {/* Detail Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(item).map(([key, value]) => {
            if (['id', 'createdAt', 'updatedAt', 'docIds'].includes(key)) return null;
            if (typeof value === 'object' && value !== null) return null;

            const labels: Record<string, string> = {
              trustId: 'Траст',
              name: 'Имя',
              beneficiaryType: 'Тип бенефициара',
              sharePct: 'Доля %',
              relationship: 'Родство',
              rightsSummary: 'Права',
              status: 'Статус',
              dateOfBirth: 'Дата рождения',
              notes: 'Заметки',
              role: 'Роль',
              type: 'Тип',
              contactEmail: 'Email',
              contactPhone: 'Телефон',
              address: 'Адрес',
              startDate: 'Дата начала',
              endDate: 'Дата окончания',
            };

            return (
              <div key={key} className="p-3 bg-stone-50 rounded-xl">
                <div className="text-xs text-stone-500 uppercase mb-1">{labels[key] || key}</div>
                <div className="text-sm font-medium text-stone-800">
                  {value === null ? '—' :
                   typeof value === 'boolean' ? (value ? 'Да' : 'Нет') :
                   typeof value === 'number' ? value.toLocaleString() :
                   String(value)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timestamps */}
        <div className="mt-6 pt-4 border-t border-stone-200 text-xs text-stone-500">
          <div>Создано: {new Date(item.createdAt).toLocaleString('ru-RU')}</div>
          <div>Обновлено: {new Date(item.updatedAt).toLocaleString('ru-RU')}</div>
        </div>
      </div>
    </div>
  );
}
