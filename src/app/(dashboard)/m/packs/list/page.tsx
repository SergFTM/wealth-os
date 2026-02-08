"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useCollection } from "@/lib/hooks";
import { PaPacksTable } from "@/modules/52-packs/ui/PaPacksTable";
import { PaTemplatesTable } from "@/modules/52-packs/ui/PaTemplatesTable";
import { PaSharesTable } from "@/modules/52-packs/ui/PaSharesTable";
import { PaApprovalsTable } from "@/modules/52-packs/ui/PaApprovalsTable";
import { PaDownloadsTable } from "@/modules/52-packs/ui/PaDownloadsTable";
import { PaActionsBar } from "@/modules/52-packs/ui/PaActionsBar";

// Local types matching component interfaces
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

interface PackTemplate {
  id: string;
  name: string;
  description?: string;
  audienceKey: string;
  defaultClientSafe: boolean;
  defaultSensitivityKey: 'low' | 'medium' | 'high';
  defaultItemsJson?: Array<{ title: string }>;
  usageCount?: number;
  createdAt: string;
}

interface PackShare {
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
  hasPassword?: boolean;
  createdAt: string;
  revokedAt?: string;
  isRevoked?: boolean;
}

interface PackApproval {
  id: string;
  packId: string;
  packName?: string;
  requestedByUserId: string;
  requestedByName?: string;
  approverRoleKey: string;
  statusKey: string;
  decisionByUserId?: string;
  decisionByName?: string;
  decisionAt?: string;
  notes?: string;
  dueAt?: string;
  urgencyKey?: string;
  createdAt: string;
  approverUserId?: string;
  approverName?: string;
}

interface PackDownload {
  id: string;
  packId: string;
  packName?: string;
  shareId: string;
  shareToken?: string;
  itemId?: string;
  itemTitle?: string;
  actionKey: string;
  actorLabelMasked: string;
  actorEmail?: string;
  actorIp?: string;
  ipMasked?: string;
  userAgent?: string;
  geoLocation?: string;
  at: string;
}

interface AuditEvent {
  id: string;
  moduleId?: string;
  action: string;
  entityType: string;
  at: string;
  actorName?: string;
}

const TABS = [
  { key: "packs", label: "Пакеты" },
  { key: "templates", label: "Шаблоны" },
  { key: "shares", label: "Ссылки" },
  { key: "approvals", label: "Согласования" },
  { key: "downloads", label: "Скачивания" },
  { key: "audit", label: "Аудит" },
];

export default function PacksListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "packs");

  const { data: rawPacks = [] } = useCollection("reportPacks");
  const { data: rawTemplates = [] } = useCollection("packTemplates");
  const { data: rawShares = [] } = useCollection("packShares");
  const { data: rawApprovals = [] } = useCollection("packApprovals");
  const { data: rawDownloads = [] } = useCollection("packDownloads");
  const { data: rawAuditEvents = [] } = useCollection("auditEvents");

  // Cast to typed arrays
  const packs = rawPacks as unknown as Pack[];
  const templates = rawTemplates as unknown as PackTemplate[];
  const shares = rawShares as unknown as PackShare[];
  const approvals = rawApprovals as unknown as PackApproval[];
  const downloads = rawDownloads as unknown as PackDownload[];
  const auditEvents = rawAuditEvents as unknown as AuditEvent[];

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && TABS.some(t => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/m/packs/list?tab=${tab}`);
  };

  // Enrich shares with pack names and compute statusKey
  const enrichedShares: PackShare[] = shares.map((share) => ({
    ...share,
    packName: packs.find((p) => p.id === share.packId)?.name,
    statusKey: share.isRevoked ? 'revoked' : (new Date(share.expiresAt) < new Date() ? 'expired' : 'active'),
  }));

  // Enrich approvals with pack names
  const enrichedApprovals: PackApproval[] = approvals.map((approval) => ({
    ...approval,
    packName: packs.find((p) => p.id === approval.packId)?.name,
    requestedByName: approval.approverName || 'System',
    requestedByUserId: approval.approverUserId || 'system',
  }));

  // Enrich downloads with pack names
  const enrichedDownloads: PackDownload[] = downloads.map((download) => ({
    ...download,
    packName: packs.find((p) => p.id === download.packId)?.name,
    ipMasked: download.actorIp ? download.actorIp.replace(/\d+$/, '***') : undefined,
  }));

  // Filter audit events for this module
  const moduleAuditEvents = auditEvents.filter((e) => e.moduleId === "52");

  // Count pending approvals
  const pendingApprovalsCount = approvals.filter((a) => a.statusKey === "pending").length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Пакеты — Список</h1>
          <p className="text-stone-500 mt-1">Управление пакетами, шаблонами и ссылками</p>
        </div>
        <PaActionsBar
          onCreatePack={() => router.push("/m/packs/create")}
          onCreateTemplate={() => {}}
          onQuickPack={() => {}}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200 mb-6">
        <div className="flex gap-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`pb-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              }`}
            >
              {tab.label}
              {tab.key === "approvals" && pendingApprovalsCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-stone-200">
        {activeTab === "packs" && (
          <PaPacksTable
            packs={packs}
            onOpen={(id) => router.push(`/m/packs/pack/${id}`)}
          />
        )}

        {activeTab === "templates" && (
          <PaTemplatesTable
            templates={templates}
            onOpen={(id) => router.push(`/m/packs/template/${id}`)}
            onCreatePack={(templateId) => router.push(`/m/packs/create?template=${templateId}`)}
          />
        )}

        {activeTab === "shares" && (
          <PaSharesTable
            shares={enrichedShares}
            onOpen={(id) => router.push(`/m/packs/share/${id}`)}
            onRevoke={(id) => {
              console.log("Revoke share:", id);
            }}
          />
        )}

        {activeTab === "approvals" && (
          <PaApprovalsTable
            approvals={enrichedApprovals}
            onApprove={(id) => {
              console.log("Approve:", id);
            }}
            onReject={(id) => {
              console.log("Reject:", id);
            }}
          />
        )}

        {activeTab === "downloads" && (
          <PaDownloadsTable downloads={enrichedDownloads} />
        )}

        {activeTab === "audit" && (
          <div className="p-6">
            <h3 className="font-medium text-stone-800 mb-4">Аудит событий</h3>
            {moduleAuditEvents.length === 0 ? (
              <p className="text-stone-500 text-center py-8">Нет событий аудита</p>
            ) : (
              <div className="space-y-2">
                {moduleAuditEvents.slice(0, 50).map((event) => (
                  <div key={event.id} className="flex items-center justify-between py-2 border-b border-stone-100">
                    <div>
                      <span className="font-medium text-stone-800">{event.action}</span>
                      <span className="text-stone-500 mx-2">•</span>
                      <span className="text-stone-600">{event.entityType}</span>
                    </div>
                    <div className="text-sm text-stone-500">
                      {event.actorName} • {new Date(event.at).toLocaleString("ru-RU")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
