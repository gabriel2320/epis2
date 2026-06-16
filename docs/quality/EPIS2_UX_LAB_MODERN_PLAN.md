# EPIS2 — Plan UX moderno (Clinical Shift Lab)

**Programa:** `PROG-UX-LAB` · **Versión:** 1.0 · **Fecha:** 2026-06-16  
**Estado:** Propuesto · **Congelamiento:** vigente ([`CONSOLIDATION_FREEZE.md`](../CONSOLIDATION_FREEZE.md))  
**Baseline:** GO DEMO UX/CE (2026-06-04) · tag `v0.1-demo-rc3` · PROG-POST-RC3 ✓

> **Tesis:** EPIS2 no necesita más pantallas; necesita **menos ambigüedad clínica** en las que ya tiene.  
> El objetivo post-RC3 no es re-certificar el golden journey — es demostrar en 15–20 min que un médico nuevo entiende *demo · borrador · aprobado · IA · auditoría* sin leer documentación.

**Canon:** [`PRODUCT_CANON.md`](../PRODUCT_CANON.md) · [`EPIS2_CLINICAL_TERMINOLOGY.md`](../product/EPIS2_CLINICAL_TERMINOLOGY.md) · [`PILOT_DEMO_CHECKLIST.md`](./PILOT_DEMO_CHECKLIST.md)

---

## 1. Qué significa «UX moderno» en EPIS2

UX moderno aquí **no** es gradientes, animaciones ni dashboards. Es:

| Pilar | Definición operativa |
|-------|----------------------|
| **Ritmo clínico** | El flujo tiene inicio, tensión (pendiente) y cierre (aprobación) — como un turno, no como un tour de pantallas. |
| **Progressive disclosure** | Lo esencial primero (¿qué hago ahora?); detalle bajo demanda (historial, widgets, tablero secundario). |
| **Trust by design** | Cada píxel responde: ¿es demo? ¿es borrador? ¿está firmado? ¿intervino la IA? |
| **Command as muscle memory** | La barra de comando es el atajo cognitivo; la UI visible confirma lo que el comando prometió. |
| **Degradable by default** | Ollama apagado = experiencia completa; IA encendida = acelerador opcional, nunca dependencia. |
| **Measure what matters** | Gates duros en CI; tiempos y fricciones en reporte humano — no mezclar. |

Referencia de piloto existente: [`PILOT_DEMO_CHECKLIST.md`](./PILOT_DEMO_CHECKLIST.md) · gates `quality:golden-journey`, `quality:ux-pilot`, `quality:m3-human-pilot`.

---

## 2. Delta respecto al baseline (no repetir trabajo)

| Ya entregado | Evidencia | No rehacer |
|--------------|-----------|------------|
| Flujo login → evolución → borrador → aprobación | Golden journey 17/17 · GO DEMO 2026-06-04 | Nuevo Form Registry · nuevas rutas clínicas |
| Home ficha-first | PROG-FICHA-FIRST ✓ | Hero Command Center · dashboard como entrada |
| Badge DEMO | `EpisDemoBadgeChip` | Segundo sistema de chips demo |
| Estados borrador | `EpisDraftStatus`, `EpisApprovalGate` | Tokens `clinical.*` paralelos al M3 |
| Narrativa DEMO | `getPrimaryNarrativeForDemoCode`, fixtures | Nuevos pacientes fuera de DEMO/SIM |
| Command registry | `@epis2/command-registry` | Segundo registry · sugerencias LLM obligatorias |

**Pregunta guía del programa:**

```text
¿Un médico demo completa el turno sintético entendiendo
qué es seguro, qué es provisional y qué quedó auditado?
```

---

## 3. Arquitectura de experiencia (4 capas)

Sin pantalla de bienvenida nueva. Sin tercer home.

```text
┌─────────────────────────────────────────────────────────────┐
│ CAPA 0 — Entrada canónica                                   │
│ /espacio/buscar-paciente (censo) + barra de comando         │
│ /comando = redirect compat · tablero = secundario           │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ CAPA 1 — Shift Context Strip (banner contextual, no home)   │
│ Turno sintético · 5 DEMO · IA on/off · 1–3 pendientes       │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ CAPA 2 — Censo como mapa del turno                          │
│ Fila compacta · pendiente principal · acción primaria única   │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ CAPA 3 — Ficha dual + confianza                             │
│ MD3 estructurado │ papel carta · estados visibles · SOAP    │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ CAPA 4 — Cierre del turno                                   │
│ borrador → revisión → aprobación humana → auditoría → censo │
└─────────────────────────────────────────────────────────────┘
```

### Capa 1 — Shift Context Strip

**Ubicación:** parte superior de `/espacio/buscar-paciente` (y opcionalmente sticky en ficha).  
**Prohibido:** ruta `/turno`, modal de onboarding, pantalla previa al censo.

Contenido fijo:

```text
Turno clínico sintético · medico.demo · DEMO/SIM · IA: disponible | degradada | off
Pendientes: DEMO-001 evolución · DEMO-003 borrador por aprobar · …
```

Datos: fixtures + borradores API existentes — **sin nuevo modelo clínico**.

### Capa 2 — Censo narrativo

Extender `PatientListGrid` (o fila equivalente) con campos derivados:

| Campo | Fuente |
|-------|--------|
| Problema activo | `getPrimaryNarrativeForDemoCode` |
| Pendiente principal | regla determinística (ver §4) |
| Última actividad | fixture o timestamp borrador/nota demo |
| Estado borrador | API drafts por paciente |
| Acción primaria | una sola CTA por fila |

**Regla acción primaria (determinística):**

```text
ready_for_review  →  Revisar borrador
draft|editing     →  Continuar evolución
sin borrador      →  Crear evolución
default           →  Abrir ficha
```

### Capa 3 — Ficha dual + confianza

**Papel (`chartMode=paper`):** hoja carta como objeto central — márgenes, encabezado sintético, SOAP legible, watermark BORRADOR/APROBADO.  
**Estructurado (`chartMode=traditional`):** timeline y widgets sin competir con el papel en demo.

Reutilizar roles M3 existentes (`draft`, `approved`, `warning`, `critical`, `aiAssistance`) — ver [`EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md`](../design/EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md). **No** crear paleta `clinical.*` paralela.

### Capa 4 — Comando contextual

Sugerencias desde `@epis2/command-registry` + context rank — **sin LLM**.

| Contexto | Sugerencias ejemplo |
|----------|---------------------|
| Censo | buscar DEMO-001 · ver borradores pendientes · abrir evolución |
| Ficha | evolución · epicrisis · laboratorio · ver borradores |
| Borrador | enviar a revisión · aprobar (humano) · volver a ficha |

Frase canónica: **«¿Qué necesitas hacer?»** — ya en design system M3.

---

## 4. Escalera de confianza (trust ladder)

Todo estado visible debe mapear a componente único en `@epis2/epis2-ui`:

| Estado | Significado | Componente | Uso permitido | Prohibido |
|--------|-------------|------------|---------------|-----------|
| DEMO/SIM | Dato sintético | `EpisDemoBadgeChip` | login, censo, ficha, formulario | omitir en flujo demo |
| BORRADOR | No firmado | `EpisDraftStatus` | formulario, papel, revisión | historial final sin etiqueta |
| EN REVISIÓN | Espera humano | `EpisDraftStatus` | pantalla borrador | auto-transición |
| APROBADO | Registro versionado | `EpisDraftStatus` | historial, papel | UI optimista antes de API |
| IA SUGERIDA | No firmado | `EpisAiDisclosure` | assist panel | insertar directo a historial |
| IA OFF/DEGRADADA | Sin inferencia | chip/banner fijo | command bar, formulario | bloquear flujo core |

**Regla crítica:**

```text
BORRADOR puede mostrar estado optimista de guardado.
APROBADO espera confirmación real del backend — nunca optimista.
```

---

## 5. Tres modos de corrida (no tres productos)

| Modo | IA | Objetivo | ¿Gate cierre? |
|------|-----|----------|---------------|
| **A — Sin IA** | Ollama off | Ficha funcional sin dependencia IA | **Sí** |
| **B — Fixture** | Respuestas fijas test | Demo visual estable, sin latencia | Opcional |
| **C — Ollama real** | Modelo local | Latencia, degradación, utilidad | **No** (experimental) |

Modo A es obligatorio para GO del lab. Modo C solo documenta hallazgos en reporte.

---

## 6. Métricas: hard vs soft

### Hard (CI / gates existentes)

| Métrica | Umbral | Gate |
|---------|--------|------|
| Golden journey | 17/17 | `quality:golden-journey` |
| UX command-first | API + E2E verde | `quality:ux-pilot` |
| Evidencia estática UX | OK | `quality:ux-pilot-gate` |
| M3 visual | V1–V6 | `quality:m3-human-pilot` |
| Seguridad post-RC3 | RH-09/10/11 + RH-12 | `quality:security-promote-gate` |
| Auto-aprobación IA | 0 | invariantes + tests |
| PHI real | 0 | fixtures + copy |

### Soft (reporte humano / telemetría opcional)

| Métrica | Objetivo demo | Registro |
|---------|---------------|----------|
| Login → censo | < 15 s | `reports/epis2-ux-lab-run-*.md` |
| Censo → ficha | < 20 s | idem |
| Ficha → evolución abierta | < 45 s | idem |
| Evolución completa (manual) | < 3 min | idem |
| Dudas borrador vs aprobado | 0 críticas | observador |
| Clicks totales turno | baseline + delta | JSON opcional |

**No** promover métricas soft a gate CI sin instrumentación acordada.

---

## 7. Programa PROG-UX-LAB — 4 tramos

Un tramo por sesión agente. Diff mínimo. Sin mega-PR.

### Tramo A — Charter + auditoría baseline

**MF-UXLAB-00** ✓ **PASS** 2026-06-16 · [`epis2-ux-lab-baseline-2026-06-16.md`](../../reports/epis2-ux-lab-baseline-2026-06-16.md)

| Entregable | Descripción |
|------------|-------------|
| Este documento | Plan canónico (v1.0) |
| Checklist corrida | Anexo A al final de este doc |
| Baseline run | 1 corrida gates + nota delta vs GO 2026-06-04 |

**Archivos:** `docs/quality/*`, `reports/epis2-ux-lab-baseline-*.md`  
**Gate:** `npm run quality:fast`

---

### Tramo B — Censo como mapa del turno

**MF-UXLAB-01** (fusiona fixtures narrativos + censo)

| Entregable | Descripción |
|------------|-------------|
| Fixtures enriquecidos | 5 DEMO con pendiente, último evento, riesgo visual |
| Shift Context Strip | Banner en buscar-paciente |
| Censo narrativo | Pendiente + acción primaria + badges en grid |
| E2E smoke | 1 spec: censo → acción primaria → ficha |

**Archivos permitidos:**

```text
packages/test-fixtures/**
apps/web/src/fixtures/**
apps/web/src/components/PatientListGrid.tsx
apps/web/src/pages/*buscar* *Patient*
packages/epis2-ui/src/primitives/EpisDemoBadgeChip.tsx  # solo si consolidación
e2e/ux-lab-census.spec.ts
```

**Prohibido:** nueva ruta home · nuevo endpoint clínico · PHI.

**Gate:** `npm run quality:ux-pilot` + `npm run quality:fast`

---

### Tramo C — Confianza visual (papel + estados)

**MF-UXLAB-02**

| Entregable | Descripción |
|------------|-------------|
| Papel premium | Encabezado, márgenes, SOAP, watermark draft/approved |
| Consolidación chips | Unificar demo + draft + IA off en primitivas existentes |
| Ficha dual | Estados visibles en chrome paciente y paper shell |
| Print/preview | No regresión export |

**Archivos permitidos:**

```text
apps/web/src/**/paper/**
apps/web/src/layouts/ClinicalPatientChartChrome.tsx
packages/epis2-ui/src/clinical/EpisDraftStatus.tsx
packages/epis2-ui/src/clinical/EpisAiDisclosure.tsx
packages/epis2-ui/src/theme/chart-modes-tokens.ts
e2e/*paper* *m3*
```

**Gate:** `npm run quality:m3-human-pilot` + `npm run quality:fast`

---

### Tramo D — Medición + cierre humano

**MF-UXLAB-03**

| Entregable | Descripción |
|------------|-------------|
| Plantilla corrida | `reports/epis2-ux-lab-run-TEMPLATE.md` |
| Corrida Modo A | Ollama off, 1 operador, tiempos soft |
| Revisión 3–5 usuarios | Nielsen: problemas de usabilidad, no estadística |
| Fix-only patch | Solo UX-BLOCKER documentados |
| Cierre | `reports/epis2-ux-lab-close-*.md` |

**Diferido a 2027+:** persona agents Evolab (MF-UXLAB-04), atajos teclado globales, telemetría clickstream productiva.

**Gate cierre programa:**

```bash
npm run quality:security-promote-gate
npm run quality:golden-journey
npm run quality:ux-pilot
npm run quality:ux-pilot-gate
npm run quality:m3-human-pilot
npm run quality:fast
```

---

## 8. Criterios GO / PASS / BLOCKED / NO GO

### GO

```text
Modo A completo sin errores
0 UX-BLOCKER
100 % DEMO/SIM visible en censo + ficha + formulario
borrador/aprobado inequívoco (0 dudas críticas en revisión humana)
Ollama apagado no bloquea
gates hard verdes
```

### PASS WITH FIXES

```text
Flujo completo
Fricción menor (copy, spacing, prominencia badge)
Sin riesgo médico-legal
Fixes documentados en cierre, no en caliente
```

### BLOCKED

```text
No se completa evolución/aprobación
Pérdida contexto paciente
IA parece firmar
Estados borrador/aprobado ambiguos
Ollama off rompe flujo core
```

### NO GO

```text
Nuevo home o dashboard como entrada
Segundo registry
Features clínicas fuera de alcance
PHI real
Contradicción PRODUCT_INVARIANTS
```

---

## 9. No-goals explícitos

```text
Nuevo módulo clínico (farmacia HIS, FHIR productivo, admisión real)
Pantalla «Turno» como landing
Tokens de color fuera del M3 clínico existente
IA generativa en command suggestions
Auto-aprobación o auto-firma
Expansión del tablero `/epis2/dashboard` como home
Persona simulation acoplada al core (Evolab = HTTP/JSON externo)
Telemetría productiva con PHI
```

---

## 10. Impresión objetivo (15–20 min, Modo A)

Al terminar, el evaluador debe poder decir:

```text
«Entré al censo, vi qué pacientes demo tenían pendiente,
abrí uno, escribí una evolución en papel digital,
guardé borrador, aprobé yo mismo, vi que quedó auditado,
y en ningún momento confundí demo con dato real ni
creí que la IA firmó por mí.»
```

Eso es identidad de producto EPIS2 — no un dashboard SaaS genérico.

---

## 11. Prompt de sesión agente (compacto)

```text
Programa: PROG-UX-LAB · Tramo B|C|D · MF-UXLAB-0N
Congelamiento vigente — sin features clínicas nuevas.

Leer:
- docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md
- docs/CONSOLIDATION_FREEZE.md
- docs/product/EPIS2_CLINICAL_TERMINOLOGY.md

Reglas:
- Home = /espacio/buscar-paciente; Shift Context Strip ≠ home nuevo
- Reutilizar EpisDemoBadgeChip, EpisDraftStatus, command-registry
- APROBADO nunca optimista; IA nunca firma
- Un objetivo · diff mínimo · gate del tramo al cerrar

Entregar: reporte reports/epis2-ux-lab-* con alcance, gate, riesgos, próximo tramo.
```

---

## Anexo A — Checklist corrida Clinical Shift Lab (Modo A)

**Duración:** 15–20 min · **Usuario:** `medico.demo` · **IA:** Ollama **apagado**

| # | Paso | OK | Tiempo | Notas |
|---|------|----|--------|-------|
| 1 | Login → censo (sin pantalla intermedia) | | | |
| 2 | Shift Context Strip visible (DEMO/SIM, pendientes) | | | |
| 3 | Censo: acción primaria clara en ≥1 paciente | | | |
| 4 | Abrir ficha dual — badge DEMO visible | | | |
| 5 | Comando → evolución (sin dashboard intermedio) | | | |
| 6 | Formulario SOAP — estado borrador visible | | | |
| 7 | Guardar borrador — mensaje claro, no confundir con aprobado | | | |
| 8 | Revisión → aprobar **humano** | | | |
| 9 | Historial/auditoría — nota aprobada trazable | | | |
| 10 | Volver al censo — contexto coherente | | | |
| 11 | Modo papel: hoja legible, watermark correcto | | | |
| 12 | ¿Alguna duda borrador vs aprobado? (debe ser NO) | | | |

**Resultado:** GO · PASS WITH FIXES · BLOCKED · NO GO

---

## Anexo B — Referencias

| Documento | Uso |
|-----------|-----|
| [`PILOT_DEMO_CHECKLIST.md`](./PILOT_DEMO_CHECKLIST.md) | Baseline journey |
| [`GOLDEN_CLINICAL_JOURNEY.md`](./GOLDEN_CLINICAL_JOURNEY.md) | Gate producto |
| [`M3_VISUAL_SIGNOFF_STEPS.md`](./M3_VISUAL_SIGNOFF_STEPS.md) | Signoff visual |
| [`EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md`](../design/EPIS2_CLINICAL_DESIGN_SYSTEM_M3.md) | Tokens y roles |
| [`CONSOLIDATION_FREEZE.md`](../CONSOLIDATION_FREEZE.md) | Límites de alcance |

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
