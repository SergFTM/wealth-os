/**
 * Compliance Engine
 * Manages compliance checks for grants (sanctions, KYC, conflict, board approval)
 */

export type ComplianceCheckType = 'sanctions' | 'kyc' | 'conflict' | 'board';
export type ComplianceStatus = 'open' | 'cleared' | 'flagged';

export interface ComplianceCheck {
  id: string;
  clientId: string;
  grantId: string;
  entityId?: string;
  checkTypeKey: ComplianceCheckType;
  statusKey: ComplianceStatus;
  assigneeUserId?: string;
  notes?: string;
  findingsMarkdown?: string;
  evidenceDocIdsJson?: string[];
  exceptionId?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Grant {
  id: string;
  granteeJson?: {
    name?: string;
    country?: string;
    regNo?: string;
  };
}

export interface ComplianceCheckResult {
  success: boolean;
  check?: ComplianceCheck;
  error?: string;
}

export interface ComplianceSummary {
  total: number;
  open: number;
  cleared: number;
  flagged: number;
  byType: Record<ComplianceCheckType, { open: number; cleared: number; flagged: number }>;
}

/**
 * Default compliance checks to create for a new grant
 */
export const DEFAULT_CHECKS: ComplianceCheckType[] = ['sanctions', 'kyc', 'conflict', 'board'];

/**
 * Get check type display info
 */
export function getCheckTypeInfo(type: ComplianceCheckType): {
  label: { ru: string; en: string; uk: string };
  description: { ru: string; en: string; uk: string };
  color: string;
} {
  const typeMap: Record<ComplianceCheckType, {
    label: { ru: string; en: string; uk: string };
    description: { ru: string; en: string; uk: string };
    color: string;
  }> = {
    sanctions: {
      label: { ru: 'Санкции', en: 'Sanctions', uk: 'Санкції' },
      description: {
        ru: 'Проверка получателя по санкционным спискам OFAC, EU, UN',
        en: 'Screen grantee against OFAC, EU, UN sanctions lists',
        uk: 'Перевірка отримувача за санкційними списками OFAC, EU, UN',
      },
      color: 'red',
    },
    kyc: {
      label: { ru: 'KYC', en: 'KYC', uk: 'KYC' },
      description: {
        ru: 'Проверка документов и регистрации получателя',
        en: 'Verify grantee documents and registration',
        uk: 'Перевірка документів і реєстрації отримувача',
      },
      color: 'blue',
    },
    conflict: {
      label: { ru: 'Конфликт интересов', en: 'Conflict of Interest', uk: 'Конфлікт інтересів' },
      description: {
        ru: 'Проверка на конфликт интересов с членами семьи/правления',
        en: 'Check for conflicts with family members/board',
        uk: 'Перевірка на конфлікт інтересів з членами родини/правління',
      },
      color: 'amber',
    },
    board: {
      label: { ru: 'Правление', en: 'Board Approval', uk: 'Правління' },
      description: {
        ru: 'Получение одобрения правления фонда',
        en: 'Obtain foundation board approval',
        uk: 'Отримання схвалення правління фонду',
      },
      color: 'purple',
    },
  };

  return typeMap[type];
}

/**
 * Get status display info
 */
export function getStatusInfo(status: ComplianceStatus): {
  label: { ru: string; en: string; uk: string };
  color: string;
} {
  const statusMap: Record<ComplianceStatus, {
    label: { ru: string; en: string; uk: string };
    color: string;
  }> = {
    open: { label: { ru: 'Открыта', en: 'Open', uk: 'Відкрито' }, color: 'amber' },
    cleared: { label: { ru: 'Закрыта', en: 'Cleared', uk: 'Закрито' }, color: 'green' },
    flagged: { label: { ru: 'Флаг', en: 'Flagged', uk: 'Флаг' }, color: 'red' },
  };

  return statusMap[status];
}

/**
 * Create default compliance checks for a grant
 */
export function createDefaultChecks(
  grantId: string,
  clientId: string,
  entityId?: string
): Omit<ComplianceCheck, 'id' | 'createdAt' | 'updatedAt'>[] {
  return DEFAULT_CHECKS.map(checkType => ({
    clientId,
    grantId,
    entityId,
    checkTypeKey: checkType,
    statusKey: 'open' as ComplianceStatus,
    notes: '',
    evidenceDocIdsJson: [],
  }));
}

/**
 * Run mock sanctions screening (MVP stub)
 * In production, this would call external API
 */
export function runSanctionsScreening(
  granteeName: string,
  granteeCountry?: string
): { cleared: boolean; matches: string[] } {
  // MVP: Always clear with warning for certain countries
  const highRiskCountries = ['KP', 'IR', 'SY', 'CU', 'RU', 'BY'];

  if (granteeCountry && highRiskCountries.includes(granteeCountry.toUpperCase())) {
    return {
      cleared: false,
      matches: [`Получатель в юрисдикции высокого риска: ${granteeCountry}`],
    };
  }

  // MVP stub: random clear
  return {
    cleared: true,
    matches: [],
  };
}

/**
 * Calculate compliance summary for a set of checks
 */
export function calculateComplianceSummary(checks: ComplianceCheck[]): ComplianceSummary {
  const summary: ComplianceSummary = {
    total: checks.length,
    open: 0,
    cleared: 0,
    flagged: 0,
    byType: {
      sanctions: { open: 0, cleared: 0, flagged: 0 },
      kyc: { open: 0, cleared: 0, flagged: 0 },
      conflict: { open: 0, cleared: 0, flagged: 0 },
      board: { open: 0, cleared: 0, flagged: 0 },
    },
  };

  checks.forEach(check => {
    summary[check.statusKey]++;
    summary.byType[check.checkTypeKey][check.statusKey]++;
  });

  return summary;
}

/**
 * Check if all compliance checks are cleared for a grant
 */
export function isComplianceCleared(checks: ComplianceCheck[], grantId: string): boolean {
  const grantChecks = checks.filter(c => c.grantId === grantId);
  if (grantChecks.length === 0) return false;
  return grantChecks.every(c => c.statusKey === 'cleared');
}

/**
 * Check if any compliance checks are flagged for a grant
 */
export function hasComplianceFlags(checks: ComplianceCheck[], grantId: string): boolean {
  return checks.some(c => c.grantId === grantId && c.statusKey === 'flagged');
}

/**
 * Get open compliance checks for a grant
 */
export function getOpenChecks(checks: ComplianceCheck[], grantId: string): ComplianceCheck[] {
  return checks.filter(c => c.grantId === grantId && c.statusKey === 'open');
}
