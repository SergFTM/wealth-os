"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  module: string;
  route: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  household: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  entity: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  document: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  task: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  thread: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
};

const typeColors: Record<string, string> = {
  household: "bg-blue-100 text-blue-600",
  entity: "bg-purple-100 text-purple-600",
  document: "bg-amber-100 text-amber-600",
  task: "bg-sky-100 text-sky-600",
  thread: "bg-pink-100 text-pink-600",
};

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const { locale } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) onClose(); // Toggle handled by parent
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-x-0 top-20 mx-auto max-w-xl z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={locale === "ru" ? "Поиск..." : "Search..."}
              className="w-full pl-12 pr-4 py-4 text-lg border-b border-stone-100 focus:outline-none"
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 && query.length >= 2 ? (
              <div className="p-8 text-center text-stone-500">
                {locale === "ru" ? "Ничего не найдено" : "No results found"}
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-stone-400">
                {locale === "ru" ? "Введите минимум 2 символа" : "Enter at least 2 characters"}
              </div>
            ) : (
              results.map((result) => (
                <Link
                  key={result.id}
                  href={result.route}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", typeColors[result.type] || "bg-stone-100 text-stone-600")}>
                    {typeIcons[result.type] || <span className="text-xs font-bold">{result.type.charAt(0).toUpperCase()}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-stone-800 truncate">{result.title}</div>
                    {result.subtitle && <div className="text-xs text-stone-500 truncate">{result.subtitle}</div>}
                  </div>
                  <div className="text-xs text-stone-400">{result.module}</div>
                </Link>
              ))
            )}
          </div>

          <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex justify-between text-xs text-stone-500">
            <span>
              <kbd className="px-1.5 py-0.5 bg-stone-200 rounded">ESC</kbd> {locale === "ru" ? "закрыть" : "close"}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-stone-200 rounded">⌘K</kbd> {locale === "ru" ? "поиск" : "search"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
