import { assessLabValue } from '@epis2/lab-dictionary';
import type { ClinicalRuleContext, ClinicalRuleDefinition } from './types.js';

const BETA_LACTAM_PATTERN =
  /penicilina|amoxicilina|ampicilina|cef|piperacilina|meropenem|carbapenem/i;

function textOf(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (value == null) return '';
  return String(value).trim();
}

function hasPenicillinAllergy(ctx: ClinicalRuleContext): boolean {
  const allergies = ctx.patient?.allergies ?? [];
  return allergies.some((a) => /penicilina|beta.?lact|amoxicilina/i.test(a));
}

function medicationNames(ctx: ClinicalRuleContext): string[] {
  const fromLines = (ctx.medications ?? []).map((m) => textOf(m.name)).filter(Boolean);
  const rawMeds = ctx.form?.medications;
  if (Array.isArray(rawMeds)) {
    for (const item of rawMeds) {
      if (typeof item === 'object' && item !== null && 'name' in item) {
        const name = textOf((item as { name?: unknown }).name);
        if (name) fromLines.push(name);
      }
    }
  }
  const single = textOf(ctx.form?.medication ?? ctx.form?.drug);
  if (single) fromLines.push(single);
  return fromLines;
}

/** MF-LX-05 — reglas demo deterministas (sintético). */
export const CLINICAL_RULES_DEMO: readonly ClinicalRuleDefinition[] = [
  {
    id: 'prescription_missing_dose',
    name: 'Receta sin dosis',
    appliesTo: ['prescription', 'prescription_note'],
    severity: 'blocking',
    message: 'Toda prescripción requiere dosis antes de aprobación.',
    evaluate(ctx) {
      if (ctx.draftType !== 'prescription' && ctx.blueprintId !== 'prescription') return false;
      const meds = ctx.medications?.length
        ? ctx.medications
        : [{ name: textOf(ctx.form?.medication), dose: textOf(ctx.form?.dose) }];
      if (meds.length === 0) return true;
      return meds.some((m) => textOf(m.name) && !textOf(m.dose));
    },
  },
  {
    id: 'allergy_beta_lactam_prescription',
    name: 'Alergia beta-lactámico + prescripción relacionada',
    appliesTo: ['prescription'],
    severity: 'critical',
    message: 'Paciente con alergia a penicilina/beta-lactámico: revisar fármaco prescrito.',
    evaluate(ctx) {
      if (ctx.draftType !== 'prescription' && ctx.blueprintId !== 'prescription') return false;
      if (!hasPenicillinAllergy(ctx)) return false;
      return medicationNames(ctx).some((name) => BETA_LACTAM_PATTERN.test(name));
    },
  },
  {
    id: 'critical_potassium_unacknowledged',
    name: 'Potasio crítico no reconocido',
    appliesTo: ['evolution_note', 'prescription', 'discharge_summary', 'patient_summary'],
    severity: 'critical',
    message: 'Potasio en rango crítico: documentar reconocimiento antes de continuar.',
    evaluate(ctx) {
      const labs = ctx.patient?.criticalLabs ?? [];
      for (const lab of labs) {
        if (lab.id !== 'potasio') continue;
        const assessment = assessLabValue('potasio', lab.value);
        if (assessment?.flag.startsWith('critical') && !lab.acknowledged) return true;
      }
      return false;
    },
  },
  {
    id: 'discharge_summary_missing_dx_alta',
    name: 'Epicrisis sin diagnóstico de alta',
    appliesTo: ['discharge_summary'],
    severity: 'blocking',
    message: 'Epicrisis requiere diagnóstico de alta antes de aprobación.',
    evaluate(ctx) {
      if (ctx.draftType !== 'discharge_summary' && ctx.blueprintId !== 'discharge_summary') {
        return false;
      }
      const dx =
        textOf(ctx.form?.dischargeDiagnosis) ||
        textOf(ctx.form?.diagnosticoAlta) ||
        textOf(ctx.form?.diagnosisDischarge);
      return dx.length === 0;
    },
  },
  {
    id: 'evolution_missing_analysis_plan',
    name: 'Evolución sin análisis o plan',
    appliesTo: ['evolution_note'],
    severity: 'warning',
    message: 'Evolución incompleta: falta análisis y/o plan.',
    evaluate(ctx) {
      if (ctx.draftType !== 'evolution_note' && ctx.blueprintId !== 'evolution_note') return false;
      const analysis = textOf(ctx.form?.assessment ?? ctx.form?.analisis);
      const plan = textOf(ctx.form?.plan);
      return !analysis || !plan;
    },
  },
];

export const CLINICAL_RULES_MIN_BLOCKING = 3;
