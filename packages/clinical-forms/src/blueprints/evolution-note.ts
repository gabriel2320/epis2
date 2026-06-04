import { defineBlueprint, field, section } from '../factory.js';

export const evolutionNoteBlueprint = defineBlueprint({
  blueprintId: 'evolution_note',
  label: 'Evolución médica',
  purpose: 'Nota de evolución S/O/A/P con borrador humano',
  intentIds: ['create_evolution_draft'],
  allowedRoles: ['physician', 'nurse'],
  routePath: '/espacio/evolucion',
  outputKind: 'CLINICAL_NOTE_DRAFT',
  requiresPatient: true,
  requiresEncounter: true,
  sections: [section('soap', 'Evolución', ['subjective', 'objective', 'assessment', 'plan'])],
  fields: [
    field('subjective', 'Subjetivo', 'textarea', true),
    field('objective', 'Objetivo', 'textarea'),
    field('assessment', 'Análisis', 'textarea', true),
    field('plan', 'Plan', 'textarea', true),
  ],
  validations: [
    { fieldId: 'subjective', message: 'Subjetivo requerido' },
    { fieldId: 'plan', message: 'Plan requerido' },
  ],
});
