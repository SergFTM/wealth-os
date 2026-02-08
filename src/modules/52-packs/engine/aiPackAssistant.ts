/**
 * AI Pack Assistant
 *
 * Provides AI-powered suggestions for pack composition,
 * cover letter drafting, and missing docs detection.
 *
 * All outputs in Russian, require human approval.
 */

import {
  AiAssistantRequest,
  AiAssistantResult,
  RecipientType,
  ScopeType,
  PeriodInfo,
  PackItem,
  SuggestedItem,
  MissingDoc
} from './types';
import { composePack } from './packComposer';
import { checkMissingDocs, getCompletenessScore } from './missingDocsEngine';

/**
 * Process AI assistant request
 */
export function processAiRequest(request: AiAssistantRequest): AiAssistantResult {
  switch (request.action) {
    case 'propose_contents':
      return proposeContents(request);
    case 'draft_cover_letter':
      return draftCoverLetter(request);
    case 'check_missing_docs':
      return checkMissingDocsAi(request);
    default:
      return {
        action: request.action,
        result: null,
        sources: [],
        confidence: 0,
        assumptions: ['Неизвестное действие'],
        requiresHumanReview: true
      };
  }
}

/**
 * Propose pack contents based on recipient and purpose
 */
function proposeContents(request: AiAssistantRequest): AiAssistantResult {
  const { recipientType, purpose, scopeType, period } = request;

  if (!recipientType || !scopeType || !period) {
    return {
      action: 'propose_contents',
      result: [],
      sources: [],
      confidence: 0,
      assumptions: ['Недостаточно данных для анализа'],
      requiresHumanReview: true
    };
  }

  // Use pack composer for base suggestions
  const composition = composePack({
    recipientType,
    purpose: purpose || '',
    scopeType,
    periodStart: period.start,
    periodEnd: period.end,
    clientSafe: true
  });

  // Enhance with AI-specific suggestions
  const enhancedItems = enhanceSuggestions(
    composition.suggestedItems,
    recipientType,
    purpose || ''
  );

  const assumptions = [
    `Тип получателя: ${getRecipientLabel(recipientType)}`,
    `Scope: ${scopeType}`,
    `Период: ${period.start} — ${period.end}`
  ];

  if (purpose) {
    assumptions.push(`Цель: ${purpose}`);
  }

  return {
    action: 'propose_contents',
    result: {
      suggestedItems: enhancedItems,
      missingDocs: composition.missingDocs,
      summary: generateContentsSummary(enhancedItems, recipientType)
    },
    sources: [
      'Стандартные требования к документам',
      'Шаблоны по типу получателя',
      'Анализ цели запроса'
    ],
    confidence: 0.85,
    assumptions,
    requiresHumanReview: true
  };
}

/**
 * Draft cover letter
 */
function draftCoverLetter(request: AiAssistantRequest): AiAssistantResult {
  const { recipientType, purpose, period, existingItems } = request;

  if (!recipientType || !period) {
    return {
      action: 'draft_cover_letter',
      result: '',
      sources: [],
      confidence: 0,
      assumptions: ['Недостаточно данных'],
      requiresHumanReview: true
    };
  }

  const items = existingItems || [];
  const recipientLabel = getRecipientLabel(recipientType);
  const periodLabel = `${formatDate(period.start)} — ${formatDate(period.end)}`;

  // Generate cover letter
  const coverLetter = generateAiCoverLetter(
    recipientLabel,
    purpose || 'предоставление запрошенной информации',
    periodLabel,
    items
  );

  return {
    action: 'draft_cover_letter',
    result: coverLetter,
    sources: [
      'Стандартный шаблон сопроводительного письма',
      'Данные о составе пакета',
      'Информация о получателе'
    ],
    confidence: 0.80,
    assumptions: [
      `Получатель: ${recipientLabel}`,
      `Период: ${periodLabel}`,
      `Документов в пакете: ${items.length}`
    ],
    requiresHumanReview: true
  };
}

/**
 * Check missing docs with AI analysis
 */
function checkMissingDocsAi(request: AiAssistantRequest): AiAssistantResult {
  const { recipientType, existingItems } = request;

  if (!recipientType || !existingItems) {
    return {
      action: 'check_missing_docs',
      result: [],
      sources: [],
      confidence: 0,
      assumptions: ['Недостаточно данных'],
      requiresHumanReview: true
    };
  }

  const missingDocs = checkMissingDocs(recipientType, 'household', existingItems);
  const completeness = getCompletenessScore(recipientType, existingItems);

  // Generate recommendations
  const recommendations = generateMissingDocsRecommendations(missingDocs, recipientType);

  return {
    action: 'check_missing_docs',
    result: {
      missingDocs,
      completeness,
      recommendations,
      summary: generateMissingDocsSummary(missingDocs, completeness)
    },
    sources: [
      'Требования к документам по типу получателя',
      'Анализ текущего состава пакета'
    ],
    confidence: 0.90,
    assumptions: [
      `Тип получателя: ${getRecipientLabel(recipientType)}`,
      `Текущих документов: ${existingItems.length}`,
      `Полнота: ${completeness.score}%`
    ],
    requiresHumanReview: true
  };
}

/**
 * Enhance suggestions with AI insights
 */
function enhanceSuggestions(
  items: SuggestedItem[],
  recipientType: RecipientType,
  purpose: string
): SuggestedItem[] {
  // Add priority ordering based on recipient type
  const priorityDocs: Record<RecipientType, string[]> = {
    auditor: ['gl_extract', 'bank_statements', 'trial_balance'],
    bank: ['net_worth', 'income_statement', 'asset_schedule'],
    tax: ['income_summary', 'capital_gains', 'distributions'],
    legal: ['ownership_chart', 'entity_docs', 'agreements'],
    committee: ['performance_report', 'net_worth', 'liquidity_summary'],
    investor: ['performance_report', 'capital_account'],
    regulator: ['aml_report', 'kyc_docs', 'ownership_chart'],
    other: ['net_worth', 'ownership_chart']
  };

  const priorities = priorityDocs[recipientType] || [];

  return items.map(item => {
    // Check if item matches priority docs
    const isPriority = priorities.some(p =>
      item.title.toLowerCase().includes(p.replace('_', ' ')) ||
      item.refJson?.query?.type === p
    );

    return {
      ...item,
      required: item.required || isPriority,
      reason: isPriority
        ? `${item.reason} (приоритет для ${getRecipientLabel(recipientType)})`
        : item.reason
    };
  }).sort((a, b) => {
    // Sort by required first, then by item type
    if (a.required !== b.required) return a.required ? -1 : 1;
    if (a.itemTypeKey === 'cover_letter') return -1;
    if (b.itemTypeKey === 'cover_letter') return 1;
    return 0;
  });
}

/**
 * Generate AI cover letter
 */
function generateAiCoverLetter(
  recipientLabel: string,
  purpose: string,
  periodLabel: string,
  items: PackItem[]
): string {
  const includedItems = items.filter(i => i.include);
  const itemsList = includedItems.map(i => `- ${i.title}`).join('\n');

  return `# Сопроводительное письмо

Уважаемые коллеги,

В соответствии с вашим запросом направляем пакет документов для ${purpose}.

## Период отчётности
${periodLabel}

## Получатель
${recipientLabel}

## Состав пакета
${itemsList || '- Список документов будет сформирован'}

## Важная информация
- Все документы предоставляются исключительно для указанной цели
- Материалы являются конфиденциальными
- Передача третьим лицам без письменного согласия запрещена
- При возникновении вопросов просим обращаться к контактному лицу

## Дисклеймер
Данный пакет документов подготовлен на основе имеющейся информации. Мы прилагаем все усилия для обеспечения точности и полноты представленных данных.

---
*Документ сформирован автоматически с помощью AI-ассистента.*
*Требуется проверка и утверждение ответственным лицом.*

Дата формирования: ${new Date().toLocaleDateString('ru-RU')}
`;
}

/**
 * Generate missing docs recommendations
 */
function generateMissingDocsRecommendations(
  missingDocs: MissingDoc[],
  recipientType: RecipientType
): string[] {
  const recommendations: string[] = [];

  const requiredCount = missingDocs.filter(d => d.severity === 'required').length;
  const recommendedCount = missingDocs.filter(d => d.severity === 'recommended').length;

  if (requiredCount > 0) {
    recommendations.push(`⛔ Необходимо добавить ${requiredCount} обязательных документов перед отправкой`);
  }

  if (recommendedCount > 0) {
    recommendations.push(`⚠️ Рекомендуется добавить ${recommendedCount} дополнительных документов для полноты`);
  }

  if (requiredCount === 0 && recommendedCount === 0) {
    recommendations.push('✅ Все необходимые документы присутствуют');
  }

  // Add specific recommendations based on recipient
  if (recipientType === 'auditor' && missingDocs.some(d => d.docType === 'reconciliations')) {
    recommendations.push('💡 Для аудиторов рекомендуется включить акты сверок');
  }

  if (recipientType === 'bank' && missingDocs.some(d => d.docType === 'id_documents')) {
    recommendations.push('💡 Банки обычно требуют документы удостоверения личности (KYC)');
  }

  return recommendations;
}

/**
 * Generate contents summary
 */
function generateContentsSummary(items: SuggestedItem[], recipientType: RecipientType): string {
  const requiredCount = items.filter(i => i.required).length;
  const totalCount = items.length;

  return `Предложено ${totalCount} документов для ${getRecipientLabel(recipientType)}, из них ${requiredCount} обязательных.`;
}

/**
 * Generate missing docs summary
 */
function generateMissingDocsSummary(
  missingDocs: MissingDoc[],
  completeness: { score: number; label: string }
): string {
  if (missingDocs.length === 0) {
    return 'Пакет полный, все необходимые документы присутствуют.';
  }

  const required = missingDocs.filter(d => d.severity === 'required').length;
  const recommended = missingDocs.filter(d => d.severity === 'recommended').length;

  return `Полнота пакета: ${completeness.score}% (${completeness.label}). Отсутствует: ${required} обязательных, ${recommended} рекомендуемых документов.`;
}

/**
 * Get recipient label in Russian
 */
function getRecipientLabel(recipientType: RecipientType): string {
  const labels: Record<RecipientType, string> = {
    auditor: 'внешнего аудитора',
    bank: 'банка',
    tax: 'налогового консультанта',
    legal: 'юридического советника',
    committee: 'инвестиционного комитета',
    investor: 'со-инвестора',
    regulator: 'регулятора',
    other: 'внешнего получателя'
  };
  return labels[recipientType];
}

/**
 * Format date in Russian locale
 */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Get AI assistant capabilities info
 */
export function getAiCapabilities(): {
  actions: { key: string; label: string; description: string }[];
  limitations: string[];
} {
  return {
    actions: [
      {
        key: 'propose_contents',
        label: 'Предложить состав пакета',
        description: 'Автоматический подбор документов на основе типа получателя и цели'
      },
      {
        key: 'draft_cover_letter',
        label: 'Сформировать cover letter',
        description: 'Генерация сопроводительного письма на русском языке'
      },
      {
        key: 'check_missing_docs',
        label: 'Проверить полноту',
        description: 'Анализ недостающих документов и рекомендации'
      }
    ],
    limitations: [
      'Все предложения требуют проверки человеком',
      'AI не имеет доступа к содержимому документов',
      'Рекомендации основаны на типовых требованиях',
      'Индивидуальные требования получателя могут отличаться'
    ]
  };
}
