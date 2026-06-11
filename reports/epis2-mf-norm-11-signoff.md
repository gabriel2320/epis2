# MF-NORM-11 — Signoff paridad visual papel↔electrónica

**Fecha:** 2026-06-11 · **Estado:** DONE (técnico)  
**Programa:** PROG-FICHA-NORM · **Gate:** `quality:ficha-norm-signoff-gate`

## Alcance

Cierre del programa de normalización: paridad visual y operativa entre ficha tradicional y modo papel, con comando siempre visible.

## Evidencia automática

Gate compuesto verifica:

- Reportes MF-NORM-00…10 presentes
- Checklist canónico `docs/design/EPIS2_FICHA_NORM_SIGNOFF_CHECKLIST.md`
- Sub-gates: mirror-b2, density, cm-02, fichapapel calm
- Tests espejo `chart-section-mirror.test.ts`
- E2E dual-chart MF-NORM-11 (switch modo + nav vacías)

## Checklist humano

| Item | Estado |
|------|--------|
| Barra NL 1366×768 | ✓ MF-NORM-02 |
| Ctrl+K / paleta | ✓ MF-CM-02 |
| Nav vacías ocultas | ✓ MF-NORM-10 |
| Dedupe acciones | ✓ MF-NORM-03 |
| Radius audit | ✓ MF-NORM-04 |
| Switch modo paciente | ✓ E2E |
| Print CSS | ✓ paperChartPrint.css |
| Piloto 15 min ≥4/5 | **Pendiente humano** |

## Desbloquea

- **MF-TE-08** — signoff ficha electrónica
- Contribuye a **MF-PA-08** — signoff papel

## Verificación

```bash
npm run quality:ficha-norm-signoff-gate
```

## Próximo paso

Capturas before/after DEMO-005 + piloto clínico 15 min antes de MF-TE-08 / MF-PA-08 finales.
