"use client";

import { use, useState, useEffect } from "react";

interface PackItem {
  id: string;
  title: string;
  itemTypeKey: string;
  clientSafe: boolean;
}

interface PackData {
  name: string;
  recipientOrg: string;
  purpose: string;
  period: string;
  coverLetterMd?: string;
  items: PackItem[];
  watermarkEnabled: boolean;
  watermarkText?: string;
  allowDownload: boolean;
  expiresAt: string;
}

export default function PublicPackViewerPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [password, setPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packData, setPackData] = useState<PackData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate token and fetch pack data
    validateAndFetch();
  }, [token]);

  const validateAndFetch = async (pwd?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/public/pack/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });

      if (response.status === 401) {
        // Password required
        setShowPasswordForm(true);
        setLoading(false);
        return;
      }

      if (response.status === 403) {
        setError("Ссылка недействительна или отозвана");
        setLoading(false);
        return;
      }

      if (response.status === 410) {
        setError("Срок действия ссылки истёк");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError("Ошибка загрузки пакета");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setPackData(data);
      setShowPasswordForm(false);
    } catch (err) {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndFetch(password);
  };

  const handleDownload = async (itemId: string) => {
    // Log download event
    await fetch(`/api/public/pack/${token}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });

    // In production, would trigger actual file download
    console.log("Download item:", itemId);
  };

  const handleDownloadAll = async () => {
    await fetch(`/api/public/pack/${token}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });

    console.log("Download all items");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (showPasswordForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-stone-800">Защищённый пакет</h1>
            <p className="text-stone-500 mt-2">Введите пароль для доступа</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Открыть
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-stone-800">Доступ недоступен</h1>
          <p className="text-stone-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!packData) {
    return null;
  }

  const daysLeft = Math.ceil(
    (new Date(packData.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      {/* Watermark Overlay */}
      {packData.watermarkEnabled && (
        <div
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          style={{ opacity: 0.1 }}
        >
          <div className="transform -rotate-45 text-4xl font-bold text-stone-500 whitespace-nowrap">
            {packData.watermarkText || "CONFIDENTIAL"}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-stone-800">{packData.name}</h1>
              <p className="text-sm text-stone-500">
                Для: {packData.recipientOrg} • {packData.period}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {daysLeft > 0 && (
                <span className="text-sm text-stone-500">
                  Действует ещё {daysLeft} дн.
                </span>
              )}
              {packData.allowDownload && (
                <button
                  onClick={handleDownloadAll}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Скачать всё
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Cover Letter */}
        {packData.coverLetterMd && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Сопроводительное письмо</h2>
            <div className="prose prose-stone prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-stone-700 font-sans">
                {packData.coverLetterMd}
              </pre>
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200">
            <h2 className="text-lg font-semibold text-stone-800">
              Документы ({packData.items.length})
            </h2>
          </div>
          <div className="divide-y divide-stone-100">
            {packData.items.map((item) => (
              <div
                key={item.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {item.itemTypeKey === "document"
                      ? "📄"
                      : item.itemTypeKey === "export"
                      ? "📊"
                      : item.itemTypeKey === "snapshot"
                      ? "📸"
                      : "📎"}
                  </span>
                  <span className="font-medium text-stone-800">{item.title}</span>
                </div>
                {packData.allowDownload && (
                  <button
                    onClick={() => handleDownload(item.id)}
                    className="px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    Скачать
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <div className="font-medium text-amber-800">Конфиденциально</div>
              <p className="text-sm text-amber-700 mt-1">
                Данные материалы являются конфиденциальными и предназначены исключительно для указанного получателя.
                Передача третьим лицам запрещена.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-stone-500">
        Wealth OS • Secure Document Sharing
      </footer>
    </div>
  );
}
