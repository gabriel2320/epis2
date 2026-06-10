# EPIS2 — Índice documental maestro

**Actualizado:** 2026-06-09 · Origen: [`epis2-auditoria-inventario-limpieza-2026-06-09.md`](../reports/epis2-auditoria-inventario-limpieza-2026-06-09.md) §2

Regla de lectura: **un solo «siguiente paso»** — el del tablero (L1). Todo lo demás es canon, referencia o histórico.

## L0 — Canon invariante (leer antes de modificar código)

| Documento | Rol |
|---|---|
| [`PRODUCT_CANON.md`](./PRODUCT_CANON.md) | Identidad del producto |
| [`product/PRODUCT_INVARIANTS.md`](./product/PRODUCT_INVARIANTS.md) | Invariantes — detenerse si se contradicen |
| [`NON_GOALS.md`](./NON_GOALS.md) | Lo que EPIS2 no será |
| [`legacy/EPIS_POSTMORTEM.md`](./legacy/EPIS_POSTMORTEM.md) · [`legacy/EPIS_REJECTED_PATTERNS.md`](./legacy/EPIS_REJECTED_PATTERNS.md) | Memoria de errores → gates |

## L1 — Operación viva (actualizar cada sesión)

| Documento | Rol |
|---|---|
| [`product/EPIS2_TABLERO.md`](./product/EPIS2_TABLERO.md) | **Fuente única del siguiente paso** |
| [`product/EPIS2_GLOBAL_DEV_PLAN.md`](./product/EPIS2_GLOBAL_DEV_PLAN.md) | Hilos activos/cerrados |
| [`product/EPIS2_NORMA_FULLSTACK_PLAN.md`](./product/EPIS2_NORMA_FULLSTACK_PLAN.md) | Hilo NORM — plan de mejora norma full stack (PEND-012) |
| [`security/EPIS2_THREAT_MODEL.md`](./security/EPIS2_THREAT_MODEL.md) | Threat model STRIDE (revisar al cerrar cada tramo NORM) |
| [`adr/ADR-001-api-versioning.md`](./adr/ADR-001-api-versioning.md) | ADR — versionado API diferido al primer consumidor externo |
| [`product/EPIS2_DEV_SYSTEM.md`](./product/EPIS2_DEV_SYSTEM.md) | Nomenclatura SDEPIS2 (ola · hilo · tramo · MF) |

## L2 — Planificación arquitectónica (cambios raros)

| Documento | Rol |
|---|---|
| [`product/EPIS2_WAVE_EXECUTION_CANON.md`](./product/EPIS2_WAVE_EXECUTION_CANON.md) | Olas y precedencias |
| [`product/EPIS2_COMPLETION_ROADMAP.md`](./product/EPIS2_COMPLETION_ROADMAP.md) | Capacidades por ola |
| [`architecture/`](./architecture/) | Dominio, modos, navegación, SoT |

## L3 — Dominios y programas cerrados (solo lectura)

| Documento | Rol |
|---|---|
| [`product/EPIS2_TRAMOS_EXECUTION_MASTER.md`](./product/EPIS2_TRAMOS_EXECUTION_MASTER.md) + `EPIS2_TRAMO_*_CLOSURE.md` | Tramos A–K cerrados técnico |
| [`product/EPIS2_THREE_MODES_DEV_PLAN.md`](./product/EPIS2_THREE_MODES_DEV_PLAN.md) | PROG-THREE-MODES ✓ |
| [`design/M3_ADOPTION_PLAN.md`](./design/M3_ADOPTION_PLAN.md) · [`design/MUI_X_ADOPTION_PLAN.md`](./design/MUI_X_ADOPTION_PLAN.md) | Adopción M3/MUI ✓ |
| [`quality/MICROPHASE_PROGRAM.md`](./quality/MICROPHASE_PROGRAM.md) | Programa MF cerrado |
| Históricos con banner: [`product/EPIS2_RELEASE_ROADMAP.md`](./product/EPIS2_RELEASE_ROADMAP.md) (V0–V5) · [`product/EPIS2_COMPLETE_CAPABILITY_MAP.md`](./product/EPIS2_COMPLETE_CAPABILITY_MAP.md) | Taxonomías absorbidas por SDEPIS2 |

## L4 — Calidad y datos (SoT máquina)

| Artefacto | Vista humana |
|---|---|
| [`quality/microphase-ledger.json`](./quality/microphase-ledger.json) | [`quality/MICROPHASE_LEDGER_CANONICAL.md`](./quality/MICROPHASE_LEDGER_CANONICAL.md) |
| [`product/epis2-idc-execution-matrix.json`](./product/epis2-idc-execution-matrix.json) | [`product/EPIS2_IDC_EXECUTION_MATRIX.md`](./product/EPIS2_IDC_EXECUTION_MATRIX.md) |
| [`quality/GOLDEN_CLINICAL_JOURNEY.md`](./quality/GOLDEN_CLINICAL_JOURNEY.md) | Gate producto final |

Hogares de pruebas: `tests/` = golden journey **vitest** (contratos producto) · `e2e/` = Playwright navegador · resto co-localizado con su módulo. Ver [`tests/README.md`](../tests/README.md).

## L5 — Diseño / dominio / ops (referencia)

| Carpeta | Contenido clave |
|---|---|
| [`design/`](./design/) | M3 (`EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md`), impresión (`EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md`), UX |
| [`clinical/`](./clinical/) | `BLUEPRINT_CONTRACT.md`, IA clínica |
| [`legacy/`](./legacy/) · [`legacy-audit/`](./legacy-audit/) | Allowlist donante, auditorías EPIS/EpiDos/EpiOne |
| [`intelligence/`](./intelligence/) · [`dev/`](./dev/) · [`ops/`](./ops/) · [`widgets/`](./widgets/) · [`interop/`](./interop/) · [`fhir/`](./fhir/) · [`auth/`](./auth/) | Capacidades transversales |

## Ciclo de vida documental

```text
draft (reports/) → active (docs/ + link en tablero) → closed (banner ✓/CLOSED) → archived (banner HISTÓRICO/ARCHIVADO)
```

- Un plan es **active** solo si el tablero lo referencia.
- Al cerrar: banner de estado en el encabezado + evidencia (gate/reporte).
- Histórico: banner `HISTÓRICO` apuntando al documento vigente — no borrar, no editar contenido.
- Reportes: convención y archivado en [`reports/INDEX.md`](../reports/INDEX.md).
