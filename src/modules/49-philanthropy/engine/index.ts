// Grant Workflow - primary source for Grant and stage types
export {
  type GrantStage,
  type GrantTransitionResult,
  type Grant,
  type Approval,
  canTransition,
  getAllowedTransitions,
  getTransitionBlockers,
  transitionGrant,
  getStageInfo,
  getGrantProgress,
} from './grantsWorkflow';

// Budget Engine
export {
  type Budget,
  type ProgramAllocation,
  type BudgetSummary,
  calculateCommitted,
  calculatePaid,
  computeBudgetSummary,
  getBudgetStatus,
  formatBudgetAmount,
  getScheduledPayouts,
  sumScheduledPayouts,
} from './budgetEngine';
export type { Payout as BudgetPayout } from './budgetEngine';

// Compliance Engine - primary source for ComplianceCheck
export {
  type ComplianceCheckType,
  type ComplianceStatus,
  type ComplianceCheck,
  type ComplianceCheckResult,
  type ComplianceSummary,
  DEFAULT_CHECKS,
  getCheckTypeInfo,
  getStatusInfo,
  createDefaultChecks,
  runSanctionsScreening,
  calculateComplianceSummary,
  isComplianceCleared,
  hasComplianceFlags,
  getOpenChecks,
} from './complianceEngine';

// Impact Engine - primary source for Program and ImpactReport
export {
  type ImpactStatus,
  type ImpactReport,
  type ImpactMetrics,
  type CustomMetric,
  type Program,
  getImpactStatusInfo,
  generateReportTemplate,
  aggregateMetrics,
  compareWithTargets,
  getReportsDue,
  canPublishToPortal,
} from './impactEngine';

// Payout Integrator - primary source for Payout
export {
  type PayoutMethod,
  type PayoutStatus,
  type Payout,
  type BillPayPayment,
  getMethodInfo,
  getPayoutStatusInfo,
  createPayoutRequest,
  linkToBillPay,
  createBillPayRequest,
  calculateGrantPaid,
  getGrantRemainingToPay,
  getUpcomingPayouts,
  getOverduePayouts,
  validatePayout,
} from './payoutIntegrator';

// AI Phil Assistant
export {
  type AIResponse,
  generateGrantSummary,
  generateDDChecklist,
  generateImpactNarrative,
  detectMissingDocs,
} from './aiPhilAssistant';
