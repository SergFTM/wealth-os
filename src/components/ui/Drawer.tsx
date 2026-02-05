"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useEffect } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function Drawer({ open, onClose, title, children, width = "w-[480px]" }: DrawerProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full bg-white dark:bg-stone-900 shadow-2xl z-50",
          "transform transition-transform duration-300 ease-out",
          width
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-700 bg-gradient-to-r from-stone-50 to-stone-100/50 dark:from-stone-800 dark:to-stone-800/50">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 h-[calc(100%-65px)]">
          {children}
        </div>
      </div>
    </>
  );
}
