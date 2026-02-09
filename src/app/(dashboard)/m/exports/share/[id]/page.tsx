'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExShareDetail } from '@/modules/37-exports/ui/ExShareDetail';
import { checkAccess } from '@/modules/37-exports/engine/shareEngine';

interface ExportShare {
  id: string;
  name: string;
  packId: string;
  packName?: string;
  audienceType: 'advisor' | 'auditor' | 'client' | 'bank' | 'regulator';
  audienceName?: string;
  audienceEmail?: string;
  status: 'active' | 'expired' | 'revoked';
  clientSafe: boolean;
  accessToken: string;
  expiresAt: string;
  maxDownloads?: number;
  downloadCount: number;
  lastAccessAt?: string;
  password?: boolean;
  ipWhitelist?: string[];
  createdByUserId?: string;
  createdAt: string;
  revokedAt?: string;
  revokeReason?: string;
}

interface ExportFile {
  id: string;
  fileName: string;
  format: 'csv' | 'pdf';
  sizeBytes: number;
  rowCount?: number;
  createdAt: string;
}

export default function ShareDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isPublicView = !!token;

  const [share, setShare] = useState<ExportShare | null>(null);
  const [files, setFiles] = useState<ExportFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Load share
      const shareRes = await fetch(`/api/collections/exportShares/${resolvedParams.id}`);
      if (shareRes.ok) {
        const shareData = await shareRes.json();

        // Get pack name
        if (shareData.packId) {
          const packRes = await fetch(`/api/collections/exportPacks/${shareData.packId}`);
          if (packRes.ok) {
            const packData = await packRes.json();
            shareData.packName = packData.name;
          }
        }

        // Check access if public view
        if (isPublicView) {
          const accessResult = checkAccess(
            {
              status: shareData.status,
              expiresAt: shareData.expiresAt,
              maxDownloads: shareData.maxDownloads,
              downloadCount: shareData.downloadCount,
              password: shareData.password,
              ipWhitelist: shareData.ipWhitelist,
              accessToken: shareData.accessToken,
            },
            { token: token || '' }
          );

          if (!accessResult.allowed) {
            setAccessDenied(true);
            return;
          }

          // Update last access
          await fetch(`/api/collections/exportShares/${resolvedParams.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lastAccessAt: new Date().toISOString() }),
          });
        }

        setShare(shareData);

        // Load files for the pack
        const filesRes = await fetch('/api/collections/exportFiles');
        if (filesRes.ok) {
          const filesRaw = await filesRes.json();
          const allFiles = filesRaw.items ?? filesRaw ?? [];
          setFiles(allFiles.filter((f: { packId: string }) => f.packId === shareData.packId).slice(0, 10));
        }
      } else {
        setAccessDenied(true);
      }
    } catch (err) {
      console.error('Failed to load share:', err);
      setAccessDenied(true);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id, isPublicView, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRevoke = async () => {
    if (!share) return;
    if (!confirm('Отозвать этот share? Доступ по ссылке будет закрыт.')) return;

    try {
      await fetch(`/api/collections/exportShares/${share.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'revoked',
          revokedAt: new Date().toISOString(),
          revokeReason: 'Manually revoked by user',
        }),
      });

      await fetch('/api/collections/auditEvents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `audit-${Date.now()}`,
          module: 'exports',
          action: 'share_revoked',
          entityType: 'exportShare',
          entityId: share.id,
          createdAt: new Date().toISOString(),
        }),
      });

      await loadData();
    } catch (err) {
      console.error('Failed to revoke share:', err);
    }
  };

  const handleCopyLink = () => {
    if (share) {
      const shareUrl = `${window.location.origin}/m/exports/share/${share.id}?token=${share.accessToken}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  const handleDownloadFile = async (fileId: string) => {
    if (!share) return;

    const file = files.find(f => f.id === fileId);
    if (!file) return;

    try {
      // Update download count
      await fetch(`/api/collections/exportShares/${share.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          downloadCount: share.downloadCount + 1,
          lastAccessAt: new Date().toISOString(),
        }),
      });

      await fetch('/api/collections/auditEvents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `audit-${Date.now()}`,
          module: 'exports',
          action: 'file_downloaded',
          entityType: 'exportFile',
          entityId: fileId,
          details: { shareId: share.id },
          createdAt: new Date().toISOString(),
        }),
      });

      // In a real app, this would trigger actual file download
      alert(`Скачивание файла: ${file.fileName}`);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-xl mb-2">Доступ запрещён</div>
        <p className="text-gray-500">
          Share не найден, истёк или был отозван.
        </p>
        {!isPublicView && (
          <button
            onClick={() => router.push('/m/exports/list?tab=shares')}
            className="mt-4 text-emerald-600 hover:text-emerald-700"
          >
            Вернуться к списку
          </button>
        )}
      </div>
    );
  }

  if (!share) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Share не найден</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ExShareDetail
        share={share}
        files={files}
        onRevoke={handleRevoke}
        onCopyLink={handleCopyLink}
        onDownloadFile={handleDownloadFile}
        isPublicView={isPublicView}
      />
    </div>
  );
}
