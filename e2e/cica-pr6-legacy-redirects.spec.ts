/**
 * MF-CICA-PR6-01 — E2E mapa PR6 `/espacio/*` → CICA `/app/*` (CICA GO).
 * @see apps/web/src/routes/cicaLegacyRedirects.ts
 * @see reports/epis2-cica-clean-room-redesign-2026-06-17.md
 */
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { test, expect } from '@playwright/test';
import { loginAsPhysicianApiOnly } from './helpers/demoPatient.js';

type Pr6RedirectCase = {
  id: string;
  legacyUrl: (patientId: string) => string;
  urlPattern: (patientId: string) => RegExp;
  screenTestId: string;
};

function demoPatientId(): string {
  const demo = getDemoCaseByCode('DEMO-001');
  if (!demo) throw new Error('DEMO-001 missing');
  return demo.patientId;
}

/** Debe coincidir con el mapa documentado en cicaLegacyRedirects.ts */
const PR6_REDIRECT_CASES: readonly Pr6RedirectCase[] = [
  {
    id: 'buscar-paciente',
    legacyUrl: () => '/espacio/buscar-paciente',
    urlPattern: () => /\/app\/buscar$/,
    screenTestId: 'cica-generated-patient-search',
  },
  {
    id: 'ficha',
    legacyUrl: (pid) => `/espacio/ficha?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/resumen`),
    screenTestId: 'cica-patient-summary-screen',
  },
  {
    id: 'resumen',
    legacyUrl: (pid) => `/espacio/resumen?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/resumen`),
    screenTestId: 'cica-patient-summary-screen',
  },
  {
    id: 'evolucion',
    legacyUrl: (pid) => `/espacio/evolucion?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/evoluciones/nueva`),
    screenTestId: 'cica-screen-new-evolution',
  },
  {
    id: 'receta',
    legacyUrl: (pid) => `/espacio/receta?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/indicaciones/nueva`),
    screenTestId: 'cica-screen-new-prescription',
  },
  {
    id: 'certificado',
    legacyUrl: (pid) => `/espacio/certificado?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/documentos/nuevo`),
    screenTestId: 'cica-screen-new-document',
  },
  {
    id: 'epicrisis',
    legacyUrl: (pid) => `/espacio/epicrisis?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/epicrisis/nueva`),
    screenTestId: 'cica-screen-new-epicrisis',
  },
  {
    id: 'resultados',
    legacyUrl: (pid) => `/espacio/resultados?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/examenes`),
    screenTestId: 'cica-patient-exams-screen',
  },
  {
    id: 'laboratorio',
    legacyUrl: (pid) => `/espacio/laboratorio?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/examenes`),
    screenTestId: 'cica-patient-exams-screen',
  },
  {
    id: 'imagenologia',
    legacyUrl: (pid) => `/espacio/imagenologia?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/examenes`),
    screenTestId: 'cica-patient-exams-screen',
  },
  {
    id: 'interconsulta',
    legacyUrl: (pid) => `/espacio/interconsulta?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/documentos`),
    screenTestId: 'cica-patient-documents-screen',
  },
  {
    id: 'informe-interconsulta',
    legacyUrl: (pid) => `/espacio/informe-interconsulta?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/documentos`),
    screenTestId: 'cica-patient-documents-screen',
  },
  {
    id: 'procedimiento',
    legacyUrl: (pid) => `/espacio/procedimiento?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/indicaciones`),
    screenTestId: 'cica-patient-orders-screen',
  },
  {
    id: 'enfermeria',
    legacyUrl: (pid) => `/espacio/enfermeria?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/indicaciones`),
    screenTestId: 'cica-patient-orders-screen',
  },
  {
    id: 'mar',
    legacyUrl: (pid) => `/espacio/mar?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/indicaciones`),
    screenTestId: 'cica-patient-orders-screen',
  },
  {
    id: 'farmacia',
    legacyUrl: (pid) => `/espacio/farmacia?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/indicaciones`),
    screenTestId: 'cica-patient-orders-screen',
  },
  {
    id: 'conciliacion',
    legacyUrl: (pid) => `/espacio/conciliacion?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/indicaciones`),
    screenTestId: 'cica-patient-orders-screen',
  },
  {
    id: 'alergia',
    legacyUrl: (pid) => `/espacio/alergia?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/resumen`),
    screenTestId: 'cica-patient-summary-screen',
  },
  {
    id: 'problema',
    legacyUrl: (pid) => `/espacio/problema?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/resumen`),
    screenTestId: 'cica-patient-summary-screen',
  },
  {
    id: 'ingreso',
    legacyUrl: (pid) => `/espacio/ingreso?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/resumen`),
    screenTestId: 'cica-patient-summary-screen',
  },
  {
    id: 'ambulatorio',
    legacyUrl: (pid) => `/espacio/ambulatorio?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/resumen`),
    screenTestId: 'cica-patient-summary-screen',
  },
  {
    id: 'traslado',
    legacyUrl: (pid) => `/espacio/traslado?patientId=${pid}`,
    urlPattern: (pid) => new RegExp(`/app/pacientes/${pid}/resumen`),
    screenTestId: 'cica-patient-summary-screen',
  },
];

test.describe('CICA PR6 — legacy /espacio/* redirects', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPhysicianApiOnly(page);
  });

  for (const tc of PR6_REDIRECT_CASES) {
    test(`${tc.id} → CICA`, async ({ page }) => {
      const patientId = demoPatientId();
      await page.goto(tc.legacyUrl(patientId));
      await expect(page).toHaveURL(tc.urlPattern(patientId), { timeout: 15_000 });
      await expect(page.getByTestId(tc.screenTestId)).toBeVisible({ timeout: 15_000 });
    });
  }

  test('formulario legacy sin patientId → /app/buscar', async ({ page }) => {
    await page.goto('/espacio/evolucion');
    await expect(page).toHaveURL(/\/app\/buscar$/, { timeout: 15_000 });
    await expect(page.getByTestId('cica-generated-patient-search')).toBeVisible({
      timeout: 15_000,
    });
  });
});
