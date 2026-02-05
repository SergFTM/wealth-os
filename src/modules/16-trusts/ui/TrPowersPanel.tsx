"use client";

import { Shield, CheckCircle, XCircle, Users, Scale, AlertTriangle } from 'lucide-react';

interface TrustPowers {
  id: string;
  trustId: string;
  powersJson: string;
  approvalRulesJson: string;
  lastReviewedAt: string;
  notes: string | null;
}

interface TrPowersPanelProps {
  powers: TrustPowers | null;
}

interface PowerItem {
  key: string;
  label: string;
  value: boolean;
}

interface ApprovalRule {
  key: string;
  label: string;
  value: string | number;
}

const powerLabels: Record<string, string> = {
  canDistribute: 'Распределение средств',
  canChangeBeneficiaries: 'Изменение бенефициаров',
  investmentDiscretion: 'Инвестиционные полномочия',
  canAmendTrust: 'Внесение поправок',
  canRemoveTrustee: 'Смена trustee',
  canAddCoTrustee: 'Добавление со-trustee',
  canRevoke: 'Отзыв траста',
  canDecant: 'Декантация',
  canChangeJurisdiction: 'Смена юрисдикции',
  grantMakingPowers: 'Грантовые полномочия',
  businessOperatingPowers: 'Бизнес-полномочия',
  votingRights: 'Права голоса',
};

const ruleLabels: Record<string, string> = {
  distributionThreshold: 'Порог распределения',
  requiredApprovers: 'Требуется одобрений',
  requiredRoles: 'Требуемые роли',
  beneficiaryChangeRequiresCompliance: 'Согласование изменений бенефициаров',
  largeDistributionThreshold: 'Порог крупного распределения',
  largeDistributionApprovers: 'Одобрений для крупного',
  decantingRequiresUnanimous: 'Единогласие для декантации',
  jurisdictionChangeRequiresUnanimous: 'Единогласие для смены юрисдикции',
  grantThreshold: 'Порог гранта',
  grantApprovers: 'Одобрений для гранта',
  charitableRequirements: 'Благотворительные требования',
  businessDecisionApprovers: 'Одобрений для бизнес-решений',
  successionDecisionRequiresUnanimous: 'Единогласие для наследования',
};

export function TrPowersPanel({ powers }: TrPowersPanelProps) {
  if (!powers) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
        <Shield className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-500">Полномочия траста не определены</p>
      </div>
    );
  }

  let parsedPowers: Record<string, boolean | string> = {};
  let parsedRules: Record<string, unknown> = {};

  try {
    parsedPowers = JSON.parse(powers.powersJson);
    parsedRules = JSON.parse(powers.approvalRulesJson);
  } catch {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <p className="text-stone-500">Ошибка разбора полномочий</p>
      </div>
    );
  }

  const powerItems: PowerItem[] = Object.entries(parsedPowers)
    .filter(([key]) => key !== 'investmentDiscretion')
    .map(([key, value]) => ({
      key,
      label: powerLabels[key] || key,
      value: Boolean(value),
    }));

  const investmentDiscretion = parsedPowers.investmentDiscretion as string;

  const formatRuleValue = (key: string, value: unknown): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Да' : 'Нет';
    }
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('threshold')) {
        return new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        }).format(value);
      }
      return String(value);
    }
    return String(value);
  };

  const ruleItems: ApprovalRule[] = Object.entries(parsedRules)
    .filter(([key]) => key !== 'notes')
    .map(([key, value]) => ({
      key,
      label: ruleLabels[key] || key,
      value: formatRuleValue(key, value),
    }));

  const rulesNotes = parsedRules.notes as string | undefined;

  return (
    <div className="space-y-6">
      {/* Powers Section */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-stone-600" />
            <h3 className="font-semibold text-stone-800">Полномочия траста</h3>
          </div>
        </div>

        <div className="p-4">
          {investmentDiscretion && (
            <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Инвестиционная дискреция: {investmentDiscretion === 'full' ? 'Полная' : investmentDiscretion === 'limited' ? 'Ограниченная' : investmentDiscretion}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {powerItems.map((item) => (
              <div
                key={item.key}
                className={`flex items-center gap-2 p-2.5 rounded-lg ${
                  item.value ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-50 text-stone-500'
                }`}
              >
                {item.value ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approval Rules Section */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-stone-600" />
            <h3 className="font-semibold text-stone-800">Правила одобрения</h3>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            {ruleItems.map((rule) => (
              <div
                key={rule.key}
                className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
              >
                <span className="text-sm text-stone-600">{rule.label}</span>
                <span className="text-sm font-medium text-stone-800">{rule.value}</span>
              </div>
            ))}
          </div>

          {rulesNotes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-800">{rulesNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Last Reviewed */}
      <div className="text-sm text-stone-500 text-center">
        Последний обзор: {new Date(powers.lastReviewedAt).toLocaleDateString('ru-RU')}
        {powers.notes && <span className="mx-2">•</span>}
        {powers.notes && <span>{powers.notes}</span>}
      </div>
    </div>
  );
}
