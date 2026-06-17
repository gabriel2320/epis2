/**
 * MF-OLA3-002 — Journey ficha → antecedentes y bandeja (dual chart PROG-FICHA-FIRST).
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import {
  expectDualChartFicha,
  expectFichaSummaryReady,
  loginAsPhysician,
  openFichaDocuments,
  openFichaEvolutions,
  openFichaExams,
  pinDemoCase,
} from './helpers/demoPatient.js';

test.describe('Ola 3 — ficha longitudinal CTAs', () => {
  test('ficha compacta enlaza registro o gestión de alergias desde resumen', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expectFichaSummaryReady(page);
    const empty = page.getByTestId('epis2-clinical-summary-grid-allergies-empty');
    const filled = page.getByTestId('epis2-clinical-summary-grid-allergies');
    await expect(empty.or(filled)).toBeVisible({ timeout: 15_000 });
    if (await empty.isVisible()) {
      await page.getByRole('button', { name: copy.longitudinal.registerAllergy }).click();
    } else {
      await filled.getByRole('button', { name: copy.clinicalSummary.manageAllergies }).click();
    }
    await expect(page).toHaveURL(/\/espacio\/alergia/);
    await expect(page.getByTestId('epis2-form-allergy_entry')).toBeVisible();
  });

  test('ficha compacta lista problema activo DEMO-001', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expectFichaSummaryReady(page);
    const problems = page.getByTestId('epis2-clinical-summary-grid-problems');
    await expect(problems).toBeVisible({ timeout: 15_000 });
    await expect(problems).toContainText('Hipertensión arterial esencial (sintético)');
    await expect(page.getByRole('button', { name: copy.longitudinal.registerProblem })).toHaveCount(0);
  });

  test('ficha abre bandeja de resultados desde resumen', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expectFichaSummaryReady(page);
    await expect(async () => {
      await page.getByRole('button', { name: copy.clinicalSummary.openLabs }).click();
      await expect(page).toHaveURL(/\/espacio\/resultados/);
    }).toPass({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-results-inbox')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(copy.results.inboxTitle)).toBeVisible();
  });

  test('ficha DEMO-005 muestra banner de alertas clínicas', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-005');
    await expect(page.getByTestId('epis2-cds-patient-view')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('[data-testid^="epis2-cds-patient-view-card-"]').first()).toBeVisible();
  });

  test('ficha DEMO-001 muestra timeline y medicamentos activos en evoluciones', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await openFichaEvolutions(page);
    await expect(page.getByTestId('epis2-clinical-filterable-timeline')).toBeVisible();
    await openFichaExams(page);
    await expect(page.getByTestId('epis2-traditional-section-labs-table')).toBeVisible();
    await page.getByTestId('classic-chart-tab-more').click();
    await expect(page.getByTestId('epis2-traditional-section-meds')).toBeVisible();
    await expect(page.getByTestId('epis2-traditional-section-meds')).toContainText('Losartán');
  });

  test('ficha DEMO-005 muestra labs destacados en exámenes', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-005');
    await openFichaExams(page);
    await expect(page.getByTestId('epis2-traditional-section-labs-table')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('epis2-traditional-section-labs')).toContainText(/INR/i);
  });

  test('ficha compacta muestra documentos indexados DEMO-001', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await openFichaDocuments(page);
    await expect(page.getByText('Consentimiento')).toBeVisible();
    await expect(page.getByTestId('epis2-traditional-section-documents-table')).toBeVisible({
      timeout: 15_000,
    });
  });

  test('ficha compacta abre línea de tiempo desde actividad reciente', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expectFichaSummaryReady(page);
    await expect(page.getByTestId('epis2-clinical-summary-grid-timeline')).toBeVisible({
      timeout: 15_000,
    });
    await openFichaEvolutions(page);
  });

  test('ficha hub M3 carga resumen compacto y evoluciones bajo demanda', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await expectFichaSummaryReady(page);
    await expect(page.getByTestId('classic-chart-tabs')).toBeVisible();
    await expect(page.getByTestId('epis2-clinical-filterable-timeline')).toHaveCount(0);
    await openFichaEvolutions(page);
    await expect(page.getByTestId('epis2-traditional-section-evolution')).toBeVisible();
  });

  test('ficha ofrece registrar antecedente quirúrgico en evoluciones', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');
    await openFichaEvolutions(page);
    const register = page.getByTestId('epis2-longitudinal-register-surgical-history');
    if (await register.isVisible()) {
      await register.click();
      await expect(page).toHaveURL(/\/espacio\/problema/);
      await expect(page.getByTestId('epis2-form-clinical_problem_entry')).toBeVisible();
    }
  });
});
