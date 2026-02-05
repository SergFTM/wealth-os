// Checklist Engine for tracking progress

interface ChecklistStep {
  id: string;
  titleRu: string;
  titleEn?: string;
  required: boolean;
}

interface StepState {
  stepId: string;
  completed: boolean;
  completedAt?: string;
  evidenceDocId?: string;
}

interface ChecklistRun {
  id: string;
  checklistId: string;
  userId: string;
  stepStatesJson: StepState[];
  completionPct: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
}

interface Checklist {
  id: string;
  nameRu: string;
  nameEn?: string;
  stepsJson: ChecklistStep[];
  enforceOrder: boolean;
}

// Start a new checklist run
export function startChecklistRun(
  checklist: Checklist,
  userId: string
): Omit<ChecklistRun, 'id'> {
  const stepStates: StepState[] = checklist.stepsJson.map(step => ({
    stepId: step.id,
    completed: false,
  }));

  return {
    checklistId: checklist.id,
    userId,
    stepStatesJson: stepStates,
    completionPct: 0,
    status: 'in_progress',
    startedAt: new Date().toISOString(),
  };
}

// Toggle a step completion
export function toggleStep(
  run: ChecklistRun,
  checklist: Checklist,
  stepId: string,
  evidenceDocId?: string
): ChecklistRun {
  const stepIndex = checklist.stepsJson.findIndex(s => s.id === stepId);
  if (stepIndex === -1) return run;

  // Check if order is enforced
  if (checklist.enforceOrder && stepIndex > 0) {
    const prevStep = checklist.stepsJson[stepIndex - 1];
    const prevState = run.stepStatesJson.find(s => s.stepId === prevStep.id);
    if (!prevState?.completed) {
      // Cannot complete this step until previous is done
      return run;
    }
  }

  // Update step state
  const newStepStates = run.stepStatesJson.map(state => {
    if (state.stepId === stepId) {
      const newCompleted = !state.completed;
      return {
        ...state,
        completed: newCompleted,
        completedAt: newCompleted ? new Date().toISOString() : undefined,
        evidenceDocId: newCompleted ? evidenceDocId : undefined,
      };
    }
    return state;
  });

  // Calculate completion percentage
  const completedCount = newStepStates.filter(s => s.completed).length;
  const totalRequired = checklist.stepsJson.filter(s => s.required).length;
  const completedRequired = newStepStates.filter(s => {
    const step = checklist.stepsJson.find(cs => cs.id === s.stepId);
    return s.completed && step?.required;
  }).length;

  const completionPct = totalRequired > 0
    ? Math.round((completedRequired / totalRequired) * 100)
    : Math.round((completedCount / checklist.stepsJson.length) * 100);

  // Check if all required steps are complete
  const allRequiredComplete = completedRequired === totalRequired;
  const isComplete = allRequiredComplete && completionPct === 100;

  return {
    ...run,
    stepStatesJson: newStepStates,
    completionPct,
    status: isComplete ? 'completed' : 'in_progress',
    completedAt: isComplete ? new Date().toISOString() : undefined,
  };
}

// Get next step to complete
export function getNextStep(
  run: ChecklistRun,
  checklist: Checklist
): ChecklistStep | null {
  for (const step of checklist.stepsJson) {
    const state = run.stepStatesJson.find(s => s.stepId === step.id);
    if (!state?.completed) {
      return step;
    }
  }
  return null;
}

// Check if a step can be toggled (considering order enforcement)
export function canToggleStep(
  run: ChecklistRun,
  checklist: Checklist,
  stepId: string
): boolean {
  const stepIndex = checklist.stepsJson.findIndex(s => s.id === stepId);
  if (stepIndex === -1) return false;

  if (!checklist.enforceOrder) return true;

  // First step can always be toggled
  if (stepIndex === 0) return true;

  // Check if previous step is completed
  const prevStep = checklist.stepsJson[stepIndex - 1];
  const prevState = run.stepStatesJson.find(s => s.stepId === prevStep.id);
  return prevState?.completed === true;
}

// Abandon a checklist run
export function abandonRun(run: ChecklistRun): ChecklistRun {
  return {
    ...run,
    status: 'abandoned',
  };
}

// Get run statistics
export function getRunStats(run: ChecklistRun, checklist: Checklist) {
  const totalSteps = checklist.stepsJson.length;
  const completedSteps = run.stepStatesJson.filter(s => s.completed).length;
  const requiredSteps = checklist.stepsJson.filter(s => s.required).length;
  const completedRequired = run.stepStatesJson.filter(s => {
    const step = checklist.stepsJson.find(cs => cs.id === s.stepId);
    return s.completed && step?.required;
  }).length;

  return {
    totalSteps,
    completedSteps,
    requiredSteps,
    completedRequired,
    remainingSteps: totalSteps - completedSteps,
    remainingRequired: requiredSteps - completedRequired,
    completionPct: run.completionPct,
    isComplete: run.status === 'completed',
  };
}

export type { ChecklistStep, StepState, ChecklistRun, Checklist };
