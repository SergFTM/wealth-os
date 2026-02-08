"use client";

import { useRef, useEffect, useState, useCallback } from 'react';

interface GraphNode {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  level: number;
}

interface GraphLink {
  id: string;
  from: string;
  to: string;
  ownershipPct: number;
  profitSharePct?: number;
}

interface OwGraphCanvasProps {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNodeId?: string | null;
  highlightedPath?: string[];
  onNodeClick: (nodeId: string) => void;
  onLinkClick: (linkId: string) => void;
  onBackgroundClick: () => void;
}

const NODE_WIDTH = 160;
const NODE_HEIGHT = 60;

const nodeColors: Record<string, { bg: string; border: string; text: string }> = {
  household: { bg: '#EDE9FE', border: '#A78BFA', text: '#5B21B6' },
  trust: { bg: '#DBEAFE', border: '#60A5FA', text: '#1E40AF' },
  entity: { bg: '#D1FAE5', border: '#34D399', text: '#065F46' },
  partnership: { bg: '#FEF3C7', border: '#FBBF24', text: '#92400E' },
  spv: { bg: '#CFFAFE', border: '#22D3EE', text: '#0E7490' },
  account: { bg: '#F3F4F6', border: '#9CA3AF', text: '#374151' },
  asset: { bg: '#ECFCCB', border: '#A3E635', text: '#3F6212' },
};

const typeIcons: Record<string, string> = {
  household: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  trust: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  entity: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  partnership: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  spv: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  account: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  asset: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
};

export function OwGraphCanvas({
  nodes,
  links,
  selectedNodeId,
  highlightedPath,
  onNodeClick,
  onLinkClick,
  onBackgroundClick,
}: OwGraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Calculate canvas bounds
  const bounds = nodes.reduce(
    (acc, node) => ({
      minX: Math.min(acc.minX, node.x),
      maxX: Math.max(acc.maxX, node.x + NODE_WIDTH),
      minY: Math.min(acc.minY, node.y),
      maxY: Math.max(acc.maxY, node.y + NODE_HEIGHT),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  );

  const canvasWidth = Math.max(800, bounds.maxX - bounds.minX + 200);
  const canvasHeight = Math.max(600, bounds.maxY - bounds.minY + 200);

  // Handle wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => Math.min(2, Math.max(0.3, s + delta)));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // Handle pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'svg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const isNodeHighlighted = (nodeId: string) => {
    return highlightedPath?.includes(nodeId) || selectedNodeId === nodeId;
  };

  const isLinkHighlighted = (link: GraphLink) => {
    if (!highlightedPath) return false;
    const fromIndex = highlightedPath.indexOf(link.from);
    const toIndex = highlightedPath.indexOf(link.to);
    return fromIndex !== -1 && toIndex !== -1 && Math.abs(fromIndex - toIndex) === 1;
  };

  // Calculate link path
  const getLinkPath = (link: GraphLink) => {
    const fromNode = nodeMap.get(link.from);
    const toNode = nodeMap.get(link.to);
    if (!fromNode || !toNode) return '';

    const fromX = fromNode.x + NODE_WIDTH / 2;
    const fromY = fromNode.y + NODE_HEIGHT;
    const toX = toNode.x + NODE_WIDTH / 2;
    const toY = toNode.y;

    // Curved path
    const midY = (fromY + toY) / 2;
    return `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl border border-stone-200"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onBackgroundClick();
        }
      }}
    >
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-white rounded-lg shadow-md p-1">
        <button
          onClick={() => setScale((s) => Math.min(2, s + 0.2))}
          className="p-2 hover:bg-stone-100 rounded"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={() => setScale((s) => Math.max(0.3, s - 0.2))}
          className="p-2 hover:bg-stone-100 rounded"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button
          onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }}
          className="p-2 hover:bg-stone-100 rounded text-xs font-medium"
        >
          1:1
        </button>
      </div>

      <svg
        width={canvasWidth}
        height={canvasHeight}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Links */}
        <g className="links">
          {links.map((link) => {
            const highlighted = isLinkHighlighted(link);
            return (
              <g key={link.id} onClick={() => onLinkClick(link.id)} style={{ cursor: 'pointer' }}>
                <path
                  d={getLinkPath(link)}
                  fill="none"
                  stroke={highlighted ? '#059669' : '#9CA3AF'}
                  strokeWidth={highlighted ? 3 : 2}
                  strokeDasharray={link.profitSharePct ? '5,5' : undefined}
                />
                {/* Ownership percentage label */}
                {(() => {
                  const fromNode = nodeMap.get(link.from);
                  const toNode = nodeMap.get(link.to);
                  if (!fromNode || !toNode) return null;
                  const midX = (fromNode.x + toNode.x + NODE_WIDTH) / 2;
                  const midY = (fromNode.y + NODE_HEIGHT + toNode.y) / 2;
                  return (
                    <text
                      x={midX}
                      y={midY}
                      textAnchor="middle"
                      className="text-xs font-medium fill-emerald-600 pointer-events-none"
                    >
                      {link.ownershipPct.toFixed(0)}%
                    </text>
                  );
                })()}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodes.map((node) => {
            const colors = nodeColors[node.type] || nodeColors.entity;
            const highlighted = isNodeHighlighted(node.id);
            const iconPath = typeIcons[node.type] || typeIcons.entity;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onNodeClick(node.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Node rectangle */}
                <rect
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx={8}
                  fill={colors.bg}
                  stroke={highlighted ? '#059669' : colors.border}
                  strokeWidth={highlighted ? 3 : 2}
                />
                {/* Icon */}
                <svg x={8} y={8} width={20} height={20} viewBox="0 0 24 24">
                  <path
                    d={iconPath}
                    fill="none"
                    stroke={colors.text}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Label */}
                <text
                  x={36}
                  y={28}
                  className="text-sm font-medium"
                  fill={colors.text}
                  style={{ fontSize: 12 }}
                >
                  {node.name.length > 16 ? node.name.slice(0, 14) + '...' : node.name}
                </text>
                <text
                  x={36}
                  y={44}
                  className="text-xs"
                  fill="#6B7280"
                  style={{ fontSize: 10 }}
                >
                  {node.type}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <p className="mt-4 text-stone-500 font-medium">Нет данных для отображения</p>
            <p className="text-sm text-stone-400">Добавьте узлы и связи для построения карты</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwGraphCanvas;
