# EPIS2 — Estado actual del proyecto (brújula)

**Versión:** 1.5 · **Fecha:** 2026-06-18  
**Audiencia:** equipos, agentes Cursor, planificación  
**Gobierno documental:** [`DOCUMENTATION_GOVERNANCE.md`](DOCUMENTATION_GOVERNANCE.md) · **Entrada pública:** [`README.md`](../README.md)  
**Supersedes parcialmente:** [`EPIS2_TABLERO.md`](product/EPIS2_TABLERO.md) para decisiones de alcance (tablero = índice humano)

> Visión north star: [`product/VISION_EPIS2.md`](product/VISION_EPIS2.md) v2 · Canon: [`PRODUCT_CANON.md`](PRODUCT_CANON.md)

---

## Resumen ejecutivo

EPIS2 **compila y demuestra** un flujo clínico mínimo (censo → ficha dual → borrador → aprobación) con IA opcional. Los programas recientes **PROG-FICHA-FIRST**, **PROG-STRENGTHEN** y **PROG-CDS-UX** están cerrados.

El problema operativo principal (**superficie npm/gates**) se abordó con:

- **PROG-CONSOLIDATE ola 1 ✓** (Fases 0–4) y **ola 2 ✓** (MF-CON-02…11 + 09/10, PR [#12](https://github.com/gabriel2320/epis2/pull/12)).
- **PROG-RELEASE-HARDENING ✓** (RH-01…08, PR [#15](https://github.com/gabriel2320/epis2/pull/15)+[#16](https://github.com/gabriel2320/epis2/pull/16)): Node 24, workflows security report-only, auth fail-closed, `quality:release`, bridge fixtures web.
- Congelamiento vigente: [`CONSOLIDATION_FREEZE.md`](CONSOLIDATION_FREEZE.md).
- Tags demo: **`v0.1-demo-rc`** · **`v0.1-demo-rc2`** · **`v0.1-demo-rc3`** (release hardening + README alineado).

**Git:** una rama productiva (`master` post-PRODUCT-MAP). Tags: **`v0.1-demo-rc3`** (demo) · **`epis2-base-v0.1`** (base consolidada). Las “ramas truncadas” son **módulos a medias en master**, no branches git olvidadas.

---

## Entrada operativa vs fallback (2026-06-18)

| Rol | Ruta / modo | Notas |
|-----|-------------|-------|
| **Entrada operativa activa** | `/app/buscar` (CICA) | UI clínica por defecto; registry `EPIS_CICA_SCREEN_REGISTRY` |
| **Intención ficha-first** | censo → ficha → borrador → aprobación | Invariante de producto; no implica ruta legacy como home |
| **Fallback legacy** | `/espacio/*` | `VITE_ENABLE_CICA_UI=false`; no expandir como home |
| **Prohibido** | dashboard / three modes como home | secundarios OK; gates `command-center-home`, CICA clean room |

SoT técnico rutas CICA: `packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts` · mapa humano: [`EPIS2_ROUTE_MAP.md`](product/EPIS2_ROUTE_MAP.md) · artefacto gate: `tools/catalog/route-map.generated.json`.

---

## EPIS2 Base v0.1 (definición de núcleo entregable)

Checklist para declarar “base consolidada”. No es HIS integral.

| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| Compila + typecheck | ✓ | `npm run check` |
| Login demo | ✓ | auth demo |
| Pacientes sintéticos | ✓ | fixtures DEMO/SIM |
| Home = censo + barra transversal | ✓ | PROG-FICHA-FIRST · entrada operativa CICA `/app/buscar` |
| Ficha dual MD3 \| papel | ✓ parcial | dual chart; no todos los docs sincronizados |
| Command bar + registry | ✓ | `@epis2/command-registry` |
| Formularios core (evolución, epicrisis, receta, lab) | ✓ | `@epis2/clinical-forms` |
| Borrador → aprobación humana | ✓ | invariantes + API |
| Auditoría básica | ✓ | audit store |
| IA opcional (degrade) | ✓ | `quality:sh-03-degrade-gate` |
| Golden journey | ✓ | `docs/quality/GOLDEN_CLINICAL_JOURNEY.md` |
| Flujo ambulatorio completo | ◐ | roadmap |
| Facturación / farmacia HIS | ✗ | [`NON_GOALS.md`](NON_GOALS.md) |

Leyenda: ✓ · ◐ parcial · ✗ fuera de alcance actual.

---

## Cuatro zonas lógicas (no mover carpetas aún)

| Zona | Qué es | Rutas repo |
|------|--------|------------|
| **Core producto** | Ficha, API, SoT, UI clínica | `apps/web`, `apps/api`, `packages/*` (ver inventario), `database/` |
| **Labs in-repo** | Sintéticos, intel externa, no imprescindibles al arranque | `services/clinical-case-intel`, `services/drug-intel` |
| **Runtime IA** | Assist opcional | `services/local-ai`, `packages/ai-client` |
| **Tools / dev** | Gates, agentes, CI, auditorías | `scripts/`, `.github/`, `.cursor/` |
| **Archive / histórico** | Legacy, candidatos, reportes viejos | `migration/`, `docs/archive/`, `reports/archive/` · índice [`reports/archive/2026-06/README.md`](../reports/archive/2026-06/README.md) |
| **Satélites externos** | Contrato JSON/HTTP, no import cruzado | `../epis2-evolab`, `../EPIS2-MedRepo` — [`EPIS2_TRIADA_REPOS.md`](product/EPIS2_TRIADA_REPOS.md) |

Regla: **core no depende de labs** — gate `quality:core-no-labs-imports-gate` · deuda conocida: tablas staging + rutas admin de promoción (sin import npm).

---

## Programas (estado 2026-06-18)

| Programa | Estado | Gate / evidencia |
|----------|--------|------------------|
| PROG-FICHA-FIRST | ✓ cerrado MF-FF-01…15 | `quality:ficha-first-gate` |
| PROG-STRENGTHEN | ✓ 23/23 | `quality:strengthen-close-gate` |
| PROG-CDS-UX | ✓ MF-CU-01…04 | `quality:cds-hooks-gate` |
| PROG-RAPID | ✓ cerrado | `quality:rapid-gate` |
| PROG-DI / tríada F6 | ✓ contratos | `reports/conciliacion/` |
| **PROG-CONSOLIDATE** | ✓ ola 1+2 | [`CONSOLIDATION_FREEZE.md`](CONSOLIDATION_FREEZE.md) |
| **PROG-RELEASE-HARDENING** | ✓ RH-01…08 | tag `v0.1-demo-rc3` |
| **PROG-PONYTAIL-TRIM** | ✓ cierre técnico | KNIP-00…04 + MF-PONY-02…07 + MF-PONY-GATE-01 · [`epis2-mf-pony-gate-01-close.md`](../reports/epis2-mf-pony-gate-01-close.md) |
| **PROG-PRODUCT-MAP** | ✓ cerrado | MF-BRÚJULA-00…RELEASE-BASE-01 · tag **`epis2-base-v0.1`** · [`epis2-prog-product-map-close.md`](../reports/epis2-prog-product-map-close.md) |
| **PROG-PURGE-CICA** | ◐ en paralelo | [`EPIS2_PURGE_ARCHIVE_PLAN.md`](product/EPIS2_PURGE_ARCHIVE_PLAN.md) |

Detalle inventario módulos: [`MODULE_INVENTORY.md`](MODULE_INVENTORY.md).

---

## Post-rc3 — programa activo

Congelamiento vigente ([`CONSOLIDATION_FREEZE.md`](CONSOLIDATION_FREEZE.md)): **no features clínicas nuevas** salvo MF autorizada. Tag **`v0.1-demo-rc3`** publicado (release hardening + README alineado).

**PROG-POST-RC3** ✓ **cerrado** (2026-06-11) — tramos 1–5 · [`epis2-prog-post-rc3-close.md`](../reports/epis2-prog-post-rc3-close.md)

| Tramo | Enfoque | Estado |
|-------|---------|--------|
| PROG-GOBIERNO-POST-RC3 | Docs · tablero · brújula | ✓ Tramo 1 |
| PROG-DEV-PARITY | CRLF / `quality:release` local Windows | ✓ Tramo 2 |
| PROG-LEGAL-DISCLAIMER | DISCLAIMER v1.1 | ✓ Tramo 3 |
| PROG-DEPS-HYGIENE | Triage Dependabot | ✓ Tramo 4 |
| PROG-SECURITY-PROMOTE | RH-09/10/11 blocking | ✓ Tramo 5 |

**DEV-PARITY / D-01:** ✓ resuelto (2026-06-16) — `.gitattributes` + `.editorconfig`; `format:check` y `quality:release` verdes en Windows. Evidencia: [`epis2-prog-dev-parity-tramo2-close.md`](../reports/epis2-prog-dev-parity-tramo2-close.md).

Plan detallado: [`epis2-audit-plan-post-rc3-2026.md`](../reports/epis2-audit-plan-post-rc3-2026.md). **Sin PHI real** — solo datos sintéticos DEMO/SIM.

**Programa activo (producto):** **PROG-PURGE-CICA** — archive docs/reportes · UX-LAB ✓ · visual activa `/app/*` CICA.

**Knip (2026-06-18):** instalado (`knip ^6.17.1`, `npm run knip:audit`) · **0** unused files · **0** unused deps · **0** unlisted · **0** duplicate exports (KNIP-04) · exports **114** / types **68** tras MF-KNIP-05-A/B (triage conservador; no poda masiva).

---

## Mapa módulo × acción

| Módulo / área | Estado | ¿Core Base v0.1? | Acción |
|---------------|--------|-------------------|--------|
| `apps/web` + `apps/api` | Vivo | Sí | **Keep** — solo fixes; congelar features |
| `@epis2/contracts` | Vivo | Sí | **Keep** |
| `@epis2/clinical-domain` | Vivo | Sí | **Keep** (CDS demo) |
| `@epis2/clinical-forms` | Vivo | Sí | **Keep** |
| `@epis2/command-registry` | Vivo | Sí | **Keep** |
| `@epis2/clinical-productivity` | Vivo | Sí | **Keep** |
| `@epis2/epis2-ui` + `design-system` | Vivo | Sí | **Keep** |
| `@epis2/epis2-widgets` | Vivo | Sí | **Keep** |
| `@epis2/ai-client` | Vivo | Sí (frontera) | **Keep** |
| `@epis2/fhir-export` | Vivo | No runtime UI | **Keep** — frontera interop |
| `@epis2/test-fixtures` | Vivo | Soporte tests | **Keep** |
| `services/local-ai` | Vivo | Opcional | **Keep** — no acoplar web directo |
| `services/clinical-case-intel` | Experimental | No | **Labs** — no nuevas deps core→ |
| `services/drug-intel` | Experimental | No | **Labs** — idem |
| MedRepo loader (API) | Vivo parcial | No | **Keep** — fixture sintético default |
| Evolab bridge | Vivo | No | **Labs ext** — repo hermano |
| Dashboard `/epis2/dashboard` | Vivo secundario | No home | **Keep** — no expandir como home |
| Classic MD3 / three modes | Vivo | Modo secundario | **Keep** — no mezclar con ficha-first |
| Tramos clínicos A–K (scaffolds) | Truncado / demo | No | **Needs-review** — inventariar por tramo |
| Olas M3 / papel planner | Parcial | Parcial | **Needs-review** — gates muchos |
| OpenMRS / Carbon / EPIS overlay | Fósil | No | **Archive** — solo `migration/` + audit scripts |
| `scripts/dev-agent` OpenClaw | Dev tooling | No | **Tools** — no producto clínico |
| ~240 gates `validate-*` | Histórico MF | No | **Consolidar** — 76 activos · 247 archived · `PROG-PONYTAIL-TRIM` |
| ~30 `reports/*.md` (raíz) | Activo + histórico reciente | No | **Archive** ✓ lotes 6–12 · hub `epis2-prog-product-map-close.md` · plan [`EPIS2_PURGE_ARCHIVE_PLAN.md`](product/EPIS2_PURGE_ARCHIVE_PLAN.md) |

---

## Gates humanos (usar estos, no 275 aliases)

| Cuándo | Comando | Contenido |
|--------|---------|-----------|
| Iteración / agente | `npm run quality:fast` | lint + tsc + vitest tocados + `architecture:validate` |
| Cierre MF clínico | `npm run quality:clinical` | fast + db + gates rol |
| Pre-tag release | `npm run quality:release` | check + format + security smoke + fixtures bridge |
| Pre-PR | `npm run quality:full` o **`quality:required`** | check + test + db + ficha-first (manifest) |
| CI extendido local | `npm run quality:nightly` | Paridad `.github/workflows/ci.yml` (manifest) |
| UI bundle | `npm run quality:ui` | ui-simplify meta-gate |
| IA frontera | `npm run quality:ai` | degrade + ai-client + web-ai-boundary |
| Producto ficha | `npm run quality:ficha-first-gate` | PROG-FICHA-FIRST regresión |

**Fase 0–3 ✓ (2026-06-15):** … **245** `quality:*` podados · **db:**6 en `@epis2/api` · **e2e:**28 en `@epis2/web` · root shims `db:migrate`/`db:validate`/`test:e2e`.

Métrica de deuda: **~150** scripts npm totales en root · **273** gates en catálogo · **33** `quality:*` visibles en root.

---

## Core intocable (no romper en consolidación)

```text
login · pacientes demo · censo (intención ficha-first) · entrada CICA /app/buscar
ficha dual · command bar · formularios core · borradores · aprobación humana · auditoría
PostgreSQL · API · @epis2/contracts · golden journey · degrade IA
fallback legacy /espacio/* (no home)
```

Prohibido en fase consolidación: nuevos registries, nuevo home, auto-aprobación, imports `@epis2/local-ai` en web, copia EPIS sin manifest.

---

## PROG-CONSOLIDATE (cerrado)

| Fase | Estado | Artefactos |
|------|--------|------------|
| **0** Snapshot + clasificación | ✓ | `tools/legacy-scripts/`, `tool:scripts:classify` |
| **1** Meta-gates + catálogo | ✓ | `tools/gates/`, `quality:required`, `quality:nightly` |
| **2** Reducir root `package.json` | ✓ | `quality:gate`, shims wired, `catalog-full.json` |
| **3** Mover `db:*` / E2E a workspaces | ✓ | `@epis2/api` db · `@epis2/web` e2e |
| **4** CI/catalog compat | ✓ | case-intel gates · build chain CI |

## Ola 2 — Gobierno + hardening (cerrada 2026-06-16)

Evidencia: [`archive/2026-06/epis2-prog-consolidate-ola2-close-2026.md`](../reports/archive/2026-06/epis2-prog-consolidate-ola2-close-2026.md). Congelamiento: [`CONSOLIDATION_FREEZE.md`](CONSOLIDATION_FREEZE.md) — **no mega-cambio** ni features clínicas nuevas salvo MF autorizada.

| Permitido | Prohibido |
|-----------|-----------|
| Este doc + MODULE_INVENTORY | Nuevos módulos clínicos |
| Actualizar tablero o deprecar | Nuevos modos / dashboards home |
| Meta-gates required/nightly | Nuevos agentes IA producto |
| Archivar reportes antiguos | Renombrar packages masivo |
| Reducir scripts npm visibles | Cambiar comportamiento golden journey |
| Gate core-no-imports-labs | Mega-commit |

Commits pequeños en rama `chore/repo-consolidation-*` recomendado.

---

## Instrucción madre (agentes Cursor)

```text
EPIS2 está en fase de consolidación, no de expansión.
Leer docs/EPIS2_CURRENT_STATE.md y docs/MODULE_INVENTORY.md antes de editar.
Entrada operativa: /app/buscar (CICA). Fallback: /espacio/*.
Programa activo: PROG-PURGE-CICA (archivo y perímetro agente; no pantallas nuevas).
No agregues funcionalidades clínicas nuevas salvo MF autorizada explícitamente.
Clasifica cambios: core | labs | tools | archive.
Preservar golden journey y npm run quality:full verde.
Todo cambio debe mejorar claridad o mantenibilidad sin alterar flujo clínico mínimo.
```

---

## Referencias

| Doc | Uso |
|-----|-----|
| [`DOCUMENTATION_GOVERNANCE.md`](DOCUMENTATION_GOVERNANCE.md) | Jerarquía de verdad · conflictos README/ledger/reports |
| [`archive/PHASE_HISTORY.md`](archive/PHASE_HISTORY.md) | Cronología EPIS2-00…12 (histórico) |
| [`MODULE_INVENTORY.md`](MODULE_INVENTORY.md) | Packages, services, scripts |
| [`VISION_EPIS2.md`](product/VISION_EPIS2.md) | North star + matriz dominio |
| [`AGENT_CONTEXT_MINIMAL.md`](AGENT_CONTEXT_MINIMAL.md) | Loop agente |
| [`product/EPIS2_ROUTE_MAP.md`](product/EPIS2_ROUTE_MAP.md) | Mapa rutas CICA (MF-CATALOG-00 ✓) |
| [`product/EPIS2_PRODUCT_CATALOG.md`](product/EPIS2_PRODUCT_CATALOG.md) | Catálogo objetos clínicos (PROG-PRODUCT-MAP ✓) |
| [`epis2-prog-product-map-close.md`](../reports/epis2-prog-product-map-close.md) | Cierre mapa producto · tag `epis2-base-v0.1` |
| [`SCOPE_V1.md`](SCOPE_V1.md) / [`NON_GOALS.md`](NON_GOALS.md) | Límites MVP |
| [`epis2-audit-plan-post-rc3-2026.md`](../reports/epis2-audit-plan-post-rc3-2026.md) | Auditoría post-rc3 · PROG-POST-RC3 tramos |
