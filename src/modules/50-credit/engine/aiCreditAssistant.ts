/**
 * AI Credit Assistant
 * Generates explanations and memos for credit module
 */

import { CreditLoan, CreditFacility, CreditCovenant, CreditPayment } from './types';

export interface AiResponse {
  content: string;
  sources: string[];
  confidence: 'high' | 'medium' | 'low';
  assumptions: string[];
  disclaimer: string;
}

const DISCLAIMER_RU = 'Не является финансовой или юридической рекомендацией. Условия кредитов требуют подтверждения банком и юристами.';

/**
 * Explain interest cost for a client
 */
export function explainInterestCost(
  loans: CreditLoan[],
  payments: CreditPayment[],
  currency: string = 'USD'
): AiResponse {
  const activeLoans = loans.filter(l => l.statusKey === 'active' && l.currency === currency);
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.outstandingAmount, 0);

  // Calculate weighted average rate
  const weightedRate = activeLoans.reduce((sum, l) => {
    const rate = l.currentRatePct || l.fixedRatePct || 0;
    return sum + (rate * l.outstandingAmount);
  }, 0) / (totalOutstanding || 1);

  // YTD interest from payments
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const ytdPayments = payments.filter(p =>
    p.statusKey === 'paid' &&
    new Date(p.paidAt || p.dueAt) >= yearStart &&
    p.currency === currency
  );
  const ytdInterest = ytdPayments.reduce((sum, p) => sum + (p.interestPart || 0), 0);

  const content = `## Анализ процентных расходов

### Текущая позиция
- **Общий долг:** ${formatCurrency(totalOutstanding, currency)}
- **Активных займов:** ${activeLoans.length}
- **Средневзвешенная ставка:** ${weightedRate.toFixed(2)}%

### Расходы YTD
- **Проценты уплаченные:** ${formatCurrency(ytdInterest, currency)}
- **Примерный годовой расход:** ${formatCurrency(totalOutstanding * weightedRate / 100, currency)}

### Структура ставок
${activeLoans.slice(0, 5).map(l => {
  const rate = l.currentRatePct || l.fixedRatePct || 0;
  return `- **${l.name}:** ${rate.toFixed(2)}% (${l.rateTypeKey === 'fixed' ? 'фикс' : 'плав'})`;
}).join('\n')}

### Рекомендации
${weightedRate > 7 ? '- Рассмотреть рефинансирование займов с высокой ставкой' : '- Текущие ставки в рамках рыночных норм'}
${activeLoans.some(l => l.rateTypeKey === 'floating') ? '- Мониторить изменения базовых ставок (SOFR/EURIBOR)' : ''}
- Оптимизировать структуру долга для минимизации процентных расходов`;

  return {
    content,
    sources: ['Данные займов', 'История платежей', 'Текущие рыночные ставки'],
    confidence: 'high',
    assumptions: [
      'Ставки по плавающим займам рассчитаны на текущую дату',
      'YTD расходы включают только подтверждённые платежи'
    ],
    disclaimer: DISCLAIMER_RU
  };
}

/**
 * Generate covenant risk memo
 */
export function generateCovenantRiskMemo(
  covenants: CreditCovenant[],
  facilities: CreditFacility[]
): AiResponse {
  const breaches = covenants.filter(c => c.statusKey === 'breach');
  const atRisk = covenants.filter(c => c.statusKey === 'at_risk');
  const ok = covenants.filter(c => c.statusKey === 'ok');

  const overallRisk = breaches.length > 0 ? 'ВЫСОКИЙ' : atRisk.length > 0 ? 'СРЕДНИЙ' : 'НИЗКИЙ';

  const content = `## Оценка ковенантных рисков

### Общая оценка: ${overallRisk}

### Статистика
| Статус | Количество |
|--------|------------|
| OK | ${ok.length} |
| At Risk | ${atRisk.length} |
| Breach | ${breaches.length} |

${breaches.length > 0 ? `### Нарушения (КРИТИЧНО)
${breaches.map(c => {
  const facility = facilities.find(f => f.id === c.linkedId);
  return `- **${c.name}** (${facility?.name || 'N/A'}): текущее значение ${c.currentValueJson?.value?.toFixed(2) || 'N/A'} vs порог ${c.thresholdJson.operator} ${c.thresholdJson.value}`;
}).join('\n')}

**Требуемые действия:**
1. Немедленное уведомление банка
2. Подготовка запроса на waiver
3. Разработка плана восстановления
` : ''}

${atRisk.length > 0 ? `### Под угрозой (МОНИТОРИНГ)
${atRisk.map(c => {
  const facility = facilities.find(f => f.id === c.linkedId);
  return `- **${c.name}** (${facility?.name || 'N/A'}): близко к пороговому значению`;
}).join('\n')}

**Рекомендации:**
- Усилить мониторинг показателей
- Подготовить превентивные меры
` : ''}

### Следующие тесты
${covenants
  .filter(c => c.nextTestAt)
  .sort((a, b) => new Date(a.nextTestAt!).getTime() - new Date(b.nextTestAt!).getTime())
  .slice(0, 5)
  .map(c => `- ${c.name}: ${formatDate(c.nextTestAt!)}`)
  .join('\n')}

### Заключение
${breaches.length > 0
  ? 'Требуется немедленное внимание к нарушениям ковенантов. Рекомендуется связаться с банком для обсуждения waiver или плана исправления.'
  : atRisk.length > 0
    ? 'Ситуация под контролем, но требует повышенного внимания. Рекомендуется проактивный мониторинг.'
    : 'Все ковенанты в норме. Продолжить регулярный мониторинг согласно графику тестирования.'}`;

  return {
    content,
    sources: ['Данные ковенантов', 'Условия facilities', 'История тестирований'],
    confidence: breaches.length > 0 ? 'high' : 'medium',
    assumptions: [
      'Текущие значения рассчитаны на последнюю дату тестирования',
      'Пороги соответствуют условиям кредитных соглашений'
    ],
    disclaimer: DISCLAIMER_RU
  };
}

/**
 * Generate refinancing checklist
 */
export function generateRefinancingChecklist(
  facility: CreditFacility,
  loans: CreditLoan[]
): AiResponse {
  const facilityLoans = loans.filter(l => l.facilityId === facility.id);
  const daysToMaturity = Math.floor(
    (new Date(facility.maturityAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
  );

  const urgency = daysToMaturity < 90 ? 'СРОЧНО' : daysToMaturity < 180 ? 'СКОРО' : 'ПЛАНОВО';

  const content = `## План рефинансирования: ${facility.name}

### Сводка
- **Банк:** ID ${facility.bankId}
- **Тип:** ${facility.facilityTypeKey}
- **Лимит:** ${formatCurrency(facility.limitAmount, facility.currency)}
- **Использовано:** ${formatCurrency(facility.drawnAmount, facility.currency)}
- **Погашение:** ${formatDate(facility.maturityAt)} (${daysToMaturity} дней)
- **Срочность:** ${urgency}

### Чек-лист подготовки

#### 1. Анализ (за 6 месяцев до maturity)
- [ ] Оценить текущие условия и рыночные альтернативы
- [ ] Подготовить финансовую отчётность
- [ ] Проверить соответствие ковенантам
- [ ] Оценить потребности в финансировании

#### 2. Переговоры (за 4 месяца)
- [ ] Запросить предложения от текущего банка
- [ ] Получить альтернативные предложения от других банков
- [ ] Сравнить условия (ставка, комиссии, ковенанты)
- [ ] Согласовать term sheet

#### 3. Документация (за 2 месяца)
- [ ] Подготовить кредитную документацию
- [ ] Юридическая проверка условий
- [ ] Подготовить обеспечение (если требуется)
- [ ] Получить корпоративные одобрения

#### 4. Закрытие (за 2 недели)
- [ ] Подписание документов
- [ ] Погашение существующих обязательств
- [ ] Регистрация залогов (если есть)
- [ ] Подтверждение новых лимитов

### Текущие займы под этой facility
${facilityLoans.map(l => `- ${l.name}: ${formatCurrency(l.outstandingAmount, l.currency)} (${l.rateTypeKey === 'fixed' ? 'фикс' : 'плав'} ${l.currentRatePct?.toFixed(2) || l.fixedRatePct?.toFixed(2)}%)`).join('\n')}

### Рекомендации
${daysToMaturity < 90 ? '- **ВНИМАНИЕ:** Требуется немедленное начало переговоров' : ''}
- Начать процесс рефинансирования минимум за 6 месяцев
- Подготовить сравнительный анализ предложений
- Рассмотреть возможность объединения facilities`;

  return {
    content,
    sources: ['Данные facility', 'Информация о займах', 'Стандартный процесс рефинансирования'],
    confidence: 'high',
    assumptions: [
      'Стандартный timeline рефинансирования (6 месяцев)',
      'Текущие рыночные условия позволяют рефинансирование'
    ],
    disclaimer: DISCLAIMER_RU
  };
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
