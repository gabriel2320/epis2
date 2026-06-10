/**
 * Helpers role-first para E2E (MF-NORM-402) — ver docs/quality/E2E_SELECTOR_POLICY.md.
 * Preferir estos helpers (o getByRole directo) sobre getByTestId en specs nuevos.
 */
import type { Locator, Page } from '@playwright/test';

export function buttonByName(page: Page, name: string | RegExp): Locator {
  return page.getByRole('button', { name });
}

export function linkByName(page: Page, name: string | RegExp): Locator {
  return page.getByRole('link', { name });
}

export function headingByName(page: Page, name: string | RegExp): Locator {
  return page.getByRole('heading', { name });
}

export function textboxByName(page: Page, name: string | RegExp): Locator {
  return page.getByRole('textbox', { name });
}

export async function fillTextbox(page: Page, name: string | RegExp, value: string) {
  await textboxByName(page, name).fill(value);
}
