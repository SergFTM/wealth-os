// Checklist Engine
// Generates and manages deal checklists

import { createRecord, updateRecord } from '@/lib/apiClient';

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  ownerRole: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'na';
  dueAt?: string;
  order: number;
}

export interface DealChecklist {
  id: string;
  clientId: string;
  linkedType: 'deal' | 'action' | 'fund_event';
  linkedId: string;
  name: string;
  ownerUserId?: string;
  itemsJson: ChecklistItem[];
  completionPct: number;
}

// Checklist templates by deal type
const CHECKLIST_TEMPLATES: Record<string, Omit<ChecklistItem, 'id'>[]> = {
  subscription: [
    { title: 'Review PPM/Offering Documents', ownerRole: 'legal', status: 'pending', order: 1 },
    { title: 'Compliance Pre-clearance', ownerRole: 'compliance', status: 'pending', order: 2 },
    { title: 'Tax Structure Review', ownerRole: 'tax', status: 'pending', order: 3 },
    { title: 'Investment Committee Approval', ownerRole: 'cio', status: 'pending', order: 4 },
    { title: 'Complete Subscription Agreement', ownerRole: 'legal', status: 'pending', order: 5 },
    { title: 'KYC/AML Documentation', ownerRole: 'compliance', status: 'pending', order: 6 },
    { title: 'Wire Instructions Verified', ownerRole: 'operations', status: 'pending', order: 7 },
    { title: 'Funding Approved', ownerRole: 'cfo', status: 'pending', order: 8 },
  ],
  secondary: [
    { title: 'Seller Due Diligence', ownerRole: 'legal', status: 'pending', order: 1 },
    { title: 'Valuation Analysis', ownerRole: 'cio', status: 'pending', order: 2 },
    { title: 'ROFR Check', ownerRole: 'legal', status: 'pending', order: 3 },
    { title: 'Transfer Restrictions Review', ownerRole: 'legal', status: 'pending', order: 4 },
    { title: 'Compliance Clearance', ownerRole: 'compliance', status: 'pending', order: 5 },
    { title: 'Tax Implications Review', ownerRole: 'tax', status: 'pending', order: 6 },
    { title: 'Purchase Agreement Executed', ownerRole: 'legal', status: 'pending', order: 7 },
    { title: 'GP Consent Obtained', ownerRole: 'operations', status: 'pending', order: 8 },
  ],
  co_invest: [
    { title: 'Deal Memo Review', ownerRole: 'cio', status: 'pending', order: 1 },
    { title: 'Co-invest Terms Analysis', ownerRole: 'legal', status: 'pending', order: 2 },
    { title: 'Allocation Decision', ownerRole: 'cio', status: 'pending', order: 3 },
    { title: 'Compliance Review', ownerRole: 'compliance', status: 'pending', order: 4 },
    { title: 'Tax Structure Confirmation', ownerRole: 'tax', status: 'pending', order: 5 },
    { title: 'Side Letter Negotiation', ownerRole: 'legal', status: 'pending', order: 6 },
    { title: 'Execution Documents', ownerRole: 'legal', status: 'pending', order: 7 },
    { title: 'Capital Call Processing', ownerRole: 'operations', status: 'pending', order: 8 },
  ],
  spv: [
    { title: 'SPV Structure Review', ownerRole: 'legal', status: 'pending', order: 1 },
    { title: 'Operating Agreement Review', ownerRole: 'legal', status: 'pending', order: 2 },
    { title: 'Tax Opinion Obtained', ownerRole: 'tax', status: 'pending', order: 3 },
    { title: 'Investor Suitability Check', ownerRole: 'compliance', status: 'pending', order: 4 },
    { title: 'Investment Committee Approval', ownerRole: 'cio', status: 'pending', order: 5 },
    { title: 'Subscription Documents', ownerRole: 'legal', status: 'pending', order: 6 },
    { title: 'Wire Transfer Setup', ownerRole: 'operations', status: 'pending', order: 7 },
    { title: 'Post-Closing Checklist', ownerRole: 'operations', status: 'pending', order: 8 },
  ],
  fund_commitment: [
    { title: 'Fund Due Diligence Report', ownerRole: 'cio', status: 'pending', order: 1 },
    { title: 'Manager Background Check', ownerRole: 'compliance', status: 'pending', order: 2 },
    { title: 'LPA Review', ownerRole: 'legal', status: 'pending', order: 3 },
    { title: 'Side Letter Requests', ownerRole: 'legal', status: 'pending', order: 4 },
    { title: 'Tax Structure Analysis', ownerRole: 'tax', status: 'pending', order: 5 },
    { title: 'Investment Committee Approval', ownerRole: 'cio', status: 'pending', order: 6 },
    { title: 'Commitment Letter Signed', ownerRole: 'legal', status: 'pending', order: 7 },
    { title: 'Cash Reserve Allocation', ownerRole: 'cfo', status: 'pending', order: 8 },
  ],
  corporate_action: [
    { title: 'Action Details Verified', ownerRole: 'operations', status: 'pending', order: 1 },
    { title: 'Position Impact Calculated', ownerRole: 'operations', status: 'pending', order: 2 },
    { title: 'Tax Implications Reviewed', ownerRole: 'tax', status: 'pending', order: 3 },
    { title: 'Election Decision (if applicable)', ownerRole: 'cio', status: 'pending', order: 4 },
    { title: 'Custodian Notified', ownerRole: 'operations', status: 'pending', order: 5 },
    { title: 'GL Entries Prepared', ownerRole: 'cfo', status: 'pending', order: 6 },
  ],
  fund_event: [
    { title: 'Notice Received and Reviewed', ownerRole: 'operations', status: 'pending', order: 1 },
    { title: 'Amount Verified', ownerRole: 'operations', status: 'pending', order: 2 },
    { title: 'Cash Availability Confirmed', ownerRole: 'cfo', status: 'pending', order: 3 },
    { title: 'Wire Instructions Verified', ownerRole: 'operations', status: 'pending', order: 4 },
    { title: 'Payment Authorized', ownerRole: 'cfo', status: 'pending', order: 5 },
    { title: 'Payment Confirmed', ownerRole: 'operations', status: 'pending', order: 6 },
  ],
};

// Generate checklist from template
export function generateChecklist(
  dealType: string,
  linkedType: 'deal' | 'action' | 'fund_event',
  linkedId: string,
  linkedName: string,
  clientId: string
): Omit<DealChecklist, 'id' | 'createdAt' | 'updatedAt'> {
  const template = CHECKLIST_TEMPLATES[dealType] || CHECKLIST_TEMPLATES.subscription;

  const items: ChecklistItem[] = template.map((item, index) => ({
    ...item,
    id: `item-${index + 1}`,
  }));

  return {
    clientId,
    linkedType,
    linkedId,
    name: `Checklist: ${linkedName}`,
    itemsJson: items,
    completionPct: 0,
  };
}

// Create checklist record
export async function createChecklist(
  dealType: string,
  linkedType: 'deal' | 'action' | 'fund_event',
  linkedId: string,
  linkedName: string,
  clientId: string,
  ownerUserId?: string
): Promise<DealChecklist | null> {
  const checklistData = generateChecklist(dealType, linkedType, linkedId, linkedName, clientId);

  return await createRecord<DealChecklist>('dlChecklists', {
    ...checklistData,
    ownerUserId,
  });
}

// Update checklist item status
export async function updateChecklistItem(
  checklistId: string,
  itemId: string,
  status: ChecklistItem['status'],
  completedBy?: string
): Promise<DealChecklist | null> {
  // This would fetch, update item, recalculate completion, and save
  // Simplified for demo
  return null;
}

// Calculate completion percentage
export function calculateCompletionPct(items: ChecklistItem[]): number {
  const countable = items.filter(i => i.status !== 'na');
  if (countable.length === 0) return 100;

  const completed = countable.filter(i => i.status === 'completed').length;
  return Math.round((completed / countable.length) * 100);
}

// Add custom item to checklist
export function addCustomItem(
  items: ChecklistItem[],
  title: string,
  ownerRole: string,
  dueAt?: string
): ChecklistItem[] {
  const newItem: ChecklistItem = {
    id: `item-custom-${Date.now()}`,
    title,
    ownerRole,
    status: 'pending',
    dueAt,
    order: items.length + 1,
  };
  return [...items, newItem];
}

// Get items by owner role
export function getItemsByRole(items: ChecklistItem[], role: string): ChecklistItem[] {
  return items.filter(i => i.ownerRole === role);
}

// Get overdue items
export function getOverdueItems(items: ChecklistItem[]): ChecklistItem[] {
  const now = new Date();
  return items.filter(i =>
    i.status !== 'completed' &&
    i.status !== 'na' &&
    i.dueAt &&
    new Date(i.dueAt) < now
  );
}

export default {
  generateChecklist,
  createChecklist,
  updateChecklistItem,
  calculateCompletionPct,
  addCustomItem,
  getItemsByRole,
  getOverdueItems,
  CHECKLIST_TEMPLATES,
};
