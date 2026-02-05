"use client";

import { useApp } from "@/lib/store";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Shield, ThumbsUp, ThumbsDown, Copy, Check, Sparkles } from "lucide-react";

type CopilotTab = 'ask' | 'explain' | 'draft' | 'triage';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  confidence?: number;
  sources?: Array<{ label: string; href: string }>;
  eventId?: string;
}

export function CopilotDrawer() {
  const { copilotOpen, closeCopilot, locale } = useApp();
  const [activeTab, setActiveTab] = useState<CopilotTab>('ask');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clientSafeMode, setClientSafeMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const tabs: { key: CopilotTab; label: Record<string, string>; promptType: string }[] = [
    { key: 'ask', label: { ru: 'Спросить', en: 'Ask', uk: 'Запитати' }, promptType: 'general_query' },
    { key: 'explain', label: { ru: 'Объяснить', en: 'Explain', uk: 'Пояснити' }, promptType: 'explain_change' },
    { key: 'draft', label: { ru: 'Написать', en: 'Draft', uk: 'Написати' }, promptType: 'draft_message' },
    { key: 'triage', label: { ru: 'Triage', en: 'Triage', uk: 'Triage' }, promptType: 'triage_tasks' },
  ];

  const placeholders: Record<CopilotTab, Record<string, string>> = {
    ask: { ru: 'Задайте вопрос о портфеле...', en: 'Ask about the portfolio...', uk: 'Задайте питання про портфель...' },
    explain: { ru: 'Что объяснить? (изменение, отчет...)', en: 'What to explain? (change, report...)', uk: 'Що пояснити? (зміна, звіт...)' },
    draft: { ru: 'Что написать? (письмо, отчет...)', en: 'What to draft? (email, report...)', uk: 'Що написати? (лист, звіт...)' },
    triage: { ru: 'Какие задачи приоритизировать?', en: 'What tasks to prioritize?', uk: 'Які задачі пріоритизувати?' },
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message when opening
  useEffect(() => {
    if (copilotOpen && messages.length === 0) {
      const welcomeMessages: Record<string, string> = {
        ru: 'Привет! Я AI Copilot платформы Wealth OS. Задайте вопрос или выберите вкладку для конкретного действия.',
        en: 'Hello! I am the Wealth OS AI Copilot. Ask a question or select a tab for specific actions.',
        uk: 'Привіт! Я AI Copilot платформи Wealth OS. Задайте питання або виберіть вкладку для конкретної дії.',
      };
      setMessages([{
        id: 'welcome',
        role: 'ai',
        content: welcomeMessages[locale],
        timestamp: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  }, [copilotOpen, locale]);

  const handleSubmit = async () => {
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const currentTab = tabs.find(t => t.key === activeTab);
      const response = await fetch('/api/ai/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          promptType: currentTab?.promptType || 'general_query',
          clientSafe: clientSafeMode,
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: data.response || data.error || (locale === 'ru' ? 'Не удалось получить ответ' : 'Failed to get response'),
        timestamp: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
        confidence: data.confidence,
        sources: data.sources,
        eventId: data.eventId,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessages: Record<string, string> = {
        ru: 'Произошла ошибка при обработке запроса. Попробуйте еще раз.',
        en: 'An error occurred while processing the request. Please try again.',
        uk: 'Виникла помилка під час обробки запиту. Спробуйте ще раз.',
      };
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'ai',
        content: errorMessages[locale],
        timestamp: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, rating: 'up' | 'down') => {
    const message = messages.find(m => m.id === messageId);
    if (!message?.eventId) return;

    setFeedbackGiven(prev => ({ ...prev, [messageId]: rating }));

    try {
      await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: message.eventId,
          rating,
        }),
      });
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  };

  const handleCopy = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([]);
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
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
          <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
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

        {/* Client-safe mode toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg flex-1 mr-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                  activeTab === tab.key
                    ? "bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 shadow-sm"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                )}
              >
                {tab.label[locale]}
              </button>
            ))}
          </div>

          <button
            onClick={() => setClientSafeMode(!clientSafeMode)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              clientSafeMode
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
            )}
            title={clientSafeMode
              ? (locale === 'ru' ? 'Client-safe режим включен' : 'Client-safe mode enabled')
              : (locale === 'ru' ? 'Включить client-safe режим' : 'Enable client-safe mode')
            }
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>

        {/* Client-safe notice */}
        {clientSafeMode && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              {locale === 'ru'
                ? 'Client-safe режим: ответы безопасны для показа клиенту'
                : 'Client-safe mode: responses are safe to show to clients'}
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "p-4 rounded-xl",
                msg.role === 'user'
                  ? "bg-stone-100 dark:bg-stone-800 ml-8"
                  : "bg-violet-50 dark:bg-violet-900/20 mr-8"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {msg.role === 'user'
                    ? (locale === 'ru' ? 'Вы' : 'You')
                    : 'AI Copilot'}
                </div>
                <div className="text-xs text-stone-400 dark:text-stone-500">{msg.timestamp}</div>
              </div>

              <div className="text-sm text-stone-800 dark:text-stone-200 whitespace-pre-wrap">{msg.content}</div>

              {/* Confidence badge */}
              {msg.role === 'ai' && msg.confidence !== undefined && (
                <div className="mt-2 pt-2 border-t border-violet-100 dark:border-violet-800">
                  <span className={cn(
                    "text-xs font-medium",
                    msg.confidence >= 80 ? "text-emerald-600 dark:text-emerald-400" :
                    msg.confidence >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {locale === 'ru' ? 'Уверенность' : 'Confidence'}: {msg.confidence}%
                  </span>
                </div>
              )}

              {/* Sources */}
              {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-violet-100 dark:border-violet-800">
                  <div className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                    {locale === 'ru' ? 'Источники:' : 'Sources:'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {msg.sources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.href}
                        className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline"
                      >
                        {source.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions for AI messages */}
              {msg.role === 'ai' && msg.id !== 'welcome' && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-violet-100 dark:border-violet-800">
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="p-1 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                    title={locale === 'ru' ? 'Копировать' : 'Copy'}
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {msg.eventId && (
                    <>
                      <button
                        onClick={() => handleFeedback(msg.id, 'up')}
                        className={cn(
                          "p-1 transition-colors",
                          feedbackGiven[msg.id] === 'up'
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-stone-400 dark:text-stone-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                        )}
                        disabled={!!feedbackGiven[msg.id]}
                        title={locale === 'ru' ? 'Полезно' : 'Helpful'}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, 'down')}
                        className={cn(
                          "p-1 transition-colors",
                          feedbackGiven[msg.id] === 'down'
                            ? "text-red-600 dark:text-red-400"
                            : "text-stone-400 dark:text-stone-500 hover:text-red-600 dark:hover:text-red-400"
                        )}
                        disabled={!!feedbackGiven[msg.id]}
                        title={locale === 'ru' ? 'Не полезно' : 'Not helpful'}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-xl mr-8">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-violet-400 dark:bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-violet-400 dark:bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-violet-400 dark:bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-stone-200 dark:border-stone-700 pt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
              placeholder={placeholders[activeTab][locale]}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 dark:focus:border-violet-400 disabled:bg-stone-50 dark:disabled:bg-stone-800 disabled:cursor-not-allowed"
            />
            <Button variant="primary" onClick={handleSubmit} disabled={isLoading || !query.trim()}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          <div className="flex items-center justify-between mt-2">
            <button
              onClick={handleClear}
              className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
            >
              {locale === 'ru' ? 'Очистить историю' : 'Clear history'}
            </button>
            <a href="/m/ai" className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300">
              {locale === 'ru' ? 'Открыть AI модуль →' : 'Open AI module →'}
            </a>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
