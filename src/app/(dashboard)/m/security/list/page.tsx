"use client";

import { useApp } from "@/lib/store";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScUsersTable } from "@/modules/21-security/ui/ScUsersTable";
import { ScRolesTable } from "@/modules/21-security/ui/ScRolesTable";
import { ScGroupsTable } from "@/modules/21-security/ui/ScGroupsTable";
import { ScPermissionsMatrix } from "@/modules/21-security/ui/ScPermissionsMatrix";
import { ScSessionsTable } from "@/modules/21-security/ui/ScSessionsTable";
import { ScAccessReviewsTable } from "@/modules/21-security/ui/ScAccessReviewsTable";
import { ScIncidentsTable } from "@/modules/21-security/ui/ScIncidentsTable";
import { ScAuditLogTable } from "@/modules/21-security/ui/ScAuditLogTable";
import { ScSettingsPanel } from "@/modules/21-security/ui/ScSettingsPanel";

function SecurityListContent() {
  const { locale } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "users";

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const tabs = [
    { key: "users", label: { ru: "Пользователи", en: "Users" } },
    { key: "roles", label: { ru: "Роли", en: "Roles" } },
    { key: "groups", label: { ru: "Группы", en: "Groups" } },
    { key: "permissions", label: { ru: "Разрешения", en: "Permissions" } },
    { key: "sessions", label: { ru: "Сессии", en: "Sessions" } },
    { key: "reviews", label: { ru: "Access Reviews", en: "Access Reviews" } },
    { key: "incidents", label: { ru: "Инциденты", en: "Incidents" } },
    { key: "audit", label: { ru: "Аудит", en: "Audit" } },
    { key: "settings", label: { ru: "Настройки", en: "Settings" } },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const endpoints = [
        "/api/collections/users",
        "/api/collections/roles",
        "/api/collections/groups",
        "/api/collections/permissions",
        "/api/collections/sessions",
        "/api/collections/accessReviews",
        "/api/collections/securityIncidents",
        "/api/collections/auditEvents",
        "/api/collections/securitySettings",
      ];

      const responses = await Promise.all(endpoints.map((e) => fetch(e)));
      const data = await Promise.all(responses.map((r) => r.json()));

      setUsers(data[0]);
      setRoles(data[1]);
      setGroups(data[2]);
      setPermissions(data[3]);
      setSessions(data[4]);
      setReviews(data[5]);
      setIncidents(data[6]);
      setAuditEvents(data[7]);
      setSettings(data[8]?.[0] || null);

      if (data[1]?.length > 0 && !selectedRoleId) {
        setSelectedRoleId(data[1][0].id);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const setTab = (tab: string) => {
    router.push(`/m/security/list?tab=${tab}`);
  };

  const handleSaveSettings = async (newSettings: any) => {
    try {
      if (settings?.id) {
        await fetch(`/api/collections/securitySettings/${settings.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSettings),
        });
      }
      loadData();
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  // Enrich data
  const enrichedSessions = sessions.map((s) => ({
    ...s,
    userName: users.find((u) => u.id === s.userId)?.name,
  }));

  const enrichedIncidents = incidents.map((i) => ({
    ...i,
    userName: users.find((u) => u.id === i.userId)?.name,
  }));

  const enrichedGroups = groups.map((g) => ({
    ...g,
    defaultRoleName: roles.find((r) => r.id === g.defaultRoleId)?.name,
  }));

  const rolesWithCounts = roles.map((r) => ({
    ...r,
    permissionsCount: permissions.filter((p) => p.roleId === r.id).length,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 mb-1">
            <Link href="/m/security" className="hover:text-emerald-600 dark:hover:text-emerald-400">
              {locale === "ru" ? "Безопасность" : "Security"}
            </Link>
            <span>/</span>
            <span>{locale === "ru" ? "Список" : "List"}</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200">
            {tabs.find((t) => t.key === activeTab)?.label[locale === "ru" ? "ru" : "en"]}
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap",
              activeTab === tab.key
                ? "bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 shadow-sm"
                : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            )}
          >
            {tab.label[locale === "ru" ? "ru" : "en"]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "users" && <ScUsersTable users={users} />}

      {activeTab === "roles" && <ScRolesTable roles={rolesWithCounts} />}

      {activeTab === "groups" && <ScGroupsTable groups={enrichedGroups} />}

      {activeTab === "permissions" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
              {locale === "ru" ? "Выберите роль:" : "Select role:"}
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <ScPermissionsMatrix
            permissions={permissions}
            roleId={selectedRoleId}
            readOnly
          />
        </div>
      )}

      {activeTab === "sessions" && <ScSessionsTable sessions={enrichedSessions} />}

      {activeTab === "reviews" && <ScAccessReviewsTable reviews={reviews} />}

      {activeTab === "incidents" && <ScIncidentsTable incidents={enrichedIncidents} />}

      {activeTab === "audit" && <ScAuditLogTable events={auditEvents} />}

      {activeTab === "settings" && settings && (
        <ScSettingsPanel settings={settings} onSave={handleSaveSettings} />
      )}
    </div>
  );
}

export default function SecurityListPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    }>
      <SecurityListContent />
    </Suspense>
  );
}
