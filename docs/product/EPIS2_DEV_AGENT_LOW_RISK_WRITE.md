# EPIS2 — Escritura de bajo riesgo (agentes Ollama dev)

**Versión:** 1.0 · **Fecha:** 2026-06-04

---

## Principio

Los agentes Ollama de **desarrollo** pueden **proponer y aplicar** cambios acotados en paths de bajo riesgo.  
Nunca sustituyen revisión humana ni gates. **Sin auto-commit.**

Capa clínica producto (`dev:ai`, borradores) sigue prohibida para escritura automática.

---

## Tier L0 — auto-aplicable con `--apply`

| Path | Acciones | Ejemplos |
|------|----------|----------|
| `reports/**` | `create`, `append` | Reportes de sesión, cierre MF |
| `docs/product/**` | `create`, `append` | Plan global, roadmap, inventarios |
| `docs/design/**` | `create`, `append` | Notas de diseño no canon |
| `scripts/dev-agent/**` | `create` | Helpers dev (no sobrescribir orchestrate sin humano) |

## Tier L1 — solo en plan (aplicar manual o tras review)

| Path | Notas |
|------|-------|
| `scripts/quality/validate-*-gate.mjs` | Tokens estáticos; revisar diff |
| `packages/design-system/src/copy/es.ts` | Solo microcopy; sin términos técnicos en UI clínica |
| `**/*.test.{ts,tsx,mjs}` | Tests; ejecutar `npm run test` tras aplicar |

## Prohibido (Tier X)

- `database/migrations/**`
- `apps/api/**` · `services/local-ai/**` (assist clínico)
- `apps/web/src/pages/**` · `packages/command-registry/**` · `packages/clinical-forms/**`
- `docs/product/PRODUCT_INVARIANTS.md` · `docs/PRODUCT_CANON.md`
- Import EPIS · OpenMRS · Carbon · auto-aprobación clínica

---

## Comandos

```bash
npm run dev:agent:ollama-write              # plan JSON (dry-run)
npm run dev:agent:ollama-write -- --apply     # aplica solo Tier L0
npm run dev:agent:ollama-write -- --document  # foco reporte sesión
```

Salida: `reports/dev-agent-ollama-write-plan.json`

---

## Flujo

1. `npm run dev:session -- --ollama` (plan opcional)
2. `npm run dev:agent:ollama-write` → revisar plan
3. Humano aprueba → `--apply` (solo parches L0)
4. Completar L1 manualmente si el plan los incluye
5. `npm run dev:agent:close` + commit explícito humano

---

## Validación automática

Cada parche pasa:

- Allowlist de path (Tier L0/L1)
- Patrones prohibidos en contenido (SoT SQL, auto-approve, legacy)
- Schema Zod `requiresHumanReview: true`
- Post-apply: `npm run check` (fallo revierte responsabilidad al humano)

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
