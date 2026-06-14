# EPIS2 — Mantenimiento de scripts npm

**Versión:** 1.0 · **Fecha:** 2026-06-15 · **Programa:** PROG-CONSOLIDATE Fase 0–1

Brújula de producto: [`EPIS2_CURRENT_STATE.md`](EPIS2_CURRENT_STATE.md)

---

## Principio

El `package.json` raíz debe ser **puerta de entrada**, no catálogo de 400+ microfases. Los detalles viven en:

- `tools/gates/catalog.json` — mapa `quality:*` → archivos
- workspaces (`apps/*`, `packages/*`, `services/*`)
- `scripts/` — implementación (sin duplicar en root cuando sea posible)

---

## Scripts humanos en root (Fase 1)

| Comando | Uso |
|---------|-----|
| `npm run check` | lint + typecheck + architecture (pre-push hook) |
| `npm run test` | vitest unitario |
| `npm run db:migrate` / `db:validate` | PostgreSQL |
| `npm run quality:fast` | Iteración agente / cambios pequeños |
| `npm run quality:clinical` | Cierre MF clínico |
| `npm run quality:full` | Pre-PR clásico (check + test + db) |
| **`npm run quality:required`** | **Nuevo** — gate PR (check + test + db + ficha-first) |
| **`npm run quality:nightly`** | **Nuevo** — paridad CI extendida |
| `npm run quality:ui` / `quality:ai` | Aliases MF-FF-15 |

Los scripts restantes en root (Fase 2): **33** `quality:*` (7 meta + 25 wired shims + `quality:gate`). El resto vive en `catalog-full.json`.

```bash
npm run quality:gate -- quality:ficha-first-next   # gate no wired en CI
node tools/gates/run-legacy.mjs quality:registry-status
npm run test:e2e:tramo-j -w @epis2/web             # E2E fuera de shims root
npm run db:reindex-chunks -w @epis2/api             # db avanzado en api workspace
```

---

## Gates con manifiesto

```text
tools/gates/
├── run-gate.mjs       # runner
├── required.json      # PR / release
├── nightly.json       # paridad CI
├── experimental.json  # opcional / pesado
├── catalog.json       # auto-generado
├── sync-catalog.mjs
└── verify-infra.mjs
```

### Ejecutar

```bash
npm run quality:required
npm run quality:nightly          # largo — Postgres + E2E
node tools/gates/run-gate.mjs experimental
node tools/gates/run-gate.mjs --dry-run required
node tools/gates/run-gate.mjs run quality:ficha-first-gate
```

### Regenerar catálogo

Tras añadir `quality:*` que apunte a `scripts/quality/validate-*.mjs`:

```bash
npm run tool:gates:sync-catalog
```

### Verificar infra Fase 0–1

```bash
npm run tool:gates:verify
```

---

## Clasificación de scripts (Fase 0)

```bash
npm run tool:scripts:classify
```

Genera `tools/legacy-scripts/scripts-classification.csv` con columnas:

- `script` — nombre npm
- `action` — KEEP_ROOT | MOVE_TO_TOOLS | MOVE_TO_LABS | MOVE_TO_WORKSPACE | ARCHIVE | NEEDS_REVIEW
- `command` — comando actual

Snapshot pre-cambios: `tools/legacy-scripts/package-before-consolidation.json`

---

## Cómo agregar un script nuevo

1. ¿Lo usa **cualquier** dev **cada día** o **CI en cada PR**?
   - **Sí** → candidato root (máx. ~20 total objetivo)
   - **No** → workspace o `scripts/` + entrada solo en `catalog.json`

2. Gate de microfase MF-*:
   - Implementar `scripts/quality/validate-<mf>-gate.mjs`
   - Fase 1: añadir a `package.json` (temporal)
   - Fase 2: solo `catalog.json` + shim `run-legacy.mjs`

3. Tras cambios en gates root, ejecutar:

```bash
npm run tool:gates:sync-catalog
npm run tool:gates:verify
npm run quality:fast
```

---

## Roadmap descongestión

| Fase | Entrega | Estado |
|------|---------|--------|
| **0** | Backup + classify CSV + este doc | ✓ |
| **1** | `tools/gates/*` + `quality:required/nightly` | ✓ |
| **2** | Quitar ~245 `quality:*` del root; `quality:gate` + shims wired | ✓ |
| **3** | `db:*` → `@epis2/api`; `test:e2e*` → `@epis2/web` | ✓ |
| **4** | Gates CI catalog-aware + `build:packages` + verify | ✓ |

---

## Referencias

- [`EPIS2_CURRENT_STATE.md`](EPIS2_CURRENT_STATE.md)
- [`EPIS2_DEV_VELOCITY.md`](dev/EPIS2_DEV_VELOCITY.md)
- `.github/workflows/ci.yml` — fuente de `nightly.json`
