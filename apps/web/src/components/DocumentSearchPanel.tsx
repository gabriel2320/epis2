import { copy } from '@epis2/design-system';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { searchPatientDocuments } from '../api/clinicalApi.js';

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
        hits.length > 0 ? (
          <List dense disablePadding>
            {hits.map((h) => (
              <ListItem key={h.id} disablePadding>
                <ListItemText primary={h.title} secondary={h.snippet} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.searchNoHits}
          </Typography>
        )
      ) : null}
    </Stack>
  );
}
