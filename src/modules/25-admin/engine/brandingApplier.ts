/**
 * Branding Applier Engine
 * Applies branding settings to CSS variables
 */

import { Branding, DEFAULT_PALETTE, getGradientCSS } from '../schema/branding';

export interface BrandingCSSVars {
  '--brand-sage': string;
  '--brand-gold': string;
  '--brand-ivory': string;
  '--brand-gray': string;
  '--brand-gradient': string;
  '--brand-sage-light': string;
  '--brand-gold-light': string;
  '--density-spacing': string;
  '--density-padding': string;
}

export function getBrandingCSSVars(branding: Branding | null): BrandingCSSVars {
  const palette = branding?.palette || DEFAULT_PALETTE;
  const gradientPreset = branding?.gradientPreset || 'sage-to-gold';
  const density = branding?.density || 'comfortable';

  return {
    '--brand-sage': palette.sage,
    '--brand-gold': palette.gold,
    '--brand-ivory': palette.ivory,
    '--brand-gray': palette.gray,
    '--brand-gradient': getGradientCSS(gradientPreset, palette),
    '--brand-sage-light': `${palette.sage}20`,
    '--brand-gold-light': `${palette.gold}15`,
    '--density-spacing': density === 'comfortable' ? '1rem' : '0.5rem',
    '--density-padding': density === 'comfortable' ? '1.5rem' : '1rem',
  };
}

export function applyBrandingToDocument(branding: Branding | null): void {
  if (typeof document === 'undefined') return;

  const vars = getBrandingCSSVars(branding);
  const root = document.documentElement;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function generateBrandingStylesheet(branding: Branding | null): string {
  const vars = getBrandingCSSVars(branding);

  const varDeclarations = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `:root {\n${varDeclarations}\n}`;
}

export function getDefaultBranding(): Branding {
  return {
    id: 'default',
    palette: DEFAULT_PALETTE,
    gradientPreset: 'sage-to-gold',
    density: 'comfortable',
    stickyHeader: true,
    stickyFirstColumn: true,
    showBreadcrumbs: true,
    updatedAt: new Date().toISOString(),
  };
}
