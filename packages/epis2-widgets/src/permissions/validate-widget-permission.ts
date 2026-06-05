import type { ClinicalRole } from '@epis2/clinical-domain';
import type { WidgetDefinition } from '../contracts/widget-definition.js';

export type WidgetPermissionResult = {
  allowed: boolean;
  reason: 'allowed' | 'missing-role' | 'role-forbidden';
};

export function validateWidgetPermission(
  widget: WidgetDefinition,
  role: ClinicalRole | undefined,
): WidgetPermissionResult {
  if (!role) {
    return { allowed: false, reason: 'missing-role' };
  }
  if (!widget.allowedRoles.includes(role)) {
    return { allowed: false, reason: 'role-forbidden' };
  }
  return { allowed: true, reason: 'allowed' };
}
