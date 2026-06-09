# EPIS2 — Conciliación three-modes con el proyecto

**Fecha:** 2026-06-04 (actualizado nomenclatura v1.1)  
**Alcance:** Documentación, planes de desarrollo y armonización post-consolidación MF-THREE-MODES-02

> **Corrección v1.1:** ~~EPIS2-13~~ / ~~Fase E~~ reemplazados por **EPIS2-PM-01** / **Fase UX-1**. EPIS2-13 permanece reservado a **Hospitalización V2**.

## Objetivo

Integrar la capa de tres modos (Command · Classic · Dashboard) en el canon EPIS2 existente — navegación reconciliada, capas UI, plan global e invariantes — sin contradecir home = `/comando`.

## Nomenclatura canónica (v1.1)

| Capa | ID |
|------|-----|
| Roadmap post-MVP | **EPIS2-PM-01** |
| Plan global | **Fase UX-1** |
| Programa | **PROG-THREE-MODES** |
| Microfases | **MF-THREE-MODES-01…08** |
| Gates | **PM01-A…E** |

Fuente única: [`docs/product/EPIS2_THREE_MODES_DEV_PLAN.md`](../docs/product/EPIS2_THREE_MODES_DEV_PLAN.md) § tabla canónica.

## Documentación creada

| Documento | Rol |
|-----------|-----|
| [`docs/architecture/EPIS2_MODES_LAYER.md`](../docs/architecture/EPIS2_MODES_LAYER.md) | Conciliación modos × workspaces × L3–L5 × registries |
| [`docs/design/EPIS2_CLASSIC_EMR_MD3_MODE.md`](../docs/design/EPIS2_CLASSIC_EMR_MD3_MODE.md) | Canon modo classic (MF-CLASSIC-MD3) |
| [`docs/product/EPIS2_THREE_MODES_DEV_PLAN.md`](../docs/product/EPIS2_THREE_MODES_DEV_PLAN.md) | Roadmap + nomenclatura |

## Documentación actualizada

| Documento | Cambio |
|-----------|--------|
| `ROADMAP.md` | EPIS2-PM-01 (no EPIS2-13) |
| `QUALITY_GATES.md` | PM01-A…E |
| `EPIS2_GLOBAL_DEV_PLAN.md` | Fase UX-1 |
| `EPIS2_WAVE_EXECUTION_CANON.md` | §14 PROG-THREE-MODES |
| `EPIS2_RELEASE_ROADMAP.md` | Fila EPIS2-PM-01 paralela a V2+ |

## Mapa de precedencia (conciliado)

```text
PRODUCT_INVARIANTS (#6 home, #7 no dashboard home)
        │
PRODUCT_CANON (flujo login → comando)
        │
EPIS2-00…12 (MVP cerrado) · EPIS2-13 (Hospitalización V2, RELEASE)
        │
EPIS2-PM-01 / PROG-THREE-MODES (UX transversal)
        │
EPIS2_MODES_LAYER + Fase UX-1
```

## Estado microfases

| MF | Estado |
|----|--------|
| MF-THREE-MODES-01 | DONE |
| MF-THREE-MODES-02 | DONE |
| MF-THREE-MODES-03…07 | READY |
| MF-THREE-MODES-08 | BLOCKED (tras 06) |

## Próximo paso

**MF-THREE-MODES-03** — modal borrador. Ver [`EPIS2_THREE_MODES_DEV_PLAN.md`](../docs/product/EPIS2_THREE_MODES_DEV_PLAN.md).
