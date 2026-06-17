# EPIS2 — Plan normalización ficha espejo (resumen)

**Fecha:** 2026-06-11  
**Canon:** [`docs/design/EPIS2_FICHA_NORMALIZACION_PLAN.md`](../docs/design/EPIS2_FICHA_NORMALIZACION_PLAN.md)

---

## Objetivo

Normalizar **ficha electrónica = espejo operativo del modo papel**, con **barra de comando idéntica** en ambos modos y experiencia MD3 **densa, alineada y sin ruido visual**.

---

## Problemas → soluciones (mapa rápido)

| Problema | Solución normativa |
|----------|-------------------|
| Fuera de pantalla / scroll infinito | Shell `100dvh`, scroll solo panel central |
| Demasiados botones | Barra compacta; acciones vía NL; máx 4 botones capa 3 |
| Muy redondo | Traditional max **10px**; Calm 20px **solo** resumen |
| Tipografía incoherente | Solo `epis2TypeScale`; padding mínimo campos |
| Sugerencias / acciones duplicadas | Máx 3 chips; catálogo acciones único |
| Demos basura | 5 casos curados; ocultar secciones vacías |
| Sin referencia estética | Benchmark board MF-NORM-00 |

---

## Benchmark MD3 (referencias)

1. [Material 3 Expressive — UX Design Awards 2026](https://ux-design-awards.com/winners/2026-1-material-3-expressive)
2. [M3 Foundations + Color roles](https://m3.material.io/foundations)
3. [Figma M3 Design Kit](https://www.figma.com/community/file/1035203688168086460/material-3-design-kit)
4. Google Workspace (barra búsqueda, neutros)
5. Cliniva / Health Connect (densidad clínica)

Tablero interno: [`docs/design/references/benchmark-board.md`](../docs/design/references/benchmark-board.md)

---

## Microfases PROG-FICHA-NORM (12)

| MF | Entrega |
|----|---------|
| NORM-00 | Benchmark board + capturas before |
| NORM-01 | Contrato fieldId papel↔nav |
| NORM-02 | Viewport scroll único |
| NORM-03 | Barra compacta dedupe |
| NORM-04 | Audit radius ≤10px |
| NORM-05 | Tipografía + padding + bold |
| NORM-06 | Demo cases curados |
| NORM-07 | Tema clinical-calm |
| NORM-08 | Motion sutil |
| NORM-09 | Secciones espejo batch 1 |
| NORM-10 | Secciones batch 2 |
| NORM-11 | Signoff paridad visual |

**Bloquea signoff final** MF-TE-08 y MF-PA-08 hasta NORM-11.

---

## Próxima sesión

Tras **MF-TE-01** (C-4 staging): **MF-NORM-00** — completar benchmark board con capturas.

```bash
npm run quality:tres-frentes-next
```
