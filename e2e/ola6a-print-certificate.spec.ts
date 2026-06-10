/**
 * MF-OLA6A-002 — Journey certificado → vista impresión A5 (IDC 40).
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

const DEMO001_PATIENT_ID = 'a0000001-0000-4000-8000-000000000001';

test.describe('Ola 6A — impresión certificado A5', () => {
  test('certificado expone CTA impresión y renderiza vista A5', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/espacio/certificado?patientId=${DEMO001_PATIENT_ID}`);
    await expect(page.getByTestId('epis2-form-medical_certificate')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('epis2-print-preview-medical_certificate')).toBeVisible({
      timeout: 15_000,
    });

    await page.evaluate(() => {
      sessionStorage.setItem(
        'epis2_print_preview:medical_certificate',
        JSON.stringify({
          certificateType: 'reposo|Certificado de reposo',
          diagnosisSummary: 'Control ambulatorio demo',
          restDays: '2',
          validFrom: '2026-06-01',
          validUntil: '2026-06-03',
        }),
      );
    });
    await page.goto(`/espacio/certificado/imprimir?patientId=${DEMO001_PATIENT_ID}`);
    await expect(page.getByTestId('epis2-medical-certificate-print-page')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('epis2-print-a5-document')).toBeVisible();
    await expect(page.getByText(copy.print.medicalCertificateTitle)).toBeVisible();
    await expect(page.getByText('Control ambulatorio demo')).toBeVisible();
    await expect(page.getByTestId('epis2-print-execute')).toBeVisible();
  });
});
