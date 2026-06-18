import type { ReactNode } from 'react';
import type { ClinicalLayoutAction } from '../layout/clinical/clinicalLayoutEngine.js';
import type { CicaScreenId } from './cicaRoutes.js';

export type CicaBlueprintSectionSpan = 4 | 6 | 12;

/** Sección declarativa — generada por CicaGeneratedScreen (MD3 grilla 12). */
export type CicaBlueprintSection = {
  id: string;
  title?: string;
  subtitle?: string;
  span?: CicaBlueprintSectionSpan;
  placeholder?: string;
};

/** Blueprint de pantalla CICA — datos/contratos en web; layout en epis2-ui. */
export type CicaScreenBlueprint = {
  screenId: CicaScreenId;
  hideActionBar?: boolean;
  sections: readonly CicaBlueprintSection[];
};

export type CicaGeneratedScreenProps = {
  blueprint: CicaScreenBlueprint;
  title?: string;
  subtitle?: string;
  slots?: Partial<Record<string, ReactNode>>;
  actions?: readonly ClinicalLayoutAction[];
  testId?: string;
};
