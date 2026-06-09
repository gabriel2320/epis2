# EPIS2 — Canon de ejecución por olas

**Versión:** 1.0 · **Fecha:** 2026-06-04  
**Estado:** Canónico — gobierna agentes Cursor y planificación humana  
**Complementa:** [`EPIS2_COMPLETION_ROADMAP.md`](./EPIS2_COMPLETION_ROADMAP.md) · [`EPIS2_INVENTORY_WORKSPACE_MATRIX.md`](./EPIS2_INVENTORY_WORKSPACE_MATRIX.md)

> El mapa de 21 olas **no** es una cola lineal automática. Es un **sistema de precedencia, dependencias, microfases y gates**.

---

## 1. Definición de terminado (protección anti-ciclo infinito)

```text
EPIS2 Core completado  ≠  IDC 1–200 completados
```

**EPIS2 Core completado** cuando:

| Bloque | Olas | Contenido |
|--------|------|-----------|
| Plataforma | **0** | CI, migraciones, golden journeys, audit prod deps |
| Shell + consulta | **1A–1D**, **2**, **3** | Login → comando → episodio → documentar → indicar → firmar |
| Documentos mínimos | **6 parcial** | Motor documental, impresión Carta/A5, firma humana |
| Interop mínima | **transversal 0–3** | Modelo clínico FHIR-aligned + export bundle |
| Piloto institucional | **4**, **7**, **8** parcial | Recepción, IAAS base, admin/KPIs |
| Gates | **todos aplicables** | Funcional, datos, seguridad, clínico, IA, técnico |

Los IDC 101–200 y programas UCI/pabellón/facturación **no** bloquean declarar Core.

---

## 2. Vocabulario de planificación

| Término | Significado |
|---------|-------------|
| **Ola** | Agrupación arquitectónica de capacidades (precedencia, no secuencia rígida) |
| **Microfase (MF-XXX)** | Unidad ejecutable en una rama (`reports/epis2-mf-*.md`) |
| **Dependencia** | Condición necesaria (datos, seguridad, journey) antes de iniciar MF |
| **Gate** | Criterio objetivo para declarar una capacidad **Done** |
| **Milestone** | Subconjunto cerrable dentro de una ola (ej. **1A**, **1B**) |
| **Tramo** | Secuencia operacional recomendada (A→D) — ver §8 |

**Regla:**

> Las olas determinan **precedencia arquitectónica**, pero permiten **ejecución paralela** cuando no hay dependencia de datos, seguridad o journey.

**Precedencia mínima antes de Ola 2+:**

- autenticación · selección paciente · contexto episodio · persistencia SoT · firma humana · auditoría · permisos

---

## 3. Ola 1 — cuatro milestones (sin renumerar olas)

| Milestone | Dominio | Entregables | Estado EPIS2 (2026-06-04) |
|-----------|---------|-------------|---------------------------|
| **1A Shell clínico** | Login, RBAC, rail, comando, contexto usuario/paciente/episodio | `/login`, `/comando`, workspaces, sesión expirada | **Done** |
| **1B Consulta mínima** | Motivo, anamnesis, examen, dx, plan, borrador/firma | SOAP, `outpatient_visit` scrollspy | **Done** (Ola 2 extiende) |
| **1C Indicaciones y resultados** | Receta, lab, imagen, órdenes, bandeja, CDS | 19 blueprints (parcial), alertas demo | **Partial** |
| **1D IA asistida segura** | Borrador, resumen, RAG, trazabilidad, sin firma IA | API assist, golden V5 | **Partial** |

Ola 1 **cerrada operativamente** para shell (reporte `epis2-ola1-core-shell-closure.md`); **1C–1D** siguen abiertos como milestones, no bloquean Ola 3.

---

## 4. Dominios y workspaces (fronteras, no monolito)

Shell compartido (`clinical-shell`, `EpisAppShellLayout`). **Dominios separados** — compartir componentes/tipos; **no** compartir estado ni lógica de dominio indiscriminadamente.

| Dominio / paquete | Workspace rail | IDC dominante | Horizonte |
|-------------------|----------------|---------------|-----------|
| `clinical-shell` | `command` | — | Core |
| `patient-record` | transversal ficha M3 | 21–30 | Core |
| `ambulatory` | `ambulatory` | 31–40, 52–57, 61–64 | Core |
| `emergency` | **`emergency`** *(planificado)* | 101–110 | Post-core Tramo C |
| `inpatient` | extiende hospitalización | 41–50, ingreso, censo | Tramo C |
| `nursing` | `icu` / enfermería | 111–120 | Tramo C |
| `pharmacy` | tab farmacia | 54, 161–170 | Tramo B/C |
| `icu` | `icu` | 131–140 | Tramo D |
| `quality-iaas` | `quality_iaas` | 71–80, 141–150 | Tramo B/C |
| `admin-system` | `admin_system` | 81–90, 91–93 | Tramo B |

**Corrección aplicada:** Urgencias **≠** `ambulatory`. Ola 10 → workspace `emergency` (implementación pendiente; hoy IDC 101–102 no en rail ambulatorio).

**Hospitalización general** — dominio explícito **Tramo C** (no solo UCI):

- ingreso · censo/camas · evolución · órdenes · MAR · traslados · enfermería · balance · epicrisis · alta · conciliación

Reorganización olas enfermería: **Ola 11 → Hospitalización y enfermería**; UCI = extensión especializada (Ola 13).

---

## 5. Modelo de estado (cuatro campos — no mezclar con prioridad)

Sustituir columnas ambiguas «○ / DEFERRED» por:

| Campo | Valores |
|-------|---------|
| **Estado** | `Planned` · `Active` · `Blocked` · `Done` |
| **Prioridad** | `Critical` · `High` · `Medium` · `Low` |
| **Horizonte** | `Core` · `Post-core` · `Future` |
| **Decisión** | `Build` · `Integrate` · `Defer` · `Exclude` |

Ejemplo — Facturación Chile IDC 11–20: `Planned`, `Low`, `Future`, `Defer`.

Ejemplo — Conciliación IDC 165: `Done`, `High`, `Core`, `Build`.

**Matriz completa 1–200:** [`EPIS2_IDC_EXECUTION_MATRIX.md`](./EPIS2_IDC_EXECUTION_MATRIX.md) · JSON [`epis2-idc-execution-matrix.json`](./epis2-idc-execution-matrix.json) · regenerar con `node scripts/product/generate-idc-matrix.mjs`.

---

## 6. Seguridad transversal (Ola 0 ≠ seguridad terminada)

**Ola 0** cierra solo **baseline de plataforma**:

- CI · migraciones · audit deps · golden journeys · gates arquitectónicos

**Gobernanza continua** en **cada** ola/microfase:

- RBAC/ABAC · aislamiento org · auditoría · autoría · firma · versionado · acceso excepcional · datos sensibles · tests autorización negativa · logging sin PHI innecesario

Checklist obligatorio en reporte de cierre de MF: `reports/epis2-mf-*.md` § seguridad.

---

## 7. Interoperabilidad — núcleo vs avanzada

| Fase | Olas | Contenido |
|------|------|-----------|
| **Modelo interoperable** | **0–3** | Identificadores estables; entidades FHIR-aligned en SoT: Patient, Practitioner, Encounter, Condition, Observation, AllergyIntolerance, MedicationRequest, ServiceRequest, DiagnosticReport, DocumentReference, Provenance, AuditEvent |
| **Exportación mínima** | **1–3** | Bundle FHIR en frontera API (existente) — sin servidor FHIR completo |
| **Interop avanzada** | **20** renombrada | HL7 writeback, IoT, wearables, consola operacional — ver abajo |

**Ola 20** (nombre canónico): **Interoperabilidad avanzada, dispositivos e integración operacional**.

---

## 8. Ola 6 — desagregación documental

| Capa | Contenido | Inicio recomendado |
|------|-----------|-------------------|
| **6A Motor documental** | Plantillas, impresión Carta/A5, versionado borrador | Olas **1–3** (receta, certificado, interconsulta, epicrisis) |
| **6B Clínico-administrativo** | Informes, interconsulta, epicrisis | Core |
| **6C Consentimiento / jurídico** | Consentimientos, rechazo, voluntades | Post-core |
| **6D Firma y custodia** | Bloqueo, custodia, medico-legal | Tramo B+ |

---

## 9. Tramos operacionales (secuencia real recomendada)

### Tramo A — Producto clínico demostrable

```text
Ola 0 → 1A–1D → 2 → 3 → 6A parcial → FHIR export mínima
```

**Resultado:** consulta completa + documentación válida + firma humana.

### Tramo B — Piloto institucional ambulatorio

```text
Ola 4 → 7 → 8 → 16 parcial → 19 parcial
```

**Resultado:** recepción, IAAS base, admin, farmacia/conciliación, gobierno IA.

### Tramo C — Hospitalización y urgencias

```text
Hospitalización general → Enfermería/MAR → Urgencias (emergency) → Farmacia avanzada → IAAS avanzada → Calidad centinela
```

**Resultado:** deja de ser solo ambulatorio.

### Tramo D — Programas especializados

UCI · pabellón · anestesia · obstetricia · odontología · telemedicina · IoT · interop avanzada · facturación.

**Estado técnico (2026-06-07):** UCI demo IDC 41–50, 135 — ver `EPIS2_TRAMO_D_CLOSURE.md`.

### Tramo E — Pabellón y anestesia

```text
Workspace or → tabla quirúrgica → OMS → preanestesia → intraop → URPA → banco sangre → esterilización
```

**Estado técnico (2026-06-07):** scaffold demo IDC 151–160 — ver `EPIS2_TRAMO_E_CLOSURE.md`.

---

## 10. Gates por ola (ninguna ola cierra solo por pantallas)

| Gate | Pregunta |
|------|----------|
| **Funcional** | ¿Journey de extremo a extremo completable? |
| **Datos** | ¿SoT PostgreSQL sin mocks como verdad? ¿Migraciones reproducibles? |
| **Seguridad** | ¿Autorización negativa probada + auditoría? |
| **Clínico** | ¿Campos/estados revisados por profesional? |
| **Impresión** | ¿Documentos Carta/A5 según canon? |
| **Accesibilidad** | ¿Teclado, foco, contraste, labels? |
| **IA** | ¿IA no firma? ¿Trazabilidad? ¿Fallback sin LLM? |
| **Técnico** | `check` · `test` · `db:validate` · golden journey · CI |
| **M3-UI** | ¿Integrado a ECM3? ¿Tokens, estados, accesibilidad, print? — ver [`EPIS2_CLINICAL_MATERIAL3_CONCILIATION.md`](../design/EPIS2_CLINICAL_MATERIAL3_CONCILIATION.md) §11 |
| **Aceptación** | Signoff humano + evidencia |

---

## 11. Métricas de progreso (no solo % IDC)

Por ola/milestone reportar:

```text
Cobertura IDC:        implementados / comprometidos en la ola
Journeys aprobados:   aprobados / planificados
Gates técnicos:       aprobados / requeridos
Signoff clínico:      dominios con signoff / dominios implementados
Estado real:          Done | Active | Blocked — solo si los cuatro cuadrantes cuadran
```

Ejemplo Ola 2 (2026-06-04):

```text
Cobertura IDC:        8/10  (31–36, 39–40 parcial)
Journeys aprobados:   2/5   (ambulatorio + certificado demo)
Gates técnicos:       8/8   (check, test, db, golden, architecture)
Signoff clínico:      pendiente
Estado real:          Active — no cerrada clínicamente
```

---

## 12. Mapa olas 0–20 (referencia rápida)

| Ola | Dominio | Horizonte | Nota canon |
|-----|---------|-----------|------------|
| 0 | Plataforma, CI, baseline seguridad | Core | Baseline cerrable; seguridad transversal continúa |
| 1 | Núcleo (milestones 1A–1D) | Core | No monolito — ver §3 |
| 2 | Ambulatorio completo | Core | **Active** — scrollspy + certificado |
| 3 | Antecedentes, timeline, documentos | Core | Siguiente Tramo A |
| 4 | Recepción, agenda | Post-core | Tramo B |
| 5 | Facturación Chile | Future | **Defer** |
| 6 | Documentos (6A–6D) | Core / Post-core | Motor desde 1–3 |
| 7 | IAAS base | Post-core | |
| 8 | Jefatura, admin | Post-core | |
| 9 | IA ampliada, tele | Future | Tele **Defer** |
| 10 | **Urgencias** → `emergency` | Post-core | No en `ambulatory` |
| 11 | **Hospitalización + enfermería** | Post-core | Antes que UCI |
| 12 | APS | Post-core | |
| 13 | UCI | Future | Programa separado |
| 14 | IAAS avanzada | Post-core | |
| 15 | Pabellón | Post-core | Tramo E scaffold demo IDC 151–160 |
| 16 | Farmacia clínica | Post-core | Conciliación ✓ |
| 17 | Calidad, auditoría | Post-core | |
| 18 | Especialidades gráficas | Future | **Defer** |
| 19 | IA ops, GPU | Post-core | |
| 20 | Interop **avanzada**, IoT | Future | Núcleo FHIR en 0–3 |

---

## 13. Uso en Cursor / agentes

1. Leer este canon + `PRODUCT_INVARIANTS.md` antes de planificar MF.
2. Declarar **tramo**, **ola**, **milestone** y **dependencias** en reporte de sesión.
3. Tramos **A–E** cerrados técnicamente — no abrir tramo nuevo sin signoff o plan explícito.
4. Una rama funcional activa; gates §10 antes de marcar `Done`.
5. Actualizar métricas §11 en `reports/` al cierre · higiene: `quality:tramos-hygiene-gate`.

---

## 14. Programa UX THREE-MODES (EPIS2-13 / Fase E plan global)

**No confundir** con Tramo E (pabellón §9). Es orquestación transversal Command · Classic · Dashboard.

| Campo | Valor |
|-------|-------|
| **Fase roadmap** | EPIS2-13 |
| **Fase plan global** | Fase E — `EPIS2_GLOBAL_DEV_PLAN.md` |
| **Ola clínica** | Transversal — no bloquea Tramo A–D |
| **Milestone 1A+** | Extiende shell sin cambiar home |
| **Estado (2026-06-04)** | MF-01/02 **Done** · MF-03…07 **Ready** |

```text
MF-CLASSIC-EMR-MD3 ──┐
MF-DASHBOARD-MD3 ────┼──► MF-THREE-MODES-01 (orquestación) ──► MF-02 (consolidación modes/)
                       │                                              │
                       └──────────────────────────────────────────────┘
                                         MF-03…07 (seguridad + E2E)
```

**Gates:** `quality:three-modes-gate` · `QUALITY_GATES.md` § EPIS2-13.

**Artefactos:** `apps/web/src/modes/` · `docs/architecture/EPIS2_MODES_LAYER.md`.

---

## Referencias

- Árbol reconciliado: [`EPIS2_RECONCILED_NAVIGATION_TREE.md`](../architecture/EPIS2_RECONCILED_NAVIGATION_TREE.md)
- Workspaces MD3: [`EPIS2_ROLE_WORKSPACES_M3.md`](../design/EPIS2_ROLE_WORKSPACES_M3.md)
- Journeys: [`GOLDEN_CLINICAL_JOURNEY.md`](../quality/GOLDEN_CLINICAL_JOURNEY.md)
- Tres modos UX: [`EPIS2_THREE_MODES_DEV_PLAN.md`](./EPIS2_THREE_MODES_DEV_PLAN.md) · [`EPIS2_MODES_LAYER.md`](../architecture/EPIS2_MODES_LAYER.md)
- Reporte revisión: [`reports/epis2-wave-execution-canon-v1.md`](../../reports/epis2-wave-execution-canon-v1.md)
