import type { ClinicalRole } from '@epis2/clinical-domain';
import type { SessionResponse } from '@epis2/contracts';
import type { WidgetContext, WidgetSurface } from '@epis2/epis2-widgets';

export type BuildWidgetContextInput = {
  surface: WidgetSurface;
  session: SessionResponse | null;
  patientId?: string;
  encounterId?: string;
  explicitlyShownWidgetIds?: readonly string[];
  offline?: boolean;
};

export function buildWidgetContext({
  surface,
  session,
  patientId,
  encounterId,
  explicitlyShownWidgetIds,
  offline,
}: BuildWidgetContextInput): WidgetContext {
  return {
    surface,
    userId: session?.user.id,
    role: session?.user.role as ClinicalRole | undefined,
    patientId,
    encounterId,
    explicitlyShownWidgetIds,
    offline,
  };
}
