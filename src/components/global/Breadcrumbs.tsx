"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import { getModuleBySlug } from "@/modules";

export function Breadcrumbs() {
  const pathname = usePathname();
  const { locale } = useApp();

  const segments = pathname.split("/").filter(Boolean);

  const crumbs: { label: string; href: string }[] = [];

  // Build breadcrumbs from path
  let currentPath = "";
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    if (segment === "m") continue;

    let label = segment;

    // Check if it's a module slug
    const module = getModuleBySlug(segment);
    if (module) {
      label = module.title[locale] || module.title.en;
    } else if (segment === "list") {
      label = locale === "ru" ? "Список" : "List";
    } else if (segment === "item") {
      label = locale === "ru" ? "Детали" : "Details";
    } else if (segments[i - 1] === "item") {
      // This is the ID, show as-is or fetch title
      label = `#${segment.slice(0, 8)}`;
    }

    crumbs.push({ label, href: currentPath });
  }

  if (crumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-stone-500 mb-4" aria-label="Breadcrumb">
      <Link href="/m/dashboard-home" className="hover:text-stone-700 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </Link>
      {crumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          <svg className="w-4 h-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {index === crumbs.length - 1 ? (
            <span className="text-stone-800 font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-stone-700 transition-colors">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
