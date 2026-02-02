"use client";

import { useParams } from 'next/navigation';
import { ModuleDetail } from '@/components/templates';
import { getSchemaBySlug } from '@/db/schemas';

export default function ModuleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const id = params.id as string;
  const schema = getSchemaBySlug(slug);

  if (!schema) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-12 text-center">
        <p className="text-stone-500">Модуль не найден</p>
      </div>
    );
  }

  return <ModuleDetail schema={schema} primaryCollection={schema.primaryCollection} itemId={id} />;
}
