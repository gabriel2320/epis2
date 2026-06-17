# EPIS2 — Plan de fases de desarrollo

**Versión:** 1.0 · **Fecha:** 2026-06-13  
**Sistema:** [SDEPIS2](../docs/product/EPIS2_DEV_SYSTEM.md) · **Tablero:** [EPIS2_TABLERO.md](../docs/product/EPIS2_TABLERO.md)  
**Fuentes:** `strengthen-ledger.json` · `tres-frentes-ledger.json` · `microphase-ledger.json` · [propuesta IA fullstack](./epis2-propuesta-innovacion-ia-fullstack-2026-06-11.md)

> **Norte:** Login → Centro de Comando → paciente → intención → borrador → aprobación humana. PostgreSQL = SoT. IA no firma.

---

## 1. Vista por fases (macro)

```text
FASE 0 ─ Fundamentos          ████████████████████  CERRADA
FASE 1 ─ Experiencia core     ████████████████████  CERRADA (signoff 2026-06-13)
FASE 2 ─ Fortalecer 2026      ██░░░░░░░░░░░░░░░░░░  ACTIVA (1/23 MF)
FASE 3 ─ Evolución Evolab     ████░░░░░░░░░░░░░░░░  PARALELO (radar + F5)
FASE 4 ─ Multimedia / voz     ░░░░░░░░░░░░░░░░░░░░  DIFERIDA ≥ 2027
```

| Fase | Programa | Objetivo | Gate global | Ledger |
|------|----------|----------|-------------|--------|
| **0** | MF-151→182, tramos A–J, M3 | Base técnica + clínica demo | `quality:microphases` ✓ | `microphase-ledger.json` |
| **1** | PROG-EXPERIENCIA-CORE | Papel + electrónica + comando/IA signoff | `quality:experiencia-core-signoff-gate` ✓ | `tres-frentes-ledger.json` |
| **2** | PROG-STRENGTHEN-2026 | Hardening + IA moderna + CDS + Chile | `reports/epis2-prog-strengthen-close-2026.md` | `strengthen-ledger.json` |
| **3** | Evolab (repo hermano) | Simulación evolutiva → backlog EPIS2 trazable | `evolab:pre-evolve-smoke` | `epis2-dev-registration.jsonl` |
| **4** | PROG-MEDIA-FUTURE | ASR, OCR, video, ambient | `quality:no-asr-gate` (bloqueo) | `strengthen-ledger.futureProgram` |

**Regla de precedencia:** Fase 2 manda en sesiones EPIS2. Fase 3 informa prioridades P1; no sustituye MF-SH-*.

---

## 2. Fase 0 — Fundamentos (cerrada)

**Alcance:** invariantes, CI, E2E, microfases post-MVP, tramos clínicos scaffold, piloto M3, dual-chart, case-intel SIM.

| Bloque | Entregables clave | Evidencia |
|--------|-------------------|-----------|
| Verdad operativa | MF-151→155, CI parity, Playwright CI, RLS staging | `quality:microphase-next` → complete |
| Espina golden | MF-183→187, golden journey, integración API | `quality:golden-journey` |
| Productividad UI | MF-RAD-M3, three-modes, layers | `quality:pm01` ✓ |
| Tramos clínicos | A–J scaffold · Tramo J signoff | reports tramo-j |
| SIM clínico | MF-CASE-01…11 · 12 casos · golden v6/v7 | `quality:case-intel-closure-gate` |

**No reabrir** salvo regresión CI o contradicción con `PRODUCT_INVARIANTS.md`.

---

## 3. Fase 1 — Experiencia core (cerrada 2026-06-13)

**Programa:** PROG-EXPERIENCIA-CORE-2026 · tres frentes A/B/C · 36 microfases DONE.

### 3.1 Frente A — Papel (PROG-FICHA-PAPEL)

| MF | Entrega | Gate |
|----|---------|------|
| MF-PA-01…04 | Planner, print, paginación, secciones VIII–XIV | paper-* gates |
| MF-PA-05 | Mirror classic↔paper | mirror reconciliation |
| MF-PA-06…07 | Comandos IA papel, E2E | |
| **MF-PA-08** | **Signoff modo papel** | `quality:paper-mode-signoff-gate` ✓ |

### 3.2 Frente B — Electrónica (PROG-FICHA-ELECTRONICA + NORM)

| MF | Entrega | Gate |
|----|---------|------|
| MF-NORM-00…11 | Normalización espejo 16 MF | `quality:ficha-norm-signoff-gate` ✓ |
| MF-TE-01…07 | Staging secciones, Calm, contenido clínico | dual-chart / te gates |
| **MF-TE-08** | **Signoff ficha electrónica** | `quality:te-08-signoff-gate` ✓ |

### 3.3 Frente C — Comando + IA (PROG-BARRA-COMANDO)

| MF | Entrega | Gate |
|----|---------|------|
| MF-CM-01…05 | Barra NL, contexto, panel IA | cm gates |
| MF-CM-06…07 | Assist borrador, evals coloquiales | |
| **MF-CM-08** | **Signoff barra inteligente** | `quality:cm-08-signoff-gate` ✓ |

**Signoff global:** MF-PA-08 + MF-TE-08 + MF-CM-08 → desbloquea PROG-STRENGTHEN.

---

## 4. Fase 2 — PROG-STRENGTHEN-2026 (activa)

**Estrategia:** *Perfeccionar el núcleo antes de abrir nuevos sentidos (voz, imagen, video).*

**Progreso:** 1/23 · **READY:** MF-SH-02 · **Comando:** `npm run quality:strengthen-next`

### 4.1 Subfase 2A — PROG-CORE-HARDEN (prioridad 1)

Confianza clínica, trazabilidad, evals, registries Chile, RLS.

| Orden | MF | Nombre | Gate | Depende | Estado |
|-------|-----|--------|------|---------|--------|
| 1 | MF-SH-01 | Trazabilidad draft→approve→ai_runs | `quality:draft-trace-gate` | — | **DONE** |
| 2 | **MF-SH-02** | **Evals intent top-10** | **`ai:evals:live`** | SH-01 | **READY** |
| 3 | MF-SH-03 | Degradación IA (Ollama down) | test | SH-02 | BLOCKED |
| 4 | MF-SH-04 | Registry meta Chile blueprints | `quality:registry-meta-gate` | SH-03 | BLOCKED |
| 5 | MF-SH-05 | RLS staging runbook + force | ops | SH-04 | BLOCKED |
| 6 | MF-SH-06 | Control migraciones 035–040 | `db:validate` | SH-05 | BLOCKED |

**Sesiones sugeridas (2A):** ~6 sesiones · 1 MF por sesión · stack `dev:ai` para SH-02+.

### 4.2 Subfase 2B — PROG-IA-MODERNIZE (prioridad 2)

RAG, embeddings, provenance FHIR — extiende `local-ai` + `ai_runs`.

| Orden | MF | Nombre | Gate | Depende |
|-------|-----|--------|------|---------|
| 1 | MF-IM-01 | Embeddings pgvector 384d | `db:validate` | SH-02 |
| 2 | MF-IM-02 | Embed vía Ollama | check | IM-01 |
| 3 | MF-IM-03 | RAG incremental | `quality:rag-retrieval-gate` | IM-02 |
| 4 | MF-IM-04 | Assist con citas documentales | `ai:evals:live` | IM-03 |
| 5 | MF-IM-05 | AI Provenance (contracts) | check | IM-04 |
| 6 | MF-IM-06 | Export FHIR Provenance + AIAST | `quality:ai-provenance-gate` | IM-05 |
| 7–9 | MF-IM-07…09 | Model card, anti feedback-loop, OTel | varios | IM-06 |

**Sesiones sugeridas (2B):** ~9 sesiones · migraciones 042–043 en IM-01/06.

### 4.3 Subfase 2C — PROG-CDS-UX (prioridad 3)

Alertas codificadas → componentes + hooks CDS.

| Orden | MF | Nombre | Gate | Depende |
|-------|-----|--------|------|---------|
| 1 | MF-CU-01 | ClinicalCdsCard | check | IM-04 |
| 2 | MF-CU-02 | Hook patient-view | `quality:cds-hooks-gate` | CU-01 |
| 3 | MF-CU-03 | Hook order-select (prescripción) | cds-hooks | CU-02 |
| 4 | MF-CU-04 | API /cds/cards interno | cds-hooks | CU-02 |

### 4.4 Subfase 2D — PROG-INTEROP-CHILE (prioridad 4)

Export FHIR MINSAL, SNRE staging, HL7 quarantine.

| Orden | MF | Nombre | Depende |
|-------|-----|--------|---------|
| 1 | MF-IC-01 | Perfil export MINSAL | IM-06 |
| 2 | MF-IC-02 | SNRE staging MedicationRequest | IC-01 |
| 3 | MF-IC-03 | Questionnaire export piloto | IC-02 |
| 4 | MF-IC-04 | HL7 quarantine hardening | IC-03 + SH-06 |

**Cierre Fase 2:** reporte `reports/epis2-prog-strengthen-close-2026.md` + gates closure list en ledger.

### 4.5 Capa paralela — PROG-DETERMINISTIC-INTELLIGENCE-2026

**Inteligencia determinística** (ficha «secretario clínico» sin Ollama). Corre **en paralelo** con STRENGTHEN; no sustituye MF-SH-02.

| Orden | MF | Nombre | Gate | Depende |
|-------|-----|--------|------|---------|
| 1 | **MF-DI-01** | Contexto clínico denso | `quality:di-context-gate` | signoff core ✓ |
| 2 | MF-DI-04 | Prefill extendido (CE-6) | E2E prefill | DI-01 |
| 3 | MF-DI-05 | Acciones probables | `quality:di-suggestions-gate` | DI-01 |
| 4 | MF-DI-02…03 | Memoria + autocomplete rank | `db:validate` | DI-01 |
| 5 | MF-DI-06 | Chips silenciosos | di-suggestions | DI-05 · CU-01 ideal |
| 6 | MF-DI-07…08 | Plantillas + timeline | varios | DI-04 / DI-01 |
| 7 | MF-DI-09 | Microjourneys | E2E hooks | DI-04, DI-05 |
| 8 | MF-DI-10 | Signoff capa DI | `quality:di-signoff-gate` | DI-03…09 |

**Canon:** [`EPIS2_PROG_DETERMINISTIC_INTELLIGENCE.md`](../docs/product/EPIS2_PROG_DETERMINISTIC_INTELLIGENCE.md) · **Ledger:** `di-ledger.json` · **Comando:** `npm run quality:di-next`

**Regla sesión:** alternar con STRENGTHEN — p. ej. MF-SH-02 una sesión, MF-DI-01 la siguiente.

---

## 5. Fase 3 — Evolución Evolab (paralelo)

**Repo:** [epis2-evolab](https://github.com/gabriel2320/epis2-evolab) · no mezclar con MF-SH en la misma sesión si toca >10 archivos API.

| Tramo | Objetivo | Artefacto |
|-------|----------|-----------|
| E1 · Radar | Gaps cobertura + hipótesis P1 | `evolab:dev-register:export` |
| E2 · Sim corta | MAP-Elites dev-plan ~120 min | `evolab:f5:dev-plan` |
| E3 · Sim larga | 8 h unattended con watchdog | `evolab:f5:8h` |
| E4 · Cierre loop | Finding → hyp → fix EPIS2 → replay | `EVOLAB_EPIS2_DEV_REGISTRATION.md` |

**Hipótesis abiertas → Fase 2:**

| ID | Tema | Encaja en |
|----|------|-----------|
| hyp-c-audit-trail | Audit incompleto | MF-SH-01 extensión / SH-04 |
| hyp-g-command-assist | Assist vs SoT | MF-SH-02, MF-IM-04 |
| hyp-e-paper-command | RBAC papel | Mantenimiento Fase 1 |
| hyp-f-dual-chart-nav | Staging vacío | Mantenimiento Fase 1 |

**Regla:** Evolab encuentra; EPIS2 cierra con PR `evolab-fp-*` + gate del MF activo.

---

## 6. Fase 4 — Multimedia (diferida ≥ 2027)

**PROG-MEDIA-FUTURE** — explícitamente **prohibido en 2026** (paths ASR/OCR/voice en strengthen rules).

| MF futuro | Capacidad | IDC |
|-----------|-----------|-----|
| MF-VD-00/01 | ASR whisper | 92 |
| MF-OCR-01 | OCR Tesseract prod | — |
| MF-MEDIA-01 | Imagen/video clínico | — |
| MF-MCP-01 | MCP read-only | — |
| MF-IC-05 | Spike Medplum | — |

**Precondición:** cierre PROG-STRENGTHEN (MF-IC-04) + decisión producto 2027.

---

## 7. Cronograma orientativo (2026 Q2–Q4)

```text
2026-06     │ Fase 1 signoff ✓ · SH-01 ✓ · SH-02 READY · Evolab F5 8h
2026-06–07  │ Subfase 2A completa (SH-02…06)
2026-07–08  │ Subfase 2B (IM-01…06) — RAG + provenance
2026-08–09  │ Subfase 2C (CDS) + inicio 2D (IC-01…02)
2026-09–10  │ Subfase 2D cierre + reporte strengthen-close
2026 Q4     │ Buffer regresión · case-intel ampliación · CHILE backlog post-4
2027+       │ Fase 4 evaluación
```

Estimación: **~25–30 sesiones SDEPIS2** para Fase 2 completa (1 MF/sesión, gates al cierre).

---

## 8. Reglas de sesión (todas las fases)

1. **Un MF activo** por sesión (`quality:strengthen-next` o ledger del frente).
2. **Declarar alcance** — ID MF + `allowedPaths` del ledger.
3. **Gates mínimos al cierre:**
   ```bash
   npm run check
   npm run test
   npm run db:validate
   ```
4. **Reporte** `reports/epis2-session-close-*.md` + actualizar tablero si cambia siguiente paso.
5. **Prohibido:** segundo Command/Form Registry temporal · import EPIS sin manifest · dashboard como home.

---

## 9. Próximos tres pasos concretos

| # | Acción | Repo | Comando / MF |
|---|--------|------|--------------|
| 1 | Cerrar evals intent top-10 | EPIS2 | **MF-SH-02** · `ai:evals:live` |
| 2 | Simulación evolutiva 8 h (opcional mismo día) | evolab | `evolab:f5:8h` · pre-vuelo en launch doc |
| 3 | Triage findings → hyp-c o batch review | evolab → EPIS2 | `dev-plan:brief` → sesión audit |

---

## 10. Referencias

| Documento | Uso |
|-----------|-----|
| [EPIS2_TABLERO.md](../docs/product/EPIS2_TABLERO.md) | Estado vivo |
| [strengthen-ledger.json](../docs/quality/strengthen-ledger.json) | MF-SH/IM/CU/IC |
| [EPIS2_TRES_FRENTES_DEV_PLAN.md](../docs/product/EPIS2_TRES_FRENTES_DEV_PLAN.md) | Fase 1 detalle |
| [epis2-propuesta-innovacion-ia-fullstack-2026-06-11.md](./epis2-propuesta-innovacion-ia-fullstack-2026-06-11.md) | Estrategia STRENGTHEN |
| [epis2-dev-registration (evolab)](../epis2-evolab/reports/evolution/epis2-dev-registration.jsonl) | Backlog simulación |
| [f5-8h-launch-2026-06-14.md](../epis2-evolab/reports/evolution/f5-8h-launch-2026-06-14.md) | Runbook sim larga |

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
