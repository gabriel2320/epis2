/**
 * MF-TRAMO-F-002 — E2E tablero APS.
 */
import { test, expect } from '@playwright/test';
import { loginAsPhysician } from './helpers/demoPatient.js';

test.describe('Tramo F — APS', () => {
  test('tablero APS — IDC 121 control cardiovascular', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=aps');
    await expect(page.getByTestId('epis2-aps-dashboard')).toBeVisible();
    await expect(page.getByTestId('epis2-aps-idc-121')).toBeVisible();
    await expect(page.getByTestId('epis2-aps-cardiovascular')).toBeVisible();
    await expect(page.getByTestId('epis2-aps-cardiovascular-rows')).toBeVisible();
  });

  test('tablero APS — scaffold IDC 122–130', async ({ page }) => {
    await loginAsPhysician(page);
    await page.goto('/epis2/dashboard?tab=aps');
    await expect(page.getByTestId('epis2-aps-framingham')).toBeVisible();
    await expect(page.getByTestId('epis2-aps-idc-122')).toBeVisible();
    await expect(page.getByTestId('epis2-aps-preventive-exam')).toBeVisible();
    await expect(page.getByTestId('epis2-aps-diabetic-foot')).toBeVisible();
    await expect(page.getByTestId('epis2-aps-mental-health')).toBeVisible();
    await expect(page.getByTestId('epis2-aps-child-wellness')).toBeVisible();
    await expect(page.getByTestId('epis2-aps-immunization')).toBeVisible();
    await expect(page.getByTestId('epis2-aps-prenatal')).toBeVisible();
    await expect(page.getByTestId('epis2-aps-ministerial-referral')).toBeVisible();
    await expect(page.getByTestId('epis2-aps-home-visit')).toBeVisible();
    await expect(page.getByTestId('epis2-aps-idc-130')).toBeVisible();
  });
});
