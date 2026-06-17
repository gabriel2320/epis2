import { copy } from '@epis2/design-system';
import { CicaBookPager, CicaLetterPageShell, EpisM3Text, Stack } from '@epis2/epis2-ui';
import { useMemo } from 'react';
import { useParams } from '@tanstack/react-router';
import { ErrorState } from '../components/ErrorState.js';
import {
  evolutionBookPage,
  formatEvolutionPageDate,
  findEvolutionIndex,
  listEvolutionEvents,
} from './cicaEvolutionBook.js';
import { useCicaPatientPage } from './hooks/useCicaPatientPage.js';
import { useCicaNavigate } from './hooks/useCicaNavigate.js';

/** CICA — evolución individual en página carta. */
export function CicaEvolutionDetailPage() {
  const page = useCicaPatientPage();
  const { go } = useCicaNavigate();
  const params = useParams({ strict: false });
  const evolutionId = typeof params.evolutionId === 'string' ? params.evolutionId : '';

  const events = useMemo(
    () => listEvolutionEvents(page.longitudinal?.timeline ?? []),
    [page.longitudinal?.timeline],
  );

  const book = useMemo(() => {
    const index = findEvolutionIndex(events, evolutionId);
    return evolutionBookPage(events, index);
  }, [events, evolutionId]);

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

  const current = book.current;
  if (!current) {
    return (
      <CicaLetterPageShell
        title="Evolución no encontrada"
        onBack={() => go('patient-evolutions', { patientId: page.patientId! })}
        hideActionBar
      >
        <EpisM3Text role="bodyMedium" color="text.secondary">
          {copy.longitudinal.emptySection}
        </EpisM3Text>
      </CicaLetterPageShell>
    );
  }

  return (
    <Stack sx={{ flex: 1, minHeight: 0 }} data-testid="cica-evolution-detail-screen">
      <CicaBookPager
        centerLabel={formatEvolutionPageDate(current.at)}
        pageHint={`Página ${book.index + 1} de ${book.total}`}
        onPrevious={
          book.older
            ? () =>
                go('evolution-detail', { patientId: page.patientId!, evolutionId: book.older!.id })
            : undefined
        }
        onNext={
          book.newer
            ? () =>
                go('evolution-detail', { patientId: page.patientId!, evolutionId: book.newer!.id })
            : undefined
        }
        previousLabel="← Evolución anterior"
        nextLabel="Evolución siguiente →"
      />
      <CicaLetterPageShell
        title={current.title}
        subtitle={page.presentation.identity.displayName}
        statusLabel="Documento clínico"
        onBack={() => go('patient-evolutions', { patientId: page.patientId! })}
        backLabel="Volver a evoluciones"
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
