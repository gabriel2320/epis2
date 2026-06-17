import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { test, expect } from '@playwright/test';
import { loginAsPhysician, fillTransversalCommand } from './helpers/demoPatient.js';

test.describe('PROG-UX-LAB — búsqueda de paciente', () => {
  test('pantalla limpia + abrir ficha DEMO-001 + evolución', async ({ page }) => {
    await loginAsPhysician(page);
    await expect(page.getByTestId('epis2-patient-search-screen')).toBeVisible();
    await expect(page.getByTestId('epis2-patient-search-hero-input')).toBeVisible();

    const demo = getDemoCaseByCode('DEMO-001');
    if (!demo) throw new Error('DEMO-001 missing');

    await page.getByTestId('epis2-patient-search-hero-input').fill('DEMO-001');
    await page.getByTestId('epis2-patient-search-submit').click();
    await page.getByTestId(`epis2-patient-search-open-${demo.patientId}`).click();
    await expect(page).toHaveURL(/\/espacio\/ficha/);

    await fillTransversalCommand(page, 'evolucionar nota de hoy');
    await expect(page).toHaveURL(/\/espacio\/evolucion/);
    await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible();
  });
});
