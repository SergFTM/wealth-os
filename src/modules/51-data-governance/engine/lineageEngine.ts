import { DataLineage, DataKpi, LineageInput, LineageTransform, LineageOutput } from './types';

export interface LineageDefinition {
  kpiId: string;
  inputs: LineageInput[];
  transforms: LineageTransform[];
  outputs: LineageOutput[];
}

/**
 * Define lineage for a KPI
 */
export function defineLineage(
  kpi: DataKpi,
  inputs: LineageInput[],
  transforms: LineageTransform[],
  outputs: LineageOutput[]
): Omit<DataLineage, 'id' | 'createdAt' | 'updatedAt'> {
  // Validate inputs
  if (!inputs || inputs.length === 0) {
    throw new Error('Lineage must have at least one input');
  }

  // Validate transforms have sequential step numbers
  const sortedTransforms = [...transforms].sort((a, b) => a.stepNo - b.stepNo);

  return {
    clientId: kpi.clientId,
    kpiId: kpi.id,
    kpiName: kpi.name,
    inputsJson: inputs,
    transformsJson: sortedTransforms,
    outputsJson: outputs,
  };
}

/**
 * Get all source collections from lineage
 */
export function getSourceCollections(lineage: DataLineage): string[] {
  return [...new Set(lineage.inputsJson.map(input => input.collection))];
}

/**
 * Get all source fields from lineage
 */
export function getSourceFields(lineage: DataLineage): Array<{ collection: string; field: string }> {
  const fields: Array<{ collection: string; field: string }> = [];

  for (const input of lineage.inputsJson) {
    for (const field of input.fields) {
      fields.push({ collection: input.collection, field });
    }
  }

  return fields;
}

/**
 * Count transform steps
 */
export function getTransformStepCount(lineage: DataLineage): number {
  return lineage.transformsJson.length;
}

/**
 * Get high risk transforms
 */
export function getHighRiskTransforms(lineage: DataLineage): LineageTransform[] {
  return lineage.transformsJson.filter(t => t.riskKey === 'high');
}

/**
 * Validate lineage completeness
 */
export function validateLineage(lineage: DataLineage): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!lineage.inputsJson || lineage.inputsJson.length === 0) {
    issues.push('No inputs defined');
  }

  if (!lineage.transformsJson || lineage.transformsJson.length === 0) {
    issues.push('No transforms defined');
  }

  // Check for missing step numbers
  const stepNumbers = lineage.transformsJson.map(t => t.stepNo).sort((a, b) => a - b);
  for (let i = 0; i < stepNumbers.length; i++) {
    if (stepNumbers[i] !== i + 1) {
      issues.push(`Missing or invalid step number at position ${i + 1}`);
      break;
    }
  }

  // Check for transforms without descriptions
  const missingDescriptions = lineage.transformsJson.filter(t => !t.description || t.description.trim() === '');
  if (missingDescriptions.length > 0) {
    issues.push(`${missingDescriptions.length} transforms missing descriptions`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Build lineage graph for visualization
 */
export function buildLineageGraph(lineage: DataLineage): {
  nodes: Array<{ id: string; type: 'input' | 'transform' | 'output'; label: string }>;
  edges: Array<{ from: string; to: string }>;
} {
  const nodes: Array<{ id: string; type: 'input' | 'transform' | 'output'; label: string }> = [];
  const edges: Array<{ from: string; to: string }> = [];

  // Add input nodes
  lineage.inputsJson.forEach((input, idx) => {
    const nodeId = `input-${idx}`;
    nodes.push({
      id: nodeId,
      type: 'input',
      label: `${input.collection}: ${input.fields.join(', ')}`,
    });

    // Connect to first transform
    if (lineage.transformsJson.length > 0) {
      edges.push({ from: nodeId, to: 'transform-1' });
    }
  });

  // Add transform nodes
  lineage.transformsJson.forEach((transform, idx) => {
    const nodeId = `transform-${transform.stepNo}`;
    nodes.push({
      id: nodeId,
      type: 'transform',
      label: transform.title,
    });

    // Connect to next transform or output
    if (idx < lineage.transformsJson.length - 1) {
      edges.push({ from: nodeId, to: `transform-${lineage.transformsJson[idx + 1].stepNo}` });
    }
  });

  // Add output nodes
  lineage.outputsJson.forEach((output, idx) => {
    const nodeId = `output-${idx}`;
    nodes.push({
      id: nodeId,
      type: 'output',
      label: output.field,
    });

    // Connect from last transform
    if (lineage.transformsJson.length > 0) {
      const lastTransform = lineage.transformsJson[lineage.transformsJson.length - 1];
      edges.push({ from: `transform-${lastTransform.stepNo}`, to: nodeId });
    }
  });

  return { nodes, edges };
}

/**
 * Generate lineage summary text
 */
export function generateLineageSummary(lineage: DataLineage, locale: 'ru' | 'en' | 'uk' = 'ru'): string {
  const sourceCount = lineage.inputsJson.length;
  const transformCount = lineage.transformsJson.length;
  const outputCount = lineage.outputsJson.length;

  const collections = getSourceCollections(lineage);

  const templates = {
    ru: `Этот KPI использует ${sourceCount} источник(ов) из коллекций: ${collections.join(', ')}. Данные проходят через ${transformCount} этап(ов) обработки и формируют ${outputCount} результат(ов).`,
    en: `This KPI uses ${sourceCount} source(s) from collections: ${collections.join(', ')}. Data passes through ${transformCount} processing step(s) and produces ${outputCount} output(s).`,
    uk: `Цей KPI використовує ${sourceCount} джерело(а) з колекцій: ${collections.join(', ')}. Дані проходять через ${transformCount} етап(ів) обробки і формують ${outputCount} результат(ів).`,
  };

  return templates[locale];
}
