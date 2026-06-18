import {
  CicaBlueprintBody,
  CicaScreenFrame,
  type ClinicalLayoutAction,
  type CicaScreenBlueprint,
} from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

export type CicaActionFormBlueprintPageProps = {
  blueprint: CicaScreenBlueprint;
  title: string;
  subtitle?: string;
  identityBand?: ReactNode;
  contextStrip?: ReactNode;
  actions?: readonly ClinicalLayoutAction[];
  slots: Partial<Record<string, ReactNode>>;
  testId?: string;
};

/** Formulario de acción CICA — shell + grilla blueprint (layout automatizado). */
export function CicaActionFormBlueprintPage({
  blueprint,
  title,
  subtitle,
  identityBand,
  contextStrip,
  actions = [],
  slots,
  testId,
}: CicaActionFormBlueprintPageProps) {
  return (
    <CicaScreenFrame
      screenId={blueprint.screenId}
      title={title}
      {...(subtitle ? { subtitle } : {})}
      {...(identityBand ? { identityBand } : {})}
      {...(contextStrip ? { contextStrip } : {})}
      actions={actions}
      hideActionBar={blueprint.hideActionBar ?? actions.length === 0}
      testId={testId ?? `cica-screen-${blueprint.screenId}`}
    >
      <CicaBlueprintBody blueprint={blueprint} slots={slots} />
    </CicaScreenFrame>
  );
}
