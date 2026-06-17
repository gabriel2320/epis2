# EPIS2 — Spike TanStack Query + ADR stack UI

**Fecha:** 2026-06-04 · **Alcance:** `apps/web` lecturas clínicas · **Fase:** post signoff A–K

---

## Alcance

Implementación del veredicto de stack UI (sesión previa):

1. **Adoptar TanStack Query** de forma incremental en lecturas clínicas.
2. **ADR** `docs/design/EPIS2_UI_STACK_DECISIONS.md` — adoptar / rechazar / defer.
3. **No añadir** Sonner, Framer, Lucide, Recharts, TanStack Table, segundo form renderer.

---

## Cambios

| Área | Detalle |
|------|---------|
| Dependencia | `@tanstack/react-query` en `@epis2/web` |
| Infra | `apps/web/src/query/` — client, keys, provider, hooks, invalidación |
| Provider | `Epis2QueryProvider` en `main.tsx` |
| Migración | Centro de Comando, ficha paciente, formularios clínicos, revisión borrador, widgets |
| Invalidación | `invalidateAfterDraftApproval` tras `approveDraft` / transición en `DraftReviewPage` |
| Tests | `renderWithQuery` helper; tests actualizados |
| ADR | `EPIS2_UI_STACK_DECISIONS.md` |

### Política de caché clínica

- `staleTime`: 30 s · `gcTime`: 2 min
- `refetchOnWindowFocus`: true · `retry`: 1
- Sin persistencia offline de datos clínicos

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK (438/438) |
| `npm run db:validate` | OK |

---

## Riesgos

- Dashboard tabs (`DashboardModePage`) aún usan fetch local — migración pendiente.
- Mutaciones PATCH borrador desde formularios aún no unifican invalidación vía `useMutation`.
- Incremento de bundle: monitorizar en gate M3-09.

---

## Próximo paso

1. Migrar tabs dashboard restantes a hooks Query.
2. `useMutation` + invalidación en guardado/aprobación desde formularios.
3. Signoff clínico humano A–K → piloto institucional (sin cambio de prioridad producto).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
