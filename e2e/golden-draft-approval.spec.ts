/**
 * MF-186 — Golden journey E2E pasos 6–9: borrador → aprobación → auditoría → censo.
 * @see docs/quality/GOLDEN_CLINICAL_JOURNEY.md
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import {
  fillTransversalCommand,
  goToCommandCenter,
  loginAsPhysician,
  pinDemoCase,
} from './helpers/demoPatient.js';

test.describe('Golden journey E2E — borrador a aprobación', () => {
  test('médico guarda borrador, aprueba y vuelve al censo clínico', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');

    await fillTransversalCommand(page, 'evolucionar nota de hoy');
    await expect(page).toHaveURL(/\/espacio\/evolucion/);
    await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible();

    const subjective = page.getByTestId('epis2-field-subjective-rich-input');
    await subjective.click();
    await subjective.fill('Paciente refiere mejoría del dolor abdominal.');
    await page.getByRole('button', { name: copy.forms.sign }).click();
    await expect(page).toHaveURL(/\/espacio\/borrador\//);
    await expect(page.getByTestId('epis2-draft-review')).toBeVisible();

    await page.getByTestId('epis2-draft-approve').click();
    await expect(page.getByTestId('epis2-draft-review-message')).toContainText(
      copy.drafts.approvedSuccess,
    );

    await goToCommandCenter(page);
    await expect(page.getByTestId('epis2-census-command-bar')).toBeVisible();
    await expect(page.getByTestId('epis2-active-patient')).toBeVisible();
    await expect(page.getByTestId('epis2-active-patient')).toContainText('Carmen');
  });
});
