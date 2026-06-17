import type { ReactNode } from 'react';
import type {
  ClinicalLayoutAction,
  ClinicalLayoutProfile,
} from '../layout/clinical/clinicalLayoutEngine.js';
import { ClinicalScreen } from '../layout/clinical/ClinicalScreen.js';
import { findCicaScreenById } from './EPIS_CICA_SCREEN_REGISTRY.js';
import type { CicaScreenId } from './cicaRoutes.js';
import { CicaScreenTransition } from './CicaScreenTransition.js';

export type CicaScreenFrameProps = {
  /** ID en EPIS_CICA_SCREEN_REGISTRY — define profile y testId base. */
  screenId: CicaScreenId;
  title?: string;
  subtitle?: string;
  identityBand?: ReactNode;
  contextStrip?: ReactNode;
  tabs?: ReactNode;
  toolbar?: ReactNode;
  actions?: readonly ClinicalLayoutAction[];
  hideActionBar?: boolean;
  /** Envuelve children con entrada sutil (p. ej. cambio de sección). */
  animateContent?: boolean;
  /** Clave para re-disparar transición; por defecto screenId. */
  contentTransitionKey?: string;
  children: ReactNode;
  testId?: string;
};

/**
 * Envoltura declarativa CICA — lee layoutProfile del registry.
 * Modificar una pantalla: registry + contenido en children.
 */
export function CicaScreenFrame({
  screenId,
  title,
  subtitle,
  identityBand,
  contextStrip,
  tabs,
  toolbar,
  actions = [],
  hideActionBar = false,
  animateContent = false,
  contentTransitionKey,
  children,
  testId,
}: CicaScreenFrameProps) {
  const screen = findCicaScreenById(screenId);
  if (!screen) {
    throw new Error(`CicaScreenFrame: screenId "${screenId}" no está en el registry`);
  }

  const body = animateContent ? (
    <CicaScreenTransition
      transitionKey={contentTransitionKey ?? screenId}
      testId={`${testId ?? `cica-screen-${screenId}`}-content-transition`}
    >
      {children}
    </CicaScreenTransition>
  ) : (
    children
  );

  return (
    <ClinicalScreen
      profile={screen.layoutProfile as ClinicalLayoutProfile}
      {...(title ? { title } : {})}
      {...(subtitle ? { subtitle } : {})}
      {...(identityBand ? { identityBand } : {})}
      {...(contextStrip ? { contextStrip } : {})}
      {...(tabs ? { tabs } : {})}
      {...(toolbar ? { toolbar } : {})}
      actions={actions}
      hideActionBar={hideActionBar || actions.length === 0}
      testId={testId ?? `cica-screen-${screenId}`}
    >
      {body}
    </ClinicalScreen>
  );
}
