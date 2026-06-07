/**
 * MF-TRAMO-E-002 — E2E tablero pabellón.
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('Tramo E — Pabellón', () => {
  test('tablero pabellón — IDC 151 y tabla quirúrgica', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=or');
    await expect(page.getByTestId('epis2-or-dashboard')).toBeVisible();
    await expect(page.getByTestId('epis2-or-idc-151')).toBeVisible();
    await expect(page.getByTestId('epis2-or-surgical-schedule')).toBeVisible();
    await expect(page.getByTestId('epis2-or-surgical-schedule-rows')).toBeVisible();
  });

  test('tablero pabellón — checklist OMS IDC 152', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=or');
    await expect(page.getByTestId('epis2-or-who-checklist')).toBeVisible();
    await expect(page.getByTestId('epis2-or-who-checklist-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-or-idc-152')).toBeVisible();
  });

  test('tablero pabellón — preanestesia IDC 153', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=or');
    await expect(page.getByTestId('epis2-or-preanesthesia')).toBeVisible();
    await expect(page.getByTestId('epis2-or-preanesthesia-rows')).toBeVisible();
    await expect(page.getByTestId('epis2-or-idc-153')).toBeVisible();
  });

  test('tablero pabellón — scaffold IDC 154–160', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=or');
    await expect(page.getByTestId('epis2-or-intraop-anesthesia')).toBeVisible();
    await expect(page.getByTestId('epis2-or-idc-154')).toBeVisible();
    await expect(page.getByTestId('epis2-or-operative-protocol')).toBeVisible();
    await expect(page.getByTestId('epis2-or-sponge-count')).toBeVisible();
    await expect(page.getByTestId('epis2-or-intraop-biopsy')).toBeVisible();
    await expect(page.getByTestId('epis2-or-urpa-recovery')).toBeVisible();
    await expect(page.getByTestId('epis2-or-blood-bank')).toBeVisible();
    await expect(page.getByTestId('epis2-or-sterilization')).toBeVisible();
    await expect(page.getByTestId('epis2-or-idc-160')).toBeVisible();
  });
});
