import { copy } from '@epis2/design-system';
import {
  CicaBookPager,
  CicaLetterPageShell,
  CicaScreenFrame,
  EpisM3Text,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { ErrorState } from '../components/ErrorState.js';
import {
  evolutionBookPage,
  formatEvolutionPageDate,
  listEvolutionEvents,
} from './cicaEvolutionBook.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';
import { useCicaNavigate } from './hooks/useCicaNavigate.js';

/** CICA — libro de evoluciones (/app/pacientes/:id/evoluciones/libro). */
export function CicaEvolutionBookPage() {
  const page = useCicaPatientPage();
  const { go } = useCicaNavigate();

  const events = useMemo(
    () => listEvolutionEvents(page.longitudinal?.timeline ?? []),
    [page.longitudinal?.timeline],
  );

  const book = useMemo(() => evolutionBookPage(events, 0), [events]);

  if (!page.patientId || !page.presentation) return null;

  if (page.detailQuery.isError) {
    return (
      <ErrorState
        title={copy.errors.genericTitle}
        message={copy.errors.genericMessage}
        onRetry={() => page.detailQuery.refetch()}
      />
    );
  }

  if (events.length === 0) {
    return (
      <CicaScreenFrame screenId="evolution-book" title="Libro de evoluciones" hideActionBar>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {copy.longitudinal.emptySection}
          </Typography>
        </Stack>
      </CicaScreenFrame>
    );
  }

  const current = book.current;
  if (!current) return null;

  const patientLabel = page.presentation.identity.displayName;

  return (
    <Stack sx={{ flex: 1, minHeight: 0 }} data-testid="cica-evolution-book-screen">
      <CicaBookPager
        centerLabel={formatEvolutionPageDate(current.at)}
        pageHint={`Página ${book.index + 1} de ${book.total}`}
        onPrevious={
          book.older
            ? () =>
                go('evolution-detail', {
                  patientId: page.patientId!,
                  evolutionId: book.older!.id,
                })
            : undefined
        }
        onNext={
          book.newer
            ? () =>
                go('evolution-detail', {
                  patientId: page.patientId!,
                  evolutionId: book.newer!.id,
                })
            : undefined
        }
        previousLabel="← Evolución anterior"
        nextLabel="Evolución siguiente →"
      />
      <CicaLetterPageShell
        title={current.title}
        subtitle={patientLabel}
        statusLabel="Lectura clínica"
        onBack={() => go('patient-evolutions', { patientId: page.patientId! })}
        backLabel="Volver a lista"
        hideActionBar
      >
        <Stack spacing={2}>
          <EpisM3Text role="bodyMedium" color="text.secondary">
            {formatEvolutionPageDate(current.at)}
          </EpisM3Text>
          <EpisM3Text role="bodyLarge" component="div">
            {current.detail?.trim() || copy.longitudinal.emptySection}
          </EpisM3Text>
        </Stack>
      </CicaLetterPageShell>
    </Stack>
  );
}
