/**
 * MDM Survivorship Engine
 * Decides chosen field values based on rules, source priority, freshness, overrides
 */

export interface SourceValue {
  sourceSystem: string;
  sourceId?: string;
  asOf: string;
  value: unknown;
}

export interface SurvivorshipRule {
  sourcePriority?: string[];
  preferFreshest?: boolean;
  preferNonNull?: boolean;
  customRule?: (values: SourceValue[]) => SourceValue | null;
}

export interface FieldDecision {
  field: string;
  chosenValue: unknown;
  chosenSource: string;
  chosenAsOf: string;
  rule: string;
  confidence: number;
  alternatives: SourceValue[];
}

const DEFAULT_SOURCE_PRIORITY = [
  'manual_entry',
  'custodian_api',
  'bank_feed',
  'bloomberg',
  'refinitiv',
  'internal_system',
  'legacy_import',
];

/**
 * Apply survivorship rules to select the best value for a field
 */
export function selectSurvivorValue(
  field: string,
  values: SourceValue[],
  override?: { value: unknown; source: string },
  rule?: SurvivorshipRule
): FieldDecision {
  const config: SurvivorshipRule = {
    sourcePriority: DEFAULT_SOURCE_PRIORITY,
    preferFreshest: true,
    preferNonNull: true,
    ...rule,
  };

  // If there's a manual override, use it
  if (override) {
    return {
      field,
      chosenValue: override.value,
      chosenSource: 'manual_override',
      chosenAsOf: new Date().toISOString(),
      rule: 'manual_override',
      confidence: 100,
      alternatives: values,
    };
  }

  // Filter out null/undefined values if preferNonNull
  let candidates = values;
  if (config.preferNonNull) {
    const nonNullCandidates = values.filter(
      (v) => v.value !== null && v.value !== undefined && v.value !== ''
    );
    if (nonNullCandidates.length > 0) {
      candidates = nonNullCandidates;
    }
  }

  if (candidates.length === 0) {
    return {
      field,
      chosenValue: null,
      chosenSource: 'none',
      chosenAsOf: new Date().toISOString(),
      rule: 'no_values',
      confidence: 0,
      alternatives: values,
    };
  }

  // Apply custom rule if provided
  if (config.customRule) {
    const result = config.customRule(candidates);
    if (result) {
      return {
        field,
        chosenValue: result.value,
        chosenSource: result.sourceSystem,
        chosenAsOf: result.asOf,
        rule: 'custom_rule',
        confidence: 90,
        alternatives: values.filter((v) => v.sourceSystem !== result.sourceSystem),
      };
    }
  }

  // Sort by source priority
  const sortedByPriority = [...candidates].sort((a, b) => {
    const aPriority = config.sourcePriority?.indexOf(a.sourceSystem) ?? 999;
    const bPriority = config.sourcePriority?.indexOf(b.sourceSystem) ?? 999;
    return aPriority - bPriority;
  });

  // If preferFreshest and top priorities are same, use most recent
  if (config.preferFreshest) {
    const topPriority = config.sourcePriority?.indexOf(sortedByPriority[0].sourceSystem) ?? 999;
    const samePriority = sortedByPriority.filter((v) => {
      return (config.sourcePriority?.indexOf(v.sourceSystem) ?? 999) === topPriority;
    });

    if (samePriority.length > 1) {
      samePriority.sort((a, b) => {
        return new Date(b.asOf).getTime() - new Date(a.asOf).getTime();
      });
      const chosen = samePriority[0];
      return {
        field,
        chosenValue: chosen.value,
        chosenSource: chosen.sourceSystem,
        chosenAsOf: chosen.asOf,
        rule: 'freshest_among_priority',
        confidence: calculateConfidence(candidates, chosen),
        alternatives: values.filter((v) => v !== chosen),
      };
    }
  }

  // Use the highest priority source
  const chosen = sortedByPriority[0];
  return {
    field,
    chosenValue: chosen.value,
    chosenSource: chosen.sourceSystem,
    chosenAsOf: chosen.asOf,
    rule: 'source_priority',
    confidence: calculateConfidence(candidates, chosen),
    alternatives: values.filter((v) => v !== chosen),
  };
}

/**
 * Calculate confidence score based on agreement among sources
 */
function calculateConfidence(values: SourceValue[], chosen: SourceValue): number {
  if (values.length === 1) return 85;

  // Count how many sources agree with chosen value
  const agreeing = values.filter((v) => {
    if (typeof v.value === 'string' && typeof chosen.value === 'string') {
      return v.value.toLowerCase().trim() === chosen.value.toLowerCase().trim();
    }
    return v.value === chosen.value;
  });

  const agreementRatio = agreeing.length / values.length;

  // Base confidence: 70 + up to 30 based on agreement
  return Math.round(70 + agreementRatio * 30);
}

/**
 * Build a complete golden record from sources
 */
export function buildGoldenRecord(
  sources: Array<{
    sourceSystem: string;
    sourceId?: string;
    asOf: string;
    fieldsJson: Record<string, unknown>;
  }>,
  overrides?: Record<string, { value: unknown; source: string }>,
  rules?: Record<string, SurvivorshipRule>
): {
  chosenJson: Record<string, unknown>;
  confidenceJson: Record<string, number>;
  decisions: FieldDecision[];
} {
  const allFields = new Set<string>();
  const fieldValues: Record<string, SourceValue[]> = {};

  // Collect all field values from all sources
  for (const source of sources) {
    for (const [field, value] of Object.entries(source.fieldsJson)) {
      allFields.add(field);
      if (!fieldValues[field]) {
        fieldValues[field] = [];
      }
      fieldValues[field].push({
        sourceSystem: source.sourceSystem,
        sourceId: source.sourceId,
        asOf: source.asOf,
        value,
      });
    }
  }

  const chosenJson: Record<string, unknown> = {};
  const confidenceJson: Record<string, number> = {};
  const decisions: FieldDecision[] = [];

  // Apply survivorship for each field
  for (const field of allFields) {
    const values = fieldValues[field] || [];
    const override = overrides?.[field];
    const rule = rules?.[field];

    const decision = selectSurvivorValue(field, values, override, rule);
    decisions.push(decision);

    chosenJson[field] = decision.chosenValue;
    confidenceJson[field] = decision.confidence;
  }

  return { chosenJson, confidenceJson, decisions };
}

/**
 * Detect conflicting values across sources
 */
export function detectConflicts(
  sources: Array<{
    sourceSystem: string;
    fieldsJson: Record<string, unknown>;
  }>
): Array<{
  field: string;
  values: Array<{ source: string; value: unknown }>;
}> {
  const fieldValues: Record<string, Array<{ source: string; value: unknown }>> = {};

  for (const source of sources) {
    for (const [field, value] of Object.entries(source.fieldsJson)) {
      if (!fieldValues[field]) {
        fieldValues[field] = [];
      }
      fieldValues[field].push({ source: source.sourceSystem, value });
    }
  }

  const conflicts: Array<{
    field: string;
    values: Array<{ source: string; value: unknown }>;
  }> = [];

  for (const [field, values] of Object.entries(fieldValues)) {
    if (values.length <= 1) continue;

    // Check if values differ
    const uniqueValues = new Set(
      values.map((v) => {
        if (typeof v.value === 'string') return v.value.toLowerCase().trim();
        return JSON.stringify(v.value);
      })
    );

    if (uniqueValues.size > 1) {
      conflicts.push({ field, values });
    }
  }

  return conflicts;
}
