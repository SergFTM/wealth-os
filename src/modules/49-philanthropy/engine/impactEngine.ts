/**
 * Impact Engine
 * Manages impact reporting, metrics, and narratives
 */

export type ImpactStatus = 'draft' | 'submitted' | 'published';

export interface ImpactReport {
  id: string;
  clientId: string;
  grantId: string;
  entityId?: string;
  programId?: string;
  periodStart: string;
  periodEnd: string;
  statusKey: ImpactStatus;
  narrativeMdRu?: string;
  narrativeMdEn?: string;
  narrativeMdUk?: string;
  metricsJson?: ImpactMetrics;
  clientSafePublished: boolean;
  portalPublicationId?: string;
  attachmentDocIdsJson?: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImpactMetrics {
  beneficiaries?: number;
  projectsCompleted?: number;
  geographies?: string[];
  customMetrics?: CustomMetric[];
}

export interface CustomMetric {
  name: string;
  value: number;
  unit: string;
}

export interface Grant {
  id: string;
  purpose?: string;
  granteeJson?: {
    name?: string;
  };
  approvedAmount?: number;
  programId?: string;
}

export interface Program {
  id: string;
  name: string;
  themeKey: string;
  kpiTargetsJson?: {
    metric: string;
    targetValue: number;
    unit: string;
  }[];
}

/**
 * Get status display info
 */
export function getImpactStatusInfo(status: ImpactStatus): {
  label: { ru: string; en: string; uk: string };
  color: string;
} {
  const statusMap: Record<ImpactStatus, {
    label: { ru: string; en: string; uk: string };
    color: string;
  }> = {
    draft: { label: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка' }, color: 'stone' },
    submitted: { label: { ru: 'Подан', en: 'Submitted', uk: 'Подано' }, color: 'blue' },
    published: { label: { ru: 'Опубликован', en: 'Published', uk: 'Опубліковано' }, color: 'green' },
  };

  return statusMap[status];
}

/**
 * Generate impact report template
 */
export function generateReportTemplate(
  grant: Grant,
  program?: Program
): { narrativeRu: string; narrativeEn: string; narrativeUk: string } {
  const granteeName = grant.granteeJson?.name || 'Получатель';
  const purpose = grant.purpose || 'благотворительный проект';
  const amount = grant.approvedAmount
    ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD' }).format(grant.approvedAmount)
    : 'N/A';

  const narrativeRu = `## Отчет о воздействии

### Получатель
${granteeName}

### Цель гранта
${purpose}

### Сумма гранта
${amount}

### Достигнутые результаты
[Опишите ключевые результаты и достижения]

### Количество бенефициаров
[Укажите количество людей, получивших помощь]

### География
[Укажите регионы/страны охвата]

### Следующие шаги
[Опишите планы на следующий период]

---
*Данный отчет подготовлен в соответствии с требованиями отчетности фонда.*`;

  const narrativeEn = `## Impact Report

### Grantee
${granteeName}

### Grant Purpose
${purpose}

### Grant Amount
${amount}

### Results Achieved
[Describe key results and achievements]

### Number of Beneficiaries
[Indicate the number of people helped]

### Geography
[Indicate regions/countries covered]

### Next Steps
[Describe plans for the next period]

---
*This report is prepared in accordance with foundation reporting requirements.*`;

  const narrativeUk = `## Звіт про вплив

### Отримувач
${granteeName}

### Мета гранту
${purpose}

### Сума гранту
${amount}

### Досягнуті результати
[Опишіть ключові результати та досягнення]

### Кількість бенефіціарів
[Вкажіть кількість людей, які отримали допомогу]

### Географія
[Вкажіть регіони/країни охоплення]

### Наступні кроки
[Опишіть плани на наступний період]

---
*Цей звіт підготовлено відповідно до вимог звітності фонду.*`;

  return { narrativeRu, narrativeEn, narrativeUk };
}

/**
 * Calculate aggregate metrics across multiple reports
 */
export function aggregateMetrics(reports: ImpactReport[]): ImpactMetrics {
  let totalBeneficiaries = 0;
  let totalProjects = 0;
  const allGeographies = new Set<string>();
  const customMetricsMap = new Map<string, { total: number; count: number; unit: string }>();

  reports.forEach(report => {
    if (report.metricsJson) {
      totalBeneficiaries += report.metricsJson.beneficiaries || 0;
      totalProjects += report.metricsJson.projectsCompleted || 0;

      report.metricsJson.geographies?.forEach(geo => allGeographies.add(geo));

      report.metricsJson.customMetrics?.forEach(metric => {
        const existing = customMetricsMap.get(metric.name);
        if (existing) {
          existing.total += metric.value;
          existing.count++;
        } else {
          customMetricsMap.set(metric.name, {
            total: metric.value,
            count: 1,
            unit: metric.unit,
          });
        }
      });
    }
  });

  const customMetrics: CustomMetric[] = [];
  customMetricsMap.forEach((value, name) => {
    customMetrics.push({
      name,
      value: value.total,
      unit: value.unit,
    });
  });

  return {
    beneficiaries: totalBeneficiaries,
    projectsCompleted: totalProjects,
    geographies: Array.from(allGeographies),
    customMetrics,
  };
}

/**
 * Compare metrics against program KPI targets
 */
export function compareWithTargets(
  metrics: ImpactMetrics,
  program: Program
): { metric: string; actual: number; target: number; percent: number }[] {
  if (!program.kpiTargetsJson) return [];

  return program.kpiTargetsJson.map(target => {
    let actual = 0;

    // Try to match with standard metrics
    if (target.metric.toLowerCase().includes('beneficiar')) {
      actual = metrics.beneficiaries || 0;
    } else if (target.metric.toLowerCase().includes('project')) {
      actual = metrics.projectsCompleted || 0;
    } else {
      // Try to find in custom metrics
      const custom = metrics.customMetrics?.find(
        m => m.name.toLowerCase() === target.metric.toLowerCase()
      );
      if (custom) {
        actual = custom.value;
      }
    }

    return {
      metric: target.metric,
      actual,
      target: target.targetValue,
      percent: target.targetValue > 0 ? Math.round((actual / target.targetValue) * 100) : 0,
    };
  });
}

/**
 * Get reports due for submission
 */
export function getReportsDue(
  reports: ImpactReport[],
  daysThreshold: number = 30
): ImpactReport[] {
  const now = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return reports.filter(report => {
    if (report.statusKey === 'published') return false;
    const periodEnd = new Date(report.periodEnd);
    return periodEnd >= now && periodEnd <= thresholdDate;
  });
}

/**
 * Check if report can be published to portal
 */
export function canPublishToPortal(report: ImpactReport): { canPublish: boolean; blockers: string[] } {
  const blockers: string[] = [];

  if (report.statusKey !== 'submitted') {
    blockers.push('Отчет должен быть в статусе "Подан"');
  }

  if (!report.narrativeMdRu && !report.narrativeMdEn) {
    blockers.push('Необходимо заполнить нарратив');
  }

  if (!report.metricsJson || (!report.metricsJson.beneficiaries && !report.metricsJson.projectsCompleted)) {
    blockers.push('Необходимо указать метрики воздействия');
  }

  return {
    canPublish: blockers.length === 0,
    blockers,
  };
}
