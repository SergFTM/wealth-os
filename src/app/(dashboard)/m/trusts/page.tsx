"use client";

import { useEffect, useState } from 'react';
import { TrDashboardPage } from '@/modules/16-trusts/ui';

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
  createdAt: string;
  updatedAt: string;
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

export default function TrustsDashboardPage() {
  const [trusts, setTrusts] = useState<Trust[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [calendarTriggers, setCalendarTriggers] = useState<CalendarTrigger[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trustsRes, distributionsRes, calendarsRes, beneficiariesRes] = await Promise.all([
          fetch('/api/collections/trusts'),
          fetch('/api/collections/trustDistributions'),
          fetch('/api/collections/trustCalendars'),
          fetch('/api/collections/beneficiaries'),
        ]);

        const [trustsData, distributionsData, calendarsData, beneficiariesData] = await Promise.all([
          trustsRes.json(),
          distributionsRes.json(),
          calendarsRes.json(),
          beneficiariesRes.json(),
        ]);

        setTrusts(trustsData.items || []);
        setDistributions(distributionsData.items || []);
        setCalendarTriggers(calendarsData.items || []);
        setBeneficiaries(beneficiariesData.items || []);
      } catch (error) {
        console.error('Failed to fetch trust data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const beneficiaryNames = beneficiaries.reduce((acc, b) => {
    acc[b.id] = b.name;
    return acc;
  }, {} as Record<string, string>);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-1/4" />
          <div className="h-4 bg-stone-200 rounded w-1/3" />
          <div className="h-16 bg-amber-100 rounded-xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-stone-200 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 h-64 bg-stone-200 rounded-xl" />
            <div className="h-64 bg-stone-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <TrDashboardPage
        trusts={trusts}
        distributions={distributions}
        calendarTriggers={calendarTriggers}
        beneficiaryNames={beneficiaryNames}
      />
    </div>
  );
}
