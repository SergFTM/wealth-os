"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useRecord } from "@/lib/hooks";
import { PaTemplateDetail } from "@/modules/52-packs/ui/PaTemplateDetail";

// Types matching component interface
interface TemplateItem {
  itemTypeKey: string;
  title: string;
  required?: boolean;
  clientSafe?: boolean;
}

interface PackTemplate {
  id: string;
  name: string;
  description?: string;
  audienceKey: string;
  defaultClientSafe: boolean;
  defaultSensitivityKey: 'low' | 'medium' | 'high';
  defaultWatermarkKey?: 'on' | 'off';
  defaultItemsJson?: TemplateItem[];
  coverLetterTemplateMd?: string;
  usageCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: rawTemplate, isLoading } = useRecord("packTemplates", id);

  // Cast to typed data
  const template = rawTemplate as unknown as PackTemplate | null;

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

  if (!template) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-stone-800">Шаблон не найден</h2>
          <p className="text-stone-500 mt-2">Шаблон с ID {id} не существует</p>
          <button
            onClick={() => router.push("/m/packs/list?tab=templates")}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    console.log("Edit template:", id);
  };

  const handleCreatePack = () => {
    router.push(`/m/packs/create?template=${id}`);
  };

  const handleDelete = async () => {
    if (confirm("Удалить шаблон? Это действие нельзя отменить.")) {
      try {
        await fetch(`/api/collections/packTemplates/${id}`, {
          method: "DELETE",
        });
        router.push("/m/packs/list?tab=templates");
      } catch (error) {
        console.error("Error deleting template:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <PaTemplateDetail
        template={template}
        onEdit={handleEdit}
        onCreatePack={handleCreatePack}
        onDelete={handleDelete}
        onBack={() => router.push("/m/packs/list?tab=templates")}
      />
    </div>
  );
}
