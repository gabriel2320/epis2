import { findUiOnlyKeys } from './uiForbidden.js';
import {
  validateDocumentReferenceResource,
  validateEncounterResource,
  validatePatientResource,
  validateServiceRequestResource,
} from './profile.js';

export type ExportValidationResult =
  | { ok: true }
  | { ok: false; uiOnlyKeys?: string[]; profileErrors?: unknown };

export function assertExportClean(resource: unknown): ExportValidationResult {
  const uiOnlyKeys = findUiOnlyKeys(resource);
  if (uiOnlyKeys.length > 0) {
    return { ok: false, uiOnlyKeys };
  }

  const r = resource as { resourceType?: string };
  switch (r.resourceType) {
    case 'Patient': {
      const v = validatePatientResource(resource);
      if (!v.ok) return { ok: false, profileErrors: v.errors };
      break;
    }
    case 'Encounter': {
      const v = validateEncounterResource(resource);
      if (!v.ok) return { ok: false, profileErrors: v.errors };
      break;
    }
    case 'DocumentReference': {
      const v = validateDocumentReferenceResource(resource);
      if (!v.ok) return { ok: false, profileErrors: v.errors };
      break;
    }
    case 'ServiceRequest': {
      const v = validateServiceRequestResource(resource);
      if (!v.ok) return { ok: false, profileErrors: v.errors };
      break;
    }
    case 'AllergyIntolerance':
    case 'MedicationStatement': {
      const r = resource as { resourceType?: string; id?: string; patient?: unknown; subject?: unknown };
      if (!r.id || (!r.patient && !r.subject)) {
        return { ok: false, profileErrors: 'recurso longitudinal incompleto' };
      }
      break;
    }
    case 'Bundle': {
      const bundle = resource as { entry?: { resource: unknown }[] };
      for (const entry of bundle.entry ?? []) {
        const inner = assertExportClean(entry.resource);
        if (!inner.ok) return inner;
      }
      break;
    }
    default:
      return { ok: false, profileErrors: `resourceType no soportado: ${r.resourceType}` };
  }

  return { ok: true };
}
