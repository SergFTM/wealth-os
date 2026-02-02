"use client";

import { cn } from '@/lib/utils';

interface Template {
  id: string;
  name: string;
  description: string;
  audience: string;
  sectionsCount: number;
  isActive: boolean;
}

interface ReportsTemplatesGalleryProps {
  templates: Template[];
  onSelect: (templateId: string) => void;
}

const audienceIcons: Record<string, string> = {
  client: '👤',
  committee: '👥',
  advisor: '💼',
  internal: '🔒',
};

const audienceLabels: Record<string, string> = {
  client: 'Клиент',
  committee: 'Комитет',
  advisor: 'Советник',
  internal: 'Внутренний',
};

export function ReportsTemplatesGallery({ templates, onSelect }: ReportsTemplatesGalleryProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-800">Шаблоны отчётов</h3>
        <span className="text-xs text-stone-500">{templates.length} шаблонов</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {templates.map(template => (
          <div
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={cn(
              "p-4 rounded-lg border border-stone-200 bg-gradient-to-br from-white to-stone-50",
              "hover:shadow-lg hover:border-emerald-300 cursor-pointer transition-all",
              "hover:scale-[1.02]"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">{audienceIcons[template.audience] || '📄'}</span>
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded",
                template.audience === 'client' ? "bg-emerald-100 text-emerald-700" :
                template.audience === 'committee' ? "bg-blue-100 text-blue-700" :
                template.audience === 'advisor' ? "bg-purple-100 text-purple-700" :
                "bg-stone-100 text-stone-600"
              )}>
                {audienceLabels[template.audience]}
              </span>
            </div>
            <h4 className="font-medium text-stone-800 text-sm mb-1 line-clamp-2">
              {template.name}
            </h4>
            <p className="text-xs text-stone-500 line-clamp-2 mb-2">
              {template.description}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">{template.sectionsCount} секций</span>
              <span className="text-emerald-600 font-medium">Создать →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
