# EPIS2 — Congelamiento de consolidación

**Versión:** 1.0 · **Vigente desde:** 2026-06-15 · **Programa:** PROG-CONSOLIDATE (ola 2)

Brújula: [`EPIS2_CURRENT_STATE.md`](EPIS2_CURRENT_STATE.md) · Plan ola 2: [`product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md`](product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md)

---

## Declaración

EPIS2 está en **fase de consolidación**, no de expansión clínica.

**No se agregan features clínicas nuevas** salvo microfase MF-* autorizada explícitamente por el operador.

---

## Permitido

- Reducir complejidad (scripts, gates, docs, CI)
- Endurecer configuración y seguridad (auth, RLS, HTTP, rate limit)
- Separar fronteras lógicas (core · labs · tools · archive)
- Corregir CI y dependencias de build
- Documentar estado real (pre-piloto sintético)
- Archivar reportes históricos sin borrar evidencia

---

## Prohibido

- Nuevo home, dashboard como entrada, modos UI nuevos
- Segundo Command Registry o Form Registry
- Nuevos agentes IA de producto
- Copia masiva desde `../Epis` sin `legacy-import-manifest.json`
- `apps/web` importando `@epis2/local-ai` o `labs/*`
- Mega-PR mezclando movimiento de carpetas + auth + CI
- PHI real o pacientes no sintéticos en repo o tests

---

## Gates mínimos por tipo de PR

| Tipo de cambio | Gate iteración | Gate pre-merge |
|----------------|----------------|----------------|
| Docs / gobierno | `npm run quality:fast` | `npm run check` |
| Config / auth / API | `npm run quality:clinical` | `npm run check` + `npm run db:validate` |
| Cierre tramo consolidación | — | `npm run quality:required` |

---

## Criterio de éxito (base seria)

```text
apps/ + packages/ = producto
services/ = runtime (local-ai, case-intel, drug-intel)
tools/ + scripts/ = desarrollo y gates
reports/archive/ = historia
Satélites (Evolab, MedRepo) = HTTP/JSON, no imports cruzados
Production no arranca con auth demo ni RLS off
```

---

## Referencias

- [`PRODUCT_INVARIANTS.md`](product/PRODUCT_INVARIANTS.md)
- [`PRODUCT_CANON.md`](PRODUCT_CANON.md)
- [`epis2-prog-consolidate-close-2026.md`](../reports/epis2-prog-consolidate-close-2026.md) — ola 1 (scripts)
