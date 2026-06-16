# EPIS2 — CICA

**Algoritmo de Composición por Intención Clínica**  
**CICA** · *Clinical Intent Composition Algorithm*  
**Versión:** 1.0 · **Fecha:** 2026-06-16  
**Estado:** Norma canon · **Programa:** PROG-AESTHETIC-RESET

**Documentos relacionados:**

| Documento | Rol |
|-----------|-----|
| [`EPIS2_CICA_SCREEN_GOVERNOR.md`](./EPIS2_CICA_SCREEN_GOVERNOR.md) | Admisión — ¿dónde vive la necesidad? (CICA-SG) |
| [`EPIS2_CICA_L.md`](./EPIS2_CICA_L.md) | Loop composición por pantalla (CICA-L) |
| [`EPIS2_CLINICAL_SCREEN_MAP.md`](./EPIS2_CLINICAL_SCREEN_MAP.md) | Árbol de pantallas (qué existe) |
| [`EPIS2_CLINICAL_LAYOUT_MANIFESTO.md`](./EPIS2_CLINICAL_LAYOUT_MANIFESTO.md) | Composición visual (cómo se ve) |
| [`EPIS2_CLINICAL_LAYOUT_ENGINE.md`](./EPIS2_CLINICAL_LAYOUT_ENGINE.md) | Motor de layout (código) |

> **Frase guía:** EPIS2 ordena sus pantallas como piensa un médico: primero el paciente, luego el problema, luego el documento, luego la acción, luego la firma y la auditoría.

---

## Principio rector — Intención clínica progresiva

```text
De paciente → a problema → a documento → a acción → a firma/auditoría
```

Una pantalla existe para resolver **una intención clínica concreta**, con **una sola acción principal**, manteniendo siempre visible:

- el paciente
- el contexto clínico relevante
- el estado del documento (borrador / aprobado / firmado)

CICA decide:

```text
qué pantalla existe · dónde vive en el árbol · qué muestra · qué oculta
cuál es su acción principal · cómo se vuelve atrás · qué estado queda visible
```

---

## Regla base del árbol

El árbol **no** se organiza por componentes técnicos, tablas de BD ni conveniencia de implementación.

Se organiza por el flujo mental del médico:

```text
1. ¿Qué paciente?
2. ¿Qué le pasa?
3. ¿Qué necesito revisar?
4. ¿Qué necesito hacer?
5. ¿Está en borrador o aprobado?
6. ¿Cómo vuelvo?
```

---

## Niveles algorítmicos

| Nivel | Pantalla | Pregunta clínica | Acción primaria |
|-------|----------|------------------|-----------------|
| **0** | Login | ¿Quién usa el sistema? | Entrar |
| **1** | Censo | ¿A qué paciente voy? | Abrir ficha |
| **2** | Patient shell | ¿Qué pasa con este paciente? | Nueva evolución (en resumen) |
| **3** | Sección clínica | ¿Qué dimensión reviso? | Depende de sección |
| **4** | Documento / form | ¿Qué acto realizo? | Guardar borrador / crear |
| **5** | Estado / auditoría | ¿Qué validez tiene? | Aprobar / revisar historial |

### Barra de comando transversal (obligatoria)

La **barra de comando NL** es atajo de intención (Command Registry + Ctrl+K). Siempre presente en `/espacio/*` clínico. No compite con la acción primaria de la pantalla — ver Screen Map §0 · gate `quality:clinical-command-bar-transversal-gate`.

### Infraestructura transversal (no es nivel de pantalla)

Atajo de intención vía lenguaje natural; no sustituye la progresión Censo → Ficha → Documento.

### Nivel 5 como estado, no siempre como ruta

Borrador, firmado, auditado son **estados visibles** (chips, watermarks). Pantalla dedicada solo cuando la intención es revisar historial (`DraftReviewPage`, `navAudit`).

---

## Las 7 leyes de CICA

| # | Ley | Implementación EPIS2 |
|---|-----|---------------------|
| 1 | **Identidad persistente** | `PatientIdentityBand` · `ClinicalIntentBreadcrumb` · MF-AEST-05 |
| 2 | **Una intención por pantalla** | Manifiesto §2 · tabs + forms separados |
| 3 | **Una acción primaria** | `normalizeClinicalActions` · gates densidad |
| 4 | **Progresión clínica** | Screen Map §1 · Censo → Ficha → Sección → Form |
| 5 | **Retorno seguro** | `ClinicalIntentBreadcrumb` · volver censo/ficha |
| 6 | **Prioridad clínica** | Orden tabs `classicChartTabConfig` |
| 7 | **Carga cognitiva** | 1+2+Más · máx. 7 nav · tab «Más» |

---

## Orden natural de secciones (Ley 6)

Justificado por flujo clínico habitual — no por estética:

```text
Resumen → Evoluciones → Indicaciones → Exámenes → Medicamentos → Documentos → Alta → Papel → Auditoría
```

Visibilidad (Ley 7): 5 tabs + «Más» en barra; medicamentos en overflow; papel en ruta exclusiva.

### Score de prioridad (referencia diseño)

```text
Score = 0.30×frecuencia + 0.25×riesgo + 0.20×relevancia_episodio
      + 0.15×urgencia + 0.10×rol_usuario − penalización_saturación
```

No automatizar en demo v0.1. Usar para admitir secciones nuevas.

---

## Modo papel — Temporal Clinical Document Flow

Subprincipio CICA:

```text
Paciente + fecha + documento clínico + navegación temporal
```

```text
Ficha → Papel → Día anterior · Hoy · Día siguiente
```

Ruta exclusiva `/espacio/ficha/papel` (MF-AEST-03). Lógica temporal y documental, no modular embebida.

---

## Fórmula de pantalla correcta

```text
Pantalla correcta =
  Paciente visible
+ intención única
+ contenido dominante
+ acción primaria única
+ navegación de retorno
+ estado clínico visible
+ baja carga visual
```

Auditoría: `auditCicaScreen()` en `clinicalLayoutEngine.ts`. Objetivo **≥ 90** para signoff estético rc4.

---

## Checklist — ¿merece pantalla nueva?

Una pantalla nueva solo se admite si responde **sí** a todas:

```text
1. ¿Tiene intención clínica propia?
2. ¿Tiene acción principal clara?
3. ¿No duplica otra pantalla?
4. ¿Reduce complejidad en vez de aumentarla?
5. ¿Tiene retorno claro (Ley 5)?
6. ¿Mantiene visible paciente y estado (Ley 1)?
7. ¿Puede probarse con un gate?
```

Si falla una → sección, modal, menú «Más» o acción secundaria. Evaluación formal: [`EPIS2_CICA_SCREEN_GOVERNOR.md`](./EPIS2_CICA_SCREEN_GOVERNOR.md) + ledger `reports/cica-sg/`.

Gate: `quality:cica-screen-admission-gate` · (roadmap) `quality:cica-screen-governor-gate`

---

## Pseudocódigo normativo

```ts
function buildClinicalScreenTree(context: ClinicalContext) {
  const patient = selectPatientFromCensus(context);

  const patientShell = createPatientShell({
    identity: patient.identity,
    location: patient.location,
    clinicalStatus: patient.status,
    demoState: context.demoState,
    aiState: context.aiState,
    commandBar: createTransversalCommandBar(context), // siempre
  });

  const sections = rankSectionsByClinicalUse([
    'resumen', 'evoluciones', 'indicaciones', 'examenes',
    'medicamentos', 'documentos', 'alta', 'papel', 'auditoria',
  ]);

  return {
    root: 'censo',
    patientShell,
    sections: sections.map((section) =>
      createSectionNode({
        section,
        intent: resolveClinicalIntent(section),
        primaryAction: resolvePrimaryAction(section),
        visibleActions: normalizeClinicalActions(section.actions),
        layoutProfile: resolveLayoutProfile(section),
        breadcrumb: buildClinicalBreadcrumb(context, section),
      }),
    ),
  };
}
```

Implementación parcial: `@epis2/epis2-ui/layout/clinical/` · `apps/web/src/clinical/clinicalIntent.ts` · `ClinicalIntentBreadcrumb`.

---

## Ejemplos aplicados

### Censo

| Campo | Valor |
|-------|-------|
| Intención | Elegir paciente |
| Acción primaria | Abrir ficha |
| Retorno | N/A |
| Estado visible | DEMO / turno / servicio |

### Ficha resumen

| Campo | Valor |
|-------|-------|
| Intención | Entender situación del paciente |
| Acción primaria | Nueva evolución |
| Retorno | Volver al censo |
| Breadcrumb | Censo → [Paciente] → Resumen |

### Nueva evolución

| Campo | Valor |
|-------|-------|
| Intención | Escribir evolución |
| Acción primaria | Guardar borrador |
| Retorno | Censo → [Paciente] → Evolución |
| Estado visible | Borrador |

### Modo papel

| Campo | Valor |
|-------|-------|
| Intención | Leer hoja clínica diaria |
| Acción primaria | Imprimir / navegar día |
| Retorno | Volver a ficha |
| Estado visible | DEMO / BORRADOR / APROBADO |

---

## Gates CICA

| Gate | Verifica |
|------|----------|
| `quality:clinical-navigation-clarity-gate` | MF-AEST-05 breadcrumb + retorno |
| `quality:cica-screen-admission-gate` | Canon + checklist documentado |
| `quality:clinical-command-bar-transversal-gate` | Barra NL siempre (Screen Map §0) |
| `quality:aesthetic-reset-close` | Compuesto PROG-AESTHETIC-RESET |
| [`EPIS2_CICA_L.md`](./EPIS2_CICA_L.md) | Loop por pantalla (CICA-L) |

---

## Adopción (2026-06-16)

| Elemento CICA | Estado |
|---------------|--------|
| Principio progresivo documentado | ✓ |
| 7 leyes en canon | ✓ |
| Checklist admisión pantalla | ✓ gate estático |
| Breadcrumb Ley 5 | ✓ MF-AEST-05 |
| `auditCicaScreen` scoring | ✓ MF-AEST-06 |
| CICA-L loop activo | ✓ [`EPIS2_CICA_L.md`](./EPIS2_CICA_L.md) · CICA-L-08 documentos |
| `resolveCicaVerdict` | ✓ MF-AEST-06 |
| `rankSectionsByClinicalUse` runtime | ◐ orden fijo en config |
| `resolveClinicalIntent` registry central | ◐ `clinicalIntent.ts` parcial |

---

*CICA alimenta el Clinical Layout Engine; no lo reemplaza.*
