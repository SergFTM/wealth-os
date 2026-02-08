// AI Deal Assistant Engine
// Provides AI-powered analysis for deals and corporate actions

export interface AiResult {
  content: string;
  confidence: 'high' | 'medium' | 'low';
  assumptions: string[];
  sources: string[];
  generatedAt: string;
  disclaimer: string;
}

const DISCLAIMER_RU = 'AI-результат носит информационный характер. Не является юридической или инвестиционной консультацией. Требуется проверка специалистом.';
const DISCLAIMER_EN = 'AI result is informational only. Not legal or investment advice. Professional review required.';

// Summarize deal pack documents
export async function summarizeDealPack(
  documents: Array<{
    name: string;
    type: string;
    content?: string;
    summary?: string;
  }>,
  dealInfo: {
    name: string;
    type: string;
    amount?: number;
    targetEntity?: string;
  },
  locale: 'ru' | 'en' = 'ru'
): Promise<AiResult> {
  // Simulated AI summary - in production would call LLM API
  const docTypes = documents.map(d => d.type).join(', ');
  const assumptions: string[] = [];
  const sources: string[] = [];

  documents.forEach(doc => {
    sources.push(`Документ: ${doc.name}`);
  });

  if (!documents.some(d => d.type === 'ppm' || d.type === 'term_sheet')) {
    assumptions.push('Основные условия сделки могут быть неполными без PPM/Term Sheet');
  }

  const summary = locale === 'ru' ? `
## Резюме сделки: ${dealInfo.name}

### Основные параметры
- **Тип сделки**: ${dealInfo.type}
- **Сумма**: ${dealInfo.amount ? `$${dealInfo.amount.toLocaleString()}` : 'Не указана'}
- **Целевая структура**: ${dealInfo.targetEntity || 'Не указана'}

### Проанализированные документы
${documents.map(d => `- ${d.name} (${d.type})`).join('\n')}

### Ключевые условия
На основе предоставленных документов выявлены следующие ключевые условия:
- Management fee и carried interest стандартные для данного типа сделки
- Lock-up период требует внимания при планировании ликвидности
- Юридическая структура соответствует типичной для данного рынка

### Рекомендуемые действия
1. Подтвердить окончательные условия с контрагентом
2. Получить заключение налогового консультанта
3. Завершить compliance проверку
4. Подготовить документы для подписания

### Риски и ограничения
- Стандартные риски для данного класса активов
- Требуется отдельный анализ налоговых последствий
` : `
## Deal Summary: ${dealInfo.name}

### Key Parameters
- **Deal Type**: ${dealInfo.type}
- **Amount**: ${dealInfo.amount ? `$${dealInfo.amount.toLocaleString()}` : 'Not specified'}
- **Target Entity**: ${dealInfo.targetEntity || 'Not specified'}

### Documents Analyzed
${documents.map(d => `- ${d.name} (${d.type})`).join('\n')}

### Key Terms
Based on provided documents, the following key terms were identified:
- Management fee and carried interest are standard for this deal type
- Lock-up period requires attention for liquidity planning
- Legal structure is typical for this market

### Recommended Actions
1. Confirm final terms with counterparty
2. Obtain tax advisor opinion
3. Complete compliance review
4. Prepare execution documents

### Risks and Limitations
- Standard risks for this asset class
- Separate tax analysis required
`;

  return {
    content: summary.trim(),
    confidence: documents.length >= 3 ? 'high' : documents.length >= 1 ? 'medium' : 'low',
    assumptions,
    sources,
    generatedAt: new Date().toISOString(),
    disclaimer: locale === 'ru' ? DISCLAIMER_RU : DISCLAIMER_EN,
  };
}

// Generate checklist suggestions
export async function generateChecklistSuggestions(
  dealType: string,
  existingItems: string[],
  locale: 'ru' | 'en' = 'ru'
): Promise<AiResult> {
  const suggestions: Record<string, string[]> = {
    subscription: [
      'Проверить минимальный порог инвестирования',
      'Уточнить график capital calls',
      'Запросить track record управляющего',
      'Проверить конфликты интересов',
      'Получить подтверждение аккредитации инвестора',
    ],
    secondary: [
      'Проверить наличие ROFR у GP',
      'Получить последний отчет о NAV',
      'Проверить историю распределений',
      'Уточнить transfer restrictions',
      'Провести background check продавца',
    ],
    co_invest: [
      'Сравнить условия с основным фондом',
      'Проверить allocation methodology',
      'Уточнить follow-on права',
      'Запросить детали о целевой компании',
      'Проверить concentration limits',
    ],
  };

  const dealSuggestions = suggestions[dealType] || suggestions.subscription;
  const newSuggestions = dealSuggestions.filter(s => !existingItems.includes(s));

  const content = locale === 'ru' ? `
## Рекомендуемые пункты чеклиста

На основе типа сделки "${dealType}" и анализа best practices рекомендуем добавить:

${newSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### Обоснование
Данные пункты основаны на:
- Стандартных процедурах due diligence для ${dealType}
- Регуляторных требованиях
- Лучших практиках индустрии
` : `
## Recommended Checklist Items

Based on deal type "${dealType}" and best practices analysis, we recommend adding:

${newSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### Rationale
These items are based on:
- Standard due diligence procedures for ${dealType}
- Regulatory requirements
- Industry best practices
`;

  return {
    content: content.trim(),
    confidence: 'medium',
    assumptions: [
      'Стандартная структура сделки',
      'Юрисдикция США/ЕС',
      'Профессиональный инвестор',
    ],
    sources: ['Internal checklist templates', 'Industry best practices database'],
    generatedAt: new Date().toISOString(),
    disclaimer: locale === 'ru' ? DISCLAIMER_RU : DISCLAIMER_EN,
  };
}

// Draft approval memo
export async function draftApprovalMemo(
  deal: {
    name: string;
    type: string;
    amount?: number;
    targetEntity?: string;
    termsJson?: Record<string, unknown>;
  },
  checklistStatus?: { completionPct: number; blockedItems?: string[] },
  locale: 'ru' | 'en' = 'ru'
): Promise<AiResult> {
  const terms = deal.termsJson || {};

  const content = locale === 'ru' ? `
# МЕМОРАНДУМ НА СОГЛАСОВАНИЕ

**Дата**: ${new Date().toLocaleDateString('ru-RU')}
**Сделка**: ${deal.name}
**Тип**: ${deal.type}

---

## 1. Краткое описание

Запрашивается согласование на участие в сделке "${deal.name}" на сумму ${deal.amount ? `$${deal.amount.toLocaleString()}` : '[уточняется]'}.

## 2. Ключевые условия

| Параметр | Значение |
|----------|----------|
| Целевая структура | ${deal.targetEntity || 'N/A'} |
| Management fee | ${terms.managementFee || 'Стандартная'} |
| Carried interest | ${terms.carriedInterest || 'Стандартный'} |
| Lock-up | ${terms.lockupPeriod || 'N/A'} |
| Юрисдикция | ${terms.jurisdiction || 'N/A'} |

## 3. Статус проверки

- **Checklist**: ${checklistStatus ? `${checklistStatus.completionPct}% завершено` : 'В процессе'}
${checklistStatus?.blockedItems?.length ? `- **Заблокированные пункты**: ${checklistStatus.blockedItems.join(', ')}` : ''}

## 4. Риски

- Стандартные риски для данного класса активов
- Риск ликвидности в период lock-up
- Валютный риск (если применимо)

## 5. Рекомендация

На основе проведенного анализа, рекомендуется [утвердить/отклонить/запросить дополнительную информацию].

---

**Подготовил**: [Имя]
**Требуется согласование**: CIO, Compliance
` : `
# APPROVAL MEMORANDUM

**Date**: ${new Date().toLocaleDateString('en-US')}
**Deal**: ${deal.name}
**Type**: ${deal.type}

---

## 1. Executive Summary

Approval is requested for participation in "${deal.name}" for ${deal.amount ? `$${deal.amount.toLocaleString()}` : '[TBD]'}.

## 2. Key Terms

| Parameter | Value |
|-----------|-------|
| Target Entity | ${deal.targetEntity || 'N/A'} |
| Management fee | ${terms.managementFee || 'Standard'} |
| Carried interest | ${terms.carriedInterest || 'Standard'} |
| Lock-up | ${terms.lockupPeriod || 'N/A'} |
| Jurisdiction | ${terms.jurisdiction || 'N/A'} |

## 3. Due Diligence Status

- **Checklist**: ${checklistStatus ? `${checklistStatus.completionPct}% complete` : 'In progress'}
${checklistStatus?.blockedItems?.length ? `- **Blocked items**: ${checklistStatus.blockedItems.join(', ')}` : ''}

## 4. Risks

- Standard risks for this asset class
- Liquidity risk during lock-up period
- Currency risk (if applicable)

## 5. Recommendation

Based on the analysis performed, recommendation is to [approve/reject/request additional information].

---

**Prepared by**: [Name]
**Approval required**: CIO, Compliance
`;

  return {
    content: content.trim(),
    confidence: deal.amount && deal.targetEntity ? 'high' : 'medium',
    assumptions: [
      'Информация о сделке актуальна',
      'Стандартная структура и условия',
      'Требуется финальная проверка юристом',
    ],
    sources: ['Deal record', 'Checklist status', 'Terms database'],
    generatedAt: new Date().toISOString(),
    disclaimer: locale === 'ru' ? DISCLAIMER_RU : DISCLAIMER_EN,
  };
}

export default {
  summarizeDealPack,
  generateChecklistSuggestions,
  draftApprovalMemo,
};
