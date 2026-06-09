# EPIS2 — Nomenclatura unificada v1.1 (three-modes)

**Fecha:** 2026-06-04  
**Alcance:** Corrección colisiones EPIS2-13 / Fase E en documentación PROG-THREE-MODES

## Problema corregido

| Error | Conflicto | ID canónico |
|-------|-----------|-------------|
| EPIS2-13 = tres modos | **EPIS2-13 = Hospitalización V2** (`EPIS2_RELEASE_ROADMAP`) | **EPIS2-PM-01** |
| Fase E = tres modos | **Tramo E = pabellón** (`EPIS2_WAVE_EXECUTION_CANON` §9) | **Fase UX-1** |
| MF-THREE-MODES-ORCHESTRATION | Duplicaba MF-THREE-MODES-01 | **MF-THREE-MODES-01** |
| Gates 13-A…E | Colisión con fase EPIS2-13 | **PM01-A…E** |
| MF-01 / MF-02 abreviado | Ambiguo | **MF-THREE-MODES-01/02** |

## Archivos actualizados

- `docs/product/EPIS2_THREE_MODES_DEV_PLAN.md` (v1.1 — fuente única)
- `docs/ROADMAP.md`
- `docs/QUALITY_GATES.md`
- `docs/product/EPIS2_GLOBAL_DEV_PLAN.md`
- `docs/product/EPIS2_WAVE_EXECUTION_CANON.md`
- `docs/product/EPIS2_RELEASE_ROADMAP.md`
- `docs/quality/MICROPHASE_PROGRAM.md`
- `docs/design/EPIS2_*` (three modes, classic, dashboard)
- `docs/architecture/EPIS2_MODES_LAYER.md`
- `AGENTS.md`
- Reportes `epis2-three-modes-*` (notas alias)

## Gates

Sin cambio de scripts — solo etiquetas documentales PM01-A…E.

## Próximo paso

MF-THREE-MODES-03 bajo IDs canónicos.
