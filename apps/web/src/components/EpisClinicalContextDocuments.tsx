import type { DocumentSearchResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';
import {
  EpisButton,
  EpisChip,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@epis2/epis2-ui';
import { useEffect, useState } from 'react';
import { searchPatientDocuments } from '../api/clinicalApi.js';
import type { ClinicalContextInsertPayload } from './EpisClinicalContextPane.js';

type DocumentHit = DocumentSearchResponse['hits'][number];

export type EpisClinicalContextDocumentsProps = {
  patientId: string;
  defaultInsertFieldId?: string;
  onInsertFragment?: (payload: ClinicalContextInsertPayload) => void;
};

function formatDocumentInsertText(hit: DocumentHit): string {
  const snippet = hit.snippet?.trim();
  return snippet
    ? `${hit.title} (${hit.documentType}): ${snippet}`
    : `${hit.title} (${hit.documentType})`;
}

/** Búsqueda documental acotada al paciente activo (LAYOUT-05). */
export function EpisClinicalContextDocuments({
  patientId,
  defaultInsertFieldId = 'plan',
  onInsertFragment,
}: EpisClinicalContextDocumentsProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [hits, setHits] = useState<DocumentHit[] | null>(null);
  const [searchMode, setSearchMode] = useState<DocumentSearchResponse['searchMode']>();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query), 200);
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const needle = debouncedQuery.trim();
    if (needle.length < 2) {
      setHits(null);
      setSearchMode(undefined);
      setError(undefined);
      setSelectedId(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(undefined);
    void searchPatientDocuments(patientId, needle)
      .then((res) => {
        if (cancelled) return;
        setHits(res.hits);
        setSearchMode(res.searchMode ?? 'keyword');
        setSelectedId(null);
      })
      .catch(() => {
        if (cancelled) return;
        setError(copy.errors.genericMessage);
        setHits([]);
        setSearchMode(undefined);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, patientId]);

  const selected = selectedId ? hits?.find((h) => h.id === selectedId) : undefined;

  if (selected) {
    return (
      <Stack spacing={2} data-testid="epis2-clinical-context-documents">
        <EpisButton variant="text" size="small" onClick={() => setSelectedId(null)}>
          {copy.clinicalLayout.contextBackToList}
        </EpisButton>
        <Typography variant="subtitle2" component="h3">
          {selected.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selected.documentType}
        </Typography>
        {selected.snippet ? (
          <Typography variant="body2" sx={{ lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
            {selected.snippet}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        )}
        {onInsertFragment ? (
          <EpisChip
            label={copy.clinicalLayout.insertIntoPlan}
            color="primary"
            variant="outlined"
            onClick={() =>
              onInsertFragment({
                text: formatDocumentInsertText(selected),
                sourceEventId: selected.id,
                fieldId: defaultInsertFieldId,
              })
            }
            data-testid="epis2-context-doc-insert-chip"
          />
        ) : null}
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5} data-testid="epis2-clinical-context-documents">
      <TextField
        size="small"
        fullWidth
        placeholder={copy.clinicalLayout.contextDocumentsPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        inputProps={{ 'data-testid': 'epis2-context-documents-search' }}
      />
      {searchMode === 'semantic' ? (
        <Typography variant="caption" color="text.secondary">
          {copy.longitudinal.searchSemanticHint}
        </Typography>
      ) : null}
      {loading ? (
        <Typography variant="body2" color="text.secondary">
          {copy.clinicalLayout.contextDocumentsSearching}
        </Typography>
      ) : null}
      {error ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : null}
      {hits && hits.length === 0 && debouncedQuery.trim().length >= 2 && !loading ? (
        <Typography variant="body2" color="text.secondary">
          {copy.clinicalLayout.contextDocumentsNoHits}
        </Typography>
      ) : null}
      {hits && hits.length > 0 ? (
        <List dense disablePadding data-testid="epis2-context-documents-list">
          {hits.map((hit) => (
            <ListItemButton
              key={hit.id}
              onClick={() => setSelectedId(hit.id)}
              sx={{ borderRadius: 1 }}
              data-testid={`epis2-context-document-item-${hit.id}`}
            >
              <ListItemText
                primary={hit.title}
                secondary={`${hit.documentType}${hit.snippet ? ` — ${hit.snippet}` : ''}`}
              />
            </ListItemButton>
          ))}
        </List>
      ) : null}
    </Stack>
  );
}
