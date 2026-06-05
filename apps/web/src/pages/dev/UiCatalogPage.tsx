import { epis2Palette, epis2Theme } from '@epis2/epis2-ui';
import { getBlueprintById, initialFormValues } from '@epis2/clinical-forms';
import {
  Box,
  Divider,
  EpisAiDisclosure,
  EpisAlert,
  EpisApprovalGate,
  EpisButton,
  EpisCard,
  EpisChip,
  EpisClinicalForm,
  EpisCommandBar,
  EpisCommandSuggestions,
  EpisDialog,
  EpisDataGrid,
  EpisDatePicker,
  EpisDraftStatus,
  EpisTrendChart,
  EpisTreeView,
  EpisEmptyState,
  EpisLoadingState,
  EpisTextField,
  type GridColDef,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useState, type ReactNode } from 'react';

function CatalogSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <EpisCard sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {children}
    </EpisCard>
  );
}

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <Stack alignItems="center" spacing={0.5} sx={{ minWidth: 88 }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          bgcolor: hex,
          border: 1,
          borderColor: 'divider',
        }}
      />
      <Typography variant="caption" fontWeight={600}>
        {name}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {hex}
      </Typography>
    </Stack>
  );
}

export function UiCatalogPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const palette = epis2Palette;
  const colorRows: { name: string; hex: string }[] = [
    { name: 'primary.main', hex: palette.primary?.main ?? '' },
    { name: 'primary.light', hex: palette.primary?.light ?? '' },
    { name: 'primary.dark', hex: palette.primary?.dark ?? '' },
    { name: 'background.default', hex: palette.background?.default ?? '' },
    { name: 'background.paper', hex: palette.background?.paper ?? '' },
    { name: 'text.primary', hex: palette.text?.primary ?? '' },
    { name: 'text.secondary', hex: palette.text?.secondary ?? '' },
    { name: 'error', hex: palette.error?.main ?? '' },
    { name: 'warning', hex: palette.warning?.main ?? '' },
    { name: 'success', hex: palette.success?.main ?? '' },
    { name: 'info', hex: palette.info?.main ?? '' },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4, px: 2 }}>
      <Stack spacing={3} sx={{ maxWidth: 960, mx: 'auto' }} data-testid="epis2-ui-catalog">
        <Stack spacing={1}>
          <Typography variant="h4" color="primary">
            Catálogo UI EPIS2
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Uso interno — primitivos @epis2/epis2-ui y tokens del tema (
            {epis2Theme.shape?.borderRadius ?? 16}px radius, locale esES).
          </Typography>
          <EpisButton href="/comando" component="a" variant="text" size="small">
            Volver al Centro de Comando
          </EpisButton>
        </Stack>

        <CatalogSection title="Paleta">
          <Stack direction="row" flexWrap="wrap" gap={2}>
            {colorRows.map((c) => (
              <ColorSwatch key={c.name} name={c.name} hex={c.hex} />
            ))}
          </Stack>
        </CatalogSection>

        <CatalogSection title="Tipografía">
          <Stack spacing={1}>
            <Typography variant="h4">h4 — Título comando</Typography>
            <Typography variant="h5">h5 — Sección clínica</Typography>
            <Typography variant="h6">h6 — Subsección</Typography>
            <Typography variant="body1">body1 — Texto clínico principal</Typography>
            <Typography variant="body2">body2 — Metadatos y ayudas</Typography>
            <Typography variant="caption">caption — Hints y chips</Typography>
            <Typography variant="button">button — Etiqueta de acción</Typography>
          </Stack>
        </CatalogSection>

        <CatalogSection title="Botones (EpisButton)">
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <EpisButton variant="contained">Primario</EpisButton>
            <EpisButton variant="outlined">Secundario</EpisButton>
            <EpisButton variant="text">Texto</EpisButton>
            <EpisButton variant="contained" disabled>
              Deshabilitado
            </EpisButton>
            <EpisButton variant="contained" color="error">
              Error
            </EpisButton>
          </Stack>
        </CatalogSection>

        <CatalogSection title="Campos (EpisTextField)">
          <Stack spacing={2} sx={{ maxWidth: 400 }}>
            <EpisTextField label="Texto" placeholder="Ej. instrucción clínica" />
            <EpisTextField label="Con error" error helperText="Mensaje de validación" />
            <EpisTextField label="Deshabilitado" disabled defaultValue="Solo lectura" />
          </Stack>
        </CatalogSection>

        <CatalogSection title="Chips (EpisChip)">
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <EpisChip label="Borrador" variant="outlined" />
            <EpisChip label="IA local" color="success" icon={<span aria-hidden>✦</span>} />
            <EpisChip label="Rol médico" color="primary" variant="outlined" />
          </Stack>
        </CatalogSection>

        <CatalogSection title="Alertas (EpisAlert)">
          <Stack spacing={1}>
            <EpisAlert severity="info">Informativo clínico</EpisAlert>
            <EpisAlert severity="success">Operación correcta</EpisAlert>
            <EpisAlert severity="warning">CDS — revisar antes de continuar</EpisAlert>
            <EpisAlert severity="error">Error o bloqueo de seguridad</EpisAlert>
          </Stack>
        </CatalogSection>

        <CatalogSection title="Diálogo (EpisDialog)">
          <EpisButton variant="outlined" onClick={() => setDialogOpen(true)}>
            Abrir diálogo demo
          </EpisButton>
          <EpisDialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <Box sx={{ p: 3, minWidth: 320 }}>
              <Typography variant="h6" gutterBottom>
                Aprobación humana (demo)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Las acciones clínicas requieren confirmación explícita.
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <EpisButton onClick={() => setDialogOpen(false)}>Cancelar</EpisButton>
                <EpisButton variant="contained" onClick={() => setDialogOpen(false)}>
                  Confirmar
                </EpisButton>
              </Stack>
            </Box>
          </EpisDialog>
        </CatalogSection>

        <CatalogSection title="Tree View (MUI-08)">
          <EpisTreeView
            items={[
              {
                id: 'type-lab',
                label: 'Informe de laboratorio (1)',
                children: [{ id: 'doc-1', label: 'Hemograma catálogo' }],
              },
            ]}
            defaultExpandedItems={['type-lab']}
            data-testid="epis2-ui-catalog-tree"
          />
        </CatalogSection>

        <CatalogSection title="Charts (MUI-07)">
          <EpisTrendChart
            title="Tendencia demo"
            xAxisLabels={['Lun', 'Mar', 'Mié']}
            series={[{ label: 'INR', data: [1.9, 2.1, 2.3] }]}
            data-testid="epis2-ui-catalog-chart"
          />
        </CatalogSection>

        <CatalogSection title="Date Picker (MUI-06)">
          <EpisDatePicker
            label="Fecha del encuentro"
            value="2026-06-04"
            onChange={() => {}}
            data-testid="epis2-ui-catalog-date"
          />
        </CatalogSection>

        <CatalogSection title="Data Grid (MUI-05)">
          <EpisDataGrid
            rows={[
              {
                id: 'demo-1',
                title: 'Evolución catálogo',
                patientDisplayName: 'Paciente Demo',
                draftType: 'evolution_note',
                status: 'draft',
                updatedAt: new Date().toISOString(),
              },
            ]}
            columns={
              [
                { field: 'title', headerName: 'Título', flex: 1, minWidth: 120 },
                { field: 'patientDisplayName', headerName: 'Paciente', flex: 1 },
                { field: 'draftType', headerName: 'Tipo', width: 120 },
                {
                  field: 'status',
                  headerName: 'Estado',
                  width: 140,
                  renderCell: ({ value }) => (
                    <EpisDraftStatus status={String(value ?? '')} />
                  ),
                },
              ] satisfies GridColDef[]
            }
            hideFooter
            data-testid="epis2-ui-catalog-grid"
          />
        </CatalogSection>

        <CatalogSection title="Formularios clínicos (MUI-04)">
          <Stack spacing={2}>
            <EpisDraftStatus status="ready_for_review" />
            <EpisAiDisclosure />
            <EpisClinicalForm
              blueprint={getBlueprintById('evolution_note')!}
              values={initialFormValues(getBlueprintById('evolution_note')!)}
              onChange={() => {}}
            />
            <EpisApprovalGate
              status="ready_for_review"
              canEdit
              canApprove
              showSendToReview={false}
              onApprove={() => {}}
            />
          </Stack>
        </CatalogSection>

        <CatalogSection title="Command-first (MUI-03)">
          <Stack spacing={2}>
            <EpisCommandBar
              label="Instrucción clínica"
              placeholder="Ej.: evoluciona al paciente"
              submitLabel="Continuar"
              value=""
              onChange={() => {}}
              onSubmit={() => {}}
              roleLabel="Médico demo"
              aiAvailable={true}
              aiHint="IA local activa — asistencia en borrador."
            />
            <EpisCommandSuggestions
              role="physician"
              permissions={['command.execute', 'ai.read', 'dashboard.read']}
              aiAvailable
              onSelect={() => {}}
            />
          </Stack>
        </CatalogSection>

        <CatalogSection title="Estados">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <EpisCard sx={{ flex: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Carga
              </Typography>
              <EpisLoadingState label="Cargando datos clínicos…" />
            </EpisCard>
            <EpisCard sx={{ flex: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Vacío
              </Typography>
              <EpisEmptyState
                title="Sin resultados"
                description="No hay documentos para este criterio."
              />
            </EpisCard>
          </Stack>
        </CatalogSection>
      </Stack>
    </Box>
  );
}
