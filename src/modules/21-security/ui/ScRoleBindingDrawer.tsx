"use client";

import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { useState } from "react";

interface Role {
  id: string;
  name: string;
  color?: string;
}

interface ScRoleBindingDrawerProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
  userName?: string;
  roles: Role[];
  onSave: (roleId: string, scopeType: string, scopeId?: string) => void;
}

export function ScRoleBindingDrawer({
  open,
  onClose,
  userId,
  userName,
  roles,
  onSave,
}: ScRoleBindingDrawerProps) {
  const { locale } = useApp();
  const [selectedRole, setSelectedRole] = useState("");
  const [scopeType, setScopeType] = useState("global");
  const [scopeId, setScopeId] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      await onSave(selectedRole, scopeType, scopeId || undefined);
      onClose();
      setSelectedRole("");
      setScopeType("global");
      setScopeId("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={locale === "ru" ? "Привязать роль" : "Bind Role"}
      width="w-[400px]"
    >
      <div className="space-y-6">
        {userName && (
          <div className="bg-stone-50 dark:bg-stone-900/50 rounded-lg p-4">
            <div className="text-sm text-stone-500 dark:text-stone-400">
              {locale === "ru" ? "Пользователь" : "User"}
            </div>
            <div className="font-medium text-stone-800 dark:text-stone-200">{userName}</div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            {locale === "ru" ? "Роль" : "Role"}
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="">{locale === "ru" ? "Выберите роль" : "Select role"}</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            {locale === "ru" ? "Scope" : "Scope"}
          </label>
          <select
            value={scopeType}
            onChange={(e) => setScopeType(e.target.value)}
            className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="global">{locale === "ru" ? "Глобальный" : "Global"}</option>
            <option value="household">{locale === "ru" ? "Домохозяйство" : "Household"}</option>
            <option value="entity">{locale === "ru" ? "Сущность" : "Entity"}</option>
            <option value="portfolio">{locale === "ru" ? "Портфель" : "Portfolio"}</option>
          </select>
        </div>

        {scopeType !== "global" && (
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              {locale === "ru" ? "ID Scope" : "Scope ID"}
            </label>
            <input
              type="text"
              value={scopeId}
              onChange={(e) => setScopeId(e.target.value)}
              placeholder={locale === "ru" ? "ID объекта" : "Object ID"}
              className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            {locale === "ru" ? "Отмена" : "Cancel"}
          </Button>
          <Button onClick={handleSave} disabled={!selectedRole || saving} className="flex-1">
            {saving
              ? locale === "ru" ? "Сохранение..." : "Saving..."
              : locale === "ru" ? "Привязать" : "Bind"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
