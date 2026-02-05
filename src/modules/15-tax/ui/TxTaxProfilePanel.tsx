"use client";

import { User, Building, Flag, Calendar, DollarSign, FileText, Edit2 } from 'lucide-react';

interface TaxProfile {
  id: string;
  clientId: string;
  clientName: string;
  jurisdiction: string;
  taxYear: number;
  filingStatus: string;
  baseCurrency: string;
  taxId: string | null;
  foreignAccountsReporting: boolean;
  estimatedTaxRate: number;
  lastFilingDate: string | null;
  notes: string | null;
}

interface TxTaxProfilePanelProps {
  profile: TaxProfile;
  onEdit?: () => void;
}

const jurisdictionLabels: Record<string, { flag: string; name: string }> = {
  RU: { flag: '🇷🇺', name: 'Российская Федерация' },
  US: { flag: '🇺🇸', name: 'Соединённые Штаты' },
  GB: { flag: '🇬🇧', name: 'Великобритания' },
  AE: { flag: '🇦🇪', name: 'ОАЭ' },
  CH: { flag: '🇨🇭', name: 'Швейцария' },
  SG: { flag: '🇸🇬', name: 'Сингапур' },
  CY: { flag: '🇨🇾', name: 'Кипр' },
};

const filingStatusLabels: Record<string, string> = {
  single: 'Одиночная',
  married_joint: 'Совместная (супруги)',
  married_separate: 'Раздельная (супруги)',
  head_of_household: 'Глава домохозяйства',
  individual: 'Индивидуальная',
  corporate: 'Корпоративная',
};

export function TxTaxProfilePanel({ profile, onEdit }: TxTaxProfilePanelProps) {
  const jurisdiction = jurisdictionLabels[profile.jurisdiction] || { flag: '🌍', name: profile.jurisdiction };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {profile.clientName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-800">{profile.clientName}</h3>
            <div className="text-sm text-stone-500">Налоговый профиль {profile.taxYear}</div>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Jurisdiction */}
        <div className="p-4 bg-stone-50 rounded-xl">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <Flag className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Юрисдикция</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{jurisdiction.flag}</span>
            <span className="font-medium text-stone-800">{jurisdiction.name}</span>
          </div>
        </div>

        {/* Tax Year */}
        <div className="p-4 bg-stone-50 rounded-xl">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Налоговый год</span>
          </div>
          <div className="text-2xl font-bold text-stone-800">{profile.taxYear}</div>
        </div>

        {/* Base Currency */}
        <div className="p-4 bg-stone-50 rounded-xl">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Базовая валюта</span>
          </div>
          <div className="text-2xl font-bold text-stone-800">{profile.baseCurrency}</div>
        </div>

        {/* Filing Status */}
        <div className="p-4 bg-stone-50 rounded-xl">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <User className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Статус подачи</span>
          </div>
          <div className="font-medium text-stone-800">
            {filingStatusLabels[profile.filingStatus] || profile.filingStatus}
          </div>
        </div>

        {/* Tax Rate */}
        <div className="p-4 bg-stone-50 rounded-xl">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <Building className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Расчётная ставка</span>
          </div>
          <div className="text-2xl font-bold text-stone-800">{(profile.estimatedTaxRate * 100).toFixed(0)}%</div>
        </div>

        {/* Tax ID */}
        <div className="p-4 bg-stone-50 rounded-xl">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">ИНН / Tax ID</span>
          </div>
          <div className="font-mono text-stone-800">{profile.taxId || '—'}</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-4 border-t border-stone-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-stone-500">Отчётность по иностранным счетам:</span>{' '}
            <span className={`font-medium ${profile.foreignAccountsReporting ? 'text-amber-600' : 'text-stone-600'}`}>
              {profile.foreignAccountsReporting ? 'Требуется' : 'Не требуется'}
            </span>
          </div>
          <div>
            <span className="text-stone-500">Последняя подача:</span>{' '}
            <span className="font-medium text-stone-800">
              {profile.lastFilingDate
                ? new Date(profile.lastFilingDate).toLocaleDateString('ru-RU')
                : '—'
              }
            </span>
          </div>
        </div>

        {profile.notes && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-xs font-medium text-amber-700 mb-1">Заметки</div>
            <div className="text-sm text-amber-800">{profile.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}
