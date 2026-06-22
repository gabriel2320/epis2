import { expect, test } from "@playwright/test";

test("clinical cockpit demo flow", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Entrar al cockpit" }).click();
  await expect(page.getByRole("heading", { name: "Pacientes" })).toBeVisible();
  await page.waitForTimeout(700);
  await page.screenshot({ path: "test-results/cockpit-pacientes.png", fullPage: true });

  await page.getByRole("link", { name: "Nuevo paciente" }).click();
  await page.getByRole("textbox", { name: "Nombre", exact: true }).fill("Amanda");
  await page.getByLabel("Apellido").fill("Silva");
  await page.getByLabel("Identificador clinico").fill("DEMO-E2E");
  await page.getByRole("button", { name: "Crear ficha" }).click();

  await expect(page.getByText("Ficha longitudinal")).toBeVisible();
  const patientId = new URL(page.url()).pathname.split("/")[2];
  await page.waitForTimeout(700);
  await page.screenshot({ path: "test-results/cockpit-ficha.png", fullPage: true });

  await page.getByRole("button", { name: "Nueva SOAP" }).click();
  await page.getByLabel("Subjetivo").fill("Paciente refiere control adecuado de sintomas.");
  await page.getByLabel("Objetivo").fill("Sin signos de alarma.");
  await page.getByLabel("Analisis").fill("Evolucion favorable.");
  await page.getByLabel("Plan").fill("Control y educacion.");
  await page.getByRole("button", { name: "Guardar borrador SOAP" }).click();
  await expect(page.getByText("Paciente refiere control adecuado de sintomas.")).toBeVisible();

  await page.locator("header").getByRole("link", { name: "Auditoria" }).click();
  await expect(page.getByText("clinical_entry.created")).toBeVisible();
  await page.waitForTimeout(700);
  await page.screenshot({ path: "test-results/cockpit-auditoria.png", fullPage: true });

  await page.goto(`/print/pacientes/${patientId}/ficha`);
  await expect(page.getByRole("heading", { name: "Ficha clinica resumida" })).toBeVisible();
  await page.waitForTimeout(700);
  await page.screenshot({ path: "test-results/cockpit-print.png", fullPage: true });
});
