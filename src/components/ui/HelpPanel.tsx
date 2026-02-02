"use client";

import { useState } from 'react';

interface HelpPanelProps {
  title: string;
  description: string;
  features: string[];
  scenarios: string[];
  dataSources: string[];
}

export function HelpPanel({ title, description, features, scenarios, dataSources }: HelpPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium text-stone-800">Справка</span>
        </div>
        <svg className={`w-4 h-4 text-stone-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {expanded && (
        <div className="mt-4 space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-stone-700 mb-1">{title}</h4>
            <p className="text-stone-500">{description}</p>
          </div>
          
          <div>
            <h5 className="font-medium text-stone-600 mb-2">Возможности</h5>
            <ul className="space-y-1">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-stone-500">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-stone-600 mb-2">Типовые сценарии</h5>
            <ul className="space-y-1">
              {scenarios.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-stone-500">
                  <span className="text-amber-500">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-stone-600 mb-2">Источники данных</h5>
            <ul className="space-y-1">
              {dataSources.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-stone-500">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
