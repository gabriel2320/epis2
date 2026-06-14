import { z } from 'zod';
import { EPIS2_PROFILES } from './constants.js';

const referenceSchema = z.object({
  reference: z.string().min(1),
});

const metaSchema = z.object({
  profile: z.array(z.string()).optional(),
  tag: z
    .array(
      z.object({
        system: z.string(),
        code: z.string(),
        display: z.string().optional(),
      }),
    )
    .optional(),
});

export const epis2PatientResourceSchema = z.object({
  resourceType: z.literal('Patient'),
  id: z.string().min(1),
  meta: metaSchema,
  identifier: z
    .array(
      z.object({
        system: z.string(),
        value: z.string(),
      }),
    )
    .min(1),
  name: z.array(z.object({ use: z.literal('official'), text: z.string().min(1) })).min(1),
  gender: z.enum(['male', 'female', 'other', 'unknown']),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export const epis2EncounterResourceSchema = z.object({
  resourceType: z.literal('Encounter'),
  id: z.string().min(1),
  meta: metaSchema,
  status: z.enum(['in-progress', 'finished']),
  class: z.object({
    system: z.literal('http://terminology.hl7.org/CodeSystem/v3-ActCode'),
    code: z.literal('AMB'),
  }),
  subject: referenceSchema,
});

export const epis2DocumentReferenceResourceSchema = z.object({
  resourceType: z.literal('DocumentReference'),
  id: z.string().min(1),
  meta: metaSchema,
  status: z.literal('current'),
  type: z.object({
    text: z.string().min(1),
  }),
  subject: referenceSchema.optional(),
  date: z.string().min(20).optional(),
  identifier: z
    .array(
      z.object({
        system: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  content: z
    .array(
      z.object({
        attachment: z.object({
          contentType: z.enum(['text/plain', 'text/markdown']),
          data: z.string().min(1),
          title: z.string().min(1),
        }),
      }),
    )
    .min(1),
});

export const epis2ServiceRequestResourceSchema = z.object({
  resourceType: z.literal('ServiceRequest'),
  id: z.string().min(1),
  meta: metaSchema,
  status: z.literal('active'),
  intent: z.literal('order'),
  priority: z.enum(['routine', 'urgent']).optional(),
  code: z.object({
    text: z.string().min(1),
  }),
  subject: referenceSchema,
  reasonCode: z.array(z.object({ text: z.string() })).optional(),
});

export const epis2MedicationRequestResourceSchema = z.object({
  resourceType: z.literal('MedicationRequest'),
  id: z.string().min(1),
  meta: metaSchema,
  status: z.enum(['active', 'draft', 'completed', 'cancelled']),
  intent: z.literal('order'),
  medicationCodeableConcept: z.object({
    text: z.string().min(1),
  }),
  subject: referenceSchema,
  dosageInstruction: z
    .array(
      z.object({
        text: z.string().optional(),
        patientInstruction: z.string().optional(),
        route: z.object({ text: z.string() }).optional(),
        timing: z
          .object({
            code: z.object({ text: z.string() }).optional(),
          })
          .optional(),
      }),
    )
    .optional(),
  dispenseRequest: z
    .object({
      quantity: z.object({ value: z.number(), unit: z.string().optional() }).optional(),
    })
    .optional(),
});

export const epis2BundleSchema = z.object({
  resourceType: z.literal('Bundle'),
  type: z.literal('collection'),
  meta: metaSchema,
  entry: z.array(
    z.object({
      fullUrl: z.string().url(),
      resource: z.record(z.unknown()),
    }),
  ),
});

export type Epis2PatientResource = z.infer<typeof epis2PatientResourceSchema>;
export type Epis2EncounterResource = z.infer<typeof epis2EncounterResourceSchema>;
export type Epis2DocumentReferenceResource = z.infer<typeof epis2DocumentReferenceResourceSchema>;
export type Epis2ServiceRequestResource = z.infer<typeof epis2ServiceRequestResourceSchema>;
export type Epis2MedicationRequestResource = z.infer<typeof epis2MedicationRequestResourceSchema>;

export function validatePatientResource(resource: unknown) {
  const parsed = epis2PatientResourceSchema.safeParse(resource);
  if (!parsed.success) return { ok: false as const, errors: parsed.error.flatten() };
  if (!parsed.data.meta.profile?.includes(EPIS2_PROFILES.patient)) {
    return { ok: false as const, errors: { formErrors: ['meta.profile Patient requerido'] } };
  }
  return { ok: true as const, resource: parsed.data };
}

export function validateEncounterResource(resource: unknown) {
  const parsed = epis2EncounterResourceSchema.safeParse(resource);
  if (!parsed.success) return { ok: false as const, errors: parsed.error.flatten() };
  if (!parsed.data.meta.profile?.includes(EPIS2_PROFILES.encounter)) {
    return { ok: false as const, errors: { formErrors: ['meta.profile Encounter requerido'] } };
  }
  return { ok: true as const, resource: parsed.data };
}

export function validateDocumentReferenceResource(resource: unknown) {
  const parsed = epis2DocumentReferenceResourceSchema.safeParse(resource);
  if (!parsed.success) return { ok: false as const, errors: parsed.error.flatten() };
  if (!parsed.data.meta.profile?.includes(EPIS2_PROFILES.documentReference)) {
    return {
      ok: false as const,
      errors: { formErrors: ['meta.profile DocumentReference requerido'] },
    };
  }
  return { ok: true as const, resource: parsed.data };
}

export function validateMedicationRequestResource(resource: unknown) {
  const parsed = epis2MedicationRequestResourceSchema.safeParse(resource);
  if (!parsed.success) return { ok: false as const, errors: parsed.error.flatten() };
  if (!parsed.data.meta.profile?.includes(EPIS2_PROFILES.medicationRequest)) {
    return {
      ok: false as const,
      errors: { formErrors: ['meta.profile MedicationRequest requerido'] },
    };
  }
  return { ok: true as const, resource: parsed.data };
}

export function validateServiceRequestResource(resource: unknown) {
  const parsed = epis2ServiceRequestResourceSchema.safeParse(resource);
  if (!parsed.success) return { ok: false as const, errors: parsed.error.flatten() };
  if (!parsed.data.meta.profile?.includes(EPIS2_PROFILES.serviceRequest)) {
    return {
      ok: false as const,
      errors: { formErrors: ['meta.profile ServiceRequest requerido'] },
    };
  }
  return { ok: true as const, resource: parsed.data };
}
