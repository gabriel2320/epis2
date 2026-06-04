import { defineBlueprint, section } from '../factory.js';

const DEMO_SUMMARY: Record<string, string> = {
  activeProblems: 'Hipertensión esencial (DEMO)\nControl ambulatorio pendiente',
  recentEvents: 'Últimas 24 h: sin eventos agudos registrados (sintético)',
  relevantLabs: 'Creatinina 0.9 mg/dL · Hb 14 g/dL (demo)',
  activeMedications: 'Losartán 50 mg/día (demo)',
  pendingItems: 'Control en 7 días',
  clinicalAlerts: 'DEMO / SINTÉTICO — sin alertas reales',
};

export const patientSummaryBlueprint = defineBlueprint({
  blueprintId: 'patient_summary',
  label: 'Resumen clínico',
  purpose: 'Vista longitudinal mínima del paciente',
  intentIds: ['summarize_patient'],
  allowedRoles: ['physician', 'nurse', 'admin', 'auditor'],
  routePath: '/espacio/resumen',
  outputKind: 'READ_ONLY_SUMMARY',
  requiresPatient: true,
  requiresEncounter: false,
  approvalRequired: false,
  sections: [
    section('problems', 'Problemas activos', ['activeProblems']),
    section('events', 'Últimas 24 h', ['recentEvents']),
    section('labs', 'Laboratorio', ['relevantLabs'], 'collapsed'),
    section('meds', 'Medicamentos', ['activeMedications']),
    section('pending', 'Pendientes', ['pendingItems']),
    section('alerts', 'Alertas', ['clinicalAlerts']),
  ],
  fields: [
    { id: 'activeProblems', label: 'Problemas activos', type: 'textarea', readOnly: true },
    { id: 'recentEvents', label: 'Eventos recientes', type: 'textarea', readOnly: true },
    { id: 'relevantLabs', label: 'Exámenes', type: 'textarea', readOnly: true },
    { id: 'activeMedications', label: 'Medicamentos', type: 'textarea', readOnly: true },
    { id: 'pendingItems', label: 'Pendientes', type: 'textarea', readOnly: true },
    { id: 'clinicalAlerts', label: 'Alertas', type: 'textarea', readOnly: true },
  ],
  validations: [],
});

export function defaultSummaryValues(): Record<string, string> {
  return { ...DEMO_SUMMARY };
}
