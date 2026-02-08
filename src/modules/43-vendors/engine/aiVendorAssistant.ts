/**
 * AI Vendor Assistant Engine
 * Provides AI-powered insights for vendor management
 */

export interface AiAssistantResult {
  type: 'contract_summary' | 'anomaly_explanation' | 'renewal_memo';
  content: string;
  confidence: number;
  assumptions: string[];
  sources: string[];
  generatedAt: string;
}

interface ContractData {
  id: string;
  name: string;
  vendorId: string;
  startAt?: string;
  endAt?: string;
  renewalAt?: string;
  autoRenewal?: boolean;
  feeModelKey?: string;
  scopeOfServices?: string;
  terminationNotes?: string;
  feeRulesJson?: {
    baseFee?: number;
    currency?: string;
    frequency?: string;
  };
}

interface VendorData {
  id: string;
  name: string;
  vendorType: string;
  servicesJson?: string[];
}

interface AnomalyData {
  invoiceId: string;
  amount: number;
  expectedAmount: number;
  variance: number;
  anomalyReasons: string[];
}

/**
 * Generate contract summary
 */
export function summarizeContract(
  contract: ContractData,
  vendor: VendorData
): AiAssistantResult {
  const assumptions: string[] = [];
  const sources: string[] = [`Контракт: ${contract.name}`, `Провайдер: ${vendor.name}`];

  const lines: string[] = [];

  // Header
  lines.push(`## Резюме контракта`);
  lines.push(``);
  lines.push(`**Провайдер**: ${vendor.name} (${vendor.vendorType})`);
  lines.push(`**Контракт**: ${contract.name}`);
  lines.push(``);

  // Dates
  lines.push(`### Ключевые даты`);
  if (contract.startAt) {
    lines.push(`- Начало: ${formatDate(contract.startAt)}`);
  }
  if (contract.endAt) {
    lines.push(`- Окончание: ${formatDate(contract.endAt)}`);
  }
  if (contract.renewalAt) {
    lines.push(`- Срок уведомления о продлении: ${formatDate(contract.renewalAt)}`);

    const daysUntil = getDaysUntil(contract.renewalAt);
    if (daysUntil <= 30) {
      lines.push(`  - ⚠️ **Требует внимания**: осталось ${daysUntil} дней`);
    }
  }
  lines.push(`- Автопродление: ${contract.autoRenewal ? 'Да' : 'Нет'}`);
  lines.push(``);

  // Services
  lines.push(`### Услуги`);
  if (contract.scopeOfServices) {
    lines.push(contract.scopeOfServices);
  } else if (vendor.servicesJson && vendor.servicesJson.length > 0) {
    vendor.servicesJson.forEach(service => {
      lines.push(`- ${service}`);
    });
    assumptions.push('Scope услуг взят из профиля провайдера');
  } else {
    lines.push(`_Scope услуг не определен в контракте_`);
    assumptions.push('Рекомендуется уточнить scope услуг');
  }
  lines.push(``);

  // Fees
  lines.push(`### Комиссии`);
  if (contract.feeRulesJson) {
    const fee = contract.feeRulesJson;
    lines.push(`- Модель: ${getFeeModelLabel(contract.feeModelKey)}`);
    if (fee.baseFee) {
      lines.push(`- Базовая комиссия: ${fee.currency || 'USD'} ${fee.baseFee.toLocaleString()}`);
    }
    if (fee.frequency) {
      lines.push(`- Периодичность: ${getFrequencyLabel(fee.frequency)}`);
    }
  } else {
    lines.push(`_Правила комиссий не определены_`);
    assumptions.push('Требуется уточнить структуру комиссий');
  }
  lines.push(``);

  // Termination
  lines.push(`### Условия расторжения`);
  if (contract.terminationNotes) {
    lines.push(contract.terminationNotes);
  } else {
    lines.push(`_Условия расторжения не документированы_`);
    assumptions.push('Рекомендуется проверить условия расторжения');
  }

  // Disclaimer
  lines.push(``);
  lines.push(`---`);
  lines.push(`*Данное резюме сгенерировано автоматически и не заменяет юридический анализ.*`);

  // Calculate confidence
  let confidence = 70;
  if (!contract.scopeOfServices) confidence -= 10;
  if (!contract.feeRulesJson) confidence -= 15;
  if (!contract.terminationNotes) confidence -= 5;

  return {
    type: 'contract_summary',
    content: lines.join('\n'),
    confidence: Math.max(40, confidence),
    assumptions,
    sources,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Explain fee anomalies
 */
export function explainAnomalies(
  anomalies: AnomalyData[],
  vendorName: string
): AiAssistantResult {
  const assumptions: string[] = [];
  const sources: string[] = [`Провайдер: ${vendorName}`];

  const lines: string[] = [];

  lines.push(`## Анализ аномалий комиссий`);
  lines.push(``);
  lines.push(`**Провайдер**: ${vendorName}`);
  lines.push(`**Выявлено аномалий**: ${anomalies.length}`);
  lines.push(``);

  if (anomalies.length === 0) {
    lines.push(`Аномалий не обнаружено. Все счета соответствуют ожидаемым суммам.`);
  } else {
    lines.push(`### Детали аномалий`);
    lines.push(``);

    anomalies.forEach((anomaly, index) => {
      sources.push(`Счет: ${anomaly.invoiceId}`);

      lines.push(`#### ${index + 1}. Счет ${anomaly.invoiceId}`);
      lines.push(``);
      lines.push(`- Сумма: $${anomaly.amount.toLocaleString()}`);
      lines.push(`- Ожидалось: $${anomaly.expectedAmount.toLocaleString()}`);
      lines.push(`- Отклонение: $${Math.abs(anomaly.variance).toLocaleString()} (${anomaly.variance > 0 ? 'выше' : 'ниже'} ожидаемого)`);
      lines.push(``);

      if (anomaly.anomalyReasons.length > 0) {
        lines.push(`**Возможные причины**:`);
        anomaly.anomalyReasons.forEach(reason => {
          lines.push(`- ${reason}`);
        });
      }
      lines.push(``);
    });

    // Summary
    const totalVariance = anomalies.reduce((sum, a) => sum + Math.abs(a.variance), 0);
    lines.push(`### Итого`);
    lines.push(``);
    lines.push(`- Общее отклонение: $${totalVariance.toLocaleString()}`);
    lines.push(``);

    // Recommendations
    lines.push(`### Рекомендации`);
    lines.push(``);
    lines.push(`1. Запросите детализацию счетов у провайдера`);
    lines.push(`2. Сверьте с условиями контракта`);
    lines.push(`3. Проверьте наличие дополнительных услуг, которые могли увеличить стоимость`);

    if (totalVariance > 10000) {
      lines.push(`4. ⚠️ Существенное отклонение - рекомендуется эскалация CFO`);
    }
  }

  lines.push(``);
  lines.push(`---`);
  lines.push(`*Анализ носит предварительный характер и требует ручной проверки.*`);

  assumptions.push('Ожидаемые суммы рассчитаны на основе контракта или истории');

  return {
    type: 'anomaly_explanation',
    content: lines.join('\n'),
    confidence: anomalies.length > 0 ? 65 : 90,
    assumptions,
    sources,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Draft renewal memo
 */
export function draftRenewalMemo(
  contract: ContractData,
  vendor: VendorData,
  scorecardScore: number | null,
  totalSpend: number
): AiAssistantResult {
  const assumptions: string[] = [];
  const sources: string[] = [
    `Контракт: ${contract.name}`,
    `Провайдер: ${vendor.name}`,
  ];

  const lines: string[] = [];

  lines.push(`# Меморандум о продлении контракта`);
  lines.push(``);
  lines.push(`**Дата**: ${formatDate(new Date().toISOString())}`);
  lines.push(`**Провайдер**: ${vendor.name}`);
  lines.push(`**Контракт**: ${contract.name}`);
  lines.push(``);

  // Current status
  lines.push(`## Текущий статус`);
  lines.push(``);
  if (contract.endAt) {
    lines.push(`- Дата окончания: ${formatDate(contract.endAt)}`);
    const daysUntil = getDaysUntil(contract.endAt);
    lines.push(`- Осталось дней: ${daysUntil}`);
  }
  lines.push(`- Общие расходы: $${totalSpend.toLocaleString()}`);

  if (scorecardScore !== null) {
    lines.push(`- Оценка провайдера: ${scorecardScore.toFixed(1)}/10`);
    sources.push(`Scorecard: ${scorecardScore.toFixed(1)}`);

    if (scorecardScore < 6) {
      lines.push(`  - ⚠️ Оценка ниже приемлемого уровня`);
    }
  } else {
    assumptions.push('Scorecard провайдера отсутствует');
  }
  lines.push(``);

  // Recommendation
  lines.push(`## Рекомендация`);
  lines.push(``);

  let recommendation = 'Продлить';
  if (scorecardScore !== null && scorecardScore < 5) {
    recommendation = 'Рассмотреть альтернативы или пересмотреть условия';
  } else if (scorecardScore !== null && scorecardScore < 7) {
    recommendation = 'Продлить с условием плана улучшений';
  }

  lines.push(`**${recommendation}**`);
  lines.push(``);

  // Key points for negotiation
  lines.push(`## Пункты для переговоров`);
  lines.push(``);
  lines.push(`1. _[Добавить ключевые пункты]_`);
  lines.push(`2. Уточнить SLA метрики`);
  lines.push(`3. Обсудить структуру комиссий`);
  lines.push(``);

  // Risk assessment
  lines.push(`## Оценка рисков`);
  lines.push(``);
  lines.push(`| Риск | Уровень | Митигация |`);
  lines.push(`|------|---------|-----------|`);
  lines.push(`| Рост комиссий | Средний | Фиксация cap в контракте |`);
  lines.push(`| Качество услуг | _Оценить_ | SLA с penalties |`);
  lines.push(`| Смена провайдера | Низкий | Transition план |`);
  lines.push(``);

  // Action items
  lines.push(`## Следующие шаги`);
  lines.push(``);
  lines.push(`- [ ] Согласовать позицию с CFO`);
  lines.push(`- [ ] Назначить встречу с провайдером`);
  lines.push(`- [ ] Подготовить альтернативные предложения`);
  lines.push(`- [ ] Финализировать условия`);
  lines.push(``);

  // Footer
  lines.push(`---`);
  lines.push(`*Меморандум подготовлен автоматически и требует проверки и дополнения.*`);

  let confidence = 60;
  if (scorecardScore === null) confidence -= 15;
  if (!contract.feeRulesJson) confidence -= 10;

  return {
    type: 'renewal_memo',
    content: lines.join('\n'),
    confidence: Math.max(40, confidence),
    assumptions,
    sources,
    generatedAt: new Date().toISOString(),
  };
}

// Helper functions
function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getFeeModelLabel(key?: string): string {
  const labels: Record<string, string> = {
    fixed: 'Фиксированная',
    aum: 'От AUM',
    hourly: 'Почасовая',
    transaction: 'За транзакцию',
    retainer: 'Ретейнер',
    hybrid: 'Гибридная',
  };
  return labels[key || ''] || key || 'Не указана';
}

function getFrequencyLabel(key?: string): string {
  const labels: Record<string, string> = {
    monthly: 'Ежемесячно',
    quarterly: 'Ежеквартально',
    annually: 'Ежегодно',
    per_transaction: 'За транзакцию',
  };
  return labels[key || ''] || key || 'Не указана';
}
