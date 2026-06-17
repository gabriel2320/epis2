import { copy } from '@epis2/design-system';
import { CicaScreenFrame, EpisButton, EpisM3Text, Stack, todayIsoDate } from '@epis2/epis2-ui';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';
import { useCicaNavigate } from './hooks/useCicaNavigate.js';

/** CICA — índice del libro clínico / modo papel estructural. */
export function CicaPaperBookPage() {
  const page = useCicaPatientPage();
  const { go } = useCicaNavigate();

  if (!page.patientId || !page.presentation) return null;

  const today = todayIsoDate();

  return (
    <CicaScreenFrame
      screenId="paper-book"
      title="Libro clínico"
      subtitle="Modo papel — navegación por días y evoluciones"
      hideActionBar
      testId="cica-paper-book-screen"
    >
      <Stack spacing={2} sx={{ maxWidth: 560 }}>
        <EpisM3Text role="bodyMedium" color="text.secondary">
          El libro clínico agrupa hojas diarias y evoluciones como páginas. Empieza por la hoja de
          hoy o abre el libro de evoluciones.
        </EpisM3Text>
        <EpisButton
          variant="contained"
          onClick={() => go('paper-day', { patientId: page.patientId!, date: today })}
          data-testid="cica-paper-book-open-today"
        >
          Abrir hoja de hoy
        </EpisButton>
        <EpisButton
          variant="outlined"
          onClick={() => go('evolution-book', { patientId: page.patientId! })}
          data-testid="cica-paper-book-open-evolutions"
        >
          Libro de evoluciones
        </EpisButton>
        <EpisButton
          appearance="text"
          onClick={() => go('patient-summary', { patientId: page.patientId! })}
        >
          {copy.clinicalBreadcrumb.backToFicha}
        </EpisButton>
      </Stack>
    </CicaScreenFrame>
  );
}
