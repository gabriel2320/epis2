import type { ReactNode } from 'react';
import type {
  ClinicalLayoutAction,
  ClinicalLayoutActionKind,
} from '../layout/clinical/clinicalLayoutEngine.js';
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

/** Acción declarativa — onClick se resuelve en web (`buildCicaBlueprintActions`). */
export type CicaBlueprintAction = {
  id: string;
  label?: string;
  kind: ClinicalLayoutActionKind;
  /** Navegación CICA con patientId del contexto. */
  targetScreenId?: CicaScreenId;
  /** Etiqueta desde `primaryAction` del registry (destino o pantalla actual). */
  useRegistryPrimary?: boolean;
  /** Ruta legacy fuera de `/app/*` — resuelta en web. */
  legacyPath?: string;
  legacySearch?: Record<string, string>;
  testId?: string;
};

/** Blueprint de pantalla CICA — datos/contratos en web; layout en epis2-ui. */
export type CicaScreenBlueprint = {
  screenId: CicaScreenId;
  hideActionBar?: boolean;
  sections: readonly CicaBlueprintSection[];
  actions?: readonly CicaBlueprintAction[];
};

export type CicaGeneratedScreenProps = {
  blueprint: CicaScreenBlueprint;
  title?: string;
  subtitle?: string;
  slots?: Partial<Record<string, ReactNode>>;
  actions?: readonly ClinicalLayoutAction[];
  testId?: string;
};
