'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { ExTemplateDetail } from '@/modules/37-exports/ui/ExTemplateDetail';

interface PackSection {
  sectionId: string;
  enabled: boolean;
  label?: string;
  filters?: Record<string, unknown>;
  columns?: string[];
  format?: 'csv' | 'pdf';
}

interface Template {
  id: string;
  name: string;
  description?: string;
  defaultPackType: 'audit' | 'tax' | 'bank' | 'ops';
  defaultClientSafe: boolean;
  sectionsJson: PackSection[];
  isSystem: boolean;
  category?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/collections/exportTemplates/${resolvedParams.id}`);
      if (res.ok) {
        setTemplate(await res.json());
      }
    } catch (err) {
      console.error('Failed to load template:', err);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApply = async () => {
    if (!template) return;

    try {
      // Create a new pack from template
      const newPack = {
        id: `pack-${Date.now()}`,
        clientId: 'default',
        name: `Pack from ${template.name}`,
        packType: template.defaultPackType,
        scopeType: 'client',
        asOf: new Date().toISOString().split('T')[0],
        clientSafe: template.defaultClientSafe,
        status: 'draft',
        sectionsJson: template.sectionsJson,
        templateId: template.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/collections/exportPacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPack),
      });

      if (res.ok) {
        // Create audit event
        await fetch('/api/collections/auditEvents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `audit-${Date.now()}`,
            module: 'exports',
            action: 'pack_created_from_template',
            entityType: 'exportPack',
            entityId: newPack.id,
            details: { templateId: template.id },
            createdAt: new Date().toISOString(),
          }),
        });

        router.push(`/m/exports/pack/${newPack.id}`);
      }
    } catch (err) {
      console.error('Failed to create pack from template:', err);
      alert('Ошибка при создании пакета');
    }
  };

  const handleEdit = () => {
    router.push(`/m/exports/template/${resolvedParams.id}/edit`);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Шаблон не найден</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ExTemplateDetail
        template={template}
        onApply={handleApply}
        onEdit={handleEdit}
      />
    </div>
  );
}
