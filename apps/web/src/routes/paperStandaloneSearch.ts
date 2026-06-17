import { parseChartModeSearch, type ChartModeSearch } from './chartModeSearch.js';

/** Ruta exclusiva modo papel (MF-AEST-03). */
export const PAPER_STANDALONE_ROUTE = '/espacio/ficha/papel' as const;

export type PaperStandaloneSearch = ChartModeSearch & {
  patientId?: string | undefined;
  /** Fecha clínica ISO YYYY-MM-DD para navegación diaria. */
  paperDate?: string | undefined;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function parsePaperStandaloneSearch(search: Record<string, unknown>): PaperStandaloneSearch {
  const parsed: PaperStandaloneSearch = {
    ...parseChartModeSearch(search),
  };

  if (typeof search.patientId === 'string' && search.patientId) {
    parsed.patientId = search.patientId;
  }

  if (typeof search.paperDate === 'string' && ISO_DATE.test(search.paperDate)) {
    parsed.paperDate = search.paperDate;
  }

  return parsed;
}

export function resolvePaperDate(search: PaperStandaloneSearch): string {
  if (search.paperDate) return search.paperDate;
  return new Date().toISOString().slice(0, 10);
}

export function shiftPaperDate(isoDate: string, deltaDays: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}
