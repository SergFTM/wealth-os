"use client";

import { useApp } from "@/lib/store";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { cn } from "@/lib/utils";

type CopilotTab = 'ask' | 'explain' | 'draft' | 'triage';

export function CopilotDrawer() {
  const { copilotOpen, closeCopilot, locale } = useApp();
  const [activeTab, setActiveTab] = useState<CopilotTab>('ask');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const tabs: { key: CopilotTab; label: Record<string, string> }[] = [
    { key: 'ask', label: { ru: 'Спросить', en: 'Ask', uk: 'Запитати' } },
    { key: 'explain', label: { ru: 'Объяснить', en: 'Explain', uk: 'Пояснити' } },
    { key: 'draft', label: { ru: 'Написать', en: 'Draft', uk: 'Написати' } },
    { key: 'triage', label: { ru: 'Triage', en: 'Triage', uk: 'Triage' } },
  ];

  const placeholders: Record<CopilotTab, Record<string, string>> = {
    ask: { ru: 'Задайте вопрос о портфеле...', en: 'Ask about the portfolio...', uk: 'Задайте питання про портфель...' },
    explain: { ru: 'Что объяснить? (терминология, отчет...)', en: 'What to explain? (terminology, report...)', uk: 'Що пояснити? (термінологія, звіт...)' },
    draft: { ru: 'Что написать? (письмо, отчет...)', en: 'What to draft? (email, report...)', uk: 'Що написати? (лист, звіт...)' },
    triage: { ru: 'Опишите проблему для приоритизации...', en: 'Describe the issue for prioritization...', uk: 'Опишіть проблему для пріоритизації...' },
  };

  const handleSubmit = () => {
    if (!query.trim()) return;

    setMessages([...messages, { role: 'user', content: query }]);
    setQuery('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<CopilotTab, string> = {
        ask: locale === 'ru' 
          ? 'На основе анализа данных, общая стоимость портфеля составляет $487.5M. Основные позиции: 25% в акциях, 35% в облигациях, 15% в недвижимости, 25% в альтернативных инвестициях.'
          : 'Based on data analysis, total portfolio value is $487.5M. Main positions: 25% equities, 35% bonds, 15% real estate, 25% alternatives.',
        explain: locale === 'ru'
          ? 'NAV (Net Asset Value) - это чистая стоимость активов фонда. Рассчитывается как общая стоимость активов минус обязательства, деленная на количество паев.'
          : 'NAV (Net Asset Value) is the net value of fund assets. Calculated as total assets minus liabilities, divided by number of shares.',
        draft: locale === 'ru'
          ? 'Уважаемый клиент,\n\nНаправляем вам квартальный отчет за Q4 2025. Портфель показал доходность +8.4% за период.\n\nС уважением,\nВаш Family Office'
          : 'Dear Client,\n\nPlease find the Q4 2025 quarterly report. Portfolio achieved +8.4% return for the period.\n\nBest regards,\nYour Family Office',
        triage: locale === 'ru'
          ? '📊 Приоритизация:\n1. КРИТИЧНО: IPS breach для Aurora Family (превышение лимита акций)\n2. ВЫСОКИЙ: Просроченный платеж $45K\n3. СРЕДНИЙ: Ошибка синхронизации Goldman Sachs'
          : '📊 Prioritization:\n1. CRITICAL: IPS breach for Aurora Family (equity limit exceeded)\n2. HIGH: Overdue payment $45K\n3. MEDIUM: Goldman Sachs sync error',
      };

      setMessages(prev => [...prev, { role: 'ai', content: responses[activeTab] }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Drawer
      open={copilotOpen}
      onClose={closeCopilot}
      title="AI Copilot"
      width="w-[480px]"
    >
      <div className="flex flex-col h-full">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-amber-700 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              {locale === 'ru' 
                ? 'AI выводы информационные и требуют проверки человеком' 
                : locale === 'en'
                ? 'AI outputs are informational and require human verification'
                : 'AI висновки інформаційні та потребують перевірки людиною'}
            </span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-stone-100 rounded-lg mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === tab.key
                  ? "bg-white text-stone-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              )}
            >
              {tab.label[locale]}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center text-stone-400 py-12">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <p className="text-sm">
                {locale === 'ru' ? 'Начните диалог' : locale === 'en' ? 'Start a conversation' : 'Почніть діалог'}
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "p-4 rounded-xl",
                msg.role === 'user'
                  ? "bg-emerald-50 ml-8"
                  : "bg-stone-100 mr-8"
              )}
            >
              <div className="text-xs text-stone-500 mb-1">
                {msg.role === 'user' ? (locale === 'ru' ? 'Вы' : 'You') : 'AI Copilot'}
              </div>
              <div className="text-sm text-stone-800 whitespace-pre-wrap">{msg.content}</div>
            </div>
          ))}

          {isLoading && (
            <div className="bg-stone-100 p-4 rounded-xl mr-8">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-stone-200 pt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={placeholders[activeTab][locale]}
              className="flex-1 px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
