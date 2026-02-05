/**
 * Portal Config Schema
 * Client portal settings and module access
 */

export type PortalModule =
  | 'net-worth-summary'
  | 'documents'
  | 'communications'
  | 'reports-share'
  | 'invoices-view'
  | 'tasks-view';

export interface ClientMenuLabel {
  moduleKey: string;
  labelRu: string;
  labelEn: string;
  labelUk: string;
}

export interface PortalConfig {
  id: string;
  clientId?: string;
  portalEnabled: boolean;
  allowedModules: PortalModule[];
  clientMenuLabels: ClientMenuLabel[];
  clientSafeDefault: boolean;
  showOnlyPublishedPacks: boolean;
  showWelcomeMessage: boolean;
  welcomeMessageRu?: string;
  welcomeMessageEn?: string;
  welcomeMessageUk?: string;
  updatedAt: string;
}

export interface PortalConfigCreateInput {
  clientId?: string;
  portalEnabled?: boolean;
  allowedModules?: PortalModule[];
  clientMenuLabels?: ClientMenuLabel[];
  clientSafeDefault?: boolean;
  showOnlyPublishedPacks?: boolean;
  showWelcomeMessage?: boolean;
  welcomeMessageRu?: string;
  welcomeMessageEn?: string;
  welcomeMessageUk?: string;
}

export const portalModuleLabels: Record<PortalModule, { en: string; ru: string; uk: string }> = {
  'net-worth-summary': { en: 'Net Worth Summary', ru: 'Сводка капитала', uk: 'Зведення капіталу' },
  'documents': { en: 'Documents', ru: 'Документы', uk: 'Документи' },
  'communications': { en: 'Communications', ru: 'Коммуникации', uk: 'Комунікації' },
  'reports-share': { en: 'Reports', ru: 'Отчеты', uk: 'Звіти' },
  'invoices-view': { en: 'Invoices', ru: 'Счета', uk: 'Рахунки' },
  'tasks-view': { en: 'Tasks', ru: 'Задачи', uk: 'Задачі' },
};

export const ALL_PORTAL_MODULES: PortalModule[] = [
  'net-worth-summary',
  'documents',
  'communications',
  'reports-share',
  'invoices-view',
  'tasks-view',
];
