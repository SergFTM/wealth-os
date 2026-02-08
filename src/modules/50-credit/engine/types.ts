/**
 * Credit Module Types
 */

export interface CreditBank {
  id: string;
  clientId: string;
  name: string;
  regionKey: 'us' | 'eu' | 'uk' | 'ch' | 'sg' | 'other';
  contactsJson?: {
    relationshipManager?: string;
    rmEmail?: string;
    rmPhone?: string;
    creditOfficer?: string;
    coEmail?: string;
  };
  addressJson?: {
    street?: string;
    city?: string;
    country?: string;
  };
  swiftCode?: string;
  notes?: string;
  attachmentDocIdsJson?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreditFacility {
  id: string;
  clientId: string;
  bankId: string;
  name: string;
  facilityTypeKey: 'revolver' | 'term' | 'margin' | 'lombard' | 'bridge' | 'construction';
  currency: string;
  limitAmount: number;
  drawnAmount: number;
  availableAmount: number;
  borrowerEntityIdsJson?: string[];
  startAt?: string;
  maturityAt: string;
  commitmentFeePct?: number;
  statusKey: 'active' | 'closed' | 'pending';
  termsJson?: {
    prepaymentPenalty?: boolean;
    cleanDownRequired?: boolean;
    cleanDownDays?: number;
  };
  attachmentDocIdsJson?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditLoan {
  id: string;
  clientId: string;
  facilityId: string;
  name: string;
  borrowerEntityId?: string;
  principalAmount: number;
  outstandingAmount: number;
  currency: string;
  rateTypeKey: 'fixed' | 'floating';
  baseRateKey?: 'sofr' | 'euribor' | 'sonia' | 'prime' | 'libor';
  spreadPct?: number;
  fixedRatePct?: number;
  currentRatePct?: number;
  amortizationTypeKey: 'interest_only' | 'amortizing' | 'bullet';
  paymentFrequencyKey: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  startAt: string;
  maturityAt: string;
  nextPaymentAt?: string;
  statusKey: 'active' | 'paid_off' | 'default';
  purposeDescription?: string;
  attachmentDocIdsJson?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditCollateral {
  id: string;
  clientId: string;
  linkedType: 'facility' | 'loan';
  linkedId: string;
  collateralTypeKey: 'cash' | 'securities' | 'real_estate' | 'equipment' | 'inventory' | 'receivables' | 'other';
  description?: string;
  currentValue: number;
  currency: string;
  haircutPct: number;
  pledgedValue: number;
  targetLtvPct: number;
  currentLtvPct: number;
  statusKey: 'ok' | 'at_risk' | 'breach';
  assetRefJson?: {
    assetType?: string;
    assetId?: string;
    assetModule?: string;
  };
  lastValuedAt?: string;
  valuationSourceKey?: 'market' | 'appraisal' | 'internal' | 'other';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditCovenant {
  id: string;
  clientId: string;
  linkedType: 'facility' | 'loan';
  linkedId: string;
  name: string;
  covenantTypeKey: 'min_liquidity' | 'max_ltv' | 'min_net_worth' | 'max_leverage' | 'min_ebitda' | 'debt_service_coverage' | 'other';
  thresholdJson: {
    operator: '>=' | '<=' | '>' | '<' | '==';
    value: number;
    unit?: string;
  };
  currentValueJson?: {
    value: number;
    asOf?: string;
    source?: string;
  };
  bufferPct?: number;
  statusKey: 'ok' | 'at_risk' | 'breach';
  testFrequencyKey: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  nextTestAt?: string;
  lastTestAt?: string;
  waiverStatusKey?: 'none' | 'requested' | 'granted' | 'denied';
  waiverExpiresAt?: string;
  calculationMethodDescription?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditPayment {
  id: string;
  clientId: string;
  loanId: string;
  dueAt: string;
  amount: number;
  currency: string;
  principalPart?: number;
  interestPart?: number;
  feesPart?: number;
  statusKey: 'scheduled' | 'paid' | 'late' | 'partial';
  paidAt?: string;
  paidAmount?: number;
  linkedGlStubId?: string;
  linkedCalendarEventId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditSchedule {
  id: string;
  clientId: string;
  loanId: string;
  scheduleJson: ScheduleRow[];
  generatedAt: string;
  methodKey: 'simple' | 'actual_360' | 'actual_365' | '30_360';
  assumedRatePct?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleRow {
  periodNum: number;
  dueAt: string;
  openingBalance: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  closingBalance: number;
}

export interface CovenantTestResult {
  covenantId: string;
  testedAt: string;
  previousStatus: 'ok' | 'at_risk' | 'breach';
  newStatus: 'ok' | 'at_risk' | 'breach';
  currentValue: number;
  threshold: number;
  isCompliant: boolean;
  requiresAction: boolean;
}

export interface LtvCalculation {
  collateralId: string;
  loanOutstanding: number;
  collateralValue: number;
  haircut: number;
  pledgedValue: number;
  ltv: number;
  targetLtv: number;
  status: 'ok' | 'at_risk' | 'breach';
  marginCallAmount?: number;
}
