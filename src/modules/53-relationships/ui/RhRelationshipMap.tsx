"use client";

import React from 'react';
import { RhTierBadge } from './RhTierBadge';
import { RhRolePill } from './RhRolePill';

export interface MapNode {
  id: string;
  type: 'person' | 'entity' | 'trust' | 'household';
  label: string;
  tier?: string;
  role?: string;
}

export interface MapEdge {
  from: string;
  to: string;
  type: string;
  label?: string;
}

interface RhRelationshipMapProps {
  nodes: MapNode[];
  edges: MapEdge[];
  centerNodeId?: string;
  onNodeClick?: (node: MapNode) => void;
}

const NODE_TYPE_STYLES: Record<string, { bg: string; border: string; icon: string }> = {
  person: { bg: 'bg-blue-50', border: 'border-blue-300', icon: '👤' },
  entity: { bg: 'bg-purple-50', border: 'border-purple-300', icon: '🏢' },
  trust: { bg: 'bg-amber-50', border: 'border-amber-300', icon: '🏛️' },
  household: { bg: 'bg-emerald-50', border: 'border-emerald-300', icon: '🏠' },
};

const EDGE_TYPE_STYLES: Record<string, { color: string; label: string }> = {
  family: { color: 'stroke-purple-400', label: 'Семья' },
  role: { color: 'stroke-blue-400', label: 'Роль' },
  authority: { color: 'stroke-amber-400', label: 'Доверенность' },
  vendor_contact: { color: 'stroke-gray-400', label: 'Контакт' },
  ownership_link: { color: 'stroke-emerald-400', label: 'Владение' },
};

export function RhRelationshipMap({
  nodes,
  edges,
  centerNodeId,
  onNodeClick,
}: RhRelationshipMapProps) {
  // Simple circular layout
  const centerNode = nodes.find(n => n.id === centerNodeId) || nodes[0];
  const otherNodes = nodes.filter(n => n.id !== centerNode?.id);

  const radius = 150;
  const centerX = 200;
  const centerY = 200;

  const getNodePosition = (index: number, total: number) => {
    const angle = (2 * Math.PI * index) / total - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const nodePositions = new Map<string, { x: number; y: number }>();
  if (centerNode) {
    nodePositions.set(centerNode.id, { x: centerX, y: centerY });
  }
  otherNodes.forEach((node, index) => {
    nodePositions.set(node.id, getNodePosition(index, otherNodes.length));
  });

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Нет связей для отображения
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: '400px' }}>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{ maxWidth: '400px', margin: '0 auto' }}
      >
        {/* Edges */}
        {edges.map((edge, index) => {
          const fromPos = nodePositions.get(edge.from);
          const toPos = nodePositions.get(edge.to);
          if (!fromPos || !toPos) return null;

          const edgeStyle = EDGE_TYPE_STYLES[edge.type] || EDGE_TYPE_STYLES.family;

          return (
            <g key={`edge-${index}`}>
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                className={edgeStyle.color}
                strokeWidth="2"
                strokeDasharray={edge.type === 'authority' ? '5,5' : undefined}
              />
              {edge.label && (
                <text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2 - 5}
                  className="text-xs fill-gray-500"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes as HTML overlays for better interactivity */}
      {nodes.map((node) => {
        const pos = nodePositions.get(node.id);
        if (!pos) return null;

        const style = NODE_TYPE_STYLES[node.type] || NODE_TYPE_STYLES.person;
        const isCenter = node.id === centerNode?.id;

        return (
          <div
            key={node.id}
            onClick={() => onNodeClick?.(node)}
            className={`
              absolute transform -translate-x-1/2 -translate-y-1/2
              ${onNodeClick ? 'cursor-pointer' : ''}
            `}
            style={{
              left: `${(pos.x / 400) * 100}%`,
              top: `${(pos.y / 400) * 100}%`,
            }}
          >
            <div
              className={`
                flex flex-col items-center p-2 rounded-lg border-2
                transition-transform hover:scale-110
                ${style.bg} ${style.border}
                ${isCenter ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}
              `}
            >
              <span className="text-lg">{style.icon}</span>
              <span className="text-xs font-medium text-gray-700 max-w-20 truncate">
                {node.label}
              </span>
              {node.tier && (
                <div className="mt-1">
                  <RhTierBadge tier={node.tier} size="sm" showLabel={false} />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 py-2 text-xs">
        {Object.entries(EDGE_TYPE_STYLES).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1">
            <div
              className={`w-4 h-0.5 ${value.color.replace('stroke-', 'bg-')}`}
            />
            <span className="text-gray-600">{value.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RhRelationshipMap;
