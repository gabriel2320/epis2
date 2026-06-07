# EPIS2 CE-5 — Badge prefill comando + URL limpia

**Fecha:** 2026-06-04  
**Alcance:** CE-5 — UX post-navegación desde Power Bar  
**Depende de:** CE-3b, CE-4

## Objetivo

Cuando el usuario llega a un formulario desde un comando resuelto, ver un indicador claro de que el borrador fue sugerido por el comando (no aprobado) y retirar los slots sensibles de la query string para no persistirlos en historial ni recargas.

## Entregables

| Área | Cambio |
|------|--------|
| `commandFormSearch.ts` | `hasCommandSlotSearchParams`, `stripCommandSlotsFromFormSearch`, `COMMAND_SLOT_SEARCH_KEYS` |
| `clinicalNavigate.ts` | `replace?: boolean` en navegación a formularios |
| `GeneratedClinicalFormPage` | Badge `epis2-command-prefill-badge`; `replace` URL al montar |
| Copy | `forms.commandPrefillBadge` |
| Tests | `commandFormSearch.test.ts`, `GeneratedClinicalFormPage.commandPrefill.test.tsx` |

## Comportamiento

1. Navegación incluye slots en search (CE-3b).
2. Formulario aplica prefill en `useState` inicial.
3. Badge visible si la URL traía slots (estado inicial, persiste tras limpiar URL).
4. `navigate({ replace: true })` deja solo `patientId` en search.

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK |
| `npm run db:validate` | OK |

## Riesgos

- Badge no distingue prefill contextual (CE-4) vs slots de comando — solo URL con slots.
- Recarga tras limpiar URL pierde badge pero mantiene valores en formulario.

## Próximo paso

- Validación manual UX-G02 end-to-end (Centro de Comando → confirmar → formulario + badge).
- Documentar arco CE-0…CE-5 en reporte consolidado command-first.
