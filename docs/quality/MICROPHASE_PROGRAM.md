# EPIS2 — Programa de microfases (post-MVP)

**Versión ledger:** 1.0.0 · **Auditoría base:** `reports/epis2-comprehensive-audit-2026-06-05.md`

## Fuente de verdad

| Artefacto | Uso |
|-----------|-----|
| **`docs/quality/microphase-ledger.json`** | Estado canónico (BLOCKED / READY / IN_PROGRESS / DONE) |
| `docs/quality/MICROPHASE_LEDGER_CANONICAL.md` | Puntero humano a este programa |
| `reports/epis2-mf-XXX-*.md` | Reporte de cierre por microfase |

## Comandos

```bash
npm run quality:microphases    # valida ledger + imprime próxima READY
npm run quality:microphase-next # JSON de la microfase READY
```

## Reglas operativas

1. Una microfase por sesión; detenerse tras el reporte de cierre.
2. No commit ni push salvo orden explícita.
3. No modificar comportamiento fuera del alcance de la microfase activa.
4. PostgreSQL = SoT; IA → borrador; aprobación humana obligatoria.
5. Copy visible desde `packages/design-system/src/copy/es.ts`.
6. UI solo vía `@epis2/epis2-ui`; sin `@mui/*` en `apps/web`.
7. HL7 inbound sin writeback antes de MF-180; RLS enforce obligatorio en staging (MF-155).

## Orden canónico (decisión arquitecto 2026-06-05)

Una microfase por sesión, en esta secuencia. Fuente: `canonicalExecutionOrder` en el ledger v1.1.

```text
MF-151…154  ✓ gobernanza, copy, CI, Playwright
MF-155      → RLS staging (READY)
MF-183      → API integración estable (gates verdad)
MF-184      → Matriz Golden × M3
MF-185      → Auth /login sin redirect 401
MF-186      → E2E journey pasos 6–9
MF-187      → Ollama + local-ai en stack
MF-156      → Scaffolder blueprints
MF-188      → Patrón IA Ollama por blueprint
MF-157…160  → Ingreso vertical → alergias → problemas
MF-161…182  → Resultados, formularios, admin, piloto, HL7
```

**Rationale:** cerrar verdad operativa y espina Golden **antes** de ampliar catálogo clínico; patrón IA **antes** de `admission_note` con assist.

## Olas

| Ola | MF | Tema |
|-----|-----|------|
| 0 | 151–155, **183–187** | Verdad operativa + espina Golden/Ollama |
| 1 | 156–160, **188** | Blueprints, IA, ingreso, alergias, problemas |
| 2 | 161–165 | Resultados clínicos |
| 3 | 166–170 | Formularios prioritarios |
| 4 | 171–174 | Administración y operación |
| 5 | 175–179 | Piloto (OIDC, rate limits, backup, M3 humano) |
| 6 | 180–182 | HL7 post-piloto |

## Estado actual

Ejecutar `npm run quality:microphases` para la **próxima microfase READY** (no editar manualmente sin actualizar el ledger).

## Plantilla de cierre

Ver `docs/MICROPHASE_TEMPLATE.md` y el formato en `reports/epis2-mf-151-governance.md`.
