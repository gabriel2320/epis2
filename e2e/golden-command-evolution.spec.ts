/**
 * MF-154 — Journey E2E mínimo: censo → evolución.
 * @see docs/quality/GOLDEN_CLINICAL_JOURNEY.md
 */
import { test, expect } from '@playwright/test';
import { fillTransversalCommand, loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

test.describe('Golden journey E2E — censo → evolución', () => {
  test('médico demo fija paciente y abre evolución desde barra transversal', async ({ page }) => {
    await loginAsPhysician(page);
    await pinDemoCase(page, 'DEMO-001');

    await fillTransversalCommand(page, 'evolucionar nota de hoy');

    await expect(page).toHaveURL(/\/espacio\/evolucion/);
    await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible();
  });
});
