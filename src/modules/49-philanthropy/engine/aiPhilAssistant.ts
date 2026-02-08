/**
 * AI Philanthropy Assistant
 * Provides AI-powered assistance for grants management
 */

export interface Grant {
  id: string;
  purpose?: string;
  purposeMarkdown?: string;
  granteeJson?: {
    name?: string;
    country?: string;
    regNo?: string;
  };
  requestedAmount?: number;
  approvedAmount?: number;
  currency?: string;
  programId?: string;
}

export interface Program {
  id: string;
  name: string;
  themeKey: string;
  goalsMarkdown?: string;
  criteriaJson?: { criterion: string; required: boolean }[];
}

export interface AIResponse {
  content: string;
  sources: string[];
  confidence: 'high' | 'medium' | 'low';
  assumptions: string[];
  disclaimer: string;
}

const DISCLAIMER_RU = 'Не является юридической или налоговой консультацией. AI-рекомендации требуют проверки специалистами.';
const DISCLAIMER_EN = 'Not legal or tax advice. AI recommendations require professional review.';
const DISCLAIMER_UK = 'Не є юридичною або податковою консультацією. AI-рекомендації потребують перевірки фахівцями.';

/**
 * Generate grant summary
 */
export function generateGrantSummary(
  grant: Grant,
  program?: Program,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): AIResponse {
  const granteeName = grant.granteeJson?.name || 'Получатель';
  const amount = grant.requestedAmount
    ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: grant.currency || 'USD' }).format(grant.requestedAmount)
    : 'N/A';
  const purpose = grant.purpose || 'благотворительный проект';
  const programName = program?.name || 'N/A';

  const summaries = {
    ru: `## Краткое описание гранта

**Получатель:** ${granteeName}
**Страна:** ${grant.granteeJson?.country || 'N/A'}
**Регистрационный номер:** ${grant.granteeJson?.regNo || 'N/A'}

**Программа:** ${programName}
**Запрашиваемая сумма:** ${amount}

**Цель:**
${purpose}

### Соответствие программе
${program ? `Грант соответствует тематике "${program.name}" и направлен на достижение целей программы.` : 'Программа не указана.'}

### Рекомендации по рассмотрению
1. Проверить соответствие критериям программы
2. Провести due diligence получателя
3. Запросить дополнительную документацию при необходимости
4. Оценить потенциальный impact

---
*${DISCLAIMER_RU}*`,

    en: `## Grant Summary

**Grantee:** ${granteeName}
**Country:** ${grant.granteeJson?.country || 'N/A'}
**Registration Number:** ${grant.granteeJson?.regNo || 'N/A'}

**Program:** ${programName}
**Requested Amount:** ${amount}

**Purpose:**
${purpose}

### Program Alignment
${program ? `The grant aligns with the "${program.name}" theme and aims to achieve program objectives.` : 'Program not specified.'}

### Review Recommendations
1. Verify alignment with program criteria
2. Conduct grantee due diligence
3. Request additional documentation if needed
4. Assess potential impact

---
*${DISCLAIMER_EN}*`,

    uk: `## Короткий опис гранту

**Отримувач:** ${granteeName}
**Країна:** ${grant.granteeJson?.country || 'N/A'}
**Реєстраційний номер:** ${grant.granteeJson?.regNo || 'N/A'}

**Програма:** ${programName}
**Запитувана сума:** ${amount}

**Мета:**
${purpose}

### Відповідність програмі
${program ? `Грант відповідає тематиці "${program.name}" і спрямований на досягнення цілей програми.` : 'Програма не вказана.'}

### Рекомендації щодо розгляду
1. Перевірити відповідність критеріям програми
2. Провести due diligence отримувача
3. Запросити додаткову документацію за потреби
4. Оцінити потенційний impact

---
*${DISCLAIMER_UK}*`,
  };

  return {
    content: summaries[locale],
    sources: ['Данные заявки на грант', 'Параметры программы'],
    confidence: 'medium',
    assumptions: [
      'Информация о получателе достоверна',
      'Программа активна и принимает заявки',
    ],
    disclaimer: locale === 'ru' ? DISCLAIMER_RU : locale === 'en' ? DISCLAIMER_EN : DISCLAIMER_UK,
  };
}

/**
 * Generate due diligence checklist
 */
export function generateDDChecklist(
  grant: Grant,
  program?: Program,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): AIResponse {
  const checklists = {
    ru: `## Чеклист Due Diligence

### 1. Организационные документы
- [ ] Свидетельство о регистрации / Certificate of Incorporation
- [ ] Устав организации / Bylaws
- [ ] Список членов правления / Board members list
- [ ] IRS Determination Letter (501(c)(3)) или эквивалент

### 2. Финансовая отчетность
- [ ] Аудированная финансовая отчетность (последние 2 года)
- [ ] Форма 990 (для US) или эквивалент
- [ ] Бюджет на текущий год
- [ ] Финансовый прогноз

### 3. Программная информация
- [ ] Описание миссии и стратегии
- [ ] Годовой отчет
- [ ] Примеры успешных проектов
- [ ] Метрики воздействия

### 4. Комплаенс
- [ ] Проверка по санкционным спискам (OFAC, EU, UN)
- [ ] Проверка на конфликт интересов
- [ ] KYC документы ключевых лиц
- [ ] Антикоррупционная политика

### 5. Проектная документация
- [ ] Детальное описание проекта
- [ ] Бюджет проекта с разбивкой
- [ ] Timeline и milestones
- [ ] План мониторинга и оценки

### 6. Референсы
- [ ] Рекомендации от других фондов
- [ ] Отзывы бенефициаров
- [ ] Медиа-упоминания

---
*${DISCLAIMER_RU}*`,

    en: `## Due Diligence Checklist

### 1. Organizational Documents
- [ ] Certificate of Incorporation
- [ ] Bylaws
- [ ] Board members list
- [ ] IRS Determination Letter (501(c)(3)) or equivalent

### 2. Financial Reporting
- [ ] Audited financial statements (last 2 years)
- [ ] Form 990 (for US) or equivalent
- [ ] Current year budget
- [ ] Financial projections

### 3. Program Information
- [ ] Mission and strategy description
- [ ] Annual report
- [ ] Examples of successful projects
- [ ] Impact metrics

### 4. Compliance
- [ ] Sanctions screening (OFAC, EU, UN)
- [ ] Conflict of interest check
- [ ] KYC documents for key persons
- [ ] Anti-corruption policy

### 5. Project Documentation
- [ ] Detailed project description
- [ ] Project budget breakdown
- [ ] Timeline and milestones
- [ ] Monitoring and evaluation plan

### 6. References
- [ ] Recommendations from other foundations
- [ ] Beneficiary feedback
- [ ] Media mentions

---
*${DISCLAIMER_EN}*`,

    uk: `## Чекліст Due Diligence

### 1. Організаційні документи
- [ ] Свідоцтво про реєстрацію / Certificate of Incorporation
- [ ] Статут організації / Bylaws
- [ ] Список членів правління / Board members list
- [ ] IRS Determination Letter (501(c)(3)) або еквівалент

### 2. Фінансова звітність
- [ ] Аудійована фінансова звітність (останні 2 роки)
- [ ] Форма 990 (для US) або еквівалент
- [ ] Бюджет на поточний рік
- [ ] Фінансовий прогноз

### 3. Програмна інформація
- [ ] Опис місії та стратегії
- [ ] Річний звіт
- [ ] Приклади успішних проектів
- [ ] Метрики впливу

### 4. Комплаєнс
- [ ] Перевірка за санкційними списками (OFAC, EU, UN)
- [ ] Перевірка на конфлікт інтересів
- [ ] KYC документи ключових осіб
- [ ] Антикорупційна політика

### 5. Проектна документація
- [ ] Детальний опис проекту
- [ ] Бюджет проекту з розбивкою
- [ ] Timeline і milestones
- [ ] План моніторингу та оцінки

### 6. Референси
- [ ] Рекомендації від інших фондів
- [ ] Відгуки бенефіціарів
- [ ] Медіа-згадування

---
*${DISCLAIMER_UK}*`,
  };

  return {
    content: checklists[locale],
    sources: ['Лучшие практики due diligence', 'Стандарты фондов'],
    confidence: 'high',
    assumptions: [],
    disclaimer: locale === 'ru' ? DISCLAIMER_RU : locale === 'en' ? DISCLAIMER_EN : DISCLAIMER_UK,
  };
}

/**
 * Generate impact narrative draft
 */
export function generateImpactNarrative(
  grant: Grant,
  metrics: {
    beneficiaries?: number;
    projectsCompleted?: number;
    geographies?: string[];
  },
  locale: 'ru' | 'en' | 'uk' = 'ru'
): AIResponse {
  const granteeName = grant.granteeJson?.name || 'Организация';
  const amount = grant.approvedAmount
    ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: grant.currency || 'USD' }).format(grant.approvedAmount)
    : 'N/A';
  const beneficiaries = metrics.beneficiaries || '[число]';
  const projects = metrics.projectsCompleted || '[число]';
  const geos = metrics.geographies?.join(', ') || '[регионы]';

  const narratives = {
    ru: `## Отчет о воздействии

### Обзор

Благодаря гранту в размере ${amount}, организация ${granteeName} успешно реализовала программу, направленную на ${grant.purpose || '[цель проекта]'}.

### Ключевые достижения

За отчетный период удалось достичь следующих результатов:

- **${beneficiaries}** бенефициаров получили поддержку
- **${projects}** проектов успешно завершено
- Охвачены регионы: ${geos}

### Истории успеха

[Добавьте 1-2 конкретные истории бенефициаров, демонстрирующие impact программы]

### Уроки и выводы

Реализация проекта позволила выявить следующие insights:

1. [Ключевой вывод 1]
2. [Ключевой вывод 2]
3. [Рекомендации на будущее]

### Устойчивость

Проект заложил основу для долгосрочных изменений через [описание механизмов устойчивости].

### Благодарность

Мы благодарим фонд за поддержку и партнерство в достижении нашей миссии.

---
*${DISCLAIMER_RU}*`,

    en: `## Impact Report

### Overview

Thanks to the grant of ${amount}, organization ${granteeName} successfully implemented a program aimed at ${grant.purpose || '[project goal]'}.

### Key Achievements

During the reporting period, the following results were achieved:

- **${beneficiaries}** beneficiaries received support
- **${projects}** projects successfully completed
- Regions covered: ${geos}

### Success Stories

[Add 1-2 specific beneficiary stories demonstrating program impact]

### Lessons Learned

Project implementation revealed the following insights:

1. [Key insight 1]
2. [Key insight 2]
3. [Recommendations for the future]

### Sustainability

The project laid the groundwork for long-term change through [description of sustainability mechanisms].

### Acknowledgment

We thank the foundation for support and partnership in achieving our mission.

---
*${DISCLAIMER_EN}*`,

    uk: `## Звіт про вплив

### Огляд

Завдяки гранту в розмірі ${amount}, організація ${granteeName} успішно реалізувала програму, спрямовану на ${grant.purpose || '[мета проекту]'}.

### Ключові досягнення

За звітний період вдалося досягти наступних результатів:

- **${beneficiaries}** бенефіціарів отримали підтримку
- **${projects}** проектів успішно завершено
- Охоплено регіони: ${geos}

### Історії успіху

[Додайте 1-2 конкретні історії бенефіціарів, що демонструють impact програми]

### Уроки та висновки

Реалізація проекту дозволила виявити наступні insights:

1. [Ключовий висновок 1]
2. [Ключовий висновок 2]
3. [Рекомендації на майбутнє]

### Сталість

Проект заклав основу для довгострокових змін через [опис механізмів сталості].

### Подяка

Ми дякуємо фонду за підтримку та партнерство в досягненні нашої місії.

---
*${DISCLAIMER_UK}*`,
  };

  return {
    content: narratives[locale],
    sources: ['Данные гранта', 'Метрики воздействия'],
    confidence: 'medium',
    assumptions: [
      'Метрики достоверны и верифицированы',
      'Проект реализован в соответствии с планом',
    ],
    disclaimer: locale === 'ru' ? DISCLAIMER_RU : locale === 'en' ? DISCLAIMER_EN : DISCLAIMER_UK,
  };
}

/**
 * Detect missing documents
 */
export function detectMissingDocs(
  attachedDocTypes: string[],
  requiredDocTypes: string[] = [
    'registration',
    'tax_exempt',
    'financial_audit',
    'budget',
    'proposal',
  ]
): { missing: string[]; complete: boolean } {
  const missing = requiredDocTypes.filter(
    docType => !attachedDocTypes.includes(docType)
  );

  return {
    missing,
    complete: missing.length === 0,
  };
}
