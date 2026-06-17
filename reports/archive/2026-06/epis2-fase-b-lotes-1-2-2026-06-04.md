# EPIS2 — Fase B Lotes 1–2 (Command palette + autocomplete paciente)

**Fecha:** 2026-06-04  
**Alcance:** Fase B productividad — Lote 1 palette global · Lote 2 búsqueda paciente  
**Gates:** `check` ✓ · `command-palette-gate` ✓ · `layers-integration-gate` ✓ · `db:validate` ✓

---

## Lote 1 — ClinicalCommandPalette (Ctrl+K)

| Entregable | Archivo |
|------------|---------|
| Builder items por rol | `apps/web/src/clinical/buildClinicalCommandPaletteItems.ts` |
| Capa shell global | `apps/web/src/components/ClinicalShellCommandPalette.tsx` |
| Montaje | `ClinicalShellLayout`, `CommandCenterPage`, `DashboardModeContent` |
| Export registry | `filterDefinitionsForRole` en `@epis2/command-registry` |

Comportamiento:
- Ctrl+K / Cmd+K abre paleta con hasta **8** acciones visibles (`maxVisible`)
- Items filtrados por rol + permisos (`filterDefinitionsForRole`)
- Confirmación local en acciones `requiresConfirmation` + `CommandConfirmationDialog` CE-2
- Resolución vía `useClinicalCommandSubmit` (misma ruta que Power Bar)

---

## Lote 2 — PatientSearchAutocomplete

| Entregable | Archivo |
|------------|---------|
| Autocomplete pacientes demo | `apps/web/src/components/PatientSearchAutocomplete.tsx` |
| Integración búsqueda | `GeneratedClinicalFormPage` — debounce 300 ms, fetch desde 2 caracteres |
| Registry RAD | `patient-search` → `migration: done` |

---

## Tests añadidos

- `buildClinicalCommandPaletteItems.test.ts`
- `ClinicalShellCommandPalette.test.tsx`
- `PatientSearchAutocomplete.test.tsx`

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Doble instancia palette en `/comando` | Aceptado: mismo componente; dialog modal único |
| API pacientes sin PG en dev | Grid + botón manual siguen disponibles |
| Palette compite con UX-G02 | `maxVisible=8`; home mantiene hero ≤4 chips |

---

## Próximo lote (Fase B-03)

1. Journey Playwright ingreso→alta (`golden-v2-admission-discharge` UI)
2. Cierre `clinical-form-evolution` / `draft-review` en registry RAD
3. Actualizar `EPIS2_COMPLETION_ROADMAP.md` (conteos tests/blueprints)

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
