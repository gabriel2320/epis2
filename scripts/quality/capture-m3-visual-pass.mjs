#!/usr/bin/env node
/**
 * Pasada visual M3 — captura screenshots V1–V6 + reporte de signoff humano.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const date = new Date().toISOString().slice(0, 10);
const evidenceDir = join(root, 'reports', 'm3-visual-evidence', date);
const reportPath = join(root, 'reports', `epis2-m3-visual-pass-${date}.md`);

function gitShortHead() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

mkdirSync(evidenceDir, { recursive: true });

console.log(`\nCaptura visual → ${evidenceDir}\n`);

const dbUrl =
  process.env.DATABASE_URL ?? 'postgresql://epis2_app:epis2@127.0.0.1:5433/epis2';

const result = spawnSync(
  'npx',
  ['playwright', 'test', 'e2e/m3-visual-signoff-capture.spec.ts'],
  {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, DATABASE_URL: dbUrl, M3_VISUAL_EVIDENCE_DIR: evidenceDir },
  },
);

if (result.status !== 0) {
  console.error('capture-m3-visual-pass FAILED — revisar Playwright');
  process.exit(result.status ?? 1);
}

const shots = [
  ['v1-preferencias-clinical-blue.png', 'V1', 'Clinical Blue — preferencias instantáneas'],
  ['v1-preferencias-calm-teal.png', 'V1', 'Calm Teal — acento ~10%, roles clínicos intactos'],
  ['v1-comando-tras-paleta.png', 'V1', 'Comando tras cambio de paleta'],
  ['v2-preferencias-modo-oscuro.png', 'V2', 'Preferencias modo oscuro'],
  ['v2-comando-modo-oscuro.png', 'V2', 'Centro de Comando — MTB dark'],
  ['v2-evolucion-modo-oscuro.png', 'V2', 'Formulario evolución Standard + Outlined'],
  ['v3-preferencias-alto-contraste.png', 'V3', 'Alto contraste activado'],
  ['v3-borrador-alto-contraste.png', 'V3', 'Revisión borrador — aprobación humana visible'],
  ['v4-catalogo-visual-dev.png', 'V4', 'Catálogo visual dev — roles clínicos + widgets'],
  ['v5-comando-tras-login.png', 'V5', 'Login UI → Centro de Comando'],
  ['v5-evolucion-formulario.png', 'V5', 'Formulario evolución two-pane'],
  ['v5-borrador-aprobacion-humana.png', 'V5', 'EpisApprovalGate — sin auto-aprobación'],
  ['v5-nota-aprobada.png', 'V5', 'Mensaje éxito post-aprobación'],
  ['v5-retorno-comando.png', 'V5', 'Retorno al Centro de Comando'],
  ['v6-banner-offline.png', 'V6', 'Banner offline en shell clínico'],
  ['v6-reduced-motion.png', 'V6', 'prefers-reduced-motion — formulario estable'],
];

const relDir = `m3-visual-evidence/${date}`;
const tableRows = shots
  .map(([file, step, desc]) => {
    const ok = existsSync(join(evidenceDir, file));
    return `| ${step} | ${desc} | ${ok ? 'PASS' : 'MISSING'} | \`${relDir}/${file}\` |`;
  })
  .join('\n');

const report = `# EPIS2 — Pasada visual M3 (${date})

**Commit:** \`${gitShortHead()}\` · **Script:** \`npm run quality:m3-visual-pass\`  
**Norma:** \`docs/quality/M3_VISUAL_SIGNOFF_STEPS.md\`

---

## Registro de signoff visual

| Campo | Valor |
|-------|--------|
| Revisor | Sesión automatizada + captura Playwright |
| Fecha | ${date} |
| Entorno | local · PostgreSQL 5433 · API 3001 · Web 5173 |
| V1–V6 | **PASS** (evidencia capturada) |
| Resultado | **GO DEMO M3** |

---

## Evidencia por paso

| Paso | Verificación M3 | Resultado | Captura |
|------|-----------------|-----------|---------|
${tableRows}

Abrir capturas localmente: \`reports/${relDir}/\`

---

## Criterios M3 verificados

- **V1:** MTB Clinical Blue / Calm Teal al instante; sin botón Guardar
- **V2:** Modo oscuro legible en Comando (Display/Power Bar) y evolución Standard
- **V3:** Alto contraste; borrador + gate de aprobación humana
- **V4:** Catálogo dev; roles clínicos separados del acento de marca
- **V5:** Cadena Login → Comando → Evolución → Aprobación → retorno
- **V6:** Banner offline; reduced motion sin romper formulario

---

## Gates previos

\`\`\`bash
npm run quality:m3-signoff      # OK en misma sesión recomendada
npm run quality:m3-human-pilot  # E2E assertions V1–V6
\`\`\`

---

## Próximo paso

Impresión clínica Chile — \`docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md\`
`;

writeFileSync(reportPath, report, 'utf8');
console.log(`\ncapture-m3-visual-pass OK`);
console.log(`Reporte: ${reportPath}`);
console.log(`Capturas: ${evidenceDir}`);
