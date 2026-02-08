/**
 * Missing Docs Engine
 *
 * Checks for required documents and generates exception reports.
 * Integrates with Module 48 (Exceptions) for tracking.
 */

import {
  MissingDoc,
  RecipientType,
  ScopeType,
  PackItem,
  ReportPack
} from './types';

/**
 * Document requirements by recipient type
 */
interface DocRequirement {
  docType: string;
  title: string;
  severity: 'required' | 'recommended' | 'optional';
  description: string;
  sources: string[];
}

const RECIPIENT_REQUIREMENTS: Record<RecipientType, DocRequirement[]> = {
  auditor: [
    { docType: 'gl_extract', title: 'Выписка из главной книги', severity: 'required', description: 'Детализация всех операций за период', sources: ['exportJobs'] },
    { docType: 'trial_balance', title: 'Оборотно-сальдовая ведомость', severity: 'required', description: 'Сводка по счетам', sources: ['exportJobs'] },
    { docType: 'bank_statements', title: 'Банковские выписки', severity: 'required', description: 'Подтверждение остатков', sources: ['documents'] },
    { docType: 'custodian_statements', title: 'Отчёты кастодианов', severity: 'required', description: 'Подтверждение позиций', sources: ['documents'] },
    { docType: 'ownership_chart', title: 'Структура владения', severity: 'required', description: 'Схема владения', sources: ['ownershipViews'] },
    { docType: 'signed_policies', title: 'Подписанные политики', severity: 'recommended', description: 'Внутренние политики', sources: ['documents'] },
    { docType: 'reconciliations', title: 'Сверки', severity: 'recommended', description: 'Акты сверок', sources: ['documents'] }
  ],
  bank: [
    { docType: 'net_worth', title: 'Отчёт о чистой стоимости', severity: 'required', description: 'Текущее состояние', sources: ['exportJobs'] },
    { docType: 'income_statement', title: 'Отчёт о доходах', severity: 'required', description: 'Источники дохода', sources: ['exportJobs'] },
    { docType: 'bank_statements', title: 'Банковские выписки', severity: 'required', description: 'История операций', sources: ['documents'] },
    { docType: 'asset_schedule', title: 'Реестр активов', severity: 'required', description: 'Список активов', sources: ['exportJobs'] },
    { docType: 'liability_schedule', title: 'Реестр обязательств', severity: 'required', description: 'Список обязательств', sources: ['exportJobs'] },
    { docType: 'id_documents', title: 'Документы удостоверения личности', severity: 'required', description: 'KYC документы', sources: ['documents'] },
    { docType: 'ownership_chart', title: 'Структура владения', severity: 'required', description: 'Бенефициары', sources: ['ownershipViews'] }
  ],
  tax: [
    { docType: 'income_summary', title: 'Сводка доходов', severity: 'required', description: 'По категориям', sources: ['exportJobs'] },
    { docType: 'capital_gains', title: 'Прирост капитала', severity: 'required', description: 'Реализованные/нереализованные', sources: ['exportJobs'] },
    { docType: 'distributions', title: 'Дистрибуции', severity: 'required', description: 'Полученные распределения', sources: ['exportJobs'] },
    { docType: 'k1_forms', title: 'K-1 формы', severity: 'recommended', description: 'Партнёрские формы', sources: ['documents'] },
    { docType: 'entity_structure', title: 'Структура юрлиц', severity: 'required', description: 'Юридическая структура', sources: ['ownershipViews'] },
    { docType: 'foreign_accounts', title: 'Иностранные счета (FBAR)', severity: 'recommended', description: 'Зарубежные активы', sources: ['exportJobs'] }
  ],
  legal: [
    { docType: 'ownership_chart', title: 'Структура владения', severity: 'required', description: 'Полная карта', sources: ['ownershipViews'] },
    { docType: 'entity_docs', title: 'Учредительные документы', severity: 'required', description: 'Уставы, протоколы', sources: ['documents'] },
    { docType: 'agreements', title: 'Соглашения', severity: 'recommended', description: 'Действующие договоры', sources: ['documents'] },
    { docType: 'compliance_certs', title: 'Сертификаты соответствия', severity: 'recommended', description: 'Лицензии, разрешения', sources: ['documents'] }
  ],
  committee: [
    { docType: 'performance_report', title: 'Отчёт о доходности', severity: 'required', description: 'Результаты инвестиций', sources: ['exportJobs'] },
    { docType: 'net_worth', title: 'Чистая стоимость', severity: 'required', description: 'Текущее состояние', sources: ['exportJobs'] },
    { docType: 'liquidity_summary', title: 'Сводка ликвидности', severity: 'required', description: 'Доступные средства', sources: ['exportJobs'] },
    { docType: 'risk_analysis', title: 'Анализ рисков', severity: 'recommended', description: 'Оценка рисков', sources: ['exportJobs'] },
    { docType: 'allocation_report', title: 'Распределение активов', severity: 'required', description: 'Аллокация', sources: ['exportJobs'] }
  ],
  investor: [
    { docType: 'performance_report', title: 'Отчёт о доходности', severity: 'required', description: 'Результаты', sources: ['exportJobs'] },
    { docType: 'capital_account', title: 'Капитальный счёт', severity: 'required', description: 'Состояние счёта', sources: ['exportJobs'] },
    { docType: 'distribution_schedule', title: 'График распределений', severity: 'recommended', description: 'Планируемые выплаты', sources: ['exportJobs'] }
  ],
  regulator: [
    { docType: 'aml_report', title: 'AML отчёт', severity: 'required', description: 'Противодействие отмыванию', sources: ['exportJobs'] },
    { docType: 'kyc_docs', title: 'KYC документы', severity: 'required', description: 'Идентификация', sources: ['documents'] },
    { docType: 'compliance_certs', title: 'Сертификаты соответствия', severity: 'required', description: 'Лицензии', sources: ['documents'] },
    { docType: 'ownership_chart', title: 'Структура владения', severity: 'required', description: 'Бенефициары', sources: ['ownershipViews'] },
    { docType: 'transaction_logs', title: 'Журналы транзакций', severity: 'required', description: 'История операций', sources: ['exportJobs'] }
  ],
  other: [
    { docType: 'net_worth', title: 'Отчёт о чистой стоимости', severity: 'recommended', description: 'Сводка', sources: ['exportJobs'] },
    { docType: 'ownership_chart', title: 'Структура владения', severity: 'recommended', description: 'Карта', sources: ['ownershipViews'] }
  ]
};

/**
 * Check for missing documents
 */
export function checkMissingDocs(
  recipientType: RecipientType,
  scopeType: ScopeType,
  existingItems: PackItem[],
  availableDocs?: { collection: string; docType?: string; id: string }[]
): MissingDoc[] {
  const requirements = RECIPIENT_REQUIREMENTS[recipientType] || RECIPIENT_REQUIREMENTS.other;
  const missing: MissingDoc[] = [];

  // Create set of existing doc types
  const existingDocTypes = new Set<string>();
  for (const item of existingItems) {
    if (item.include && item.refJson?.collection) {
      // Extract doc type from query if available
      const query = item.refJson.query as Record<string, unknown> | undefined;
      if (query?.type) {
        existingDocTypes.add(query.type as string);
      }
      if (query?.category) {
        existingDocTypes.add(query.category as string);
      }
      // Also add by title match
      existingDocTypes.add(item.title.toLowerCase());
    }
  }

  // Check each requirement
  for (const req of requirements) {
    const hasDoc = existingDocTypes.has(req.docType) ||
                   existingDocTypes.has(req.title.toLowerCase()) ||
                   existingItems.some(i => i.title.toLowerCase().includes(req.docType.replace('_', ' ')));

    if (!hasDoc) {
      missing.push({
        docType: req.docType,
        title: req.title,
        reason: req.description,
        severity: req.severity,
        suggestion: getSuggestion(req)
      });
    }
  }

  return missing;
}

/**
 * Get suggestion for missing document
 */
function getSuggestion(req: DocRequirement): string {
  const sourceLabels: Record<string, string> = {
    exportJobs: 'Сгенерируйте отчёт в модуле Exports',
    documents: 'Загрузите документ в Document Vault',
    ownershipViews: 'Создайте снимок в Ownership Map'
  };

  return req.sources.map(s => sourceLabels[s]).join(' или ');
}

/**
 * Generate checklist markdown
 */
export function generateChecklistMd(missingDocs: MissingDoc[]): string {
  if (missingDocs.length === 0) {
    return '# Чеклист документов\n\n✅ Все необходимые документы присутствуют.';
  }

  const required = missingDocs.filter(d => d.severity === 'required');
  const recommended = missingDocs.filter(d => d.severity === 'recommended');
  const optional = missingDocs.filter(d => d.severity === 'optional');

  let md = '# Чеклист документов\n\n';

  if (required.length > 0) {
    md += '## ⛔ Обязательные (отсутствуют)\n\n';
    for (const doc of required) {
      md += `- [ ] **${doc.title}** — ${doc.reason}\n`;
      md += `  - _${doc.suggestion}_\n`;
    }
    md += '\n';
  }

  if (recommended.length > 0) {
    md += '## ⚠️ Рекомендуемые (отсутствуют)\n\n';
    for (const doc of recommended) {
      md += `- [ ] ${doc.title} — ${doc.reason}\n`;
      md += `  - _${doc.suggestion}_\n`;
    }
    md += '\n';
  }

  if (optional.length > 0) {
    md += '## ℹ️ Опциональные (отсутствуют)\n\n';
    for (const doc of optional) {
      md += `- [ ] ${doc.title} — ${doc.reason}\n`;
    }
    md += '\n';
  }

  return md;
}

/**
 * Create exception for missing required docs
 */
export function createMissingDocsException(
  pack: ReportPack,
  missingDocs: MissingDoc[]
): {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  moduleId: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
} | null {
  const requiredMissing = missingDocs.filter(d => d.severity === 'required');

  if (requiredMissing.length === 0) {
    return null;
  }

  return {
    title: `Отсутствуют обязательные документы: ${pack.name}`,
    description: `В пакете "${pack.name}" для ${pack.recipientJson.org} отсутствуют ${requiredMissing.length} обязательных документов.`,
    severity: 'high',
    moduleId: '52',
    entityType: 'reportPacks',
    entityId: pack.id,
    details: {
      packName: pack.name,
      recipientType: pack.recipientJson.type,
      recipientOrg: pack.recipientJson.org,
      missingDocs: requiredMissing.map(d => ({ docType: d.docType, title: d.title }))
    }
  };
}

/**
 * Get completeness score
 */
export function getCompletenessScore(
  recipientType: RecipientType,
  existingItems: PackItem[]
): {
  score: number;
  label: string;
  color: 'red' | 'amber' | 'green';
} {
  const requirements = RECIPIENT_REQUIREMENTS[recipientType] || RECIPIENT_REQUIREMENTS.other;
  const totalRequired = requirements.filter(r => r.severity === 'required').length;
  const totalRecommended = requirements.filter(r => r.severity === 'recommended').length;

  const missing = checkMissingDocs(recipientType, 'household', existingItems);
  const missingRequired = missing.filter(d => d.severity === 'required').length;
  const missingRecommended = missing.filter(d => d.severity === 'recommended').length;

  // Calculate score: required = 70%, recommended = 30%
  const requiredScore = totalRequired > 0
    ? ((totalRequired - missingRequired) / totalRequired) * 70
    : 70;
  const recommendedScore = totalRecommended > 0
    ? ((totalRecommended - missingRecommended) / totalRecommended) * 30
    : 30;

  const score = Math.round(requiredScore + recommendedScore);

  let label: string;
  let color: 'red' | 'amber' | 'green';

  if (score >= 90) {
    label = 'Полный';
    color = 'green';
  } else if (score >= 70) {
    label = 'Достаточный';
    color = 'amber';
  } else {
    label = 'Неполный';
    color = 'red';
  }

  return { score, label, color };
}
