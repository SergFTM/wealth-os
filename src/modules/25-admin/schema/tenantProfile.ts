/**
 * Tenant Profile Schema
 * Core tenant identity and configuration
 */

export interface TenantProfile {
  id: string;
  clientId?: string;
  tenantName: string;
  tenantNameRu?: string;
  tenantNameUk?: string;
  primaryContactEmail?: string;
  primaryContactName?: string;
  tier: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface TenantProfileCreateInput {
  tenantName: string;
  tenantNameRu?: string;
  tenantNameUk?: string;
  clientId?: string;
  primaryContactEmail?: string;
  primaryContactName?: string;
  tier?: TenantProfile['tier'];
}

export const tenantTierLabels: Record<TenantProfile['tier'], { en: string; ru: string; uk: string }> = {
  starter: { en: 'Starter', ru: 'Стартовый', uk: 'Стартовий' },
  professional: { en: 'Professional', ru: 'Профессиональный', uk: 'Професійний' },
  enterprise: { en: 'Enterprise', ru: 'Корпоративный', uk: 'Корпоративний' },
};
