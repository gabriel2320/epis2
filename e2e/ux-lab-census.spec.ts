import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('PROG-UX-LAB — censo narrativo', () => {
  test('Shift Context Strip + acción primaria DEMO-001 → evolución', async ({ page }) => {
    await loginAsPhysician(page);
    await expect(page.getByTestId('epis2-shift-context-strip')).toBeVisible();
    await expect(page.getByText(copy.censusShift.stripTitle)).toBeVisible();

    await page.getByRole('button', { name: copy.forms.searchPatients }).click();
    await expect(page.getByTestId('epis2-patient-search-grid')).toBeVisible();

    await page.getByTestId('epis2-census-primary-action-DEMO-001').click();
    await expect(page).toHaveURL(/\/espacio\/evolucion/);
    await expect(page.getByTestId('epis2-generated-clinical-page')).toBeVisible();
  });
});
