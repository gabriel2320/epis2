# EPIS2 — Auditoría en profundidad (2026-06-09)

**HEAD:** `2d77bfe` · **Alcance:** código, seguridad, robustez, diseño M3, testing/CI, documentación
**Método:** gates ejecutados en vivo + 3 exploraciones exhaustivas (código/riesgos · diseño M3 · testing/CI/docs)

---

## 1. Scorecard

| Área | Estado | Nota |
|------|--------|------|
| Gates en vivo | 🟢 | `check` ✓ · vitest **646/646** ✓ · `db:validate` 33 migraciones ✓ · `architecture:validate` 17/17 ✓ |
| Higiene TypeScript | 🟢 | 0 `any`, 0 `@ts-ignore`, 0 `eslint-disable`, 0 TODO/FIXME reales |
| Invariantes producto | 🟢 | IA no escribe SoT · aprobación humana · borrador ≠ aprobado — todo gateado |
| Seguridad (como demo) | 🟡 | Correcta para laboratorio; **3 hallazgos críticos si se expone** |
| Diseño Material Design 3 | 🟡 | Sistema de tema maduro; gaps en roles runtime, rail 11px, Admin sin pulir |
| Cobertura E2E en CI | 🟠 | CI ejecuta **10 de ~76** tests E2E (~13%); impresión clínica fuera de CI |
| Documentación viva | 🟡 | Drift puntual: piloto M3 ya verde pero tablero/plan dicen «pendiente» |
| Robustez transaccional | 🟠 | `approveDraft` sin transacción con `RLS_MODE=off` (default dev) |

---

## 2. Evidencia de gates (ejecutados hoy)

```text
npm run check          OK — lint + typecheck 13 workspaces + architecture:validate 17/17
npm run test           OK — 226 archivos · 646/646 tests · 276s
npm run db:validate    OK — 33 migraciones (001_extensions … 033_procedure_request_draft_type)
quality:m3-human-pilot OK — V1–V6 6/6 E2E (reports/epis2-m3-human-pilot-2026-06-09.md)
```

Limitación: `npm audit` **no disponible** en este equipo — el mirror npmmirror no implementa
`/-/npm/v1/security/*`. CI sí lo ejecuta (`npm audit --omit=dev --audit-level=high`).

---

## 3. Errores y riesgos — código y seguridad

### CRÍTICO (solo si el despliegue sale del laboratorio)

| # | Hallazgo | Ruta |
|---|----------|------|
| C1 | Claves demo hardcodeadas (`DEMO-CLAVE-*`) — cualquiera entra como médico/farmacia/admin | `packages/clinical-domain/src/demoUsers.ts` L15–64 |
| C2 | `SESSION_SECRET` con default débil (`epis2-dev-session-secret-change-me`) — JWT forjables si no hay override | `apps/api/src/config.ts` L8 |
| C3 | **`approveDraft` ejecuta ~10 escrituras sin transacción cuando `RLS_MODE=off`** (default dev). Fallo a mitad ⇒ SoT inconsistente. Solo hay transacción con RLS `enforce` | `apps/api/src/clinical/service.ts` L369–532 · `apps/api/src/db/rlsContext.ts` L14–16 |

### ALTO

| # | Hallazgo | Ruta |
|---|----------|------|
| A1 | Servicio `local-ai` sin autenticación — `/assist/*` acepta POST de cualquier cliente; bypass de auditoría `ai_runs` | `services/local-ai/src/app.ts` L52–109 |
| A2 | `SERVICE_API_KEY` impersona sesión fija de auditor sin trazar al caller real | `apps/api/src/auth/authenticate.ts` L36–42 |
| A3 | JWT: rol con cast directo `role as ClinicalRole` sin `isClinicalRole()` — elevación de privilegio si el secret se compromete | `apps/api/src/auth/sessionToken.ts` L49–58 |
| A4 | Aprobación permitida desde estado `draft`/`editing` (no exige `ready_for_review`) — flujo «crear → aprobar» sin revisión explícita | `apps/api/src/clinical/service.ts` L375–377 |
| A5 | Postgres Docker `epis2:epis2` expuesto en `:5433` | `docker-compose.yml` L19–24 |
| A6 | Rutas dev (`/desarrollo/*`) activables en build prod vía flags `VITE_ENABLE_*` — guard de build, no de servidor | `apps/web/src/dev/*Env.ts` · `router.tsx` L342–378 |

### MEDIO (selección)

| # | Hallazgo | Ruta |
|---|----------|------|
| M1 | Sin headers de seguridad HTTP (helmet/CSP/HSTS) | `apps/api/src/app.ts` L21–29 |
| M2 | Rate limit de login desactivado en `development`/`test`; además en memoria (no multi-instancia) | `apps/api/src/auth/routes.ts` L31–44 · `security/rateLimit.ts` |
| M3 | `POST /api/admin/catalogs` protegido con `audit.read` (lectura), no permiso admin de escritura | `apps/api/src/admin/routes.ts` L77–107 |
| M4 | Migraciones sin tabla de control por archivo — `db-migrate.mjs` re-ejecuta todos los `.sql` siempre; sin rollback | `scripts/db-migrate.mjs` L27–37 |
| M5 | Auditoría cae a memoria si falta `DATABASE_URL` — eventos se pierden al reiniciar | `apps/api/src/audit/store.ts` L46–57 |
| M6 | `.catch()` silenciosos en frontend | `EpisClinicalContextPane.tsx` L79,123 · `PatientClinicalAiPanel.tsx` L45 · `AdminConsolePage.tsx` L39–54 |
| M7 | Archivos >500 líneas: `GeneratedClinicalFormPage.tsx` (~753), `DashboardModeContent.tsx` (689), `clinical/service.ts` (496, `approveDraft` monolítico) | — |
| M8 | `/dev/scheduler-spike` no cubierto por `dev-catalog-gates.mjs` | `scripts/architecture/dev-catalog-gates.mjs` L7–20 |

### Frontera datos clínicos / IA — sólida

| Aspecto | Evaluación |
|---------|------------|
| Borrador vs aprobado | **Fuerte** — tablas separadas; PATCH no puede aprobar (`canPatchDraftStatus`) |
| IA no escribe SoT | **Fuerte** — gate `ai-write-boundary.mjs`; `requiresHumanReview: true`; `sanitizeAiSuggestedFields` bloquea `status/approve/firma` |
| Anti auto-aprobación | **Fuerte** — regex en `validateOutput.ts`; gate `human-approval-required` |
| Trazabilidad | **Parcial** — `ai_runs` + `audit_events` + `approvals` en PG; mejorable con A2/A4 |

---

## 4. Diseño gráfico — Material Design 3

### Fortalezas del sistema de tema

- Generador único `createEpis2Theme` (modo · MTB · densidad · contraste · motion); 7 temas light/dark aprobados.
- **Elevación tonal pura**: 25× `'none'` en sombras; única excepción documentada (floating dock).
- 8 gates automatizados en `scripts/theme/` (hardcoded colors, paridad light/dark, roles, contraste WCAG).
- Cero hex hardcodeado en `apps/web/src/pages/`; cero imports `@mui/*` directos en web (gateado).
- Motion M3 (80–260ms) con apagado por `reduced`; roles clínicos con tests de contraste.

### Hallazgos de diseño

| Sev | Hallazgo | Ruta |
|-----|----------|------|
| ALTO | Roles M3 incompletos en runtime: sin `palette.tertiary`, escalera `surfaceContainerLowest/Low/Highest` no expuesta (`M3SurfaceRoles` solo 7 campos) | `theme/color-roles.ts` L72–80 · `m3-palette-from-scheme.ts` L28–60 |
| ALTO | Navigation rail con etiquetas a **11px** (`0.6875rem`) — viola piso 13px del canon tipográfico | `EpisNavigationRail.tsx` L74 |
| ALTO | `AdminConsolePage` fuera de patrón: `Paper` anidados (anti-patrón §5), `Button`/`TextField` MUI crudos, copy hardcodeado | `AdminConsolePage.tsx` L82–155 |
| MEDIO | Alto contraste solo sube `fontWeight` — no ajusta outline, `onSurfaceVariant` ni foco | `create-epis2-theme.ts` L78–85 |
| MEDIO | `EpisDraftStatus` usa `warning/info/success` MUI en vez de roles clínicos protegidos `theme.epis2.clinical.*` | `EpisDraftStatus.tsx` L4–11 |
| MEDIO | `DraftReviewPage`: `Typography h6` en lugar de `EpisM3Text`, API dual `variant=`/`appearance=` en botones | `DraftReviewPage.tsx` L183–204 |
| MEDIO | Sombra en preview A5 (`boxShadow: 1`) — anti-patrón §1 elevación tonal | `PrintA5Document.tsx` L33 |
| MEDIO | Motion no auto-sincroniza `prefers-reduced-motion` al primer arranque; transición fija 120ms en suggestion cards | `EpisThemePreferences.tsx` L37 · `EpisCommandSuggestionCards.tsx` L98 |
| BAJO | Magic numbers dispersos (`minHeight: 132`, `gap: 1.25`), `marginTop: 6` fuera de grid 8dp | varios |

Veredicto: M3 **intencional y clínico** (denso, radios 2–8px, base 14px) — no «M3 de catálogo», pero coherente y gateado. Las páginas núcleo (Comando, Login, formulario, ficha) están bien encuadradas; Admin y revisión de borradores son las áreas sin pulir.

---

## 5. Testing y CI

### Cobertura E2E

- ~26 specs / ~76 tests E2E en total; **CI ejecuta solo 7 specs / 10 tests** (lista fija en `test:e2e`).
- Fuera de CI: tramos B–K (~30 tests), Ola 1C/3, **impresión A5 certificado**, piloto M3, regresión visual M3.

| Gap | Prioridad |
|-----|-----------|
| **Receta A5 sin E2E** (reconocido en reporte Hilo C P1) | P1 |
| Certificado A5 con E2E pero **fuera de CI** | P1 |
| Alta/epicrisis sin journey dedicado (el spec `golden-v2-admission-discharge` no cubre discharge) | P2 |
| Búsqueda de paciente vía UI (E2E usan `pinDemoCase` bypass; PEND-004 combobox) | P2 |
| `closeEncounter` (Hilo B) sin test API/E2E de integración | P2 |

### Unit tests — huecos

- Web: `DraftReviewPage`, `AdminConsolePage`, tabs de dashboard por servicio, `PatientListGrid`, `CommandConfirmationDialog`.
- API: routers `admin/`, `audit/`, `ops/`, `interop/` (HTTP); `longitudinal.ts`, `documentIntake.ts`, `ai/rag.ts`.

### Riesgos CI

- Run ~8–12 min; Postgres service + triple build + E2E en `preview`.
- `retries: 2` enmascara flakes (login, timing).
- `quality:layers-integration-gate` está en el DoD del plan global pero **no corre en CI** — drift proceso↔pipeline.
- ~100 scripts `quality:*` de los cuales CI ejecuta 6; los gates de cierre de tramo quedaron como checklist de sesión, no protección de merge.

---

## 6. Drift documental (post piloto M3)

| Documento | Sección | Corregir a |
|-----------|---------|------------|
| `docs/product/EPIS2_TABLERO.md` | L31 «piloto M3 pendiente» · L39 P1 · L68 capa L5 | Piloto M3 automatizado **OK 2026-06-09**; promover P1 → P1b impresión restante |
| `docs/product/EPIS2_GLOBAL_DEV_PLAN.md` | L68 `[ ] Piloto humano M3` | `[x]` automatizado · PEND-006 parcial (falta carta + checkbox humano opcional) |
| `reports/epis2-pendientes-registro-2026-06-09.md` | PEND-006 | m3-human-pilot cerrado (automatizado); resta signoff humano opcional |
| `docs/product/EPIS2_TABLERO.md` | Cabecera HEAD `88ec444` | HEAD real `2d77bfe` |

---

## 7. Plan de desarrollo y mejoras

### Fase 1 — Higiene inmediata (1 sesión, riesgo nulo)

| # | Acción | Gate |
|---|--------|------|
| 1.1 | Sync documental: tablero + plan global + pendientes (piloto M3 verde, HEAD) | revisión manual |
| 1.2 | Fix rail 11px → `labelMedium` ≥13px o solo tooltip | `theme:validate` + screenshot |
| 1.3 | Quitar sombra preview A5 → borde tonal (`border: 1, borderColor: 'divider'`) | `quality:m3-signoff` |
| 1.4 | Añadir `/dev/scheduler-spike` a `dev-catalog-gates.mjs` | `architecture:validate` |
| 1.5 | Corregir permiso de `POST /api/admin/catalogs` (`audit.read` → permiso de escritura admin) | test API nuevo |

### Fase 2 — Robustez SoT y E2E impresión (Hilo C, 1–2 sesiones)

| # | Acción | Gate |
|---|--------|------|
| 2.1 | **Envolver `approveDraft` en transacción siempre** (no solo RLS enforce) — C3, el hallazgo técnico más importante | vitest integración + `golden-draft-approval` |
| 2.2 | E2E receta A5 print (journey CTA → `/espacio/receta/imprimir`) | nuevo spec |
| 2.3 | Añadir `ola6a-print-certificate` + spec receta al set `test:e2e` de CI (+~30s) | CI verde |
| 2.4 | Test integración `closeEncounter` (entregado Hilo B sin cobertura) | vitest |
| 2.5 | Validar rol con `isClinicalRole()` en `verifySessionToken` (A3) | unit test |

### Fase 3 — Pulido M3 de segunda línea (1–2 sesiones)

| # | Acción | Gate |
|---|--------|------|
| 3.1 | Exponer `palette.tertiary` + escalera `surfaceContainer*` completa en runtime | `theme:validate` ampliado |
| 3.2 | `EpisDraftStatus` → roles clínicos `theme.epis2.clinical.draft/approved` | test contraste |
| 3.3 | Refactor `AdminConsolePage`: `EpisWorkspaceSection`, `EpisButton/TextField`, copy a `es.ts` | `architecture:validate` |
| 3.4 | Unificar `DraftReviewPage` con `EpisM3Text` + `appearance=` | visual review |
| 3.5 | Auto-sync `prefers-reduced-motion` en `loadPreferences()`; tokenizar 120ms/132px | `quality:m3-signoff` |
| 3.6 | Alto contraste ampliado: outline + `onSurfaceVariant` + foco | E2E V3 |

### Fase 4 — Deuda estructural (cuando Hilo C esté estable)

| # | Acción |
|---|--------|
| 4.1 | Dividir `GeneratedClinicalFormPage.tsx` (753 líneas): hooks de datos + secciones de layout |
| 4.2 | Extraer side-effects por `draftType` de `approveDraft` a handlers por tipo (M7/M13) |
| 4.3 | Tabla de control de migraciones (versionado incremental en `db-migrate.mjs`) |
| 4.4 | Unit tests: `DraftReviewPage`, routers admin/audit/ops, `EpisRadDashboardTabShell` |
| 4.5 | Decidir destino de `quality:layers-integration-gate`: entra a CI o sale del DoD |

### Fase 5 — Pre-producción (solo si EPIS2 sale del laboratorio)

Checklist de endurecimiento (hoy **no bloquea** — es demo):
auth real reemplaza claves demo (C1) · rotar `SESSION_SECRET`/`SERVICE_API_KEY` (C2/A2) ·
auth en `local-ai` (A1) · helmet/CSP/HSTS (M1) · rate limit persistente (M2) ·
`RLS_MODE=enforce` + revisar políticas physician-amplio (M6/M7) · flags `VITE_ENABLE_*` off ·
credenciales Postgres no default (A5) · flujo `ready_for_review` obligatorio antes de aprobar (A4).

---

## 8. Conclusión

EPIS2 está en su **mejor estado histórico**: todos los gates verdes, 646 tests, higiene TypeScript impecable, invariantes de producto protegidos por validadores automatizados y un sistema de tema M3 maduro y deliberado. No hay errores activos.

Los riesgos reales son tres, y ninguno es un bug visible hoy:

1. **`approveDraft` sin transacción en dev** (C3) — única debilidad técnica seria del núcleo clínico.
2. **CI cubre el 13% del inventario E2E** — los tramos cerrados y la impresión clínica no están protegidos contra regresión en cada push.
3. **Supuestos de demo** (claves, secretos, RLS off) — aceptables ahora, checklist obligatorio antes de cualquier exposición.

**Próximo paso exacto:** Fase 1 (higiene + sync docs) y luego 2.1 (transacción en `approveDraft`) dentro del Hilo C.
