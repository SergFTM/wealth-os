/**
 * Tenant Domain Schema
 * Custom domains and dedicated URLs
 */

export type IsolationMode = 'shared' | 'dedicated';
export type DomainStatus = 'pending' | 'verified' | 'failed';

export interface CustomDomain {
  domain: string;
  status: DomainStatus;
  verifiedAt?: string;
  sslEnabled: boolean;
}

export interface TenantDomain {
  id: string;
  clientId?: string;
  dedicatedUrl?: string;
  customDomains: CustomDomain[];
  awsRegion: string;
  isolationMode: IsolationMode;
  updatedAt: string;
}

export interface TenantDomainCreateInput {
  clientId?: string;
  dedicatedUrl?: string;
  customDomains?: CustomDomain[];
  awsRegion?: string;
  isolationMode?: IsolationMode;
}

export const isolationModeLabels: Record<IsolationMode, { en: string; ru: string; uk: string }> = {
  shared: { en: 'Shared Infrastructure', ru: 'Общая инфраструктура', uk: 'Спільна інфраструктура' },
  dedicated: { en: 'Dedicated Infrastructure', ru: 'Выделенная инфраструктура', uk: 'Виділена інфраструктура' },
};

export const domainStatusLabels: Record<DomainStatus, { en: string; ru: string; uk: string }> = {
  pending: { en: 'Pending Verification', ru: 'Ожидает проверки', uk: 'Очікує перевірки' },
  verified: { en: 'Verified', ru: 'Проверен', uk: 'Перевірений' },
  failed: { en: 'Verification Failed', ru: 'Ошибка проверки', uk: 'Помилка перевірки' },
};

export const AWS_REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' },
  { value: 'eu-central-1', label: 'EU (Frankfurt)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
] as const;
