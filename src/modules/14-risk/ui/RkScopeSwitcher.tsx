"use client";

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ScopeOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface RkScopeSwitcherProps {
  options: ScopeOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function RkScopeSwitcher({ options, value, onChange, label = 'Scope' }: RkScopeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.id === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
      >
        <div className="text-left">
          <div className="text-xs text-stone-500">{label}</div>
          <div className="text-sm font-medium text-stone-800">{selectedOption?.label}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-stone-50 transition-colors ${
                option.id === value ? 'bg-stone-50' : ''
              }`}
            >
              <div className="text-sm font-medium text-stone-800">{option.label}</div>
              {option.sublabel && (
                <div className="text-xs text-stone-500">{option.sublabel}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
