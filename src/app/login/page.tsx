"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { UserRole } from "@/lib/data";
import { useState } from "react";
import { Locale } from "@/lib/i18n";

const roles: { key: UserRole; label: Record<Locale, string>; description: Record<Locale, string> }[] = [
  { 
    key: 'admin', 
    label: { ru: 'Администратор', en: 'Administrator', uk: 'Адміністратор' },
    description: { ru: 'Полный доступ ко всем модулям', en: 'Full access to all modules', uk: 'Повний доступ до всіх модулів' }
  },
  { 
    key: 'cio', 
    label: { ru: 'CIO', en: 'CIO', uk: 'CIO' },
    description: { ru: 'Инвестиции и портфели', en: 'Investments and portfolios', uk: 'Інвестиції та портфелі' }
  },
  { 
    key: 'cfo', 
    label: { ru: 'CFO', en: 'CFO', uk: 'CFO' },
    description: { ru: 'Финансы и биллинг', en: 'Finance and billing', uk: 'Фінанси та білінг' }
  },
  { 
    key: 'operations', 
    label: { ru: 'Operations', en: 'Operations', uk: 'Operations' },
    description: { ru: 'Операции и workflow', en: 'Operations and workflow', uk: 'Операції та workflow' }
  },
  { 
    key: 'compliance', 
    label: { ru: 'Compliance', en: 'Compliance', uk: 'Compliance' },
    description: { ru: 'Риски и соответствие', en: 'Risk and compliance', uk: 'Ризики та відповідність' }
  },
  { 
    key: 'rm', 
    label: { ru: 'Relationship Manager', en: 'Relationship Manager', uk: 'Relationship Manager' },
    description: { ru: 'Клиентские отношения', en: 'Client relationships', uk: 'Клієнтські відносини' }
  },
  { 
    key: 'advisor', 
    label: { ru: 'Advisor', en: 'Advisor', uk: 'Advisor' },
    description: { ru: 'Консультирование клиентов', en: 'Client advisory', uk: 'Консультування клієнтів' }
  },
  { 
    key: 'client', 
    label: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' },
    description: { ru: 'Просмотр своих данных', en: 'View own data', uk: 'Перегляд своїх даних' }
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, locale, setLocale } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const handleLogin = () => {
    login(selectedRole);
    router.push("/m/dashboard-home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/20 to-amber-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
            <span className="text-white font-bold text-2xl">W</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-800">Wealth OS</h1>
          <p className="text-stone-500 mt-1">
            {locale === 'ru' ? 'Платформа управления состоянием' : locale === 'en' ? 'Wealth Management Platform' : 'Платформа управління статками'}
          </p>
        </div>

        {/* Language Switcher */}
        <div className="flex justify-center gap-2 mb-6">
          {(['ru', 'en', 'uk'] as Locale[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLocale(lang)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                locale === lang 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Role Selection */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-stone-200/50 shadow-xl p-6">
          <h2 className="text-sm font-medium text-stone-600 uppercase tracking-wide mb-4">
            {locale === 'ru' ? 'Выберите роль' : locale === 'en' ? 'Select Role' : 'Оберіть роль'}
          </h2>
          
          <div className="space-y-2 max-h-[320px] overflow-y-auto">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => setSelectedRole(role.key)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedRole === role.key
                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-amber-50 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="font-medium text-stone-800">{role.label[locale]}</div>
                <div className="text-sm text-stone-500 mt-0.5">{role.description[locale]}</div>
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            className="w-full mt-6"
            onClick={handleLogin}
          >
            {locale === 'ru' ? 'Войти' : locale === 'en' ? 'Login' : 'Увійти'}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-stone-400 mt-6">
          MVP Demo — {locale === 'ru' ? 'Только для демонстрации' : locale === 'en' ? 'Demo purposes only' : 'Тільки для демонстрації'}
        </p>
      </div>
    </div>
  );
}
