import type { ClinicalRole } from '@epis2/clinical-domain';
import type { ClinicalIntent } from '@epis2/command-registry';

export type ScaffoldBlueprintInput = {
  blueprintId: string;
  routeSegment: string;
  label: string;
  purpose: string;
  intentId: ClinicalIntent;
  roles: readonly ClinicalRole[];
};

/** Genera módulo blueprint inicial para pegar en `blueprints/` (MF-156). */
export function scaffoldBlueprintModule(input: ScaffoldBlueprintInput): string {
  const exportName = `${toCamelCase(input.blueprintId)}Blueprint`;
  const roles = input.roles.map((r) => `'${r}'`).join(', ');

  return `import { defineBlueprint, field, section } from '../factory.js';

export const ${exportName} = defineBlueprint({
  blueprintId: '${input.blueprintId}',
  label: '${input.label}',
  purpose: '${input.purpose}',
  intentIds: ['${input.intentId}'],
  allowedRoles: [${roles}],
  routePath: '/espacio/${input.routeSegment}',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: false,
  sections: [
    section('main', '${input.label}', ['clinicalSummary']),
  ],
  fields: [
    field('clinicalSummary', 'Resumen clínico', 'textarea', true),
  ],
  validations: [{ fieldId: 'clinicalSummary', message: 'Resumen requerido' }],
});
`;
}

function toCamelCase(id: string): string {
  return id
    .split(/[_-]/)
    .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('');
}
