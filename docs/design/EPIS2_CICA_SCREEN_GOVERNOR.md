# EPIS2 — CICA-SG

**Gobernador de Pantallas por Intención Clínica**  
**CICA-SG** · *Clinical Intent Composition Algorithm: Screen Governor*  
**Versión:** 1.0 · **Fecha:** 2026-06-11  
**Estado:** Norma canon (L0) · **Programa:** PROG-AESTHETIC-RESET

**Canon base:** [`EPIS2_CICA.md`](./EPIS2_CICA.md) · [`EPIS2_CICA_L.md`](./EPIS2_CICA_L.md) · [`EPIS2_CLINICAL_SCREEN_MAP.md`](./EPIS2_CLINICAL_SCREEN_MAP.md)

> **Frase guía:** EPIS2 no crea pantallas porque hay una función nueva. Crea pantallas solo cuando aparece una intención clínica nueva que merece foco, navegación propia y estado clínico independiente — y solo si eso **reduce** complejidad.

---

## Misión

CICA-SG decide **dónde vive** una necesidad clínica nueva:

```text
inline-section · tab · drawer · modal · full-screen-route · dedicated-mode · reject
```

No compone la pantalla (eso es **CICA-L**). No mide calidad post-implementación (eso es **`auditCicaScreen`**).

---

## Tres capas (no mezclar)

| Capa | Pregunta | Artefacto |
|------|----------|-----------|
| **CICA-SG** | ¿Merece existir? ¿En qué contenedor? | `proposeEpisScreen()` · ledger `reports/cica-sg/` |
| **CICA-L** | ¿Cómo se compone una pantalla existente? | `reports/cica-l/` · `data-cica-composition` |
| **auditCicaScreen** | ¿Quedó bien hecha? | Score composición ≥ 90 GO |

| Score | Nombre | Dirección | Uso |
|-------|--------|-----------|-----|
| **Admission Score** | `calculateAdmissionScore()` | 0→100, más alto = más foco propio | Admisión CICA-SG |
| **Composition Score** | `auditCicaScreen()` | 100→0, más alto = mejor | CICA-L Fase F |

---

## Contenedores válidos

```text
1. inline-section       → dato breve dentro de pantalla actual
2. tab                  → dimensión estable de la ficha
3. tab-composed         → tab con 1 sección dominante (CICA-L clásico)
4. drawer               → apoyo contextual sin salir
5. modal                → confirmación breve o transición de estado crítica
6. full-screen-route    → documento / formulario clínico
7. dedicated-mode       → metáfora completa distinta (Modo Papel)
8. reject-duplicate     → reutilizar pantalla existente
```

**Modo clásico:** preferir `inline-section`, `tab`, `tab-composed`, `full-screen-route`, `dedicated-mode`. Evitar `drawer` salvo wireframe explícito.

---

## Flujo obligatorio

```text
Nueva necesidad clínica
        │
        ▼
¿Congelamiento clínico activo sin microfase?
        │ Sí → REJECT
        ▼
Completar Screen Need Request (reports/cica-sg/)
        │
        ▼
¿Duplicado en registry / screen map?
        │ Sí → reject-duplicate (reutilizar)
        ▼
calculateAdmissionScore()
        │
        ▼
decideContainer() + overrides
        │
        ▼
¿Cumple 7 leyes CICA + checklist admisión?
        │ No → REJECT / simplificar
        ▼
APPROVE → registrar decisión → CICA-L o implementación mínima
        │
        ▼
auditCicaScreen() post-implementación
```

---

## Checklist de admisión (hereda CICA)

Toda propuesta debe responder **sí** a las 7 preguntas de [`EPIS2_CICA.md`](./EPIS2_CICA.md) § Checklist y a `CICA_SCREEN_ADMISSION_CHECKLIST` en `clinicalIntent.ts`.

Además, CICA-SG exige **Screen Need Request** documentado antes de código.

---

## Screen Admission Score

```text
Score =
  +25  intención clínica distinta (hasDistinctClinicalIntent)
  +20  acción primaria definida
  +20  ciclo documental (draft | approved | signed | audited)
  +15  dataComplexity === 'high'
  + 8  dataComplexity === 'medium'
  +10  riskLevel === 'high'
  + 5  riskLevel === 'medium'
  +10  temporalNavigation === true
  +10  needsPrint === true  (solo si también temporalNavigation)
  −20  duplicado en registry / screen map
  −10  addsCognitiveLoad (ver definición abajo)

Clamp: 0–100
```

### `addsCognitiveLoad` (operativo)

Marcar `true` si la propuesta agrega **cualquiera** de:

- un tab nuevo en ficha clásica
- un subnav con >1 sección visible en un tab
- una segunda acción primaria visible
- una ruta `/espacio/*` sin retorno Ley 5
- más de 3 acciones visibles totales

---

## Umbrales → contenedor candidato

```text
 0–29   → inline-section
30–44   → drawer (modal si risk≥medium && !needsSpace)
45–59   → tab  (modo clásico: preferir tab-composed si tab existente)
60–79   → full-screen-route
80–100  → ver overrides (no dedicated automático)
```

---

## Overrides (mandatory — corrigen el score)

Estas reglas **prevalecen** sobre el umbral:

| Condición | Contenedor |
|-----------|------------|
| Duplicado en `EPIS2_FORM_SCREEN_TREE` o Screen Map | `reject-duplicate` |
| `temporalNavigation && needsPrint` | `dedicated-mode` |
| `documentLifecycle` ∈ draft/approved/signed + `needsLargeTextArea` | `full-screen-route` (cap; nunca dedicated solo por score alto) |
| `riskLevel === 'high'` + `!needsSpace` + transición estado | `modal` |
| Score ≥ 80 **sin** temporal+print | `full-screen-route` (cap) |
| Sin `primaryAction` y contenedor ≠ inline/modal | **REJECT** |
| Congelamiento clínico sin MF en `microphase-ledger.json` | **REJECT** |
| Mezcla >1 intención clínica | **REJECT** |

### Epicrisis vs Modo Papel

| Necesidad | Score típico | Override | Contenedor |
|-----------|--------------|----------|------------|
| Epicrisis / alta | 75–85 | draft + textarea | `full-screen-route` → `/espacio/epicrisis` |
| Modo papel | 85–95 | temporal + print | `dedicated-mode` → `/espacio/ficha/papel` |

---

## Reglas de rechazo automático

```text
 1. Duplica pantalla existente.
 2. No tiene intención clínica propia.
 3. No tiene acción primaria (salvo inline/modal justificado).
 4. Mezcla más de una intención.
 5. Oculta identidad del paciente (Ley 1).
 6. Oculta estado borrador/demo/IA donde corresponde.
 7. Crea más de una acción primaria visible (Ley 3).
 8. No tiene ruta de retorno (Ley 5).
 9. Aumenta carga cognitiva sin retirar elementos.
10. Requiere schema/migración/IA producto sin microfase autorizada.
11. Propone segundo Command/Form Registry temporal.
12. Contradice PRODUCT_INVARIANTS.md.
```

---

## Tabla práctica

| Necesidad | Contenedor |
|-----------|------------|
| Dato breve (alergias, último crítico) | `inline-section` |
| Lista estable de ficha (evoluciones, exámenes) | `tab` / `tab-composed` |
| Apoyo sin salir (detalle breve, IA) | `drawer` |
| Confirmar aprobación / descarte | `modal` |
| Escribir documento clínico | `full-screen-route` |
| Leer hoja por fecha + imprimir | `dedicated-mode` |
| Duplicar existente | `reject-duplicate` |

---

## Registro — fuentes de verdad (no duplicar)

| Fuente | Qué registra |
|--------|--------------|
| `packages/clinical-forms` → `EPIS2_FORM_SCREEN_TREE` | Rutas `/espacio/*` · blueprints |
| `apps/web/src/clinical/clinicalIntent.ts` | Niveles CICA · intents por tab/form |
| `docs/design/EPIS2_CLINICAL_SCREEN_MAP.md` | Árbol humano |
| `apps/web/src/quality/uiDensityRules.ts` → `EPIS_SCREEN_REGISTRY` | Kind · scaffold · densidad |
| `reports/cica-sg/*.md` | Decisiones de admisión documentadas |

**Prohibido:** cuarto registry paralelo sin derivar de las fuentes anteriores.

Rutas EPIS2: **`/espacio/*?patientId=`** — no introducir `/pacientes/:id/` sin ADR.

---

## Contrato `EpisScreenDefinition` (cuando APPROVE)

Generado solo si `verdict === 'APPROVE'` y contenedor ∈ `{ full-screen-route, dedicated-mode, tab }`:

```ts
type EpisScreenDefinition = {
  id: string;
  route: string;
  title: string;
  clinicalIntent: string;
  parent: string;
  patientScoped: boolean;
  container: ScreenContainerDecision;
  layoutProfile:
    | 'census'
    | 'classic-chart'
    | 'clinical-form'
    | 'paper-mode'
    | 'results'
    | 'documents'
    | 'audit';
  primaryAction: { id: string; label: string; risk: 'low' | 'medium' | 'high' };
  secondaryActions: Array<{ id: string; label: string; placement: 'visible' | 'overflow' }>;
  requiredSignals: Array<
    'patient-identity' | 'demo-state' | 'draft-status' | 'ai-state' | 'back-to-chart' | 'audit-trail'
  >;
  gates: string[];
};
```

Implementación: `packages/epis2-ui/src/screen-governor/` (`proposeEpisScreen()` + tests).

---

## `inferLayoutProfile` (referencia)

```ts
if (container === 'dedicated-mode' && needsPrint) return 'paper-mode';
if (needsLargeTextArea || documentLifecycle === 'draft') return 'clinical-form';
if (dataComplexity === 'high' && container === 'tab') return 'classic-chart';
if (needsAuditTrail) return 'audit';
return 'classic-chart';
```

---

## Integración con agentes

```text
npm run dev:session
  → nueva necesidad detectada
  → agente completa reports/cica-sg/<slug>.md desde _TEMPLATE.md
  → (futuro) proposeEpisScreen() → pegar verdict en ledger
  → humano aprueba
  → si full-screen-route / tab nuevo: microfase + CICA-L wireframe
  → implementación mínima + gates
```

JSON agente (futuro):

```json
{
  "verdict": "APPROVE | REJECT",
  "container": "full-screen-route",
  "admissionScore": 72,
  "reuseScreenId": null,
  "requiresHumanReview": true
}
```

---

## Gates (roadmap)

| Gate | Estado | Valida |
|------|--------|--------|
| `quality:cica-screen-admission-gate` | ✓ | Canon CICA + checklist |
| `quality:cica-screen-governor-gate` | ✓ | Canon SG + tests + proposeEpisScreen |
| `quality:cica-screen-inventory-gate` | ✓ | CICA-L ledger activo |

---

## Ejemplos retro-validados (CICA-L)

| Pantalla | Contenedor | Ruta |
|----------|------------|------|
| Resumen | `tab-composed` | `/espacio/ficha` tab summary |
| Evoluciones | `tab-composed` | tab evolutions |
| Nueva evolución | `full-screen-route` | `/espacio/evolucion` |
| Indicaciones / Exámenes / Docs | `tab-composed` | tabs ficha |
| Medicamentos | `tab-composed` | tab Más |
| Epicrisis | `full-screen-route` | `/espacio/epicrisis` |
| Modo papel | `dedicated-mode` | `/espacio/ficha/papel` |
| Alergias | `inline-section` | PatientIdentityBand / resumen |

---

## Próximo paso de implementación

```text
1. packages/epis2-ui/src/screen-governor/cicaScreenTypes.ts
2. cicaScreenScoring.ts + cicaScreenGovernor.test.ts (10 casos fijos)
3. quality:cica-screen-governor-gate (canon + tests)
4. Derivar EpisScreenDefinition desde FORM_SCREEN_TREE (sin registry paralelo)
```

Tramo recomendado: **después de CICA-L-11 Auditoría**.
