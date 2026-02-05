'use client';

/**
 * Policy Banner Display Component
 * Shows policy banners for specific modules
 */

import { useEffect, useState } from 'react';
import { PolicyBanner } from '@/modules/25-admin/schema/policyBanner';

interface PolicyBannerDisplayProps {
  moduleKey: 'tax' | 'trusts' | 'ai' | 'api' | 'reports' | 'global';
  placement?: 'top-banner' | 'section-footer';
  lang?: 'ru' | 'en' | 'uk';
}

export function PolicyBannerDisplay({
  moduleKey,
  placement = 'top-banner',
  lang = 'ru',
}: PolicyBannerDisplayProps) {
  const [banners, setBanners] = useState<PolicyBanner[]>([]);

  useEffect(() => {
    fetch(`/api/tenant/policies?moduleKey=${moduleKey}&status=active`)
      .then(r => r.json())
      .then(d => setBanners(d.data || []))
      .catch(() => {});
  }, [moduleKey]);

  const filteredBanners = banners.filter(b => b.placement === placement);

  if (filteredBanners.length === 0) return null;

  const getText = (banner: PolicyBanner): string => {
    switch (lang) {
      case 'ru': return banner.textRu;
      case 'en': return banner.textEn || banner.textRu;
      case 'uk': return banner.textUk || banner.textRu;
    }
  };

  const severityStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warn: 'bg-amber-50 border-amber-200 text-amber-800',
  };

  const placementStyles = {
    'top-banner': 'mb-4',
    'section-footer': 'mt-4',
  };

  return (
    <div className={`space-y-2 ${placementStyles[placement]}`}>
      {filteredBanners.map(banner => (
        <div
          key={banner.id}
          className={`p-3 border rounded-lg text-sm ${severityStyles[banner.severity]}`}
        >
          {banner.severity === 'warn' && <span className="mr-1">⚠️</span>}
          {banner.severity === 'info' && <span className="mr-1">ℹ️</span>}
          {getText(banner)}
        </div>
      ))}
    </div>
  );
}
