// Module 43: Vendors and Service Providers

export { vendorsConfig, config } from './config';
export * from './config';

// Re-export from engine with renamed SlaStatus to avoid conflict with config.ts
export {
  // vendorOnboarding
  getOnboardingChecklist,
  calculateOnboardingStatus,
  isOnboardingComplete,
  getOnboardingProgress,
  createInitialOnboarding,
  type OnboardingStatus,
  type OnboardingChecklistItem,
  type OnboardingResult,
  // contractAnalyzer
  analyzeContract,
  getContractsNeedingRenewal,
  generateRenewalMemoDraft,
  type ContractAnalysis,
  // feeVerifier
  verifyInvoiceFee,
  batchVerifyInvoices,
  getAnomalousInvoices,
  calculateVendorSpend,
  type FeeVerificationResult,
  // slaMonitor - rename SlaStatus to SlaStatusResult
  calculateSlaMetrics,
  evaluateSlaStatus,
  getSlasRequiringAttention,
  createSlaBreachNotification,
  calculateVendorSlaCompliance,
  type SlaMetrics,
  type SlaStatus as SlaStatusResult,
  type SlaBreachEvent,
  type SlaKpi,
  // scorecardEngine
  generateScorecard,
  getScoreCategory,
  getVendorsNeedingAttention,
  type ScorecardCriteria,
  type CriteriaScore,
  type ScorecardResult,
  // aiVendorAssistant
  summarizeContract,
  explainAnomalies,
  draftRenewalMemo,
  type AiAssistantResult,
} from './engine';

export * from './ui';
export * from './types';
