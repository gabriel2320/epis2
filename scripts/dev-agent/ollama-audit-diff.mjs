#!/usr/bin/env node
/**
 * MF-RAPID-02 — Auditor Ollama sobre git diff (secundario; no escribe SoT).
 *
 *   npm run dev:agent:audit-diff
 *   npm run dev:agent:audit-diff -- --staged
 *   npm run dev:agent:audit-diff -- --dry-run
 */
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { ensureOllamaReady, resolveOllamaRoute } from '../ollama/native-client.mjs';
import { generateOllamaJson, parseJsonFromOllamaText } from './ollama-client.mjs';
import { parseDevDiffAudit } from './schemas.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const stagedOnly = args.includes('--staged');
const dryRun = args.includes('--dry-run');
const MAX_DIFF_CHARS = Number(process.env.EPIS2_AUDIT_DIFF_MAX_CHARS ?? 80_000);

function collectDiff() {
  const parts = [];
  if (stagedOnly) {
    parts.push(
      execSync('git diff --cached', { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }),
    );
  } else {
    try {
      parts.push(
        execSync('git diff HEAD', { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }),
      );
    } catch {
      /* empty repo */
    }
    parts.push(
      execSync('git diff --cached', { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }),
    );
  }
  return parts.filter(Boolean).join('\n').trim();
}

function buildPrompt(diff) {
  return `Actúa como auditor de software clínico para EPIS2 (EMR command-first, Chile, datos sintéticos).
Revisa el diff de git. NO propongas reescrituras completas; solo riesgos accionables.

Busca en el diff:
- PHI real (RUT, nombres reales, credenciales)
- IA que aprueba, firma o escribe SoT clínico final
- auto-aprobación / autoApprove
- segundo Command Registry o Form Registry
- imports OpenMRS, Carbon, EPIS masivo
- imports indebidos apps/web → services runtime
- cambios en auth, RBAC, RLS, migraciones SQL sin MF explícita
- dependencia obligatoria de Ollama para flujo clínico base
- tests faltantes en cambios de lógica clínica

Responde SOLO JSON válido:
{
  "verdict": "APROBAR" | "CORREGIR" | "RECHAZAR",
  "summary": "una frase",
  "findings": [
    { "severity": "P0" | "P1" | "P2", "category": "phi|approval|registry|boundary|security|tests|other", "detail": "..." }
  ],
  "suggestedTests": ["npm run ..."],
  "requiresHumanReview": true
}

Reglas verdict:
- RECHAZAR: cualquier P0 confirmado en el diff
- CORREGIR: P1 o dudas materiales
- APROBAR: solo P2 o ningún hallazgo relevante

--- DIFF ---
${diff}
--- FIN DIFF ---`;
}

async function main() {
  const diff = collectDiff();
  if (!diff) {
    console.log('dev:agent:audit-diff — sin diff (working tree limpio vs HEAD)');
    process.exit(0);
  }

  const truncated = diff.length > MAX_DIFF_CHARS;
  const diffForPrompt = truncated
    ? `${diff.slice(0, MAX_DIFF_CHARS)}\n\n… [diff truncado ${diff.length} chars]`
    : diff;

  console.log(`dev:agent:audit-diff — ${diff.length} chars${truncated ? ' (truncado)' : ''}`);

  if (dryRun) {
    console.log('dry-run — omitiendo Ollama');
    process.exit(0);
  }

  const route = await resolveOllamaRoute({ function: 'dev-plan' });
  console.log(`Ollama · ${route.function} → ${route.model} (tier ${route.tier})`);

  const ready = await ensureOllamaReady({ function: 'dev-plan' });
  if (!ready.ready) {
    console.warn(`⚠ Ollama no disponible: ${ready.reason}`);
    console.warn(`  ${ready.hint}`);
    console.warn('  Continúa con revisión humana del diff.');
    process.exit(0);
  }

  const result = await generateOllamaJson(
    route.baseUrl,
    route.model,
    buildPrompt(diffForPrompt),
    90_000,
  );
  if (!result.ok) {
    console.error(`dev:agent:audit-diff FAILED: ${result.reason}`);
    process.exit(1);
  }

  const json = parseJsonFromOllamaText(result.text);
  if (!json.ok) {
    console.error(`dev:agent:audit-diff FAILED: JSON — ${json.reason}`);
    console.error(result.text.slice(0, 800));
    process.exit(1);
  }

  const parsed = parseDevDiffAudit(json.value);
  if (!parsed.ok) {
    console.error(`dev:agent:audit-diff FAILED: schema — ${parsed.error}`);
    console.error(result.text.slice(0, 800));
    process.exit(1);
  }

  const audit = parsed.data;
  const outPath = join(root, 'reports/dev-agent-audit-diff-latest.json');
  writeFileSync(
    outPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        model: result.model,
        route,
        stagedOnly,
        diffChars: diff.length,
        truncated,
        audit,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  console.log(`\nVeredicto: ${audit.verdict}`);
  console.log(`Resumen: ${audit.summary}`);
  if (audit.findings.length) {
    console.log('\nHallazgos:');
    for (const f of audit.findings) {
      console.log(`  [${f.severity}] ${f.category}: ${f.detail}`);
    }
  }
  if (audit.suggestedTests?.length) {
    console.log('\nTests sugeridos:', audit.suggestedTests.join(' · '));
  }
  console.log(`\nReporte: ${outPath}`);

  const hasP0 = audit.findings.some((f) => f.severity === 'P0');
  if (audit.verdict === 'RECHAZAR' || hasP0) {
    console.error('\ndev:agent:audit-diff — RECHAZAR (corregir antes de commit)');
    process.exit(1);
  }

  if (audit.verdict === 'CORREGIR') {
    console.warn('\n(i) CORREGIR — revisar hallazgos antes de push');
  } else {
    console.log('\ndev:agent:audit-diff OK');
  }
}

main().catch((err) => {
  console.error('dev:agent:audit-diff FAILED:', err.message ?? err);
  process.exit(1);
});
