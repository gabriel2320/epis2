import { copy } from '@epis2/design-system';
import type { ClinicalFormRoutePath } from '../../routes/clinicalNavigate.js';

export type PrintableBlueprint = {
  /** Ruta de la vista print del blueprint. */
  to: ClinicalFormRoutePath;
  /** Etiqueta del CTA según formato (Carta / A5) — norma §2. */
  ctaLabel: string;
};

/** Blueprints con vista documental imprimible (norma §29). */
export const PRINTABLE_BLUEPRINTS: Record<string, PrintableBlueprint> = {
  medical_certificate: {
    to: '/espacio/certificado/imprimir',
    ctaLabel: copy.print.previewA5,
  },
  prescription: {
    to: '/espacio/receta/imprimir',
    ctaLabel: copy.print.previewA5,
  },
  discharge_summary: {
    to: '/espacio/epicrisis/imprimir',
    ctaLabel: copy.print.previewLetter,
  },
  lab_request: {
    to: '/espacio/laboratorio/imprimir',
    ctaLabel: copy.print.previewA5,
  },
  imaging_request: {
    to: '/espacio/imagenologia/imprimir',
    ctaLabel: copy.print.previewA5,
  },
};
