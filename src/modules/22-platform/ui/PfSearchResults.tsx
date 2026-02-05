"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SearchResult } from "./PfSearchPanel";

interface PfSearchResultsProps {
  results: SearchResult[];
  onClose: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  household: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  entity: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  portfolio: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  ),
  document: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  task: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  thread: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  invoice: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
    </svg>
  ),
  alert: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

const typeColors: Record<string, string> = {
  household: "bg-blue-100 text-blue-600",
  entity: "bg-purple-100 text-purple-600",
  portfolio: "bg-emerald-100 text-emerald-600",
  document: "bg-amber-100 text-amber-600",
  task: "bg-sky-100 text-sky-600",
  thread: "bg-pink-100 text-pink-600",
  invoice: "bg-indigo-100 text-indigo-600",
  alert: "bg-rose-100 text-rose-600",
};

export function PfSearchResults({ results, onClose }: PfSearchResultsProps) {
  const { locale } = useApp();

  // Group results by type
  const grouped = results.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const typeLabels: Record<string, { ru: string; en: string }> = {
    household: { ru: "Households", en: "Households" },
    entity: { ru: "Entities", en: "Entities" },
    portfolio: { ru: "Портфели", en: "Portfolios" },
    document: { ru: "Документы", en: "Documents" },
    task: { ru: "Задачи", en: "Tasks" },
    thread: { ru: "Сообщения", en: "Messages" },
    invoice: { ru: "Счета", en: "Invoices" },
    alert: { ru: "Алерты", en: "Alerts" },
  };

  if (results.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        {locale === "ru" ? "Введите запрос для поиска" : "Enter a query to search"}
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type}>
          <div className="px-4 py-2 bg-stone-50 text-xs font-medium text-stone-500 uppercase tracking-wide sticky top-0">
            {typeLabels[type]?.[locale === "ru" ? "ru" : "en"] || type}
          </div>
          {items.map((result) => (
            <Link
              key={result.id}
              href={result.route}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", typeColors[result.type])}>
                {typeIcons[result.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-stone-800 truncate">{result.title}</div>
                {result.subtitle && (
                  <div className="text-xs text-stone-500 truncate">{result.subtitle}</div>
                )}
              </div>
              <div className="text-xs text-stone-400">{result.module}</div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
