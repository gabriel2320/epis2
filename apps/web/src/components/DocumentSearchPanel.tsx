import { copy } from '@epis2/design-system';
import { EpisTreeViewSuspense, Stack, TextField, Typography, Button, Alert } from '@epis2/epis2-ui';
import { useMemo, useState } from 'react';
import { intakePatientDocument, searchPatientDocuments } from '../api/clinicalApi.js';
import { buildDocumentTreeByType } from '../tree/documentTree.js';

export type DocumentSearchPanelProps = {
  patientId: string;
};

export function DocumentSearchPanel({ patientId }: DocumentSearchPanelProps) {
  const [query, setQuery] = useState('laboratorio');
  const [hits, setHits] = useState<
    Awaited<ReturnType<typeof searchPatientDocuments>>['hits'] | null
  >(null);
  const [searchMode, setSearchMode] = useState<'semantic' | 'keyword' | null>(null);
  const [loading, setLoading] = useState(false);
  const [intakeTitle, setIntakeTitle] = useState('Nota clínica demo');
  const [intakeText, setIntakeText] = useState('');
  const [intakeMsg, setIntakeMsg] = useState<string | null>(null);

  const runSearch = async () => {
    setLoading(true);
    try {
      const res = await searchPatientDocuments(patientId, query);
      setHits(res.hits);
      setSearchMode(res.searchMode ?? 'keyword');
    } catch {
      setHits([]);
      setSearchMode(null);
    } finally {
      setLoading(false);
    }
  };

  const runIntake = async () => {
    setIntakeMsg(null);
    try {
      await intakePatientDocument(patientId, {
        title: intakeTitle.trim() || 'Documento demo',
        documentType: 'txt',
        textContent: intakeText.trim() || intakeTitle.trim(),
      });
      setIntakeMsg(copy.longitudinal.intakeSuccess);
      setIntakeText('');
      await runSearch();
    } catch {
      setIntakeMsg('No se pudo indexar el documento.');
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
      {searchMode === 'semantic' ? (
        <Typography variant="caption" color="text.secondary">
          {copy.longitudinal.searchSemanticHint}
        </Typography>
      ) : null}
      {hits ? (
        <EpisTreeViewSuspense
          items={treeItems}
          defaultExpandedItems={defaultExpanded}
          emptyMessage={copy.longitudinal.searchNoHits}
          loadingLabel={copy.dashboard.gridLoading}
          data-testid="epis2-document-search-tree"
        />
      ) : null}

      <Typography variant="subtitle2" sx={{ mt: 1 }}>
        {copy.longitudinal.intakeTitle}
      </Typography>
      <TextField
        size="small"
        fullWidth
        label="Título"
        value={intakeTitle}
        onChange={(e) => setIntakeTitle(e.target.value)}
      />
      <TextField
        size="small"
        fullWidth
        multiline
        minRows={2}
        placeholder={copy.longitudinal.intakePlaceholder}
        value={intakeText}
        onChange={(e) => setIntakeText(e.target.value)}
      />
      <Button variant="outlined" size="small" onClick={() => void runIntake()}>
        {copy.longitudinal.intakeSubmit}
      </Button>
      {intakeMsg ? <Alert severity="info">{intakeMsg}</Alert> : null}
    </Stack>
  );
}
