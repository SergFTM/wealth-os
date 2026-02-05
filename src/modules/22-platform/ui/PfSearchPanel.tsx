"use client";

import { useState, useEffect, useCallback } from "react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { PfSearchResults } from "./PfSearchResults";

interface PfSearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SearchResult {
  id: string;
  type: "household" | "entity" | "portfolio" | "document" | "task" | "thread" | "invoice" | "alert";
  title: string;
  subtitle?: string;
  module: string;
  route: string;
  matchScore: number;
}

export function PfSearchPanel({ isOpen, onClose }: PfSearchPanelProps) {
  const { locale } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [scope, setScope] = useState<string>("all");

  const scopes = [
    { id: "all", label: locale === "ru" ? "Все" : "All" },
    { id: "household", label: locale === "ru" ? "Households" : "Households" },
    { id: "document", label: locale === "ru" ? "Документы" : "Documents" },
    { id: "task", label: locale === "ru" ? "Задачи" : "Tasks" },
    { id: "thread", label: locale === "ru" ? "Сообщения" : "Messages" },
  ];

  const search = useCallback(async (q: string, s: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&scope=${s}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query, scope);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, scope, search]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-x-0 top-20 mx-auto max-w-2xl z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={locale === "ru" ? "Поиск по всей системе..." : "Search across all modules..."}
                className="w-full pl-12 pr-4 py-3 text-lg rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              {scopes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScope(s.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    scope === s.id
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-stone-500 hover:bg-stone-100"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <PfSearchResults results={results} onClose={onClose} />

          <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 text-xs text-stone-500 flex justify-between">
            <span>
              {locale === "ru" ? "Нажмите" : "Press"} <kbd className="px-1.5 py-0.5 bg-stone-200 rounded">ESC</kbd>{" "}
              {locale === "ru" ? "для закрытия" : "to close"}
            </span>
            <span>
              {results.length} {locale === "ru" ? "результатов" : "results"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
