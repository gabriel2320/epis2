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

**PROG-UX-LAB** — UX y confianza clínica visual, sin endpoints clínicos nuevos.  
Plan: [`docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md`](docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md)

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

Reabrir week gates, three modes o tramos A–K como trabajo activo · auto-aprobación · PHI real · import masivo desde `../Epis`.

**Campañas cerradas (histórico):** [`docs/archive/agent-playbooks/`](docs/archive/agent-playbooks/)
