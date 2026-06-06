#!/usr/bin/env node
/**
 * Piloto humano M3 — gates automatizados + E2E V1–V6 + reporte de cierre.
 * @see docs/quality/M3_VISUAL_SIGNOFF_STEPS.md
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const date = new Date().toISOString().slice(0, 10);

function gitShortHead() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function run(label, cmd, args, env = process.env) {
  console.log(`\n▶ ${label}`);
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  });
  if (result.status !== 0) {
    console.error(`run-m3-human-pilot FAILED en: ${label}`);
    process.exit(result.status ?? 1);
  }
}

run('verify-m3-signoff (theme + vitest M3)', 'node', ['scripts/quality/verify-m3-signoff.mjs']);

const dbUrl =
  process.env.DATABASE_URL ?? 'postgresql://epis2_app:epis2@127.0.0.1:5433/epis2';
run('m3-visual-signoff E2E (V1–V6)', 'npx', [
  'playwright',
  'test',
  'e2e/m3-visual-signoff.spec.ts',
], { ...process.env, DATABASE_URL: dbUrl });

const reportPath = join(root, 'reports', `epis2-m3-human-pilot-${date}.md`);
mkdirSync(join(root, 'reports'), { recursive: true });

const report = `# EPIS2 — Piloto humano M3 (${date})

**Commit:** \`${gitShortHead()}\` · **Script:** \`npm run quality:m3-human-pilot\`

---

## Alcance

Recorrido visual Material Design 3 pasos **V1–V6** según \`docs/quality/M3_VISUAL_SIGNOFF_STEPS.md\`.

| Capa | Artefacto | Resultado |
|------|-----------|-----------|
| Gates auto | \`verify-m3-signoff\` | OK |
| E2E visual | \`e2e/m3-visual-signoff.spec.ts\` | OK |
| Confirmación humana opcional | Navegador — mismas rutas V1–V6 | Pendiente revisor |

---

## Pasos V1–V6 (E2E)

| Paso | Tema | Evidencia automatizada |
|------|------|------------------------|
| V1 | Preferencias MTB instantáneas | Playwright — acentos + localStorage |
| V2 | Modo oscuro Comando + evolución | Playwright — power bar + formulario |
| V3 | Alto contraste + borrador pendiente | Playwright — draft status chip |
| V4 | Catálogo visual dev | Playwright — roles clínicos + sin sombra decorativa |
| V5 | Login → Comando → Evolución → Aprobación | Playwright — approval gate |
| V6 | Banner offline + reduced motion | Playwright — \`setOffline\` + emulateMedia |

---

## Registro de signoff visual (humano)

Completar tras revisión opcional en navegador (\`medico.demo\` / \`DEMO-CLAVE-MEDICO\`):

| Campo | Valor |
|-------|--------|
| Revisor | |
| Fecha | ${date} |
| Entorno | local staging |
| V1–V6 confirmados visualmente | [ ] Sí / [ ] No (anotar paso) |
| Resultado | **GO DEMO M3** / PASS WITH FIXES / BLOCKED |

Rutas: \`/preferencias-apariencia\`, \`/comando\`, \`/espacio/evolucion\`, \`/desarrollo/catalogo-visual\`

---

## Gates sesión

| Gate | Resultado |
|------|-----------|
| \`npm run quality:m3-signoff\` | OK |
| \`npm run quality:m3-human-pilot\` | OK |
| \`npm run test:e2e m3-visual-signoff\` | OK |

---

## Resultado automatizado

**GO DEMO M3 (automatizado)** — V1–V6 cubiertos por E2E + gates M3 sin fallos.

Confirmación visual humana opcional para capturas o edge cases OS (Seguir sistema).

---

## Próximo paso

Impresión clínica Chile — \`docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md\`
`;

writeFileSync(reportPath, report, 'utf8');
console.log(`\nrun-m3-human-pilot OK — reporte: ${reportPath}`);
console.log('Confirmación visual humana opcional: docs/quality/M3_VISUAL_SIGNOFF_STEPS.md');
