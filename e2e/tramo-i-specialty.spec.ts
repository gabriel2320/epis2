/**
 * MF-TRAMO-I-002 — E2E tablero especialidades gráficas.
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('Tramo I — Especialidades gráficas', () => {
  test('tablero especialidades — IDC 181 partograma', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=specialty');
    await expect(page.getByTestId('epis2-specialty-dashboard')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-idc-panels')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-idc-181')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-partogram')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-partogram-rows')).toBeVisible();
  });

  test('tablero especialidades — scaffold IDC 182–190', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=specialty');
    await expect(page.getByTestId('epis2-specialty-oncology-board')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-odontogram')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-endoscopy')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-ophthalmology')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-hemodialysis')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-kinesiology')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-nutrition')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-chemotherapy')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-psychiatry')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-psychiatry-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-specialty-idc-190')).toBeVisible();
  });
});
