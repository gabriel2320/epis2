import { z } from 'zod';

/**
 * MF-184: catálogo clínico consultable por roles clínicos (autocomplete).
 * Expone solo entryCode/label del staging promovido (MF-172/MF-183); el
 * payload drug-intel completo queda en la capa admin.
 */

export const clinicalCatalogEntrySchema = z.object({
  entryCode: z.string().min(1),
  label: z.string().min(1),
});

export const medicationCatalogSearchResponseSchema = z.object({
  readOnly: z.literal(true),
  catalogCode: z.literal('medication'),
  entries: z.array(clinicalCatalogEntrySchema),
});

export type ClinicalCatalogEntry = z.infer<typeof clinicalCatalogEntrySchema>;
export type MedicationCatalogSearchResponse = z.infer<typeof medicationCatalogSearchResponseSchema>;
