import type { CommandSlots } from '@epis2/command-registry';
import type { ClinicalFormSearch } from '../routes/clinicalNavigate.js';

export const COMMAND_SLOT_SEARCH_KEYS = [
  'patientHint',
  'medicationHint',
  'studyHint',
  'specialtyHint',
  'bodySiteHint',
  'clinicalReasonHint',
  'noteHint',
  'urgencyHint',
] as const satisfies ReadonlyArray<keyof ClinicalFormSearch>;

export function hasCommandSlotSearchParams(search: ClinicalFormSearch): boolean {
  return COMMAND_SLOT_SEARCH_KEYS.some((key) => {
    const value = search[key];
    return typeof value === 'string' ? value.trim().length > 0 : value !== undefined;
  });
}

/** CE-5: deja solo patientId tras aplicar prefill (evita slots en historial/URL). */
export function stripCommandSlotsFromFormSearch(search: ClinicalFormSearch): ClinicalFormSearch {
  return search.patientId ? { patientId: search.patientId } : {};
}

export function commandSlotsFromFormSearch(search: ClinicalFormSearch): CommandSlots {
  const slots: CommandSlots = {};
  if (search.patientHint) slots.patientHint = search.patientHint;
  if (search.medicationHint) slots.medicationHint = search.medicationHint;
  if (search.studyHint) slots.studyHint = search.studyHint;
  if (search.specialtyHint) slots.specialtyHint = search.specialtyHint;
  if (search.bodySiteHint) slots.bodySiteHint = search.bodySiteHint;
  if (search.clinicalReasonHint) slots.clinicalReasonHint = search.clinicalReasonHint;
  if (search.noteHint) slots.noteHint = search.noteHint;
  if (search.urgencyHint) slots.urgencyHint = search.urgencyHint;
  return slots;
}

type CommandSlotsInput = { [K in keyof CommandSlots]?: CommandSlots[K] | undefined };

export function formSearchFromCommandSlots(
  patientId: string | undefined,
  slots: CommandSlotsInput,
): ClinicalFormSearch {
  const search: ClinicalFormSearch = {};
  if (patientId) search.patientId = patientId;
  if (slots.patientHint) search.patientHint = slots.patientHint;
  if (slots.medicationHint) search.medicationHint = slots.medicationHint;
  if (slots.studyHint) search.studyHint = slots.studyHint;
  if (slots.specialtyHint) search.specialtyHint = slots.specialtyHint;
  if (slots.bodySiteHint) search.bodySiteHint = slots.bodySiteHint;
  if (slots.clinicalReasonHint) search.clinicalReasonHint = slots.clinicalReasonHint;
  if (slots.noteHint) search.noteHint = slots.noteHint;
  if (slots.urgencyHint) search.urgencyHint = slots.urgencyHint;
  return search;
}
