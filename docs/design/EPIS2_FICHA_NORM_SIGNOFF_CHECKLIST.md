# EPIS2 — Signoff paridad visual papel↔electrónica (MF-NORM-11)

**Versión:** 1.0 · **Fecha:** 2026-06-11  
**Estado:** Canónico · **Gate:** `quality:ficha-norm-signoff-gate`

---

## Criterio

Mismo paciente, mismo contrato clínico, dos pieles — comando siempre visible.

Capturas light/dark · traditional + paper · paciente demo **DEMO-005** (o DEMO-002 según piloto).

---

## Checklist técnico (automático)

| # | Criterio | Evidencia gate |
|---|----------|----------------|
| 1 | Espejo batch 1+2 + nav vacías ocultas | `ficha-norm-mirror-b2-gate` |
| 2 | Radius traditional ≤10px | `ficha-norm-density-gate` |
| 3 | Tipografía mín 13px | `ficha-norm-typography-gate` |
| 4 | Tema clinical-calm | `ficha-norm-theme-gate` |
| 5 | Motion switch modo | `ficha-norm-motion-gate` |
| 6 | Barra NL unificada | `cm-01-barra-gate` |
| 7 | Ctrl+K misma resolución NL | `cm-02-palette-gate` |
| 8 | Canvas Calm modo papel | `paper-mode-fichapapel-reference-gate` |
| 9 | Dual chart router + modos | E2E `dual-chart-modes.spec.ts` |
| 10 | Comandos agenda planner | `paper-planner-ai-gate` |

---

## Checklist humano (piloto)

- [x] Barra NL visible sin scroll en 1366×768 (MF-NORM-02 viewport)
- [x] Ctrl+K abre; no tapa banda paciente (MF-CM-02 E2E)
- [x] 0 secciones demo vacías visibles (MF-NORM-10 `navAntecedents` oculto)
- [x] 0 botones duplicados comando vs barra (MF-NORM-03)
- [x] 0 radius >10px fuera resumen Calm (MF-NORM-04)
- [x] Switch modo sin perder paciente (E2E MF-NORM-11)
- [x] Print papel oculta shell; electrónica no (print CSS)
- [ ] Piloto clínico 15 min: «¿parece ficha real?» ≥4/5 — **pendiente humano**

---

## Referencias

- [EPIS2_FICHA_NORMALIZACION_PLAN.md](./EPIS2_FICHA_NORMALIZACION_PLAN.md) §8
- Reportes MF-NORM-00…10 en `reports/epis2-mf-norm-*.md`
