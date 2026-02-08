// AI Policy Assistant - Simulated responses for MVP
// In production, this would integrate with an actual LLM API

export interface AiSummaryResult {
  summary: string;
  keyPoints: string[];
  locale: string;
  confidence: number;
  assumptions: string[];
  disclaimer: string;
}

export interface AiSopChecklistResult {
  steps: Array<{
    orderIndex: number;
    title: string;
    description?: string;
    responsibleRole?: string;
  }>;
  locale: string;
  confidence: number;
  assumptions: string[];
  disclaimer: string;
}

export interface AiUpdateProposalResult {
  proposedChanges: string;
  rationale: string;
  affectedSections: string[];
  locale: string;
  confidence: number;
  assumptions: string[];
  disclaimer: string;
}

const DISCLAIMER_RU = 'AI-генерированный контент требует проверки специалистом. Не является юридической консультацией.';
const DISCLAIMER_EN = 'AI-generated content requires expert review. Not legal advice.';
const DISCLAIMER_UK = 'AI-генерований контент потребує перевірки спеціалістом. Не є юридичною консультацією.';

function getDisclaimer(locale: string): string {
  switch (locale) {
    case 'en': return DISCLAIMER_EN;
    case 'uk': return DISCLAIMER_UK;
    default: return DISCLAIMER_RU;
  }
}

export async function summarizePolicy(
  content: string,
  title: string,
  locale: string = 'ru'
): Promise<AiSummaryResult> {
  // Simulated AI response for MVP
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

  const contentLength = content.length;
  const wordCount = content.split(/\s+/).length;

  // Generate simple summary based on content characteristics
  const summaryRu = `Документ "${title}" содержит ${wordCount} слов и определяет ключевые правила и процедуры. Основные разделы охватывают требования к выполнению, ответственных лиц и сроки.`;
  const summaryEn = `Document "${title}" contains ${wordCount} words and defines key rules and procedures. Main sections cover execution requirements, responsible parties, and timelines.`;
  const summaryUk = `Документ "${title}" містить ${wordCount} слів і визначає ключові правила та процедури. Основні розділи охоплюють вимоги до виконання, відповідальних осіб та терміни.`;

  const summary = locale === 'en' ? summaryEn : locale === 'uk' ? summaryUk : summaryRu;

  const keyPointsRu = [
    'Определены роли и ответственности',
    'Установлены сроки выполнения',
    'Описаны процедуры эскалации',
    'Указаны требования к документированию',
  ];
  const keyPointsEn = [
    'Roles and responsibilities defined',
    'Execution timelines established',
    'Escalation procedures described',
    'Documentation requirements specified',
  ];
  const keyPointsUk = [
    'Визначені ролі та відповідальності',
    'Встановлені терміни виконання',
    'Описані процедури ескалації',
    'Вказані вимоги до документування',
  ];

  const keyPoints = locale === 'en' ? keyPointsEn : locale === 'uk' ? keyPointsUk : keyPointsRu;

  const assumptionsRu = [
    'Документ актуален и соответствует текущим требованиям',
    'Все разделы были проанализированы',
  ];
  const assumptionsEn = [
    'Document is current and meets requirements',
    'All sections were analyzed',
  ];
  const assumptionsUk = [
    'Документ актуальний і відповідає поточним вимогам',
    'Усі розділи були проаналізовані',
  ];

  const assumptions = locale === 'en' ? assumptionsEn : locale === 'uk' ? assumptionsUk : assumptionsRu;

  return {
    summary,
    keyPoints,
    locale,
    confidence: 0.75,
    assumptions,
    disclaimer: getDisclaimer(locale),
  };
}

export async function generateSopChecklist(
  content: string,
  title: string,
  locale: string = 'ru'
): Promise<AiSopChecklistResult> {
  await new Promise(resolve => setTimeout(resolve, 700));

  // Extract headings and key phrases to generate steps
  const lines = content.split('\n');
  const steps: AiSopChecklistResult['steps'] = [];
  let orderIndex = 1;

  // Look for numbered items, headers, or key action words
  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) continue;

    // Match headers
    if (trimmed.match(/^#{1,3}\s+/)) {
      const text = trimmed.replace(/^#+\s*/, '');
      if (text.length > 5 && text.length < 100) {
        steps.push({
          orderIndex: orderIndex++,
          title: text,
        });
      }
      continue;
    }

    // Match numbered items
    if (trimmed.match(/^\d+[\.\)]/)) {
      const text = trimmed.replace(/^\d+[\.\)]\s*/, '');
      if (text.length > 5 && text.length < 100) {
        steps.push({
          orderIndex: orderIndex++,
          title: text,
        });
      }
    }
  }

  // If we couldn't extract steps, generate generic ones
  if (steps.length < 3) {
    const defaultStepsRu = [
      { orderIndex: 1, title: 'Подготовка документов и данных' },
      { orderIndex: 2, title: 'Проверка соответствия требованиям' },
      { orderIndex: 3, title: 'Выполнение основных действий' },
      { orderIndex: 4, title: 'Документирование результатов' },
      { orderIndex: 5, title: 'Утверждение и архивирование' },
    ];
    const defaultStepsEn = [
      { orderIndex: 1, title: 'Prepare documents and data' },
      { orderIndex: 2, title: 'Verify compliance with requirements' },
      { orderIndex: 3, title: 'Execute main actions' },
      { orderIndex: 4, title: 'Document results' },
      { orderIndex: 5, title: 'Approve and archive' },
    ];
    const defaultStepsUk = [
      { orderIndex: 1, title: 'Підготовка документів та даних' },
      { orderIndex: 2, title: 'Перевірка відповідності вимогам' },
      { orderIndex: 3, title: 'Виконання основних дій' },
      { orderIndex: 4, title: 'Документування результатів' },
      { orderIndex: 5, title: 'Затвердження та архівування' },
    ];

    return {
      steps: locale === 'en' ? defaultStepsEn : locale === 'uk' ? defaultStepsUk : defaultStepsRu,
      locale,
      confidence: 0.6,
      assumptions: [
        locale === 'en'
          ? 'Generic steps generated due to unstructured content'
          : locale === 'uk'
            ? 'Загальні кроки згенеровані через неструктурований контент'
            : 'Общие шаги сгенерированы из-за неструктурированного контента',
      ],
      disclaimer: getDisclaimer(locale),
    };
  }

  const assumptionsRu = ['Шаги извлечены из структуры документа'];
  const assumptionsEn = ['Steps extracted from document structure'];
  const assumptionsUk = ['Кроки витягнуті зі структури документа'];

  return {
    steps: steps.slice(0, 10), // Limit to 10 steps
    locale,
    confidence: 0.8,
    assumptions: locale === 'en' ? assumptionsEn : locale === 'uk' ? assumptionsUk : assumptionsRu,
    disclaimer: getDisclaimer(locale),
  };
}

export async function proposeUpdate(
  currentContent: string,
  title: string,
  context?: string,
  locale: string = 'ru'
): Promise<AiUpdateProposalResult> {
  await new Promise(resolve => setTimeout(resolve, 600));

  const proposedChangesRu = `## Предлагаемые изменения для "${title}"

### 1. Обновление терминологии
Рекомендуется актуализировать используемые термины в соответствии с текущими стандартами отрасли.

### 2. Уточнение ответственности
Добавить явное указание ответственных ролей для каждого этапа процесса.

### 3. Сроки выполнения
Пересмотреть и уточнить сроки выполнения с учетом текущей операционной нагрузки.

### 4. Добавление контрольных точек
Внедрить промежуточные контрольные точки для отслеживания прогресса.`;

  const proposedChangesEn = `## Proposed changes for "${title}"

### 1. Terminology update
Recommended to update terminology in accordance with current industry standards.

### 2. Responsibility clarification
Add explicit responsible roles for each process stage.

### 3. Execution timelines
Review and clarify timelines considering current operational load.

### 4. Control points
Implement intermediate checkpoints for progress tracking.`;

  const proposedChangesUk = `## Пропоновані зміни для "${title}"

### 1. Оновлення термінології
Рекомендується актуалізувати використовувані терміни відповідно до поточних стандартів галузі.

### 2. Уточнення відповідальності
Додати явне вказання відповідальних ролей для кожного етапу процесу.

### 3. Терміни виконання
Переглянути та уточнити терміни виконання з урахуванням поточного операційного навантаження.

### 4. Додавання контрольних точок
Впровадити проміжні контрольні точки для відстеження прогресу.`;

  const rationaleRu = 'Предложения основаны на анализе текущей версии документа и best practices управления политиками.';
  const rationaleEn = 'Proposals based on analysis of current document version and policy management best practices.';
  const rationaleUk = 'Пропозиції засновані на аналізі поточної версії документа та best practices управління політиками.';

  const sectionsRu = ['Терминология', 'Ответственность', 'Сроки', 'Контроль'];
  const sectionsEn = ['Terminology', 'Responsibility', 'Timelines', 'Control'];
  const sectionsUk = ['Термінологія', 'Відповідальність', 'Терміни', 'Контроль'];

  const assumptionsRu = [
    'Документ требует периодического обновления',
    'Текущая версия действительна',
  ];
  const assumptionsEn = [
    'Document requires periodic updates',
    'Current version is valid',
  ];
  const assumptionsUk = [
    'Документ потребує періодичного оновлення',
    'Поточна версія дійсна',
  ];

  return {
    proposedChanges: locale === 'en' ? proposedChangesEn : locale === 'uk' ? proposedChangesUk : proposedChangesRu,
    rationale: locale === 'en' ? rationaleEn : locale === 'uk' ? rationaleUk : rationaleRu,
    affectedSections: locale === 'en' ? sectionsEn : locale === 'uk' ? sectionsUk : sectionsRu,
    locale,
    confidence: 0.7,
    assumptions: locale === 'en' ? assumptionsEn : locale === 'uk' ? assumptionsUk : assumptionsRu,
    disclaimer: getDisclaimer(locale),
  };
}
