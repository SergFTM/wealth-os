"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useRecord, useCollection } from "@/lib/hooks";
import { PaShareDetail } from "@/modules/52-packs/ui/PaShareDetail";

// Types matching component interface
interface PackShare {
  id: string;
  packId: string;
  tokenHash: string;
  tokenPreview?: string;
  statusKey: string;
  expiresAt: string;
  allowDownload: boolean;
  maxDownloads?: number;
  downloadCount: number;
  viewCount?: number;
  passwordHash?: string;
  hasPassword?: boolean;
  watermarkEnabled?: boolean;
  watermarkText?: string;
  recipientEmail?: string;
  notifyOnAccess?: boolean;
  createdByUserId?: string;
  createdAt: string;
  revokedAt?: string;
  revokedByUserId?: string;
  revokeReason?: string;
  isRevoked?: boolean;
}

interface Pack {
  id: string;
  name: string;
}

interface DownloadEvent {
  id: string;
  shareId: string;
  actionKey: string;
  actorLabelMasked: string;
  actorIp?: string;
  ipMasked?: string;
  at: string;
}

export default function ShareDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: rawShare, isLoading } = useRecord("packShares", id);
  const { data: rawPacks = [] } = useCollection("reportPacks");
  const { data: rawDownloads = [] } = useCollection("packDownloads");

  // Cast to typed data
  const share = rawShare as unknown as PackShare | null;
  const allPacks = rawPacks as unknown as Pack[];
  const allDownloads = rawDownloads as unknown as DownloadEvent[];

  // Get pack name
  const pack = share ? allPacks.find((p) => p.id === share.packId) : null;

  // Filter downloads for this share and add computed fields
  const downloads = allDownloads
    .filter((d) => d.shareId === id)
    .map((d) => ({
      ...d,
      ipMasked: d.actorIp ? d.actorIp.replace(/\d+$/, '***') : d.ipMasked,
    }));

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-1/3"></div>
          <div className="h-4 bg-stone-200 rounded w-1/2"></div>
          <div className="h-64 bg-stone-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!share) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800">Ссылка не найдена</h2>
          <p className="text-stone-500 mt-2">Ссылка с ID {id} не существует</p>
          <button
            onClick={() => router.push("/m/packs/list?tab=shares")}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  // Compute status key
  const computedShare: PackShare = {
    ...share,
    tokenHash: share.tokenHash || '',
    statusKey: share.isRevoked ? 'revoked' : (new Date(share.expiresAt) < new Date() ? 'expired' : 'active'),
  };

  const handleRevoke = async () => {
    if (confirm("Отозвать ссылку? Получатель потеряет доступ.")) {
      try {
        await fetch(`/api/collections/packShares/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isRevoked: true,
            revokedAt: new Date().toISOString(),
            revokedByUserId: "current-user",
          }),
        });
        router.refresh();
      } catch (error) {
        console.error("Error revoking share:", error);
      }
    }
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/share/pack/${share.tokenPreview}...`;
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="p-6">
      <PaShareDetail
        share={computedShare}
        packName={pack?.name}
        downloads={downloads}
        shareUrl={`/share/pack/${share.tokenPreview}`}
        onRevoke={computedShare.statusKey === "active" ? handleRevoke : undefined}
        onCopyLink={handleCopyLink}
        onBack={() => router.push("/m/packs/list?tab=shares")}
      />
    </div>
  );
}
