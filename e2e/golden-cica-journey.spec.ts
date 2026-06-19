/**
 * MF-CICA-GOLDEN-01 — Golden journey E2E en rutas /app/* (CICA ON).
 * @see docs/quality/GOLDEN_CLINICAL_JOURNEY.md
 * @see reports/epis2-frontend-purge-cica-reform-plan.md Tramo 4
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import {
  fillMinimalEvolutionDraft,
  goToCicaClinicalHome,
  loginAsPhysicianCica,
  openCicaNewEvolution,
  pinCicaDemoCase,
} from './helpers/demoPatient.js';

test.describe('Golden journey E2E — CICA /app', () => {
  test('buscar → evolución → borrador → aprobación → censo CICA', async ({ page }) => {
    await loginAsPhysicianCica(page);
    await expect(page).toHaveURL(/\/app\/buscar/);

    await pinCicaDemoCase(page, 'DEMO-001');
    await expect(page.getByTestId('cica-patient-summary-screen')).toBeVisible({ timeout: 15_000 });

    await openCicaNewEvolution(page);
    await fillMinimalEvolutionDraft(page, 'Paciente refiere mejoría (golden CICA E2E).');

    await page.getByTestId('epis2-form-sign').click();
    await expect(page).toHaveURL(/\/espacio\/borrador\//, { timeout: 15_000 });
    await expect(page.getByTestId('epis2-draft-review')).toBeVisible();

    await page.getByTestId('epis2-draft-approve').click();
    await expect(page.getByTestId('epis2-draft-review-message')).toContainText(
      copy.drafts.approvedSuccess,
      { timeout: 15_000 },
    );

    await goToCicaClinicalHome(page);
    await expect(page.getByTestId('cica-patient-search-hero')).toBeVisible();
    await expect(page.getByTestId('cica-top-bar')).toBeVisible();
  });
});
