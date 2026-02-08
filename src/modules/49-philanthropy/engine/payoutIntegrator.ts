/**
 * Payout Integrator
 * Links grant payouts to Bill Pay module (Module 6)
 */

export type PayoutMethod = 'check' | 'ach' | 'wire';
export type PayoutStatus = 'scheduled' | 'sent' | 'confirmed';

export interface Payout {
  id: string;
  clientId: string;
  grantId: string;
  entityId?: string;
  amount: number;
  currency: string;
  payoutDate: string;
  methodKey: PayoutMethod;
  statusKey: PayoutStatus;
  linkedPaymentId?: string;
  checkNumber?: string;
  referenceNo?: string;
  approvalsIdsJson?: string[];
  notes?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Grant {
  id: string;
  entityId: string;
  approvedAmount?: number;
  granteeJson?: {
    name?: string;
    address?: string;
  };
}

export interface BillPayPayment {
  id: string;
  payeeId?: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  scheduledDate: string;
  reference?: string;
}

/**
 * Get method display info
 */
export function getMethodInfo(method: PayoutMethod): {
  label: { ru: string; en: string; uk: string };
  icon: string;
} {
  const methodMap: Record<PayoutMethod, {
    label: { ru: string; en: string; uk: string };
    icon: string;
  }> = {
    check: { label: { ru: 'Чек', en: 'Check', uk: 'Чек' }, icon: 'file-text' },
    ach: { label: { ru: 'ACH', en: 'ACH', uk: 'ACH' }, icon: 'credit-card' },
    wire: { label: { ru: 'Wire', en: 'Wire', uk: 'Wire' }, icon: 'dollar-sign' },
  };

  return methodMap[method];
}

/**
 * Get status display info
 */
export function getPayoutStatusInfo(status: PayoutStatus): {
  label: { ru: string; en: string; uk: string };
  color: string;
} {
  const statusMap: Record<PayoutStatus, {
    label: { ru: string; en: string; uk: string };
    color: string;
  }> = {
    scheduled: { label: { ru: 'Запланирована', en: 'Scheduled', uk: 'Заплановано' }, color: 'blue' },
    sent: { label: { ru: 'Отправлена', en: 'Sent', uk: 'Відправлено' }, color: 'amber' },
    confirmed: { label: { ru: 'Подтверждена', en: 'Confirmed', uk: 'Підтверджено' }, color: 'green' },
  };

  return statusMap[status];
}

/**
 * Create payout request from grant
 */
export function createPayoutRequest(
  grant: Grant,
  amount: number,
  method: PayoutMethod,
  payoutDate: string,
  clientId: string
): Omit<Payout, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId,
    grantId: grant.id,
    entityId: grant.entityId,
    amount,
    currency: 'USD',
    payoutDate,
    methodKey: method,
    statusKey: 'scheduled',
    approvalsIdsJson: [],
    notes: `Выплата по гранту для ${grant.granteeJson?.name || 'Получатель'}`,
  };
}

/**
 * Link payout to Bill Pay payment
 * This would integrate with Module 6 in production
 */
export function linkToBillPay(
  payout: Payout,
  paymentId: string
): Payout {
  return {
    ...payout,
    linkedPaymentId: paymentId,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Create Bill Pay payment request
 * This would call Module 6 API in production
 */
export function createBillPayRequest(
  payout: Payout,
  grant: Grant
): Omit<BillPayPayment, 'id'> {
  return {
    amount: payout.amount,
    currency: payout.currency,
    method: payout.methodKey,
    status: 'pending',
    scheduledDate: payout.payoutDate,
    reference: `PHIL-${grant.id}-${payout.id}`,
  };
}

/**
 * Calculate total paid for a grant
 */
export function calculateGrantPaid(payouts: Payout[], grantId: string): number {
  return payouts
    .filter(p => p.grantId === grantId && p.statusKey === 'confirmed')
    .reduce((sum, p) => sum + p.amount, 0);
}

/**
 * Get remaining to pay for a grant
 */
export function getGrantRemainingToPay(
  grant: Grant,
  payouts: Payout[]
): number {
  const approved = grant.approvedAmount || 0;
  const paid = calculateGrantPaid(payouts, grant.id);
  return Math.max(0, approved - paid);
}

/**
 * Get upcoming payouts
 */
export function getUpcomingPayouts(
  payouts: Payout[],
  days: number = 30
): Payout[] {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return payouts
    .filter(p => {
      if (p.statusKey !== 'scheduled') return false;
      const payoutDate = new Date(p.payoutDate);
      return payoutDate >= now && payoutDate <= futureDate;
    })
    .sort((a, b) => new Date(a.payoutDate).getTime() - new Date(b.payoutDate).getTime());
}

/**
 * Get overdue payouts
 */
export function getOverduePayouts(payouts: Payout[]): Payout[] {
  const now = new Date();

  return payouts.filter(p => {
    if (p.statusKey !== 'scheduled') return false;
    const payoutDate = new Date(p.payoutDate);
    return payoutDate < now;
  });
}

/**
 * Validate payout can be processed
 */
export function validatePayout(
  payout: Payout,
  grant: Grant
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (payout.amount <= 0) {
    errors.push('Сумма должна быть положительной');
  }

  const remaining = getGrantRemainingToPay(grant, []);
  if (payout.amount > remaining) {
    errors.push(`Сумма превышает остаток по гранту (${remaining})`);
  }

  if (!payout.payoutDate) {
    errors.push('Не указана дата выплаты');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
