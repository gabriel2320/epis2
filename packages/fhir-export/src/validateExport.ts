import { findUiOnlyKeys } from './uiForbidden.js';
import {
  validateMinsalDocumentReferenceResource,
  validateMinsalEncounterResource,
  validateMinsalPatientResource,
} from './minsalExport.js';
import {
  validateDocumentReferenceResource,
  validateEncounterResource,
  validatePatientResource,
  validateMedicationRequestResource,
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
      const minsal = validateMinsalPatientResource(resource);
      if (minsal.ok) break;
      const v = validatePatientResource(resource);
      if (!v.ok) return { ok: false, profileErrors: v.errors };
      break;
    }
    case 'Encounter': {
      const minsal = validateMinsalEncounterResource(resource);
      if (minsal.ok) break;
      const v = validateEncounterResource(resource);
      if (!v.ok) return { ok: false, profileErrors: v.errors };
      break;
    }
    case 'DocumentReference': {
      const minsal = validateMinsalDocumentReferenceResource(resource);
      if (minsal.ok) break;
      const v = validateDocumentReferenceResource(resource);
      if (!v.ok) return { ok: false, profileErrors: v.errors };
      break;
    }
    case 'ServiceRequest': {
      const v = validateServiceRequestResource(resource);
      if (!v.ok) return { ok: false, profileErrors: v.errors };
      break;
    }
    case 'MedicationRequest': {
      const v = validateMedicationRequestResource(resource);
      if (!v.ok) return { ok: false, profileErrors: v.errors };
      break;
    }
    case 'AllergyIntolerance':
    case 'MedicationStatement': {
      const r = resource as {
        resourceType?: string;
        id?: string;
        patient?: unknown;
        subject?: unknown;
      };
      if (!r.id || (!r.patient && !r.subject)) {
        return { ok: false, profileErrors: 'recurso longitudinal incompleto' };
      }
      break;
    }
    case 'Provenance': {
      const r = resource as { id?: string; target?: unknown[]; recorded?: string };
      if (!r.id || !r.target?.length || !r.recorded) {
        return { ok: false, profileErrors: 'Provenance incompleto' };
      }
      break;
    }
    case 'Device': {
      const r = resource as { id?: string; deviceName?: unknown[] };
      if (!r.id || !r.deviceName?.length) {
        return { ok: false, profileErrors: 'Device incompleto' };
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
