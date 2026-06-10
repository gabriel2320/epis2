# ADR-001 — Versionado de la API HTTP

**Estado:** Aceptado · 2026-06-10 · **MF:** MF-NORM-303 (Hilo NORM, plan norma full stack)

## Contexto

La norma full stack (R-34) pide versionado explícito de API (`/v1`). EPIS2 expone hoy `/api/*`
sin versión, con un único consumidor (apps/web del mismo monorepo, mismo deploy) y contratos
compartidos vía `packages/contracts` (Zod). No existe ningún consumidor externo ni despliegue
público; el producto está en fase laboratorio/demo.

## Opciones evaluadas

1. **Prefijo URL `/api/v1/*` ahora** — rompe todas las rutas actuales (web, E2E, helpers, docs)
   sin ganar nada: no hay segundo consumidor que requiera convivencia de versiones.
2. **Header de versión (`Accept-Version`)** — misma conclusión; añade complejidad de routing sin
   demanda real.
3. **Diferir: monorepo + contracts como contrato vivo; versionar al primer consumidor externo** —
   los breaking changes se detectan en CI (typecheck + tests + E2E del mismo repo).

## Decisión

**Opción 3 — diferir.** `/api/*` permanece sin versión mientras el único consumidor sea la web
del monorepo. El versionado URL (`/api/v1`) se introduce como **gate obligatorio antes del primer
despliegue con consumidor externo** (integración HL7/FHIR de terceros, app móvil, etc.).

## Consecuencias

- Sin churn de rutas ahora; contratos Zod en `packages/contracts` siguen siendo la fuente de compatibilidad.
- La spec OpenAPI (MF-NORM-301) se genera contra las rutas actuales y declarará `version: 0.x`.
- Quien incorpore el primer consumidor externo debe abrir microfase de versionado (checklist en
  `EPIS2_NORMA_FULLSTACK_PLAN.md` §N3) — el gate queda registrado en el tablero al cerrar N3.
