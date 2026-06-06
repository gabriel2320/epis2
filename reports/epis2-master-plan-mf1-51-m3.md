# EPIS2 — Plan maestro MF-1…51 y frontera Material Design

**Generado:** 2026-06-07  
**Alcance:** Documentación y planificación únicamente — sin implementación.  
**Fuentes:** `docs/quality/MF_UNIFIED_CANON.md`, `docs/quality/microphase-ledger.json`, `docs/design/M3_ADOPTION_PLAN.md`, `docs/quality/M3_ANTI_DRIFT_GATES.md`, `docs/product/EPIS2_SCREEN_CONNECTION_MAP.md`, `docs/product/EPIS2_COMPLETE_FORM_CATALOG.md`, auditorías `reports/epis2-audit-ciclos-manana-2026-06-07.md` y `reports/epis2-comprehensive-audit-2026-06-05.md`.

---

## 1. Resumen ejecutivo

| Métrica | Valor |
|---------|-------|
| MF unificadas totales | **51** |
| DONE | **34** (MF-1…34) |
| READY | **1** (MF-35 ≡ MF-166) |
| BLOCKED | **16** (MF-36…51) |
| Blueprints en registry (código) | **14** |
| Blueprints en catálogo doc | **11** (deriva — ver §5) |
| M3 técnico (M3-00…09) | **Completado** 2026-06-05 |
| M3 signoff humano piloto | **Pendiente** (MF-47 ≡ MF-178) |

**Próxima ejecución operativa:** MF-35 — Conciliación medicamentos (`npm run quality:microphase-next`).

**Frase guía:** *El gap principal es cobertura de catálogo y sincronización documental, no deriva arquitectónica.*

---

## 2. Canon y reglas de numeración

| Regla | Descripción |
|-------|-------------|
| MF-1…13 | Fases fundacionales `EPIS2-00` … `EPIS2-12` |
| MF-14…51 | Programa post-MVP en orden `canonicalExecutionOrder` del ledger v1.1 |
| Ledger operativo | Sigue IDs `MF-151…182` + inserciones `MF-183…188` hasta migración explícita del JSON |
| Paralelos sin MF | MUI-01…10, M3-00…09, LAYOUT-01…05, WIDGET-01, Plan A–G, V0–V5, PILOT-HUMAN |
| Propuesta MF-2xx | `reports/epis2-master-architect-program-v2.md` — **no sustituye** canon hasta decisión explícita |

---

## 3. Estado por oleada

### 3.1 Fundación — MF-1…13 (DONE)

| MF | ID legado | Entrega clave |
|----|-----------|---------------|
| MF-1 | EPIS2-00 | Canon, invariantes, reglas Cursor |
| MF-2 | EPIS2-01 | Bootstrap monorepo, CI, Docker |
| MF-3 | EPIS2-02 | Shell MUI, login, Centro de Comando |
| MF-4 | EPIS2-03 | Auth, RBAC, auditoría login |
| MF-5 | EPIS2-04 | PostgreSQL SoT, borradores ≠ aprobados |
| MF-6 | EPIS2-05 | Command Registry + router |
| MF-7 | EPIS2-06 | 6 blueprints iniciales + renderer |
| MF-8 | EPIS2-07 | IA local segura (`local-ai`) |
| MF-9 | EPIS2-08 | Borradores, versionado, aprobación humana |
| MF-10 | EPIS2-09 | 5 casos demo sintéticos |
| MF-11 | EPIS2-10 | FHIR export (sin import) |
| MF-12 | EPIS2-11 | QA humano, GO DEMO |
| MF-13 | EPIS2-12 | Modo tablero secundario |

**Pendiente de fundación:** ninguno de producto. Solo deriva en catálogos posteriores.

---

### 3.2 Ola 0 — Verdad operativa — MF-14…23 (DONE)

| MF | ID legado | Entrega |
|----|-----------|---------|
| MF-14 | MF-151 | Gobernanza microfases + ledger JSON |
| MF-15 | MF-152 | Copy español + sync documental |
| MF-16 | MF-153 | Paridad local CI / PostgreSQL |
| MF-17 | MF-154 | Playwright E2E en CI |
| MF-18 | MF-155 | RLS staging fail-closed |
| MF-19 | MF-183 | API integración estable (golden + RLS + censo) |
| MF-20 | MF-184 | Matriz Golden × M3 (`GOLDEN_M3_MATRIX.md`) |
| MF-21 | MF-185 | Auth UI — `/login` sin redirect 401 |
| MF-22 | MF-186 | Golden E2E G3 pasos 6–9 |
| MF-23 | MF-187 | Ollama stack docker + smoke `local-ai` |

---

### 3.3 Ola 1 — Ingreso y datos longitudinales — MF-24…29 (DONE)

| MF | ID legado | Entrega |
|----|-----------|---------|
| MF-24 | MF-156 | Contrato y scaffolder blueprints |
| MF-25 | MF-188 | Patrón IA Ollama por blueprint |
| MF-26 | MF-157 | Blueprint `admission_note` → `/espacio/ingreso` |
| MF-27 | MF-158 | Cadena ingreso comando → form → API admit |
| MF-28 | MF-159 | CRUD alergias (`allergy_entry`) |
| MF-29 | MF-160 | CRUD problemas (`clinical_problem_entry`) |

**Blueprints añadidos en ola 1:** `admission_note`, `allergy_entry`, `clinical_problem_entry` (total registry: **14**).

---

### 3.4 Ola 2 — Resultados — MF-30…34 (DONE)

| MF | ID legado | Entrega |
|----|-----------|---------|
| MF-30 | MF-161 | Bandeja `GET /api/patients/:id/results-inbox`, `/espacio/resultados` |
| MF-31 | MF-162 | Acuse críticos en bandeja |
| MF-32 | MF-163 | Trazabilidad orden → resultado (`clinical_order_id`) |
| MF-33 | MF-164 | Tendencias (`ResultsInboxTrends`, `EpisTrendChart`) |
| MF-34 | MF-165 | Comando `open_results_inbox` (exención blueprint en registry) |

---

### 3.5 Ola 3 — Formularios prioritarios — MF-35…39

| MF | ID legado | Nombre | Estado |
|----|-----------|--------|--------|
| MF-35 | MF-166 | Conciliación medicamentos | **READY** |
| MF-36 | MF-167 | Nota de traslado | BLOCKED |
| MF-37 | MF-168 | Consulta ambulatoria | BLOCKED |
| MF-38 | MF-169 | Solicitud e informe interconsulta | BLOCKED |
| MF-39 | MF-170 | Cola priorizada formularios restantes | BLOCKED |

---

### 3.6 Ola 4 — Administración — MF-40…43 (BLOCKED)

| MF | ID legado | Nombre |
|----|-----------|--------|
| MF-40 | MF-171 | Usuarios y roles (UI read-only demo) |
| MF-41 | MF-172 | Catálogos clínicos |
| MF-42 | MF-173 | Consola de auditoría ampliada |
| MF-43 | MF-174 | Consola operacional |

---

### 3.7 Ola 5 — Candidato piloto — MF-44…48 (BLOCKED)

| MF | ID legado | Nombre |
|----|-----------|--------|
| MF-44 | MF-175 | OIDC en staging |
| MF-45 | MF-176 | Rate limits y controles de abuso |
| MF-46 | MF-177 | Backup y restauración |
| MF-47 | MF-178 | **Signoff humano M3, modo oscuro y offline** |
| MF-48 | MF-179 | Ensayo formal de piloto |

---

### 3.8 Ola 6 — HL7 post-piloto — MF-49…51 (BLOCKED)

| MF | ID legado | Nombre |
|----|-----------|--------|
| MF-49 | MF-180 | HL7 inbound cuarentena sin writeback |
| MF-50 | MF-181 | Mapeo y reconciliación HL7 |
| MF-51 | MF-182 | Writeback HL7 controlado auditado reversible |

**Invariante:** IA prohibida en writeback HL7. Sin writeback antes de MF-180.

---

## 4. Plan detallado — MF pendientes

### 4.0 Ciclo A (recomendado antes o dentro de MF-170) — Sincronización documental

**Tipo:** Solo documentación. No modifica comportamiento.

| Artefacto | Brecha | Acción |
|-----------|--------|--------|
| `EPIS2_SCREEN_CONNECTION_MAP.md` | Ingreso «sin formulario»; resultados MISSING en §3; C1/C2 ABIERTO | Actualizar a MF-157…165 |
| `EPIS2_COMPLETE_FORM_CATALOG.md` | Cuenta 11 blueprints; alergia/ingreso/acuse MISSING | Subir a 14; marcar DONE ola 1–2 |
| `GOLDEN_M3_MATRIX.md` | «Próxima ampliación MF-157+» sin MF-161…165 | Añadir filas resultados + ingreso |
| `EPIS2_COMPLETE_CAPABILITY_MAP.md` | Ingreso/conciliación/resultados en ○ | Reflejar MF-157…165 |
| `MUI_CAPABILITY_MAP.md` | `esES` marcado pendiente | Marcar DONE (`create-epis2-theme.ts`) |

**Criterio de cierre:** `architecture:validate` verde; sin cambios de código productivo.

---

### 4.1 MF-35 ≡ MF-166 — Conciliación medicamentos

**Depende de:** MF-165  
**Base en código:** `PharmacyDashboardTab`, `reconciliationCandidates`, CDR `medication_reconciliation_gap`, vecino `pharmacy_validation`.

| # | Paso | Criterio de aceptación |
|---|------|------------------------|
| 1 | Blueprint `medication_reconciliation` | En `packages/clinical-forms`, `defineBlueprint()` |
| 2 | Ruta | `/espacio/conciliacion` o extensión coherente con farmacia |
| 3 | Intent + frases ES | p. ej. `reconcile_medications` / «revisa medicamentos» |
| 4 | UI | Navegación desde tablero farmacia |
| 5 | Cadena vertical | Borrador → aprobación humana → SoT (sin auto-aprobación) |
| 6 | Tests | Registry + integración mínima si hay write |
| 7 | Reporte | `reports/epis2-mf-166-reconciliation.md` |
| 8 | M3 | Checklist §6 en esta entrega |

**Anti-scope:** No cola farmacia productiva completa en esta MF.

---

### 4.2 MF-36 ≡ MF-167 — Nota de traslado

| # | Paso | Criterio |
|---|------|----------|
| 1 | Blueprint `transfer_note` | Registry + ruta |
| 2 | Intent `transfer_patient` | Comando NL + permisos |
| 3 | Enlace API | `POST transfer` existente |
| 4 | Golden | G1 slice hospitalización V2 |
| 5 | Timeline UI | Actualización post-traslado (mínimo) |
| 6 | IA | Patrón MF-188 o N/A documentado |
| 7 | Reporte | `reports/epis2-mf-167-transfer-note.md` |

---

### 4.3 MF-37 ≡ MF-168 — Consulta ambulatoria

| # | Paso | Criterio |
|---|------|----------|
| 1 | Blueprint `outpatient_visit` | Registry |
| 2 | Ruta | `/espacio/ambulatorio` (convención a fijar) |
| 3 | Intent + comando | Cadena completa |
| 4 | SoT | Migración si encuentro ambulatorio requiere tabla nueva |
| 5 | Reporte | `reports/epis2-mf-168-outpatient.md` |

---

### 4.4 MF-38 ≡ MF-169 — Interconsulta + informe

| # | Paso | Criterio |
|---|------|----------|
| 1 | Extender `referral` o blueprint `referral_report` | Sin duplicar registry |
| 2 | Flujo solicitud → informe respuesta | Borrador → aprobación |
| 3 | Comandos | Diferenciar solicitud vs informe si aplica |
| 4 | Reporte | `reports/epis2-mf-169-referral-report.md` |

---

### 4.5 MF-39 ≡ MF-170 — Cola formularios restantes

**Objetivo:** Gobernanza de catálogo, no un solo formulario.

| # | Paso | Criterio |
|---|------|----------|
| 1 | Inventario | `EPIS2_COMPLETE_FORM_CATALOG.md` §4 (~39 MISSING) |
| 2 | Priorización | P1/P2/P3/DEFERRED en ledger o anexo JSON |
| 3 | Regla | Un blueprint por microfase futura |
| 4 | Doc sync | Ciclo A completado |
| 5 | Comandos huérfanos | Plan para intents dedicados (§5) |
| 6 | Reporte | `reports/epis2-mf-170-form-queue.md` |

**Candidatos P2 inmediatos (post ola 3):**

| Formulario | Notas |
|------------|-------|
| Alta hospitalaria (form) | API parcial en `ServiceDashboardTab` |
| Nota procedimiento | Catálogo documentación |
| Suspensión medicamento | Farmacia |
| Comandos alergia/problema | Hoy reuso `summarize_patient` |
| E2E ingreso + resultados | Golden G3 ampliado |

**DEFERRED:** CIE-10, FONASA, SNRE, nota fallecimiento.

---

### 4.6 MF-40…43 — Administración

Ejecutar en orden ledger. Cada MF: UI read-only o CRUD staging según evidencia en `microphase-ledger.json`. M3 Standard; grids vía `EpisDataGridSuspense`.

---

### 4.7 MF-44…48 — Piloto

| MF | Riesgo | Nota M3 |
|----|--------|---------|
| MF-44 OIDC | Auth staging | Retest login M3-04 |
| MF-45 Rate limits | Abuso API | Tests negativos |
| MF-46 Backup | Operaciones | Runbook |
| **MF-47** | **Signoff M3 humano** | Modo oscuro todas pantallas clínicas; jornada prolongada; offline si aplica |
| MF-48 | Piloto formal | `PILOT_DEMO_CHECKLIST.md` G4 |

**Distinción:** M3-09 = QA técnico cerrado. MF-47 = validación clínica humana extendida.

---

### 4.8 MF-49…51 — HL7

Secuencia estricta sin saltos. Cuarentena → mapeo → writeback reversible con borrador humano.

---

## 5. Pasos faltantes transversales (fuera del ledger)

| ID | Brecha | Severidad | Cierre propuesto |
|----|--------|-----------|------------------|
| G-DOC-01 | Screen map desactualizado (ingreso, resultados, C1/C2) | P1 | Ciclo A / MF-170 |
| G-DOC-02 | Form catalog 11 vs 14 blueprints | P1 | Ciclo A / MF-170 |
| G-DOC-03 | Golden M3 matrix sin MF-161…165 | P2 | Ciclo A |
| G-CMD-01 | Alergia/problema sin intent propio (`summarize_patient`) | P2 | MF-170 o micro-MF |
| G-CMD-02 | Sin `revisa medicamentos` | P1 | MF-166 |
| G-CMD-03 | Sin `traslada al paciente` | P1 | MF-167 |
| G-CMD-04 | Sin `ver pendientes` | P2 | MF-170 o tablero |
| G-JRN-01 | E2E no cubre ingreso ni bandeja resultados | P2 | Post MF-166 o golden-guardian |
| G-JRN-02 | G1 API slices no documentados para CRUD/resultados | P2 | Ampliar matriz |
| G-IA-01 | Verificar assistSchemas en blueprints ola 1 | P3 | Auditoría MF-188 |

---

## 6. Material Design 3 / MUI — inventario

### 6.1 Completado (no abrir nueva fase M3)

| Track | Evidencia |
|-------|-----------|
| MUI-01…10 | `reports/epis2-mui-*.md` |
| M3-00…09 | `docs/design/M3_ADOPTION_PLAN.md`, `reports/epis2-m3-09-qa-signoff.md` |
| MUI-11 → M3-09 | Bundle analyze, `no-direct-mui-imports` |
| LAYOUT-01…05 | Two-pane, panel consulta, búsqueda docs |
| WIDGET-01 | `reports/epis2-widget-01-m3-signoff.md` |
| Modo oscuro piloto | `EpisThemeModeToggle`, `create-epis2-theme.dark.test.ts` |
| Preferencias apariencia | `/espacio/apariencia`, M3-08 (doc catalog dice MISSING — error doc) |

### 6.2 Pendientes M3/MUI

| ID | Descripción | Prioridad | MF / momento |
|----|-------------|-----------|--------------|
| M3-HUMAN | Revisión clínica modo oscuro (forms + tablero) | Alta | MF-47 |
| M3-PER-MF | Checklist M3-G01…G15 por pantalla nueva (ResultsInbox, ingreso, etc.) | Alta | Cierre MF-30…39 |
| M3-CI-LIC | Validador `no-mui-premium-without-license` planificado, no en `scripts/architecture/` | Media | MF-47 o gate incremental |
| MUI-BUNDLE | `mui-core` ~164 KB gzip (date pickers siempre cargados) | Media | Post MF-48 |
| MUI-SCHED | Scheduler alpha; peer MUI 6 vs 7; solo `/dev/scheduler-spike` | Baja | Post-piloto + modelo Appointment |
| M3-DOC | `MUI_CAPABILITY_MAP` esES pendiente (implementado) | Baja | Ciclo A |

### 6.3 Checklist M3 por entrega UI (MF-35…39)

Derivado de `M3_ANTI_DRIFT_GATES.md` y `GOLDEN_M3_MATRIX.md`:

```markdown
- [ ] Tokens createEpis2Theme — sin hex sueltos en layout clínico
- [ ] Roles clínicos — contraste WCAG en chips de estado
- [ ] prefers-reduced-motion — sin animación obligatoria
- [ ] Teclado / foco visible (power bar, formulario)
- [ ] Copy desde packages/design-system/src/copy/es.ts
- [ ] Estados loading / error / empty (M3-G10)
- [ ] Una acción primaria por viewport (M3-G13)
- [ ] Sin expressive en alertas / aprobación / errores (M3-G06)
- [ ] Golden journey afectado ejecutado
- [ ] UI solo @epis2/epis2-ui (M3-G11)
```

---

## 7. Secuencia de ciclos recomendada

```text
Ciclo A   — Sincronización documental (§4.0) — doc only
Ciclo 1   — MF-35 / MF-166  Conciliación medicamentos
Ciclo 2   — MF-36 / MF-167  Nota de traslado
Ciclo 3   — MF-37 / MF-168  Consulta ambulatoria
Ciclo 4   — MF-38 / MF-169  Interconsulta + informe
Ciclo 5   — MF-39 / MF-170  Cola forms + doc + comandos huérfanos
Ciclos 6+ — MF-40…48        Solo con criterio piloto explícito
          — MF-49…51        Post-piloto HL7
```

**Regla operativa:** una microfase por sesión; gates al cierre: `check` → `test` → `db:validate` → `quality:microphases`.

```bash
DATABASE_URL=postgresql://epis2_app:epis2@127.0.0.1:5433/epis2
npm run quality:microphase-next   # → MF-166
```

---

## 8. Diagrama de dependencias (pendiente)

```mermaid
flowchart TD
  A[MF-34 DONE] --> B[MF-35 READY Conciliación]
  B --> C[MF-36 Traslado]
  C --> D[MF-37 Ambulatorio]
  D --> E[MF-38 Interconsulta]
  E --> F[MF-39 Cola forms + doc]
  F --> G[MF-40…43 Admin]
  G --> H[MF-44…48 Piloto]
  H --> I[MF-47 Signoff M3 humano]
  I --> J[MF-48 Ensayo piloto]
  J --> K[MF-49…51 HL7]
  DOC[Ciclo A Doc sync] -.-> F
  M3T[M3-09 técnico DONE] -.-> I
```

---

## 9. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Deriva documental confunde agentes | Ciclo A antes de MF-170 |
| Scope creep MF-166 | Solo blueprint + form; no cola farmacia productiva |
| Tests integración flaky | `fileParallelism: false` + rol `epis2_app` |
| MF-2xx vs MF-1…51 | Mantener canon unificado hasta ADR explícito |
| M3 signoff prematuro | Reservar validación humana para MF-47 |

---

## 10. Próximo paso exacto

1. **Opcional inmediato:** ejecutar **Ciclo A** (solo docs listados en §4.0).
2. **Siguiente MF de producto:** **MF-35 / MF-166** conciliación medicamentos.
3. **No iniciar** MF-40+ ni HL7 sin criterio de piloto.

---

## 11. Frontera impresión clínica (PRINT — paralelo, sin MF en ledger)

**Norma canónica (2026-06-07):** `docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md`

M3 gobierna pantalla; impresión/PDF es capa documental plana (Carta/A5 únicamente; prohibido A4 y `window.print()` sobre UI interactiva).

### Estado

| Ítem | Estado |
|------|--------|
| Norma gráfica y técnica | **Documentada** |
| Primitivas `Print*` en `epis2-ui` | **No implementadas** |
| Tokens `@page` / CSS print | **No implementados** |
| Contrato `PrintDocumentFormat` en `packages/contracts` | **No implementado** |
| Vista imprimible por blueprint | **0 / 14** |
| PDF reproducible server-side | **No** |

### Secuencia PRINT propuesta (cuando se abra programa)

```text
PRINT-00  Norma + mapeo blueprint→formato (§29 norma)           ← DONE (doc)
PRINT-01  Tokens print + @page Carta/A5 en epis2-ui/theme
PRINT-02  Primitivas PrintHeader, PrintSection, PrintField, PrintFooter
PRINT-03  PrintLetterDocument + PrintA5Document + contrato TS
PRINT-04  Piloto: evolution_note + prescription (Carta + A5)
PRINT-05  Órdenes lab/imagen (A5) + watermarks borrador/firmado
PRINT-06  Documentos longitudinales ola 3 (ingreso, conciliación, traslado)
PRINT-07  Operacionales horizontal (MAR, tendencias)
PRINT-08  PDF server-side + pruebas escala de grises
PRINT-09  Checklist humano §27 + gate en architecture:validate
```

### Acoplamiento con MF clínicas

| MF producto | Impresión sugerida (post blueprint) |
|-------------|-------------------------------------|
| MF-35 conciliación | PRINT-06 — Carta vertical |
| MF-36 traslado | PRINT-06 |
| MF-37 ambulatorio | PRINT-06 o A5 si transaccional breve |
| Blueprints existentes receta/lab/imagen | PRINT-04 / PRINT-05 (A5) |

**Regla:** cada MF de formulario nuevo debe declarar formato en blueprint contract (paso 8); implementación print puede ir en PRINT-* posterior sin bloquear la MF de pantalla.

---

## Referencias

- **Impresión Chile:** `docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md`
- Canon unificado: `docs/quality/MF_UNIFIED_CANON.md`
- Ledger: `docs/quality/microphase-ledger.json`
- Programa: `docs/quality/MICROPHASE_PROGRAM.md`
- M3: `docs/design/M3_ADOPTION_PLAN.md`
- Gates M3: `docs/quality/M3_ANTI_DRIFT_GATES.md`
- Golden: `docs/quality/GOLDEN_CLINICAL_JOURNEY.md`, `docs/quality/GOLDEN_M3_MATRIX.md`
- Conexiones: `docs/product/EPIS2_SCREEN_CONNECTION_MAP.md`
- Formularios: `docs/product/EPIS2_COMPLETE_FORM_CATALOG.md`
- Auditoría ciclos: `reports/epis2-audit-ciclos-manana-2026-06-07.md`
