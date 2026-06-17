# Auditoría profunda II — Inventario, gestión documental, limpieza y fortalecimiento

**Fecha:** 2026-06-09 · **HEAD:** `7f4c96b` · **Alcance:** auditoría read-only (sin cambios de código)
**Complementa:** [`epis2-auditoria-profunda-2026-06-09.md`](./epis2-auditoria-profunda-2026-06-09.md) (fases 1–4 ejecutadas)

---

## 1. Inventario de objetos del sistema

| Dominio | Cantidad | Detalle |
|---|---:|---|
| Workspaces npm | 13 | 10 packages + apps/web + apps/api + services/local-ai |
| Componentes UI (`epis2-ui`) | 77 | primitives 16 · clinical 15 · forms 9 · command 8 · widgets 7 · providers 5 · resto 17 |
| Páginas web | 21 | 15 producto + 3 print + 3 dev |
| Rutas TanStack | 38 | 27 bajo `/espacio/*` (shell clínico) |
| Blueprints clínicos | 20 | registry único en `@epis2/clinical-forms` |
| Endpoints API | ~67 | 11 módulos de rutas + health/ready/meta |
| Tablas PostgreSQL | 26 | Drizzle `schema.ts`, SoT única |
| Migraciones SQL | 33 | `database/migrations/` + tabla control `epis2_schema_migrations` |
| Quality gates | ~168 | `scripts/quality/validate-*.mjs` |
| Scripts npm raíz | 245 | quality ~168 · e2e 25 · dev 14 · ai 10 · resto |
| Tests vitest | ~201 archivos | 660 tests · apps/web 67 · epis2-ui 44 · api 28 |
| Specs E2E | 29 | golden ×3 · tramos A–K · print ×3 · modos |
| Storybook stories | 12 | `packages/epis2-ui/src/stories/` |

**Lectura:** los invariantes estructurales se cumplen — un solo registry de comandos, un solo registry de blueprints, home = Centro de Comando, PostgreSQL SoT. La desproporción notable es **168 gates para ~201 archivos de test**: el sistema de gates creció más rápido que el producto (ver §4.3).

---

## 2. Gestión documental de planes de desarrollo

### 2.1 Censo

| Área | `.md` | Estado |
|---|---:|---|
| `docs/` | 151 | product 64 · design 29 · quality 13 · resto 45 |
| `reports/` | 304 | crecimiento sin política de archivado |

### 2.2 Jerarquía vigente (sana)

`PRODUCT_CANON` + `PRODUCT_INVARIANTS` → **`EPIS2_TABLERO.md`** (vivo) → `EPIS2_GLOBAL_DEV_PLAN` → `EPIS2_WAVE_EXECUTION_CANON` → `microphase-ledger.json` (cerrado). El tablero y el plan global están alineados al 2026-06-09.

### 2.3 Problemas detectados

| # | Problema | Evidencia | Severidad |
|---|---|---|---|
| D1 | **`reports/dev-agent-brief.md` contradice el tablero** — dice «Fase B · Tramo J» cuando el hilo activo es C; lo consumen los agentes en cada arranque de sesión | generado hoy, desalineado | **Alta** |
| D2 | Norma de impresión dice «sin implementación productiva» pero ya existen `PrintA5Document`, `PrintLetterDocument`, 3 rutas print y 3 E2E en CI | `EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md` §29 | Alta |
| D3 | 4 taxonomías de fases conviven (EPIS2-NN / Olas / V0–V5 / Hilos); docs pre-SDEPIS2 mezclan «Fase B» con «Hilo B» | `EPIS2_RELEASE_ROADMAP.md`, `EPIS2_COMPLETE_CAPABILITY_MAP.md` | Media |
| D4 | `EPIS2_WAVE_EXECUTION_CANON.md` §3/§14 congelado al 2026-06-04 (THREE-MODES «Ready» cuando está DONE) | snapshot sin refrescar | Media |
| D5 | ~12–15 docs huérfanos sin referencias inbound (`EPIS2_THEME_ARCHITECTURE.md`, `EPIS2_CLINICAL_COLOR_ROLES.md`, etc.) | grep de nombres | Media |
| D6 | 304 reportes sin índice ni archivado; ~95 % no referenciados desde el tablero | sin `reports/INDEX.md` | Media |
| D7 | Canon duplicado: `reports/epis2-wave-execution-canon-v1.md` (snapshot viejo) coexiste con el doc canónico en `docs/product/` | duplicado obsoleto | Baja |

### 2.4 Plan documental propuesto (sesión dedicada, sin tocar código)

1. **Sync `dev-agent-brief`**: el generador de `dev:session` debe leer hilo activo desde `EPIS2_TABLERO.md` (corrige D1, el de mayor impacto operativo).
2. **Actualizar norma de impresión** a «implementación parcial» con matriz hecho/pendiente (D2).
3. **Refrescar `EPIS2_WAVE_EXECUTION_CANON.md` §3/§14** y poner banner «histórico — taxonomía deprecada» en `RELEASE_ROADMAP` y `CAPABILITY_MAP` (D3, D4).
4. **Crear `docs/INDEX.md`** con niveles L0 canon / L1 vivo / L2 arquitectura / L3 cerrado, y **`reports/INDEX.md`** + carpeta `reports/archive/YYYY-MM/` con retención 60–90 días (D5, D6).
5. **Ciclo de vida explícito** en frontmatter: `status: draft|active|closed|archived` + `updated:` (previene recurrencia).

---

## 3. Limpieza del árbol (verificada)

### 3.1 Código muerto — con matiz importante

| Objeto | Estado runtime | Matiz |
|---|---|---|
| `apps/web/src/components/CommandCenterMinimalBlocks.tsx` | 0 importadores | **Anclado por gate** `validate-command-center-layout-gate.mjs` — borrar exige actualizar el gate |
| `apps/web/src/components/command/EpisCommandBarContextual.tsx` | 0 importadores | Anclado por `validate-m3-scaffold-gate.mjs` |
| `packages/epis2-ui/src/command/EpisCommandMetaChips.tsx` | solo export en index | Anclado por gates layout/scaffold |
| `scripts/migrate-web-mui-imports.mjs` | 0 referencias en repo | One-off de migración MUI ya ejecutada — borrable directo |
| Clave copy `powerBarNaturalPlaceholder` | 0 usos | Duplica `powerBarPlaceholder` — borrable directo |
| Export `formatSafetyWarningsForAssist` (`clinical-domain`) | sin consumo externo | Revisar antes de borrar (API pública del paquete) |

**Hallazgo estructural:** existen gates que validan la *presencia* de componentes que ya nadie monta. El sistema de gates protege código muerto. Toda limpieza debe ir en pareja **componente + gate**, nunca el componente solo (el gate fallaría y bloquearía `check`).

### 3.2 Duplicación a extraer

| Patrón | Ocurrencias | Acción |
|---|---|---|
| Páginas `*PrintPage` (search + fetch detail + toolbar no-print) | 3 × ~85 líneas | Extraer `usePrintPagePatient()` + `PrintPageToolbar` **antes** de añadir lab/imagen A5 (evita 5.ª copia) |
| `vi.mock('@tanstack/react-router')` en tests | 19 archivos | Fixture compartido `apps/web/src/test/routerMock.ts` |
| Mocks print tests (auth + clinicalApi) | 3 idénticos | Mismo fixture |
| Dashboard tabs IDC (`EpisMetric` + secciones) | 10+ tabs, 177–394 líneas | Scaffold intencional de tramos — no tocar hasta que un tramo evolucione de verdad |

### 3.3 Higiene de árbol y config

- Working tree **limpio** (0 untracked); `dist/` correctamente ignorado — el árbol git está sano.
- `apps/web/tsconfig.json` **no extiende `tsconfig.base.json`** → la app no aplica `exactOptionalPropertyTypes` ni `noUncheckedIndexedAccess` que sí rigen en packages. Deriva de strictness real (media).
- Divergencias menores: `vite` 6.3.5 vs 6.4.3, `@vitejs/plugin-react` 4.5 vs 4.7; `*.tsbuildinfo` no listado en `.gitignore` (preventivo).
- Colisión de nombres: `EpisTopAppBar` existe en `epis2-ui/primitives` **y** en `apps/web/components/layout` — renombrar el wrapper de app (p. ej. `AppTopBar`).

### 3.4 Errores latentes

- **0** TODO/FIXME/HACK en `src/`, **0** `console.log` en producción, **0** `.only` olvidados, **0** catch vacíos — higiene excepcional.
- Patrón repetido `.catch(() => setError(generic))` en 3 print pages + 4 fetches de `AdminConsolePage`: traga el error original y dificulta debug. Mitigación barata: helper `reportUiError(err)` con `console.debug` solo en dev.

---

## 4. Plan de fortalecimiento (priorizado)

### F1 — Limpieza pareada código+gate (1 sesión, riesgo bajo)

1. Borrar `CommandCenterMinimalBlocks` + actualizar `validate-command-center-layout-gate.mjs`.
2. Borrar `EpisCommandBarContextual` y `EpisCommandMetaChips` + actualizar `validate-m3-scaffold-gate.mjs` (o conectarlos si tienen futuro declarado en algún plan — verificar tablero antes).
3. Borrar `scripts/migrate-web-mui-imports.mjs` y clave `powerBarNaturalPlaceholder`.
4. Gates: `npm run check` + suite.

### F2 — Refactor print previo a más A5 (1 sesión)

1. Extraer `usePrintPagePatient` + `PrintPageToolbar`.
2. Migrar las 3 páginas existentes.
3. Implementar `lab_request` / `imaging_request` A5 sobre la abstracción (cierra PEND-006 código).

### F3 — Endurecimiento config (media sesión)

1. `apps/web/tsconfig.json` extiende base (puede aflorar errores de tipos — presupuestar arreglos).
2. Alinear `vite`/`plugin-react`; añadir `*.tsbuildinfo` a `.gitignore`.
3. Fixture compartido de router mock (19 tests).

### F4 — Sesión documental (sin código)

Ejecutar §2.4. El ítem 1 (`dev-agent-brief` sync) es el de mayor retorno: corrige el contexto que consumen los agentes IA cada día.

### F5 — Gobernanza de gates (reflexión, no urgente)

168 gates es un activo, pero ya mostró su costo: ancla código muerto y cada refactor exige tocar gates (pasó 2 veces en fases 3–4). Propuesta: clasificar gates en `invariant` (nunca borrar) vs `scaffold` (caducan al cerrar el tramo) y retirar los scaffold de tramos cerrados del path de `check`.

---

## 5. ¿Vale la pena incluir templates visuales?

**Sí, pero solo como extensión del sistema existente — no como librería nueva.**

| Opción | Veredicto | Razón |
|---|---|---|
| **Ampliar Storybook** (hoy 12 stories / 77 componentes) | **Sí — mayor retorno** | Ya está montado y pagado. Priorizar: primitivas `Print*` (revisión visual humana que la norma §27 exige), `EpisCommandCenterLayout`, estados clínicos (`EpisDraftStatus`, `EpisApprovalGate` ya tienen). Sirve como baseline de regresión visual |
| **Templates de documentos imprimibles** | **Ya los tienes** | `PrintA5Document` / `PrintLetterDocument` + secciones *son* el sistema de plantillas que la norma §21 pedía. Lo correcto es completar la familia (lab/imagen) sobre esas primitivas, no introducir un motor de templates aparte |
| **Catálogo visual interno** | **Ya existe** | `/dev/ui-catalog` + `/desarrollo/catalogo-visual` + piloto M3 automatizado (V1–V6 screenshots). Mantener, no duplicar |
| **Figma / Material Theme Builder pipeline** | **No por ahora** | El tema ya se genera por tokens (`theme:generate`); un pipeline de diseño externo añade fricción sin usuarios de diseño dedicados. Reevaluar si entra un diseñador al equipo |
| **Librería de templates de terceros** (admin templates, niceties) | **No** | Violaría la frontera anti-drift M3 (gates M3-G11, imports `@mui/*` prohibidos en apps/web) y el postmortem EPIS (overlays prohibidos) |

**Recomendación concreta:** añadir ~8–10 stories (familia `Print*`, layouts de Centro de Comando, formularios RHF) y un E2E de captura visual para documentos print en gris (norma §26: validación en escala de grises) — todo dentro de la infraestructura actual.

---

## 6. Gates de esta sesión

| Gate | Estado |
|---|---|
| `npm run check` | ✓ (corrido hoy, HEAD `7f4c96b`) |
| `npm run test` | ✓ 660 tests |
| `npm run db:validate` | ✓ 33 migraciones |
| Cambios de código en esta auditoría | **Ninguno** (solo este reporte) |

## 7. Riesgos si no se actúa

1. **D1 (brief desalineado)** degrada cada sesión asistida por IA — contexto erróneo sistemático.
2. La 4.ª y 5.ª página print copiarán el patrón duplicado (F2 se encarece con cada A5 nuevo).
3. Gates scaffold seguirán anclando código muerto y encareciendo refactors.
4. `reports/` llegará a ~400 archivos en semanas al ritmo actual (17 solo hoy).

## 8. Próximo paso exacto

Ejecutar **F1 + F2 juntas** (limpieza pareada + refactor print + lab/imagen A5) como una sesión: cierra PEND-006 código y elimina la deuda de duplicación en el mismo movimiento. Después F4 (documental).
