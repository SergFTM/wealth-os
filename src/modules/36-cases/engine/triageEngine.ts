/**
 * Triage Engine
 * Automatically classifies and routes incoming cases
 */

export interface TriageInput {
  title: string;
  description?: string;
  sourceType: string;
  sourceId?: string;
  reporterSubjectType?: string;
}

export interface TriageResult {
  suggestedType: 'request' | 'incident' | 'change' | 'problem';
  suggestedPriority: 'low' | 'medium' | 'high' | 'critical';
  suggestedRoutingRole: string;
  confidence: number;
  reasoning: string[];
}

const incidentKeywords = [
  'error', 'fail', 'broken', 'down', 'outage', 'crash', 'bug', 'issue',
  'ошибка', 'сбой', 'не работает', 'проблема', 'баг', 'падение',
];

const changeKeywords = [
  'change', 'update', 'modify', 'adjust', 'configure', 'settings',
  'изменить', 'обновить', 'настроить', 'конфигурация', 'изменение',
];

const problemKeywords = [
  'recurring', 'repeated', 'multiple', 'root cause', 'investigation',
  'повторяющийся', 'множественный', 'расследование', 'корневая причина',
];

const criticalKeywords = [
  'urgent', 'critical', 'immediately', 'asap', 'emergency', 'production',
  'срочно', 'критично', 'немедленно', 'экстренно',
];

const highKeywords = [
  'important', 'priority', 'soon', 'blocking',
  'важно', 'приоритет', 'скорее', 'блокирует',
];

export function triageCase(input: TriageInput): TriageResult {
  const text = `${input.title} ${input.description || ''}`.toLowerCase();
  const reasoning: string[] = [];
  let confidence = 0.6;

  // Determine type
  let suggestedType: TriageResult['suggestedType'] = 'request';

  if (input.sourceType === 'dq' || input.sourceType === 'sync') {
    suggestedType = 'incident';
    reasoning.push(`Source type "${input.sourceType}" indicates incident`);
    confidence += 0.2;
  } else if (incidentKeywords.some(kw => text.includes(kw))) {
    suggestedType = 'incident';
    reasoning.push('Keywords indicate incident');
    confidence += 0.15;
  } else if (changeKeywords.some(kw => text.includes(kw))) {
    suggestedType = 'change';
    reasoning.push('Keywords indicate change request');
    confidence += 0.15;
  } else if (problemKeywords.some(kw => text.includes(kw))) {
    suggestedType = 'problem';
    reasoning.push('Keywords indicate problem investigation');
    confidence += 0.15;
  } else {
    reasoning.push('Defaulting to request type');
  }

  // Determine priority
  let suggestedPriority: TriageResult['suggestedPriority'] = 'medium';

  if (criticalKeywords.some(kw => text.includes(kw))) {
    suggestedPriority = 'critical';
    reasoning.push('Critical keywords detected');
    confidence += 0.1;
  } else if (highKeywords.some(kw => text.includes(kw))) {
    suggestedPriority = 'high';
    reasoning.push('High priority keywords detected');
    confidence += 0.1;
  } else if (suggestedType === 'incident' && input.sourceType === 'sync') {
    suggestedPriority = 'high';
    reasoning.push('Sync-related incidents default to high priority');
    confidence += 0.1;
  } else if (suggestedType === 'request' && input.sourceType === 'portal') {
    suggestedPriority = 'medium';
    reasoning.push('Client portal requests default to medium priority');
  }

  // Determine routing
  let suggestedRoutingRole = 'operations';

  if (suggestedType === 'incident') {
    if (input.sourceType === 'sync' || input.sourceType === 'dq') {
      suggestedRoutingRole = 'data_ops';
      reasoning.push('Routing to data ops team');
    } else {
      suggestedRoutingRole = 'support';
      reasoning.push('Routing to support team');
    }
  } else if (suggestedType === 'change') {
    suggestedRoutingRole = 'compliance';
    reasoning.push('Changes routed to compliance for review');
  } else if (suggestedType === 'problem') {
    suggestedRoutingRole = 'engineering';
    reasoning.push('Problems routed to engineering');
  } else if (input.sourceType === 'billing') {
    suggestedRoutingRole = 'finance';
    reasoning.push('Billing cases routed to finance');
  } else if (input.sourceType === 'portal') {
    suggestedRoutingRole = 'rm';
    reasoning.push('Client requests routed to relationship manager');
  }

  return {
    suggestedType,
    suggestedPriority,
    suggestedRoutingRole,
    confidence: Math.min(confidence, 0.95),
    reasoning,
  };
}

export function getSuggestedTemplates(
  input: TriageInput,
  templates: { id: string; name: string; defaultType: string; category?: string }[]
): { id: string; name: string; score: number }[] {
  const text = `${input.title} ${input.description || ''}`.toLowerCase();

  return templates
    .map(template => {
      let score = 0;
      const templateName = template.name.toLowerCase();

      // Check keyword overlap
      const words = text.split(/\s+/).filter(w => w.length > 3);
      for (const word of words) {
        if (templateName.includes(word)) {
          score += 0.2;
        }
      }

      // Check type match based on source
      if (input.sourceType === 'dq' && template.defaultType === 'incident') {
        score += 0.3;
      }
      if (input.sourceType === 'billing' && template.category === 'billing') {
        score += 0.3;
      }

      return { id: template.id, name: template.name, score };
    })
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
