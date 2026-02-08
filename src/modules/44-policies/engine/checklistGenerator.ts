import { BaseRecord } from '@/db/storage/storage.types';

export interface SopStep {
  orderIndex: number;
  title: string;
  description?: string;
  responsibleRole?: string;
  estimatedMinutes?: number;
}

export interface ChecklistStep {
  orderIndex: number;
  title: string;
  description?: string;
  responsibleRole?: string;
}

export interface PolicyChecklist extends BaseRecord {
  clientId: string;
  name: string;
  linkedSopId?: string;
  linkedSopTitle?: string;
  stepsJson: ChecklistStep[];
  usageCount: number;
  lastUsedAt?: string;
  createdByUserId?: string;
  createdByName?: string;
}

export interface GenerateChecklistInput {
  clientId: string;
  sopId: string;
  sopTitle: string;
  stepsJson?: SopStep[];
  bodyMd?: string;
  checklistName?: string;
  createdByUserId?: string;
  createdByName?: string;
}

export function extractStepsFromMarkdown(markdown: string): ChecklistStep[] {
  const steps: ChecklistStep[] = [];
  const lines = markdown.split('\n');
  let orderIndex = 1;

  for (const line of lines) {
    // Match markdown headers (## or ###)
    const headerMatch = line.match(/^#{2,3}\s+(.+)$/);
    if (headerMatch) {
      steps.push({
        orderIndex: orderIndex++,
        title: headerMatch[1].trim(),
      });
      continue;
    }

    // Match numbered lists (1. or 1))
    const numberedMatch = line.match(/^\d+[\.\)]\s+(.+)$/);
    if (numberedMatch) {
      steps.push({
        orderIndex: orderIndex++,
        title: numberedMatch[1].trim(),
      });
      continue;
    }

    // Match bullet points with bold text
    const bulletBoldMatch = line.match(/^[-*]\s+\*\*(.+?)\*\*/);
    if (bulletBoldMatch) {
      steps.push({
        orderIndex: orderIndex++,
        title: bulletBoldMatch[1].trim(),
      });
    }
  }

  return steps;
}

export function convertSopStepsToChecklist(sopSteps: SopStep[]): ChecklistStep[] {
  return sopSteps.map(step => ({
    orderIndex: step.orderIndex,
    title: step.title,
    description: step.description,
    responsibleRole: step.responsibleRole,
  }));
}

export function generateChecklistFromSop(input: GenerateChecklistInput): Omit<PolicyChecklist, 'id' | 'createdAt' | 'updatedAt'> {
  let steps: ChecklistStep[] = [];

  // Prefer structured steps if available
  if (input.stepsJson && input.stepsJson.length > 0) {
    steps = convertSopStepsToChecklist(input.stepsJson);
  } else if (input.bodyMd) {
    // Fall back to extracting from markdown
    steps = extractStepsFromMarkdown(input.bodyMd);
  }

  // Generate default name if not provided
  const name = input.checklistName || `Чеклист: ${input.sopTitle}`;

  return {
    clientId: input.clientId,
    name,
    linkedSopId: input.sopId,
    linkedSopTitle: input.sopTitle,
    stepsJson: steps,
    usageCount: 0,
    createdByUserId: input.createdByUserId,
    createdByName: input.createdByName,
  };
}

export function incrementUsage(checklist: PolicyChecklist): Partial<PolicyChecklist> {
  return {
    usageCount: checklist.usageCount + 1,
    lastUsedAt: new Date().toISOString(),
  };
}

export function addStep(
  checklist: PolicyChecklist,
  step: Omit<ChecklistStep, 'orderIndex'>
): Partial<PolicyChecklist> {
  const maxOrder = Math.max(...checklist.stepsJson.map(s => s.orderIndex), 0);
  const newStep: ChecklistStep = {
    ...step,
    orderIndex: maxOrder + 1,
  };

  return {
    stepsJson: [...checklist.stepsJson, newStep],
  };
}

export function removeStep(checklist: PolicyChecklist, orderIndex: number): Partial<PolicyChecklist> {
  const filtered = checklist.stepsJson.filter(s => s.orderIndex !== orderIndex);

  // Re-index remaining steps
  const reindexed = filtered.map((step, index) => ({
    ...step,
    orderIndex: index + 1,
  }));

  return {
    stepsJson: reindexed,
  };
}

export function reorderSteps(checklist: PolicyChecklist, fromIndex: number, toIndex: number): Partial<PolicyChecklist> {
  const steps = [...checklist.stepsJson];
  const [removed] = steps.splice(fromIndex, 1);
  steps.splice(toIndex, 0, removed);

  // Re-index
  const reindexed = steps.map((step, index) => ({
    ...step,
    orderIndex: index + 1,
  }));

  return {
    stepsJson: reindexed,
  };
}

export function getChecklistSummary(checklist: PolicyChecklist): {
  id: string;
  name: string;
  stepsCount: number;
  usageCount: number;
  linkedSopTitle?: string;
} {
  return {
    id: checklist.id,
    name: checklist.name,
    stepsCount: checklist.stepsJson.length,
    usageCount: checklist.usageCount,
    linkedSopTitle: checklist.linkedSopTitle,
  };
}
