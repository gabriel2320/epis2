# EPIS2 — Command Center & Command Engine CE-0 + UX-B.1

**Fecha:** 2026-06-04  
**Alcance:** CE-0 (registry seguro, cero silencios, suite 50 frases, telemetría) + UX-B.1 (home compacto `/comando`)  
**Fase:** EPIS2-11+ / post UX-A

---

## Resumen ejecutivo

Se extendió `@epis2/command-registry` hacia un **Command Engine determinístico** sin duplicar registries ni añadir IA en el resolve. `/comando` queda **command-first**: Power Bar dominante, contexto en una línea, sugerencias, cuatro bloques mínimos; widgets, panel paciente expandido y botón tablero duplicado retirados del above-the-fold.

Principio aplicado: **IA interpreta · Registry autoriza · Usuario confirma · EPIS2 ejecuta** (IA en resolve diferida a CE-3).

---

## Auditoría breve — estado previo

| Área | Antes | Riesgo |
|------|-------|--------|
| Router | `resolveCommand` con fallback vacío (`candidates: []`) | Silencios / frustración |
| Registry | `ClinicalIntent` + aliases, sin `family`/`safetyLevel` | Sin gate de confirmación tipado |
| `/comando` | Power Bar + toggle paciente + widgets + demos + tablero | EHR disfrazado |
| Telemetría | Ausente en comandos | Sin mejora continua |
| Tests | Suite ≥100 aliases, sin 50 frases clínicas reales | Sin gate 90% |

---

## Entregables CE-0

### 1. Registry seguro tipado (extensión, no segundo registry)

- `packages/command-registry/src/intent-metadata.ts` — `INTENT_SECURE_METADATA` por intent: `family`, `safetyLevel`, `actionType`, `confirmationRequired`, `requiredContext`, `examples`, `formId`.
- `CommandDefinition` enriquecido vía helper `cmd()` en `definitions.ts`.

### 2. Cero silencios

- `fallback.ts` — `buildGuidedFallbackCandidates()` garantiza **≥3 candidatos** contextuales por rol.
- `colloquial-rules.ts` — frases coloquiales (alta, IA, impresión, ficha).
- `router.ts` — todo `needs_clarification` pasa por fallback; mensaje guiado estándar.

### 3. Aliases y ranking

- Aliases ampliados para SOAP, laboratorio, MAR, epicrisis, antibióticos, impresión, etc.
- `rank.ts` — boost revisión vs solicitud (`revisar hemograma` → resultados, no orden).

### 4. Suite 50 frases + gate CI

- `clinical-phrase-suite-50.ts` + test con umbral **≥90% respuesta útil**.
- Criterio útil: `resolved` | `needs_patient` | `needs_clarification` (≥3 candidatos) | `forbidden`.

### 5. Telemetría anonimizada

- `telemetry.ts` — hash SHA-256 truncado, sin texto libre PHI.
- API `POST /api/commands/resolve` → audit `command.resolve` con payload estructurado.

---

## Entregables UX-B.1

| Elemento | Implementación |
|----------|----------------|
| Power Bar | Sin cambios de componente; sigue dominante |
| Contexto 1 línea | `CommandCenterContextLine.tsx` |
| Sugerencias | `EpisCommandSuggestions` (sin cambio) |
| 4 bloques | `CommandCenterMinimalBlocks.tsx` — recientes, tareas, borradores, alertas |
| Retirado por defecto | Widget panel, panel paciente expandible, botón tablero duplicado |
| Demos narrativos | Colapsados tras toggle |

Copy nuevo en `packages/design-system/src/copy/es.ts`.

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK (lint + typecheck + architecture) |
| `npm run test` | OK — 456 tests |
| `npm run db:validate` | OK |
| CE-0 ≥90% / 50 frases | OK |
| UX-G01 (≤4 bloques, sin widget grid) | OK |

---

## Riesgos y límites

1. **IA local en resolve** — no incluida (CE-3); ambigüedad resuelta con candidatos determinísticos.
2. **Bloques mínimos** — tareas/borradores dependen de API demo; vacíos muestran copy honesto.
3. **“Abrir ficha”** con paciente activo — hoy vía chip contextual o búsqueda; intent dedicado `open_chart` pendiente CE-1.
4. **Query warning en test** — mock de `fetchDashboardWork` en test de página; no afecta producción.

---

## Próximo paso exacto

**CE-1:** ranking con borradores/alertas activas en contexto de resolve + intent `open_chart` para ficha con paciente fijado.  
**UX-B.2:** ficha compacta (Resumen + Power Bar contextual + «Ver historial»).

---

## Archivos principales

- `packages/command-registry/src/{intent-metadata,fallback,colloquial-rules,telemetry,clinical-phrase-suite-50}.ts`
- `packages/command-registry/src/router.ts`
- `apps/api/src/commands/routes.ts`
- `apps/web/src/pages/CommandCenterPage.tsx`
- `apps/web/src/components/CommandCenter{ContextLine,MinimalBlocks}.tsx`
