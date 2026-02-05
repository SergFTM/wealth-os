"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { MbDeviceDetail } from '@/modules/31-mobile/ui';

const i18n = {
  ru: {
    back: '← Назад к устройствам',
  },
  en: {
    back: '← Back to devices',
  },
  uk: {
    back: '← Назад до пристроїв',
  },
};

export default function MobileDevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];

  const handleBack = () => {
    router.push('/m/mobile/list?tab=devices');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="text-stone-600">
          {t.back}
        </Button>
      </div>

      {/* Device Detail */}
      <MbDeviceDetail deviceId={id} />
    </div>
  );
}
