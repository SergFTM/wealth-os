"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IhConnectorDetail } from '@/modules/18-integrations/ui/IhConnectorDetail';

interface Connector {
  id: string;
  clientId: string;
  name: string;
  type: 'bank' | 'broker' | 'custodian' | 'accounting' | 'bill' | 'arch';
  provider: string;
  status: 'active' | 'disabled';
  health: 'ok' | 'warning' | 'critical';
  lastRunId: string | null;
  lastRunAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ConnectorCredential {
  id: string;
  connectorId: string;
  type: 'api_key' | 'oauth' | 'sftp' | 'basic';
  secretRef: string;
  expiresAt: string | null;
  status: 'active' | 'expired' | 'revoked';
}

interface SyncRun {
  id: string;
  jobId: string;
  connectorId: string;
  startedAt: string;
  endedAt: string | null;
  status: 'success' | 'failed' | 'partial' | 'running';
  recordsIngested: number;
  errorsCount: number;
  logPath: string | null;
}

export default function IntegrationsItemPage() {
  const router = useRouter();
  const params = useParams();
  const connectorId = params.id as string;

  const [connector, setConnector] = useState<Connector | null>(null);
  const [credentials, setCredentials] = useState<ConnectorCredential[]>([]);
  const [recentRuns, setRecentRuns] = useState<SyncRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch connector
        const connectorRes = await fetch(`/api/collections/connectors/${connectorId}`);
        if (!connectorRes.ok) {
          throw new Error('Connector not found');
        }
        const connectorData = await connectorRes.json();
        setConnector(connectorData);

        // Fetch credentials for this connector
        const credentialsRes = await fetch('/api/collections/connectorCredentials');
        const credentialsData = await credentialsRes.json();
        setCredentials(credentialsData.filter((c: ConnectorCredential) => c.connectorId === connectorId));

        // Fetch runs for this connector
        const runsRes = await fetch('/api/collections/syncRuns');
        const runsData = await runsRes.json();
        const connectorRuns = runsData
          .filter((r: SyncRun) => r.connectorId === connectorId)
          .sort((a: SyncRun, b: SyncRun) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
          .slice(0, 10);
        setRecentRuns(connectorRuns);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load connector');
      } finally {
        setLoading(false);
      }
    }

    if (connectorId) {
      fetchData();
    }
  }, [connectorId]);

  const handleBack = () => {
    router.push('/m/integrations/list?tab=connectors');
  };

  const handleRunNow = () => {
    console.log('Run now clicked');
    // In real app: trigger sync job
  };

  const handleToggleStatus = () => {
    console.log('Toggle status clicked');
    // In real app: enable/disable connector
  };

  const handleConfigure = () => {
    console.log('Configure clicked');
    // In real app: open configuration modal
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !connector) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-stone-500">
        <p className="text-lg mb-4">{error || 'Connector not found'}</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  return (
    <IhConnectorDetail
      connector={connector}
      credentials={credentials}
      recentRuns={recentRuns}
      onBack={handleBack}
      onRunNow={handleRunNow}
      onToggleStatus={handleToggleStatus}
      onConfigure={handleConfigure}
    />
  );
}
