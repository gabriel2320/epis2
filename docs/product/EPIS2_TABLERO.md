# EPIS2 — Tablero de desarrollo

**Actualizado:** 2026-06-15 · **STRENGTHEN** 23/23 ✓ · **PROG-CONSOLIDATE** ✓ cerrado

Sistema: [`EPIS2_DEV_SYSTEM.md`](./EPIS2_DEV_SYSTEM.md) · **Brújula:** [`EPIS2_CURRENT_STATE.md`](../EPIS2_CURRENT_STATE.md)

> **PROG-STRENGTHEN** ✓ **23/23 cerrado** · **PROG-FICHA-FIRST** ✓ · **PROG-CONSOLIDATE** ✓ Fase 0–4 · PR [#6](https://github.com/gabriel2320/epis2/pull/6)

---

## Cerrado — PROG-CONSOLIDATE-2026

| Fase | Entrega |
|------|---------|
| 0–1 | Gates `required`/`nightly`, catálogo, clasificador |
| 2 | 245 `quality:*` podados → `quality:gate` |
| 3 | `db:*` → api · E2E → web |
| 4 | CI/catalog compat |

Evidencia: [`epis2-prog-consolidate-close-2026.md`](../../reports/epis2-prog-consolidate-close-2026.md) · `npm run tool:consolidate:verify-phase4`

---

## Activo — PROG-CONSOLIDATE ola 2 (MF-CON-*)

**Congelamiento vigente:** [`CONSOLIDATION_FREEZE.md`](../CONSOLIDATION_FREEZE.md) — no expansión clínica salvo MF autorizada.

| MF | Estado | Entrega |
|----|--------|---------|
| **MF-CON-02** | ✓ DONE | Freeze + gobierno · PR [#7](https://github.com/gabriel2320/epis2/pull/7) |
| **MF-CON-04** | ✓ DONE | Config staging/production guards |
| **MF-CON-05** | ✓ DONE | Demo auth killswitch · PR [#8](https://github.com/gabriel2320/epis2/pull/8) |
| **MF-CON-06** | **READY** | Baseline HTTP (CSP, cookies, CORS) |

**Siguiente:** MF-CON-06 → MF-CON-07 rate limit · plan [`EPIS2_CONSOLIDATION_PHASE2_PLAN.md`](./EPIS2_CONSOLIDATION_PHASE2_PLAN.md)


## Cerrado — PROG-CONCILIACION-TRIADA-2026

| Fase | Estado |
|------|--------|
| F0–F7 | ✓ [`epis2-prog-conciliacion-triada-close-2026.md`](../../reports/epis2-prog-conciliacion-triada-close-2026.md) |

Inventario: [`reports/conciliacion/`](../../reports/conciliacion/)

---

## Cerrado — PROG-RAPID-2026

| MF | Entrega | Gate |
|----|---------|------|
| MF-RAPID-01 | `quality:fast` · `clinical` · `full` + contexto mínimo | — |
| MF-RAPID-02 | `dev:agent:audit-diff` | — |
| MF-RAPID-03 | `dev:rapid` | — |
| MF-RAPID-04 | Cierre formal | `npm run quality:rapid-gate` |

Evidencia: [`epis2-mf-rapid-close-2026.md`](../../reports/epis2-mf-rapid-close-2026.md) · commits `7cb4fab` · `d84e1ef`

**Loop diario:** `npm run dev:rapid`

---

## PROG-FICHA-FIRST-2026

**Plan:** [`EPIS2_FICHA_FIRST_DEV_PLAN.md`](./EPIS2_FICHA_FIRST_DEV_PLAN.md) · **Ledger:** [`ficha-first-ledger.json`](../quality/ficha-first-ledger.json) · `npm run quality:ficha-first-next`

### Ola 1 — Activación ✓

| MF | Entrega | Gate |
|----|---------|------|
| MF-FF-01 | Dual chart ON default | `quality:ficha-first-gate` |
| MF-FF-02 | Home = censo | ↑ |
| MF-FF-03 | `/comando` redirect | ↑ |
| MF-FF-06 | ClinicalShell + barra en `/espacio/*` | ↑ |

Evidencia: [`epis2-prog-ficha-first-wave1-close-2026-06-14.md`](../../reports/epis2-prog-ficha-first-wave1-close-2026-06-14.md)

### Ola 2 — Canon ✓

| MF | Estado | Entrega |
|----|--------|---------|
| **MF-FF-00** | ✓ DONE | Invariante #6 · Golden journey · MODES_LAYER |
| **MF-FF-04** | ✓ DONE | Dashboard secundario · [`epis2-mf-ff-04-dashboard-secondary.md`](../../reports/epis2-mf-ff-04-dashboard-secondary.md) |
| **MF-FF-05** | ✓ DONE | [`VISION_EPIS2.md`](./VISION_EPIS2.md) · reglas agente |

### Ola 3 — Experiencia clínica (activa)

| MF | Estado | Entrega |
|----|--------|---------|
| **MF-FF-07** | ✓ DONE | Acciones probables · [`epis2-mf-ff-07-probable-actions.md`](../../reports/epis2-mf-ff-07-probable-actions.md) |
| **MF-FF-08** | **READY** | Live templates en web |

**Siguiente:** `npm run quality:ficha-first-next`

---

## En curso — PROG-STRENGTHEN-2026 ✓ cerrado

**Progreso:** **23/23** MF cerradas · Ola 14 ✓ (MF-IC-04 HL7 hardening) · [`epis2-prog-strengthen-close-2026.md`](../../reports/epis2-prog-strengthen-close-2026.md)

| Subprograma | Estado | Siguiente |
|-------------|--------|-----------|
| **PROG-CORE-HARDEN** | ✓ MF-SH-01…06 | — |
| **PROG-IA-MODERNIZE** | ✓ MF-IM-01…09 | — |
| **PROG-CDS-UX** | ✓ MF-CU-01…04 | — |
| **PROG-INTEROP-CHILE** | ✓ fases 1–4 | — |

`npm run quality:strengthen-next` · ledger [`strengthen-ledger.json`](../quality/strengthen-ledger.json)

**Regla sesión:** un MF-SH/IM/CU/IC · declarar alcance · cerrar con gate.

---

## Histórico — PROG-CONCILIACION-TRIADA-2026 (detalle fases)

| Fase | Estado | Evidencia |
|------|--------|-----------|
| **S1 F0+F1** | ✓ | inventario + docs |
| **F2 PROG-DI** | ✓ commit + push | `f56b7d2` |
| **F3 Evolab** | ✓ | push `e453774` · smoke 14/14 |
| **F4 MedRepo** | ✓ | git `3e1181b` · check 75/75 |
| **F5 smoke tríada** | ✓ | [`epis2-f5-close-2026-06-14.md`](../../reports/conciliacion/epis2-f5-close-2026-06-14.md) |
| **F6 integración** | ✓ | [`epis2-f6-close-2026-06-14.md`](../../reports/conciliacion/epis2-f6-close-2026-06-14.md) |

## Hecho reciente

| Entrega | Evidencia |
|---------|-----------|
| SIGNOFF-EXPERIENCIA-CORE | `quality:experiencia-core-signoff-gate` · tres frentes 36/36 |
| P1 ai:evals:sim | 13/13 · `reports/ai-evals-sim-2026-06-13.json` |
| **MF-SH-01** draft trace | `043_approvals_ai_run.sql` · `quality:draft-trace-gate` · [`epis2-mf-sh-01-draft-trace.md`](../../reports/epis2-mf-sh-01-draft-trace.md) |
| **S1 conciliación tríada** | F0 manifest + MF-DI map · F1 tablero/triada · [`conciliacion/`](../conciliacion/) · 2026-06-14 |
| **PROG-DI** | 10/10 DONE · commit `f56b7d2` · [`epis2-prog-di-close-2026.md`](../../reports/epis2-prog-di-close-2026.md) |
| **F4 MedRepo** | git `3e1181b` · check 75/75 · [`epis2-f4-close-2026-06-14.md`](../../reports/conciliacion/epis2-f4-close-2026-06-14.md) |
| **F5 smoke tríada** | gates 7/8 · smoke 14/14 · [`epis2-f5-close-2026-06-14.md`](../../reports/conciliacion/epis2-f5-close-2026-06-14.md) |
| **MF-SH-02** intent evals | 93.3% top-10 · ai:evals:live 4/4 · [`epis2-mf-sh-02-intent-evals.md`](../../reports/epis2-mf-sh-02-intent-evals.md) |
| **MF-IM-01** embeddings 384d | migración 046 · dual-read 128/384 · [`epis2-mf-im-01-embeddings.md`](../../reports/epis2-mf-im-01-embeddings.md) |
| **MF-IM-02** embed Ollama | contrato embedDocument · [`epis2-mf-im-02-embed-api.md`](../../reports/epis2-mf-im-02-embed-api.md) |
| **MF-IM-03** RAG incremental | retrieval secuencial · [`epis2-mf-im-03-rag-incremental.md`](../../reports/epis2-mf-im-03-rag-incremental.md) |
| **MF-IM-04** assist citas | `documentCitations` en assist · [`epis2-mf-im-04-assist-citas.md`](../../reports/epis2-mf-im-04-assist-citas.md) |
| **MF-IM-05** provenance interno | `AiProvenanceRecord` en audit approve · [`epis2-mf-im-05-provenance-internal.md`](../../reports/epis2-mf-im-05-provenance-internal.md) |
| **MF-IM-06** FHIR Provenance + AIAST | export `fhir-export` · [`epis2-mf-im-06-provenance-fhir.md`](../../reports/epis2-mf-im-06-provenance-fhir.md) |
| **MF-IM-07** model card | `DocumentReference` markdown · [`epis2-mf-im-07-model-card.md`](../../reports/epis2-mf-im-07-model-card.md) |
| **MF-IM-08** anti feedback-loop | policy assist excluye AIAST · [`epis2-mf-im-08-feedback-loop.md`](../../reports/epis2-mf-im-08-feedback-loop.md) |
| **MF-IM-09** OTel spans IA | span `ai.run` · [`epis2-mf-im-09-otel.md`](../../reports/epis2-mf-im-09-otel.md) |
| **MF-CU-01** ClinicalCdsCard | variantes info/suggestion/warning · [`epis2-mf-cu-01-cds-card.md`](../../reports/epis2-mf-cu-01-cds-card.md) |
| **MF-CU-02** patient-view CDS hook | cards al abrir ficha · [`epis2-mf-cu-02-patient-view.md`](../../reports/epis2-mf-cu-02-patient-view.md) |
| **MF-CU-03** order-select CDS hook | alertas al prescribir · [`epis2-mf-cu-03-order-select.md`](../../reports/epis2-mf-cu-03-order-select.md) |
| **MF-CU-04** API `/cds/cards` | prefetch paciente interno · [`epis2-mf-cu-04-cds-api.md`](../../reports/epis2-mf-cu-04-cds-api.md) |
| **MF-IC-01** MINSAL export | Patient/Encounter/DocumentReference · [`epis2-mf-ic-01-minsal-export.md`](../../reports/epis2-mf-ic-01-minsal-export.md) |
| **MF-IC-02** SNRE staging | MedicationRequest staging JSON · [`epis2-mf-ic-02-snre-staging.md`](../../reports/epis2-mf-ic-02-snre-staging.md) |
| **MF-IC-03** Questionnaire export piloto | FHIR Questionnaire evolution_note · [`epis2-mf-ic-03-questionnaire.md`](../../reports/epis2-mf-ic-03-questionnaire.md) |
| **MF-IC-04** HL7 quarantine hardening | Runbook + tests migración · [`epis2-prog-strengthen-close-2026.md`](../../reports/epis2-prog-strengthen-close-2026.md) |
| **MF-FF-01…06** ficha-first wave1 | censo home · dual default · `/comando` redirect · ClinicalShell · [`epis2-prog-ficha-first-wave1-close-2026-06-14.md`](../../reports/epis2-prog-ficha-first-wave1-close-2026-06-14.md) |
| **PROG-CONCILIACION tríada** | F0–F7 ✓ · [`epis2-prog-conciliacion-triada-close-2026.md`](../../reports/epis2-prog-conciliacion-triada-close-2026.md) |

---

## Histórico — PROG-EXPERIENCIA-CORE-2026 (cerrado)

## Hecho

| Entrega / hito | Evidencia |
|----------------|-----------|
| CI pipeline completo | run [27351241135](https://github.com/gabriel2320/epis2/actions/runs/27351241135) — check + e2e-dual-chart ✓ · `a294f20` |
| Fix CI post-pull (2026-06-11) | Prettier · `build:packages` · E2E dual-chart · otel/admission · three-modes · `5a8ecd0`…`a294f20` |
| Fix ci-parity (sin doble vitest) | `15b6131` · `--from-report` · ci-parity ~1s en CI |
| Entrega CI-E2E | `7993f2c` — Firmar → borrador; paste-zone; ficha-history |
| PROG-THREE-MODES MF-01…08 | `quality:pm01` ✓ · `three-modes-journey` E2E |
| **Hilo A** — consolidación visual | RAD dashboard, acordeones, MF-151→182 |
| **Hilo UX-1** — tres modos MD3 | EPIS2-PM-01 cerrado |
| **Hilo B** — Ola 2 productividad | Palette · autocomplete · golden V2 · procedure_request · cierre encuentro · farmacia · [`epis2-hilo-b-closure-2026-06-09.md`](../../reports/epis2-hilo-b-closure-2026-06-09.md) |
| Golden V2 UI E2E | `golden-v2-admission-discharge` ✓ |
| UX-G02 command-first E2E | Partes A/B/C1 ✓ |
| E2E Tramo C admission | `tramo-c-admission` 3/3 · [`epis2-tramo-c-admission-e2e-fix-2026-06-09.md`](../../reports/epis2-tramo-c-admission-e2e-fix-2026-06-09.md) |
| **Hilo D** — Tramo J farmacia | PEND-001 cerrado · `fa38e4d` · [`epis2-tramo-j-signoff-2026-06-09.md`](../../reports/epis2-tramo-j-signoff-2026-06-09.md) |
| **Piloto M3 automatizado** (V1–V6) | `2d77bfe` · `quality:m3-human-pilot` OK · 6/6 E2E · [`epis2-m3-human-pilot-2026-06-09.md`](../../reports/epis2-m3-human-pilot-2026-06-09.md) |
| Hito auditoría profunda | [`epis2-auditoria-profunda-2026-06-09.md`](../../reports/epis2-auditoria-profunda-2026-06-09.md) — plan 5 entregas |
| Entrega auditoría F1 — higiene | `b27fdcd` · [`epis2-auditoria-fase1-higiene-2026-06-09.md`](../../reports/epis2-auditoria-fase1-higiene-2026-06-09.md) |
| Entrega auditoría F2 — robustez | `fb5ba23` · transacción approveDraft · JWT rol · E2E print en CI · [`epis2-auditoria-fase2-robustez-2026-06-09.md`](../../reports/epis2-auditoria-fase2-robustez-2026-06-09.md) |
| Entrega auditoría F3 — pulido M3 | `9b2b073` · tertiary + surfaceContainer* runtime · EpisDraftStatus roles clínicos · Admin/DraftReview al DS · motion a11y · [`epis2-auditoria-fase3-pulido-m3-2026-06-09.md`](../../reports/epis2-auditoria-fase3-pulido-m3-2026-06-09.md) |
| Entrega auditoría F4 — deuda estructural | side-effects approveDraft modulares · GeneratedClinicalFormPage dividido · tabla control migraciones · tests admin/DraftReview/TabShell · layers-gate en CI · [`epis2-auditoria-fase4-deuda-2026-06-09.md`](../../reports/epis2-auditoria-fase4-deuda-2026-06-09.md) |
| **Entrega C — impresión Carta** — epicrisis | `PrintLetterDocument` + `/espacio/epicrisis/imprimir` · E2E en CI · gate ampliado · [`epis2-p1-print-discharge-letter-2026-06-09.md`](../../reports/epis2-p1-print-discharge-letter-2026-06-09.md) |
| Auditoría II — inventario + limpieza + documental | Inventario completo · código muerto anclado por gates · plan F1–F5 · [`epis2-auditoria-inventario-limpieza-2026-06-09.md`](../../reports/epis2-auditoria-inventario-limpieza-2026-06-09.md) |
| **F1+F2 — limpieza + PEND-006 código cerrado** | 3 componentes muertos fuera · registry `PRINTABLE_BLUEPRINTS` · lab/imagen A5 + E2E · [`epis2-f1-f2-limpieza-print-2026-06-09.md`](../../reports/epis2-f1-f2-limpieza-print-2026-06-09.md) |
| **F4 — sesión documental** | Brief sync con tablero · norma print v1.1 · banners históricos · `docs/INDEX.md` + `reports/INDEX.md` · [`epis2-f4-sesion-documental-2026-06-09.md`](../../reports/epis2-f4-sesion-documental-2026-06-09.md) |
| **Entrega C-2** — Calm Premium signoff GO | THEME-CALM-01 · UX-AESTHETIC P3 · E3.5 · [`epis2-entrega-c2-calm-premium-2026-06-11.md`](../../reports/epis2-entrega-c2-calm-premium-2026-06-11.md) |
| **Hilo M3-R — state layers + foco + escalera superficies** | R1–R7 ✓ código: action 8/10/10 · focus-visible universal · emphasized real · two-pane/rail en escalera tonal · roles inverse/scrim/dim expuestos · labelMedium→caption · docs reconciliados · [`epis2-m3-r-state-layers-superficie-2026-06-09.md`](../../reports/epis2-m3-r-state-layers-superficie-2026-06-09.md) |
| Housekeeping árbol (#6 #3 #1) | v4/v5 → interop/ y ai/ · `tests/README.md` (golden vitest ≠ e2e) · gate `web-components-root-frozen` · [`epis2-housekeeping-arbol-2026-06-09.md`](../../reports/epis2-housekeeping-arbol-2026-06-09.md) |
| **PEND-011 — CI rojo print E2E cerrado** | Carrera auth en carga fría (guard `GeneratedClinicalFormPage` vs `isLoading`) · paridad CI local 5/5 · `test:e2e` 15/15 · [`epis2-pend011-ci-print-e2e-fix-2026-06-10.md`](../../reports/epis2-pend011-ci-print-e2e-fix-2026-06-10.md) |
| **Hilo NORM — PEND-012 cerrado** | 16/16 MF · ≈90% norma full stack · [`epis2-norm-hilo-close-2026-06-10.md`](../../reports/epis2-norm-hilo-close-2026-06-10.md) |
| **Entrega C-1 (automatizada)** — signoff visual M3 V1–V6 | `quality:m3-signoff` ✓ · `quality:m3-visual-pass` ✓ (16 capturas) · post NORM (a11y, drawer móvil, alto contraste) · [`epis2-m3-visual-pass-2026-06-10.md`](../../reports/epis2-m3-visual-pass-2026-06-10.md) |
| **PROG-DUAL-CHART** MF-DUAL-CHART-00…09 | `eab749c` · ledger 10/10 DONE · gates DC-00…09 ✓ · [`epis2-dual-chart-audit-2026-06-10.md`](../../reports/epis2-dual-chart-audit-2026-06-10.md) |
| **PROG-AUTO-DEV-6H** H-AUTO-0…6 | Ledger DONE · ejecución **pausada** 2026-06-11 · desarrollo manual vía `dev:session` |
| **PROG-PAPER-MODE** MF-PAPER-01…09 | Signoff visual · paginación · puente A5 · comandos IA papel |
| **PROG-PAPER-PLANNER** MF-PAPER-PLANNER-00…04 | Agenda día/semana/mes · print · comandos IA · [`epis2-prog-paper-planner-close-2026-06-11.md`](../../reports/epis2-prog-paper-planner-close-2026-06-11.md) |
| **MF-CASE-01…11** clinical-case-intel | 12 SIM · golden v6/v7 · `quality:case-intel-closure-gate` · [`epis2-session-close-2026-06-13-mf-case.md`](../../reports/epis2-session-close-2026-06-13-mf-case.md) |
| **Conciliación WIP 2026-06-13** | security headers · LOCAL_AI_API_KEY · Evolab CDR/RBAC · paper commands · `657b5a1`…`32b5805` |

---

## En curso (histórico — ver PROG-EXPERIENCIA-CORE arriba)

Hilos C / PAPER / comando absorbidos en tres frentes. C-3 ✓ · MF-PAPER-01…09 ✓ scaffold.

---

## Roadmap por frente (ledger)

| Frente | Ola 1 READY | Olas 2–6 |
|--------|-------------|----------|
| **A Papel** | MF-PA-01 planner mes | print · paginación · secciones VIII–XIV · mirror · signoff |
| **B Electrónica** | MF-TE-01 C-4 staging | **16 secciones vacías → contenido** · Calm · signoff |
| **C Comando+IA** | MF-CM-01 barra unificada | palette=NL · assist · panel IA · signoff |

`npm run quality:tres-frentes-next` · [`tres-frentes-ledger.json`](../quality/tres-frentes-ledger.json) · [`EPIS2_TRES_FRENTES_DEV_PLAN.md`](./EPIS2_TRES_FRENTES_DEV_PLAN.md)

**Pausado:** multimedia (PROG-MEDIA-FUTURE 2027+) · auto-dev — **STRENGTHEN ✓ cerrado**.

---

## Backlog / riesgo

| Ítem | Impacto |
|------|---------|
| PEND-002 defer | Nota post-procedimiento (IDC 58+) — no bloquea Ola 2 |
| MUI Select en E2E | `getByRole('combobox')` en formularios |
| Dependabot zod 4.x | PR aparte |
| **Storybook** (herramienta UI) | 12 stories; ampliar por IDC |
| Evolab | pushed `e453774` · smoke 14/14 · backlog [`evolab-backlog-20260614.md`](../../reports/conciliacion/evolab-backlog-20260614.md) |
| MedRepo | git `3e1181b` · check 75/75 · export verify OK · remote push opcional |
| PROG-AUTO-DEV-6H | Pausado — no relanzar `dev:auto:cycle` sin decisión explícita |

---

## Capas (snapshot)

```text
L0 Invariantes     ████████████████████  permanente
L1 Ola 1           ██████████████████░░  CE + shell · hitos 1C/1D partial
L2 Tramos A–J      ████████████████████  scaffold · Tramo J signoff cerrado
L3 UX densidad     ████████████████████  MF-UI-SIMPLIFY done
L4 RAD MD3         ████████████████████  Hilo A done
L5 clinical-prod   ██████████████████░░  base · piloto M3 automatizado OK · extensión clínica pendiente
L6 Tramo J         ████████████████████  signoff PEND-001 cerrado 2026-06-09
L1 Ola 2 Hilo B    ████████████████████  cerrado 2026-06-09 · PEND-002 defer
```

Reporte cierre Hilo B: `reports/epis2-hilo-b-closure-2026-06-09.md` · Pendientes: `reports/epis2-pendientes-registro-2026-06-09.md`
