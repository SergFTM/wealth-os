'use client';

/**
 * Branding Provider Component
 * Applies tenant branding CSS variables to the document
 */

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { Branding, DEFAULT_PALETTE, getGradientCSS } from '@/modules/25-admin/schema/branding';

interface BrandingContextType {
  branding: Branding | null;
  loading: boolean;
}

const BrandingContext = createContext<BrandingContextType>({
  branding: null,
  loading: true,
});

export function useBranding() {
  return useContext(BrandingContext);
}

interface BrandingProviderProps {
  children: ReactNode;
}

export function BrandingProvider({ children }: BrandingProviderProps) {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tenant/branding')
      .then(r => r.json())
      .then(d => {
        setBranding(d.data);
        applyBranding(d.data);
      })
      .catch(() => {
        applyBranding(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <BrandingContext.Provider value={{ branding, loading }}>
      {children}
    </BrandingContext.Provider>
  );
}

function applyBranding(branding: Branding | null) {
  if (typeof document === 'undefined') return;

  const palette = branding?.palette || DEFAULT_PALETTE;
  const gradientPreset = branding?.gradientPreset || 'sage-to-gold';
  const density = branding?.density || 'comfortable';

  const root = document.documentElement;

  // Apply color variables
  root.style.setProperty('--brand-sage', palette.sage);
  root.style.setProperty('--brand-gold', palette.gold);
  root.style.setProperty('--brand-ivory', palette.ivory);
  root.style.setProperty('--brand-gray', palette.gray);
  root.style.setProperty('--brand-gradient', getGradientCSS(gradientPreset, palette));
  root.style.setProperty('--brand-sage-light', `${palette.sage}20`);
  root.style.setProperty('--brand-gold-light', `${palette.gold}15`);

  // Apply density variables
  root.style.setProperty('--density-spacing', density === 'comfortable' ? '1rem' : '0.5rem');
  root.style.setProperty('--density-padding', density === 'comfortable' ? '1.5rem' : '1rem');
}
