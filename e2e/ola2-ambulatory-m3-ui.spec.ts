/**
 * MF-OLA2-002 — Regresión visual Ola 2 (M3-0.12).
 * @see docs/design/EPIS2_CLINICAL_MATERIAL3_CONCILIATION.md
 */
import { copy } from '@epis2/design-system';
import { test, expect, type Page } from '@playwright/test';
import { loginAsPhysician, openAmbulatoryFromCommand, pinDemoCase } from './helpers/demoPatient.js';

async function selectDemoPatient(page: Page) {
  await loginAsPhysician(page);
  await pinDemoCase(page, 'DEMO-001');
}

test.describe('Ola 2 — M3-UI visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({
      content: '*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }',
    });
  });

  test('comando — viewport expandido', async ({ page }) => {
    await loginAsPhysician(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/comando');
    await expect(page.getByTestId('epis2-command-prompt')).toBeVisible();
    await expect(page).toHaveScreenshot('ola2-comando.png', { maxDiffPixelRatio: 0.02 });
  });

  test('consulta ambulatoria — scrollspy y secciones Ola 2', async ({ page }) => {
    await selectDemoPatient(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await openAmbulatoryFromCommand(page);
    await expect(page.getByTestId('epis2-form-outpatient_visit')).toBeVisible();
    await expect(page.getByTestId('epis2-clinical-scrollspy-layout')).toBeVisible();
    await expect(page.getByTestId('epis2-scrollspy-anamnesis')).toBeVisible();
    await expect(page).toHaveScreenshot('ola2-outpatient-visit.png', { maxDiffPixelRatio: 0.03 });
  });

  test('certificado médico — formulario A5 pendiente impresión', async ({ page }) => {
    await selectDemoPatient(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/espacio/certificado?patientId=a0000001-0000-4000-8000-000000000001');
    await expect(page.getByTestId('epis2-form-medical_certificate')).toBeVisible();
    await expect(page).toHaveScreenshot('ola2-medical-certificate.png', { maxDiffPixelRatio: 0.03 });
  });

  test('journey ambulatorio — guardar borrador', async ({ page }) => {
    await selectDemoPatient(page);
    await openAmbulatoryFromCommand(page);
    await page.getByLabel(/motivo de consulta/i).fill('Control ambulatorio demo Ola 2');
    await page.getByLabel(/anamnesis próxima/i).fill('Síntomas leves de prueba sintética.');
    await page.getByLabel(/evaluación clínica/i).fill('Estable');
    await page.getByLabel(/plan terapéutico/i).fill('Control en 7 días');
    await page.getByRole('button', { name: copy.workspaces.ambulatory.fab }).click();
    await expect(page).toHaveURL(/\/espacio\/borrador\//);
    await expect(page.getByTestId('epis2-draft-review')).toBeVisible();
  });
});
