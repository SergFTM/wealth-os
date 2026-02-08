"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useRecord, useCollection } from "@/lib/hooks";
import { PaPackDetail } from "@/modules/52-packs/ui/PaPackDetail";

// Type interfaces matching component expectations
interface Pack {
  id: string;
  name: string;
  recipientJson: { type: string; org: string; contactEmail?: string; contactName?: string };
  purpose: string;
  periodJson: { start: string; end: string; label?: string };
  scopeJson: { scopeType: string; scopeId?: string; scopeName?: string };
  statusKey: string;
  clientSafe: boolean;
  clientId?: string;
  sensitivityKey: 'low' | 'medium' | 'high';
  watermarkKey: 'on' | 'off';
  coverLetterMd?: string;
  itemsCount?: number;
  templateId?: string;
  createdByUserId?: string;
  approvedByUserId?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface PackItem {
  id: string;
  packId: string;
  itemTypeKey: string;
  title: string;
  description?: string;
  include: boolean;
  clientSafe: boolean;
  sensitivityKey: 'low' | 'medium' | 'high';
  orderIndex: number;
  fileSize?: number;
  fileType?: string;
}

interface PackApproval {
  id: string;
  packId: string;
  statusKey: string;
  requestedByName?: string;
  decisionByName?: string;
  createdAt: string;
  approverName?: string;
}

interface PackShare {
  id: string;
  packId: string;
  statusKey: string;
  expiresAt: string;
  downloadCount: number;
  tokenPreview?: string;
  isRevoked?: boolean;
}

export default function PackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: rawPack, isLoading } = useRecord("reportPacks", id);
  const { data: rawItems = [] } = useCollection("packItems");
  const { data: rawApprovals = [] } = useCollection("packApprovals");
  const { data: rawShares = [] } = useCollection("packShares");

  // Cast data to typed arrays
  const pack = rawPack as unknown as Pack | null;
  const allItems = rawItems as unknown as PackItem[];
  const allApprovals = rawApprovals as unknown as PackApproval[];
  const allShares = rawShares as unknown as PackShare[];

  // Filter items, approvals, and shares for this pack
  const items = allItems.filter((i) => i.packId === id);
  const approvals = allApprovals
    .filter((a) => a.packId === id)
    .map((a) => ({
      ...a,
      requestedByName: a.approverName || a.requestedByName || 'System',
    }));
  const shares = allShares
    .filter((s) => s.packId === id)
    .map((s) => ({
      ...s,
      statusKey: s.isRevoked ? 'revoked' : (new Date(s.expiresAt) < new Date() ? 'expired' : 'active'),
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

  if (!pack) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800">Пакет не найден</h2>
          <p className="text-stone-500 mt-2">Пакет с ID {id} не существует</p>
          <button
            onClick={() => router.push("/m/packs")}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    console.log("Edit pack:", id);
  };

  const handleRequestApproval = async () => {
    try {
      await fetch("/api/collections/packApprovals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packId: id,
          clientId: pack.clientId,
          requestedByUserId: "current-user",
          requestedByName: "Current User",
          approverRoleKey: "cfo",
          statusKey: "pending",
          urgencyKey: "normal",
          dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
        }),
      });

      await fetch(`/api/collections/reportPacks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusKey: "pending_approval",
          updatedAt: new Date().toISOString(),
        }),
      });

      router.refresh();
    } catch (error) {
      console.error("Error requesting approval:", error);
    }
  };

  const handlePublishShare = async () => {
    try {
      const token = generateToken();

      await fetch("/api/collections/packShares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packId: id,
          clientId: pack.clientId,
          tokenHash: hashToken(token),
          tokenPreview: token.substring(0, 8),
          statusKey: "active",
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          allowDownload: true,
          downloadCount: 0,
          viewCount: 0,
          watermarkEnabled: pack.watermarkKey === "on",
          notifyOnAccess: true,
          createdByUserId: "current-user",
          createdAt: new Date().toISOString(),
        }),
      });

      await fetch(`/api/collections/reportPacks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusKey: "shared",
          updatedAt: new Date().toISOString(),
        }),
      });

      router.refresh();
    } catch (error) {
      console.error("Error publishing share:", error);
    }
  };

  const handleClose = async () => {
    try {
      await fetch(`/api/collections/reportPacks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusKey: "closed",
          updatedAt: new Date().toISOString(),
        }),
      });

      router.refresh();
    } catch (error) {
      console.error("Error closing pack:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Удалить пакет? Это действие нельзя отменить.")) {
      try {
        await fetch(`/api/collections/reportPacks/${id}`, {
          method: "DELETE",
        });
        router.push("/m/packs");
      } catch (error) {
        console.error("Error deleting pack:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <PaPackDetail
        pack={pack}
        items={items}
        approvals={approvals}
        shares={shares}
        onEdit={pack.statusKey === "draft" ? handleEdit : undefined}
        onRequestApproval={pack.statusKey === "draft" ? handleRequestApproval : undefined}
        onPublishShare={["approved", "shared"].includes(pack.statusKey) ? handlePublishShare : undefined}
        onClose={pack.statusKey === "shared" ? handleClose : undefined}
        onDelete={pack.statusKey === "draft" ? handleDelete : undefined}
        onBack={() => router.push("/m/packs")}
      />
    </div>
  );
}

// Simple token generation
function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Simple hash for demo
function hashToken(token: string): string {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return "h_" + Math.abs(hash).toString(16).padStart(16, "0");
}
