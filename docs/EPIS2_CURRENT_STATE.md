# EPIS2 — Estado actual del proyecto (brújula)

**Versión:** 1.1 · **Fecha:** 2026-06-15  
**Audiencia:** equipos, agentes Cursor, planificación  
**Gobierno documental:** [`DOCUMENTATION_GOVERNANCE.md`](DOCUMENTATION_GOVERNANCE.md) · **Entrada pública:** [`README.md`](../README.md)  
**Supersedes parcialmente:** [`EPIS2_TABLERO.md`](product/EPIS2_TABLERO.md) para decisiones de alcance (tablero = índice humano)

> Visión north star: [`product/VISION_EPIS2.md`](product/VISION_EPIS2.md) v2 · Canon: [`PRODUCT_CANON.md`](PRODUCT_CANON.md)

---

## Resumen ejecutivo

EPIS2 **compila y demuestra** un flujo clínico mínimo (censo → ficha dual → borrador → aprobación) con IA opcional. Los programas recientes **PROG-FICHA-FIRST**, **PROG-STRENGTHEN** y **PROG-CDS-UX** están cerrados.

El problema operativo principal (**superficie npm/gates**) se abordó con **PROG-CONSOLIDATE ola 1 ✓** (Fases 0–4). **Ola 2** = gobierno + hardening — ver [`CONSOLIDATION_FREEZE.md`](CONSOLIDATION_FREEZE.md).

**Git:** una rama productiva (`master`). Las “ramas truncadas” son **módulos a medias en master**, no branches git olvidadas.

---

## EPIS2 Base v0.1 (definición de núcleo entregable)

Checklist para declarar “base consolidada”. No es HIS integral.

| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| Compila + typecheck | ✓ | `npm run check` |
| Login demo | ✓ | auth demo |
| Pacientes sintéticos | ✓ | fixtures DEMO/SIM |
| Home = censo + barra transversal | ✓ | PROG-FICHA-FIRST |
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
| **Archive / histórico** | Legacy, candidatos, reportes viejos | `migration/`, `docs/archive/`, `reports/archive/` · índice [`reports/README.md`](../reports/README.md) |
| **Satélites externos** | Contrato JSON/HTTP, no import cruzado | `../epis2-evolab`, `../EPIS2-MedRepo` — [`EPIS2_TRIADA_REPOS.md`](product/EPIS2_TRIADA_REPOS.md) |

Regla: **core no depende de labs** (deuda: API aún puede tocar case-intel — marcar needs-review).

---

## Programas (estado 2026-06-15)

| Programa | Estado | Gate cierre |
|----------|--------|-------------|
| PROG-FICHA-FIRST | ✓ cerrado MF-FF-01…15 | `quality:ficha-first-gate` |
| PROG-STRENGTHEN | ✓ 23/23 | `quality:strengthen-close-gate` |
| PROG-CDS-UX | ✓ MF-CU-01…04 | `quality:cds-hooks-gate` |
| PROG-RAPID | ✓ cerrado | `quality:rapid-gate` |
| PROG-DI / tríada F6 | ✓ contratos | ver `reports/conciliacion/` |
| **PROG-CONSOLIDATE** | ✓ ola 1 (Fase 0–4) · **ola 2 activa** | [`CONSOLIDATION_FREEZE.md`](CONSOLIDATION_FREEZE.md) · `tool:consolidate:verify-phase4` |

Detalle inventario módulos: [`MODULE_INVENTORY.md`](MODULE_INVENTORY.md).

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
| ~240 gates `validate-*` | Histórico MF | No | **Consolidar** — meta-gates abajo |
| ~460 `reports/*.md` (raíz) | Histórico | No | **Archive** progresivo · lote 1 → `reports/archive/2026-06/` |

---

## Gates humanos (usar estos, no 275 aliases)

| Cuándo | Comando | Contenido |
|--------|---------|-----------|
| Iteración / agente | `npm run quality:fast` | lint + tsc + vitest tocados + `architecture:validate` |
| Cierre MF clínico | `npm run quality:clinical` | fast + db + gates rol |
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
login · pacientes demo · censo home · ficha dual · command bar
formularios core · borradores · aprobación humana · auditoría
PostgreSQL · API · @epis2/contracts · golden journey · degrade IA
```

Prohibido en fase consolidación: nuevos registries, nuevo home, auto-aprobación, imports `@epis2/local-ai` en web, copia EPIS sin manifest.

---

## Fase PROG-CONSOLIDATE (propuesta)

| Fase | Estado | Artefactos |
|------|--------|------------|
| **0** Snapshot + clasificación | ✓ | `tools/legacy-scripts/`, `tool:scripts:classify` |
| **1** Meta-gates + catálogo | ✓ | `tools/gates/`, `quality:required`, `quality:nightly` |
| **2** Reducir root `package.json` | ✓ | `quality:gate`, shims wired, `catalog-full.json` |
| **3** Mover `db:*` / E2E a workspaces | ✓ | `@epis2/api` db · `@epis2/web` e2e |
| **4** CI/catalog compat | ✓ | case-intel gates · build chain CI |

## Ola 2 — Gobierno + hardening (activa)

Congelamiento: [`CONSOLIDATION_FREEZE.md`](CONSOLIDATION_FREEZE.md). PRs pequeños `MF-CON-*` — **no mega-cambio**.

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
| [`SCOPE_V1.md`](SCOPE_V1.md) / [`NON_GOALS.md`](NON_GOALS.md) | Límites MVP |
| [`epis2-prog-ficha-first-close-2026.md`](../reports/epis2-prog-ficha-first-close-2026.md) | Último cierre producto |
