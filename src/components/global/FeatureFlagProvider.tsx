'use client';

/**
 * Feature Flag Provider Component
 * Provides feature flag checking throughout the app
 */

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { FeatureFlag } from '@/modules/25-admin/schema/featureFlag';
import { checkFlag, checkKnownFlags } from '@/modules/25-admin/engine/flagChecker';

interface FeatureFlagContextType {
  flags: FeatureFlag[];
  loading: boolean;
  isEnabled: (key: string) => boolean;
  knownFlags: ReturnType<typeof checkKnownFlags>;
}

const defaultKnownFlags = {
  showAiAdvanced: false,
  showApiModule: false,
  showReportingStudio: false,
  showRiskAnalytics: false,
  showTaxHarvesting: false,
  enableDarkMode: false,
  enableExportPdf: false,
  enableBulkActions: false,
  showBetaFeatures: false,
  enableWebhooks: false,
};

const FeatureFlagContext = createContext<FeatureFlagContextType>({
  flags: [],
  loading: true,
  isEnabled: () => false,
  knownFlags: defaultKnownFlags,
});

export function useFeatureFlags() {
  return useContext(FeatureFlagContext);
}

export function useFeatureFlag(key: string): boolean {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(key);
}

interface FeatureFlagProviderProps {
  children: ReactNode;
  isStaff?: boolean;
}

export function FeatureFlagProvider({ children, isStaff = true }: FeatureFlagProviderProps) {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tenant/flags')
      .then(r => r.json())
      .then(d => setFlags(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isEnabled = (key: string): boolean => {
    return checkFlag(flags, key, { isStaff });
  };

  const knownFlags = checkKnownFlags(flags, { isStaff });

  return (
    <FeatureFlagContext.Provider value={{ flags, loading, isEnabled, knownFlags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

// Conditional render wrapper
interface FeatureGateProps {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ flag, children, fallback = null }: FeatureGateProps) {
  const { isEnabled, loading } = useFeatureFlags();

  if (loading) return null;
  if (!isEnabled(flag)) return <>{fallback}</>;

  return <>{children}</>;
}
