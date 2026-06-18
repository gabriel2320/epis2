import { copy } from '@epis2/design-system';
import { CicaGeneratedScreen, EpisButton, EpisM3Text, Stack, todayIsoDate } from '@epis2/epis2-ui';
import { PAPER_BOOK_BLUEPRINT } from './blueprints/paperScreens.blueprint.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';
import { useCicaNavigate } from './hooks/useCicaNavigate.js';

/** CICA — índice del libro clínico / modo papel estructural. */
export function CicaPaperBookPage() {
  const page = useCicaPatientPage();
  const { go } = useCicaNavigate();

  if (!page.patientId || !page.presentation) return null;

  const today = todayIsoDate();
  const patientId = page.patientId;

  return (
    <CicaGeneratedScreen
      blueprint={PAPER_BOOK_BLUEPRINT}
      title="Libro clínico"
      subtitle="Modo papel — navegación por días y evoluciones"
      testId="cica-paper-book-screen"
      slots={{
        intro: (
          <EpisM3Text role="bodyMedium" color="text.secondary">
            El libro clínico agrupa hojas diarias y evoluciones como páginas. Empieza por la hoja de
            hoy o abre el libro de evoluciones.
          </EpisM3Text>
        ),
        actions: (
          <Stack spacing={2} sx={{ maxWidth: 560 }}>
            <EpisButton
              variant="contained"
              onClick={() => go('paper-day', { patientId, date: today })}
              data-testid="cica-paper-book-open-today"
            >
              Abrir hoja de hoy
            </EpisButton>
            <EpisButton
              variant="outlined"
              onClick={() => go('evolution-book', { patientId })}
              data-testid="cica-paper-book-open-evolutions"
            >
              Libro de evoluciones
            </EpisButton>
            <EpisButton appearance="text" onClick={() => go('patient-summary', { patientId })}>
              {copy.clinicalBreadcrumb.backToFicha}
            </EpisButton>
          </Stack>
        ),
      }}
    />
  );
}
