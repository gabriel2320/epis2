/**
 * Vista 3 — humo E2E del login gateway y pantallas auth-adjacent.
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';

test.describe('Login gateway M3', () => {
  test('login muestra gateway, formulario y acción principal', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByTestId('epis2-login-gateway')).toBeVisible();
    await expect(page.getByTestId('epis2-login-form')).toBeVisible();
    await expect(page.getByTestId('epis2-login-submit')).toHaveText(copy.login.submit);
    await expect(page.getByRole('heading', { name: copy.appName })).toBeVisible();
  });

  test('sesión expirada usa el mismo gateway', async ({ page }) => {
    await page.goto('/sesion-expirada');

    await expect(page.getByTestId('epis2-login-gateway')).toBeVisible();
    await expect(page.getByTestId('epis2-session-expired')).toBeVisible();
    await expect(page.getByText(copy.errors.sessionExpiredTitle)).toBeVisible();
    await expect(page.getByTestId('epis2-session-expired-action')).toHaveText(
      copy.errors.sessionExpiredAction,
    );
  });
});
