"use client";

import { PaKpiStrip, calculatePacksKpis } from './PaKpiStrip';
import { PaActionsBar } from './PaActionsBar';
import { PaPacksPreview } from './PaPacksTable';
import { PaSharesPreview } from './PaSharesTable';
import { PaAiPanel } from './PaAiPanel';

interface Pack {
  id: string;
  name: string;
  recipientJson: { type: string; org: string };
  purpose: string;
  periodJson: { start: string; end: string; label?: string };
  scopeJson: { scopeType: string; scopeName?: string };
  statusKey: string;
  clientSafe: boolean;
  itemsCount?: number;
  createdAt: string;
}

interface Share {
  id: string;
  packId: string;
  packName?: string;
  tokenPreview?: string;
  statusKey: string;
  expiresAt: string;
  allowDownload: boolean;
  maxDownloads?: number;
  downloadCount: number;
  viewCount?: number;
  watermarkEnabled?: boolean;
  passwordHash?: string;
  createdAt: string;
  revokedAt?: string;
}

interface Approval {
  id: string;
  statusKey: string;
}

interface Download {
  id: string;
  at: string;
}

interface PaDashboardPageProps {
  packs: Pack[];
  shares: Share[];
  approvals: Approval[];
  downloads: Download[];
  onCreatePack: () => void;
  onCreateTemplate: () => void;
  onQuickPack: () => void;
  onViewAllPacks: () => void;
  onViewAllShares: () => void;
  onOpenPack: (id: string) => void;
}

export function PaDashboardPage({
  packs,
  shares,
  approvals,
  downloads,
  onCreatePack,
  onCreateTemplate,
  onQuickPack,
  onViewAllPacks,
  onViewAllShares,
  onOpenPack,
}: PaDashboardPageProps) {
  const kpis = calculatePacksKpis({ packs, approvals, shares, downloads });

  // Prepare shares with pack names
  const sharesWithNames = shares.map(share => ({
    ...share,
    packName: packs.find(p => p.id === share.packId)?.name,
  }));

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-sm text-amber-800">
            Пакеты содержат конфиденциальные материалы. Перед передачей третьим лицам требуется проверка и утверждение.
          </p>
        </div>
      </div>

      {/* KPI Strip */}
      <PaKpiStrip kpis={kpis} />

      {/* Actions Bar */}
      <PaActionsBar
        onCreatePack={onCreatePack}
        onCreateTemplate={onCreateTemplate}
        onQuickPack={onQuickPack}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Packs Preview - 2 columns */}
        <div className="lg:col-span-2">
          <PaPacksPreview packs={packs} onViewAll={onViewAllPacks} />
        </div>

        {/* Shares Preview - 1 column */}
        <div>
          <PaSharesPreview shares={sharesWithNames} onViewAll={onViewAllShares} />
        </div>
      </div>

      {/* AI Panel */}
      <PaAiPanel
        onProposeContents={async () => ({
          action: 'propose_contents',
          result: [],
          sources: ['Стандартные требования'],
          confidence: 0.85,
          assumptions: [],
          requiresHumanReview: true,
        })}
        onDraftCoverLetter={async () => ({
          action: 'draft_cover_letter',
          result: '',
          sources: ['Шаблон письма'],
          confidence: 0.80,
          assumptions: [],
          requiresHumanReview: true,
        })}
        onCheckMissingDocs={async () => ({
          action: 'check_missing_docs',
          result: [],
          sources: ['Требования к документам'],
          confidence: 0.90,
          assumptions: [],
          requiresHumanReview: true,
        })}
      />
    </div>
  );
}
