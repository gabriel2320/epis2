# EPIS2 — Contexto mínimo para agentes (Cursor)

**Versión:** 4.9 · **PROG-AGENT-TRUTH** ✓ · **PROG-PRODUCT-MAP** ✓ · tags **`v0.1-demo-rc3`** · **`epis2-base-v0.1`**

> **Brújula de alcance:** [`EPIS2_CURRENT_STATE.md`](EPIS2_CURRENT_STATE.md) · **Gobierno docs:** [`DOCUMENTATION_GOVERNANCE.md`](DOCUMENTATION_GOVERNANCE.md) · **Congelamiento:** [`CONSOLIDATION_FREEZE.md`](CONSOLIDATION_FREEZE.md) · inventario: [`MODULE_INVENTORY.md`](MODULE_INVENTORY.md)

---

## Reglas canónicas (10 líneas)

1. **Ficha-first + CICA activa** — Intención producto: censo → ficha → borrador → aprobación. **Entrada operativa:** `/app/buscar` (CICA). **Fallback legacy:** `/espacio/*` (`VITE_ENABLE_CICA_UI=false`). Barra de comando transversal; `/comando` solo redirect compat.
2. **PostgreSQL = SoT** — borrador ≠ dato clínico aprobado.
3. **IA propone, humano aprueba** — sin auto-firma ni auto-aprobación.
4. **Sin PHI real** — solo datos sintéticos/demo.
5. **App funciona sin Ollama** — IA local es capa opcional.
6. **Un Command Registry** — `packages/command-registry` (no duplicar).
7. **Un Form Registry** — `packages/clinical-forms` (no duplicar).
8. **Fronteras** — `apps/web` no importa servicios runtime directamente; sin `@mui/*` directo en web.
9. **Legacy** — no copiar desde `../Epis` sin `legacy-import-manifest.json`.
10. **Git** — no commit/push automático.

---

## Modo microfase (obligatorio)

Declarar antes de editar:

```text
MF-* / objetivo · zona · archivos permitidos · prohibidos · gate · riesgo
```

Un objetivo · pocos archivos · diff mínimo.

**No** auto-iniciar otra MF READY del ledger salvo petición explícita del usuario.

---

## Programa activo (2026-06-18)

| Programa | Estado | Evidencia |
|----------|--------|-----------|
| **PROG-PURGE-CICA** | ◐ MF-PURGE-00…08 | [`EPIS2_PURGE_ARCHIVE_PLAN.md`](product/EPIS2_PURGE_ARCHIVE_PLAN.md) · [`AGENT_SCOPE_EXCLUSIONS.md`](archive/AGENT_SCOPE_EXCLUSIONS.md) |
| **PROG-PRODUCT-MAP** | ✓ cerrado | Tag **`epis2-base-v0.1`** · [`epis2-prog-product-map-close.md`](../reports/epis2-prog-product-map-close.md) |
| **PROG-UX-LAB** | ✓ cerrado | [`EPIS2_UX_LAB_MODERN_PLAN.md`](quality/EPIS2_UX_LAB_MODERN_PLAN.md) |
| **PROG-AGENT-TRUTH** | ✓ AT-01…05 | `quality:agent-truth-gate` · [`AGENTS.md`](../AGENTS.md) v2 |
| **PROG-POST-RC3** | ✓ tramos 1–5 | [`epis2-prog-post-rc3-close.md`](../reports/epis2-prog-post-rc3-close.md) |
| **PROG-RELEASE-HARDENING** | ✓ RH-01…08 | tag `v0.1-demo-rc3` |
| **PROG-PONYTAIL-TRIM** | ✓ cierre técnico | KNIP-00…04 · MF-PONY-02…07 · MF-PONY-GATE-01 · merge `b2d6a00` |

Programas cerrados (no reabrir): PROG-FICHA-FIRST · PROG-STRENGTHEN 23/23 · PROG-CONSOLIDATE ola 1+2 · PROG-CDS-UX · PROG-RAPID.

**Congelamiento vigente** — sin features clínicas nuevas salvo MF autorizada. Tag demo: **`v0.1-demo-rc3`**.

**Knip:** `npm run knip:audit` · KNIP-04 **0** files/deps/unlisted/duplicates · exports **114** (MF-KNIP-05-A/B ✓; no poda masiva).

---

## Gates por tipo de cambio

| Cambio | Gate |
|--------|------|
| Docs, reportes, scripts quality, UI menor | `npm run quality:fast` o `npm run dev:rapid` |
| Estado ledgers (iteración) | `npm run quality:registry-status` |
| API/web/packages clínicos, microfase | `npm run quality:clinical` |
| Pre-PR | `npm run quality:full` o **`quality:required`** |
| CI extendido local | `npm run quality:nightly` |
| Gate MF histórico | `npm run quality:gate -- quality:<name>` |
| UX-LAB Autopilot (Modo A) | `npm run quality:gate -- quality:ux-lab-autopilot` · [`tools/ux-lab-autopilot/README.md`](../../tools/ux-lab-autopilot/README.md) |
| Scripts archivados | `npm run tool:script -- <name>` · índice [`dev/SCRIPT_INDEX.md`](dev/SCRIPT_INDEX.md) |

### `quality:fast` incluye

- resumen `git status`
- scan PHI/secrets en archivos tocados
- eslint + typecheck + vitest **archivos tocados** (tests hermanos si existen)
- `architecture:validate`

### `dev:rapid` (MF-RAPID-03)

= `quality:fast` + `dev:agent:audit-diff` (omitido si solo docs o `--skip-audit`).

### No leer salvo petición explícita del operador

- **`reports/archive/**`** — evidencia histórica (481+ archivos); puntero: [`archive/2026-06/README.md`](../reports/archive/2026-06/README.md)
- **`docs/archive/AGENT_SCOPE_EXCLUSIONS.md`** — leer **sí** al inicio; define qué más no leer
- Planes tramo/ola: `docs/product/EPIS2_TRAMO_*`, `EPIS2_GLOBAL_DEV_PLAN.md`
- Subagentes archivados: `tramo-implementer`, `m3-guardian`, `layers-integrator`
- Todo el monorepo “por explorar”

---

## Prohibido sin autorización explícita

- `database/migrations/*` (salvo MF de migración)
- auth, RBAC, RLS, flujos de aprobación clínica
- segundo registry temporal
- OpenMRS, Carbon, import masivo EPIS

---

## Loop recomendado (sesión)

```bash
npm run stack:dev          # si hace falta
npm run dev:velocity       # brief + subagente
# … implementar microfase …
npm run dev:rapid          # fast + audit-diff (MF-RAPID-03)
npm run quality:registry-status  # ledgers consolidados (iteración)
npm run quality:clinical   # cierre MF clínico
npm run dev:agent:close    # reporte sesión
```

Atajos: `quality:fast` · `dev:agent:audit-diff` · `dev:rapid -- --skip-audit`

---

## Referencias cortas

| Doc | Cuándo |
|-----|--------|
| [`EPIS2_CURRENT_STATE.md`](EPIS2_CURRENT_STATE.md) | **Brújula módulos y consolidación** |
| [`EPIS2_ROUTE_MAP.md`](product/EPIS2_ROUTE_MAP.md) | Rutas CICA — generado desde registry |
| [`EPIS2_PRODUCT_CATALOG.md`](product/EPIS2_PRODUCT_CATALOG.md) | Objetos clínicos v0.1 |
| [`epis2-prog-product-map-close.md`](../reports/epis2-prog-product-map-close.md) | Cierre PROG-PRODUCT-MAP · tag `epis2-base-v0.1` |
| [`EPIS2_TABLERO.md`](product/EPIS2_TABLERO.md) | **No planificar** — índice humano |
| [`EPIS2_DEV_VELOCITY.md`](dev/EPIS2_DEV_VELOCITY.md) | Gates por rol |
| [`GOLDEN_CLINICAL_JOURNEY.md`](../quality/GOLDEN_CLINICAL_JOURNEY.md) | Solo UI/flujo clínico |
