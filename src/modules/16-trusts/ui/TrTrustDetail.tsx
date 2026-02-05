"use client";

import { ArrowLeft, Edit, FileText, MapPin, Calendar, DollarSign, Users, UserCheck, Shield, AlertTriangle } from 'lucide-react';
import { TrBeneficiariesTable } from './TrBeneficiariesTable';
import { TrDistributionsTable } from './TrDistributionsTable';
import { TrEventsTable } from './TrEventsTable';
import { TrPowersPanel } from './TrPowersPanel';
import { TrDocumentsPanel } from './TrDocumentsPanel';

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

interface TrustPowers {
  id: string;
  trustId: string;
  powersJson: string;
  approvalRulesJson: string;
  lastReviewedAt: string;
  notes: string | null;
}

interface TrTrustDetailProps {
  trust: Trust;
  beneficiaries: Beneficiary[];
  trustees: Trustee[];
  distributions: Distribution[];
  events: TrustEvent[];
  powers: TrustPowers | null;
  onBack?: () => void;
  onEdit?: () => void;
}

const jurisdictionLabels: Record<string, string> = {
  'US-DE': 'Delaware, США',
  'US-SD': 'South Dakota, США',
  'US-CA': 'California, США',
  'GB': 'Великобритания',
  'JE': 'Jersey',
  'SG': 'Сингапур',
  'HK': 'Гонконг',
};

const trustTypeLabels = {
  revocable: 'Отзывный',
  irrevocable: 'Безотзывный',
};

const statusLabels = {
  active: { label: 'Активен', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  inactive: { label: 'Неактивен', color: 'text-amber-600', bg: 'bg-amber-50' },
  terminated: { label: 'Закрыт', color: 'text-stone-600', bg: 'bg-stone-100' },
};

const roleLabels: Record<string, string> = {
  trustee: 'Trustee',
  co_trustee: 'Co-Trustee',
  protector: 'Protector',
};

export function TrTrustDetail({
  trust,
  beneficiaries,
  trustees,
  distributions,
  events,
  powers,
  onBack,
  onEdit,
}: TrTrustDetailProps) {
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const status = statusLabels[trust.status];
  const activeTrustees = trustees.filter(t => t.status === 'active');
  const trustBeneficiaries = beneficiaries.filter(b => b.trustId === trust.id);
  const trustDistributions = distributions.filter(d => d.trustId === trust.id);
  const trustEvents = events.filter(e => e.trustId === trust.id);

  const beneficiaryNames = trustBeneficiaries.reduce((acc, b) => {
    acc[b.id] = b.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-800 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к списку
            </button>
          )}
          <h1 className="text-2xl font-bold text-stone-800">{trust.name}</h1>
          <p className="text-stone-600 mt-1">{trust.purpose}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${status.bg} ${status.color}`}>
            {status.label}
          </span>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-50 text-stone-700 font-medium rounded-xl border border-stone-200 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Редактировать
            </button>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>Не является юридической консультацией</span>
      </div>

      {/* Trust Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-stone-400" />
            <h3 className="font-semibold text-stone-700">Основная информация</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Тип</span>
              <span className="font-medium text-stone-800">{trustTypeLabels[trust.trustType]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Учредитель</span>
              <span className="font-medium text-stone-800">{trust.settlor}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-stone-500">Юрисдикция</span>
              <span className="font-medium text-stone-800 text-right flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {jurisdictionLabels[trust.jurisdiction] || trust.jurisdiction}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Право</span>
              <span className="font-medium text-stone-800">{trust.governingLaw}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-stone-400" />
            <h3 className="font-semibold text-stone-700">Активы</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Всего активов</span>
              <span className="font-bold text-lg text-stone-800">
                {formatCurrency(trust.totalAssets, trust.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Валюта</span>
              <span className="font-medium text-stone-800">{trust.currency}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Дата создания</span>
              <span className="font-medium text-stone-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {new Date(trust.fundingDate).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-5 h-5 text-stone-400" />
            <h3 className="font-semibold text-stone-700">Управление</h3>
          </div>
          <div className="space-y-2">
            {activeTrustees.map(trustee => (
              <div key={trustee.id} className="flex items-center justify-between text-sm">
                <span className="text-stone-800 font-medium">{trustee.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  trustee.role === 'protector' ? 'bg-purple-50 text-purple-600' :
                  trustee.role === 'co_trustee' ? 'bg-blue-50 text-blue-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {roleLabels[trustee.role]}
                </span>
              </div>
            ))}
            {activeTrustees.length === 0 && (
              <p className="text-sm text-stone-500">Нет назначенных управляющих</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Beneficiaries */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-stone-600" />
            <h2 className="text-lg font-semibold text-stone-800">
              Бенефициары ({trustBeneficiaries.length})
            </h2>
          </div>
          <TrBeneficiariesTable beneficiaries={trustBeneficiaries} />
        </div>

        {/* Powers */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-stone-600" />
            <h2 className="text-lg font-semibold text-stone-800">Полномочия</h2>
          </div>
          <TrPowersPanel powers={powers} />
        </div>
      </div>

      {/* Distributions */}
      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-4">
          Распределения ({trustDistributions.length})
        </h2>
        <TrDistributionsTable
          distributions={trustDistributions}
          beneficiaryNames={beneficiaryNames}
        />
      </div>

      {/* Events */}
      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-4">
          События ({trustEvents.length})
        </h2>
        <TrEventsTable events={trustEvents} />
      </div>

      {/* Documents */}
      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Документы</h2>
        <TrDocumentsPanel documents={[]} />
      </div>

      {/* Notes */}
      {trust.notes && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-700 mb-2">Заметки</h3>
          <p className="text-stone-600">{trust.notes}</p>
        </div>
      )}
    </div>
  );
}
