"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface TourStep {
  id: string;
  title: { ru: string; en: string };
  description: { ru: string; en: string };
  element?: string;
}

const steps: TourStep[] = [
  {
    id: "welcome",
    title: { ru: "Добро пожаловать в Wealth OS", en: "Welcome to Wealth OS" },
    description: {
      ru: "Это ваша платформа для управления семейным состоянием. Давайте познакомимся с основными элементами интерфейса.",
      en: "This is your family wealth management platform. Let's explore the main interface elements.",
    },
  },
  {
    id: "sidebar",
    title: { ru: "Боковое меню", en: "Sidebar Navigation" },
    description: {
      ru: "Здесь расположены все модули системы. Кликните на любой модуль для перехода.",
      en: "Here you'll find all system modules. Click any module to navigate.",
    },
    element: "[data-tour='sidebar']",
  },
  {
    id: "search",
    title: { ru: "Глобальный поиск", en: "Global Search" },
    description: {
      ru: "Быстрый поиск по всем объектам системы. Используйте Ctrl+K или ⌘K.",
      en: "Quick search across all objects. Use Ctrl+K or ⌘K.",
    },
    element: "[data-tour='search']",
  },
  {
    id: "create",
    title: { ru: "Быстрое создание", en: "Quick Create" },
    description: {
      ru: "Создавайте задачи, документы, сообщения одним кликом.",
      en: "Create tasks, documents, messages with one click.",
    },
    element: "[data-tour='create']",
  },
  {
    id: "copilot",
    title: { ru: "AI Copilot", en: "AI Copilot" },
    description: {
      ru: "Ваш интеллектуальный помощник для анализа и генерации контента.",
      en: "Your intelligent assistant for analysis and content generation.",
    },
    element: "[data-tour='copilot']",
  },
];

export function TourOverlay() {
  const { locale } = useApp();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const tourCompleted = localStorage.getItem("wealth-os-tour-completed");
    const firstVisit = !localStorage.getItem("wealth-os-visited");

    if (firstVisit && !tourCompleted) {
      localStorage.setItem("wealth-os-visited", "true");
      // Uncomment to auto-start tour on first visit:
      // setIsActive(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("wealth-os-tour-completed", "true");
    setIsActive(false);
    setCurrentStep(0);
  };

  const handleSkip = () => {
    localStorage.setItem("wealth-os-tour-completed", "true");
    setIsActive(false);
  };

  if (!isActive) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Tour Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
          {/* Progress */}
          <div className="flex gap-1 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i <= currentStep ? "bg-emerald-500" : "bg-stone-200"
                )}
              />
            ))}
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold text-stone-800 mb-2">
            {step.title[locale === "ru" ? "ru" : "en"]}
          </h3>
          <p className="text-stone-600 mb-6">
            {step.description[locale === "ru" ? "ru" : "en"]}
          </p>

          {/* Step indicator */}
          <div className="text-sm text-stone-400 mb-4">
            {currentStep + 1} / {steps.length}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
            >
              {locale === "ru" ? "Пропустить" : "Skip tour"}
            </button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 bg-stone-100 text-stone-600 rounded-lg font-medium hover:bg-stone-200 transition-colors"
                >
                  {locale === "ru" ? "Назад" : "Back"}
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                {currentStep < steps.length - 1
                  ? locale === "ru"
                    ? "Далее"
                    : "Next"
                  : locale === "ru"
                  ? "Готово"
                  : "Done"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
