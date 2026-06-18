# EPIS2 — Guía para agentes (Cursor) v2

> Los errores de EPIS no son recuerdos: son gates de EPIS2.

**Fase:** consolidación post-rc3 — **no features clínicas nuevas** salvo MF autorizada.  
**Brújula:** [`docs/EPIS2_CURRENT_STATE.md`](docs/EPIS2_CURRENT_STATE.md) · **Congelamiento:** [`docs/CONSOLIDATION_FREEZE.md`](docs/CONSOLIDATION_FREEZE.md)  
**Contexto:** [`docs/AGENT_CONTEXT_MINIMAL.md`](docs/AGENT_CONTEXT_MINIMAL.md)

## Antes de editar

1. Leer brújula + congelamiento + contexto mínimo.
2. Declarar alcance MF-* (zona · archivos permitidos · gate · riesgo).
3. Arranque sesión: `npm run dev:session` → `@reports/dev-agent-brief.md`
4. Canon si aplica: `docs/PRODUCT_CANON.md`, `docs/product/PRODUCT_INVARIANTS.md`
5. Legacy EPIS si aplica: `docs/legacy/EPIS_POSTMORTEM.md` + `legacy-import-manifest.json`
6. **No** planificar desde `docs/product/EPIS2_TABLERO.md` — índice humano, no fuente de verdad.

## Programa activo

**PROG-PRODUCT-MAP** — mapa humano verificable post-PONYTAIL (`EPIS2_ROUTE_MAP.md`, `EPIS2_PRODUCT_CATALOG.md`, `quality:product-map-gate`).

**PROG-PURGE-CICA** — archivar, referenciar, sacar del alcance de agentes.  
Plan: [`docs/product/EPIS2_PURGE_ARCHIVE_PLAN.md`](docs/product/EPIS2_PURGE_ARCHIVE_PLAN.md) · Perímetro: [`docs/archive/AGENT_SCOPE_EXCLUSIONS.md`](docs/archive/AGENT_SCOPE_EXCLUSIONS.md)

**Experiencia visual:** CICA (`/app/*`, `packages/epis2-ui/src/cica/`). Legacy `/espacio/*` = fallback only.

## Alcance agente (obligatorio)

1. Leer **solo** brújula + brief + un prompt activo — ver `AGENT_SCOPE_EXCLUSIONS.md`.
2. **No** indexar ni planificar desde `reports/archive/`, tramos A–K, three modes, olas M3.
3. **No** borrar evidencia — archivar y dejar puntero.

## Comandos

| Iteración | Pre-PR | Pre-tag |
|-----------|--------|---------|
| `npm run quality:fast` | `npm run quality:required` | `npm run quality:release` |

Cambios clínicos: `npm run quality:clinical` · Cierre sesión: `npm run dev:agent:close`  
Gate histórico: `npm run quality:gate -- quality:<name>` · scripts archivados: `npm run tool:script -- <name>` · índice: `docs/dev/SCRIPT_INDEX.md`

## Detenerse si

- `architecture:validate` falla.
- Contradice invariantes o allowlist.
- Segundo Command/Form Registry temporal.
- OpenMRS, Carbon o dashboard como home.

## Prohibido

Reabrir programas archivados (tramos A–K, three modes, olas M3, OpenClaw auto-dev) · planificar desde `reports/archive/` · auto-aprobación · PHI real · import masivo desde `../Epis` · **borrar** evidencia archivada.

**Campañas cerradas:** [`docs/archive/ARCHIVED_PROGRAMS_INDEX.md`](docs/archive/ARCHIVED_PROGRAMS_INDEX.md) · playbooks: [`docs/archive/agent-playbooks/`](docs/archive/agent-playbooks/)
