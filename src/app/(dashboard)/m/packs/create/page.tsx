"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCollection } from "@/lib/hooks";
import { PaCreateWizard } from "@/modules/52-packs/ui/PaCreateWizard";

interface PackTemplate {
  id: string;
  name: string;
  audienceKey: string;
  defaultClientSafe: boolean;
  defaultSensitivityKey: string;
  defaultWatermarkKey?: string;
  defaultItemsJson?: Array<{ itemTypeKey: string; title: string; clientSafe?: boolean }>;
}

interface WizardData {
  recipientType: string;
  recipientOrg: string;
  recipientContactName?: string;
  recipientContactEmail?: string;
  purpose: string;
  scopeType: string;
  scopeId?: string;
  scopeName?: string;
  periodStart: string;
  periodEnd: string;
  periodLabel?: string;
  clientSafe: boolean;
  items: Array<{ id: string; itemTypeKey: string; title: string; include: boolean; clientSafe: boolean; sensitivityKey: string }>;
  coverLetterMd?: string;
  sensitivityKey: string;
  watermarkKey: string;
  approverRoleKey?: string;
  urgencyKey?: string;
  approvalNotes?: string;
}

export default function CreatePackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  const { data: templates = [] } = useCollection("packTemplates");

  // Find template if specified
  const template = templateId
    ? (templates as unknown as PackTemplate[]).find((t) => t.id === templateId)
    : null;

  // Convert template to wizard data if available
  const templateData = template
    ? {
        recipientType: template.audienceKey,
        clientSafe: template.defaultClientSafe,
        sensitivityKey: template.defaultSensitivityKey,
        watermarkKey: template.defaultWatermarkKey || "on",
        items: (template.defaultItemsJson || []).map(
          (item, idx) => ({
            id: `tpl-${idx}`,
            itemTypeKey: item.itemTypeKey,
            title: item.title,
            include: true,
            clientSafe: item.clientSafe ?? true,
            sensitivityKey: template.defaultSensitivityKey,
          })
        ),
      }
    : undefined;

  const handleComplete = async (data: WizardData) => {
    try {
      // Create the pack via API
      const response = await fetch("/api/collections/reportPacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Пакет для ${data.recipientOrg}`,
          recipientJson: {
            type: data.recipientType,
            org: data.recipientOrg,
            contactName: data.recipientContactName,
            contactEmail: data.recipientContactEmail,
          },
          purpose: data.purpose,
          scopeJson: {
            scopeType: data.scopeType,
            scopeId: data.scopeId,
            scopeName: data.scopeName,
          },
          periodJson: {
            start: data.periodStart,
            end: data.periodEnd,
            label: data.periodLabel,
          },
          clientSafe: data.clientSafe,
          sensitivityKey: data.sensitivityKey,
          watermarkKey: data.watermarkKey,
          statusKey: "draft",
          templateId: templateId || undefined,
          itemsCount: data.items?.filter((i) => i.include).length || 0,
          createdByUserId: "current-user",
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/m/packs/pack/${result.id}`);
      } else {
        console.error("Failed to create pack");
      }
    } catch (error) {
      console.error("Error creating pack:", error);
    }
  };

  const handleCancel = () => {
    router.push("/m/packs");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="text-sm text-stone-500 hover:text-stone-700 mb-2 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад
        </button>
        <h1 className="text-2xl font-semibold text-stone-800">
          {template ? `Создание пакета из шаблона` : "Создание пакета"}
        </h1>
        {template && (
          <p className="text-stone-500 mt-1">Шаблон: {template.name}</p>
        )}
      </div>

      {/* Wizard */}
      <PaCreateWizard
        templateId={templateId || undefined}
        templateData={templateData}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}
