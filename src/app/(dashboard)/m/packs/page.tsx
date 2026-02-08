"use client";

import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { PaDashboardPage } from '@/modules/52-packs/ui';

// Types matching dashboard component
interface Pack {
  id: string;
  name: string;
  recipientJson: { type: string; org: string };
  purpose: string;
  periodJson: { start: string; end: string; label?: string };
  scopeJson: { scopeType: string; scopeName?: string };
  statusKey: string;
  clientSafe: boolean;
  itemsCount?: number;
  createdAt: string;
}

interface Share {
  id: string;
  packId: string;
  packName?: string;
  tokenPreview?: string;
  statusKey: string;
  expiresAt: string;
  allowDownload: boolean;
  maxDownloads?: number;
  downloadCount: number;
  viewCount?: number;
  watermarkEnabled?: boolean;
  passwordHash?: string;
  createdAt: string;
  revokedAt?: string;
  isRevoked?: boolean;
}

interface Approval {
  id: string;
  statusKey: string;
}

interface Download {
  id: string;
  at: string;
}

export default function PacksDashboardPage() {
  const router = useRouter();

  const { data: rawPacks = [] } = useCollection('reportPacks');
  const { data: rawShares = [] } = useCollection('packShares');
  const { data: rawApprovals = [] } = useCollection('packApprovals');
  const { data: rawDownloads = [] } = useCollection('packDownloads');

  // Cast to typed arrays
  const packs = rawPacks as unknown as Pack[];
  const shares = (rawShares as unknown as Share[]).map((s) => ({
    ...s,
    statusKey: s.isRevoked ? 'revoked' : (new Date(s.expiresAt) < new Date() ? 'expired' : 'active'),
  }));
  const approvals = rawApprovals as unknown as Approval[];
  const downloads = rawDownloads as unknown as Download[];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-800">Пакеты</h1>
        <p className="text-stone-500 mt-1">Сборка пакетов документов для консультантов и аудиторов</p>
      </div>

      <PaDashboardPage
        packs={packs}
        shares={shares}
        approvals={approvals}
        downloads={downloads}
        onCreatePack={() => router.push('/m/packs/create')}
        onCreateTemplate={() => router.push('/m/packs/list?tab=templates&action=create')}
        onQuickPack={() => router.push('/m/packs/list?tab=templates')}
        onViewAllPacks={() => router.push('/m/packs/list?tab=packs')}
        onViewAllShares={() => router.push('/m/packs/list?tab=shares')}
        onOpenPack={(id) => router.push(`/m/packs/pack/${id}`)}
      />
    </div>
  );
}
