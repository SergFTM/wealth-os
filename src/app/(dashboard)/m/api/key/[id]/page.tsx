'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ApiKeyDetail } from '@/modules/24-api/ui/ApiKeyDetail';

export default function ApiKeyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [apiKey, setApiKey] = useState<any>(null);
  const [scopes, setScopes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSecretModal, setShowSecretModal] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/api/keys/${id}`);
      const data = await res.json();
      setApiKey(data.apiKey);
      setScopes(data.scopes || []);
    } catch (error) {
      console.error('Error loading key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRotate = async () => {
    if (!confirm('Ротировать ключ? Старый ключ истечет через 24 часа.')) return;

    try {
      const res = await fetch(`/api/api/keys/${id}/rotate`, { method: 'POST' });
      const data = await res.json();
      if (data.secret) {
        setShowSecretModal(data.secret);
        // Navigate to new key
        router.push(`/m/api/key/${data.id}`);
      }
    } catch (error) {
      console.error('Error rotating key:', error);
    }
  };

  const handleRevoke = async () => {
    if (!confirm('Отозвать ключ? Это действие необратимо.')) return;

    try {
      await fetch(`/api/api/keys/${id}`, { method: 'DELETE' });
      router.push('/m/api/list?tab=keys');
    } catch (error) {
      console.error('Error revoking key:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Ключ не найден</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <a href="/m/api" className="hover:text-emerald-600">API и Webhooks</a>
        <span>/</span>
        <a href="/m/api/list?tab=keys" className="hover:text-emerald-600">Ключи</a>
        <span>/</span>
        <span className="text-gray-900">{apiKey.name}</span>
      </nav>

      {/* Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
        <ApiKeyDetail
          apiKey={apiKey}
          scopes={scopes}
          onRotate={handleRotate}
          onRevoke={handleRevoke}
        />
      </div>

      {/* Secret Modal */}
      {showSecretModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ключ ротирован</h3>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <p className="text-sm text-amber-800 mb-2">
                <strong>Важно:</strong> Сохраните новый ключ сейчас. Он больше не будет показан.
              </p>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg">
              <code className="text-sm text-emerald-400 font-mono break-all">{showSecretModal}</code>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(showSecretModal)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Копировать
              </button>
              <button
                onClick={() => setShowSecretModal(null)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
