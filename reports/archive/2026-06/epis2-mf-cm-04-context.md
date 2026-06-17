# MF-CM-04 — Contexto resolve: sección + chartMode + blueprint

**Fecha:** 2026-06-11 · **Estado:** DONE  
**Gate:** `quality:cm-04-context-gate`

## Entregables

| Capa | Cambio |
|------|--------|
| `commandActiveContextSchema` | `chartMode`, `paperSurface`, `plannerView`, `traditionalSection`, `assistBlueprintId` |
| `context-section-rank.ts` | Boosts por sección nav (navOrders → lab/admin; navMeds → conciliación/farmacia) |
| `context-rank.ts` | Integra boosts sección + blueprint |
| `useCommandResolveContext` | Lee `ehrSection` y `assistBlueprintId` de URL; propaga en contexto |
| `apps/api/commands/routes.ts` | Passthrough contexto completo al registry (fix server-side ranking papel/sección) |

## URL search params

- `ehrSection=navMeds` — sección tradicional activa
- `assistBlueprintId=evolution_note` — blueprint de borrador activo

## Verificación

```bash
npm run quality:cm-04-context-gate
```

## Próximo

**MF-CM-05** — panel IA resumen paciente + acciones sugeridas.
