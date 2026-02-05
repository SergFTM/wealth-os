"use client";

import { User, Users, Building2, Heart, GraduationCap, Briefcase } from 'lucide-react';

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

interface TrBeneficiariesTableProps {
  beneficiaries: Beneficiary[];
  onRowClick?: (beneficiary: Beneficiary) => void;
  showTrustColumn?: boolean;
  trustNames?: Record<string, string>;
}

const typeConfig = {
  primary: { label: 'Основной', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  contingent: { label: 'Условный', color: 'text-amber-600', bg: 'bg-amber-50' },
};

const relationshipIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  spouse: Heart,
  son: User,
  daughter: User,
  grandson: User,
  granddaughter: User,
  descendants: Users,
  family: Users,
  charity: Building2,
  settlor: User,
  program: GraduationCap,
  default: Briefcase,
};

const relationshipLabels: Record<string, string> = {
  spouse: 'Супруг(а)',
  son: 'Сын',
  daughter: 'Дочь',
  grandson: 'Внук',
  granddaughter: 'Внучка',
  descendants: 'Потомки',
  family: 'Семья',
  charity: 'Благотворительность',
  settlor: 'Учредитель',
  program: 'Программа',
};

export function TrBeneficiariesTable({
  beneficiaries,
  onRowClick,
  showTrustColumn = false,
  trustNames = {}
}: TrBeneficiariesTableProps) {
  const calculateAge = (dob: string | null): string | null => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} лет`;
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Бенефициар</th>
              {showTrustColumn && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Траст</th>
              )}
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Тип</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Родство</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Доля</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Права</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Возраст</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.map((ben) => {
              const benType = typeConfig[ben.beneficiaryType];
              const RelIcon = relationshipIcons[ben.relationship] || relationshipIcons.default;
              const relLabel = relationshipLabels[ben.relationship] || ben.relationship;
              const age = calculateAge(ben.dateOfBirth);

              return (
                <tr
                  key={ben.id}
                  onClick={() => onRowClick?.(ben)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                        <RelIcon className="w-4 h-4 text-stone-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-stone-800">{ben.name}</div>
                        {ben.notes && (
                          <div className="text-xs text-stone-500 line-clamp-1">{ben.notes}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  {showTrustColumn && (
                    <td className="px-4 py-3 text-stone-600">
                      {trustNames[ben.trustId] || ben.trustId}
                    </td>
                  )}
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg ${benType.bg} ${benType.color}`}>
                      {benType.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-700">
                    {relLabel}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-stone-700">
                    {ben.sharePct !== null ? `${ben.sharePct}%` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-stone-600 text-xs line-clamp-2 max-w-xs">
                      {ben.rightsSummary}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    {age || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {beneficiaries.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет бенефициаров для отображения
        </div>
      )}
    </div>
  );
}
