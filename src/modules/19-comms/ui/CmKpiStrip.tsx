"use client";

import Link from 'next/link';
import { Mail, Clock, CheckCircle, AlertTriangle, Pin, Eye, Archive, MessageSquare } from 'lucide-react';

interface KpiItem {
  id: string;
  label: string;
  value: string | number;
  color: 'default' | 'emerald' | 'amber' | 'red';
  href?: string;
}

interface CmKpiStripProps {
  items: KpiItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  unreadThreads: Mail,
  requestsPending: MessageSquare,
  approvalDiscussions: CheckCircle,
  slaAtRisk: Clock,
  slaOverdue: AlertTriangle,
  pinnedThreads: Pin,
  clientVisibleThreads: Eye,
  archivedThreads: Archive,
};

const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
  default: { bg: 'bg-stone-50', text: 'text-stone-800', icon: 'text-stone-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-800', icon: 'text-emerald-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-800', icon: 'text-amber-500' },
  red: { bg: 'bg-red-50', text: 'text-red-800', icon: 'text-red-500' },
};

export function CmKpiStrip({ items }: CmKpiStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {items.map((item) => {
        const Icon = iconMap[item.id] || MessageSquare;
        const colors = colorClasses[item.color] || colorClasses.default;

        const content = (
          <div className={`${colors.bg} rounded-xl p-4 border border-stone-200/50 hover:shadow-md transition-all cursor-pointer`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${colors.icon}`} />
              <span className="text-xs text-stone-500 truncate">{item.label}</span>
            </div>
            <div className={`text-2xl font-bold ${colors.text}`}>
              {item.value}
            </div>
          </div>
        );

        if (item.href) {
          return (
            <Link key={item.id} href={item.href}>
              {content}
            </Link>
          );
        }

        return <div key={item.id}>{content}</div>;
      })}
    </div>
  );
}
