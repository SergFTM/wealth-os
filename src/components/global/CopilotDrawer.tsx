"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Shield, Settings, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { CopilotMessage } from './CopilotMessage';
import { CopilotEntry } from './CopilotEntry';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: number;
  sources?: Array<{ label: string; href: string }>;
  eventId?: string;
}

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  moduleContext?: {
    moduleKey: string;
    moduleName: string;
    scopeType?: string;
    scopeId?: string;
    recordId?: string;
    recordType?: string;
  };
  initialPrompt?: string;
}

const defaultQuickActions = [
  { id: 'explain', label: 'Объяснить изменение Net Worth', promptType: 'explain_change' },
  { id: 'risk', label: 'Сводка рисков', promptType: 'summarize_risk' },
  { id: 'draft', label: 'Создать draft клиенту', promptType: 'draft_message' },
  { id: 'triage', label: 'Приоритизация задач', promptType: 'triage_tasks' },
];

export function CopilotDrawer({
  isOpen,
  onClose,
  moduleContext,
  initialPrompt,
}: CopilotDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clientSafeMode, setClientSafeMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Process initial prompt when drawer opens
  useEffect(() => {
    if (isOpen && initialPrompt && messages.length === 0) {
      handleSubmit(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0 && !initialPrompt) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: moduleContext
          ? `Привет! Я AI Copilot с контекстом модуля "${moduleContext.moduleName}". Чем могу помочь?`
          : 'Привет! Я AI Copilot платформы Wealth OS. Задайте вопрос или выберите быстрое действие ниже.',
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, moduleContext]);

  const handleSubmit = async (content: string, promptType?: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content,
          promptType: promptType || 'general_query',
          clientSafe: clientSafeMode,
          context: moduleContext,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || data.error || 'Не удалось получить ответ',
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        confidence: data.confidence,
        sources: data.sources,
        eventId: data.eventId,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Произошла ошибка при обработке запроса. Попробуйте еще раз.',
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, rating: 'up' | 'down') => {
    const message = messages.find(m => m.id === messageId);
    if (!message?.eventId) return;

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

  const handleClearHistory = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full bg-white shadow-xl z-50 flex flex-col transition-all duration-300 ${
          isExpanded ? 'w-full md:w-2/3' : 'w-full md:w-[420px]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-gradient-to-r from-violet-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-800">AI Copilot</h2>
              {moduleContext && (
                <p className="text-xs text-stone-500">{moduleContext.moduleName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Client-safe toggle */}
            <button
              onClick={() => setClientSafeMode(!clientSafeMode)}
              className={`p-2 rounded-lg transition-colors ${
                clientSafeMode
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
              }`}
              title={clientSafeMode ? 'Client-safe режим включен' : 'Включить client-safe режим'}
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Expand/collapse */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors hidden md:block"
              title={isExpanded ? 'Свернуть' : 'Развернуть'}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Clear history */}
            <button
              onClick={handleClearHistory}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              title="Очистить историю"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              title="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Client-safe mode notice */}
        {clientSafeMode && (
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200">
            <div className="flex items-center gap-2 text-xs text-emerald-700">
              <Shield className="w-3.5 h-3.5" />
              <span>Client-safe режим: ответы безопасны для показа клиенту</span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <CopilotMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              confidence={message.confidence}
              sources={message.sources}
              onFeedback={
                message.role === 'assistant' && message.eventId
                  ? (rating) => handleFeedback(message.id, rating)
                  : undefined
              }
              clientSafe={clientSafeMode && message.role === 'assistant'}
            />
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-600 animate-pulse" />
              </div>
              <div className="flex items-center gap-1 px-4 py-3 bg-violet-50 rounded-2xl rounded-tl-sm">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <CopilotEntry
          onSubmit={handleSubmit}
          isLoading={isLoading}
          quickActions={messages.length <= 1 ? defaultQuickActions : []}
          placeholder={
            moduleContext
              ? `Спросить о ${moduleContext.moduleName}...`
              : 'Задайте вопрос...'
          }
        />
      </div>
    </>
  );
}
