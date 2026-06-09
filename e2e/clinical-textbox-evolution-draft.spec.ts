/**
 * MF-CLINICAL-TEXTBOX-TOOLS fase 3 — evolución rich, borrador con orígenes, aprobación humana.
 * @see docs/quality/GOLDEN_CLINICAL_JOURNEY.md
 */
import { copy } from '@epis2/design-system';
import { test, expect } from '@playwright/test';
import { loginAsPhysician, pinDemoCase } from './helpers/demoPatient.js';

async function openEvolutionForm(page: import('@playwright/test').Page) {
  await pinDemoCase(page, 'DEMO-001');
  await page.goto('/comando');
  const powerBar = page.getByTestId('epis2-power-bar');
  await powerBar
    .getByRole('textbox', { name: copy.commandCenter.powerBarLabel })
    .fill('evolucionar nota de hoy');
  await powerBar.getByRole('button', { name: copy.commandCenter.submit }).click();
  await expect(page).toHaveURL(/\/espacio\/evolucion/);
}

test.describe('ClinicalTextBox E2E — evolución rich y trazabilidad', () => {
  test('rich subjetivo + pegado objetivo → borrador con orígenes → aprobación humana', async ({
    page,
  }) => {
    await loginAsPhysician(page);
    await openEvolutionForm(page);

    const richSubjective = page.getByTestId('epis2-field-subjective-rich-input');
    await richSubjective.click();
    await richSubjective.fill('Paciente refiere mejoría del dolor abdominal.');

    const objectiveField = page.getByTestId('epis2-field-objective-input');
    const pasteText = 'Examen físico estable, sin signos de alarma.';
    await objectiveField.getByRole('textbox').click();
    await page.getByTestId('epis2-field-objective-paste-zone').evaluate((zone, text) => {
      const dt = new DataTransfer();
      dt.setData('text/plain', text);
      zone.dispatchEvent(
        new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dt }),
      );
    }, pasteText);
    await expect(objectiveField.getByRole('textbox')).toHaveValue(/Examen físico estable, sin signos de alarma\./);

    await page.getByLabel('Análisis').fill('Evolución favorable.');
    await page.getByLabel('Plan').fill('Continuar tratamiento y control.');

    await page.getByTestId('epis2-form-sign').click();
    await expect(page).toHaveURL(/\/espacio\/borrador\//);
    await expect(page.getByTestId('epis2-draft-review')).toBeVisible();
    await expect(page.getByTestId('epis2-draft-text-origins')).toBeVisible();
    await expect(page.getByTestId('epis2-draft-text-origins')).toContainText('objective');

    await page.getByTestId('epis2-draft-approve').click();
    await expect(page.getByTestId('epis2-draft-review-message')).toContainText(
      copy.drafts.approvedSuccess,
    );
  });
});
