import type { PatientLongitudinalResponse } from '@epis2/contracts';

type Medication = PatientLongitudinalResponse['medications'][number];
type Observation = PatientLongitudinalResponse['observations'][number];
type Allergy = PatientLongitudinalResponse['allergies'][number];

export type MedicationZones = {
  active: Medication[];
  prn: Medication[];
  suspended: Medication[];
};

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase();
}

/** MF-CLINICAL-SUMMARY-B — activa / PRN / suspendida. */
export function partitionMedicationZones(medications: readonly Medication[]): MedicationZones {
  const active: Medication[] = [];
  const prn: Medication[] = [];
  const suspended: Medication[] = [];

  for (const med of medications) {
    const status = normalizeStatus(med.status);
    if (status.includes('prn') || status === 'sos' || status === 'rescue') {
      prn.push(med);
    } else if (
      status === 'suspended' ||
      status === 'stopped' ||
      status === 'discontinued' ||
      status === 'inactive' ||
      status === 'cancelled'
    ) {
      suspended.push(med);
    } else {
      active.push(med);
    }
  }

  return { active, prn, suspended };
}

export function formatMedicationLine(med: Medication): string {
  const parts = [med.name];
  if (med.doseText) parts.push(med.doseText);
  if (med.route) parts.push(med.route);
  return parts.join(' · ');
}

export function formatAllergyLine(allergy: Allergy): string {
  const severity = allergy.severity ? ` · ${allergy.severity}` : '';
  const status =
    allergy.status && normalizeStatus(allergy.status) !== 'active' ? ` (${allergy.status})` : '';
  return `${allergy.substance}${severity}${status}`;
}

/** Labs crítica-first — observaciones recientes para tarjeta destacada. */
export function selectLabHighlights(observations: readonly Observation[], max = 3): Observation[] {
  return [...observations]
    .sort((a, b) => new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime())
    .slice(0, max);
}

export function formatLabObservedAt(iso: string): string {
  return new Date(iso).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
}
