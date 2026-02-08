"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCollection } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { MdRuleDetail } from '@/modules/46-mdm/ui/MdRuleDetail';

export default function MdmRulePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rules = [], update } = useCollection('mdmRules') as { data: any[]; update: (id: string, data: any) => Promise<any> };

  const rule = rules.find((r) => r.id === id);

  if (!rule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  const handleSave = async (config: Record<string, unknown>) => {
    await update(id, {
      configJson: config,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleToggleStatus = async () => {
    await update(id, {
      status: rule.status === 'enabled' ? 'disabled' : 'enabled',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleTestRun = () => {
    alert('Test run functionality would execute the rule on sample records');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/m/mdm/list?tab=rules">
              <Button variant="ghost" className="gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-stone-800">Карточка правила</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <MdRuleDetail
          rule={rule}
          onSave={handleSave}
          onToggleStatus={handleToggleStatus}
          onTestRun={handleTestRun}
        />
      </div>
    </div>
  );
}
