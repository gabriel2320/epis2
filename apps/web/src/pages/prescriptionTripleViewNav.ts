import type { ClinicalNavigateFn } from '../routes/clinicalNavigate.js';

/** MF-FF-10 — navegación triple vista receta (form · print · papel). */
export function navigatePrescriptionFormFromPaper(
  navigate: ClinicalNavigateFn,
  patientId: string,
): void {
  void navigate({
    to: '/espacio/receta',
    search: { patientId, chartMode: 'paper' },
  });
}

export function navigateBackToPaperChartFromPrescriptionForm(
  navigate: ClinicalNavigateFn,
  patientId: string,
): void {
  void navigate({
    to: '/espacio/ficha',
    search: { patientId, chartMode: 'paper', printFormat: 'a5' },
  });
}
