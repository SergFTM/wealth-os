// AI Rules Engine - Rules-based response generation (MVP simulation)

export type PromptType =
  | 'explain_change'
  | 'summarize_risk'
  | 'summarize_performance'
  | 'draft_message'
  | 'draft_committee_pack'
  | 'draft_policy_summary'
  | 'triage_tasks'
  | 'check_data_quality'
  | 'general_query';

export interface AiContext {
  scope?: { type: string; id: string };
  module?: string;
  period?: { start: string; end: string };
  clientSafe?: boolean;
  userRole?: string;
  additionalData?: Record<string, unknown>;
}

export interface AiSource {
  module: string;
  recordType: string;
  recordId: string;
  label: string;
  value?: string | number;
}

export interface AiResponse {
  summary: string;
  keyPoints: string[];
  sources: AiSource[];
  assumptions: string[];
  confidence: number;
  blocked?: boolean;
  blockedReason?: string;
}

// Templates for different prompt types
const responseTemplates: Record<PromptType, (ctx: AiContext, sources: AiSource[]) => AiResponse> = {
  explain_change: (ctx, sources) => {
    const hasNetWorthSources = sources.some(s => s.module === 'net-worth');
    if (!hasNetWorthSources && sources.length === 0) {
      return {
        summary: 'Недостаточно данных для анализа изменений чистой стоимости.',
        keyPoints: ['Отсутствуют данные о позициях и транзакциях за выбранный период'],
        sources: [],
        assumptions: [],
        confidence: 0,
      };
    }

    return {
      summary: `За анализируемый период чистая стоимость портфеля изменилась на основе ${sources.length} источников данных. Основные факторы: рыночная переоценка позиций, дивидендные выплаты и операционные расходы.`,
      keyPoints: [
        'Рыночная переоценка составила основную часть изменения',
        'Дивидендные поступления добавили к общей стоимости',
        'Комиссии и расходы уменьшили чистую стоимость',
        'Валютные курсы повлияли на стоимость международных активов',
      ],
      sources,
      assumptions: [
        'Использованы рыночные цены на конец периода',
        'Дивиденды учтены на дату ex-date',
        'Валютные курсы взяты из официальных источников',
      ],
      confidence: Math.min(85, 50 + sources.length * 5),
    };
  },

  summarize_risk: (ctx, sources) => {
    const riskSources = sources.filter(s => s.module === 'risk');
    if (riskSources.length === 0) {
      return {
        summary: 'Недостаточно данных для сводки рисков.',
        keyPoints: ['Отсутствуют данные о рисковых алертах'],
        sources: [],
        assumptions: [],
        confidence: 0,
      };
    }

    return {
      summary: `Анализ выявил ${riskSources.length} рисковых событий. Общий риск-профиль: умеренный. Требуется внимание к концентрации в отдельных секторах.`,
      keyPoints: [
        'Концентрация в технологическом секторе превышает лимит IPS',
        'Валютная экспозиция в пределах допустимых границ',
        'Ликвидность портфеля на достаточном уровне',
        'Рекомендуется диверсификация в защитные активы',
      ],
      sources: riskSources,
      assumptions: [
        'Риск-метрики рассчитаны на основе исторической волатильности',
        'Лимиты взяты из действующего IPS',
        'Корреляции основаны на данных за 3 года',
      ],
      confidence: Math.min(80, 45 + riskSources.length * 7),
    };
  },

  summarize_performance: (ctx, sources) => {
    const perfSources = sources.filter(s => s.module === 'performance');
    if (perfSources.length === 0) {
      return {
        summary: 'Недостаточно данных для анализа эффективности.',
        keyPoints: ['Отсутствуют данные о доходности портфелей'],
        sources: [],
        assumptions: [],
        confidence: 0,
      };
    }

    return {
      summary: `Портфель показал доходность выше benchmark за анализируемый период. Основной вклад внесли позиции в акциях роста и альтернативных инвестициях.`,
      keyPoints: [
        'Доходность YTD превысила benchmark на 2.3%',
        'Технологический сектор показал наибольший рост',
        'Альтернативные инвестиции добавили диверсификацию',
        'Риск-скорректированная доходность (Sharpe) улучшилась',
      ],
      sources: perfSources,
      assumptions: [
        'Доходность рассчитана по методу TWR',
        'Benchmark: 60/40 глобальный портфель',
        'Дивиденды реинвестированы',
      ],
      confidence: Math.min(88, 55 + perfSources.length * 6),
    };
  },

  draft_message: (ctx, sources) => ({
    summary: `Уважаемый клиент,

Рады предоставить вам обновление по состоянию вашего портфеля.

За отчетный период ваш портфель продемонстрировал положительную динамику. Мы продолжаем придерживаться согласованной инвестиционной стратегии.

Ключевые моменты:
• Общая стоимость активов увеличилась
• Диверсификация портфеля соответствует целевым параметрам
• Плановые ребалансировки выполнены

При возникновении вопросов, пожалуйста, свяжитесь с вашим relationship manager.

С уважением,
Команда Wealth Management`,
    keyPoints: [
      'Обновление статуса портфеля',
      'Соответствие инвестиционной стратегии',
      'Приглашение к диалогу',
    ],
    sources,
    assumptions: [
      'Клиент получает ежемесячные обновления',
      'Предпочтительный язык: русский',
      'Формальный стиль общения',
    ],
    confidence: 75,
  }),

  draft_committee_pack: (ctx, sources) => ({
    summary: `# Материалы для заседания инвестиционного комитета

## Повестка
1. Обзор рыночной ситуации
2. Анализ портфельной эффективности
3. Нарушения IPS и предложения по исправлению
4. Новые инвестиционные идеи
5. Разное

## Рыночный обзор
Глобальные рынки показали смешанную динамику...

## Портфельная эффективность
Совокупная доходность портфелей...

## IPS Compliance
Выявленные нарушения и рекомендации...

## Инвестиционные идеи
Предложения к рассмотрению...`,
    keyPoints: [
      'Структурированный формат для комитета',
      'Включены все обязательные разделы',
      'Данные актуальны на дату подготовки',
    ],
    sources,
    assumptions: [
      'Формат соответствует регламенту комитета',
      'Данные агрегированы из всех модулей',
      'Требуется финальное редактирование',
    ],
    confidence: 70,
  }),

  draft_policy_summary: (ctx, sources) => ({
    summary: `# Резюме инвестиционной политики

## Цели
- Сохранение и рост капитала
- Генерация дохода для текущих нужд
- Трансфер благосостояния следующему поколению

## Ограничения
- Максимальная концентрация: 15% на эмитента
- Ликвидность: минимум 20% в ликвидных активах
- Валютная экспозиция: не более 30% в иностранной валюте

## Benchmark
60% MSCI World / 40% Bloomberg Global Aggregate

## Период ребалансировки
Ежеквартально или при отклонении >5%`,
    keyPoints: [
      'Основные цели инвестирования',
      'Ключевые ограничения',
      'Параметры benchmark',
    ],
    sources,
    assumptions: [
      'IPS действует с последней даты утверждения',
      'Ограничения могут иметь исключения (waivers)',
    ],
    confidence: 82,
  }),

  triage_tasks: (ctx, sources) => {
    if (sources.length === 0) {
      return {
        summary: 'Нет задач требующих приоритизации.',
        keyPoints: ['Все текущие задачи в нормальном статусе'],
        sources: [],
        assumptions: [],
        confidence: 90,
      };
    }

    return {
      summary: `Выявлено ${sources.length} задач требующих внимания. Рекомендуемый порядок приоритетов:`,
      keyPoints: [
        '1. SLA под угрозой: проверить статусы согласований',
        '2. Data quality issues: исправить расхождения в reconciliation',
        '3. IPS breaches: подготовить waiver requests',
        '4. Fee billing: проверить неоплаченные счета',
      ],
      sources,
      assumptions: [
        'Приоритеты основаны на severity и сроках',
        'SLA параметры взяты из текущих политик',
        'Учтены зависимости между задачами',
      ],
      confidence: Math.min(85, 50 + sources.length * 4),
    };
  },

  check_data_quality: (ctx, sources) => {
    const qualitySources = sources.filter(s => s.module === 'integrations');
    if (qualitySources.length === 0) {
      return {
        summary: 'Критических проблем качества данных не обнаружено.',
        keyPoints: ['Синхронизация данных работает штатно'],
        sources: [],
        assumptions: ['Проверены все активные коннекторы'],
        confidence: 85,
      };
    }

    return {
      summary: `Обнаружено ${qualitySources.length} проблем качества данных. Рекомендуется проверить коннекторы и запустить повторную синхронизацию.`,
      keyPoints: [
        'Обнаружены дубликаты записей',
        'Есть расхождения с данными кастодианов',
        'Некоторые данные устарели',
        'Рекомендуется ручная сверка',
      ],
      sources: qualitySources,
      assumptions: [
        'Проверка выполнена на текущую дату',
        'Сравнение с последней успешной синхронизацией',
      ],
      confidence: Math.min(78, 40 + qualitySources.length * 6),
    };
  },

  general_query: (ctx, sources) => ({
    summary: 'Запрос обработан. Результаты основаны на доступных данных платформы.',
    keyPoints: [
      'Анализ выполнен по текущим данным',
      'Для уточнения используйте специализированные запросы',
    ],
    sources,
    assumptions: [
      'Контекст определен автоматически',
      'Данные актуальны на момент запроса',
    ],
    confidence: Math.min(70, 35 + sources.length * 5),
  }),
};

export function generateResponse(
  promptType: PromptType,
  context: AiContext,
  sources: AiSource[]
): AiResponse {
  const template = responseTemplates[promptType] || responseTemplates.general_query;
  const response = template(context, sources);

  // Apply client-safe mode if needed
  if (context.clientSafe) {
    response.keyPoints = response.keyPoints.filter(
      kp => !kp.toLowerCase().includes('internal') && !kp.toLowerCase().includes('staff')
    );
    response.assumptions = response.assumptions.filter(
      a => !a.toLowerCase().includes('internal')
    );
  }

  return response;
}

export function checkGuardrails(
  promptType: PromptType,
  userRole: string,
  allowedTypes: string[]
): { allowed: boolean; reason?: string } {
  if (!allowedTypes.includes(promptType) && !allowedTypes.includes('*')) {
    return {
      allowed: false,
      reason: `Тип запроса "${promptType}" не разрешен для роли "${userRole}"`,
    };
  }

  return { allowed: true };
}
