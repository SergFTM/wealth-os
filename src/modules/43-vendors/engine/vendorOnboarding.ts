/**
 * Vendor Onboarding Engine
 * Manages vendor onboarding checklist and status tracking
 */

export interface OnboardingStatus {
  kycStatus: 'pending' | 'in_progress' | 'completed' | 'expired';
  kybStatus: 'pending' | 'in_progress' | 'completed' | 'expired';
  securityQuestionnaireStatus: 'pending' | 'in_progress' | 'completed' | 'expired';
  accessSetupStatus: 'pending' | 'in_progress' | 'completed';
  linkedKycCaseId?: string;
  linkedSecurityCenterId?: string;
  completedAt?: string;
}

export interface OnboardingChecklistItem {
  key: string;
  title: { ru: string; en: string };
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  required: boolean;
  linkedModule?: string;
  linkedId?: string;
  expiresAt?: string;
  completedAt?: string;
}

export interface OnboardingResult {
  vendorId: string;
  overallStatus: 'incomplete' | 'in_progress' | 'completed' | 'expired';
  completionPercent: number;
  checklist: OnboardingChecklistItem[];
  blockers: string[];
  nextActions: string[];
}

/**
 * Get onboarding checklist for a vendor
 */
export function getOnboardingChecklist(onboarding: OnboardingStatus | null): OnboardingChecklistItem[] {
  const status = onboarding || {
    kycStatus: 'pending',
    kybStatus: 'pending',
    securityQuestionnaireStatus: 'pending',
    accessSetupStatus: 'pending',
  };

  return [
    {
      key: 'kyc',
      title: { ru: 'KYC проверка', en: 'KYC Verification' },
      status: status.kycStatus,
      required: true,
      linkedModule: 'onboarding',
      linkedId: status.linkedKycCaseId,
    },
    {
      key: 'kyb',
      title: { ru: 'KYB проверка', en: 'KYB Verification' },
      status: status.kybStatus,
      required: true,
      linkedModule: 'onboarding',
      linkedId: status.linkedKycCaseId,
    },
    {
      key: 'security_questionnaire',
      title: { ru: 'Security Questionnaire', en: 'Security Questionnaire' },
      status: status.securityQuestionnaireStatus,
      required: true,
      linkedModule: 'security',
      linkedId: status.linkedSecurityCenterId,
    },
    {
      key: 'access_setup',
      title: { ru: 'Настройка доступов', en: 'Access Setup' },
      status: status.accessSetupStatus,
      required: false,
    },
  ];
}

/**
 * Calculate onboarding status for a vendor
 */
export function calculateOnboardingStatus(onboarding: OnboardingStatus | null): OnboardingResult {
  const checklist = getOnboardingChecklist(onboarding);

  const completedItems = checklist.filter(item => item.status === 'completed').length;
  const requiredItems = checklist.filter(item => item.required);
  const completedRequired = requiredItems.filter(item => item.status === 'completed').length;
  const expiredItems = checklist.filter(item => item.status === 'expired');

  const completionPercent = Math.round((completedItems / checklist.length) * 100);

  let overallStatus: OnboardingResult['overallStatus'] = 'incomplete';

  if (expiredItems.length > 0) {
    overallStatus = 'expired';
  } else if (completedRequired === requiredItems.length) {
    overallStatus = 'completed';
  } else if (checklist.some(item => item.status === 'in_progress')) {
    overallStatus = 'in_progress';
  }

  const blockers: string[] = [];
  const nextActions: string[] = [];

  checklist.forEach(item => {
    if (item.required && item.status !== 'completed') {
      if (item.status === 'expired') {
        blockers.push(`${item.title.ru} истекло и требует обновления`);
      } else if (item.status === 'pending') {
        nextActions.push(`Начать ${item.title.ru}`);
      }
    }
  });

  return {
    vendorId: '',
    overallStatus,
    completionPercent,
    checklist,
    blockers,
    nextActions,
  };
}

/**
 * Check if vendor onboarding is complete
 */
export function isOnboardingComplete(onboarding: OnboardingStatus | null): boolean {
  const result = calculateOnboardingStatus(onboarding);
  return result.overallStatus === 'completed';
}

/**
 * Get onboarding progress percentage
 */
export function getOnboardingProgress(onboarding: OnboardingStatus | null): number {
  const result = calculateOnboardingStatus(onboarding);
  return result.completionPercent;
}

/**
 * Create initial onboarding status
 */
export function createInitialOnboarding(): OnboardingStatus {
  return {
    kycStatus: 'pending',
    kybStatus: 'pending',
    securityQuestionnaireStatus: 'pending',
    accessSetupStatus: 'pending',
  };
}
