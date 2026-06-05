import { copy } from '@epis2/design-system';
import type { EpisTreeNode } from '@epis2/epis2-ui';

export type DocumentTreeItem = {
  id: string;
  title: string;
  documentType: string;
  snippet?: string;
};

export function formatDocumentType(documentType: string): string {
  const key = documentType as keyof typeof copy.tree.documentTypes;
  return copy.tree.documentTypes[key] ?? documentType;
}

export function buildDocumentTreeByType(items: DocumentTreeItem[]): EpisTreeNode[] {
  const byType = new Map<string, DocumentTreeItem[]>();
  for (const item of items) {
    const type = item.documentType || 'other';
    const bucket = byType.get(type) ?? [];
    bucket.push(item);
    byType.set(type, bucket);
  }

  return [...byType.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([type, docs]) => ({
      id: `type-${type}`,
      label: `${formatDocumentType(type)} (${docs.length})`,
      children: docs.map((d) => ({
        id: d.id,
        label: d.snippet ? `${d.title} — ${d.snippet}` : d.title,
      })),
    }));
}
