# EPIS2 — Visión de producto (agentes y equipos)

**Versión:** 2.0 · **Fecha:** 2026-06-15  
**Programa:** PROG-FICHA-FIRST ✓ (MF-FF-01…15) · **MF origen:** MF-FF-05  
**Canon detallado:** [`PRODUCT_CANON.md`](../PRODUCT_CANON.md) · [`SCOPE_V1.md`](../SCOPE_V1.md) · [`NON_GOALS.md`](../NON_GOALS.md)

---

## Qué es EPIS2

EPIS2 es una **plataforma de ficha médica electrónica** local-first, clínica y administrativa en roadmap, con **doble representación sincronizada** del mismo dato:

- **Modo electrónico** — Material Design 3: rápido, modular, formularios, tablas, flujos.
- **Modo papel** — documento imprimible (carta, A5 cuando corresponda): evolución, epicrisis, receta, consentimientos.

Ambas vistas miran **PostgreSQL** como fuente de verdad. Una **barra de comandos transversal** (palette Ctrl+K) acompaña el workspace; la IA **propone borradores**; el humano **revisa y aprueba**. Nada se firma ni ejecuta automáticamente.

No es migración de OpenMRS, overlay EPIS legacy, ni experimento de IA disfrazado de ficha.

### Frases de producto

| Audiencia | Definición |
|-----------|------------|
| **Clínica** | Ficha que combina velocidad de app moderna con claridad médico-legal del papel, asistida por IA bajo control humano. |
| **Estratégica** | No reemplaza al médico; reduce fricción, ordena información y acelera documentación. |
| **Técnica** | Plataforma ficha-first, dual MD3/Papel, command bar transversal, SoT PostgreSQL, IA opcional vía frontera `@epis2/ai-client`, satélites por contrato (MedRepo, Evolab). |

### Frase guía (diseño diario)

> **El comando acompaña al médico; la ficha lo orienta.**

Pregunta de diseño: *¿Qué necesitas hacer con este paciente?*

### Regla de oro dual UI

| Modo | Rol |
|------|-----|
| **Electrónico** | Captura, organiza, valida, navega. |
| **Papel** | Formaliza, imprime, continuidad médico-legal. |

Misma ficha · dos representaciones · una SoT.

---

## Jerarquía de la plataforma

Orden estricto — evita mezclar producto, laboratorio y desarrollo:

```text
Nivel 1 — EPIS2 Clinical Core     → debe funcionar solo (sin IA)
Nivel 2 — Command Bar + IA        → acelera y asiste
Nivel 3 — Modo papel              → formaliza e imprime
Nivel 4 — Repositorio clínico     → conocimiento externo (MedRepo)
Nivel 5 — Simulador de casos      → datos sintéticos (case-intel, fixtures)
Nivel 6 — Evolab                  → prueba y mejora el software
Nivel 7 — Agentes de programación → desarrollan EPIS2; no son producto clínico
```

Satélites: ver [`EPIS2_TRIADA_REPOS.md`](./EPIS2_TRIADA_REPOS.md). Integración solo por **contratos exportados** (JSON, YAML, HTTP).

---

## Anatomía de la experiencia

```text
Home primaria     → Censo clínico (/espacio/buscar-paciente)
Barra transversal → EpisUniversalCommandBar + palette (Ctrl+K)
Workspace         → Ficha dual (traditional | paper)
Dashboard         → Secundario (/epis2/dashboard) — nunca home
/comando          → Redirect compat (bookmarks legacy)
```

| Tier nav | Ruta | Rol |
|----------|------|-----|
| **primary** | `/espacio/buscar-paciente` | Punto de entrada clínico |
| **secondary** | `/epis2/dashboard/*` | Mi trabajo, KPIs, grillas |
| **compat** | `/comando` | Compatibilidad; redirige al censo |

Flujo canónico: `Login → Censo → Ficha → documento → borrador → aprobar → imprimir` — [`GOLDEN_CLINICAL_JOURNEY.md`](../quality/GOLDEN_CLINICAL_JOURNEY.md).

---

## Clinical Core (north star)

Dominio objetivo de la ficha integral. **No todo está en MVP** — ver matriz abajo.

Pacientes · hospitalizaciones · ambulatorio · evoluciones · indicaciones · enfermería · farmacia · laboratorio · imagenología · interconsultas · procedimientos · epicrisis · recetas · certificados · agenda · cuenta clínica · auditoría · usuarios/roles.

**Regla:** el Core no depende de experimentos de IA, simuladores ni agentes evolutivos. Debe ser **una buena ficha médica con la IA apagada**.

---

## Matriz dominio × estado (2026-06-15)

| Dominio | Visión (north star) | MVP / demo hoy | Roadmap |
|---------|---------------------|----------------|---------|
| Pacientes, login, roles | ✓ | ✓ DEMO sintético | Producción + RLS |
| Censo + ficha dual MD3/papel | ✓ | ✓ PROG-FICHA-FIRST | Sincronización campo a campo por blueprint |
| Evolución, epicrisis, receta, lab | ✓ | ✓ blueprints + aprobación | Más especialidades |
| Barra de comandos + registry | ✓ | ✓ command-registry | Más intents clínicos/admin |
| Borrador → aprobación → auditoría | ✓ | ✓ | Trazabilidad extendida |
| CDS / alertas clínicas | ✓ | ✓ hooks demo + safetyNotes | CDS silencioso + MedRepo curado |
| IA asistiva (5 niveles) | ✓ | ✓ parcial (ver abajo) | Provider interface completo |
| Export FHIR frontera | ✓ | ✓ PROG-STRENGTHEN | Perfiles Chile |
| Hospitalización completa | ✓ | ◐ slices demo | Ola clínica futura |
| Ambulatorio completo | ✓ | ◐ | Vertical ambulatorio |
| Enfermería / kardex | ✓ | ✗ [`NON_GOALS`](../NON_GOALS.md) | Post-MVP |
| Farmacia dispensación | ✓ | ✗ | Post-MVP |
| Imagenología / interconsulta | ✓ | ◐ blueprints EPIS donante | Tramos clínicos |
| Facturación / cuenta clínica | ✓ | ✗ | Administrativo futuro |
| MedRepo consumo | ✓ | ✓ loader read-only (MF-FF-14) | Pack curado sin PHI |
| Evolab / case-intel | ✓ | ✓ bridge + SIM | Escenarios ampliados |

Leyenda: ✓ entregado · ◐ parcial · ✗ fuera de alcance actual.

---

## IA — cinco niveles (no una sola cosa)

| Nivel | Función | EPIS2 hoy | Frontera |
|-------|---------|-----------|----------|
| **1 — Comandos** | Intención + slots (paciente, fármaco, formulario…) | Command registry, assist barra | `@epis2/command-registry` |
| **2 — Documental** | Borradores evolución, epicrisis, receta… | `assist/draft`, live templates, textbox | Siempre borrador |
| **3 — Navegación clínica** | Preguntas sobre la ficha | RAG, summary 24h, longitudinal demo | Read-only |
| **4 — Seguridad clínica** | Alergias, interacciones, pendientes — **advierte, no decide** | CDS hooks, alerts, safetyNotes | `@epis2/clinical-domain` |
| **5 — Conocimiento externo** | Guías, protocolos, PDFs curados | MedRepo loader + RAG | Distinto de dato paciente |

**Tripartición obligatoria en UI y contratos:**

1. Dato de la ficha del paciente  
2. Conocimiento médico general (con fuente)  
3. Sugerencia generada por IA (requiere revisión humana)

**Seguridad IA:** sugerir, resumir, buscar, clasificar, redactar — **no** firmar, aprobar, borrar clínica, ejecutar órdenes sin confirmación.

**Providers:** Ollama local hoy; frontera `@epis2/ai-client` + API hacia `local-ai` (OpenAI demo opcional). Objetivo: interfaz de provider intercambiable, no acoplamiento directo a un vendor.

---

## Lo que EPIS2 no es

| Prohibido | Motivo |
|-----------|--------|
| Dashboard como home | Censo-first |
| IA que aprueba o firma | SoT humano + PostgreSQL |
| Segundo Command/Form Registry | Un registry por dominio |
| Copia masiva desde `../Epis` | Solo import con manifest |
| OpenMRS / Carbon / O3 como base | Producto nuevo |
| HIS integral prometido como ya entregado | MVP acotado — matriz arriba |
| MedRepo o Evolab como SoT clínico | Satélites read-only / prueba |

---

## Capas técnicas (repo EPIS2)

| Capa | Responsabilidad |
|------|-----------------|
| `apps/web` | UI clínica; `@epis2/ai-client` (no `@epis2/local-ai`) |
| `packages/clinical-forms` | Form Registry (blueprints) |
| `packages/command-registry` | Command Registry (intents) |
| `packages/clinical-productivity` | Grillas, acciones probables |
| `apps/api` + PostgreSQL | SoT, borradores, auditoría, CDS, MedRepo loader |
| `services/local-ai` | Runtime IA asistiva (opcional) |
| `packages/ai-client` | Cliente HTTP IA para web |
| **EPIS2-MedRepo** (repo hermano) | Knowledge packs exportados |
| **epis2-evolab** (repo hermano) | Escenarios, findings, Playwright |

---

## Verticales prioritarias (construir primero)

Antes de “todo el HIS”, cerrar tres columnas:

**Hospitalizado (demo):** paciente → ingreso → evolución → indicaciones → exámenes → medicamentos → epicrisis → alta → impresión → auditoría.

**Ambulatorio:** paciente → consulta → diagnóstico → receta → órdenes → certificado → control → impresión.

**IA mínima:** comando → intención → formulario → borrador → revisión → aprobación → registro auditado (degradación sin Ollama).

---

## Principio de experiencia

Debe sentirse como: *trabajar en una ficha tradicional, con velocidad moderna y ayuda silenciosa de IA*.

No debe sentirse como: *un experimento de IA con formularios adjuntos*.

---

## Para agentes de desarrollo

1. Declarar microfase (MF-*) con allowlist antes de editar.
2. Leer [`AGENT_CONTEXT_MINIMAL.md`](../AGENT_CONTEXT_MINIMAL.md).
3. Respetar ledgers; no auto-iniciar MF READY salvo petición explícita.
4. Cerrar con gate del MF + reporte en `reports/`.
5. Detenerse si contradice [`PRODUCT_INVARIANTS.md`](PRODUCT_INVARIANTS.md).

**Frase de gates:** *Los errores de EPIS no son recuerdos: son gates de EPIS2.*

---

## Evolución reciente (2026)

| Programa | Estado |
|----------|--------|
| **PROG-FICHA-FIRST** | ✓ MF-FF-01…15 · waves 1–5 · [`archive/2026-06/epis2-prog-ficha-first-close-2026.md`](../../reports/archive/2026-06/epis2-prog-ficha-first-close-2026.md) |
| **PROG-STRENGTHEN** | ✓ 23/23 (interop FHIR, HL7, questionnaire export…) |
| **PROG-CDS-UX** | ✓ MF-CU-01…04 |
| **Tríada F6** | ✓ contratos MedRepo / Evolab / case-intel |

Siguiente dirección producto (no iniciar sin MF autorizada): verticales clínico-administrativos de la matriz, curación MedRepo, provenance visible en UI IA.
