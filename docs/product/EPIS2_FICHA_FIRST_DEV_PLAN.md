# EPIS2 — Plan PROG-FICHA-FIRST (MF-FF)

**Versión:** 1.0 · **Fecha:** 2026-06-14  
**Programa:** `PROG-FICHA-FIRST-2026`  
**Ledger:** [`ficha-first-ledger.json`](../quality/ficha-first-ledger.json)  
**ADR:** [`ADR-002-dual-chart-modes.md`](../adr/ADR-002-dual-chart-modes.md)

> **Norte:** la experiencia es **Ficha clásica + Ficha papel**. La barra de comando es **transversal y siempre presente**, nunca una pantalla home.

---

## Visión de producto

```text
EPIS2 =
  Experiencia     → Ficha electrónica (traditional) | Ficha papel (paper)
  Transversal     → EpisUniversalCommandBar + CommandPalette (Ctrl+K)
  Flujo canónico  → Login → Censo → Ficha → documento → borrador → aprobar → imprimir
  /comando        → solo redirect compat (no pantalla)
```

**Frase guía:** *El comando acompaña al médico; la ficha lo orienta.*

---

## Automatización

| Comando | Uso |
|---------|-----|
| `npm run quality:ficha-first-next` | JSON fase READY o IN_PROGRESS |
| `npm run quality:ficha-first-gate` | Gate ola 1 (MF-FF-01…06) |
| `npm run dev:velocity` | Brief incluye línea FICHA-FIRST |

---

## Olas de ejecución

### Ola 1 — Activación (cerrada 2026-06-14)

| MF | Entrega | Estado |
|----|---------|--------|
| **MF-FF-01** | Dual chart ON por default (`VITE_ENABLE_DUAL_CHART_MODES=false` opt-out) | ✓ DONE |
| **MF-FF-02** | Home = censo `/espacio/buscar-paciente` | ✓ DONE |
| **MF-FF-03** | `/comando` redirect compat (sin `CommandCenterPage`) | ✓ DONE |
| **MF-FF-06** | `ClinicalShell` + barra en formularios `/espacio/*` | ✓ DONE |

Evidencia: [`epis2-mf-ff-01-03-ficha-first.md`](../../reports/epis2-mf-ff-01-03-ficha-first.md) · [`epis2-mf-ff-06-clinical-shell-forms.md`](../../reports/epis2-mf-ff-06-clinical-shell-forms.md)

### Ola 2 — Canon y navegación

| MF | Entrega | Gate |
|----|---------|------|
| **MF-FF-00** | Enmienda invariante #6 · `GOLDEN_CLINICAL_JOURNEY` · `EPIS2_MODES_LAYER` censo-first | ✓ DONE |
| **MF-FF-04** | Dashboard → secundario (nav sin competir con ficha) | `quality:ui-simplify-gate` |
| **MF-FF-05** | `VISION_EPIS2.md` + reglas agente | `quality:fast` |

### Ola 3 — Experiencia clínica determinística

| MF | Entrega | Gate |
|----|---------|------|
| **MF-FF-07** | Acciones probables en toda ficha (no solo dual-chart path) | `quality:clinical-productivity-gate` |
| **MF-FF-08** | Live templates cableadas (`dm2_control` + 2 nuevas) | `quality:clinical-productivity-gate` |
| **MF-FF-09** | Evolución diaria — layout clínico fijo (TraditionalEhrLayout) | `quality:clinical-grid-gate` |
| **MF-FF-10** | Receta A5 — triple vista (form + papel + print) | `golden-journey` |

### Ola 4 — Frontera IA

| MF | Entrega | Gate |
|----|---------|------|
| **MF-FF-11** | Package `@epis2/ai-client` | `architecture:validate` |
| **MF-FF-12** | `apps/web` sin dep `@epis2/local-ai` | `quality:clinical-ai-text-safety-gate` |
| **MF-FF-13** | IA asistiva útil (borrador, resumen) + degraded E2E | `ai:evals:sim` |

### Ola 5 — Integración y velocidad

| MF | Entrega | Gate |
|----|---------|------|
| **MF-FF-14** | MedRepo knowledge-pack loader (API, sin PHI) | `quality:medrepo-consumption-gate` (futuro) |
| **MF-FF-15** | Aliases `quality:ui` / `quality:ai` | `quality:fast` |

---

## Reglas de sesión

1. Un MF-FF por sesión · declarar allowlist del ledger.
2. Ola 1 cerrada — no reabrir salvo bug.
3. No mezclar MF-FF UI con **MF-SH-*** / **MF-IM-*** migraciones en la misma sesión.
4. Cierre MF: reporte `reports/epis2-mf-ff-*.md` + actualizar ledger + `quality:ficha-first-gate` (ola 1) o gate específico.

---

## Métricas de éxito (programa completo)

| Métrica | Ola 1 | Objetivo final |
|---------|-------|----------------|
| Post-login | ✓ censo | ✓ |
| Command bar en evolución | ✓ dock | ✓ shell completo |
| Web → local-ai | — | ✗ eliminado |
| Formularios referencia | — | evolución + receta perfectas |
| MedRepo runtime | — | 1 CDS silencioso |

---

## Referencias

- [`EPIS2_DUAL_CHART_DEV_PLAN.md`](./EPIS2_DUAL_CHART_DEV_PLAN.md) — scaffold técnico (cerrado)
- [`EPIS2_TABLERO.md`](./EPIS2_TABLERO.md) — estado vivo
- [`AGENT_CONTEXT_MINIMAL.md`](../AGENT_CONTEXT_MINIMAL.md) — loop agente
