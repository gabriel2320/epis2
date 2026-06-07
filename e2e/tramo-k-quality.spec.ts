/**
 * MF-TRAMO-K-002 — E2E tablero calidad y auditoría.
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('Tramo K — Calidad y auditoría', () => {
  test('tablero calidad — IDC 171 centinela', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=quality');
    await expect(page.getByTestId('epis2-dashboard-quality')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-idc-panels')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-idc-171')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-sentinel')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-sentinel-rows')).toBeVisible();
  });

  test('tablero calidad — scaffold IDC 172–180', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=quality');
    await expect(page.getByTestId('epis2-quality-rca')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-mortality-board')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-record-audit')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-oirs')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-work-climate')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-consent-trace')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-accreditation')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-accreditation-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-institutional-docs')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-surgical-suspension')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-surgical-suspension-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-quality-idc-180')).toBeVisible();
  });
});
