import {
  validateAdminPrevision,
  validateAdminRut,
} from '@epis2/clinical-productivity';

export type GeneratedFormAdminError = {
  fieldId: string;
  message: string;
};

/** MF-DI-09 — validaciones admin RUT/previsión en formularios generados. */
export function validateGeneratedFormAdminFields(
  blueprintId: string,
  values: Record<string, string>,
): GeneratedFormAdminError[] {
  const errors: GeneratedFormAdminError[] = [];

  if (blueprintId === 'patient_search') {
    const identifier = values.identifier?.trim() ?? '';
    const rutCheck = validateAdminRut(identifier);
    if (!rutCheck.valid) {
      errors.push({ fieldId: 'identifier', message: rutCheck.message ?? 'RUT inválido' });
    }
  }

  const prevision = values.tipoPrevision?.trim() ?? values.coveragePrevision?.trim() ?? '';
  if (prevision) {
    const previsionCheck = validateAdminPrevision(prevision);
    if (!previsionCheck.valid) {
      errors.push({
        fieldId: values.tipoPrevision ? 'tipoPrevision' : 'coveragePrevision',
        message: previsionCheck.message ?? 'Previsión inválida',
      });
    }
  }

  return errors;
}
