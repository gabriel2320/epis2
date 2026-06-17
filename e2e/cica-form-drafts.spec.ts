/**
 * CICA Clean Room — borradores prescripción y documento (/app/pacientes/:id/...).
 * @see docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md
 */
import { copy } from '@epis2/design-system';
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { test, expect } from '@playwright/test';
import {
  fillMinimalDocumentDraft,
  fillMinimalPrescriptionMedicationField,
  loginAsPhysicianCica,
  openCicaNewDocument,
  openCicaNewPrescription,
  pinCicaDemoCase,
} from './helpers/demoPatient.js';

test.describe('CICA Clean Room — borradores formulario', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsPhysicianCica(page);
  });

  test('indicaciones → Agregar indicación → guardar borrador → estado éxito', async ({ page }) => {
    const demo = getDemoCaseByCode('DEMO-001');
    if (!demo) throw new Error('DEMO-001 missing');

    await pinCicaDemoCase(page, 'DEMO-001');
    await expect(page).toHaveURL(new RegExp(`/app/pacientes/${demo.patientId}/resumen`));
    await expect(page.getByTestId('cica-patient-summary-screen')).toBeVisible({ timeout: 15_000 });

    await openCicaNewPrescription(page);

    await fillMinimalPrescriptionMedicationField(page);

    await page.getByTestId('epis2-form-save').click();
    await expect(page.getByTestId('epis2-form-status')).toContainText(copy.forms.draftSaved, {
      timeout: 15_000,
    });
  });

  test('documentos → Nuevo documento → guardar borrador → estado éxito', async ({ page }) => {
    const demo = getDemoCaseByCode('DEMO-001');
    if (!demo) throw new Error('DEMO-001 missing');

    await pinCicaDemoCase(page, 'DEMO-001');
    await expect(page).toHaveURL(new RegExp(`/app/pacientes/${demo.patientId}/resumen`));
    await expect(page.getByTestId('cica-patient-summary-screen')).toBeVisible({ timeout: 15_000 });

    await openCicaNewDocument(page);

    await fillMinimalDocumentDraft(page);

    await page.getByTestId('epis2-form-save').click();
    await expect(page.getByTestId('epis2-form-status')).toContainText(copy.forms.draftSaved, {
      timeout: 15_000,
    });
  });

  test('legacy /espacio/receta?patientId= redirige a indicaciones/nueva con CICA ON', async ({
    page,
  }) => {
    const demo = getDemoCaseByCode('DEMO-001');
    if (!demo) throw new Error('DEMO-001 missing');

    await page.goto(`/espacio/receta?patientId=${demo.patientId}`);

    await expect(page).toHaveURL(
      new RegExp(`/app/pacientes/${demo.patientId}/indicaciones/nueva`),
      { timeout: 15_000 },
    );
    await expect(page.getByTestId('cica-screen-new-prescription')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('epis2-cica-prescription-form')).toBeVisible();
    await expect(page.getByTestId('epis2-medication-catalog-autocomplete-input')).toBeVisible();
  });
});
