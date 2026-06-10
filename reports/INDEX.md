# reports/ — Índice y política

**Actualizado:** 2026-06-09 · Censo actual: ~305 `.md`

## Convención

- Nombre: `epis2-<slug>-YYYY-MM-DD.md` (obligatorio para reportes de sesión nuevos).
- Contenido mínimo: alcance · gates ejecutados · riesgos · **próximo paso exacto**.
- Todo cierre de hilo/tramo/pendiente debe quedar referenciado en [`docs/product/EPIS2_TABLERO.md`](../docs/product/EPIS2_TABLERO.md).

## Archivos generados (no editar a mano)

| Archivo | Generador |
|---|---|
| `dev-agent-brief.md` | `npm run dev:session` — sincronizado con el tablero (§ Estado del tablero) |
| `dev-agent-prompt-*.md` | `npm run dev:session` |
| `dev-agent-ollama-plan.json` | `dev:agent:ollama*` — ignorado por el brief si tiene >24 h |

## Política de archivado

1. Un reporte es **evidencia activa** mientras lo referencie el tablero, el plan global o un pendiente abierto.
2. Reportes sin referencia y con **>90 días** se mueven a `reports/archive/YYYY-MM/` (mover, no borrar — trazabilidad).
3. Los snapshots duplicados de canon llevan banner `ARCHIVADO` apuntando al doc vigente (ej. `epis2-wave-execution-canon-v1.md`).
4. Plantillas y generados (`dev-agent-*`) nunca se archivan.

## Evidencia activa (tablero 2026-06-09)

Ver tabla «Hecho» del [tablero](../docs/product/EPIS2_TABLERO.md) — cada fila enlaza su reporte. Destacados recientes:

- [`epis2-auditoria-profunda-2026-06-09.md`](./epis2-auditoria-profunda-2026-06-09.md) — plan 5 fases (1–4 ✓)
- [`epis2-auditoria-inventario-limpieza-2026-06-09.md`](./epis2-auditoria-inventario-limpieza-2026-06-09.md) — inventario + plan F1–F5
- [`epis2-f1-f2-limpieza-print-2026-06-09.md`](./epis2-f1-f2-limpieza-print-2026-06-09.md) — PEND-006 código cerrado
- [`epis2-pendientes-registro-2026-06-09.md`](./epis2-pendientes-registro-2026-06-09.md) — registro PEND-001…012
- [`epis2-norma-fullstack-compliance-2026-06-10.md`](./epis2-norma-fullstack-compliance-2026-06-10.md) — auditoría norma full stack (≈70%) → [plan Hilo NORM](../docs/product/EPIS2_NORMA_FULLSTACK_PLAN.md)
- [`epis2-norm-n1-quick-wins-2026-06-10.md`](./epis2-norm-n1-quick-wins-2026-06-10.md) — Tramo N1 cerrado (MF-101…105 + avance 201/302/303/401/402; gates verdes)
- [`epis2-norm-n4-ui-a11y-e2e-2026-06-10.md`](./epis2-norm-n4-ui-a11y-e2e-2026-06-10.md) — Tramo N4 cerrado (axe + role-first + drawer móvil + RHF server errors; re-auditoría §4/§5/§10, ≈85%)
- [`epis2-norm-n3-api-contract-2026-06-10.md`](./epis2-norm-n3-api-contract-2026-06-10.md) — Tramo N3 cerrado (OpenAPI desde Zod + ADR/threat model previos)
- [`epis2-norm-hilo-close-2026-06-10.md`](./epis2-norm-hilo-close-2026-06-10.md) — Hilo NORM cerrado (16/16 MF, ≈90%)
- [`epis2-m3-visual-pass-2026-06-10.md`](./epis2-m3-visual-pass-2026-06-10.md) — Pasada visual M3 V1–V6 (capturas en `m3-visual-evidence/2026-06-10/`)
