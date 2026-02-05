"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface PfSeedManagerProps {
  currentProfile: string;
  onProfileChange: (profile: "small" | "medium" | "full") => void;
}

const profiles: {
  id: "small" | "medium" | "full";
  title: { ru: string; en: string };
  description: { ru: string; en: string };
  collections: number;
  records: string;
}[] = [
  {
    id: "small",
    title: { ru: "Малый", en: "Small" },
    description: { ru: "Минимальный набор данных для быстрой демонстрации", en: "Minimal data set for quick demos" },
    collections: 15,
    records: "~500",
  },
  {
    id: "medium",
    title: { ru: "Средний", en: "Medium" },
    description: { ru: "Оптимальный набор для большинства сценариев", en: "Optimal set for most scenarios" },
    collections: 25,
    records: "~2,000",
  },
  {
    id: "full",
    title: { ru: "Полный", en: "Full" },
    description: { ru: "Все коллекции и реалистичный объем данных", en: "All collections with realistic data volume" },
    collections: 40,
    records: "~10,000",
  },
];

export function PfSeedManager({ currentProfile, onProfileChange }: PfSeedManagerProps) {
  const { locale } = useApp();
  const [selected, setSelected] = useState(currentProfile);

  const handleSelect = (profile: "small" | "medium" | "full") => {
    setSelected(profile);
    onProfileChange(profile);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">
        {locale === "ru" ? "Профиль seed данных" : "Seed Data Profile"}
      </h3>
      <p className="text-sm text-stone-500 mb-4">
        {locale === "ru"
          ? "Выберите объем данных для инициализации демо"
          : "Choose data volume for demo initialization"}
      </p>

      <div className="grid grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleSelect(profile.id)}
            className={cn(
              "p-4 rounded-xl border-2 text-left transition-all",
              selected === profile.id
                ? "border-emerald-500 bg-emerald-50"
                : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
            )}
          >
            <div className="font-medium text-stone-800 mb-1">
              {profile.title[locale === "ru" ? "ru" : "en"]}
            </div>
            <div className="text-xs text-stone-500 mb-3">
              {profile.description[locale === "ru" ? "ru" : "en"]}
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-400">
                {locale === "ru" ? "Коллекции" : "Collections"}: {profile.collections}
              </span>
              <span className="text-stone-400">
                {locale === "ru" ? "Записей" : "Records"}: {profile.records}
              </span>
            </div>
            {selected === profile.id && (
              <div className="mt-3 flex items-center gap-1 text-emerald-600 text-xs font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {locale === "ru" ? "Выбран" : "Selected"}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
