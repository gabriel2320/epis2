/**
 * P1 PEND-006 cierre — Journeys orden laboratorio / imagenología → vista impresión A5 (norma §19.7).
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

const DEMO001_PATIENT_ID = 'a0000001-0000-4000-8000-000000000001';

test.describe('Ola 6A — impresión órdenes A5', () => {
  test('orden de laboratorio expone CTA impresión y renderiza vista A5', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/espacio/laboratorio?patientId=${DEMO001_PATIENT_ID}`);
    await expect(page.getByTestId('epis2-form-lab_request')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-print-preview-lab_request')).toBeVisible({
      timeout: 15_000,
    });

    await page.evaluate(() => {
      sessionStorage.setItem(
        'epis2_print_preview:lab_request',
        JSON.stringify({
          scheduledDate: '2026-06-10',
          labTests: 'Hemograma completo, perfil bioquímico',
          clinicalReason: 'Control postoperatorio (demo)',
          priority: 'urgente',
        }),
      );
    });
    await page.goto(`/espacio/laboratorio/imprimir?patientId=${DEMO001_PATIENT_ID}`);
    await expect(page.getByTestId('epis2-lab-request-print-page')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('epis2-print-a5-document')).toBeVisible();
    await expect(page.getByText(copy.print.labRequestTitle)).toBeVisible();
    await expect(page.getByText('URGENTE')).toBeVisible();
    await expect(page.getByTestId('epis2-print-execute')).toBeVisible();
  });

  test('orden de imagenología expone CTA impresión y renderiza vista A5', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/espacio/imagenologia?patientId=${DEMO001_PATIENT_ID}`);
    await expect(page.getByTestId('epis2-form-imaging_request')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-print-preview-imaging_request')).toBeVisible({
      timeout: 15_000,
    });

    await page.evaluate(() => {
      sessionStorage.setItem(
        'epis2_print_preview:imaging_request',
        JSON.stringify({
          scheduledDate: '2026-06-11',
          modality: 'TC',
          studyDescription: 'TC de tórax sin contraste (demo)',
          clinicalIndication: 'Sospecha de neumonía complicada',
          priority: 'rutina',
        }),
      );
    });
    await page.goto(`/espacio/imagenologia/imprimir?patientId=${DEMO001_PATIENT_ID}`);
    await expect(page.getByTestId('epis2-imaging-request-print-page')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('epis2-print-a5-document')).toBeVisible();
    await expect(page.getByText(copy.print.imagingRequestTitle)).toBeVisible();
    await expect(page.getByText('TC de tórax sin contraste (demo)')).toBeVisible();
    await expect(page.getByTestId('epis2-print-execute')).toBeVisible();
  });
});
