import { copy } from '@epis2/design-system';
import { CicaClinicalList, CicaGeneratedScreen, EpisM3Text, EpisTextField } from '@epis2/epis2-ui';
import { useEffect, useMemo, useState } from 'react';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { usePatientsQuery } from '../query/hooks/usePatientsQuery.js';
import { CENSUS_BLUEPRINT } from './blueprints/systemScreens.blueprint.js';
import { mapPatientRowsToCicaListItems } from './cicaPatientListPresentation.js';
import { useCicaNavigate } from './hooks/useCicaNavigate.js';

/** Censo — blueprint + lista (contratos API). */
export function CicaCensusPage() {
  const { go } = useCicaNavigate();
  const { setPatient: pinPatient } = useActivePatient();
  const { patients, refetch, error: patientsError } = usePatientsQuery({ enabled: true });
  const [query, setQuery] = useState('');

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const listItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const mapped = mapPatientRowsToCicaListItems(patients);
    if (!needle) return mapped;
    return mapped.filter(
      (item) =>
        item.primaryLabel.toLowerCase().includes(needle) ||
        (item.secondaryLabel ?? '').toLowerCase().includes(needle),
    );
  }, [patients, query]);

  const openChart = (patientId: string) => {
    const row = patients.find((p) => p.id === patientId);
    if (row) pinPatient(row);
    go('patient-summary', { patientId });
  };

  return (
    <CicaGeneratedScreen
      blueprint={CENSUS_BLUEPRINT}
      title={copy.clinicalNav.census}
      subtitle={copy.commandCenter.openPatientChart}
      slots={{
        intro: (
          <EpisM3Text role="bodyMedium" color="text.secondary">
            Seleccione un paciente hospitalizado para abrir la ficha clínica.
          </EpisM3Text>
        ),
        filter: (
          <EpisTextField
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.chartModes.censusCommandPlaceholder}
            inputProps={{ 'data-testid': 'cica-census-search-input' }}
          />
        ),
        list: (
          <CicaClinicalList
            items={listItems}
            emptyMessage={
              patientsError != null ? copy.forms.loadPatientsError : copy.forms.searchPatient
            }
            actionLabel={copy.commandCenter.openPatientChart}
            onOpenItem={openChart}
            testId="cica-census-list"
          />
        ),
      }}
    />
  );
}
