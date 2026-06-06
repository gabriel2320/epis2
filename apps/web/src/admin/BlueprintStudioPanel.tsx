import {
  EPIS2_FORM_BLUEPRINTS,
  blueprintExportFilename,
  parseBlueprintImport,
  scaffoldBlueprintModule,
  serializeBlueprintToJson,
  type ClinicalFormBlueprint,
} from '@epis2/clinical-forms';
import { CLINICAL_ROLES, type ClinicalRole } from '@epis2/clinical-domain';
import { copy } from '@epis2/design-system';
import { EPIS2_COMMAND_DEFINITIONS, type ClinicalIntent } from '@epis2/command-registry';
import {
  Alert,
  EpisButton,
  EpisM3Text,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@epis2/epis2-ui';
import { useMemo, useState } from 'react';

function downloadTextFile(filename: string, content: string, mime = 'application/json') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function BlueprintStudioPanel() {
  const [selectedId, setSelectedId] = useState(EPIS2_FORM_BLUEPRINTS[0]?.blueprintId ?? '');
  const [importJson, setImportJson] = useState('');
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importedBlueprint, setImportedBlueprint] = useState<ClinicalFormBlueprint | null>(null);
  const [scaffoldOutput, setScaffoldOutput] = useState('');

  const [newBlueprintId, setNewBlueprintId] = useState('');
  const [newRouteSegment, setNewRouteSegment] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newPurpose, setNewPurpose] = useState('');
  const [newIntentId, setNewIntentId] = useState<ClinicalIntent>('create_evolution_draft');
  const [newRoles, setNewRoles] = useState<ClinicalRole[]>(['physician']);

  const selected = useMemo(
    () => EPIS2_FORM_BLUEPRINTS.find((bp) => bp.blueprintId === selectedId),
    [selectedId],
  );

  const intentOptions = useMemo(
    () => EPIS2_COMMAND_DEFINITIONS.map((def) => def.intent),
    [],
  );

  const exportSelected = () => {
    if (!selected) return;
    downloadTextFile(
      blueprintExportFilename(selected.blueprintId),
      serializeBlueprintToJson(selected),
    );
  };

  const exportRegistry = () => {
    const payload = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      blueprints: EPIS2_FORM_BLUEPRINTS,
    };
    downloadTextFile('epis2-blueprint-registry.json', JSON.stringify(payload, null, 2));
  };

  const validateImport = () => {
    const result = parseBlueprintImport(importJson);
    if (!result.ok) {
      setImportErrors(result.errors);
      setImportedBlueprint(null);
      return;
    }
    setImportErrors([]);
    setImportedBlueprint(result.document.blueprint);
  };

  const generateScaffoldFromImport = () => {
    if (!importedBlueprint) return;
    const segment = importedBlueprint.routePath.replace(/^\/espacio\//, '');
    setScaffoldOutput(
      scaffoldBlueprintModule({
        blueprintId: importedBlueprint.blueprintId,
        routeSegment: segment,
        label: importedBlueprint.label,
        purpose: importedBlueprint.purpose,
        intentId: importedBlueprint.intentIds[0]!,
        roles: importedBlueprint.allowedRoles,
      }),
    );
  };

  const generateNewScaffold = () => {
    if (!newBlueprintId.trim() || !newRouteSegment.trim() || !newLabel.trim()) return;
    setScaffoldOutput(
      scaffoldBlueprintModule({
        blueprintId: newBlueprintId.trim(),
        routeSegment: newRouteSegment.trim(),
        label: newLabel.trim(),
        purpose: newPurpose.trim() || newLabel.trim(),
        intentId: newIntentId,
        roles: newRoles,
      }),
    );
  };

  const toggleRole = (role: ClinicalRole) => {
    setNewRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  return (
    <Stack spacing={2} data-testid="epis2-blueprint-studio">
      <Alert severity="info">{copy.blueprintStudio.disclaimer}</Alert>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <EpisM3Text role="titleMedium" component="h2">
          {copy.blueprintStudio.registryTitle}
        </EpisM3Text>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {copy.blueprintStudio.registryHint.replace('{count}', String(EPIS2_FORM_BLUEPRINTS.length))}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
          <TextField
            select
            size="small"
            label={copy.blueprintStudio.selectBlueprint}
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            sx={{ minWidth: 280 }}
            data-testid="epis2-blueprint-select"
          >
            {EPIS2_FORM_BLUEPRINTS.map((bp) => (
              <MenuItem key={bp.blueprintId} value={bp.blueprintId}>
                {bp.label} ({bp.blueprintId})
              </MenuItem>
            ))}
          </TextField>
          <EpisButton appearance="filled" onClick={exportSelected} data-testid="epis2-blueprint-export-one">
            {copy.blueprintStudio.exportOne}
          </EpisButton>
          <EpisButton appearance="outlined" onClick={exportRegistry} data-testid="epis2-blueprint-export-all">
            {copy.blueprintStudio.exportAll}
          </EpisButton>
        </Stack>
        {selected ? (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {selected.routePath} · {selected.intentIds.join(', ')}
          </Typography>
        ) : null}
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <EpisM3Text role="titleMedium" component="h2">
          {copy.blueprintStudio.importTitle}
        </EpisM3Text>
        <TextField
          multiline
          minRows={6}
          fullWidth
          label={copy.blueprintStudio.importLabel}
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          data-testid="epis2-blueprint-import-json"
        />
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <EpisButton appearance="filled" onClick={validateImport} data-testid="epis2-blueprint-validate-import">
            {copy.blueprintStudio.validateImport}
          </EpisButton>
          <EpisButton
            appearance="outlined"
            disabled={!importedBlueprint}
            onClick={generateScaffoldFromImport}
          >
            {copy.blueprintStudio.scaffoldFromImport}
          </EpisButton>
        </Stack>
        {importErrors.length > 0 ? (
          <Alert severity="error" sx={{ mt: 1 }}>
            {importErrors.join(' · ')}
          </Alert>
        ) : null}
        {importedBlueprint ? (
          <Alert severity="success" sx={{ mt: 1 }}>
            {copy.blueprintStudio.importOk.replace('{id}', importedBlueprint.blueprintId)}
          </Alert>
        ) : null}
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <EpisM3Text role="titleMedium" component="h2">
          {copy.blueprintStudio.newTitle}
        </EpisM3Text>
        <Stack spacing={1.5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField
              size="small"
              label={copy.blueprintStudio.fieldBlueprintId}
              value={newBlueprintId}
              onChange={(e) => setNewBlueprintId(e.target.value)}
            />
            <TextField
              size="small"
              label={copy.blueprintStudio.fieldRouteSegment}
              value={newRouteSegment}
              onChange={(e) => setNewRouteSegment(e.target.value)}
              placeholder="mi-formulario"
            />
          </Stack>
          <TextField
            size="small"
            label={copy.blueprintStudio.fieldLabel}
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <TextField
            size="small"
            label={copy.blueprintStudio.fieldPurpose}
            value={newPurpose}
            onChange={(e) => setNewPurpose(e.target.value)}
          />
          <TextField
            select
            size="small"
            label={copy.blueprintStudio.fieldIntent}
            value={newIntentId}
            onChange={(e) => setNewIntentId(e.target.value as ClinicalIntent)}
          >
            {intentOptions.map((intent) => (
              <MenuItem key={intent} value={intent}>
                {intent}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {CLINICAL_ROLES.map((role) => (
              <EpisButton
                key={role}
                appearance={newRoles.includes(role) ? 'filled' : 'outlined'}
                size="small"
                onClick={() => toggleRole(role)}
              >
                {role}
              </EpisButton>
            ))}
          </Stack>
          <EpisButton appearance="filled" onClick={generateNewScaffold} data-testid="epis2-blueprint-generate-scaffold">
            {copy.blueprintStudio.generateScaffold}
          </EpisButton>
        </Stack>
      </Paper>

      {scaffoldOutput ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <EpisM3Text role="titleMedium">{copy.blueprintStudio.scaffoldOutput}</EpisM3Text>
            <EpisButton
              appearance="outlined"
              size="small"
              onClick={() => {
                void navigator.clipboard?.writeText(scaffoldOutput);
              }}
            >
              {copy.blueprintStudio.copyScaffold}
            </EpisButton>
          </Stack>
          <Typography
            variant="body2"
            component="pre"
            sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.75rem' }}
            data-testid="epis2-blueprint-scaffold-output"
          >
            {scaffoldOutput}
          </Typography>
        </Paper>
      ) : null}
    </Stack>
  );
}
