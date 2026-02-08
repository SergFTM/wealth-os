"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { VdStatusPill } from './VdStatusPill';
import { VdSeverityPill } from './VdSeverityPill';
import { VdContractsTable } from './VdContractsTable';
import { VdSlasTable } from './VdSlasTable';
import { VdScorecardsTable } from './VdScorecardsTable';
import { VdIncidentsTable } from './VdIncidentsTable';
import { VdInvoicesTable } from './VdInvoicesTable';
import { VdAccessPanel } from './VdAccessPanel';

interface Vendor {
  id: string;
  name: string;
  vendorType: string;
  status: 'active' | 'paused' | 'onboarding' | 'terminated';
  primaryContactJson?: {
    name?: string;
    email?: string;
    phone?: string;
    title?: string;
  };
  servicesJson?: string[];
  regionsJson?: string[];
  riskRatingKey?: 'low' | 'medium' | 'high';
  onboardingJson?: {
    kycStatus?: string;
    kybStatus?: string;
    securityQuestionnaireStatus?: string;
    accessSetupStatus?: string;
  };
  website?: string;
  addressJson?: {
    city?: string;
    country?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface VdVendorDetailProps {
  vendor: Vendor;
  contracts?: Array<{ id: string; name: string; status: string; [key: string]: unknown }>;
  slas?: Array<{ id: string; serviceKey: string; status: string; [key: string]: unknown }>;
  scorecards?: Array<{ id: string; periodStart: string; periodEnd: string; overallScore: number; [key: string]: unknown }>;
  incidents?: Array<{ id: string; title: string; status: string; severity: string; [key: string]: unknown }>;
  invoices?: Array<{ id: string; invoiceRef: string; amount: number; [key: string]: unknown }>;
  accessGrants?: Array<{ id: string; grantedTo: string; status: string; [key: string]: unknown }>;
  onEdit?: () => void;
  onCreateContract?: () => void;
  onCreateIncident?: () => void;
  onBack?: () => void;
}

const vendorTypeLabels: Record<string, string> = {
  bank: 'Банк',
  broker: 'Брокер',
  auditor: 'Аудитор',
  legal: 'Юрист',
  tax_advisor: 'Налоговый консультант',
  custodian: 'Кастодиан',
  it: 'IT Провайдер',
  insurance: 'Страхование',
  consultant: 'Консультант',
  other: 'Другое',
};

const tabs = [
  { key: 'overview', label: 'Обзор' },
  { key: 'contracts', label: 'Контракты' },
  { key: 'slas', label: 'SLA' },
  { key: 'scorecards', label: 'Scorecards' },
  { key: 'incidents', label: 'Инциденты' },
  { key: 'invoices', label: 'Счета' },
  { key: 'access', label: 'Доступ' },
  { key: 'documents', label: 'Документы' },
  { key: 'audit', label: 'Audit' },
];

export function VdVendorDetail({
  vendor,
  contracts = [],
  slas = [],
  scorecards = [],
  incidents = [],
  invoices = [],
  accessGrants = [],
  onEdit,
  onCreateContract,
  onCreateIncident,
  onBack,
}: VdVendorDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="mt-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-stone-800">{vendor.name}</h1>
                <VdStatusPill status={vendor.status} size="md" />
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                <span>{vendorTypeLabels[vendor.vendorType] || vendor.vendorType}</span>
                {vendor.riskRatingKey && (
                  <>
                    <span>·</span>
                    <VdSeverityPill severity={vendor.riskRatingKey} variant="risk" />
                  </>
                )}
                {vendor.website && (
                  <>
                    <span>·</span>
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Website
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {onCreateIncident && (
              <Button variant="secondary" onClick={onCreateIncident}>
                Создать инцидент
              </Button>
            )}
            {onCreateContract && (
              <Button variant="secondary" onClick={onCreateContract}>
                Создать контракт
              </Button>
            )}
            {onEdit && (
              <Button variant="primary" onClick={onEdit}>
                Редактировать
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-6 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label}
              {tab.key === 'contracts' && contracts.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-stone-100 rounded">{contracts.length}</span>
              )}
              {tab.key === 'incidents' && incidents.filter(i => i.status === 'open').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                  {incidents.filter(i => i.status === 'open').length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
        {activeTab === 'overview' && (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-3">Контактная информация</h3>
              <div className="space-y-2 text-sm">
                {vendor.primaryContactJson?.name && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Контакт</span>
                    <span className="text-stone-800">{vendor.primaryContactJson.name}</span>
                  </div>
                )}
                {vendor.primaryContactJson?.title && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Должность</span>
                    <span className="text-stone-800">{vendor.primaryContactJson.title}</span>
                  </div>
                )}
                {vendor.primaryContactJson?.email && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Email</span>
                    <a href={`mailto:${vendor.primaryContactJson.email}`} className="text-blue-600">
                      {vendor.primaryContactJson.email}
                    </a>
                  </div>
                )}
                {vendor.primaryContactJson?.phone && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Телефон</span>
                    <span className="text-stone-800">{vendor.primaryContactJson.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Onboarding */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-3">Статус онбординга</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">KYC</span>
                  <VdStatusPill status={vendor.onboardingJson?.kycStatus as 'active' || 'pending' as 'paused'} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">KYB</span>
                  <VdStatusPill status={vendor.onboardingJson?.kybStatus as 'active' || 'pending' as 'paused'} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Security Questionnaire</span>
                  <VdStatusPill status={vendor.onboardingJson?.securityQuestionnaireStatus as 'active' || 'pending' as 'paused'} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Access Setup</span>
                  <VdStatusPill status={vendor.onboardingJson?.accessSetupStatus as 'active' || 'pending' as 'paused'} />
                </div>
              </div>
            </div>

            {/* Services */}
            {vendor.servicesJson && vendor.servicesJson.length > 0 && (
              <div>
                <h3 className="font-semibold text-stone-800 mb-3">Услуги</h3>
                <div className="flex flex-wrap gap-2">
                  {vendor.servicesJson.map((service, idx) => (
                    <span key={idx} className="px-2 py-1 text-sm bg-stone-100 rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Regions */}
            {vendor.regionsJson && vendor.regionsJson.length > 0 && (
              <div>
                <h3 className="font-semibold text-stone-800 mb-3">Регионы</h3>
                <div className="flex flex-wrap gap-2">
                  {vendor.regionsJson.map((region, idx) => (
                    <span key={idx} className="px-2 py-1 text-sm bg-blue-50 text-blue-700 rounded">
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {vendor.notes && (
              <div className="lg:col-span-2">
                <h3 className="font-semibold text-stone-800 mb-3">Заметки</h3>
                <p className="text-sm text-stone-600">{vendor.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'contracts' && (
          <VdContractsTable
            contracts={contracts as Array<{ id: string; name: string; status: 'draft' | 'active' | 'expiring' | 'expired' | 'terminated'; vendorId: string }>}
            showVendor={false}
          />
        )}

        {activeTab === 'slas' && (
          <VdSlasTable
            slas={slas as Array<{ id: string; vendorId: string; serviceKey: string; status: 'ok' | 'warning' | 'breached' }>}
          />
        )}

        {activeTab === 'scorecards' && (
          <VdScorecardsTable
            scorecards={scorecards as Array<{ id: string; vendorId: string; periodStart: string; periodEnd: string; overallScore: number }>}
          />
        )}

        {activeTab === 'incidents' && (
          <VdIncidentsTable
            incidents={incidents as Array<{ id: string; vendorId: string; title: string; status: 'open' | 'in_progress' | 'resolved' | 'closed'; severity: 'low' | 'medium' | 'high' | 'critical' }>}
          />
        )}

        {activeTab === 'invoices' && (
          <VdInvoicesTable
            invoices={invoices as Array<{ id: string; vendorId: string; invoiceRef: string; amount: number; invoiceDate: string }>}
            showVendor={false}
          />
        )}

        {activeTab === 'access' && (
          <div className="p-6">
            <VdAccessPanel
              grants={accessGrants as Array<{ id: string; vendorId: string; grantedTo: string; scope: string; status: 'active' | 'expired' | 'revoked'; grantedAt: string }>}
            />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="p-8 text-center text-stone-500">
            Документы из Document Vault
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="p-8 text-center text-stone-500">
            Audit trail загружается из API
          </div>
        )}
      </div>
    </div>
  );
}
