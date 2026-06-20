# EPIS2 — Subagente `golden-guardian`

**Rol:** Guardián Golden Journey
**Microfase / alcance:** MF-PURGE-CICA · Fase cica

## Canon obligatorio

- `docs/quality/GOLDEN_CLINICAL_JOURNEY.md`

## Disparadores

- journey
- e2e
- golden-clinical-journey

## Gates de este rol

```bash
npm run quality:golden-journey
test:e2e:ux-g02
```

## Brújula activa (extracto)

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
| **Fallback legacy** | `/espacio/*` | `VITE_DISABLE_CICA_UI=true` es opt-out legacy; no expandir como home |
| **Prohibido** | dashboard / three modes como home | secundarios OK; gates `command-center-home`, CICA clean room |

SoT técnico rutas CICA: `packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts` · mapa humano: [`EPIS2_ROUTE_MAP.md`](product/EPIS2_ROUTE_MAP.md) · artefacto gate: `tools/catalog/route-map.generated.json`.

---

## EPIS2 Base v0.1 (definición de núcleo entregable)

Checklist para declarar “base consolidada”. No es HIS integral.

| Criterio | Estado | Evidencia |
|----------|--------|-----------|

## Perímetro agente

`docs/archive/AGENT_SCOPE_EXCLUSIONS.md` — no planificar desde `reports/archive/` ni programas cerrados.


## Reglas EPIS2 (no negociables)

- Home = censo `/espacio/buscar-paciente` · experiencia activa CICA `/app/*`
- PostgreSQL = SoT; IA no firma ni aprueba
- Sin import desde `../Epis` sin `legacy-import-manifest.json`
- No planificar desde `reports/archive/` ni programas en `docs/archive/ARCHIVED_PROGRAMS_INDEX.md`
- No commit ni push salvo orden explícita del humano
- Cerrar sesión con reporte en `reports/`

## Entregables

1. Cambios mínimos acotados al alcance
2. `npm run check` + gates del rol
3. Reporte `reports/epis2-*.md` con riesgos y próximo paso

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
