/**
 * Template Engine
 *
 * Manages pack templates and applies defaults when creating packs.
 */

import {
  PackTemplate,
  TemplateItem,
  ReportPack,
  PackItem,
  AudienceType,
  RecipientType,
  SensitivityLevel
} from './types';

/**
 * Default templates by audience type
 */
export const DEFAULT_TEMPLATES: Partial<PackTemplate>[] = [
  {
    name: 'Аудиторский пакет (стандартный)',
    description: 'Полный комплект для внешнего аудита',
    audienceKey: 'auditor',
    defaultClientSafe: true,
    defaultSensitivityKey: 'high',
    defaultItemsJson: [
      { itemTypeKey: 'cover_letter', title: 'Сопроводительное письмо', required: true, clientSafe: true },
      { itemTypeKey: 'export', title: 'Главная книга (GL Extract)', required: true, clientSafe: true },
      { itemTypeKey: 'export', title: 'Оборотно-сальдовая ведомость', required: true, clientSafe: true },
      { itemTypeKey: 'document', title: 'Банковские выписки', required: true, clientSafe: true },
      { itemTypeKey: 'document', title: 'Отчёты кастодианов', required: true, clientSafe: true },
      { itemTypeKey: 'snapshot', title: 'Структура владения', required: true, clientSafe: true },
      { itemTypeKey: 'document', title: 'Подписанные политики', required: false, clientSafe: true }
    ]
  },
  {
    name: 'Банковский пакет (KYC)',
    description: 'Документы для банковского KYC и кредитной заявки',
    audienceKey: 'bank',
    defaultClientSafe: true,
    defaultSensitivityKey: 'high',
    defaultItemsJson: [
      { itemTypeKey: 'cover_letter', title: 'Сопроводительное письмо', required: true, clientSafe: true },
      { itemTypeKey: 'export', title: 'Чистая стоимость активов', required: true, clientSafe: true },
      { itemTypeKey: 'export', title: 'Отчёт о доходах', required: true, clientSafe: true },
      { itemTypeKey: 'document', title: 'Банковские выписки', required: true, clientSafe: true },
      { itemTypeKey: 'export', title: 'Реестр активов', required: true, clientSafe: true },
      { itemTypeKey: 'export', title: 'Реестр обязательств', required: true, clientSafe: true },
      { itemTypeKey: 'snapshot', title: 'Структура владения', required: true, clientSafe: true }
    ]
  },
  {
    name: 'Налоговый пакет',
    description: 'Документы для налогового консультанта',
    audienceKey: 'tax',
    defaultClientSafe: true,
    defaultSensitivityKey: 'high',
    defaultItemsJson: [
      { itemTypeKey: 'cover_letter', title: 'Сопроводительное письмо', required: true, clientSafe: true },
      { itemTypeKey: 'export', title: 'Сводка доходов', required: true, clientSafe: true },
      { itemTypeKey: 'export', title: 'Прирост капитала', required: true, clientSafe: true },
      { itemTypeKey: 'export', title: 'Дистрибуции', required: true, clientSafe: true },
      { itemTypeKey: 'document', title: 'K-1 формы', required: false, clientSafe: true },
      { itemTypeKey: 'snapshot', title: 'Структура юрлиц', required: true, clientSafe: true },
      { itemTypeKey: 'export', title: 'Иностранные счета (FBAR)', required: false, clientSafe: true }
    ]
  },
  {
    name: 'Юридический пакет',
    description: 'Документы для юридической экспертизы',
    audienceKey: 'legal',
    defaultClientSafe: true,
    defaultSensitivityKey: 'medium',
    defaultItemsJson: [
      { itemTypeKey: 'cover_letter', title: 'Сопроводительное письмо', required: true, clientSafe: true },
      { itemTypeKey: 'snapshot', title: 'Структура владения', required: true, clientSafe: true },
      { itemTypeKey: 'document', title: 'Учредительные документы', required: true, clientSafe: true },
      { itemTypeKey: 'document', title: 'Соглашения', required: false, clientSafe: true },
      { itemTypeKey: 'document', title: 'Сертификаты соответствия', required: false, clientSafe: true },
      { itemTypeKey: 'document', title: 'Протоколы собраний', required: false, clientSafe: true }
    ]
  },
  {
    name: 'Инвестиционный комитет',
    description: 'Квартальный отчёт для IC',
    audienceKey: 'committee',
    defaultClientSafe: false,
    defaultSensitivityKey: 'medium',
    defaultItemsJson: [
      { itemTypeKey: 'cover_letter', title: 'Executive Summary', required: true, clientSafe: false },
      { itemTypeKey: 'export', title: 'Отчёт о доходности', required: true, clientSafe: false },
      { itemTypeKey: 'export', title: 'Чистая стоимость', required: true, clientSafe: false },
      { itemTypeKey: 'export', title: 'Сводка ликвидности', required: true, clientSafe: false },
      { itemTypeKey: 'export', title: 'Анализ рисков', required: false, clientSafe: false },
      { itemTypeKey: 'export', title: 'Распределение активов', required: true, clientSafe: false },
      { itemTypeKey: 'document', title: 'Обзоры управляющих', required: false, clientSafe: false }
    ]
  }
];

/**
 * Map audience to recipient type
 */
export function audienceToRecipient(audience: AudienceType): RecipientType {
  const mapping: Record<AudienceType, RecipientType> = {
    auditor: 'auditor',
    bank: 'bank',
    tax: 'tax',
    legal: 'legal',
    committee: 'committee',
    investor: 'investor',
    regulator: 'regulator',
    general: 'other'
  };
  return mapping[audience] || 'other';
}

/**
 * Apply template to new pack
 */
export function applyTemplate(
  template: PackTemplate,
  packDefaults: Partial<ReportPack>
): { pack: Partial<ReportPack>; items: Partial<PackItem>[] } {
  const pack: Partial<ReportPack> = {
    ...packDefaults,
    templateId: template.id,
    clientSafe: template.defaultClientSafe,
    sensitivityKey: template.defaultSensitivityKey,
    watermarkKey: template.defaultWatermarkKey || 'on',
    recipientJson: {
      type: audienceToRecipient(template.audienceKey),
      org: packDefaults.recipientJson?.org || ''
    }
  };

  const items: Partial<PackItem>[] = (template.defaultItemsJson || []).map((item, index) => ({
    itemTypeKey: item.itemTypeKey,
    title: item.title,
    refJson: item.refJson,
    include: true,
    clientSafe: item.clientSafe ?? template.defaultClientSafe,
    sensitivityKey: template.defaultSensitivityKey,
    orderIndex: index
  }));

  return { pack, items };
}

/**
 * Get templates for audience
 */
export function getTemplatesForAudience(
  templates: PackTemplate[],
  audience: AudienceType
): PackTemplate[] {
  return templates.filter(t => t.audienceKey === audience || t.audienceKey === 'general');
}

/**
 * Create template from existing pack
 */
export function createTemplateFromPack(
  pack: ReportPack,
  items: PackItem[],
  templateName: string
): Partial<PackTemplate> {
  return {
    name: templateName,
    description: `Создан из пакета "${pack.name}"`,
    audienceKey: pack.recipientJson.type as AudienceType,
    defaultClientSafe: pack.clientSafe,
    defaultSensitivityKey: pack.sensitivityKey,
    defaultWatermarkKey: pack.watermarkKey,
    defaultItemsJson: items.filter(i => i.include).map(item => ({
      itemTypeKey: item.itemTypeKey,
      title: item.title,
      refJson: item.refJson,
      required: false,
      clientSafe: item.clientSafe
    }))
  };
}

/**
 * Validate template
 */
export function validateTemplate(template: Partial<PackTemplate>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!template.name || template.name.length < 3) {
    errors.push('Название шаблона должно содержать минимум 3 символа');
  }

  if (!template.audienceKey) {
    errors.push('Выберите целевую аудиторию');
  }

  if (!template.defaultItemsJson || template.defaultItemsJson.length === 0) {
    errors.push('Добавьте хотя бы один элемент в шаблон');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculate template usage stats
 */
export function calculateTemplateStats(templates: PackTemplate[], packs: ReportPack[]): {
  templateId: string;
  usageCount: number;
  lastUsed?: string;
}[] {
  const stats: Record<string, { count: number; lastUsed?: string }> = {};

  for (const template of templates) {
    stats[template.id] = { count: 0 };
  }

  for (const pack of packs) {
    if (pack.templateId && stats[pack.templateId]) {
      stats[pack.templateId].count++;
      if (!stats[pack.templateId].lastUsed || pack.createdAt > stats[pack.templateId].lastUsed!) {
        stats[pack.templateId].lastUsed = pack.createdAt;
      }
    }
  }

  return Object.entries(stats).map(([templateId, data]) => ({
    templateId,
    usageCount: data.count,
    lastUsed: data.lastUsed
  }));
}
