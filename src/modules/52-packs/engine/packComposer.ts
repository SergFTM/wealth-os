/**
 * Pack Composer Engine
 *
 * Builds pack items based on template, scope, and period.
 * Integrates with Document Vault, Exports, and Ownership modules.
 */

import {
  PackCompositionRequest,
  PackCompositionResult,
  SuggestedItem,
  MissingDoc,
  RecipientType,
  ScopeType,
  ItemType,
  SensitivityLevel
} from './types';

/**
 * Standard document types by recipient
 */
const RECIPIENT_DOC_REQUIREMENTS: Record<RecipientType, string[]> = {
  auditor: ['gl_extract', 'trial_balance', 'bank_statements', 'custodian_statements', 'ownership_chart', 'policy_docs'],
  bank: ['net_worth', 'income_statement', 'bank_statements', 'asset_schedule', 'liability_schedule', 'ownership_chart'],
  tax: ['income_summary', 'capital_gains', 'distributions', 'k1_forms', 'entity_structure', 'foreign_accounts'],
  legal: ['ownership_chart', 'entity_docs', 'agreements', 'compliance_certs', 'minutes', 'resolutions'],
  committee: ['performance_report', 'net_worth', 'liquidity_summary', 'risk_analysis', 'allocation_report', 'manager_reviews'],
  investor: ['performance_report', 'capital_account', 'distribution_schedule', 'net_worth', 'allocation_report'],
  regulator: ['aml_report', 'kyc_docs', 'compliance_certs', 'ownership_chart', 'beneficial_owners', 'transaction_logs'],
  other: ['net_worth', 'ownership_chart', 'summary_report']
};

/**
 * Compose pack contents based on request parameters
 */
export function composePack(request: PackCompositionRequest): PackCompositionResult {
  const { recipientType, purpose, scopeType, periodStart, periodEnd, clientSafe } = request;

  const suggestedItems: SuggestedItem[] = [];
  const missingDocs: MissingDoc[] = [];

  // Get required doc types for recipient
  const requiredDocs = RECIPIENT_DOC_REQUIREMENTS[recipientType] || RECIPIENT_DOC_REQUIREMENTS.other;

  // Generate suggested items
  let orderIndex = 0;

  // Always suggest cover letter first
  suggestedItems.push({
    itemTypeKey: 'cover_letter',
    title: 'Сопроводительное письмо',
    reason: 'Стандартное сопроводительное письмо для пакета',
    required: true,
    clientSafe: true,
    sensitivityKey: 'low'
  });
  orderIndex++;

  // Add standard items based on recipient type
  for (const docType of requiredDocs) {
    const item = mapDocTypeToItem(docType, scopeType, periodStart, periodEnd, clientSafe);
    if (item) {
      suggestedItems.push(item);
      orderIndex++;
    }
  }

  // Add ownership snapshot for most recipients
  if (['auditor', 'bank', 'legal', 'regulator'].includes(recipientType)) {
    suggestedItems.push({
      itemTypeKey: 'snapshot',
      title: 'Структура владения (snapshot)',
      refJson: { collection: 'ownershipViews', id: 'latest', query: { scopeType } },
      reason: 'Актуальный снимок структуры владения',
      required: true,
      clientSafe: true,
      sensitivityKey: 'medium'
    });
  }

  // Check for missing docs
  for (const docType of requiredDocs) {
    // In real implementation, check against actual vault
    const missing = checkDocAvailability(docType, scopeType);
    if (missing) {
      missingDocs.push(missing);
    }
  }

  // Add checklist if there are missing docs
  if (missingDocs.length > 0) {
    suggestedItems.push({
      itemTypeKey: 'checklist',
      title: 'Чеклист недостающих документов',
      reason: `${missingDocs.length} документов требуют внимания`,
      required: false,
      clientSafe: true,
      sensitivityKey: 'low'
    });
  }

  // Generate cover letter draft
  const coverLetterDraft = generateCoverLetterDraft(recipientType, purpose, periodStart, periodEnd);

  return {
    suggestedItems,
    missingDocs,
    coverLetterDraft
  };
}

/**
 * Map document type to pack item
 */
function mapDocTypeToItem(
  docType: string,
  scopeType: ScopeType,
  periodStart: string,
  periodEnd: string,
  clientSafe: boolean
): SuggestedItem | null {
  const docMappings: Record<string, Partial<SuggestedItem>> = {
    gl_extract: {
      itemTypeKey: 'export',
      title: 'Выписка из главной книги',
      refJson: { collection: 'exportJobs', id: '', query: { type: 'gl_extract' } },
      reason: 'Детализация операций за период',
      sensitivityKey: 'high'
    },
    trial_balance: {
      itemTypeKey: 'export',
      title: 'Оборотно-сальдовая ведомость',
      refJson: { collection: 'exportJobs', id: '', query: { type: 'trial_balance' } },
      reason: 'Сводка по счетам на дату',
      sensitivityKey: 'medium'
    },
    bank_statements: {
      itemTypeKey: 'document',
      title: 'Банковские выписки',
      refJson: { collection: 'documents', id: '', query: { category: 'bank_statement' } },
      reason: 'Подтверждение остатков и операций',
      sensitivityKey: 'high'
    },
    custodian_statements: {
      itemTypeKey: 'document',
      title: 'Отчёты кастодианов',
      refJson: { collection: 'documents', id: '', query: { category: 'custodian_statement' } },
      reason: 'Подтверждение позиций по портфелю',
      sensitivityKey: 'high'
    },
    net_worth: {
      itemTypeKey: 'export',
      title: 'Отчёт о чистой стоимости',
      refJson: { collection: 'exportJobs', id: '', query: { type: 'net_worth' } },
      reason: 'Сводка активов и обязательств',
      sensitivityKey: 'medium'
    },
    income_statement: {
      itemTypeKey: 'export',
      title: 'Отчёт о доходах',
      refJson: { collection: 'exportJobs', id: '', query: { type: 'income' } },
      reason: 'Источники и суммы доходов',
      sensitivityKey: 'high'
    },
    performance_report: {
      itemTypeKey: 'export',
      title: 'Отчёт о доходности',
      refJson: { collection: 'exportJobs', id: '', query: { type: 'performance' } },
      reason: 'Результаты инвестиций за период',
      sensitivityKey: 'medium'
    },
    liquidity_summary: {
      itemTypeKey: 'export',
      title: 'Сводка по ликвидности',
      refJson: { collection: 'exportJobs', id: '', query: { type: 'liquidity' } },
      reason: 'Доступные средства и прогноз',
      sensitivityKey: 'medium'
    },
    ownership_chart: {
      itemTypeKey: 'snapshot',
      title: 'Карта владения',
      refJson: { collection: 'ownershipViews', id: 'latest' },
      reason: 'Структура владения активами',
      sensitivityKey: 'medium'
    },
    asset_schedule: {
      itemTypeKey: 'export',
      title: 'Реестр активов',
      refJson: { collection: 'exportJobs', id: '', query: { type: 'assets' } },
      reason: 'Полный список активов с оценками',
      sensitivityKey: 'high'
    },
    liability_schedule: {
      itemTypeKey: 'export',
      title: 'Реестр обязательств',
      refJson: { collection: 'exportJobs', id: '', query: { type: 'liabilities' } },
      reason: 'Полный список обязательств',
      sensitivityKey: 'high'
    },
    policy_docs: {
      itemTypeKey: 'document',
      title: 'Политики и процедуры',
      refJson: { collection: 'documents', id: '', query: { category: 'policy' } },
      reason: 'Внутренние политики',
      sensitivityKey: 'low'
    },
    entity_docs: {
      itemTypeKey: 'document',
      title: 'Учредительные документы',
      refJson: { collection: 'documents', id: '', query: { category: 'entity' } },
      reason: 'Юридические документы структур',
      sensitivityKey: 'medium'
    }
  };

  const mapping = docMappings[docType];
  if (!mapping) return null;

  return {
    itemTypeKey: mapping.itemTypeKey as ItemType,
    title: mapping.title || docType,
    refJson: mapping.refJson,
    reason: mapping.reason || '',
    required: ['gl_extract', 'bank_statements', 'ownership_chart'].includes(docType),
    clientSafe: clientSafe || mapping.sensitivityKey !== 'high',
    sensitivityKey: mapping.sensitivityKey as SensitivityLevel
  };
}

/**
 * Check document availability (stub - returns missing for demo)
 */
function checkDocAvailability(docType: string, scopeType: ScopeType): MissingDoc | null {
  // In production, query actual collections
  const missingProbability = 0.2; // 20% chance of missing for demo

  if (Math.random() < missingProbability) {
    return {
      docType,
      title: getDocTypeTitle(docType),
      reason: 'Документ не найден в хранилище',
      severity: ['gl_extract', 'bank_statements'].includes(docType) ? 'required' : 'recommended',
      suggestion: 'Загрузите документ в Document Vault или запросите у источника'
    };
  }

  return null;
}

/**
 * Get human-readable title for doc type
 */
function getDocTypeTitle(docType: string): string {
  const titles: Record<string, string> = {
    gl_extract: 'Выписка из главной книги',
    trial_balance: 'Оборотно-сальдовая ведомость',
    bank_statements: 'Банковские выписки',
    custodian_statements: 'Отчёты кастодианов',
    net_worth: 'Отчёт о чистой стоимости',
    ownership_chart: 'Карта владения'
  };
  return titles[docType] || docType;
}

/**
 * Generate cover letter draft
 */
function generateCoverLetterDraft(
  recipientType: RecipientType,
  purpose: string,
  periodStart: string,
  periodEnd: string
): string {
  const recipientLabels: Record<RecipientType, string> = {
    auditor: 'аудиторской проверки',
    bank: 'рассмотрения банком',
    tax: 'налогового консультирования',
    legal: 'юридической экспертизы',
    committee: 'инвестиционного комитета',
    investor: 'со-инвестора',
    regulator: 'регуляторной проверки',
    other: 'внешнего запроса'
  };

  const label = recipientLabels[recipientType];
  const periodLabel = formatPeriod(periodStart, periodEnd);

  return `# Сопроводительное письмо

Уважаемые коллеги,

Направляем вам пакет документов для ${label} за период ${periodLabel}.

## Цель предоставления
${purpose}

## Состав пакета
Пакет включает следующие документы и отчёты:
- [Список будет сформирован автоматически]

## Конфиденциальность
Данные материалы являются конфиденциальными и предназначены исключительно для указанной цели. Передача третьим лицам без письменного согласия запрещена.

## Контактная информация
При возникновении вопросов просим обращаться к контактному лицу, указанному в письме о передаче.

---
*Документ сформирован автоматически. Дата: ${new Date().toISOString().split('T')[0]}*
`;
}

/**
 * Format period for display
 */
function formatPeriod(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startMonth = startDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
  const endMonth = endDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

  if (startMonth === endMonth) {
    return startMonth;
  }

  return `${startMonth} — ${endMonth}`;
}

/**
 * Calculate pack statistics
 */
export function calculatePackStats(items: { include: boolean; sensitivityKey: SensitivityLevel }[]): {
  totalItems: number;
  includedItems: number;
  highSensitivity: number;
  mediumSensitivity: number;
  lowSensitivity: number;
} {
  const included = items.filter(i => i.include);

  return {
    totalItems: items.length,
    includedItems: included.length,
    highSensitivity: included.filter(i => i.sensitivityKey === 'high').length,
    mediumSensitivity: included.filter(i => i.sensitivityKey === 'medium').length,
    lowSensitivity: included.filter(i => i.sensitivityKey === 'low').length
  };
}

/**
 * Validate pack before approval request
 */
export function validatePackForApproval(pack: {
  name: string;
  recipientJson: { type: string; org: string };
  purpose: string;
  itemsCount?: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!pack.name || pack.name.length < 3) {
    errors.push('Название пакета должно содержать минимум 3 символа');
  }

  if (!pack.recipientJson?.org) {
    errors.push('Укажите организацию-получателя');
  }

  if (!pack.purpose || pack.purpose.length < 10) {
    errors.push('Укажите цель пакета (минимум 10 символов)');
  }

  if (!pack.itemsCount || pack.itemsCount === 0) {
    errors.push('Пакет должен содержать хотя бы один документ');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
