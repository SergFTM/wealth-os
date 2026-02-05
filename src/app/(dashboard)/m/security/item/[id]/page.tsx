"use client";

import { useApp } from "@/lib/store";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

function SecurityItemContent() {
  const { locale } = useApp();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const type = searchParams.get("type") || "user";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [relatedData, setRelatedData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, [id, type]);

  const loadData = async () => {
    try {
      const collectionMap: Record<string, string> = {
        user: "users",
        role: "roles",
        group: "groups",
        incident: "securityIncidents",
        review: "accessReviews",
        session: "sessions",
      };

      const collection = collectionMap[type] || "users";
      const res = await fetch(`/api/collections/${collection}/${id}`);
      const item = await res.json();
      setData(item);

      // Load related data based on type
      if (type === "user") {
        const [bindingsRes, sessionsRes, mfaRes] = await Promise.all([
          fetch(`/api/collections/roleBindings?userId=${id}`),
          fetch(`/api/collections/sessions?userId=${id}`),
          fetch(`/api/collections/mfaEnrollments?userId=${id}`),
        ]);
        const bindings = await bindingsRes.json();
        const sessions = await sessionsRes.json();
        const mfa = await mfaRes.json();

        // Get role names
        const rolesRes = await fetch("/api/collections/roles");
        const roles = await rolesRes.json();

        setRelatedData({
          bindings: bindings.map((b: any) => ({
            ...b,
            roleName: roles.find((r: any) => r.id === b.roleId)?.name,
          })),
          sessions,
          mfa: mfa[0],
        });
      } else if (type === "incident") {
        const [userRes, sessionRes] = await Promise.all([
          item.userId ? fetch(`/api/collections/users/${item.userId}`) : Promise.resolve(null),
          item.sessionId ? fetch(`/api/collections/sessions/${item.sessionId}`) : Promise.resolve(null),
        ]);
        setRelatedData({
          user: userRes ? await userRes.json() : null,
          session: sessionRes ? await sessionRes.json() : null,
        });
      } else if (type === "review") {
        const attestationsRes = await fetch(`/api/collections/reviewAttestations?reviewId=${id}`);
        const attestations = await attestationsRes.json();
        setRelatedData({ attestations });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-500 dark:text-stone-400">
          {locale === "ru" ? "Запись не найдена" : "Record not found"}
        </p>
        <Link href="/m/security/list" className="text-emerald-600 dark:text-emerald-400 mt-2 inline-block">
          {locale === "ru" ? "← Назад к списку" : "← Back to list"}
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
        <Link href="/m/security" className="hover:text-emerald-600 dark:hover:text-emerald-400">
          {locale === "ru" ? "Безопасность" : "Security"}
        </Link>
        <span>/</span>
        <Link href="/m/security/list" className="hover:text-emerald-600 dark:hover:text-emerald-400">
          {locale === "ru" ? "Список" : "List"}
        </Link>
        <span>/</span>
        <span>{data.name || data.title || data.email || id}</span>
      </div>

      {/* User Detail */}
      {type === "user" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200">{data.name}</h1>
                <p className="text-stone-500 dark:text-stone-400">{data.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      data.status === "active"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    )}
                  >
                    {data.status === "active"
                      ? locale === "ru" ? "Активен" : "Active"
                      : locale === "ru" ? "Приостановлен" : "Suspended"}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      data.mfaEnabled
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    )}
                  >
                    MFA: {data.mfaEnabled ? "✓" : "✗"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary">
                  {locale === "ru" ? "Редактировать" : "Edit"}
                </Button>
                <Button variant="secondary">
                  {data.status === "active"
                    ? locale === "ru" ? "Приостановить" : "Suspend"
                    : locale === "ru" ? "Активировать" : "Activate"}
                </Button>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
              <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-4">
                {locale === "ru" ? "Информация" : "Information"}
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-stone-500 dark:text-stone-400">{locale === "ru" ? "Отдел" : "Department"}</dt>
                  <dd className="text-stone-800 dark:text-stone-200">{data.department || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500 dark:text-stone-400">{locale === "ru" ? "Должность" : "Job Title"}</dt>
                  <dd className="text-stone-800 dark:text-stone-200">{data.jobTitle || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500 dark:text-stone-400">{locale === "ru" ? "Последний вход" : "Last Login"}</dt>
                  <dd className="text-stone-800 dark:text-stone-200">{formatDate(data.lastLoginAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500 dark:text-stone-400">{locale === "ru" ? "Создан" : "Created"}</dt>
                  <dd className="text-stone-800 dark:text-stone-200">{formatDate(data.createdAt)}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
              <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-4">
                {locale === "ru" ? "MFA" : "MFA"}
              </h3>
              {relatedData.mfa ? (
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-stone-500 dark:text-stone-400">{locale === "ru" ? "Метод" : "Method"}</dt>
                    <dd className="text-stone-800 dark:text-stone-200">{relatedData.mfa.method}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500 dark:text-stone-400">{locale === "ru" ? "Статус" : "Status"}</dt>
                    <dd className="text-stone-800 dark:text-stone-200">{relatedData.mfa.status}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500 dark:text-stone-400">{locale === "ru" ? "Зарегистрирован" : "Enrolled"}</dt>
                    <dd className="text-stone-800 dark:text-stone-200">{formatDate(relatedData.mfa.enrolledAt)}</dd>
                  </div>
                </dl>
              ) : (
                <p className="text-stone-500 dark:text-stone-400 text-sm">
                  {locale === "ru" ? "MFA не настроен" : "MFA not configured"}
                </p>
              )}
            </div>
          </div>

          {/* Role Bindings */}
          <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
            <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-4">
              {locale === "ru" ? "Привязки ролей" : "Role Bindings"}
            </h3>
            {relatedData.bindings?.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-700">
                    <th className="text-left py-2 text-stone-500 dark:text-stone-400">{locale === "ru" ? "Роль" : "Role"}</th>
                    <th className="text-left py-2 text-stone-500 dark:text-stone-400">Scope</th>
                    <th className="text-left py-2 text-stone-500 dark:text-stone-400">{locale === "ru" ? "Статус" : "Status"}</th>
                    <th className="text-left py-2 text-stone-500 dark:text-stone-400">{locale === "ru" ? "Создан" : "Created"}</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedData.bindings.map((b: any) => (
                    <tr key={b.id} className="border-b border-stone-100 dark:border-stone-700/50">
                      <td className="py-2 text-stone-800 dark:text-stone-200">{b.roleName}</td>
                      <td className="py-2 text-stone-600 dark:text-stone-400">{b.scopeType}</td>
                      <td className="py-2">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-xs",
                            b.status === "active"
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                              : "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                          )}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-2 text-stone-600 dark:text-stone-400">{formatDate(b.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                {locale === "ru" ? "Нет привязок ролей" : "No role bindings"}
              </p>
            )}
          </div>

          {/* Active Sessions */}
          <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
            <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-4">
              {locale === "ru" ? "Активные сессии" : "Active Sessions"}
            </h3>
            {relatedData.sessions?.filter((s: any) => s.status === "active").length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-700">
                    <th className="text-left py-2 text-stone-500 dark:text-stone-400">{locale === "ru" ? "Устройство" : "Device"}</th>
                    <th className="text-left py-2 text-stone-500 dark:text-stone-400">IP</th>
                    <th className="text-left py-2 text-stone-500 dark:text-stone-400">{locale === "ru" ? "Локация" : "Location"}</th>
                    <th className="text-left py-2 text-stone-500 dark:text-stone-400">{locale === "ru" ? "Последняя активность" : "Last Active"}</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedData.sessions.filter((s: any) => s.status === "active").map((s: any) => (
                    <tr key={s.id} className="border-b border-stone-100 dark:border-stone-700/50">
                      <td className="py-2 text-stone-800 dark:text-stone-200">{s.device}</td>
                      <td className="py-2 font-mono text-stone-600 dark:text-stone-400">{s.ipMasked}</td>
                      <td className="py-2 text-stone-600 dark:text-stone-400">{s.locationText}</td>
                      <td className="py-2 text-stone-600 dark:text-stone-400">{formatDate(s.lastActiveAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                {locale === "ru" ? "Нет активных сессий" : "No active sessions"}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Incident Detail */}
      {type === "incident" && (
        <div className="space-y-6">
          <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200">{data.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      data.severity === "critical" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                      data.severity === "high" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400" :
                      data.severity === "medium" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                      "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                    )}
                  >
                    {data.severity}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      data.status === "open" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                      data.status === "investigating" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    )}
                  >
                    {data.status}
                  </span>
                </div>
              </div>
              {data.status !== "resolved" && data.status !== "dismissed" && (
                <Button>
                  {locale === "ru" ? "Решить" : "Resolve"}
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
              <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-4">
                {locale === "ru" ? "Детали" : "Details"}
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-stone-500 dark:text-stone-400">{locale === "ru" ? "Тип" : "Type"}</dt>
                  <dd className="text-stone-800 dark:text-stone-200">{data.incidentType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500 dark:text-stone-400">{locale === "ru" ? "Пользователь" : "User"}</dt>
                  <dd className="text-stone-800 dark:text-stone-200">{relatedData.user?.name || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500 dark:text-stone-400">{locale === "ru" ? "Создан" : "Created"}</dt>
                  <dd className="text-stone-800 dark:text-stone-200">{formatDate(data.createdAt)}</dd>
                </div>
                {data.resolvedAt && (
                  <div className="flex justify-between">
                    <dt className="text-stone-500 dark:text-stone-400">{locale === "ru" ? "Решён" : "Resolved"}</dt>
                    <dd className="text-stone-800 dark:text-stone-200">{formatDate(data.resolvedAt)}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
              <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-4">
                {locale === "ru" ? "Описание" : "Description"}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">{data.description}</p>
              {data.resolutionNotes && (
                <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
                  <h4 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    {locale === "ru" ? "Заметки по решению" : "Resolution Notes"}
                  </h4>
                  <p className="text-sm text-stone-600 dark:text-stone-400">{data.resolutionNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Detail */}
      {type === "review" && (
        <div className="space-y-6">
          <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200">{data.name}</h1>
                <p className="text-stone-500 dark:text-stone-400 mt-1">{data.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      data.status === "active" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
                      data.status === "closed" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                      "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                    )}
                  >
                    {data.status}
                  </span>
                  <span className="text-sm text-stone-500 dark:text-stone-400">
                    {data.completionPct}% {locale === "ru" ? "завершено" : "complete"}
                  </span>
                </div>
              </div>
              {data.status === "draft" && (
                <Button>{locale === "ru" ? "Начать" : "Start"}</Button>
              )}
              {data.status === "active" && (
                <Button>{locale === "ru" ? "Закрыть" : "Close"}</Button>
              )}
            </div>
          </div>

          <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm rounded-xl border border-stone-200/50 dark:border-stone-700/50 p-6">
            <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-4">
              {locale === "ru" ? "Аттестации" : "Attestations"}
            </h3>
            {relatedData.attestations?.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-700">
                    <th className="text-left py-2 text-stone-500 dark:text-stone-400">User</th>
                    <th className="text-left py-2 text-stone-500 dark:text-stone-400">{locale === "ru" ? "Решение" : "Decision"}</th>
                    <th className="text-left py-2 text-stone-500 dark:text-stone-400">{locale === "ru" ? "Комментарий" : "Comment"}</th>
                    <th className="text-left py-2 text-stone-500 dark:text-stone-400">{locale === "ru" ? "Дата" : "Date"}</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedData.attestations.map((a: any) => (
                    <tr key={a.id} className="border-b border-stone-100 dark:border-stone-700/50">
                      <td className="py-2 text-stone-800 dark:text-stone-200">{a.userId}</td>
                      <td className="py-2">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-xs",
                            a.decision === "keep" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                            a.decision === "revoke" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                            a.decision === "modify" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                            "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                          )}
                        >
                          {a.decision}
                        </span>
                      </td>
                      <td className="py-2 text-stone-600 dark:text-stone-400 max-w-xs truncate">{a.comment || "—"}</td>
                      <td className="py-2 text-stone-600 dark:text-stone-400">{formatDate(a.decidedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                {locale === "ru" ? "Нет аттестаций" : "No attestations"}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SecurityItemPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    }>
      <SecurityItemContent />
    </Suspense>
  );
}
