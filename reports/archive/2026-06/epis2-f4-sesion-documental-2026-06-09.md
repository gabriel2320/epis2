# F4 — Sesión documental (gestión de planes, índices y sync agentes)

**Fecha:** 2026-06-09 · **Alcance:** plan F4 de [`epis2-auditoria-inventario-limpieza-2026-06-09.md`](./epis2-auditoria-inventario-limpieza-2026-06-09.md) §2.4 — solo docs + tooling de brief (sin código de producto)

## 1. Sync `dev-agent-brief` ← tablero (D1 — el de mayor impacto)

Causa raíz del brief desalineado («Fase B · Tramo J» con Hilo C activo):

1. `getActivePhaseHint` nunca leía el tablero (heurística estática sobre `EPIS2_GLOBAL_DEV_PLAN.md`).
2. `readOllamaPlan` consumía `dev-agent-ollama-plan.json` **sin límite de edad** — un plan del 2026-06-08 inyectaba «grids dashboard + MF-RAD-M3-A».
3. El «Tramo J» venía de un arg/env de una invocación previa.

Cambios en `scripts/dev-agent/`:

| Archivo | Cambio |
|---|---|
| `context.mjs` | Nuevo `getTableroState(root)` — parsea «En curso» y «Siguiente» de `EPIS2_TABLERO.md` (links limpiados) · `readOllamaPlan` ignora planes con >24 h |
| `brief.mjs` | Sección nueva **«Estado del tablero (fuente canónica)»** al inicio del brief · objetivo sugerido prioriza ledger READY → tablero → plan Ollama fresco (antes el plan Ollama viejo dominaba) · eliminado el fallback obsoleto «Fase B: Command palette + Ola 2» |

Verificado: `npm run dev:session` regenera el brief mostrando Hilo C en curso y P1 del tablero como objetivo; el plan Ollama del día 08 queda filtrado.

## 2. Norma de impresión actualizada (D2)

`docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md` v1.1.0:

- Estado: «sin implementación productiva» → **«implementación parcial»** con gate y registry referenciados.
- §21: componentes implementados (✓ `PrintA5Document`, `PrintLetterDocument`, `PrintSection`, `PrintField` + soporte de página) separados de los objetivo restantes.
- §29: matriz blueprint→formato con columna **Estado** — 5 documentos ✓ (receta, certificado, lab, imagen, epicrisis), 9 pendientes; receta de extensión (1 registry + 1 página + E2E).

## 3. Canon de olas y banners históricos (D3, D4, D7)

| Documento | Cambio |
|---|---|
| `EPIS2_WAVE_EXECUTION_CANON.md` v1.1 | §3 snapshot 2026-06-09 (Ola 2 cerrada, print ✓, 20 blueprints) · §14 THREE-MODES 01…08 **Done** (antes «03…07 Ready») |
| `EPIS2_RELEASE_ROADMAP.md` | Banner **HISTÓRICO** — taxonomía V0–V5 absorbida por SDEPIS2; siguiente paso = tablero |
| `EPIS2_COMPLETE_CAPABILITY_MAP.md` | Banner **HISTÓRICO** — snapshot pre-tramos; no usar para prioridades |
| `reports/epis2-wave-execution-canon-v1.md` | Banner **ARCHIVADO** apuntando al canon vigente |

## 4. Índices y política de archivado (D5, D6)

| Artefacto nuevo | Contenido |
|---|---|
| `docs/INDEX.md` | Índice maestro por niveles **L0 canon → L5 referencia** + ciclo de vida (`draft → active → closed → archived`); regla «un solo siguiente paso» |
| `reports/INDEX.md` | Convención de nombres, archivos generados (no editar a mano), política de archivado (>90 días sin referencia → `reports/archive/YYYY-MM/`), evidencia activa |
| `README.md` | Tabla de documentación reparada (header faltante) + link a `docs/INDEX.md` |

## Gates

| Gate | Estado |
|---|---|
| `npx vitest run scripts/dev-agent/context.test.mjs` | ✓ 3/3 |
| `quality:dev-agent-orchestration-gate` | ✓ |
| `npm run dev:session` (smoke del brief) | ✓ — tablero reflejado |
| `npm run check` | ✓ |
| `npm run test` | ✓ suite completa |

## Riesgos restantes

- El parser del tablero depende del formato de tablas de `EPIS2_TABLERO.md` (encabezados «En curso» / «Siguiente»); si se renombran secciones, el brief degrada con aviso («Tablero no legible») sin romper.
- Docs huérfanos de `docs/design/` y `legacy-audit/` quedaron enlazados solo vía carpetas en el índice; consolidación fina queda para una pasada futura.
- El archivado físico de ~290 reportes antiguos no se ejecutó (política definida, movimiento masivo es opcional y de bajo valor inmediato).

## Próximo paso exacto

P1b — alto contraste ampliado (requiere signoff visual), o ampliar Storybook familia `Print*` (recomendación de Auditoría II §5).
