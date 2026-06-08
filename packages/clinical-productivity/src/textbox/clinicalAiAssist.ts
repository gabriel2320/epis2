import { z } from 'zod';
import { parseStructuredAiOutput } from '../schemas/structuredOutput.js';

export const soapStructureSchema = z.object({
  subjective: z.string(),
  objective: z.string(),
  assessment: z.string(),
  plan: z.string(),
  requiresHumanReview: z.literal(true),
});

export const clinicalOmissionSchema = z.object({
  omissions: z.array(z.string()),
  requiresHumanReview: z.literal(true),
});

export type SoapStructureOutput = z.infer<typeof soapStructureSchema>;
export type ClinicalOmissionOutput = z.infer<typeof clinicalOmissionSchema>;

export type ClinicalTextboxAiAction = 'reformulate' | 'soap' | 'omissions';

/** Convierte texto libre a plantilla SOAP — sugerencia editable, no SoT. */
export function suggestSoapFromFreeText(freeText: string): SoapStructureOutput {
  const trimmed = freeText.trim();
  return {
    subjective: trimmed.slice(0, Math.min(400, trimmed.length)),
    objective: '',
    assessment: '',
    plan: '',
    requiresHumanReview: true,
  };
}

export function formatSoapSuggestion(data: SoapStructureOutput): string {
  return `S:\n${data.subjective}\n\nO:\n${data.objective || '(completar)'}\n\nA:\n${data.assessment || '(completar)'}\n\nP:\n${data.plan || '(completar)'}\n\n[Sugerencia IA — revisar antes de guardar]`;
}

/** Detecta omisiones heurísticas — no bloquea guardado. */
export function detectClinicalOmissions(text: string): ClinicalOmissionOutput {
  const omissions: string[] = [];
  if (!/alerg/i.test(text)) omissions.push('Sin mención explícita de alergias');
  if (text.length > 80 && !/plan/i.test(text)) omissions.push('Sin plan explícito');
  return { omissions, requiresHumanReview: true };
}

export function reformulateClinicalText(text: string): string {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length <= 1) return `${text.trim()}\n\n[Sugerencia IA — revisar]`;
  return `${sentences.join(' ')}\n\n[Sugerencia IA — revisar]`;
}

export function parseAiSoapOutput(raw: unknown) {
  return parseStructuredAiOutput(soapStructureSchema, raw);
}

/** Fármacos/dosis/unidades/alergias nunca se aplican sin confirmación explícita. */
export function requiresMedicationConfirmation(category: string): boolean {
  return ['medication', 'unit', 'allergy'].includes(category);
}
