"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCollection } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { MdPersonDetail } from '@/modules/46-mdm/ui/MdPersonDetail';

export default function MdmPersonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: people = [], update } = useCollection('mdmPeople') as { data: any[]; update: (id: string, data: any) => Promise<any> };

  const person = people.find((p) => p.id === id);

  if (!person) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  const handleOverrideField = async (field: string, value: unknown) => {
    const newValue = prompt(`Введите новое значение для ${field}:`, String(value));
    if (newValue !== null) {
      const overrides = person.overridesJson ? { ...person.overridesJson } : {};
      overrides[field] = {
        value: newValue,
        overriddenAt: new Date().toISOString(),
        overriddenBy: 'current_user',
        reason: 'Manual override',
      };

      const chosen = { ...person.chosenJson };
      chosen[field] = newValue;

      await update(id, {
        chosenJson: chosen,
        overridesJson: overrides,
      });
    }
  };

  const handleAcceptSource = async (field: string, sourceSystem: string) => {
    const source = person.sourcesJson?.find((s: { sourceSystem: string }) => s.sourceSystem === sourceSystem);
    if (source && source.fieldsJson[field] !== undefined) {
      const chosen = { ...person.chosenJson };
      chosen[field] = source.fieldsJson[field];
      await update(id, { chosenJson: chosen });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/m/mdm/list?tab=people">
              <Button variant="ghost" className="gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-stone-800">Карточка персоны</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <MdPersonDetail
          person={person}
          onOverrideField={handleOverrideField}
          onAcceptSource={handleAcceptSource}
        />
      </div>
    </div>
  );
}
