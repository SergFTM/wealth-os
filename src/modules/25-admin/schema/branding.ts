/**
 * Branding Schema
 * Visual identity and styling configuration
 */

export interface BrandingPalette {
  sage: string;
  gold: string;
  ivory: string;
  gray: string;
}

export type GradientPreset = 'sage-to-gold' | 'gold-to-sage' | 'ivory-blend' | 'neutral';
export type DensityMode = 'comfortable' | 'compact';

export interface Branding {
  id: string;
  clientId?: string;
  logoDocId?: string;
  logoUrl?: string;
  tenantDisplayName?: string;
  palette: BrandingPalette;
  gradientPreset: GradientPreset;
  density: DensityMode;
  stickyHeader: boolean;
  stickyFirstColumn: boolean;
  showBreadcrumbs: boolean;
  updatedAt: string;
}

export interface BrandingCreateInput {
  clientId?: string;
  logoDocId?: string;
  logoUrl?: string;
  tenantDisplayName?: string;
  palette?: Partial<BrandingPalette>;
  gradientPreset?: GradientPreset;
  density?: DensityMode;
  stickyHeader?: boolean;
  stickyFirstColumn?: boolean;
  showBreadcrumbs?: boolean;
}

export const DEFAULT_PALETTE: BrandingPalette = {
  sage: '#9CAF88',
  gold: '#D4AF37',
  ivory: '#FFFFF0',
  gray: '#6B7280',
};

export const gradientPresetLabels: Record<GradientPreset, { en: string; ru: string; uk: string }> = {
  'sage-to-gold': { en: 'Sage to Gold', ru: 'Шалфей → Золото', uk: 'Шавлія → Золото' },
  'gold-to-sage': { en: 'Gold to Sage', ru: 'Золото → Шалфей', uk: 'Золото → Шавлія' },
  'ivory-blend': { en: 'Ivory Blend', ru: 'Слоновая кость', uk: 'Слонова кістка' },
  'neutral': { en: 'Neutral', ru: 'Нейтральный', uk: 'Нейтральний' },
};

export const densityLabels: Record<DensityMode, { en: string; ru: string; uk: string }> = {
  comfortable: { en: 'Comfortable', ru: 'Комфортный', uk: 'Комфортний' },
  compact: { en: 'Compact', ru: 'Компактный', uk: 'Компактний' },
};

export function getGradientCSS(preset: GradientPreset, palette: BrandingPalette): string {
  switch (preset) {
    case 'sage-to-gold':
      return `linear-gradient(135deg, ${palette.sage}15 0%, ${palette.gold}10 100%)`;
    case 'gold-to-sage':
      return `linear-gradient(135deg, ${palette.gold}10 0%, ${palette.sage}15 100%)`;
    case 'ivory-blend':
      return `linear-gradient(135deg, ${palette.ivory} 0%, ${palette.sage}08 100%)`;
    case 'neutral':
      return `linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)`;
  }
}
