# EPIS2 — Plan maestro: tres frentes de experiencia

**Versión:** 1.0 · **Fecha:** 2026-06-11  
**Estado:** **Activo** — reordena todo el desarrollo producto  
**Ledger:** [`docs/quality/tres-frentes-ledger.json`](../quality/tres-frentes-ledger.json) · `npm run quality:tres-frentes-next`

> **Decisión:** Hasta lograr experiencia visual competitiva, comando amplio e IA integrada en la **barra transversal**, **no** avanzar PROG-STRENGTHEN, PROG-CHILE backlog, interop mayor ni multimedia (voz/OCR).  
> **Frase guía:** *Tres frentes, una barra — ficha electrónica densa, ficha papel fiel, comando que entiende.*

---

## 1. Norte

```text
Login → Censo / Comando
           │
           ▼
      Ficha paciente
      ├── Ficha electrónica (traditional)  ← FRENTE B · mucho contenido vacío hoy
      └── Ficha papel (paper)              ← FRENTE A · scaffold ✓ · profundidad pendiente
           │
           ▼
      Barra de comando + Ctrl+K + panel IA  ← FRENTE C · lista estática · IA parcial
```

| Frente | ID programa | Meta «competitivo» |
|--------|-------------|-------------------|
| **A · Papel** | PROG-FICHA-PAPEL | Documento institucional imprimible · planner · secciones I–XIV · mirror SoT |
| **B · Electrónica** | PROG-FICHA-ELECTRONICA | 17 secciones con contenido clínico real · Calm MD3 · resumen ≤2 scrolls |
| **C · Comando + IA** | PROG-BARRA-COMANDO | NL en barra · contexto sección/modo · assist borrador · panel IA útil |

**Gate de salida global:** `quality:experiencia-core-signoff-gate` — signoff humano en los tres frentes.

---

## 2. Diagnóstico (snapshot 2026-06-11)

### Frente A — Papel

| Hecho | Gap |
|-------|-----|
| MF-PAPER-01…09 ✓ scaffold | Planner mensual (MF-PA-01) |
| 7 secciones I–VII editables | Secciones VIII–XIV · subplantillas SOAP/ingreso |
| Print CSS · toolbar · IA meta | Paginación N/M real · mirror classic↔paper |
| Comandos paper en registry | Planner print · IA contextual planner |

### Frente B — Ficha electrónica

| Hecho | Gap |
|-------|-----|
| Nav 17 secciones (canon) | **16/17** muestran `sectionEmpty` — solo resumen tiene grid |
| C-3a/b resumen MD3 ✓ | Fases C/D: timeline filtrado · cola firma · supporting pane |
| Tokens traditional cuadrados | Perfil `clinical-calm` (8º tema) pendiente |
| Dual-chart shell ✓ · flag off | C-4 activación staging |

### Frente C — Barra de comando + IA

| Hecho | Gap |
|-------|-----|
| `EpisUniversalCommandBar` en ficha | Barra no igual de pulida en censo vs ficha vs papel |
| Ctrl+K palette (24 items estáticos) | Palette **no** es NL libre — solo atajos |
| `resolveCommand` + assist-route | IA intent NL (V5) ○ — sin Ollama en resolve |
| Panel derecho contexto | Sin resumen IA · sin sugerencias por sección |
| Assist borrador por blueprint | No invocable fluido desde barra |

---

## 3. Lo que queda en pausa

| Programa | Motivo |
|----------|--------|
| PROG-STRENGTHEN-2026 | Tras gate experiencia core |
| PROG-CHILE backlog (registro, RNPI) | Tras gate experiencia core |
| PROG-MEDIA-FUTURE (voz, OCR, video) | 2027+ |
| PROG-AUTO-DEV-6H | Pausado |
| Hilo C entregas sueltas | Absorbido en Frente B (C-4) y signoffs |

---

## 4. Olas de ejecución (orden recomendado)

**Pre-ola — PROG-FICHA-NORM:** benchmark → viewport → dedupe barra → shape/tipo → espejo secciones. Ver [`EPIS2_FICHA_NORMALIZACION_PLAN.md`](../design/EPIS2_FICHA_NORMALIZACION_PLAN.md).

Trabajar **en paralelo** un microfase READY por frente (máx. 3 sesiones simultáneas si hay capacidad; **1 sesión = 1 frente** preferido).

```text
Ola 1 — Activar y unificar
  A: MF-PA-01 planner mensual
  B: MF-TE-01 C-4 dual chart staging
  C: MF-CM-01 barra NL unificada (UX-CALM-COMMAND)

Ola 2 — Contenido clínico visible
  A: MF-PA-02 planner print
  B: MF-TE-02 secciones prioritarias (5)
  C: MF-CM-02 Ctrl+K ↔ barra integrados

Ola 3 — Profundidad
  A: MF-PA-03 paginación N/M
  B: MF-TE-03 secciones batch 2 (5)
  C: MF-CM-03 assist-route + hint IA en barra

Ola 4 — Inteligencia contextual
  A: MF-PA-04 secciones VIII–XIV
  B: MF-TE-04 secciones batch 3 + nav móvil
  C: MF-CM-04 contexto rico resolve (sección + chartMode)

Ola 5 — IA integrada (sin auto-firma)
  A: MF-PA-05 mirror classic↔paper
  B: MF-TE-05 resumen fases C/D + clinical-calm theme
  C: MF-CM-05 panel IA + MF-CM-06 assist borrador desde barra

Ola 6 — Signoff competitivo
  A: MF-PA-08 · B: MF-TE-08 · C: MF-CM-08
  → quality:experiencia-core-signoff-gate
```

---

## 5. Microfases por frente (resumen)

Detalle completo en ledger JSON.

### Frente A — PROG-FICHA-PAPEL

| MF | Nombre |
|----|--------|
| MF-PA-01 | Planner mensual + markers |
| MF-PA-02 | Planner print + E2E |
| MF-PA-03 | Paginación N/M real |
| MF-PA-04 | Secciones papel VIII–XIV |
| MF-PA-05 | Mirror classic↔paper (PROG-PAPER-MIRROR) |
| MF-PA-06 | Calm premium en superficies papel |
| MF-PA-07 | Comandos IA planner |
| MF-PA-08 | Signoff visual papel competitivo |

### Frente B — PROG-FICHA-ELECTRONICA

| MF | Nombre |
|----|--------|
| MF-TE-01 | C-4 activación dual chart staging |
| MF-TE-02 | 5 secciones con contenido (alergias, meds, órdenes, labs, evolución) |
| MF-TE-03 | 5 secciones batch 2 (anamnesis, examen, dx, imagen, interconsulta) |
| MF-TE-04 | 5 secciones batch 3 + nav móvil |
| MF-TE-05 | Resumen C/D + tema clinical-calm |
| MF-TE-06 | Supporting pane timeline filtrado |
| MF-TE-07 | Densidad tabular MAR/orders donde aplique |
| MF-TE-08 | Signoff ficha electrónica competitiva |

### Frente C — PROG-BARRA-COMANDO

| MF | Nombre |
|----|--------|
| MF-CM-01 | Barra NL unificada (censo · ficha · papel) |
| MF-CM-02 | Ctrl+K + barra: misma resolución NL |
| MF-CM-03 | assist-route + `getCommandBarAiHint` activo |
| MF-CM-04 | Contexto resolve: sección + chartMode + blueprint |
| MF-CM-05 | Panel IA: resumen paciente + acciones sugeridas |
| MF-CM-06 | Assist borrador invocable desde barra |
| MF-CM-07 | Evals + ampliación frases coloquiales |
| MF-CM-08 | Signoff comando inteligente |

---

## 6. Reglas de sesión

1. Declarar **frente** (A/B/C) + **MF** del ledger.
2. Un MF por sesión salvo fixes mínimos de gate.
3. No tocar `PROG-STRENGTHEN` ni servicios multimedia.
4. IA: borrador only · humano aprueba.
5. Gates al cierre: `npm run check` + E2E del frente tocado.

```bash
npm run quality:tres-frentes-next   # READY por frente
npm run quality:paper-mode-next       # alias MF-PA-* planner
```

---

## 7. Referencias

- [EPIS2_DUAL_CHART_VISUAL_CANON.md](../design/EPIS2_DUAL_CHART_VISUAL_CANON.md)
- [EPIS2_PAPER_MODE_DEV_PLAN.md](./EPIS2_PAPER_MODE_DEV_PLAN.md)
- [EPIS2_TRADITIONAL_M3_SHAPE_COLOR_PLAN.md](../design/EPIS2_TRADITIONAL_M3_SHAPE_COLOR_PLAN.md)
- [EPIS2_CLINICAL_SUMMARY_MD3.md](../design/EPIS2_CLINICAL_SUMMARY_MD3.md)
- [EPIS2_OLLAMA_CAPABILITY_PLAN.md](../intelligence/EPIS2_OLLAMA_CAPABILITY_PLAN.md)
- [reports/epis2-plan-tres-frentes-2026-06-11.md](../../reports/epis2-plan-tres-frentes-2026-06-11.md)
