"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";

interface KpiData {
  activeUsers: number;
  noMfa: number;
  activeSessions: number;
  suspiciousSessions: number;
  openIncidents: number;
  reviewsDue: number;
  policyViolations: number;
  auditEvents24h: number;
}

interface ScKpiStripProps {
  data: KpiData;
}

export function ScKpiStrip({ data }: ScKpiStripProps) {
  const { locale } = useApp();

  const kpis = [
    {
      key: "activeUsers",
      value: data.activeUsers,
      label: locale === "ru" ? "Активных пользователей" : "Active Users",
      href: "/m/security/list?tab=users&status=active",
      color: "emerald",
    },
    {
      key: "noMfa",
      value: data.noMfa,
      label: locale === "ru" ? "Без MFA" : "Without MFA",
      href: "/m/security/list?tab=users&filter=no_mfa",
      color: data.noMfa > 0 ? "amber" : "emerald",
    },
    {
      key: "activeSessions",
      value: data.activeSessions,
      label: locale === "ru" ? "Активных сессий" : "Active Sessions",
      href: "/m/security/list?tab=sessions&status=active",
      color: "blue",
    },
    {
      key: "suspiciousSessions",
      value: data.suspiciousSessions,
      label: locale === "ru" ? "Подозрительных 7д" : "Suspicious 7d",
      href: "/m/security/list?tab=incidents&filter=suspicious&period=7d",
      color: data.suspiciousSessions > 0 ? "red" : "emerald",
    },
    {
      key: "openIncidents",
      value: data.openIncidents,
      label: locale === "ru" ? "Открытых инцидентов" : "Open Incidents",
      href: "/m/security/list?tab=incidents&status=open",
      color: data.openIncidents > 0 ? "red" : "emerald",
    },
    {
      key: "reviewsDue",
      value: data.reviewsDue,
      label: locale === "ru" ? "Ревью через 30д" : "Reviews Due 30d",
      href: "/m/security/list?tab=reviews&filter=due&period=30d",
      color: data.reviewsDue > 0 ? "amber" : "emerald",
    },
    {
      key: "policyViolations",
      value: data.policyViolations,
      label: locale === "ru" ? "Нарушений политик" : "Policy Violations",
      href: "/m/security/list?tab=incidents&filter=policy_violation",
      color: data.policyViolations > 0 ? "red" : "emerald",
    },
    {
      key: "auditEvents24h",
      value: data.auditEvents24h,
      label: locale === "ru" ? "Событий аудита 24ч" : "Audit Events 24h",
      href: "/m/security/list?tab=audit&period=24h",
      color: "stone",
    },
  ];

  const colorClasses: Record<string, string> = {
    emerald: "from-emerald-500 to-emerald-600 text-white",
    amber: "from-amber-500 to-amber-600 text-white",
    red: "from-red-500 to-red-600 text-white",
    blue: "from-blue-500 to-blue-600 text-white",
    stone: "from-stone-500 to-stone-600 text-white",
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => (
        <Link
          key={kpi.key}
          href={kpi.href}
          className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[kpi.color]} shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]`}
        >
          <div className="text-2xl font-bold">{kpi.value}</div>
          <div className="text-xs opacity-90 mt-1">{kpi.label}</div>
        </Link>
      ))}
    </div>
  );
}
