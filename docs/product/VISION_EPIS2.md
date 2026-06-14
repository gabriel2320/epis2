# EPIS2 — Visión de producto (agentes y equipos)

**Versión:** 1.0 · **Fecha:** 2026-06-15  
**Programa:** PROG-FICHA-FIRST · **MF:** MF-FF-05  
**Canon detallado:** [`PRODUCT_CANON.md`](../PRODUCT_CANON.md) · [`EPIS2_FICHA_FIRST_DEV_PLAN.md`](EPIS2_FICHA_FIRST_DEV_PLAN.md)

---

## Qué es EPIS2

EPIS2 es una **aplicación clínica ficha-first** con barra de comando transversal. No es migración de OpenMRS ni overlay sobre EPIS legacy.

El profesional:

1. Inicia sesión.
2. Entra al **censo clínico** (`/espacio/buscar-paciente`) con barra de comando siempre visible.
3. Busca o fija un paciente.
4. Trabaja en **ficha dual** (electrónica tradicional | ficha papel).
5. Genera documentos mínimos (evolución, receta, etc.).
6. La IA local **propone borradores**; el humano **revisa y aprueba**.
7. Lo aprobado queda versionado en PostgreSQL.

Nada se firma ni ejecuta automáticamente.

---

## Frase guía

> **El comando acompaña al médico; la ficha lo orienta.**

Pregunta de diseño: *¿Qué necesitas hacer con este paciente?*

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

---

## Flujo canónico (Golden journey)

```text
Login → Censo → Ficha → documento → borrador → aprobar → imprimir
```

Ver [`GOLDEN_CLINICAL_JOURNEY.md`](../quality/GOLDEN_CLINICAL_JOURNEY.md).

---

## Lo que EPIS2 no es

| Prohibido | Motivo |
|-----------|--------|
| Dashboard como home | Invariante #6 — censo-first |
| IA que aprueba o firma | SoT humano + PostgreSQL |
| Segundo Command/Form Registry | Un registry por dominio |
| Copia masiva desde `../Epis` | Solo import con manifest |
| OpenMRS / Carbon / O3 como base | Producto nuevo |

---

## Capas técnicas (resumen)

| Capa | Responsabilidad |
|------|-----------------|
| `apps/web` | UI clínica; no importa servicios runtime directos |
| `packages/clinical-forms` | Form Registry (blueprints) |
| `packages/command-registry` | Command Registry (intents) |
| `apps/api` + PostgreSQL | SoT, borradores, auditoría |
| `services/local-ai` | IA asistiva opcional (app funciona sin Ollama) |

---

## Para agentes de desarrollo

1. Declarar microfase (MF-*) con allowlist antes de editar.
2. Leer [`AGENT_CONTEXT_MINIMAL.md`](../AGENT_CONTEXT_MINIMAL.md) — no todo el monorepo.
3. Respetar ledgers (`ficha-first-ledger.json`, etc.); no auto-iniciar MF READY.
4. Cerrar con gate del MF + reporte en `reports/`.
5. Detenerse si contradice [`PRODUCT_INVARIANTS.md`](PRODUCT_INVARIANTS.md).

**Frase de gates:** *Los errores de EPIS no son recuerdos: son gates de EPIS2.*

---

## Evolución (2026)

| Wave FICHA-FIRST | Foco |
|------------------|------|
| 1 ✓ | Activación censo-first, ClinicalShell |
| 2 ✓ | Canon + nav tiers + visión agente |
| 3 | Acciones probables, live templates, layout evolución, receta A5 |
| 4 | Frontera IA (`@epis2/ai-client`) |
| 5 | MedRepo loader + aliases quality |

Programa interop cerrado: **PROG-STRENGTHEN** 23/23 ✓.
