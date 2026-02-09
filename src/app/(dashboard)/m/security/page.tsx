"use client";

import { useApp } from "@/lib/store";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ScKpiStrip } from "@/modules/21-security/ui/ScKpiStrip";
import { ScUsersTable } from "@/modules/21-security/ui/ScUsersTable";
import { ScIncidentsTable } from "@/modules/21-security/ui/ScIncidentsTable";
import { ScSessionsTable } from "@/modules/21-security/ui/ScSessionsTable";
import { ScActionsBar } from "@/modules/21-security/ui/ScActionsBar";
import { ScRoleBindingDrawer } from "@/modules/21-security/ui/ScRoleBindingDrawer";

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

export default function SecurityDashboardPage() {
  const { locale } = useApp();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<KpiData>({
    activeUsers: 0,
    noMfa: 0,
    activeSessions: 0,
    suspiciousSessions: 0,
    openIncidents: 0,
    reviewsDue: 0,
    policyViolations: 0,
    auditEvents24h: 0,
  });
  const [bindingDrawerOpen, setBindingDrawerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, incidentsRes, sessionsRes, rolesRes, mfaRes, reviewsRes] = await Promise.all([
        fetch("/api/collections/users"),
        fetch("/api/collections/securityIncidents"),
        fetch("/api/collections/sessions"),
        fetch("/api/collections/roles"),
        fetch("/api/collections/mfaEnrollments"),
        fetch("/api/collections/accessReviews"),
      ]);

      const usersRaw = await usersRes.json();
      const incidentsRaw = await incidentsRes.json();
      const sessionsRaw = await sessionsRes.json();
      const rolesRaw = await rolesRes.json();
      const mfaRaw = await mfaRes.json();
      const reviewsRaw = await reviewsRes.json();

      const usersData = usersRaw.items ?? usersRaw ?? [];
      const incidentsData = incidentsRaw.items ?? incidentsRaw ?? [];
      const sessionsData = sessionsRaw.items ?? sessionsRaw ?? [];
      const rolesData = rolesRaw.items ?? rolesRaw ?? [];
      const mfaData = mfaRaw.items ?? mfaRaw ?? [];
      const reviewsData = reviewsRaw.items ?? reviewsRaw ?? [];

      setUsers(usersData);
      setIncidents(incidentsData);
      setSessions(sessionsData);
      setRoles(rolesData);

      // Calculate KPIs
      const activeUsers = usersData.filter((u: any) => u.status === "active").length;
      const noMfa = mfaData.filter((m: any) => m.status !== "enrolled").length;
      const activeSessions = sessionsData.filter((s: any) => s.status === "active").length;
      const suspiciousSessions = sessionsData.filter((s: any) => s.suspicious).length;
      const openIncidents = incidentsData.filter((i: any) => i.status === "open" || i.status === "investigating").length;
      const policyViolations = incidentsData.filter((i: any) => i.incidentType === "policy_violation" && i.status !== "resolved").length;

      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const reviewsDue = reviewsData.filter((r: any) =>
        r.status === "active" && new Date(r.dueAt) <= thirtyDaysFromNow
      ).length;

      setKpiData({
        activeUsers,
        noMfa,
        activeSessions,
        suspiciousSessions,
        openIncidents,
        reviewsDue,
        policyViolations,
        auditEvents24h: 47, // Mock
      });
    } catch (error) {
      console.error("Error loading security data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBindRole = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUserId(userId);
    setSelectedUserName(user?.name || "");
    setBindingDrawerOpen(true);
  };

  const handleSaveBinding = async (roleId: string, scopeType: string, scopeId?: string) => {
    try {
      await fetch("/api/collections/roleBindings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          roleId,
          scopeType,
          scopeId,
          status: "active",
        }),
      });
      loadData();
    } catch (error) {
      console.error("Error creating role binding:", error);
    }
  };

  const handleGenerateIncidents = async () => {
    // Demo incident generator
    const incidentTypes = [
      { type: "suspicious_login", severity: "high", title: "New device login detected" },
      { type: "suspicious_login", severity: "medium", title: "Unusual login location" },
      { type: "suspicious_login", severity: "high", title: "Login from VPN detected" },
      { type: "policy_violation", severity: "high", title: "Mass data export attempt" },
      { type: "policy_violation", severity: "medium", title: "After-hours access" },
      { type: "role_change", severity: "low", title: "Role binding modified" },
      { type: "role_change", severity: "medium", title: "Admin role assigned" },
      { type: "mfa_bypass", severity: "medium", title: "MFA not verified" },
      { type: "mfa_bypass", severity: "high", title: "MFA disabled by user" },
      { type: "mfa_bypass", severity: "low", title: "Client login without MFA" },
    ];

    for (const inc of incidentTypes) {
      await fetch("/api/collections/securityIncidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentType: inc.type,
          severity: inc.severity,
          status: "open",
          title: inc.title,
          description: `Demo incident generated: ${inc.title}`,
          userId: users[Math.floor(Math.random() * users.length)]?.id,
        }),
      });
    }
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  // Enrich data with names
  const enrichedSessions = sessions.map((s) => ({
    ...s,
    userName: users.find((u) => u.id === s.userId)?.name,
  }));

  const enrichedIncidents = incidents.map((i) => ({
    ...i,
    userName: users.find((u) => u.id === i.userId)?.name,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200">
            {locale === "ru" ? "Центр безопасности" : "Security Center"}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            {locale === "ru" ? "IAM, RBAC, MFA, инциденты, аудит" : "IAM, RBAC, MFA, incidents, audit"}
          </p>
        </div>
        <Link
          href="/m/security/list"
          className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
        >
          {locale === "ru" ? "Все записи →" : "All records →"}
        </Link>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            {locale === "ru"
              ? "В MVP безопасность демонстрационная. Для production требуется настройка инфраструктуры и внешних провайдеров."
              : "Security in MVP is demonstrative. Production requires infrastructure setup and external providers."}
          </p>
        </div>
      </div>

      {/* KPI Strip */}
      <ScKpiStrip data={kpiData} />

      {/* Actions Bar */}
      <ScActionsBar
        onCreateUser={() => {}}
        onCreateRole={() => {}}
        onBindRole={() => setBindingDrawerOpen(true)}
        onStartReview={() => {}}
        onGenerateIncidents={handleGenerateIncidents}
        onExportAudit={() => {}}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-800 dark:text-stone-200">
              {locale === "ru" ? "Пользователи" : "Users"}
            </h2>
            <Link href="/m/security/list?tab=users" className="text-sm text-emerald-600 dark:text-emerald-400">
              {locale === "ru" ? "Все →" : "All →"}
            </Link>
          </div>
          <ScUsersTable users={users} mini onBindRole={handleBindRole} />
        </div>

        {/* Incidents */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-800 dark:text-stone-200">
              {locale === "ru" ? "Инциденты" : "Incidents"}
            </h2>
            <Link href="/m/security/list?tab=incidents" className="text-sm text-emerald-600 dark:text-emerald-400">
              {locale === "ru" ? "Все →" : "All →"}
            </Link>
          </div>
          <ScIncidentsTable incidents={enrichedIncidents} mini />
        </div>
      </div>

      {/* Sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-800 dark:text-stone-200">
            {locale === "ru" ? "Активные сессии" : "Active Sessions"}
          </h2>
          <Link href="/m/security/list?tab=sessions" className="text-sm text-emerald-600 dark:text-emerald-400">
            {locale === "ru" ? "Все →" : "All →"}
          </Link>
        </div>
        <ScSessionsTable sessions={enrichedSessions.filter((s) => s.status === "active")} mini />
      </div>

      {/* Role Binding Drawer */}
      <ScRoleBindingDrawer
        open={bindingDrawerOpen}
        onClose={() => setBindingDrawerOpen(false)}
        userId={selectedUserId || undefined}
        userName={selectedUserName}
        roles={roles}
        onSave={handleSaveBinding}
      />
    </div>
  );
}
