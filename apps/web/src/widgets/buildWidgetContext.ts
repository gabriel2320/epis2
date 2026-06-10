import type { ClinicalRole } from '@epis2/clinical-domain';
import type { SessionResponse } from '@epis2/contracts';
import type { WidgetContext, WidgetSurface } from '@epis2/epis2-widgets';

export type BuildWidgetContextInput = {
  surface: WidgetSurface;
  session: SessionResponse | null;
  patientId?: string | undefined;
  encounterId?: string | undefined;
  explicitlyShownWidgetIds?: readonly string[] | undefined;
  offline?: boolean | undefined;
};

export function buildWidgetContext({
  surface,
  session,
  patientId,
  encounterId,
  explicitlyShownWidgetIds,
  offline,
}: BuildWidgetContextInput): WidgetContext {
  const role = session?.user.role as ClinicalRole | undefined;
  return {
    surface,
    ...(session?.user.id !== undefined ? { userId: session.user.id } : {}),
    ...(role !== undefined ? { role } : {}),
    ...(patientId !== undefined ? { patientId } : {}),
    ...(encounterId !== undefined ? { encounterId } : {}),
    ...(explicitlyShownWidgetIds !== undefined ? { explicitlyShownWidgetIds } : {}),
    ...(offline !== undefined ? { offline } : {}),
  };
}
