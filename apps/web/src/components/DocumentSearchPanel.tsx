import { copy } from '@epis2/design-system';
import { EpisTreeViewSuspense, Stack, TextField, Typography, Button } from '@epis2/epis2-ui';
import { useMemo, useState } from 'react';
import { searchPatientDocuments } from '../api/clinicalApi.js';
import { buildDocumentTreeByType } from '../tree/documentTree.js';

export type DocumentSearchPanelProps = {
  patientId: string;
};

export function DocumentSearchPanel({ patientId }: DocumentSearchPanelProps) {
  const [query, setQuery] = useState('laboratorio');
  const [hits, setHits] = useState<
    Awaited<ReturnType<typeof searchPatientDocuments>>['hits'] | null
  >(null);
  const [loading, setLoading] = useState(false);

  const runSearch = async () => {
    setLoading(true);
    try {
      const res = await searchPatientDocuments(patientId, query);
      setHits(res.hits);
    } catch {
      setHits([]);
    } finally {
      setLoading(false);
    }
  };

  const treeItems = useMemo(
    () =>
      hits
        ? buildDocumentTreeByType(
            hits.map((h) => ({
              id: h.id,
              title: h.title,
              documentType: h.documentType,
              snippet: h.snippet,
            })),
          )
        : [],
    [hits],
  );

  const defaultExpanded = useMemo(
    () => treeItems.map((n) => n.id),
    [treeItems],
  );

  return (
    <Stack spacing={1} data-testid="epis2-document-search">
      <Typography variant="subtitle2">{copy.longitudinal.searchDocuments}</Typography>
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          fullWidth
          placeholder={copy.longitudinal.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="outlined" size="small" disabled={loading} onClick={() => void runSearch()}>
          {copy.longitudinal.searchDocuments}
        </Button>
      </Stack>
      {hits ? (
        <EpisTreeViewSuspense
          items={treeItems}
          defaultExpandedItems={defaultExpanded}
          emptyMessage={copy.longitudinal.searchNoHits}
          loadingLabel={copy.dashboard.gridLoading}
          data-testid="epis2-document-search-tree"
        />
      ) : null}
    </Stack>
  );
}
