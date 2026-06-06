import { copy } from '@epis2/design-system';
import {
  Alert,
  EpisButton,
  EpisSelect,
  EpisTreeViewSuspense,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@epis2/epis2-ui';
import { useMemo, useState } from 'react';
import {
  intakePatientDocument,
  runDocumentOcr,
  searchPatientDocuments,
} from '../api/clinicalApi.js';
import { buildDocumentTreeByType } from '../tree/documentTree.js';

export type DocumentSearchPanelProps = {
  patientId: string;
};

type IntakeType = 'txt' | 'image';

export function DocumentSearchPanel({ patientId }: DocumentSearchPanelProps) {
  const [query, setQuery] = useState('laboratorio');
  const [hits, setHits] = useState<
    Awaited<ReturnType<typeof searchPatientDocuments>>['hits'] | null
  >(null);
  const [searchMode, setSearchMode] = useState<'semantic' | 'keyword' | null>(null);
  const [loading, setLoading] = useState(false);
  const [intakeTitle, setIntakeTitle] = useState<string>(copy.longitudinal.intakeTitleDefault);
  const [intakeText, setIntakeText] = useState('');
  const [intakeType, setIntakeType] = useState<IntakeType>('txt');
  const [intakeMsg, setIntakeMsg] = useState<string | null>(null);
  const [pendingOcrDocId, setPendingOcrDocId] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);

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
    setPendingOcrDocId(null);
    try {
      const res = await intakePatientDocument(patientId, {
        title: intakeTitle.trim() || copy.longitudinal.intakeDocumentFallback,
        documentType: intakeType,
        ...(intakeType === 'txt'
          ? { textContent: intakeText.trim() || intakeTitle.trim() }
          : { mimeType: 'image/png' }),
      });
      setIntakeMsg(
        res.document.ocrPending
          ? copy.longitudinal.ocrPendingHint
          : copy.longitudinal.intakeSuccess,
      );
      if (res.document.ocrPending) {
        setPendingOcrDocId(res.document.id);
      } else {
        setIntakeText('');
        await runSearch();
      }
    } catch {
      setIntakeMsg(copy.errors.genericMessage);
    }
  };

  const runOcr = async () => {
    if (!pendingOcrDocId) return;
    setOcrLoading(true);
    setIntakeMsg(null);
    try {
      await runDocumentOcr(patientId, pendingOcrDocId);
      setPendingOcrDocId(null);
      setIntakeMsg(copy.longitudinal.ocrSuccess);
      setIntakeText('');
      await runSearch();
    } catch {
      setIntakeMsg(copy.errors.genericMessage);
    } finally {
      setOcrLoading(false);
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
        <EpisButton
          variant="outlined"
          size="small"
          disabled={loading}
          onClick={() => void runSearch()}
        >
          {copy.longitudinal.searchDocuments}
        </EpisButton>
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
      <FormControl size="small" fullWidth>
        <InputLabel id="epis2-intake-type-label">{copy.longitudinal.intakeTypeLabel}</InputLabel>
        <EpisSelect
          labelId="epis2-intake-type-label"
          label={copy.longitudinal.intakeTypeLabel}
          value={intakeType}
          onChange={(e) => setIntakeType(e.target.value as IntakeType)}
          data-testid="epis2-intake-type"
        >
          <MenuItem value="txt">{copy.longitudinal.intakeTypeTxt}</MenuItem>
          <MenuItem value="image">{copy.longitudinal.intakeTypeImage}</MenuItem>
        </EpisSelect>
      </FormControl>
      <TextField
        size="small"
        fullWidth
        label={copy.longitudinal.intakeTitleLabel}
        value={intakeTitle}
        onChange={(e) => setIntakeTitle(e.target.value)}
      />
      {intakeType === 'txt' ? (
        <TextField
          size="small"
          fullWidth
          multiline
          minRows={2}
          placeholder={copy.longitudinal.intakePlaceholder}
          value={intakeText}
          onChange={(e) => setIntakeText(e.target.value)}
        />
      ) : null}
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <EpisButton variant="outlined" size="small" onClick={() => void runIntake()}>
          {copy.longitudinal.intakeSubmit}
        </EpisButton>
        {pendingOcrDocId ? (
          <EpisButton
            appearance="tonal"
            size="small"
            disabled={ocrLoading}
            onClick={() => void runOcr()}
            data-testid="epis2-document-ocr-run"
          >
            {ocrLoading ? copy.longitudinal.exportDownloading : copy.longitudinal.ocrRun}
          </EpisButton>
        ) : null}
      </Stack>
      {intakeMsg ? <Alert severity="info">{intakeMsg}</Alert> : null}
    </Stack>
  );
}
