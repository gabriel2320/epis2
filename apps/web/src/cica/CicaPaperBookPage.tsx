import { copy } from '@epis2/design-system';
import {
  EpisButton,
  EpisDemoBadgeChip,
  EpisM3Text,
  PaperCanvas,
  PaperModeScreen,
  PaperModeToolbar,
  Stack,
  todayIsoDate,
} from '@epis2/epis2-ui';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';
import { useCicaNavigate } from './hooks/useCicaNavigate.js';

/** CICA - indice del libro clinico / modo papel estructural. */
export function CicaPaperBookPage() {
  const page = useCicaPatientPage();
  const { go } = useCicaNavigate();

  if (!page.patientId || !page.presentation) return null;

  const today = todayIsoDate();
  const patientId = page.patientId;
  const identity = page.presentation.identity;

  return (
    <PaperModeScreen
      toolbar={
        <PaperModeToolbar>
          <EpisButton
            appearance="text"
            size="small"
            data-testid="cica-paper-book-back-chart"
            onClick={() => go('patient-summary', { patientId })}
          >
            {copy.clinicalBreadcrumb.backToFicha}
          </EpisButton>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
          >
            <EpisDemoBadgeChip label={copy.demoBadge} />
            <EpisM3Text role="labelMedium" color="text.secondary">
              BORRADOR
            </EpisM3Text>
          </Stack>
        </PaperModeToolbar>
      }
      testId="cica-paper-book-screen"
    >
      <PaperCanvas watermark={`${copy.demoBadge} / BORRADOR`}>
        <Stack spacing={3} sx={{ minWidth: 0 }}>
          <Stack
            spacing={0.75}
            sx={{
              pb: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <EpisM3Text role="labelMedium" color="text.secondary">
              Modo papel
            </EpisM3Text>
            <EpisM3Text role="titleLarge" component="h1" sx={{ fontWeight: 650 }}>
              Libro clinico
            </EpisM3Text>
            <EpisM3Text role="bodyMedium" color="text.secondary" sx={{ maxWidth: 680 }}>
              Indice documental del episodio. Agrupa hojas diarias y evoluciones como paginas
              revisables antes de imprimir.
            </EpisM3Text>
          </Stack>

          <Stack spacing={0.5}>
            <EpisM3Text role="labelMedium" color="text.secondary">
              Paciente
            </EpisM3Text>
            <EpisM3Text role="titleMedium" sx={{ fontWeight: 650 }}>
              {identity.displayName}
            </EpisM3Text>
            <EpisM3Text role="bodyMedium" color="text.secondary">
              {identity.metaLine}
            </EpisM3Text>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ maxWidth: 560 }}>
            <EpisButton
              appearance="filled"
              onClick={() => go('paper-day', { patientId, date: today })}
              data-testid="cica-paper-book-open-today"
            >
              Abrir hoja de hoy
            </EpisButton>
            <EpisButton
              appearance="outlined"
              onClick={() => go('evolution-book', { patientId })}
              data-testid="cica-paper-book-open-evolutions"
            >
              Libro de evoluciones
            </EpisButton>
          </Stack>
        </Stack>
      </PaperCanvas>
    </PaperModeScreen>
  );
}
