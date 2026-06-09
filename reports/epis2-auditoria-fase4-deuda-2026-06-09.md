# EPIS2 — Auditoría profunda: Fase 4 (deuda estructural) — 2026-06-09

> Continuación de `reports/epis2-auditoria-profunda-2026-06-09.md` (plan §Fase 4).
> Fases previas: 1 higiene · 2 robustez · 3 pulido M3 (`epis2-auditoria-fase3-pulido-m3-2026-06-09.md`).

## Alcance declarado

- Nivel SDEPIS2: tramo de mejora transversal (auditoría), sin tocar invariantes ni SoT.
- Archivos: `apps/api/src/clinical/*`, `apps/web/src/pages/GeneratedClinicalFormPage.tsx`,
  `apps/web/src/clinical/generated-form/*` (nuevo), `scripts/db-migrate.mjs`,
  `scripts/quality/validate-clinical-textbox-gate.mjs`, `.github/workflows/ci.yml`, tests nuevos.

## Cambios

### 4.1 División de `GeneratedClinicalFormPage.tsx` (753 → 693 líneas netas + 3 módulos)

- Nuevo `apps/web/src/clinical/generated-form/`:
  - `useGeneratedFormDraftPersistence.ts` — crear/actualizar borrador + intent firmar (navegación a revisión).
  - `useGeneratedFormAiAssist.ts` — sugerencia IA con `applyIfEmpty` (borrador ≠ dato aprobado).
  - `GeneratedFormSections.tsx` — `GeneratedFormStatusAlert` + `GeneratedFormClinicalAlerts` (deduplicados 3×).
- La página queda como composición; se eliminó el interlineado doble heredado.
- `validate-clinical-textbox-gate.mjs` actualizado: la verificación `updateDraftMutation` ahora
  acepta página + hook de persistencia (la garantía es la misma, vive en el hook).

### 4.2 Side-effects de `approveDraft` por tipo → `approval-side-effects.ts`

- Nuevo `apps/api/src/clinical/approval-side-effects.ts` (149 líneas): registro
  `APPROVAL_SIDE_EFFECTS` con handlers por `draftType`:
  `admission_note` · `allergy_entry` · `clinical_problem_entry` · `medication_administration` ·
  `transfer_note` · `outpatient_visit`.
- `approveDraft` (service.ts 547 → 441 líneas) llama `runApprovalSideEffects(tx, …)` dentro de la
  misma transacción de Fase 2 — semántica idéntica, verificada con los tests de integración existentes.

### 4.3 Tabla de control de migraciones (`db-migrate.mjs`)

- Nueva tabla `epis2_schema_migrations` (filename PK, checksum sha256 normalizado CRLF, applied_at).
- Comportamiento:
  - **Baseline**: DB existente sin tabla de control → registra las 33 migraciones sin re-ejecutar
    (re-aplicar todo no es seguro: `017` restaura un check antiguo que viola filas con draft types nuevos —
    fallo real reproducido durante esta fase).
  - **Incremental**: solo aplica archivos nuevos o con checksum distinto (con aviso).
  - DB fresca (CI): aplica todo y registra, igual que antes.
- Verificado: migrate ×2 idempotente (`0 aplicada(s), 33 ya registrada(s)`) + `db:validate` OK.

### 4.4 Tests nuevos

| Test | Cobertura |
|---|---|
| `apps/api/src/admin/routes.integration.test.ts` | GET users (admin 200 / médico 403) · POST catalogs (admin 201, auditor 403, body inválido 400) · lectura auditor |
| `apps/web/src/pages/DraftReviewPage.test.tsx` | Render ready_for_review (título, disclaimer, botón aprobar, versiones) · approved sin acciones |
| `apps/web/src/components/rad/EpisRadDashboardTabShell.test.tsx` | Hero + contenido + testId · bulk actions |

### 4.5 Decisión `quality:layers-integration-gate` → **entra a CI**

- Gate estático y rápido (~7 s, sin DB ni build), ya exigido por el DoD del plan global.
- Añadido a `.github/workflows/ci.yml` tras `quality:pm01`. Drift proceso↔pipeline eliminado.

## Gates

| Gate | Resultado |
|---|---|
| `npm run check` | ✅ |
| `npm run test` | ✅ (incluye 3 archivos de test nuevos) |
| `npm run db:validate` | ✅ 33 migraciones |
| `npm run db:migrate` ×2 | ✅ baseline + incremental idempotente |
| `npm run quality:layers-integration-gate` | ✅ |

## Riesgos

- `db-migrate` cambia de semántica (re-aplicar todo → incremental). Si una migración existente se
  edita en el futuro, se re-aplica con aviso (checksum distinto); el flujo correcto sigue siendo
  añadir migraciones nuevas.
- El baseline asume que una DB con `clinical_drafts` ya está al día — cierto para todos los
  entornos actuales (gates `db:validate` + tests en verde).

## Próximo paso

- Fase 5 del plan (checklist pre-producción) — **solo si EPIS2 sale del laboratorio**; hoy no bloquea.
- P1 impresión clínica restante (carta / más A5) o P1c alto contraste ampliado.
