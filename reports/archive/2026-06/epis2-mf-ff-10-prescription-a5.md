# MF-FF-10 — Receta A5 triple vista

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-FICHA-FIRST · **Wave:** 3  
**Gate:** `quality:clinical-productivity-gate` ✓

---

## Alcance

Navegación triple vista receta: ficha papel ↔ formulario `prescription` con `chartMode=paper`.

## Cambios

| Artefacto | Entrega |
|-----------|---------|
| `prescriptionTripleViewNav.ts` | Helpers URL back/to form desde ficha papel |
| `GeneratedClinicalFormPage.tsx` | Botón volver a ficha papel cuando `prescription` + `chartMode=paper` |
| `DualChartPatientPage.tsx` | Receta abre con `chartMode: 'paper'` si modo papel activo |

## Riesgo / pendiente menor

Toolbar paper→form fuera de allowlist `components/chart`; golden journey extendido en wave 5 si aplica.

## Próximo paso

**MF-FF-11** — Package `@epis2/ai-client`.
