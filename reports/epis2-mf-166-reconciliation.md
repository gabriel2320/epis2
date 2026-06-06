# MF-166 — Conciliación medicamentos

**Estado:** DONE · **MF unificado:** MF-35 · **Commit:** (pendiente push)

---

## Alcance

Blueprint `medication_reconciliation`, intent `reconcile_medications`, ruta `/espacio/conciliacion`, enlace desde tablero farmacia, borrador → aprobación → `clinical_notes`.

## Entregas

| Ítem | Ubicación |
|------|-----------|
| Blueprint | `packages/clinical-forms/src/blueprints/medication-reconciliation.ts` |
| Intent + frases ES | `packages/command-registry` — `reconcile_medications` |
| Ruta web | `apps/web/src/routes/router.tsx` |
| Tablero farmacia | `PharmacyDashboardTab` → `/espacio/conciliacion` |
| Migración draft type | `database/migrations/027_medication_reconciliation_draft_type.sql` |
| IA assist | `assistSchemas`, `draftPromptCatalog`, `assistBlueprintPattern` |
| Test integración | `admission.integration.test.ts` — MF-166 chain |
| Test UI tablero | `PharmacyDashboardTab.test.tsx` |

## Cadena vertical

```text
comando «conciliacion medicamentosa»
  → intent reconcile_medications
  → /espacio/conciliacion
  → POST /api/drafts (medication_reconciliation)
  → POST approve
  → clinical_notes (noteType medication_reconciliation)
  → auditoría append-only
```

Alternativa tablero: candidato conciliación → botón «Conciliar medicamentos».

## Formato impresión (norma)

Familia longitudinal · **Carta vertical** — ver `EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md` §29. Vista `Print*` no implementada en esta MF.

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK |
| `npm run db:validate` | OK — 27 migraciones |
| `quality:microphases` | MF-167 READY |

## Fuera de alcance (anti-creep)

- Cola farmacia productiva completa
- Ocultar candidatos tras conciliación en dashboard
- PDF / PRINT-01+

## Próximo paso

**MF-167** — Nota de traslado (`transfer_note`).
