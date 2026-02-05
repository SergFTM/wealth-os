"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface TourStep {
  id: string;
  target: string;
  title: { ru: string; en: string };
  description: { ru: string; en: string };
  position: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    id: "sidebar",
    target: "[data-tour='sidebar']",
    title: { ru: "Боковое меню", en: "Sidebar" },
    description: {
      ru: "Навигация по всем модулям системы. Кликните на модуль для перехода.",
      en: "Navigate through all system modules. Click on a module to open it.",
    },
    position: "right",
  },
  {
    id: "header-search",
    target: "[data-tour='search']",
    title: { ru: "Глобальный поиск", en: "Global Search" },
    description: {
      ru: "Быстрый поиск по всем объектам: households, документы, задачи, сообщения.",
      en: "Quick search across all objects: households, documents, tasks, messages.",
    },
    position: "bottom",
  },
  {
    id: "scope-switcher",
    target: "[data-tour='scope']",
    title: { ru: "Переключатель scope", en: "Scope Switcher" },
    description: {
      ru: "Выберите уровень просмотра: Household, Entity, Portfolio или Account.",
      en: "Select view level: Household, Entity, Portfolio or Account.",
    },
    position: "bottom",
  },
  {
    id: "create-button",
    target: "[data-tour='create']",
    title: { ru: "Быстрое создание", en: "Quick Create" },
    description: {
      ru: "Создайте задачу, документ, сообщение или отчет одним кликом.",
      en: "Create a task, document, message or report with one click.",
    },
    position: "bottom",
  },
  {
    id: "copilot",
    target: "[data-tour='copilot']",
    title: { ru: "AI Copilot", en: "AI Copilot" },
    description: {
      ru: "Интеллектуальный помощник для анализа данных и генерации отчетов.",
      en: "Intelligent assistant for data analysis and report generation.",
    },
    position: "left",
  },
];

export function PfTourPanel() {
  const { locale } = useApp();
  const [tourCompleted, setTourCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem("wealth-os-tour-completed");
    setTourCompleted(completed === "true");
  }, []);

  const t = {
    title: locale === "ru" ? "Тур по системе" : "System Tour",
    startTour: locale === "ru" ? "Начать тур" : "Start Tour",
    resetTour: locale === "ru" ? "Сбросить тур" : "Reset Tour",
    completed: locale === "ru" ? "Тур завершен" : "Tour Completed",
    notCompleted: locale === "ru" ? "Тур не пройден" : "Tour Not Completed",
    steps: locale === "ru" ? "шагов" : "steps",
    step: locale === "ru" ? "Шаг" : "Step",
  };

  const handleStartTour = () => {
    setCurrentStep(0);
    localStorage.setItem("wealth-os-tour-step", "0");
    // In a real implementation, this would trigger the tour overlay
    alert(locale === "ru" ? "Тур начат! (MVP: только показываем шаги)" : "Tour started! (MVP: only showing steps)");
  };

  const handleResetTour = () => {
    localStorage.removeItem("wealth-os-tour-completed");
    localStorage.removeItem("wealth-os-tour-step");
    setTourCompleted(false);
    setCurrentStep(0);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-stone-800">{t.title}</h3>
        <div
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            tourCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          )}
        >
          {tourCompleted ? t.completed : t.notCompleted}
        </div>
      </div>

      <p className="text-sm text-stone-500 mb-4">
        {locale === "ru"
          ? "Пройдите интерактивный тур по основным элементам интерфейса"
          : "Take an interactive tour of the main interface elements"}
      </p>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleStartTour}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          {t.startTour}
        </button>
        <button
          onClick={handleResetTour}
          className="px-4 py-2 bg-stone-100 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors"
        >
          {t.resetTour}
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium text-stone-600 mb-2">
          {tourSteps.length} {t.steps}:
        </div>
        {tourSteps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "p-3 rounded-lg border transition-all",
              index < currentStep
                ? "bg-emerald-50 border-emerald-200"
                : index === currentStep
                ? "bg-blue-50 border-blue-200"
                : "bg-stone-50 border-stone-200"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium",
                  index < currentStep
                    ? "bg-emerald-500 text-white"
                    : index === currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-stone-300 text-stone-600"
                )}
              >
                {index < currentStep ? "✓" : index + 1}
              </span>
              <span className="font-medium text-stone-800">
                {step.title[locale === "ru" ? "ru" : "en"]}
              </span>
            </div>
            <div className="text-xs text-stone-500 ml-7">
              {step.description[locale === "ru" ? "ru" : "en"]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
