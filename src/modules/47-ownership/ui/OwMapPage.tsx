"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCollection } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { OwGraphCanvas } from './OwGraphCanvas';
import { OwNodeDetail } from './OwNodeDetail';
import { OwLinkDetail } from './OwLinkDetail';
import { buildGraph, calculateLayout } from '../engine/graphBuilder';

interface OwNode {
  id: string;
  name: string;
  nodeTypeKey: string;
  jurisdiction?: string;
  status: string;
  mdmRefId?: string;
  mdmRefType?: string;
  sourceRefJson?: Record<string, unknown>;
  attachmentDocIdsJson?: string[];
  asOf?: string;
  createdAt: string;
  updatedAt: string;
}

interface OwLink {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  ownershipPct: number;
  profitSharePct?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceRefJson?: Record<string, unknown>;
  attachmentDocIdsJson?: string[];
  createdAt: string;
  updatedAt: string;
}

export function OwMapPage() {
  const router = useRouter();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: nodesData = [] } = useCollection('ownershipNodes') as { data: OwNode[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: linksData = [] } = useCollection('ownershipLinks') as { data: OwLink[] };

  // Build graph and calculate layout
  const { graphNodes, graphLinks, nodeMap } = useMemo(() => {
    if (nodesData.length === 0) {
      return { graphNodes: [], graphLinks: [], nodeMap: new Map() };
    }

    const graph = buildGraph(
      nodesData.map((n) => ({
        id: n.id,
        clientId: '',
        name: n.name,
        nodeTypeKey: n.nodeTypeKey,
        jurisdiction: n.jurisdiction,
        status: n.status,
      })),
      linksData.map((l) => ({
        id: l.id,
        clientId: '',
        fromNodeId: l.fromNodeId,
        toNodeId: l.toNodeId,
        ownershipPct: l.ownershipPct,
        profitSharePct: l.profitSharePct,
        effectiveFrom: l.effectiveFrom,
        effectiveTo: l.effectiveTo,
      }))
    );

    const positions = calculateLayout(graph);

    const graphNodes = Array.from(graph.nodes.values()).map((node) => ({
      id: node.id,
      name: node.name,
      type: node.nodeTypeKey,
      x: positions.get(node.id)?.x ?? 100,
      y: positions.get(node.id)?.y ?? 100,
      level: node.level,
    }));

    const graphLinks = linksData.map((l) => ({
      id: l.id,
      from: l.fromNodeId,
      to: l.toNodeId,
      ownershipPct: l.ownershipPct,
      profitSharePct: l.profitSharePct,
    }));

    const nodeMap = new Map(nodesData.map((n) => [n.id, n]));

    return { graphNodes, graphLinks, nodeMap };
  }, [nodesData, linksData]);

  const selectedNode = selectedNodeId ? nodeMap.get(selectedNodeId) : null;
  const selectedLink = selectedLinkId ? linksData.find((l) => l.id === selectedLinkId) : null;

  // Get related links for selected node
  const { incomingLinks, outgoingLinks } = useMemo(() => {
    if (!selectedNodeId) return { incomingLinks: [], outgoingLinks: [] };

    const incoming = linksData
      .filter((l) => l.toNodeId === selectedNodeId)
      .map((l) => ({
        id: l.id,
        direction: 'incoming' as const,
        nodeId: l.fromNodeId,
        nodeName: nodeMap.get(l.fromNodeId)?.name || l.fromNodeId,
        ownershipPct: l.ownershipPct,
        profitSharePct: l.profitSharePct,
      }));

    const outgoing = linksData
      .filter((l) => l.fromNodeId === selectedNodeId)
      .map((l) => ({
        id: l.id,
        direction: 'outgoing' as const,
        nodeId: l.toNodeId,
        nodeName: nodeMap.get(l.toNodeId)?.name || l.toNodeId,
        ownershipPct: l.ownershipPct,
        profitSharePct: l.profitSharePct,
      }));

    return { incomingLinks: incoming, outgoingLinks: outgoing };
  }, [selectedNodeId, linksData, nodeMap]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setSelectedLinkId(null);
  };

  const handleLinkClick = (linkId: string) => {
    setSelectedLinkId(linkId);
    setSelectedNodeId(null);
  };

  const handleBackgroundClick = () => {
    setSelectedNodeId(null);
    setSelectedLinkId(null);
    setHighlightedPath([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      {/* Header */}
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/m/ownership">
                <Button variant="ghost" className="gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Назад
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-stone-800">Карта владения</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500">
                {nodesData.length} узлов, {linksData.length} связей
              </span>
              <Button variant="secondary" onClick={() => router.push('/m/ownership/list?tab=nodes&create=true')}>
                + Добавить узел
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Graph area */}
        <div className="flex-1 p-4">
          <OwGraphCanvas
            nodes={graphNodes}
            links={graphLinks}
            selectedNodeId={selectedNodeId}
            highlightedPath={highlightedPath}
            onNodeClick={handleNodeClick}
            onLinkClick={handleLinkClick}
            onBackgroundClick={handleBackgroundClick}
          />
        </div>

        {/* Right drawer */}
        {(selectedNode || selectedLink) && (
          <div className="w-96 border-l border-stone-200 bg-white/80 backdrop-blur-sm overflow-hidden">
            {selectedNode && (
              <OwNodeDetail
                node={{
                  ...selectedNode,
                  sourceRefJson: selectedNode.sourceRefJson as { docId?: string; description?: string; url?: string } | undefined,
                }}
                incomingLinks={incomingLinks}
                outgoingLinks={outgoingLinks}
                onClose={() => setSelectedNodeId(null)}
                onEdit={() => router.push(`/m/ownership/node/${selectedNode.id}?edit=true`)}
                onOpenFull={() => router.push(`/m/ownership/node/${selectedNode.id}`)}
                onLinkClick={handleLinkClick}
              />
            )}
            {selectedLink && (
              <OwLinkDetail
                link={{
                  ...selectedLink,
                  fromNodeName: nodeMap.get(selectedLink.fromNodeId)?.name,
                  toNodeName: nodeMap.get(selectedLink.toNodeId)?.name,
                  sourceRefJson: selectedLink.sourceRefJson as { docId?: string; description?: string; url?: string } | undefined,
                }}
                onClose={() => setSelectedLinkId(null)}
                onEdit={() => router.push(`/m/ownership/link/${selectedLink.id}?edit=true`)}
                onDelete={() => {}}
                onNodeClick={handleNodeClick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OwMapPage;
