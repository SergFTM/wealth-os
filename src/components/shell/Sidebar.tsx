"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { getModulesForCluster } from "@/modules";
import { SIDEBAR_CLUSTERS, SLUG_TO_CLUSTER } from "@/modules/clusters";
import { moduleIcons } from "@/modules/icons";
import type { Locale } from "@/lib/i18n";
import type { ModuleConfig } from "@/modules/types";

export function Sidebar() {
  const pathname = usePathname();
  const { locale, clientSafe, activeCluster, setActiveCluster } = useApp();

  // Auto-sync cluster from current URL
  useEffect(() => {
    const match = pathname.match(/^\/m\/([^/]+)/);
    if (match) {
      const slug = match[1];
      const clusterId = SLUG_TO_CLUSTER[slug];
      if (clusterId !== undefined && clusterId >= 1 && clusterId <= 6 && clusterId !== activeCluster) {
        setActiveCluster(clusterId);
      }
    }
  }, [pathname, activeCluster, setActiveCluster]);

  const dashboardModules = getModulesForCluster(0, clientSafe);
  const clusterModules = getModulesForCluster(activeCluster, clientSafe);
  const platformModules = getModulesForCluster(7, clientSafe);

  const activeClusterDef = SIDEBAR_CLUSTERS.find(c => c.id === activeCluster);

  return (
    <aside className="w-64 h-screen bg-card/60 dark:bg-card/40 backdrop-blur-xl border-r border-border/50 flex flex-col transition-colors duration-300">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Link href="/m/dashboard-home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-sm">W</span>
          </div>
          <span className="font-bold text-foreground tracking-tight">Wealth OS</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {/* Dashboard Home — always visible */}
        {dashboardModules.map((module) => (
          <ModuleLink key={module.id} module={module} pathname={pathname} locale={locale} />
        ))}

        {/* Divider */}
        <div className="my-3 mx-3 border-t border-border/30" />

        {/* Active Cluster Header */}
        {activeClusterDef && (
          <div className="pb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
            {activeClusterDef.label[locale]}
          </div>
        )}

        {/* Active Cluster Modules */}
        <div className="space-y-0.5">
          {clusterModules.map((module) => (
            <ModuleLink key={module.id} module={module} pathname={pathname} locale={locale} />
          ))}
        </div>
      </nav>

      {/* Footer — Platform + Version */}
      <div className="border-t border-border/50">
        <PlatformSection modules={platformModules} pathname={pathname} locale={locale} />
        <div className="px-4 py-2 border-t border-border/50">
          <div className="text-xs text-muted-foreground/60 text-center font-medium">
            Wealth OS v1.0 MVP
          </div>
        </div>
      </div>
    </aside>
  );
}

function ModuleLink({ module, pathname, locale }: { module: ModuleConfig; pathname: string; locale: Locale }) {
  const href = `/m/${module.slug}`;
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
        isActive
          ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-sm border border-primary/5"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
      )}
    >
      <span className={cn(
        "flex-shrink-0 transition-colors duration-200",
        isActive ? "text-primary drop-shadow-sm" : "text-muted-foreground/70 group-hover:text-primary/70"
      )}>
        {moduleIcons[module.icon]}
      </span>
      <span className="truncate">{module.title[locale]}</span>
    </Link>
  );
}

function PlatformSection({ modules, pathname, locale }: { modules: ModuleConfig[]; pathname: string; locale: Locale }) {
  const [expanded, setExpanded] = useState(false);

  if (modules.length === 0) return null;

  const platformLabel = SIDEBAR_CLUSTERS.find(c => c.id === 7)?.label[locale] ?? 'Platform';

  return (
    <div className="px-3 py-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{platformLabel}</span>
        <svg className={cn("w-3 h-3 ml-auto transition-transform", expanded && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="space-y-0.5 mt-1">
          {modules.map((module) => {
            const href = `/m/${module.slug}`;
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={module.id}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <span className={cn(
                  "flex-shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-primary/70"
                )}>
                  {moduleIcons[module.icon]}
                </span>
                <span className="truncate">{module.title[locale]}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
