/**
 * API Documentation Schema
 * In-app API documentation pages
 */

export interface ApiDoc {
  id: string;
  slug: string;
  title: string;
  titleRu: string;
  titleUk: string;
  category: 'overview' | 'authentication' | 'endpoints' | 'webhooks' | 'errors' | 'examples';
  order: number;
  contentMd: string;
  contentMdRu: string;
  contentMdUk: string;
  updatedAt: string;
}

export interface ApiDocCreateInput {
  slug: string;
  title: string;
  titleRu?: string;
  titleUk?: string;
  category: ApiDoc['category'];
  order: number;
  contentMd: string;
  contentMdRu?: string;
  contentMdUk?: string;
}

export const apiDocCategoryLabels: Record<ApiDoc['category'], { en: string; ru: string; uk: string }> = {
  overview: { en: 'Overview', ru: 'Обзор', uk: 'Огляд' },
  authentication: { en: 'Authentication', ru: 'Аутентификация', uk: 'Автентифікація' },
  endpoints: { en: 'Endpoints', ru: 'Эндпоинты', uk: 'Ендпоінти' },
  webhooks: { en: 'Webhooks', ru: 'Вебхуки', uk: 'Вебхуки' },
  errors: { en: 'Errors', ru: 'Ошибки', uk: 'Помилки' },
  examples: { en: 'Examples', ru: 'Примеры', uk: 'Приклади' },
};
