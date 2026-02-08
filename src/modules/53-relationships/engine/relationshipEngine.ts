/**
 * Relationship Engine
 * Manages relationship links between entities (person, entity, trust, household)
 */

export interface RelationshipRef {
  type: 'person' | 'entity' | 'trust' | 'household';
  id: string;
}

export interface RelRelationship {
  id: string;
  clientId: string;
  fromRefJson: RelationshipRef;
  toRefJson: RelationshipRef;
  relationshipTypeKey: 'family' | 'role' | 'authority' | 'vendor_contact' | 'ownership_link';
  roleLabel?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  evidenceDocIdsJson: string[];
  sourceRefJson?: { type: string; id: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateRelationshipParams {
  clientId: string;
  fromRef: RelationshipRef;
  toRef: RelationshipRef;
  relationshipTypeKey: RelRelationship['relationshipTypeKey'];
  roleLabel?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  evidenceDocIds?: string[];
  sourceRef?: { type: string; id: string };
}

export interface RelationshipGraph {
  nodes: Array<{
    id: string;
    type: string;
    label: string;
    tier?: string;
  }>;
  edges: Array<{
    from: string;
    to: string;
    type: string;
    label?: string;
  }>;
}

export async function createRelationship(
  params: CreateRelationshipParams,
  apiBase: string = '/api/collections'
): Promise<RelRelationship> {
  const now = new Date().toISOString();
  const record = {
    clientId: params.clientId,
    fromRefJson: params.fromRef,
    toRefJson: params.toRef,
    relationshipTypeKey: params.relationshipTypeKey,
    roleLabel: params.roleLabel || null,
    effectiveFrom: params.effectiveFrom,
    effectiveTo: params.effectiveTo || null,
    evidenceDocIdsJson: params.evidenceDocIds || [],
    sourceRefJson: params.sourceRef || null,
  };

  const res = await fetch(`${apiBase}/relRelationships`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });

  if (!res.ok) throw new Error('Failed to create relationship');
  return res.json();
}

export async function updateRelationship(
  id: string,
  patch: Partial<RelRelationship>,
  apiBase: string = '/api/collections'
): Promise<RelRelationship> {
  const res = await fetch(`${apiBase}/relRelationships/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });

  if (!res.ok) throw new Error('Failed to update relationship');
  return res.json();
}

export async function getRelationshipsForEntity(
  entityType: string,
  entityId: string,
  apiBase: string = '/api/collections'
): Promise<RelRelationship[]> {
  const res = await fetch(`${apiBase}/relRelationships?search=${entityId}`);
  if (!res.ok) return [];
  const data = await res.json();

  // Filter relationships where entity is from or to
  return (data.items || data || []).filter((r: RelRelationship) =>
    (r.fromRefJson.type === entityType && r.fromRefJson.id === entityId) ||
    (r.toRefJson.type === entityType && r.toRefJson.id === entityId)
  );
}

export function buildRelationshipGraph(
  relationships: RelRelationship[],
  entities: Map<string, { name: string; tier?: string }>
): RelationshipGraph {
  const nodesMap = new Map<string, RelationshipGraph['nodes'][0]>();
  const edges: RelationshipGraph['edges'] = [];

  for (const rel of relationships) {
    const fromKey = `${rel.fromRefJson.type}:${rel.fromRefJson.id}`;
    const toKey = `${rel.toRefJson.type}:${rel.toRefJson.id}`;

    if (!nodesMap.has(fromKey)) {
      const entity = entities.get(rel.fromRefJson.id);
      nodesMap.set(fromKey, {
        id: fromKey,
        type: rel.fromRefJson.type,
        label: entity?.name || rel.fromRefJson.id,
        tier: entity?.tier,
      });
    }

    if (!nodesMap.has(toKey)) {
      const entity = entities.get(rel.toRefJson.id);
      nodesMap.set(toKey, {
        id: toKey,
        type: rel.toRefJson.type,
        label: entity?.name || rel.toRefJson.id,
        tier: entity?.tier,
      });
    }

    edges.push({
      from: fromKey,
      to: toKey,
      type: rel.relationshipTypeKey,
      label: rel.roleLabel,
    });
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
  };
}

export function isRelationshipActive(rel: RelRelationship): boolean {
  const now = new Date();
  const from = new Date(rel.effectiveFrom);
  const to = rel.effectiveTo ? new Date(rel.effectiveTo) : null;

  return from <= now && (!to || to >= now);
}

export function getRelationshipTypeLabel(
  typeKey: string,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): string {
  const labels: Record<string, Record<string, string>> = {
    family: { ru: 'Семья', en: 'Family', uk: 'Родина' },
    role: { ru: 'Роль', en: 'Role', uk: 'Роль' },
    authority: { ru: 'Доверенность', en: 'Authority', uk: 'Довіреність' },
    vendor_contact: { ru: 'Контакт вендора', en: 'Vendor Contact', uk: 'Контакт вендора' },
    ownership_link: { ru: 'Связь владения', en: 'Ownership Link', uk: 'Зв\'язок володіння' },
  };
  return labels[typeKey]?.[locale] || typeKey;
}
