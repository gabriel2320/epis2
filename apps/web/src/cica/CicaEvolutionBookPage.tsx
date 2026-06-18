import { copy } from '@epis2/design-system';
import {
  CicaBookPager,
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
import { CicaActionFormBlueprintPage } from './CicaActionFormBlueprintPage.js';
import { CicaLetterBlueprintPage } from './CicaLetterBlueprintPage.js';
import {
  EVOLUTION_BOOK_BLUEPRINT,
  EVOLUTION_BOOK_EMPTY_BLUEPRINT,
} from './blueprints/actionFormScreens.blueprint.js';
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
      <CicaActionFormBlueprintPage
        blueprint={EVOLUTION_BOOK_EMPTY_BLUEPRINT}
        title="Libro de evoluciones"
        slots={{
          main: (
            <Typography variant="body2" color="text.secondary">
              {copy.longitudinal.emptySection}
            </Typography>
          ),
        }}
        testId="cica-evolution-book-empty"
      />
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
      <CicaLetterBlueprintPage
        blueprint={EVOLUTION_BOOK_BLUEPRINT}
        title={current.title}
        subtitle={patientLabel}
        statusLabel="Lectura clínica"
        onBack={() => go('patient-evolutions', { patientId: page.patientId! })}
        backLabel="Volver a lista"
        slots={{
          meta: (
            <EpisM3Text role="bodyMedium" color="text.secondary">
              {formatEvolutionPageDate(current.at)}
            </EpisM3Text>
          ),
          body: (
            <EpisM3Text role="bodyLarge" component="div">
              {current.detail?.trim() || copy.longitudinal.emptySection}
            </EpisM3Text>
          ),
        }}
      />
    </Stack>
  );
}
