import { copy } from '@epis2/design-system';
import type { ClinicalNavigateOptions } from '../routes/clinicalNavigate.js';
import { classicModeSearch } from '../modes/episModeSearch.js';

export type ClassicNavDestination = {
  id: string;
  label: string;
  group?: 'primary' | 'more';
  target: (patientId?: string) => ClinicalNavigateOptions;
};

export const CLASSIC_LEFT_NAV_DESTINATIONS: readonly ClassicNavDestination[] = [
  {
    id: 'summary',
    label: copy.classicMd3.navSummary,
    group: 'primary',
    target: (patientId) => ({
      to: '/espacio/ficha',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'history',
    label: copy.classicMd3.navHistory,
    group: 'primary',
    target: (patientId) => ({
      to: '/espacio/resumen',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'evolution',
    label: copy.classicMd3.navEvolution,
    group: 'primary',
    target: (patientId) => ({
      to: '/espacio/evolucion',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'orders',
    label: copy.classicMd3.navOrders,
    group: 'primary',
    target: (patientId) => ({
      to: '/espacio/receta',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'medications',
    label: copy.classicMd3.navMedications,
    group: 'primary',
    target: (patientId) => ({
      to: '/espacio/farmacia',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'labs',
    label: copy.classicMd3.navLabs,
    group: 'primary',
    target: (patientId) => ({
      to: '/espacio/resultados',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'imaging',
    label: copy.classicMd3.navImaging,
    group: 'more',
    target: (patientId) => ({
      to: '/espacio/imagenologia',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'procedures',
    label: copy.classicMd3.navProcedures,
    group: 'more',
    target: (patientId) => ({
      to: '/espacio/procedimiento',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'interconsult',
    label: copy.classicMd3.navInterconsult,
    group: 'more',
    target: (patientId) => ({
      to: '/espacio/interconsulta',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'nursing',
    label: copy.classicMd3.navNursing,
    group: 'more',
    target: (patientId) => ({
      to: '/espacio/enfermeria',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'documents',
    label: copy.classicMd3.navDocuments,
    group: 'more',
    target: (patientId) => ({
      to: '/espacio/ficha',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'admin',
    label: copy.classicMd3.navAdmin,
    group: 'more',
    target: () => ({
      to: '/epis2/dashboard',
      search: { tab: 'work', view: 'classic' as const },
    }),
  },
];

export const CLASSIC_ACTION_RAIL_DESTINATIONS: readonly ClassicNavDestination[] = [
  {
    id: 'rail-history',
    label: copy.classicMd3.railHistory,
    target: (patientId) => ({
      to: '/espacio/resumen',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'rail-labs',
    label: copy.classicMd3.railLabs,
    target: (patientId) => ({
      to: '/espacio/resultados',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'rail-imaging',
    label: copy.classicMd3.railImaging,
    target: (patientId) => ({
      to: '/espacio/imagenologia',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'rail-meds',
    label: copy.classicMd3.railMeds,
    target: (patientId) => ({
      to: '/espacio/farmacia',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
  {
    id: 'rail-documents',
    label: copy.classicMd3.railDocuments,
    target: (patientId) => ({
      to: '/espacio/ficha',
      search: classicModeSearch(patientId ? { patientId } : {}, true),
    }),
  },
];
