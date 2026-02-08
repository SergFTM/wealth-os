/**
 * Contract Analyzer Engine
 * Rules-based extraction and analysis of contract terms
 */

export interface ContractAnalysis {
  contractId: string;
  renewalWindow: {
    daysUntilRenewal: number;
    renewalDate: string | null;
    autoRenewal: boolean;
    noticeRequired: number; // days
    urgency: 'none' | 'upcoming' | 'urgent' | 'overdue';
  };
  terminationClause: {
    noticePeriod: number; // days
    hasEarlyTermination: boolean;
    penalties: string | null;
    notes: string;
  };
  feeRisk: {
    level: 'low' | 'medium' | 'high';
    reasons: string[];
    estimatedAnnualCost: number;
    variableComponents: string[];
  };
  keyDates: Array<{
    date: string;
    type: string;
    description: string;
    daysRemaining: number;
  }>;
  flags: Array<{
    type: 'warning' | 'info' | 'critical';
    message: string;
  }>;
  confidence: number;
  assumptions: string[];
}

interface ContractData {
  id: string;
  startAt?: string;
  endAt?: string;
  renewalAt?: string;
  autoRenewal?: boolean;
  terminationNotice?: number;
  terminationNotes?: string;
  feeModelKey?: string;
  feeRulesJson?: {
    baseFee?: number;
    currency?: string;
    frequency?: string;
    aumRate?: number;
    minimumFee?: number;
    maximumFee?: number;
  };
}

/**
 * Analyze contract and extract key insights
 */
export function analyzeContract(contract: ContractData): ContractAnalysis {
  const now = new Date();
  const assumptions: string[] = [];
  const flags: Array<{ type: 'warning' | 'info' | 'critical'; message: string }> = [];

  // Renewal Window Analysis
  let daysUntilRenewal = -1;
  let urgency: ContractAnalysis['renewalWindow']['urgency'] = 'none';

  if (contract.renewalAt) {
    const renewalDate = new Date(contract.renewalAt);
    daysUntilRenewal = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilRenewal < 0) {
      urgency = 'overdue';
      flags.push({ type: 'critical', message: 'Дата продления прошла' });
    } else if (daysUntilRenewal <= 30) {
      urgency = 'urgent';
      flags.push({ type: 'warning', message: 'Требуется срочное решение о продлении' });
    } else if (daysUntilRenewal <= 90) {
      urgency = 'upcoming';
      flags.push({ type: 'info', message: 'Приближается срок продления' });
    }
  } else {
    assumptions.push('Дата продления не указана');
  }

  // Fee Risk Analysis
  let feeRiskLevel: 'low' | 'medium' | 'high' = 'low';
  const feeRiskReasons: string[] = [];
  const variableComponents: string[] = [];
  let estimatedAnnualCost = 0;

  if (contract.feeRulesJson) {
    const rules = contract.feeRulesJson;

    if (rules.baseFee) {
      const frequency = rules.frequency || 'monthly';
      const multiplier = frequency === 'monthly' ? 12 : frequency === 'quarterly' ? 4 : 1;
      estimatedAnnualCost = rules.baseFee * multiplier;
    }

    if (rules.aumRate) {
      variableComponents.push('AUM-based fee');
      feeRiskLevel = 'medium';
      feeRiskReasons.push('Комиссия зависит от AUM');
    }

    if (contract.feeModelKey === 'hybrid') {
      feeRiskLevel = 'medium';
      feeRiskReasons.push('Гибридная модель комиссий требует детального мониторинга');
    }

    if (!rules.maximumFee && (rules.aumRate || contract.feeModelKey === 'hourly')) {
      feeRiskLevel = 'high';
      feeRiskReasons.push('Нет верхнего лимита комиссии');
    }
  } else {
    assumptions.push('Правила расчета комиссий не определены');
  }

  // Key Dates
  const keyDates: ContractAnalysis['keyDates'] = [];

  if (contract.endAt) {
    const endDate = new Date(contract.endAt);
    const daysToEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    keyDates.push({
      date: contract.endAt,
      type: 'contract_end',
      description: 'Окончание контракта',
      daysRemaining: daysToEnd,
    });
  }

  if (contract.renewalAt) {
    keyDates.push({
      date: contract.renewalAt,
      type: 'renewal_deadline',
      description: 'Крайний срок уведомления о продлении',
      daysRemaining: daysUntilRenewal,
    });
  }

  // Termination Analysis
  const terminationNotice = contract.terminationNotice || 30;
  assumptions.push(`Срок уведомления о расторжении: ${terminationNotice} дней`);

  // Calculate confidence based on data completeness
  let confidence = 100;
  if (!contract.renewalAt) confidence -= 15;
  if (!contract.feeRulesJson) confidence -= 20;
  if (!contract.terminationNotes) confidence -= 10;
  if (!contract.startAt || !contract.endAt) confidence -= 15;

  return {
    contractId: contract.id,
    renewalWindow: {
      daysUntilRenewal,
      renewalDate: contract.renewalAt || null,
      autoRenewal: contract.autoRenewal || false,
      noticeRequired: terminationNotice,
      urgency,
    },
    terminationClause: {
      noticePeriod: terminationNotice,
      hasEarlyTermination: !!contract.terminationNotes,
      penalties: null, // Would need NLP to extract
      notes: contract.terminationNotes || 'Не указано',
    },
    feeRisk: {
      level: feeRiskLevel,
      reasons: feeRiskReasons,
      estimatedAnnualCost,
      variableComponents,
    },
    keyDates: keyDates.sort((a, b) => a.daysRemaining - b.daysRemaining),
    flags,
    confidence: Math.max(0, confidence),
    assumptions,
  };
}

/**
 * Get contracts requiring renewal action
 */
export function getContractsNeedingRenewal(
  contracts: ContractData[],
  daysThreshold: number = 90
): ContractData[] {
  const now = new Date();

  return contracts.filter(contract => {
    if (!contract.renewalAt) return false;

    const renewalDate = new Date(contract.renewalAt);
    const daysUntil = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return daysUntil <= daysThreshold && daysUntil >= -30; // Include recently overdue
  });
}

/**
 * Generate renewal memo draft
 */
export function generateRenewalMemoDraft(
  contract: ContractData,
  vendorName: string,
  analysis: ContractAnalysis
): string {
  const lines: string[] = [
    `# Меморандум о продлении контракта`,
    ``,
    `**Провайдер**: ${vendorName}`,
    `**Контракт**: ${contract.id}`,
    `**Дата продления**: ${analysis.renewalWindow.renewalDate || 'Не указана'}`,
    ``,
    `## Ключевые условия`,
    ``,
    `- Срок уведомления: ${analysis.terminationClause.noticePeriod} дней`,
    `- Автопродление: ${analysis.renewalWindow.autoRenewal ? 'Да' : 'Нет'}`,
    `- Оценочная годовая стоимость: $${analysis.feeRisk.estimatedAnnualCost.toLocaleString()}`,
    ``,
    `## Риски`,
    ``,
  ];

  if (analysis.feeRisk.reasons.length > 0) {
    analysis.feeRisk.reasons.forEach(reason => {
      lines.push(`- ${reason}`);
    });
  } else {
    lines.push(`- Существенных рисков не выявлено`);
  }

  lines.push(``);
  lines.push(`## Рекомендации`);
  lines.push(``);
  lines.push(`_Требуется ручное заполнение_`);
  lines.push(``);
  lines.push(`---`);
  lines.push(`*Данный меморандум сгенерирован автоматически и требует проверки.*`);

  return lines.join('\n');
}
