import type { ClinicalSafetyInput, SafetyWarning } from "./types.js";

const BETA_LACTAM_ALLERGY = /penicilina|beta\s*-?\s*lact|amoxicilina/i;
const BETA_LACTAM_DRUG = /cef(triaxona|alexin|uroxima|epime|azidima)|amoxicilina|ampicilina|piperacilina|penicilina/i;

const ACE_ARB_DRUG = /enalapril|lisinopril|ramipril|captopril|losartan|valsartan|irbesartan|candesartan|IECA|ARA\s*II/i;

const RENAL_DOSE_DRUG = /vancomicina|gentamicina|amicacina|tobramicina|metformina/i;

function isActive(med: { status?: string }): boolean {
  return (med.status ?? "active").toLowerCase() === "active";
}

function parseCreatinine(labs: ClinicalSafetyInput["labs"]): number | null {
  if (!labs?.length) return null;
  for (const lab of labs) {
    if (!/creatinina/i.test(lab.name)) continue;
    const value = Number.parseFloat(lab.value.replace(",", "."));
    if (Number.isFinite(value)) return value;
  }
  return null;
}

function isPregnancyContext(input: ClinicalSafetyInput): boolean {
  const sex = input.patient?.sex?.toLowerCase();
  if (sex && sex !== "f" && sex !== "female") return false;
  const problems = (input.patient?.activeProblems ?? []).join(" ").toLowerCase();
  return /embarazo|gestante|gestación|pregnancy|pre-?eclampsia|34\s*sem|12\s*sem/i.test(problems);
}

export function checkBetaLactamAllergy(input: ClinicalSafetyInput): SafetyWarning[] {
  const hasBetaAllergy = input.allergies.some((a) => BETA_LACTAM_ALLERGY.test(a.substance));
  if (!hasBetaAllergy) return [];

  const conflicts = input.medications.filter((m) => isActive(m) && BETA_LACTAM_DRUG.test(m.name));
  return conflicts.map((med) => ({
    ruleId: "beta-lactam-cross-reactivity",
    severity: "critical",
    message: "Posible reacción cruzada beta-lactámico",
    detail: `Alergia documentada + medicamento activo: ${med.name}. Revisar alternativa no beta-lactámica.`,
  }));
}

export function checkAceInhibitorInPregnancy(input: ClinicalSafetyInput): SafetyWarning[] {
  if (!isPregnancyContext(input)) return [];

  const conflicts = input.medications.filter((m) => isActive(m) && ACE_ARB_DRUG.test(m.name));
  return conflicts.map((med) => ({
    ruleId: "ace-inhibitor-pregnancy",
    severity: "critical",
    message: "IECA/ARA contraindicado en embarazo",
    detail: `${med.name} activo en contexto gestacional. Suspender y reevaluar anti-hipertensivo seguro en embarazo.`,
  }));
}

export function checkRenalDoseAdjustment(input: ClinicalSafetyInput): SafetyWarning[] {
  const creatinine = parseCreatinine(input.labs);
  if (creatinine === null || creatinine < 2.0) return [];

  const conflicts = input.medications.filter((m) => isActive(m) && RENAL_DOSE_DRUG.test(m.name));
  return conflicts.map((med) => ({
    ruleId: "renal-dose-adjustment",
    severity: "warning",
    message: "Ajuste renal posiblemente requerido",
    detail: `Creatinina ${creatinine} mg/dL con ${med.name} activo. Verificar dosis/intervalo según función renal.`,
  }));
}

export const SAFETY_RULE_IDS = [
  "beta-lactam-cross-reactivity",
  "ace-inhibitor-pregnancy",
  "renal-dose-adjustment",
] as const;
