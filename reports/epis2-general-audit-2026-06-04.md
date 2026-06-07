# EPIS2 — Auditoría general completa

**Fecha:** 2026-06-04 · **Auditor:** sesión automatizada (código, git, gates, docs)  
**Regla:** Sin modificaciones de código · evidencia > suposiciones

---

## A. Resumen ejecutivo

Ver [`epis2-general-audit-summary-2026-06-04.md`](./epis2-general-audit-summary-2026-06-04.md).

**Veredicto:** EPIS2 es un **MVP demo técnicamente maduro** con invariantes respetados, pero en **fase de consolidación operacional** — no de expansión funcional.

---

## B. Tabla de estado por dimensión

| Dimensión | Estado | Evidencia |
|-----------|--------|-----------|
| Arquitectura | **OK** | 17 validadores `architecture:validate`; registries únicos |
| Frontend | **Parcial** | Wire híbrido + CE en working tree sin commit |
| Backend | **OK** | API Fastify, commands, drafts, RLS piloto |
| Base de datos | **OK** | 32 migraciones, `db:validate` |
| IA local | **Parcial** | `services/local-ai`, assist route; app funciona sin Ollama |
| Command Engine | **Parcial** | CE-0→CE-5 implementado; no en HEAD remoto |
| UX/UI | **Parcial** | M3 + UX-A/B/C/D; admin Paper residual |
| Formularios | **OK** | 19 blueprints, registry validado |
| Impresión | **Parcial** | `MedicalCertificatePrintPage`, Storybook PrintA5 |
| Datos demo | **OK** | DEMO-001…005 + `demoNarratives` |
| Tests | **OK** | 511 tests; 24 E2E specs |
| Documentación | **Riesgo** | 128 docs + 224 reports; cifras desfasadas |
| Seguridad clínica | **OK** | human-approval, ai-write-boundary, confirmación CE-2 |
| Interoperabilidad | **Parcial** | FHIR export pkg; HL7 quarantine migration 031 |
| Producto/piloto | **Pendiente** | Checklist piloto; commit arco UX |

---

## C. Mapa de avances

### Completado (evidencia en código + gates)

- Home = `/comando` (`command-center-home` gate)
- Login gateway M3 + sesión expirada + sin acceso
- Command registry único (~26 intents, phrase suite 50)
- Form registry único (**19** blueprints)
- `GeneratedClinicalFormPage` + borradores + aprobación humana
- TanStack Query en web (hooks, mutations)
- M3 tema MTB (6 perfiles), `theme:validate`
- Tableros modo secundario (`/epis2/dashboard`) + flatten UX-C
- Tramos clínicos A–K (scaffolds, E2E por tramo)
- PostgreSQL SoT, 32 migraciones
- Sin imports `@mui/*` en `apps/web`
- Storybook UI (12 stories, build OK)

### Parcialmente completado

- **Command Engine CE-0→CE-5** — código + E2E `ux-g02`; sin commit
- **Centro de Comando wire híbrido** — hero + dock + registry cards
- **Ficha paciente** — split compact; widgets bajo demanda
- **Bandeja resultados** — plana UX-C; journey Ola 1C
- **IA assist route** — API + local-ai; evals tramo J/K
- **Impresión** — certificado A5; no suite documentos completa
- **MAR / órdenes / lab / imagen** — forms + API; UI operativa demo
- **WIDGET-01** — reglas visibilidad; montaje limitado en comando
- **OIDC producción** — staging doc only (`docs/ops/OIDC_STAGING.md`)
- **IDC matriz 1–200** — ~3,5% Done (audit reconcile)

### Pendiente (canon/roadmap)

- Historial comandos persistente
- Comparación versiones borrador en UI
- UX-G04 rail ≤5 destinos definitivo
- Vitest 4.x upgrade (GHSA dev)
- Signoff clínico institucional formal
- RLS enforce total producción

### No iniciado / fuera MVP

- OpenMRS UI (prohibido — `NON_GOALS.md`)
- Dashboard como home (prohibido)
- PHI real en entornos dev

### Obsoleto / legacy (contenido acotado)

- `migration/candidates/*` — donantes EPIS/EPIONE/EPIDOS (no productivo)
- `reports/epis2-audit-reconcile-2026-06-07.md` — marcado SUPERSEDED
- `docs/ROADMAP.md` — histórico; usar `EPIS2_COMPLETION_ROADMAP.md`

---

## 1. Estado Git

| Item | Valor |
|------|-------|
| Rama actual | `master` |
| Remotas | `origin/master` |
| Ahead/behind origin | **0 / 0** (sincronizado en commits) |
| Working tree | **188 entradas** (98 modified + 90 untracked) |
| Último commit | `8918ea0` feat(signoff): TRAMOS-AK-SIGNOFF-PREP |
| Tags recientes | `TRAMOS-AK-SIGNOFF-PREP`, `QUERY-STORYBOOK-FOUNDATION` |
| Push pendiente | **No** (pero **todo el arco UX/CE es local sin commit**) |

### Commits recientes (historia)

Tramos A–K cerrados en serie (MF-TRAMO-*), luego QUERY-STORYBOOK-FOUNDATION y TRAMOS-AK-SIGNOFF-PREP. La **ola UX command-first posterior no está en git**.

### Archivos críticos sin trackear (muestra)

- `EpisCommandCenterHero.tsx`, `EpisFloatingCommandDock.tsx`, `EpisClinicalFormActionBar.tsx`
- `useClinicalCommandSubmit.ts`, `resolveWithAssist.ts`, `commandRoute.ts`
- E2E: `ux-g02-command-first.spec.ts`, `login-gateway.spec.ts`
- Gates: `validate-ux-pilot-gate.mjs`, `run-ux-g02-validation.ts`
- ~30 reportes `epis2-vista*`, `epis2-ce*`, `epis2-ux-*`

**Riesgo P0:** un reset o fallo de disco borra semanas de producto UX.

---

## 2. Estado del monorepo

### Workspaces

| Tipo | Paquetes |
|------|----------|
| apps | `@epis2/web`, `@epis2/api` |
| packages | contracts, clinical-domain, design-system, command-registry, clinical-forms, epis2-ui, epis2-widgets, test-fixtures, fhir-export |
| services | local-ai |

### Scripts clave (raíz)

- **Calidad:** `check`, `test`, `db:validate`, `architecture:validate`, `theme:validate`
- **UX piloto:** `quality:ux-g02`, `quality:ux-pilot`, `quality:ux-pilot-gate`
- **Tramos:** 40+ gates `quality:tramo-*`
- **IA:** `ai:smoke`, `ai:evals`, `ai:evals:tramo-j/k`
- **Storybook:** `storybook:ui`, `storybook:ui:build`

### Imports prohibidos

- `@mui/*` en `apps/web`: **0 ocurrencias** ✅
- OpenMRS/Carbon deps: gate `no-legacy-dependencies` ✅

### Dependencias

- React 19.1 override monorepo
- MUI vía `epis2-ui` únicamente
- **No auditado:** `npm audit`, duplicados profundos en lockfile (No verificado)

---

## 3. Estado de arquitectura

| Invariante | Estado | Gate / evidencia |
|------------|--------|------------------|
| Home = Comando | OK | `command-center-home` |
| Registry comando único | OK | `single-command-registry` |
| Registry formularios único | OK | `single-form-registry` |
| Tema único M3 | OK | `single-epis2-theme`, `createEpis2Theme` |
| MUI solo epis2-ui | OK | `no-direct-mui-imports` |
| IA no escribe SoT | OK | `ai-write-boundary` |
| Aprobación humana | OK | `human-approval-required` |
| FHIR solo API | OK | `fhir-export-boundary` |
| LAYOUT-G12 | Parcial | Gate shell; admin Paper fuera |
| Widget registry único | OK | `single-widget-registry` |

**Frase Command Engine:** *IA interpreta · Registry autoriza · Usuario confirma · EPIS2 ejecuta* — implementada en `resolveWithAssist`, `CommandConfirmationDialog`, `EpisClinicalFormActionBar`.

---

## 4. Estado funcional

| Capacidad | Estado | Notas |
|-----------|--------|-------|
| Centro de Comando | **OK** | Hero híbrido + bento + dock |
| Power Bar | **OK** | `EpisFloatingCommandDock` compact |
| CE-0 resolve | **OK** | rank + phrase suite 50 |
| CE-1 assist | **Parcial** | assist route API/local-ai |
| CE-2 confirmación | **OK** | dialog + E2E |
| CE-3b slot prefill | **OK** | imaging TAC |
| CE-4 context prefill | **OK** | evolución SOAP |
| CE-5 badge + URL | **OK** | E2E UX-G02 |
| Ficha paciente | **OK** | `PatientWorkspacePage` split |
| Formularios clínicos | **OK** | 19 blueprints |
| Borradores | **OK** | API + review page |
| Aprobación humana | **OK** | no auto-approve |
| Órdenes/lab/imagen | **Parcial** | forms + ack API demo |
| Farmacia | **Parcial** | validation blueprint + tramo J |
| MAR | **Parcial** | form + schedule migration |
| Interconsultas | **OK** | referral blueprint |
| Epicrisis | **OK** | discharge blueprint |
| Impresión Carta/A5 | **Parcial** | medical certificate + print E2E |
| Dashboard/tableros | **OK** | secundario, 11+ tabs |
| IA local | **Parcial** | Ollama optional; copy sin “Ollama” en es.ts |
| OpenMRS | **Bloqueado** | NON_GOALS |
| FHIR/HL7 | **Parcial** | export pkg; HL7 quarantine staging |

---

## 5. Estado UX/UI

| Tema | Estado |
|------|--------|
| M3 tokens MTB | OK |
| Cajas anidadas clínico | OK (EpisWorkspaceSection, flatten dashboards) |
| Admin/dev Paper outlined | Riesgo (9 en AdminConsole + BlueprintStudio) |
| Power Bar | OK — dock inferior |
| AppBar global | OK — `ClinicalGlobalTopBar` |
| Rail | Parcial — oculto en comando; >5 destinos en registry nav |
| Mockup A vs real | Parcial — sin panel derecho fijo (correcto canon) |
| Storybook | Parcial — 12 stories; sin hero/suggestion cards |

Auditoría M3 previa: [`epis2-m3-material-io-audit-2026-06-04.md`](./epis2-m3-material-io-audit-2026-06-04.md)

---

## 6. Estado datos demo

| Item | Estado |
|------|--------|
| Casos DEMO-001…005 | OK — `demoCases.ts` |
| Narrativas demo | OK — `demoNarratives.ts` (IAM, etc.) |
| Seeds DB | OK — migraciones 004, 006, 018… |
| Badge DEMO/SINTÉTICO | OK |
| IDs técnicos en UI | Parcial — chips DEMO visibles (intencional demo) |
| PHI real | Bloqueado — validación en fixtures |

---

## 7. Tests y gates

### Ejecutado 2026-06-04

```
check              OK
test               511 passed (190 files)
db:validate        OK (32 migrations)
storybook:ui:build OK
architecture:validate OK (17 gates)
```

### No verificado esta sesión

- `quality:golden-journey`
- `quality:ux-pilot` (compuesto)
- `quality:m3-human-pilot`
- E2E full suite (24 specs)
- `npm audit`

### CE-0→CE-5 cobertura

| CE | Tests |
|----|-------|
| CE-0 | `clinical-phrase-suite-50.test.ts`, rank tests |
| CE-1 | `assist-route.test.ts`, API resolve |
| CE-2 | `confirmation.test.ts`, E2E UX-G02 A/C |
| CE-3b | `command-slot-prefill.test.ts`, E2E imaging |
| CE-4 | `context-clinical-prefill.test.ts`, E2E B |
| CE-5 | E2E badge + URL poll |

### Skipped / débil

- Integration tests via `describeIntegration` skip cuando no hay DB
- Storybook sin tests visuales automatizados de regresión

---

## 8. Archivos truncados / sospechosos

| Hallazgo | Severidad |
|----------|-----------|
| TODO/FIXME en código productivo | **Bajo** — casi solo scripts/stories |
| `migration/candidates/lyra/` untracked | **Medio** — alcance no manifestado |
| `packages/command-registry/src/telemetry.ts` untracked | **Medio** — verificar barrel export |
| EPIONE/EPIDOS en `migration/candidates/` | **OK** — acotado, no runtime |
| Contradicción tests 405 vs 511 | **Alto** — docs desactualizados |
| `EPIS2_COMPLETION_ROADMAP` sesión expirada ○ | **Medio** — ya implementada |

**No detectado:** rutas rotas en `router.test.ts` (pasa); exports huérfanos masivos (No verificado exhaustivo).

---

## 9. Consolidación documental

| Fuente | Rol | Estado |
|--------|-----|--------|
| `docs/PRODUCT_CANON.md` | SoT producto | **Vigente** |
| `docs/product/PRODUCT_INVARIANTS.md` | Gates producto | **Vigente** |
| `docs/product/EPIS2_WAVE_EXECUTION_CANON.md` | Ejecución | **Vigente** |
| `docs/product/EPIS2_COMPLETION_ROADMAP.md` | Roadmap | **Parcial** — 405 tests, pendientes UX |
| `reports/` (224 archivos) | Evidencia sesiones | **Riesgo** — duplicación, fechas mixtas |
| `EPIS2_TRAMOS_HYGIENE.md` | Supersede audit reconcile | **Vigente** |

**Contradicción citada:**

- `reports/epis2-audit-reconcile-2026-06-07.md` L18: «405 tests» vs realidad **511** (2026-06-04).
- `docs/product/EPIS2_COMPLETION_ROADMAP.md` L8: «405 tests» vs **511**.
- `EPIS2_COMPLETION_ROADMAP.md` L51–52: sesión expirada ○ — código tiene `SessionExpiredPage.tsx` + E2E login-gateway.

---

## 10. Seguridad clínica y gobernanza

| Control | Estado |
|---------|--------|
| Confirmación explícita órdenes | OK — CE-2 |
| Borrador ≠ aprobado | OK — invariantes + API |
| IA no firma | OK — action bar Guardar/Firmar humano |
| Badge prefill | OK — CE-5 |
| Permisos por rol | OK — `explicit-permissions` gate |
| Telemetría | Parcial — `telemetry.ts` untracked; subpath separado |
| PHI en logs | No verificado runtime |
| Acciones destructivas | Parcial — confirmación en commands; no audit exhaustivo UI |

---

## D. Lista de errores/gaps

### P0 — Crítico

| ID | Gap |
|----|-----|
| P0-1 | ~188 archivos sin commit (arco UX + CE completo) |
| P0-2 | Imposible revisión PR / rollback del arco command-first |

### P1 — Alto

| ID | Gap |
|----|-----|
| P1-1 | Documentación tests 405 vs 511 |
| P1-2 | Roadmap pendientes ya implementados (auth-adjacent, comando) |
| P1-3 | `quality:golden-journey` no verificado en auditoría |
| P1-4 | Producción: OIDC, RLS total, dominios vacíos IDC |
| P1-5 | Storybook desactualizado vs wire híbrido |

### P2 — Medio

| ID | Gap |
|----|-----|
| P2-1 | Admin Paper outlined (LAYOUT-G12) |
| P2-2 | UX-G04 rail >5 destinos |
| P2-3 | WIDGET-01 montaje limitado |
| P2-4 | Historial comandos ausente |
| P2-5 | `migration/candidates/lyra/` sin manifiesto legacy |
| P2-6 | 224 reportes — deuda documental |

### P3 — Bajo

| ID | Gap |
|----|-----|
| P3-1 | Vitest 4.x pendiente |
| P3-2 | Storybook chunk >500kB |
| P3-3 | EpisButton tonal M3 (remediado en sesión M3 audit) |
| P3-4 | Comparación versiones borrador UI |

---

## E. Ramas e historia

- **Una rama activa:** `master` = `origin/master` en commits.
- **Decisión histórica clave:** Tramos A–K como unidades de cierre MF; signoff prep en `8918ea0`.
- **Divergencia actual:** working tree masivo **no reflejado** en historia git.
- **Tags:** marcan hitos tramo/signoff, no arco UX 2026-06.

---

## F. Backlog consolidado

Ver [`epis2-backlog-consolidated-2026-06-04.md`](./epis2-backlog-consolidated-2026-06-04.md).

---

## G. Recomendación estratégica

**Prioridad: estabilizar + preparar piloto** — no expandir Ola 2 funcional hasta consolidar git y docs.

Secuencia sugerida:

1. Commit atómico arco UX/CE (o PRs: registry → UI → E2E → reports).
2. Actualizar `EPIS2_COMPLETION_ROADMAP.md` (511 tests, milestones 1A–1D).
3. `quality:golden-journey` + `quality:ux-pilot` en pipeline pre-piloto.
4. Signoff humano `PILOT_DEMO_CHECKLIST.md`.
5. **Después** Ola 2 ingreso/consulta ambulatoria.

---

## H. Archivos generados

- [`epis2-general-audit-summary-2026-06-04.md`](./epis2-general-audit-summary-2026-06-04.md)
- [`epis2-backlog-consolidated-2026-06-04.md`](./epis2-backlog-consolidated-2026-06-04.md)
- Este documento

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
