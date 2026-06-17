# CICA-L — Manifest de capturas (PR-AEST-07)

**PR:** PR-AEST-07 · **Fecha:** 2026-06-11 · **Paciente demo:** DEMO-001

Capturas humanas para signoff rc4 / walkthrough. E2E automatizado cubre regresión; estas imágenes son evidencia visual.

| # | ID | Ruta / acción | Archivo sugerido | E2E |
|---|-----|---------------|------------------|-----|
| 1 | CICA-L-02 | `/espacio/ficha` tab Resumen | `reports/cica-l/screenshots/L-02-resumen.png` | ✓ test 1 |
| 2 | CICA-L-03 | tab Evoluciones | `L-03-evoluciones.png` | ✓ |
| 3 | CICA-L-04 | `/espacio/evolucion?patientId=` | `L-04-nueva-evolucion.png` | ✓ |
| 4 | CICA-L-05 | tab Indicaciones | `L-05-indicaciones.png` | ✓ |
| 5 | CICA-L-06 | tab Exámenes | `L-06-examenes.png` | ✓ |
| 6 | CICA-L-07 | tab Más (meds) | `L-07-medicamentos.png` | ✓ |
| 7 | CICA-L-08 | tab Documentos | `L-08-documentos.png` | ✓ |
| 8 | CICA-L-09 | `/espacio/epicrisis?patientId=` | `L-09-epicrisis.png` | ✓ |
| 9 | CICA-L-10 | `/espacio/ficha/papel?patientId=` | `L-10-modo-papel.png` | ✓ |
| 10 | CICA-L-11 | tab Más → Auditoría | `L-11-auditoria.png` | ✓ |

## Criterios por captura

```text
[ ] Identidad paciente visible
[ ] ≤1 acción primaria
[ ] Sin scroll horizontal
[ ] data-cica-composition="classic" (ficha / forms / papel)
[ ] Barra comando transversal visible (ficha / forms / papel)
```

## Comando E2E (regresión)

```bash
npm run test:e2e -- e2e/aesthetic-classic-mode.spec.ts
```

## Comando gates cierre

```bash
npm run quality:gate -- quality:pr-aest-07-close
npm run quality:gate -- quality:cica-loop-close
npm run quality:gate -- quality:aesthetic-reset-close
```
